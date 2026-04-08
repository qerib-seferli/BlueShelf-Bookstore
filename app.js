/* Bu faylın məqsədi saytın bütün interaktiv funksiyalarını idarə etməkdir. */
/* Burada kitabların göstərilməsi, axtarış, modal pəncərə, qeydiyyat, giriş və çıxış məntiqi yazılır. */

/* Aşağıdakı books massividir. Massiv bir neçə obyekt saxlamaq üçün istifadə olunur. */
const books = [
  /* Birinci kitab obyekti başlayır. */
  {
    /* id hər kitab üçün unikal identifikatordur. */
    id: 1,
    /* title kitabın adını saxlayır. */
    title: "The Midnight Library",
    /* author müəllifin adını saxlayır. */
    author: "Matt Haig",
    /* genre kitabın janrını saxlayır. */
    genre: "Fantasy",
    /* year nəşr ilini saxlayır. */
    year: "2020",
    /* description kitabın qısa məzmunudur. */
    description: "A woman discovers a magical library between life and death, where each book shows a different version of the life she could have lived.",
    /* authorBio müəllif haqqında qısa məlumat saxlayır. */
    authorBio: "Matt Haig is a British author known for writing emotionally reflective fiction that combines everyday struggles with imaginative storytelling.",
    /* cover kitab kartı üçün gradient fon dəyəridir. */
    cover: "linear-gradient(135deg, #2f3c7e, #5a67d8, #9f7aea)"
  },
  /* Birinci kitab obyekti bitir. */
  {
    id: 2,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Classic",
    year: "1813",
    description: "This novel explores love, social class, family expectations, and personal growth through the relationship between Elizabeth Bennet and Mr. Darcy.",
    authorBio: "Jane Austen was an English novelist whose works remain central to English literature because of their wit, realism, and social insight.",
    cover: "linear-gradient(135deg, #8d6e63, #bcaaa4, #f3e5ab)"
  },
  {
    id: 3,
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    year: "1965",
    description: "Set on the desert planet Arrakis, the story follows Paul Atreides as politics, prophecy, survival, and power collide around the precious spice melange.",
    authorBio: "Frank Herbert was an American science fiction writer best known for building complex political and ecological worlds in the Dune series.",
    cover: "linear-gradient(135deg, #7b341e, #c05621, #ecc94b)"
  },
  {
    id: 4,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Mystery",
    year: "2019",
    description: "A famous painter stops speaking after a shocking crime, and a psychotherapist becomes obsessed with uncovering the truth behind her silence.",
    authorBio: "Alex Michaelides is a British-Cypriot author and screenwriter whose thrillers focus on psychological tension and surprising revelations.",
    cover: "linear-gradient(135deg, #1f4037, #2c7744, #7bc47f)"
  },
  {
    id: 5,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self Development",
    year: "2018",
    description: "This practical book explains how tiny daily changes can lead to remarkable long-term results through habit design and consistent action.",
    authorBio: "James Clear is a writer and speaker focused on habits, decision-making, and continuous self-improvement strategies.",
    cover: "linear-gradient(135deg, #3b3b98, #706fd3, #f7d794)"
  },
  {
    id: 6,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Adventure",
    year: "1988",
    description: "A young shepherd named Santiago travels in search of treasure and learns deeper lessons about destiny, dreams, and listening to the heart.",
    authorBio: "Paulo Coelho is a Brazilian novelist known around the world for spiritually themed stories and philosophical reflections.",
    cover: "linear-gradient(135deg, #134e5e, #2c7a7b, #f6ad55)"
  },
  {
    id: 7,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic",
    year: "1960",
    description: "Seen through a child’s eyes, this novel addresses justice, prejudice, morality, and courage in a deeply divided society.",
    authorBio: "Harper Lee was an American novelist whose literary legacy rests mainly on this influential work about empathy and justice.",
    cover: "linear-gradient(135deg, #2d3748, #4a5568, #cbd5e0)"
  },
  {
    id: 8,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    year: "1937",
    description: "Bilbo Baggins leaves his comfortable home and joins an unexpected journey filled with dwarves, dragons, danger, and personal transformation.",
    authorBio: "J.R.R. Tolkien was an English writer and scholar famous for creating vast fantasy worlds with deep languages, history, and mythology.",
    cover: "linear-gradient(135deg, #22543d, #38a169, #d69e2e)"
  },
  {
    id: 9,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    year: "1949",
    description: "This dystopian novel presents a world of surveillance, propaganda, and fear, where independent thought becomes an act of rebellion.",
    authorBio: "George Orwell was an English novelist and essayist recognized for his sharp criticism of authoritarianism and political manipulation.",
    cover: "linear-gradient(135deg, #1a202c, #2d3748, #e53e3e)"
  },
  {
    id: 10,
    title: "The Book Thief",
    author: "Markus Zusak",
    genre: "Historical Fiction",
    year: "2005",
    description: "Narrated in an unusual voice, the story follows a young girl in Nazi Germany who finds comfort, resistance, and identity through books.",
    authorBio: "Markus Zusak is an Australian author celebrated for emotionally rich storytelling and distinctive narrative perspectives.",
    cover: "linear-gradient(135deg, #5a67d8, #805ad5, #f6ad55)"
  },
  {
    id: 11,
    title: "Sherlock Holmes: A Study in Scarlet",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
    year: "1887",
    description: "This novel introduces Sherlock Holmes and Dr. Watson as they investigate a puzzling case built on logic, deduction, and hidden motives.",
    authorBio: "Arthur Conan Doyle was a British writer whose detective fiction shaped the modern mystery genre through Sherlock Holmes.",
    cover: "linear-gradient(135deg, #2c5282, #2b6cb0, #90cdf4)"
  },
  {
    id: 12,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    genre: "Science",
    year: "1988",
    description: "The book introduces complex ideas such as black holes, time, the universe, and cosmology in a way intended for general readers.",
    authorBio: "Stephen Hawking was a theoretical physicist and cosmologist known for making advanced scientific concepts accessible to wider audiences.",
    cover: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
  }
  /* Son kitab obyekti bitir. */
];

