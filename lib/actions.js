"use server";

import db from "./db";

/** Users */
export async function getUserByUsername(username) {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE username = ? LIMIT 1",
    [username]
  );
  return rows.length ? rows[0] : null;
}

export async function getUserById(id) {
  const [rows] = await db.execute("SELECT * FROM users WHERE id = ? LIMIT 1", [
    id,
  ]);
  return rows.length ? rows[0] : null;
}

export async function createUser({
  username,
  passwordHash,
  full_name,
  role = "siswa",
  class_grade = null,
}) {
  try {
    const [result] = await db.execute(
      "INSERT INTO users (username, password, full_name, role, class_grade) VALUES (?, ?, ?, ?, ?)",
      [username, passwordHash, full_name, role, class_grade]
    );
    return result.insertId;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Username sudah digunakan");
    }
    throw error;
  }
}

/** Books */
export async function getAllBooks(limit = 100) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 1000));
  const [rows] = await db.execute(
    `SELECT * FROM books ORDER BY id DESC LIMIT ${safeLimit}`
  );
  return rows;
}

export async function getBookById(id) {
  const [rows] = await db.execute("SELECT * FROM books WHERE id = ? LIMIT 1", [
    Number(id),
  ]);
  return rows.length ? rows[0] : null;
}

export async function insertBook({
  title,
  author,
  publisher,
  publication_year,
  genre,
  description = null,
  image = null,
  stock = 10,
}) {
  const [res] = await db.execute(
    "INSERT INTO books (title, author, publisher, publication_year, genre, description, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      title,
      author,
      publisher,
      Number(publication_year),
      genre,
      description || null,
      image || null,
      Number(stock),
    ]
  );
  return res.insertId;
}

export async function updateBookById(
  id,
  {
    title,
    author,
    publisher,
    publication_year,
    genre,
    description = null,
    image = null,
    stock = 10,
  }
) {
  await db.execute(
    "UPDATE books SET title = ?, author = ?, publisher = ?, publication_year = ?, genre = ?, description = ?, image = ?, stock = ? WHERE id = ?",
    [
      title,
      author,
      publisher,
      Number(publication_year),
      genre,
      description || null,
      image || null,
      Number(stock),
      Number(id),
    ]
  );
}

export async function deleteBookById(id) {
  await db.execute("DELETE FROM books WHERE id = ?", [Number(id)]);
}

/** Loans */
export async function getAllLoans() {
  const [rows] = await db.execute(
    `SELECT l.*, u.full_name AS user_name, b.title AS book_title
     FROM loans l
     JOIN users u ON l.user_id = u.id
     JOIN books b ON l.book_id = b.id
     ORDER BY l.loan_date DESC`
  );
  return rows;
}

export async function getLoans(userId) {
  const [rows] = await db.execute(
    `SELECT l.*, b.title AS book_title, b.author, b.image AS book_image
     FROM loans l
     JOIN books b ON l.book_id = b.id
     WHERE l.user_id = ?
     ORDER BY l.loan_date DESC`,
    [Number(userId)]
  );
  return rows;
}

export async function createLoan({ userId, bookId, loanDate, dueDate }) {
  try {
    // Check if book has stock
    const [bookRows] = await db.execute(
      "SELECT stock, title FROM books WHERE id = ?",
      [Number(bookId)]
    );

    if (!bookRows.length || bookRows[0].stock <= 0) {
      throw new Error("Stok buku tidak tersedia");
    }

    const bookTitle = bookRows[0].title;

    // Insert loan record with status 'pending' (waiting for admin approval)
    const [result] = await db.execute(
      "INSERT INTO loans (user_id, book_id, loan_date, due_date, status) VALUES (?, ?, ?, ?, ?)",
      [Number(userId), Number(bookId), loanDate, dueDate, "pending"]
    );

    const loanId = result.insertId;

    // Don't decrease stock yet - wait for admin approval
    // Stock will decrease when admin approves the loan

    // Create notification for user
    await createNotification({
      userId: Number(userId),
      type: "info",
      title: "Permintaan peminjaman dikirim",
      message: `Permintaan Anda untuk meminjam buku "${bookTitle}" menunggu persetujuan admin.`,
      relatedLoanId: loanId,
    });

    return loanId;
  } catch (error) {
    throw error;
  }
}

