"use server";

import db from "./db";

/** ============================================================================
 * USERS FUNCTIONS
 * ============================================================================ */

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
  email = null,
  phone = null,
}) {
  try {
    const [result] = await db.execute(
      "INSERT INTO users (username, password, full_name, role, class_grade, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [username, passwordHash, full_name, role, class_grade, email, phone]
    );
    return result.insertId;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Username atau email sudah digunakan");
    }
    throw error;
  }
}

export async function updateUserProfile(
  userId,
  { full_name, email, phone, profile_picture, class_grade }
) {
  try {
    await db.execute(
      "UPDATE users SET full_name = ?, email = ?, phone = ?, profile_picture = ?, class_grade = ?, updated_at = NOW() WHERE id = ?",
      [full_name, email, phone, profile_picture, class_grade, userId]
    );
    return true;
  } catch (error) {
    throw error;
  }
}

export async function updateUserLastLogin(userId) {
  await db.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [
    userId,
  ]);
}

export async function deactivateUser(userId) {
  await db.execute("UPDATE users SET is_active = FALSE WHERE id = ?", [userId]);
}

/** ============================================================================
 * BOOKS FUNCTIONS
 * ============================================================================ */

export async function getAllBooks(limit = 100) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 1000));
  const [rows] = await db.execute(
    `SELECT b.*, c.name as category_name
     FROM books b
     LEFT JOIN categories c ON b.category_id = c.id
     ORDER BY b.id DESC LIMIT ${safeLimit}`
  );
  return rows;
}

export async function getBookById(id) {
  const [rows] = await db.execute(
    `SELECT b.*, c.name as category_name
     FROM books b
     LEFT JOIN categories c ON b.category_id = c.id
     WHERE b.id = ? LIMIT 1`,
    [Number(id)]
  );
  return rows.length ? rows[0] : null;
}

export async function getBooksByCategory(categoryId, limit = 100) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 1000));
  const [rows] = await db.execute(
    `SELECT b.*, c.name as category_name
     FROM books b
     LEFT JOIN categories c ON b.category_id = c.id
     WHERE b.category_id = ?
     ORDER BY b.id DESC LIMIT ${safeLimit}`,
    [Number(categoryId)]
  );
  return rows;
}