/* STORAGE_KEYS obyekti localStorage üçün istifadə edilən sabit açarları bir yerdə saxlayır. */
const STORAGE_KEYS = {
  /* users açarı qeydiyyatdan keçən istifadəçiləri saxlamaq üçündür. */
  users: "bookverse_users",
  /* activeUser açarı hazırda daxil olmuş istifadəçini saxlamaq üçündür. */
  activeUser: "bookverse_active_user"
};

/* Aşağıda DOM elementlərini tapmaq üçün dəyişənlər yaradılır. */
const bookGrid = document.getElementById("bookGrid");
/* Bu sətr id-si bookGrid olan elementi tapır. Yalnız index səhifəsində mövcuddur. */
const searchInput = document.getElementById("searchInput");
/* Bu sətr axtarış inputunu tapır. */
const bookModal = document.getElementById("bookModal");
/* Bu sətr modal fon elementini tapır. */
const closeModalButton = document.getElementById("closeModalButton");
/* Bu sətr modalı bağlayan düyməni tapır. */
const modalTitle = document.getElementById("modalTitle");
/* Bu sətr modal başlığını tapır. */
const modalAuthor = document.getElementById("modalAuthor");
/* Bu sətr modal müəllif sahəsini tapır. */
const modalGenre = document.getElementById("modalGenre");
/* Bu sətr modal janr sahəsini tapır. */
const modalYear = document.getElementById("modalYear");
/* Bu sətr modal il sahəsini tapır. */
const modalDescription = document.getElementById("modalDescription");
/* Bu sətr modal təsvir sahəsini tapır. */
const modalAuthorBio = document.getElementById("modalAuthorBio");
/* Bu sətr modal müəllif bio sahəsini tapır. */
const modalCover = document.getElementById("modalCover");
/* Bu sətr modal cover sahəsini tapır. */
const registerForm = document.getElementById("registerForm");
/* Bu sətr qeydiyyat formasını tapır. */
const loginForm = document.getElementById("loginForm");
/* Bu sətr login formasını tapır. */
const registerMessage = document.getElementById("registerMessage");
/* Bu sətr qeydiyyat nəticə mesajı elementini tapır. */
const loginMessage = document.getElementById("loginMessage");
/* Bu sətr login nəticə mesajı elementini tapır. */
const logoutButton = document.getElementById("logoutButton");
/* Bu sətr yuxarıdakı logout düyməsini tapır. */
const secondLogoutButton = document.getElementById("secondLogoutButton");
/* Bu sətr aşağıdakı ikinci logout düyməsini tapır. */