/** Notifications */
export async function createNotification({
  userId,
  type = "info",
  title,
  message,
  relatedLoanId = null,
}) {
  const [result] = await db.execute(
    "INSERT INTO notifications (user_id, type, title, message, related_loan_id) VALUES (?, ?, ?, ?, ?)",
    [
      Number(userId),
      type,
      title,
      message,
      relatedLoanId ? Number(relatedLoanId) : null,
    ]
  );
  return result.insertId;
}

export async function getNotifications(userId) {
  const [rows] = await db.execute(
    `SELECT * FROM notifications 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT 50`,
    [Number(userId)]
  );
  return rows;
}

export async function markNotificationAsRead(notificationId) {
  await db.execute("UPDATE notifications SET read_status = TRUE WHERE id = ?", [
    Number(notificationId),
  ]);
}

export async function markAllNotificationsAsRead(userId) {
  await db.execute(
    "UPDATE notifications SET read_status = TRUE WHERE user_id = ?",
    [Number(userId)]
  );
}

/** Loan Approval (for Admin) */
export async function approveLoan(loanId) {
  try {
    // Update loan status to 'dipinjam'
    await db.execute("UPDATE loans SET status = 'dipinjam' WHERE id = ?", [
      Number(loanId),
    ]);

    // Get loan details
    const [loanRows] = await db.execute(
      `SELECT l.user_id, b.title 
       FROM loans l 
       JOIN books b ON l.book_id = b.id 
       WHERE l.id = ?`,
      [Number(loanId)]
    );

    if (loanRows.length > 0) {
      const { user_id, title } = loanRows[0];

      // Create notification for user
      await createNotification({
        userId: user_id,
        type: "success",
        title: "Peminjaman disetujui",
        message: `Peminjaman buku "${title}" telah disetujui. Anda dapat mengambil buku di perpustakaan.`,
        relatedLoanId: Number(loanId),
      });
    }

    return true;
  } catch (error) {
    throw error;
  }
}

export async function rejectLoan(loanId, reason = "Stok tidak tersedia") {
  try {
    // Get loan details before deleting
    const [loanRows] = await db.execute(
      `SELECT l.user_id, l.book_id, b.title 
       FROM loans l 
       JOIN books b ON l.book_id = b.id 
       WHERE l.id = ?`,
      [Number(loanId)]
    );

    if (loanRows.length > 0) {
      const { user_id, book_id, title } = loanRows[0];

      // Return book stock
      await db.execute("UPDATE books SET stock = stock + 1 WHERE id = ?", [
        book_id,
      ]);

      // Delete loan request
      await db.execute("DELETE FROM loans WHERE id = ?", [Number(loanId)]);

      // Create notification for user
      await createNotification({
        userId: user_id,
        type: "error",
        title: "Peminjaman ditolak",
        message: `Permintaan peminjaman buku "${title}" ditolak. Alasan: ${reason}`,
        relatedLoanId: null,
      });
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/** SERVER ACTIONS (Merged from server-actions.js) */

/** server action untuk menambah buku */
export async function actionAddBook(formData) {
  const title = formData.get("title");
  const author = formData.get("author");
  const publisher = formData.get("publisher");
  const publication_year = formData.get("publication_year");
  const genre = formData.get("genre");
  const description = formData.get("description") || null;
  const image = formData.get("image") || null;
  const stock = formData.get("stock") || 10;

  if (!title || !author || !publisher || !publication_year || !genre)
    throw new Error("title/author/publisher/publication_year/genre required");

  return await insertBook({
    title,
    author,
    publisher,
    publication_year: Number(publication_year),
    genre,
    description,
    image,
    stock: Number(stock),
  });
}

/** server action untuk update */
export async function actionUpdateBook(id, formData) {
  const title = formData.get("title");
  const author = formData.get("author");
  const publisher = formData.get("publisher");
  const publication_year = formData.get("publication_year");
  const genre = formData.get("genre");
  const description = formData.get("description") || null;
  const image = formData.get("image") || null;
  const stock = formData.get("stock") || 10;

  if (!title || !author || !publisher || !publication_year || !genre)
    throw new Error("title/author/publisher/publication_year/genre required");

  await updateBookById(id, {
    title,
    author,
    publisher,
    publication_year: Number(publication_year),
    genre,
    description,
    image,
    stock: Number(stock),
  });
}

/** server action untuk delete */
export async function actionDeleteBook(id) {
  await deleteBookById(id);
}

/** fetch all books */
export async function fetchBooks(search = "") {
  const books = await getAllBooks();
  if (!search) return books;
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );
}
