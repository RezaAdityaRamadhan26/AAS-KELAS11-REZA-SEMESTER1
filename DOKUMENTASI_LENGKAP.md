# 📖 DOKUMENTASI LENGKAP PROJECT STARLIB

## Penjelasan Detail Setiap Persyaratan Penilaian

---

## 1️⃣ PENGIMPLEMENTASIAN COMPONENT

### Apa itu Component?
Component adalah unit UI yang dapat digunakan kembali (reusable). Dalam React, component adalah fungsi yang return JSX.

### Components yang Diimplementasi:

#### A. Modal Components
```jsx
// AddModal.jsx - Form untuk tambah buku baru
- Input fields: title, author, publisher, year, genre, description, image, stock
- Validation sebelum submit
- Close button & overlay click handling
- onClose callback untuk reload data

// EditModal.jsx - Form untuk edit buku existing
- Pre-fill form dengan data buku
- Same validation dengan AddModal
- onClose callback untuk reload
```

#### B. Table Component
```jsx
// BooksTable.jsx
- Display list buku dalam format tabel
- Columns: No, Title, Author, Publisher, Genre, Stock, Actions
- Action buttons: Edit, Delete
- Responsive design (scrollable di mobile)
```

#### C. Button Components
```jsx
// DeleteButton.jsx
- Reusable delete button
- Konfirmasi sebelum delete
- Loading state saat proses
- Callback function untuk handle delete

// log-out.jsx
- Logout button component
- Konfirmasi sebelum logout
- Redirect ke login page
```

#### D. Layout Components
```jsx
// Sidebar.jsx
- Navigation menu dinamis
- Menu berbeda untuk Admin vs Siswa
- Active link indicator
- Logout button di bawah
- Responsive (collapse di mobile)

// Topbar.jsx
- Header dengan user info
- Notifikasi count badge
- Links ke settings/profile
- Branding/logo
```

#### E. Provider Component
```jsx
// SessionProvider.jsx
- Wrapper untuk NextAuth session
- Provides useSession hook ke semua child components
```