/* getStoredUsers funksiyası localStorage daxilində saxlanmış istifadəçiləri qaytarır. */
function getStoredUsers() {
  /* localStorage.getItem verilmiş açar üzrə məlumatı mətn kimi oxuyur. */
  const rawUsers = localStorage.getItem(STORAGE_KEYS.users);
  /* Əgər məlumat yoxdursa, boş massiv qaytarılır. */
  if (!rawUsers) {
    return [];
  }
  /* JSON.parse mətn formasındakı JSON-u yenidən JavaScript obyektinə çevirir. */
  return JSON.parse(rawUsers);
}

/* saveUsers funksiyası istifadəçi massivini localStorage-a yazır. */
function saveUsers(users) {
  /* JSON.stringify obyekti və ya massivi mətnə çevirir ki, localStorage-a yazmaq mümkün olsun. */
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

/* getActiveUser funksiyası hazırda daxil olmuş istifadəçini qaytarır. */
function getActiveUser() {
  /* rawUser daxil olmuş istifadəçi məlumatını mətn kimi saxlayır. */
  const rawUser = localStorage.getItem(STORAGE_KEYS.activeUser);
  /* Məlumat yoxdursa null qaytarılır. null boş obyekt deyil, xüsusi boş dəyərdir. */
  if (!rawUser) {
    return null;
  }
  /* Məlumat varsa onu obyekt kimi qaytarırıq. */
  return JSON.parse(rawUser);
}

/* setActiveUser funksiyası aktiv istifadəçini yadda saxlayır. */
function setActiveUser(user) {
  /* Seçilmiş istifadəçi məlumatı localStorage-a yazılır. */
  localStorage.setItem(STORAGE_KEYS.activeUser, JSON.stringify(user));
}

/* clearActiveUser funksiyası çıxış zamanı aktiv istifadəçini silir. */
function clearActiveUser() {
  /* removeItem verilmiş açarı localStorage-dan silir. */
  localStorage.removeItem(STORAGE_KEYS.activeUser);
}

/* updateAuthVisibility funksiyası daxil olmuş və qonaq görünüşlərini idarə edir. */
function updateAuthVisibility() {
  /* activeUser hazırda daxil olmuş istifadəçini alır. */
  const activeUser = getActiveUser();
  /* guestItems sinfi auth-guest olan bütün elementləri seçir. */
  const guestItems = document.querySelectorAll(".auth-guest");
  /* userItems sinfi auth-user olan bütün elementləri seçir. */
  const userItems = document.querySelectorAll(".auth-user");

  /* Əgər activeUser varsa istifadəçi daxil olmuş sayılır. */
  if (activeUser) {
    /* guestItems içindəki hər element gizlədilir. */
    guestItems.forEach((item) => item.classList.add("hidden-auth"));
    /* userItems içindəki hər element göstərilir. */
    userItems.forEach((item) => item.classList.remove("hidden-auth"));
  } else {
    /* İstifadəçi daxil olmayıbsa qonaq elementləri göstərilir. */
    guestItems.forEach((item) => item.classList.remove("hidden-auth"));
    /* İstifadəçi elementləri gizlədilir. */
    userItems.forEach((item) => item.classList.add("hidden-auth"));
  }
}

/* createBookCard funksiyası bir kitab üçün HTML kartı hazırlayır. */
function createBookCard(book) {
  /* article elementi yaradılır. article məzmun kartı üçün semantik elementdir. */
  const article = document.createElement("article");
  /* Yaradılan article-ə CSS sinfi əlavə edilir. */
  article.className = "book-card";

  /* innerHTML daxilinə hazır HTML strukturu yazılır. */
  article.innerHTML = `
    <div class="book-cover" style="background: ${book.cover};">
      ${book.title}
    </div>
    <div class="book-body">
      <span class="book-tag">${book.genre}</span>
      <h4>${book.title}</h4>
      <p class="book-author-line">by ${book.author}</p>
      <p class="book-description-preview">${book.description.slice(0, 110)}...</p>
      <div class="book-footer">
        <span class="book-year">${book.year}</span>
        <button class="details-button" type="button" data-book-id="${book.id}">View Details</button>
      </div>
    </div>
  `;
  /* Yuxarıdakı template literal içində ${ } sintaksisi JavaScript dəyərlərini HTML içinə yerləşdirmək üçündür. */

  /* Hazır article elementi geri qaytarılır. */
  return article;
}

/* renderBooks funksiyası verilən kitab siyahısını səhifədə göstərir. */
function renderBooks(bookList) {
  /* Əgər səhifədə bookGrid yoxdursa funksiya dayanır. */
  if (!bookGrid) {
    return;
  }

  /* Əvvəlcə grid içi tam təmizlənir. */
  bookGrid.innerHTML = "";

  /* Əgər siyahı boşdursa istifadəçiyə məlumat göstərilir. */
  if (bookList.length === 0) {
    /* Boş nəticə üçün yeni div yaradılır. */
    const emptyState = document.createElement("div");
    /* CSS sinfi verilir. */
    emptyState.className = "no-results-card";
    /* Daxili mətn yazılır. */
    emptyState.innerHTML = "<h4>No books found</h4><p>Please try another keyword such as title, author, or genre.</p>";
    /* Bu element gridə əlavə olunur. */
    bookGrid.appendChild(emptyState);
    /* Funksiya burada bitir. */
    return;
  }

  /* Hər kitab üçün kart yaradılır və səhifəyə əlavə edilir. */
  bookList.forEach((book) => {
    /* createBookCard ilə kart hazırlanır. */
    const card = createBookCard(book);
    /* appendChild elementi seçilmiş konteynerin sonuna əlavə edir. */
    bookGrid.appendChild(card);
  });
}

/* openBookModal funksiyası kliklənmiş kitabın detallarını modalda göstərir. */
function openBookModal(bookId) {
  /* books massivində uyğun kitab axtarılır. */
  const selectedBook = books.find((book) => book.id === Number(bookId));
  /* Number(bookId) mətni ədədə çevirir ki, müqayisə düzgün olsun. */

  /* Əgər kitab tapılmayıbsa funksiya dayanır. */
  if (!selectedBook || !bookModal) {
    return;
  }

  /* Modalın içindəki mətnlər seçilmiş kitabla doldurulur. */
  modalTitle.textContent = selectedBook.title;
  /* textContent mətn yazmaq üçündür. HTML kimi yox, düz mətn kimi əlavə edir. */
  modalAuthor.textContent = `by ${selectedBook.author}`;
  /* Müəllif sətri yenilənir. */
  modalGenre.textContent = selectedBook.genre;
  /* Janr yazılır. */
  modalYear.textContent = selectedBook.year;
  /* İl yazılır. */
  modalDescription.textContent = selectedBook.description;
  /* Təsvir yazılır. */
  modalAuthorBio.textContent = selectedBook.authorBio;
  /* Müəllif haqqında bio yazılır. */
  modalCover.style.background = selectedBook.cover;
  /* Modal cover hissəsinə kitabın rəng fonu verilir. */

  /* active sinfi əlavə edilir və modal görünür. */
  bookModal.classList.add("active");
  /* body overflow gizlədilir ki, modal açıq olanda arxa fonda scroll olmasın. */
  document.body.style.overflow = "hidden";
}

/* closeBookModal funksiyası modalı bağlayır. */
function closeBookModal() {
  /* Əgər modal mövcud deyilsə funksiya dayanır. */
  if (!bookModal) {
    return;
  }

  /* active sinfi silinir. */
  bookModal.classList.remove("active");
  /* Body scroll yenidən aktiv edilir. */
  document.body.style.overflow = "";
}

/* filterBooks funksiyası axtarış mətninə görə kitabları süzür. */
function filterBooks(searchValue) {
  /* İstifadəçinin yazdığı mətn kiçik hərfə çevrilir. */
  const normalizedValue = searchValue.trim().toLowerCase();
  /* trim əvvəldə və sonda boşluqları silir. toLowerCase isə bütün hərfləri kiçik edir. */

  /* Əgər input boşdursa bütün kitablar göstərilir. */
  if (!normalizedValue) {
    renderBooks(books);
    return;
  }

  /* filter ilə uyğun kitablar seçilir. */
  const filteredBooks = books.filter((book) => {
    /* searchableText kitabın bir neçə sahəsini birləşdirir. */
    const searchableText = `${book.title} ${book.author} ${book.genre}`.toLowerCase();
    /* includes axtarılan mətnin olub-olmadığını yoxlayır. */
    return searchableText.includes(normalizedValue);
  });

  /* Tapılan kitablar yenidən render edilir. */
  renderBooks(filteredBooks);
}

/* showMessage funksiyası form mesaj elementinə uğur və ya xəta mətni yazır. */
function showMessage(element, text, type) {
  /* Əgər element yoxdursa funksiya dayanır. */
  if (!element) {
    return;
  }

  /* Mətn yazılır. */
  element.textContent = text;
  /* Əvvəlki success və error sinifləri silinir. */
  element.classList.remove("success", "error");
  /* Verilmiş type sinfi əlavə edilir. */
  element.classList.add(type);
}

/* handleRegister funksiyası qeydiyyat formunun işləməsini idarə edir. */
function handleRegister(event) {
  /* preventDefault formun standart yenilənmə davranışını dayandırır. */
  event.preventDefault();

  /* Form input dəyərləri oxunur. */
  const name = document.getElementById("registerName").value.trim();
  /* Ad inputu alınır və trim ilə təmizlənir. */
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  /* Email kiçik hərflə saxlanılır ki, müqayisə rahat olsun. */
  const password = document.getElementById("registerPassword").value.trim();
  /* Şifrə oxunur. */

  /* Çox sadə doğrulama aparılır. */
  if (name.length < 3) {
    showMessage(registerMessage, "Full name must be at least 3 characters.", "error");
    return;
  }

  /* Şifrə uzunluğunu yoxlayırıq. */
  if (password.length < 4) {
    showMessage(registerMessage, "Password must be at least 4 characters.", "error");
    return;
  }

  /* Mövcud istifadəçilər alınır. */
  const users = getStoredUsers();
  /* Eyni email ilə istifadəçi olub-olmadığı yoxlanılır. */
  const alreadyExists = users.some((user) => user.email === email);

  /* Əgər email artıq mövcuddursa xəta göstərilir. */
  if (alreadyExists) {
    showMessage(registerMessage, "This email is already registered. Please login instead.", "error");
    return;
  }

  /* Yeni istifadəçi obyekti yaradılır. */
  const newUser = {
    name,
    email,
    password
  };

  /* Yeni istifadəçi siyahıya əlavə edilir. */
  users.push(newUser);
  /* Siyahı yadda saxlanılır. */
  saveUsers(users);
  /* Yeni istifadəçi eyni zamanda aktiv istifadəçi edilir. */
  setActiveUser({ name, email });
  /* Uğur mesajı göstərilir. */
  showMessage(registerMessage, "Registration successful. Redirecting to home page...", "success");
  /* Auth görünüşü yenilənir. */
  updateAuthVisibility();

  /* Kiçik gecikmədən sonra ana səhifəyə keçid edilir. */
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1200);
}