export async function insertBook({
  title,
  author,
  publisher,
  publication_year,
  genre,
  category_id = null,
  description = null,
  image = null,
  stock = 10,
}) {
  // Jika category_id tidak ada, cari berdasarkan genre
  let finalCategoryId = category_id;
  if (!finalCategoryId && genre) {
    const [catRows] = await db.execute(
      "SELECT id FROM categories WHERE name = ? LIMIT 1",
      [genre]
    );
    if (catRows.length) {
      finalCategoryId = catRows[0].id;
    }
  }

  const [res] = await db.execute(
    "INSERT INTO books (title, author, publisher, publication_year, genre, category_id, description, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      title,
      author,
      publisher,
      Number(publication_year),
      genre,
      finalCategoryId,
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
    category_id = null,
    description = null,
    image = null,
    stock = 10,
  }
) {
  // Jika category_id tidak ada, cari berdasarkan genre
  let finalCategoryId = category_id;
  if (!finalCategoryId && genre) {
    const [catRows] = await db.execute(
      "SELECT id FROM categories WHERE name = ? LIMIT 1",
      [genre]
    );
    if (catRows.length) {
      finalCategoryId = catRows[0].id;
    }
  }

  await db.execute(
    "UPDATE books SET title = ?, author = ?, publisher = ?, publication_year = ?, genre = ?, category_id = ?, description = ?, image = ?, stock = ? WHERE id = ?",
    [
      title,
      author,
      publisher,
      Number(publication_year),
      genre,
      finalCategoryId,
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

export async function getAllCategories() {
  const [rows] = await db.execute("SELECT * FROM categories ORDER BY name ASC");
  return rows;
}

/** ============================================================================
 * LOANS FUNCTIONS - UPDATED
 * ============================================================================ */

export async function getAllLoans(filter = {}) {
  let query = `SELECT l.*, u.full_name AS user_name, b.title AS book_title, b.id as book_id, 
     b.author, admin.full_name as approved_by_name
     FROM loans l
     JOIN users u ON l.user_id = u.id
     JOIN books b ON l.book_id = b.id
     LEFT JOIN users admin ON l.approved_by = admin.id`;

  const params = [];

  if (filter.status) {
    query += ` WHERE l.status = ?`;
    params.push(filter.status);
  }

  query += ` ORDER BY l.loan_date DESC`;

  const [rows] = await db.execute(query, params);
  return rows;
}

export async function getLoans(userId) {
  const [rows] = await db.execute(
    `SELECT l.*, b.title AS book_title, b.author, b.image AS book_image, b.id as book_id
     FROM loans l
     JOIN books b ON l.book_id = b.id
     WHERE l.user_id = ?
     ORDER BY l.loan_date DESC`,
    [Number(userId)]
  );
  return rows;
}

export async function getLoanById(loanId) {
  const [rows] = await db.execute(
    `SELECT l.*, u.full_name AS user_name, u.email, u.phone,
            b.title AS book_title, b.author, 
            admin.full_name as approved_by_name
     FROM loans l
     JOIN users u ON l.user_id = u.id
     JOIN books b ON l.book_id = b.id
     LEFT JOIN users admin ON l.approved_by = admin.id
     WHERE l.id = ? LIMIT 1`,
    [Number(loanId)]
  );
  return rows.length ? rows[0] : null;
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
      "INSERT INTO loans (user_id, book_id, loan_date, due_date, status, daily_fine_amount) VALUES (?, ?, ?, ?, ?, ?)",
      [Number(userId), Number(bookId), loanDate, dueDate, "pending", 5000]
    );

    const loanId = result.insertId;

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

/** ============================================================================
 * NOTIFICATIONS FUNCTIONS
 * ============================================================================ */

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

export async function getUnreadNotificationsCount(userId) {
  const [rows] = await db.execute(
    "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read_status = FALSE",
    [Number(userId)]
  );
  return rows.length ? rows[0].count : 0;
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

/** ============================================================================
 * LOAN APPROVAL & REJECTION - UPDATED
 * ============================================================================ */

export async function approveLoan(loanId, adminId) {
  try {
    // Get loan details
    const [loanRows] = await db.execute(
      `SELECT l.user_id, l.book_id, b.title, b.stock
       FROM loans l
       JOIN books b ON l.book_id = b.id
       WHERE l.id = ?`,
      [Number(loanId)]
    );

    if (!loanRows.length) {
      throw new Error("Loan tidak ditemukan");
    }

    const { user_id, book_id, title, stock } = loanRows[0];

    if (stock <= 0) {
      throw new Error("Stok buku sudah habis, tidak bisa diapprove");
    }

    // Start transaction-like operation
    // Update loan status to 'dipinjam'
    await db.execute(
      "UPDATE loans SET status = 'dipinjam', approved_at = NOW(), approved_by = ? WHERE id = ?",
      [Number(adminId), Number(loanId)]
    );

    // Decrease book stock
    await db.execute("UPDATE books SET stock = stock - 1 WHERE id = ?", [
      book_id,
    ]);

    // Log to loan_history (trigger akan auto insert)
    // Create notification for user
    await createNotification({
      userId: user_id,
      type: "success",
      title: "Peminjaman disetujui",
      message: `Peminjaman buku "${title}" telah disetujui. Anda dapat mengambil buku di perpustakaan.`,
      relatedLoanId: Number(loanId),
    });

    return true;
  } catch (error) {
    throw error;
  }
}

export async function rejectLoan(
  loanId,
  adminId,
  reason = "Stok tidak tersedia"
) {
  try {
    // Get loan details before deleting
    const [loanRows] = await db.execute(
      `SELECT l.user_id, b.title
       FROM loans l
       JOIN books b ON l.book_id = b.id
       WHERE l.id = ?`,
      [Number(loanId)]
    );

    if (!loanRows.length) {
      throw new Error("Loan tidak ditemukan");
    }

    const { user_id, title } = loanRows[0];

    // Update loan status to pending dengan rejection reason
    await db.execute(
      "UPDATE loans SET status = 'hilang', rejection_reason = ?, approved_by = ? WHERE id = ?",
      [reason, Number(adminId), Number(loanId)]
    );

    // Create notification for user
    await createNotification({
      userId: user_id,
      type: "error",
      title: "Peminjaman ditolak",
      message: `Permintaan peminjaman buku "${title}" ditolak. Alasan: ${reason}`,
      relatedLoanId: null,
    });

    return true;
  } catch (error) {
    throw error;
  }
}

export async function returnBook(loanId, adminId) {
  try {
    // Get loan details
    const [loanRows] = await db.execute(
      `SELECT l.user_id, l.book_id, l.due_date, b.title
       FROM loans l
       JOIN books b ON l.book_id = b.id
       WHERE l.id = ?`,
      [Number(loanId)]
    );

    if (!loanRows.length) {
      throw new Error("Loan tidak ditemukan");
    }

    const { user_id, book_id, due_date, title } = loanRows[0];

    // Update loan status to 'kembali' dengan return_date hari ini
    // Trigger akan otomatis hitung denda
    await db.execute(
      "UPDATE loans SET status = 'kembali', return_date = CURDATE(), approved_by = ? WHERE id = ?",
      [Number(adminId), Number(loanId)]
    );

    // Increase book stock
    await db.execute("UPDATE books SET stock = stock + 1 WHERE id = ?", [
      book_id,
    ]);

    // Check if late return and create late_return_tracking
    const [updatedLoan] = await db.execute(
      "SELECT fine_amount FROM loans WHERE id = ?",
      [Number(loanId)]
    );

    if (updatedLoan.length && updatedLoan[0].fine_amount > 0) {
      // Insert to late_return_tracking
      const daysLate = Math.ceil(
        (new Date() - new Date(due_date)) / (1000 * 60 * 60 * 24)
      );
      await db.execute(
        "INSERT INTO late_return_tracking (loan_id, days_late, fine_amount, fine_status) VALUES (?, ?, ?, ?)",
        [Number(loanId), daysLate, updatedLoan[0].fine_amount, "unpaid"]
      );

      // Notify user about fine
      await createNotification({
        userId: user_id,
        type: "warning",
        title: "Keterlambatan pengembalian buku",
        message: `Buku "${title}" dikembalikan ${daysLate} hari terlambat. Denda Rp${updatedLoan[0].fine_amount.toLocaleString(
          "id-ID"
        )}.`,
        relatedLoanId: Number(loanId),
      });
    } else {
      // Notify user successfully returned
      await createNotification({
        userId: user_id,
        type: "success",
        title: "Pengembalian buku berhasil",
        message: `Pengembalian buku "${title}" telah dicatat. Terima kasih!`,
        relatedLoanId: Number(loanId),
      });
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/** ============================================================================
 * LOAN HISTORY - FOR AUDIT TRAIL
 * ============================================================================ */

export async function getLoanHistory(loanId) {
  const [rows] = await db.execute(
    `SELECT lh.*, u.full_name as changed_by_name
     FROM loan_history lh
     LEFT JOIN users u ON lh.changed_by = u.id
     WHERE lh.loan_id = ?
     ORDER BY lh.changed_at DESC`,
    [Number(loanId)]
  );
  return rows;
}

/** ============================================================================
 * BOOK REVIEWS - NEW
 * ============================================================================ */

export async function createReview(bookId, userId, rating, review) {
  try {
    const [result] = await db.execute(
      "INSERT INTO book_reviews (book_id, user_id, rating, review) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?, review = ?, updated_at = NOW()",
      [Number(bookId), Number(userId), rating, review, rating, review]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
}

export async function getBookReviews(bookId) {
  const [rows] = await db.execute(
    `SELECT br.*, u.full_name as user_name, u.profile_picture
     FROM book_reviews br
     JOIN users u ON br.user_id = u.id
     WHERE br.book_id = ?
     ORDER BY br.created_at DESC`,
    [Number(bookId)]
  );
  return rows;
}

export async function getBookAverageRating(bookId) {
  const [rows] = await db.execute(
    "SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews FROM book_reviews WHERE book_id = ?",
    [Number(bookId)]
  );
  return rows.length ? rows[0] : { average_rating: 0, total_reviews: 0 };
}

export async function getUserReview(bookId, userId) {
  const [rows] = await db.execute(
    "SELECT * FROM book_reviews WHERE book_id = ? AND user_id = ? LIMIT 1",
    [Number(bookId), Number(userId)]
  );
  return rows.length ? rows[0] : null;
}

/** ============================================================================
 * LATE RETURN TRACKING
 * ============================================================================ */

export async function getLateReturns() {
  const [rows] = await db.execute(
    `SELECT lrt.*, l.user_id, u.full_name, b.title, l.due_date, l.return_date
     FROM late_return_tracking lrt
     JOIN loans l ON lrt.loan_id = l.id
     JOIN users u ON l.user_id = u.id
     JOIN books b ON l.book_id = b.id
     WHERE lrt.fine_status != 'paid'
     ORDER BY lrt.created_at DESC`
  );
  return rows;
}

export async function markFinePaid(trackingId, adminId) {
  try {
    await db.execute(
      "UPDATE late_return_tracking SET fine_status = 'paid', paid_at = NOW() WHERE id = ?",
      [Number(trackingId)]
    );
    return true;
  } catch (error) {
    throw error;
  }
}

export async function waivedFine(trackingId, adminId, notes = "") {
  try {
    await db.execute(
      "UPDATE late_return_tracking SET fine_status = 'waived', notes = ? WHERE id = ?",
      [notes, Number(trackingId)]
    );
    return true;
  } catch (error) {
    throw error;
  }
}

/** ============================================================================
 * SERVER ACTIONS (Existing)
 * ============================================================================ */

export async function actionAddBook(formData) {
  const title = formData.get("title");
  const author = formData.get("author");
  const publisher = formData.get("publisher");
  const publication_year = formData.get("publication_year");
  const genre = formData.get("genre");
  const category_id = formData.get("category_id");
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
    category_id: category_id ? Number(category_id) : null,
    description,
    image,
    stock: Number(stock),
  });
}

export async function actionUpdateBook(id, formData) {
  const title = formData.get("title");
  const author = formData.get("author");
  const publisher = formData.get("publisher");
  const publication_year = formData.get("publication_year");
  const genre = formData.get("genre");
  const category_id = formData.get("category_id");
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
    category_id: category_id ? Number(category_id) : null,
    description,
    image,
    stock: Number(stock),
  });
}

export async function actionDeleteBook(id) {
  await deleteBookById(id);
}

export async function fetchBooks(search = "") {
  const books = await getAllBooks();
  if (!search) return books;
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );
}