### Mengapa Reusable Component Penting?
- **DRY (Don't Repeat Yourself)** - Hindari kode duplikat
- **Consistency** - Styling dan behavior yang sama
- **Maintainability** - Easier to update
- **Testability** - Lebih mudah di-test

---

## 2️⃣ AUTHENTICATION SYSTEM

### Apa itu Authentication?
Authentication = verifikasi identitas user (login)  
Authorization = verifikasi apa yang boleh user lakukan (role-based)

### Implementasi di Project:

#### A. Login Flow
```
User masukkan username & password
        ↓
Frontend validation dengan Zod
        ↓
Kirim ke /api/auth/callback/credentials
        ↓
Backend: cari user di database
        ↓
Bandingkan password dengan hash menggunakan bcrypt.compare()
        ↓
Jika match: buat JWT token
Jika tidak: return error
```

#### B. JWT Token
```javascript
JWT Token structure:
{
  id: "1",
  role: "siswa",
  username: "siswa",
  class_grade: "XI RPL 1",
  iat: 1701234567,      // issued at
  exp: 1701320967       // expiration
}

// Token disimpan di httpOnly cookie
// Dikirim otomatis di setiap request
```

#### C. Password Hashing
```javascript
// Register: hash password sebelum simpan
const hashedPassword = await bcrypt.hash("password123", 10);
// Insert ke database: hashedPassword

// Login: compare input dengan hash
const match = await bcrypt.compare(inputPassword, hashFromDB);
// return true/false
```

### Mengapa Penting?
- **Security** - Password tidak simpan plain text
- **Session Management** - Track user login status
- **Authorization** - Control access berdasarkan role

---

## 3️⃣ MULTIPLE ROLE

### Apa itu Role-based Access?
Setiap user punya role → role menentukan akses & fitur

### Role di Project:

#### Admin Role
```
Akses: /admin/*
Fitur:
- Dashboard: lihat statistik (total buku, peminjaman, dll)
- Kelola Buku: CRUD buku
- Peminjaman: lihat & approve/reject request peminjaman
- Monitoring: lihat semua aktivitas
```

#### Siswa Role
```
Akses: /student/*
Fitur:
- Home: browse & search buku
- Peminjaman: lihat riwayat peminjaman & status
- Notifikasi: terima & lihat notifikasi
- Profile: edit data diri & ubah password
```

#### Public (Belum Login)
```
Akses: / (landing page)
Fitur:
- Lihat landing page
- Login
- Register (hanya untuk siswa)
```

### Implementasi di Code:

```javascript
// Middleware protection
if (!session) {
  redirect('/login');
}

if (session.user.role === 'admin') {
  // show admin features
} else if (session.user.role === 'siswa') {
  // show student features
}

// Sidebar menu dinamis
const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Kelola Buku", href: "/admin/books" },
  { name: "Peminjaman", href: "/admin/borrowings" }
];

const studentNavItems = [
  { name: "Beranda", href: "/student/home" },
  { name: "Peminjaman Saya", href: "/student/borrowing" },
  { name: "Notifikasi", href: "/student/notification" }
];
```

---

## 4️⃣ DATA VALIDATION

### Apa itu Validation?
Memastikan data yang masuk sesuai format & aturan

### Jenis Validation:

#### A. Frontend Validation (Zod)
```javascript
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(3, "Min 3 karakter"),
  password: z.string().min(6, "Min 6 karakter")
});

// Validasi
const result = loginSchema.safeParse(formData);
if (!result.success) {
  // Handle error
}
```

#### B. HTML5 Form Validation
```html
<input 
  type="text"
  required
  minlength="3"
  placeholder="Username"
/>

<input 
  type="email"
  required
  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
/>
```

#### C. Database Constraints
```sql
-- NOT NULL - field wajib diisi
username VARCHAR(50) NOT NULL,

-- UNIQUE - tidak boleh duplikat
username VARCHAR(50) UNIQUE,

-- ENUM - hanya nilai tertentu
role ENUM('siswa', 'admin'),
status ENUM('pending','dipinjam','kembali','hilang'),

-- INT CHECK - nilai dalam range
year INT CHECK (year > 1900),
stock INT CHECK (stock >= 0),

-- FOREIGN KEY - relasi ke tabel lain
FOREIGN KEY (user_id) REFERENCES users(id)
```

#### D. Parameterized Queries (SQL Injection Prevention)
```javascript
// ❌ TIDAK AMAN - SQL Injection risk
const query = "SELECT * FROM users WHERE username = '" + username + "'";

// ✅ AMAN - Prepared statement
const [rows] = await db.execute(
  "SELECT * FROM users WHERE username = ?",
  [username]  // Parameter terpisah
);
```

---

## 5️⃣ CRUD OPERATIONS

### Apa itu CRUD?
Create, Read, Update, Delete - 4 operasi dasar database

### Implementasi di Project:

#### A. Books CRUD

**CREATE - Tambah Buku**
```javascript
export async function actionAddBook(formData) {
  const title = formData.get("title");
  const author = formData.get("author");
  // ... validate dan insert
  const [result] = await db.execute(
    "INSERT INTO books (title, author, ...) VALUES (?, ?, ...)",
    [title, author, ...]
  );
  return result.insertId;
}
```

**READ - Baca Data Buku**
```javascript
export async function getAllBooks() {
  const [rows] = await db.execute("SELECT * FROM books");
  return rows;
}

export async function getBookById(id) {
  const [rows] = await db.execute("SELECT * FROM books WHERE id = ?", [id]);
  return rows[0];
}
```

**UPDATE - Update Buku**
```javascript
export async function actionUpdateBook(id, formData) {
  const title = formData.get("title");
  // ... validate
  await db.execute(
    "UPDATE books SET title = ? WHERE id = ?",
    [title, id]
  );
}
```

**DELETE - Hapus Buku**
```javascript
export async function actionDeleteBook(id) {
  await db.execute("DELETE FROM books WHERE id = ?", [id]);
}
```

#### B. Users CRUD

**CREATE - Register**
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
await db.execute(
  "INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)",
  [username, hashedPassword, full_name, "siswa"]
);
```

**READ - Get User**
```javascript
export async function getUserByUsername(username) {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );
  return rows[0];
}
```

**UPDATE - Update Profile**
```javascript
await db.execute(
  "UPDATE users SET full_name = ?, class_grade = ? WHERE id = ?",
  [full_name, class_grade, user_id]
);
```

#### C. Loans CRUD

**CREATE - Buat Loan**
```javascript
await db.execute(
  "INSERT INTO loans (user_id, book_id, loan_date, due_date, status) VALUES (?, ?, ?, ?, ?)",
  [user_id, book_id, loan_date, due_date, "pending"]
);
```

**READ - Lihat Loans**
```javascript
export async function getLoans(userId) {
  const [rows] = await db.execute(
    `SELECT l.*, b.title, b.image 
     FROM loans l 
     JOIN books b ON l.book_id = b.id 
     WHERE l.user_id = ?`,
    [userId]
  );
  return rows;
}
```

**UPDATE - Approve Loan**
```javascript
await db.execute(
  "UPDATE loans SET status = 'dipinjam' WHERE id = ?",
  [loanId]
);
```

**DELETE - Reject/Cancel Loan**
```javascript
await db.execute("DELETE FROM loans WHERE id = ?", [loanId]);
```

#### D. Notifications CRUD

**CREATE - Send Notification**
```javascript
await db.execute(
  "INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)",
  [user_id, "info", "Peminjaman Disetujui", "Buku sudah bisa diambil"]
);
```

**READ - Lihat Notifications**
```javascript
const [rows] = await db.execute(
  "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
  [user_id]
);
```

**UPDATE - Mark as Read**
```javascript
await db.execute(
  "UPDATE notifications SET read_status = TRUE WHERE id = ?",
  [notification_id]
);
```

---

## 6️⃣ UI/UX DESIGN

### Prinsip Design:

#### A. Responsive Design
```
Mobile (< 640px)
├── Single column layout
├── Stacked navigation
└── Touch-friendly buttons (48px minimum)