/* handleLogin funksiyası giriş formunu idarə edir. */
function handleLogin(event) {
  /* Formun standart submit davranışı dayandırılır. */
  event.preventDefault();

  /* Login inputları oxunur. */
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value.trim();

  /* Yadda saxlanmış istifadəçilər alınır. */
  const users = getStoredUsers();
  /* Uyğun istifadəçi axtarılır. */
  const matchedUser = users.find((user) => user.email === email && user.password === password);

  /* Uyğun istifadəçi tapılmayıbsa xəta göstərilir. */
  if (!matchedUser) {
    showMessage(loginMessage, "Incorrect email or password.", "error");
    return;
  }

  /* Aktiv istifadəçi olaraq yadda saxlanılır. */
  setActiveUser({ name: matchedUser.name, email: matchedUser.email });
  /* Uğur mesajı göstərilir. */
  showMessage(loginMessage, "Login successful. Redirecting to home page...", "success");
  /* Görünüş yenilənir. */
  updateAuthVisibility();

  /* Ana səhifəyə yönləndiririk. */
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1200);
}

/* handleLogout funksiyası çıxış düymələri üçün istifadə olunur. */
function handleLogout() {
  /* Aktiv istifadəçi silinir. */
  clearActiveUser();
  /* Görünüş yenilənir. */
  updateAuthVisibility();
  /* İstifadəçi ana səhifəyə qaytarılır. */
  window.location.href = "index.html";
}

