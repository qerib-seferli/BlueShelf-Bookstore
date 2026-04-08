/* =========================================================
   BOOKNEST - THESIS PROJECT JAVASCRIPT
   Qeyd: Şərhlər Azərbaycan dilindədir.
   Burada həm kitab məlumatları, həm də auth məntiqi var.
   ========================================================= */

// Demo kitab datası: real backend yoxdursa belə işləsin deyə JS daxilində saxlanılır.
const books = [
  {
    id: 1,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Classic',
    year: 1813,
    aboutAuthor: 'Jane Austen was an English novelist famous for her sharp social observation and elegant storytelling.',
    description: 'A romantic novel about Elizabeth Bennet, family expectations, love, pride, and social class in nineteenth-century England.'
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    category: 'Dystopian',
    year: 1949,
    aboutAuthor: 'George Orwell was an English writer known for political commentary and criticism of authoritarian systems.',
    description: 'A dystopian novel about surveillance, control, propaganda, and the loss of freedom in a totalitarian state.'
  },
  {
    id: 3,
    title: 'The Hobbit',
    author: 'J. R. R. Tolkien',
    category: 'Fantasy',
    year: 1937,
    aboutAuthor: 'J. R. R. Tolkien was an English author and philologist, best known for creating Middle-earth.',
    description: 'An adventure story following Bilbo Baggins as he joins a dangerous journey to recover treasure from a dragon.'
  },
  {
    id: 4,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    year: 1960,
    aboutAuthor: 'Harper Lee was an American novelist celebrated for writing about justice, humanity, and social inequality.',
    description: 'A novel about childhood, justice, racism, and moral courage in a small Southern town.'
  },
  {
    id: 5,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Adventure',
    year: 1988,
    aboutAuthor: 'Paulo Coelho is a Brazilian author known for philosophical and inspirational fiction.',
    description: 'A symbolic journey about dreams, destiny, personal legend, and self-discovery.'
  },
  {
    id: 6,
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J. K. Rowling',
    category: 'Fantasy',
    year: 1997,
    aboutAuthor: 'J. K. Rowling is a British author best known for the Harry Potter fantasy series.',
    description: 'A fantasy story about a young wizard discovering friendship, magic, and his place in the wizarding world.'
  }
];

// Helper funksiyalar: localStorage ilə işləməyi sadələşdirir.
function getUsers() {
  return JSON.parse(localStorage.getItem('booknestUsers')) || [];
}

function saveUsers(users) {
  localStorage.setItem('booknestUsers', JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('booknestCurrentUser')) || null;
}

function saveCurrentUser(user) {
  localStorage.setItem('booknestCurrentUser', JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem('booknestCurrentUser');
}

// Header auth vəziyyətini yeniləyən funksiya.
function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const welcomeUser = document.getElementById('welcomeUser');
  const currentUser = getCurrentUser();

  if (!loginBtn || !registerBtn || !logoutBtn || !welcomeUser) return;

  if (currentUser) {
    welcomeUser.textContent = `Hello, ${currentUser.name}`;
    loginBtn.classList.add('hidden');
    registerBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
  } else {
    welcomeUser.textContent = '';
    loginBtn.classList.remove('hidden');
    registerBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
  }

  logoutBtn.addEventListener('click', () => {
    logoutUser();
    window.location.href = 'index.html';
  });
}

// Kateqoriyaları select için ayrıca çıxarırıq.
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter) return;

  const uniqueCategories = [...new Set(books.map(book => book.category))];
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.toLowerCase();
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Kitab kartlarını ekrana çıxaran funksiya.
function renderBooks(bookList = books) {
  const booksGrid = document.getElementById('booksGrid');
  const bookCount = document.getElementById('bookCount');
  const emptyState = document.getElementById('emptyState');

  if (!booksGrid || !bookCount || !emptyState) return;

  booksGrid.innerHTML = '';
  bookCount.textContent = bookList.length;

  if (bookList.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  bookList.forEach(book => {
    const article = document.createElement('article');
    article.className = 'book-card';
    article.innerHTML = `
      <div class="book-cover">
        <small>${book.category}</small>
      </div>
      <div class="book-body">
        <h3>${book.title}</h3>
        <div class="book-meta">
          <span><strong>Author:</strong> ${book.author}</span>
          <span><strong>Year:</strong> ${book.year}</span>
        </div>
        <p class="card-action">Click to view details</p>
      </div>
    `;

    // Kartın üzərinə basanda modal açılır.
    article.addEventListener('click', () => openBookModal(book.id));
    booksGrid.appendChild(article);
  });
}

// Axtarış və filter məntiqi.
function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  if (!searchInput || !categoryFilter) return;

  function applyFilters() {
    const searchText = searchInput.value.trim().toLowerCase();
    const categoryValue = categoryFilter.value;

    const filteredBooks = books.filter(book => {
      const matchesText =
        book.title.toLowerCase().includes(searchText) ||
        book.author.toLowerCase().includes(searchText) ||
        book.category.toLowerCase().includes(searchText);

      const matchesCategory =
        categoryValue === 'all' || book.category.toLowerCase() === categoryValue;

      return matchesText && matchesCategory;
    });

    renderBooks(filteredBooks);
  }

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
}

// Modalda kitab detalları göstərilir.
function openBookModal(bookId) {
  const modal = document.getElementById('bookModal');
  const modalBody = document.getElementById('modalBody');
  if (!modal || !modalBody) return;

  const book = books.find(item => item.id === bookId);
  if (!book) return;

  modalBody.innerHTML = `
    <div class="modal-book-top">
      <div class="modal-cover">
        <h3>${book.title}</h3>
      </div>
      <div class="modal-text">
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Published:</strong> ${book.year}</p>
        <div class="modal-tags">
          <span>${book.category}</span>
          <span>Book details</span>
        </div>
        <p><strong>About the author:</strong> ${book.aboutAuthor}</p>
        <p class="modal-description"><strong>What is the book about?</strong> ${book.description}</p>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeBookModal() {
  const modal = document.getElementById('bookModal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function setupModal() {
  const closeModal = document.getElementById('closeModal');
  const modalOverlay = document.getElementById('modalOverlay');

  if (closeModal) closeModal.addEventListener('click', closeBookModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeBookModal);
}

// Register səhifəsinin məntiqi.
function setupRegisterForm() {
  const registerForm = document.getElementById('registerForm');
  const registerMessage = document.getElementById('registerMessage');
  if (!registerForm || !registerMessage) return;

  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value.trim();

    const users = getUsers();
    const exists = users.some(user => user.email === email);

    if (exists) {
      registerMessage.textContent = 'This email is already registered.';
      registerMessage.style.color = '#d14545';
      return;
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    saveUsers(users);
    saveCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email });

    registerMessage.textContent = 'Registration successful. Redirecting to homepage...';
    registerMessage.style.color = '#2f8a57';

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  });
}

// Login səhifəsinin məntiqi.
function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');
  if (!loginForm || !loginMessage) return;

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value.trim();

    const users = getUsers();
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (!foundUser) {
      loginMessage.textContent = 'Invalid email or password.';
      loginMessage.style.color = '#d14545';
      return;
    }

    saveCurrentUser({ id: foundUser.id, name: foundUser.name, email: foundUser.email });
    loginMessage.textContent = 'Login successful. Redirecting to homepage...';
    loginMessage.style.color = '#2f8a57';

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  });
}

// Səhifə yüklənəndə lazım olan bütün funksiyalar işə düşür.
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  populateCategories();
  renderBooks();
  setupFilters();
  setupModal();
  setupRegisterForm();
  setupLoginForm();
});