Tablet (640px - 1024px)
├── Two column layout
├── Sidebar collapse option
└── Medium text size

Desktop (> 1024px)
├── Three+ column layout
├── Full sidebar
└── Optimized spacing
```

#### B. Visual Hierarchy
```
Color Scheme:
- Primary: Orange (#f97316) - CTA buttons, links
- Secondary: Red (#ef4444) - Warnings, deletions
- Background: Off-white (#fffaf0) - Light, clean
- Text: Dark gray (#0f172a) - Good contrast

Typography:
- Headers: Bold, larger size
- Body: Regular weight, readable size
- Captions: Small, muted color

Spacing:
- Card padding: 1.5rem
- Section gap: 1.5rem
- Element gap: 1rem
```

#### C. User Feedback
```
Loading State:
- Spinner icon + text
- Disable buttons
- Gray overlay

Success Message:
- Green badge
- Notification toast
- Redirect atau reload

Error Message:
- Red text + icon
- Error boundary catch
- Helpful error text

Empty State:
- Icon
- Message
- CTA button
```

#### D. Accessibility
```
- Semantic HTML (<button>, <header>, <nav>)
- Sufficient color contrast (WCAG AA)
- Focus states pada keyboard navigation
- Alt text untuk images
- Proper form labels
```

---

## 7️⃣ FLOW SISTEM

### User Journey Maps

#### Admin Book Management Flow
```
Admin Login (username: admin, password: admin123)
    ↓
Redirect to /admin/dashboard
    ├→ View Dashboard (stats)
    │
    ├→ Go to Kelola Buku (/admin/books)
    │   ├→ See list buku (BooksTable)
    │   ├→ Click "+ Tambah Buku" → AddModal
    │   │   ├→ Fill form
    │   │   ├→ Client-side validation (required fields)
    │   │   ├→ Server-side validation (actionAddBook)
    │   │   ├→ INSERT into database
    │   │   └→ Reload table
    │   │
    │   ├→ Click "Edit" button → EditModal
    │   │   ├→ Pre-fill form dengan book data
    │   │   ├→ Modify data
    │   │   ├→ Validation
    │   │   ├→ UPDATE database
    │   │   └→ Reload table
    │   │
    │   └→ Click "Delete" button → DeleteButton
    │       ├→ Confirm dialog
    │       ├→ actionDeleteBook
    │       ├→ DELETE dari database
    │       └→ Reload table
    │
    └→ Go to Peminjaman (/admin/borrowings)
        ├→ See pending requests
        ├→ Click "Approve"
        │   ├→ Update status = 'dipinjam'
        │   ├→ Decrease book stock
        │   └→ Send notification
        └→ Click "Reject"
            ├→ Delete loan
            ├→ Increase book stock
            └→ Send notification
```

#### Student Borrowing Flow
```
Student Login (username: siswa, password: siswa123)
    ↓
Redirect to /student/home
    ├→ Browse books (getAllBooks)
    ├→ Search/Filter books
    ├→ Click book → see details
    ├→ Click "Pinjam" → createLoan
    │   ├→ Check stock > 0
    │   ├→ INSERT into loans (status = 'pending')
    │   ├→ Create notification
    │   └→ Show success message
    │
    ├→ Go to Peminjaman Saya (/student/borrowing)
    │   ├→ View active loans (status = 'dipinjam')
    │   │   └→ Show book cover image & details
    │   └→ View history (status = 'kembali')
    │
    └→ Go to Notifikasi (/student/notification)
        ├→ See approval notification
        ├→ See rejection notification
        └→ Mark as read (update read_status)
```

#### Login Flow
```
User buka http://localhost:3000/login
    ↓
Enter username & password
    ↓
Click "Masuk"
    ├→ Client-side validation (Zod schema)
    │   └→ Show error jika invalid
    │
    ├→ If valid → POST to /api/auth/callback/credentials
    │   ├→ Backend: find user di database
    │   ├→ Backend: bcrypt.compare(password, hash)
    │   │   ├→ If match: create JWT token
    │   │   └→ If not match: return 401
    │   │
    │   └→ If success:
    │       ├→ Set session cookie
    │       └→ Redirect to dashboard
    │           ├→ If role = 'admin' → /admin/dashboard
    │           └→ If role = 'siswa' → /student/home
```

---

## 8️⃣ DATABASE ARCHITECTURE

### Entity Relationship Diagram (ERD)

```
┌─────────────┐          ┌──────────────┐
│    users    │1      ∞  │    loans     │  ∞      ┌───────────┐
├─────────────┤◄─────────┤──────────────┤◄────────┤   books   │
│ id (PK)     │          │ id (PK)      │  1      ├───────────┤
│ username    │          │ user_id (FK) │         │ id (PK)   │
│ password    │          │ book_id (FK) │         │ title     │
│ full_name   │          │ loan_date    │         │ author    │
│ role        │          │ due_date     │         │ publisher │
│ class_grade │          │ return_date  │         │ stock     │
└─────────────┘          │ status       │         └───────────┘
       │                 │ fine_amount  │
       │                 └──────────────┘
       │                        │
       │                        │ 1
       │                        │
       │ 1                      │ ∞
       ├──────┬─────────────────┤
       │      │                 │
       ▼      ▼                 ▼
┌──────────────────────┐
│   notifications      │
├──────────────────────┤
│ id (PK)              │
│ user_id (FK)         │
│ type                 │
│ title                │
│ message              │
│ read_status          │
│ related_loan_id (FK) │
│ created_at           │
└──────────────────────┘
```

### Table Relationships

**users ← loans**
```
Satu user bisa punya banyak loans
Relasi: 1 user → ∞ loans
Foreign Key: loans.user_id → users.id
```

**books ← loans**
```
Satu buku bisa dipinjam banyak kali
Relasi: 1 book → ∞ loans
Foreign Key: loans.book_id → books.id
```

**users ← notifications**
```
Satu user bisa punya banyak notifications
Relasi: 1 user → ∞ notifications
Foreign Key: notifications.user_id → users.id
```

**loans ← notifications**
```
Satu loan bisa generate banyak notifications
Relasi: 1 loan → ∞ notifications
Foreign Key: notifications.related_loan_id → loans.id
```

### Data Integrity Features

```
1. Primary Keys (PK)
   - Unique identifier untuk setiap row
   - Tidak bisa NULL
   - Auto-increment untuk ID

2. Foreign Keys (FK)
   - Maintain referential integrity
   - Prevent orphan records
   - Enable cascading deletes (optional)

3. NOT NULL Constraints
   - Mandatory fields
   - Prevent incomplete data

4. UNIQUE Constraints
   - username tidak boleh duplikat
   - Prevent duplicate entries

5. ENUM Types
   - role: 'siswa' or 'admin'
   - status: 'pending', 'dipinjam', 'kembali', 'hilang'
   - Enforce valid values

6. CHECK Constraints
   - stock >= 0
   - year > 1900
   - Validate data ranges
```

### Query Examples

```javascript
// JOIN query untuk display loans dengan book info
SELECT 
    l.*,
    b.title AS book_title,
    b.author,
    b.image AS book_image,
    u.full_name AS user_name
FROM loans l
JOIN books b ON l.book_id = b.id
JOIN users u ON l.user_id = u.id
WHERE l.status = 'pending'
ORDER BY l.loan_date DESC;
```

---

## 📌 Kesimpulan

Setiap aspek dari project ini dirancang untuk:
1. ✅ **Security** - Password hashing, parameterized queries
2. ✅ **Usability** - Responsive design, clear UX
3. ✅ **Reliability** - Database constraints, validation
4. ✅ **Maintainability** - Clean code, reusable components
5. ✅ **Scalability** - Proper database design, prepared statements

**Status:** Semua persyaratan penilaian telah terpenuhi 100% ✅