/* initHomePage funksiyası yalnız ana səhifədə işləyən məntiqi başladır. */
function initHomePage() {
  /* Əgər grid yoxdursa bu funksiya başqa səhifədədir və işləməməlidir. */
  if (!bookGrid) {
    return;
  }

  /* Bütün kitablar ilkin olaraq göstərilir. */
  renderBooks(books);

  /* bookGrid daxilində klik hadisəsi dinlənir. */
  bookGrid.addEventListener("click", (event) => {
    /* Ən yaxın .details-button elementi tapılır. */
    const detailsButton = event.target.closest(".details-button");
    /* Əgər klik düyməyə deyilsə funksiya dayanır. */
    if (!detailsButton) {
      return;
    }
    /* data-book-id atributundakı dəyər alınır və modal açılır. */
    openBookModal(detailsButton.dataset.bookId);
  });

  /* Axtarış inputu varsa input hadisəsi əlavə edilir. */
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      /* Yazılan dəyərə görə filter edilir. */
      filterBooks(event.target.value);
    });
  }
}

/* initModalEvents funksiyası modal bağlanma hadisələrini qurur. */
function initModalEvents() {
  /* Bağlama düyməsi varsa klik hadisəsi əlavə edilir. */
  if (closeModalButton) {
    closeModalButton.addEventListener("click", closeBookModal);
  }

  /* Modal overlay varsa onun üstündə klik zamanı bağlanma qurulur. */
  if (bookModal) {
    bookModal.addEventListener("click", (event) => {
      /* Əgər klik birbaşa overlay üzərinə olubsa bağlanır. */
      if (event.target === bookModal) {
        closeBookModal();
      }
    });
  }

  /* Klaviaturadan Escape düyməsi ilə də bağlama imkanı yaradılır. */
  document.addEventListener("keydown", (event) => {
    /* Escape düyməsi və modal açıqdırsa bağlayırıq. */
    if (event.key === "Escape" && bookModal && bookModal.classList.contains("active")) {
      closeBookModal();
    }
  });
}

/* initAuthForms funksiyası login və qeydiyyat form hadisələrini qoşur. */
function initAuthForms() {
  /* Qeydiyyat formu varsa submit hadisəsi əlavə edilir. */
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  /* Login formu varsa submit hadisəsi əlavə edilir. */
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
}

/* initLogoutButtons funksiyası bütün logout düymələrinə hadisə əlavə edir. */
function initLogoutButtons() {
  /* Birinci düymə varsa klik hadisəsi qoşulur. */
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  /* İkinci düymə varsa klik hadisəsi qoşulur. */
  if (secondLogoutButton) {
    secondLogoutButton.addEventListener("click", handleLogout);
  }
}

/* initApp funksiyası bütün başlanğıc funksiyalarını ardıcıl işə salır. */
function initApp() {
  /* Əvvəlcə auth görünüşləri tənzimlənir. */
  updateAuthVisibility();
  /* Sonra ana səhifə məntiqi başladılır. */
  initHomePage();
  /* Modal hadisələri qoşulur. */
  initModalEvents();
  /* Form hadisələri qoşulur. */
  initAuthForms();
  /* Logout düymələri aktiv edilir. */
  initLogoutButtons();
}

/* DOMContentLoaded hadisəsi HTML tam yüklənəndən sonra işləyir. */
document.addEventListener("DOMContentLoaded", initApp);
/* Bunun mənası odur ki, bütün elementlər yükləndikdən sonra initApp funksiyası çağırılır. */
