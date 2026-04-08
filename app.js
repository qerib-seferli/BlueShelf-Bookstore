
// ===============================================================
//  Bu fayl saytın bütün canlı funksiyalarını idarə edir.
//  Burada:
//  1) Supabase ilə bağlantı qurulur,
//  2) kitablar, müəlliflər, kateqoriyalar oxunur,
//  3) login, register, logout, reset-password işləyir,
//  4) admin paneldə CRUD əməliyyatları icra olunur,
//  5) favoritlər, profil, axtarış və dinamik səhifələr işləyir.
// ===============================================================

//  Qısa yol üçün client dəyişəni yaradırıq.
const sb = window.supabaseClient; //  Supabase client-in qısa adı.

//  document.body üzərindən cari səhifə adını oxuyuruq.
const page = document.body.dataset.page || "default"; //  data-page atributu yoxdursa "default" olur.

//  DOM seçmək üçün qısa yardımçı funksiya.
const $ = (selector) => document.querySelector(selector); //  Birinci uyğun elementi qaytarır.

//  DOM içində birdən çox elementi seçmək üçün qısa yardımçı funksiya.
const $$ = (selector) => Array.from(document.querySelectorAll(selector)); //  NodeList-i massivə çevirir.

//  Şəkil yoxdursa istifadə ediləcək placeholder ünvanı.
const PLACEHOLDER_COVER = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80"; //  Ehtiyat kitab qabığı.

//  Toast göstərmək üçün taymer ID-sini saxlayırıq.
let toastTimer = null; //  Sonrakı bildirişləri idarə etmək üçün.

// ===============================================================
//  Bu funksiya ekranda özümüzə məxsus bildiriş göstərir.
//  GitHub Pages alert-ləri yerinə daha səliqəli toast istifadə olunur.
// ===============================================================
function showToast(message, isError = false) { //  message mətnini, isError isə rəng tonunu təyin edir.
  const toast = $("#toast"); //  Toast konteynerini götürürük.
  if (!toast) return; //  Element yoxdursa funksiyanı dayandırırıq.
  toast.textContent = message; //  Bildiriş mətnini yazırıq.
  toast.style.background = isError //  Səhv və ya uğur fonu seçilir.
    ? "linear-gradient(135deg, #e84a5f, #a50e28)" //  Səhv üçün qırmızı ton.
    : "linear-gradient(135deg, #0a6fe8, #084db0)"; //  Normal hal üçün mavi ton.
  toast.classList.add("show"); //  Görünüş sinifini əlavə edirik.
  window.clearTimeout(toastTimer); //  Köhnə taymeri dayandırırıq.
  toastTimer = window.setTimeout(() => { //  Yeni gizlənmə taymeri qururuq.
    toast.classList.remove("show"); //  Müəyyən vaxtdan sonra toast gizlənir.
  }, 3000); //  3 saniyə sonra.
}

// ===============================================================
//  Bu funksiya URL-dəki sorğu parametrini oxuyur.
//  Məsələn ?id=123 kimi hissədən "id" dəyərini götürür.
// ===============================================================
function getParam(name) { //  name oxunacaq parametr adıdır.
  const params = new URLSearchParams(window.location.search); //  Cari URL sorğusunu parçalayırıq.
  return params.get(name); //  Lazım olan parametr dəyərini qaytarırıq.
}

// ===============================================================
//  Bu funksiya mətn daxilində axtarış üçün təhlükəsiz, kiçik hərfli forma yaradır.
// ===============================================================
function normalizeText(value = "") { //  Boş dəyər gəlsə də işləsin deyə default boş mətn veririk.
  return String(value).trim().toLowerCase(); //  Mətnə çevir, boşluqları sil, kiçik hərfə sal.
}

// ===============================================================
//  Bu funksiya qiyməti və ya mətn dəyərini ekranda təhlükəsiz göstərmək üçündür.
// ===============================================================
function safe(value, fallback = "—") { //  value yoxdursa fallback qaytarılır.
  return value === null || value === undefined || value === "" ? fallback : value; //  Boş yoxlama.
}

// ===============================================================
//  Bu funksiya tarix dəyərini oxunaqlı formaya salır.
// ===============================================================
function formatDate(dateValue) { //  dateValue bazadan gələn tarixdir.
  if (!dateValue) return "Unknown"; //  Tarix yoxdursa standart mətn.
  const date = new Date(dateValue); //  JavaScript Date obyektinə çeviririk.
  if (Number.isNaN(date.getTime())) return "Unknown"; //  Tarix yanlışdırsa qoruyuruq.
  return new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "long", day: "numeric" }).format(date); //  İngiliscə formatlayırıq.
}

// ===============================================================
//  Bu funksiya yazıların HTML içində təhlükəsiz görünməsi üçün xüsusi simvolları dəyişir.
// ===============================================================
function escapeHtml(value = "") { //  Xüsusi simvolları təhlükəsiz mətnə çevirir.
  return String(value)
    .replaceAll("&", "&amp;") //  & simvolunu HTML entity edir.
    .replaceAll("<", "&lt;") //  < simvolunu entity edir.
    .replaceAll(">", "&gt;") //  > simvolunu entity edir.
    .replaceAll('"', "&quot;") //  " simvolunu entity edir.
    .replaceAll("'", "&#39;"); //  ' simvolunu entity edir.
}

// ===============================================================
//  Bu funksiya kitabın kart HTML-ni hazırlayır.
//  Kart üzərinə klik ediləndə detail səhifəsinə keçid verir.
// ===============================================================
function createBookCard(book) { //  book obyektində bazadan gələn kitab məlumatı var.
  const category = safe(book.categories?.name, "General"); //  Kateqoriya adını götürürük.
  const author = safe(book.authors?.name, "Unknown Author"); //  Müəllif adını götürürük.
  const cover = book.cover_url || PLACEHOLDER_COVER; //  Qabıq varsa onu, yoxdursa placeholder.
  return `
    <article class="book-card">
      <a class="book-cover" href="book-details.html?id=${book.id}">
        <span class="badge">${escapeHtml(category)}</span>
        <img src="${escapeHtml(cover)}" alt="${escapeHtml(book.title)} cover">
      </a>
      <div class="book-body">
        <div class="meta-row">
          <span><i class="fa-solid fa-pen-nib"></i> ${escapeHtml(author)}</span>
          <span>${escapeHtml(safe(book.publish_year, "—"))}</span>
        </div>
        <h4 class="book-title clamp-2">${escapeHtml(book.title)}</h4>
        <p class="book-desc clamp-2">${escapeHtml(safe(book.short_description, "No summary available yet."))}</p>
        <div class="meta-row">
          <a class="btn btn-secondary" href="book-details.html?id=${book.id}">Open Details</a>
          <button class="btn btn-ghost favorite-toggle" data-book-id="${book.id}">
            <i class="fa-regular fa-heart"></i>
            Save
          </button>
        </div>
      </div>
    </article>
  `; //  Hazır kart HTML mətnini qaytarırıq.
}

// ===============================================================
//  Bu funksiya müəllif kartını yaradır.
//  Kart author-details səhifəsinə açılır.
// ===============================================================
function createAuthorCard(author) { //  author obyektini qəbul edir.
  return `
    <a class="author-card" href="author-details.html?id=${author.id}">
      <div class="tag">${escapeHtml(safe(author.nationality, "Author"))}</div>
      <h4>${escapeHtml(author.name)}</h4>
      <p class="muted clamp-2">${escapeHtml(safe(author.biography, "A curated author profile with selected books and background."))}</p>
    </a>
  `; //  Müəllif kartının HTML nəticəsi.
}

// ===============================================================
//  Bu funksiya cari istifadəçini oxuyur.
// ===============================================================
async function getCurrentUser() { //  Supabase auth sessiyasından istifadəçi alınır.
  const { data, error } = await sb.auth.getUser(); //  Giriş etmiş user məlumatı.
  if (error) { //  Səhv baş veribsə.
    console.error(error); //  Konsolda göstər.
    return null; //  Boş qaytar.
  }
  return data.user || null; //  User varsa onu, yoxdursa null qaytar.
}

// ===============================================================
//  Bu funksiya istifadəçinin profilini bazadan oxuyur.
// ===============================================================
async function getProfile(userId) { //  userId auth istifadəçi identifikatorudur.
  if (!userId) return null; //  userId yoxdursa dayan.
  const { data, error } = await sb //  Supabase sorğusunu başlayırıq.
    .from("profiles") //  profiles cədvəlindən.
    .select("*") //  Bütün sütunları götürürük.
    .eq("id", userId) //  id userId-yə bərabər olsun.
    .single(); //  Tək sətir gözləyirik.
  if (error) { //  Səhv halı.
    console.error(error); //  Konsola yaz.
    return null; //  Null qaytar.
  }
  return data; //  Profil məlumatını qaytarırıq.
}

// ===============================================================
//  Bu funksiya header-də user vəziyyətini yeniləyir.
//  Login, logout, profile linklərini buna görə göstərir.
// ===============================================================
async function renderHeaderAuth() { //  Başlıq sağ hissəsini dinamik qurur.
  const holder = $("#authActions"); //  Header auth konteyneri.
  if (!holder) return; //  Element yoxdursa dayan.
  const user = await getCurrentUser(); //  Cari istifadəçi məlumatını alırıq.
  if (!user) { //  User giriş etməyibsə.
    holder.innerHTML = `
      <a class="btn btn-secondary" href="login.html">Log In</a>
      <a class="btn btn-primary" href="register.html">Sign Up</a>
    `; //  Qonaq düymələri göstərilir.
    return; //  Funksiyanı bitiririk.
  }
  const profile = await getProfile(user.id); //  İstifadəçi profilini alırıq.
  const isAdmin = profile?.role === "admin"; //  Admin olub-olmadığını yoxlayırıq.
  holder.innerHTML = `
    <a class="btn btn-secondary" href="favorites.html">Favorites</a>
    <a class="btn btn-secondary" href="profile.html">Profile</a>
    ${isAdmin ? '<a class="btn btn-secondary" href="admin.html">Admin</a>' : ""}
    <button class="btn btn-primary" id="logoutBtn">Log Out</button>
  `; //  Giriş etmiş istifadəçi menyusu.
  $("#logoutBtn")?.addEventListener("click", async () => { //  Çıxış düyməsinə klik.
    const { error } = await sb.auth.signOut(); //  Sessiyanı bağlayırıq.
    if (error) { //  Səhv halı.
      showToast(error.message, true); //  İstifadəçiyə göstər.
      return; //  Dayan.
    }
    showToast("You have been logged out."); //  Uğurlu mesajı.
    window.location.href = "index.html"; //  Ana səhifəyə yönləndir.
  });
}

// ===============================================================
//  Bu funksiya ümumi kitab sorğusunu qurur.
//  title, author, description və category üzrə axtarış edə bilir.
// ===============================================================
async function fetchBooks(options = {}) { //  options ilə filter, limit və kateqoriya verilə bilər.
  const queryText = normalizeText(options.query || ""); //  Axtarış mətnini normallaşdırırıq.
  let query = sb //  Sorğunu başladırıq.
    .from("books") //  books cədvəli.
    .select(`
      *,
      authors ( id, name, biography, nationality ),
      categories ( id, name, slug )
    `) //  Əlaqəli müəllif və kateqoriyanı da gətir.
    .eq("is_published", true) //  Yalnız görünən kitablar.
    .order("created_at", { ascending: false }); //  Yenilər yuxarıda olsun.

  if (options.categoryId) { //  Kateqoriya filteri varsa.
    query = query.eq("category_id", options.categoryId); //  Həmin kateqoriyaya görə süzürük.
  }

  if (options.limit) { //  Limit verilibsə.
    query = query.limit(options.limit); //  Sorğunu limitləyirik.
  }

  const { data, error } = await query; //  Sorğunu icra edirik.
  if (error) { //  Səhv baş veribsə.
    console.error(error); //  Konsola yaz.
    showToast("Unable to load books right now.", true); //  İstifadəçiyə bildir.
    return []; //  Boş massiv qaytar.
  }

  if (!queryText) return data || []; //  Axtarış mətni yoxdursa bütün nəticəni qaytar.

  return (data || []).filter((book) => { //  Frontend tərəfdə çoxsahəli filter.
    const haystack = normalizeText([
      book.title,
      book.short_description,
      book.description,
      book.categories?.name,
      book.authors?.name,
      book.authors?.biography,
    ].join(" ")); //  Axtarılacaq mətnləri birləşdiririk.
    return haystack.includes(queryText); //  Sorğu mətni bu birləşmənin içindədirsə saxla.
  });
}

// ===============================================================
//  Bu funksiya bütün müəllifləri oxuyur.
// ===============================================================
async function fetchAuthors(limit = null) { //  İstəyə görə limit qəbul edir.
  let query = sb.from("authors").select("*").order("name", { ascending: true }); //  Müəlliflər əlifba sırası ilə.
  if (limit) query = query.limit(limit); //  Limit varsa tətbiq edirik.
  const { data, error } = await query; //  Sorğunu işləyirik.
  if (error) { //  Səhv halı.
    console.error(error); //  Konsola yaz.
    return []; //  Boş massiv.
  }
  return data || []; //  Nəticəni qaytar.
}

// ===============================================================
//  Bu funksiya kateqoriyaları oxuyur.
// ===============================================================
async function fetchCategories() { //  Kateqoriya siyahısı üçün.
  const { data, error } = await sb.from("categories").select("*").order("name", { ascending: true }); //  Əlifba sırası.
  if (error) { //  Səhv halı.
    console.error(error); //  Konsol.
    return []; //  Boş nəticə.
  }
  return data || []; //  Kateqoriyaları qaytar.
}

// ===============================================================
//  Bu funksiya home səhifəsində müəllif lentini qurur.
//  Vizual effekti davamlı etmək üçün massiv iki dəfə təkrarlanır.
// ===============================================================
async function renderAuthorMarquee() { //  Ana səhifə müəllif marqısı.
  const container = $("#authorTrack"); //  Track elementi.
  if (!container) return; //  Yoxdursa çıx.
  const authors = await fetchAuthors(8); //  İlk müəllifləri alırıq.
  const looped = [...authors, ...authors]; //  Davamlı animasiya üçün ikiqatlayırıq.
  container.innerHTML = looped.length
    ? looped.map(createAuthorCard).join("") //  Kartları HTML-ə çevir.
    : `<div class="empty-state">Authors will appear here after records are added.</div>`; //  Boş hal.
}

// ===============================================================
//  Bu funksiya kitab gridini ekranda göstərir.
// ===============================================================
async function renderBooksGrid(selector, options = {}) { //  selector hədəf konteynerdir.
  const holder = $(selector); //  Hədəf element.
  if (!holder) return; //  Tapılmadısa dayan.
  holder.innerHTML = `<div class="spinner"></div>`; //  Gözləmə vəziyyəti.
  const books = await fetchBooks(options); //  Kitabları alırıq.
  holder.innerHTML = books.length
    ? books.map(createBookCard).join("") //  Kartları yerləşdir.
    : `<div class="empty-state">No books matched your current search.</div>`; //  Boş vəziyyət.
  bindFavoriteButtons(); //  Yeni yaranan düymələrə event bağla.
}

// ===============================================================
//  Bu funksiya kitab detalını bazadan oxuyur.
// ===============================================================
async function fetchBookById(bookId) { //  bookId URL-dən gəlir.
  const { data, error } = await sb
    .from("books")
    .select(`
      *,
      authors ( id, name, biography, nationality, birth_year ),
      categories ( id, name, slug )
    `)
    .eq("id", bookId)
    .single(); //  Tək kitab qaytarılır.
  if (error) { //  Səhv halı.
    console.error(error); //  Konsol.
    return null; //  Null.
  }
  return data; //  Kitabı qaytar.
}

// ===============================================================
//  Bu funksiya müəllif detalını bazadan oxuyur.
// ===============================================================
async function fetchAuthorById(authorId) { //  authorId URL parametridir.
  const { data, error } = await sb.from("authors").select("*").eq("id", authorId).single(); //  Tək müəllif sorğusu.
  if (error) { //  Səhv varsa.
    console.error(error); //  Konsol.
    return null; //  Null.
  }
  return data; //  Müəllif məlumatı.
}

// ===============================================================
//  Bu funksiya detail səhifəsini qurur.
//  Seçilən kitab yuxarıda, digər kitablar aşağıda göstərilir.
// ===============================================================
async function renderBookDetailPage() { //  book-details.html üçün əsas loader.
  const holder = $("#bookDetailSection"); //  Məzmun konteyneri.
  if (!holder) return; //  Yoxdursa dayan.
  const bookId = getParam("id"); //  URL-dən id oxu.
  if (!bookId) { //  id yoxdursa.
    holder.innerHTML = `<div class="empty-state">No book has been selected.</div>`; //  Boş mesaj.
    return; //  Dayan.
  }
  holder.innerHTML = `<div class="spinner"></div>`; //  Gözləmə görünüşü.
  const book = await fetchBookById(bookId); //  Kitabı al.
  if (!book) { //  Tapılmadısa.
    holder.innerHTML = `<div class="empty-state">This book could not be found.</div>`; //  Xəta məzmunu.
    return; //  Dayan.
  }
  document.title = `${book.title} | BlueShelf Bookstore`; //  Səhifə başlığını dəyişirik.
  const cover = book.cover_url || PLACEHOLDER_COVER; //  Qabıq URL-i.
  holder.innerHTML = `
    <div class="panel detail-layout">
      <div class="detail-cover">
        <img src="${escapeHtml(cover)}" alt="${escapeHtml(book.title)} cover">
      </div>
      <div class="detail-info">
        <div class="inline-list">
          <span class="tag">${escapeHtml(safe(book.categories?.name, "General"))}</span>
          <span class="tag">${escapeHtml(safe(book.format_type, "Paperback"))}</span>
          <span class="tag">${escapeHtml(safe(book.language, "English"))}</span>
        </div>
        <h2>${escapeHtml(book.title)}</h2>
        <p class="muted">by <a href="author-details.html?id=${book.authors?.id || ""}">${escapeHtml(safe(book.authors?.name, "Unknown Author"))}</a></p>
        <div class="info-list">
          <div class="info-item"><strong>Published</strong><br>${escapeHtml(safe(book.publish_year, "Unknown"))}</div>
          <div class="info-item"><strong>Pages</strong><br>${escapeHtml(safe(book.pages, "Unknown"))}</div>
          <div class="info-item"><strong>ISBN</strong><br>${escapeHtml(safe(book.isbn, "Not provided"))}</div>
          <div class="info-item"><strong>Location</strong><br>Online shelf</div>
        </div>
        <p>${escapeHtml(safe(book.description, book.short_description || "No detailed description available yet."))}</p>
        <div class="meta-row">
          <button class="btn btn-primary favorite-toggle" data-book-id="${book.id}">
            <i class="fa-regular fa-heart"></i>
            Add to Favorites
          </button>
          <a class="btn btn-secondary" href="index.html#books">Back to Collection</a>
        </div>
      </div>
    </div>
  `; //  Seçilmiş kitab detali.
  bindFavoriteButtons(); //  Favorit düyməsini aktivləşdiririk.
  await renderBooksGrid("#relatedBooksGrid", { categoryId: book.category_id, limit: 4 }); //  Aşağıda oxşar kitablar.
}

// ===============================================================
//  Bu funksiya müəllif detal səhifəsini qurur.
// ===============================================================
async function renderAuthorDetailPage() { //  author-details.html üçün.
  const holder = $("#authorDetailSection"); //  Hədəf konteyner.
  if (!holder) return; //  Yoxdursa çıx.
  const authorId = getParam("id"); //  URL parametrindən id.
  if (!authorId) { //  id yoxdursa.
    holder.innerHTML = `<div class="empty-state">No author has been selected.</div>`; //  Boş hal.
    return; //  Dayan.
  }
  holder.innerHTML = `<div class="spinner"></div>`; //  Gözləmə indikatoru.
  const author = await fetchAuthorById(authorId); //  Müəllifi al.
  if (!author) { //  Tapılmadısa.
    holder.innerHTML = `<div class="empty-state">Author information is unavailable.</div>`; //  Mesaj.
    return; //  Dayan.
  }
  const books = await fetchBooks({}); //  Müəllifin kitablarını frontend-də süzəcəyik.
  const byAuthor = books.filter((book) => book.author_id === author.id); //  Həmin müəllifə aid kitablar.
  holder.innerHTML = `
    <div class="panel">
      <div class="inline-list">
        <span class="tag">${escapeHtml(safe(author.nationality, "Author"))}</span>
        <span class="tag">${escapeHtml(safe(author.birth_year, "Unknown birth year"))}</span>
      </div>
      <h2>${escapeHtml(author.name)}</h2>
      <p>${escapeHtml(safe(author.biography, "Biography has not been added yet."))}</p>
    </div>
  `; //  Müəllif paneli.
  const grid = $("#authorBooksGrid"); //  Kitablar üçün grid.
  if (grid) { //  Element varsa.
    grid.innerHTML = byAuthor.length ? byAuthor.map(createBookCard).join("") : `<div class="empty-state">No books for this author yet.</div>`; //  Kartları göstər.
    bindFavoriteButtons(); //  Favorit düymələrinə klik bağla.
  }
}

// ===============================================================
//  Bu funksiya qeydiyyat formasını idarə edir.
//  Auth user yaradır və profil məlumatını trigger vasitəsilə əlavə etdirir.
// ===============================================================
function bindRegisterForm() { //  register.html üçün.
  const form = $("#registerForm"); //  Forma elementi.
  if (!form) return; //  Yoxdursa çıx.
  form.addEventListener("submit", async (event) => { //  Submit hadisəsi.
    event.preventDefault(); //  Brauzerin yenilənməsini dayandırırıq.
    const formData = new FormData(form); //  Form dəyərlərini yığırıq.
    const email = formData.get("email"); //  Email dəyəri.
    const password = formData.get("password"); //  Şifrə dəyəri.
    const fullName = formData.get("full_name"); //  Ad və soyad.
    const address = formData.get("address"); //  Ünvan.
    const bio = formData.get("bio"); //  Qısa bio.
    const { data, error } = await sb.auth.signUp({ //  Supabase auth qeydiyyatı.
      email, //  İstifadəçi emaili.
      password, //  İstifadəçi şifrəsi.
      options: { //  Meta məlumatlar.
        data: { //  auth metadata obyektidir.
          full_name: fullName, //  Tam ad saxlanır.
          address, //  Ünvan saxlanır.
          bio, //  Bio saxlanır.
        },
      },
    });
    if (error) { //  Səhv halı.
      showToast(error.message, true); //  İstifadəçiyə göstər.
      return; //  Dayan.
    }
    if (data.user?.id) { //  User uğurla yaranıbsa.
      await sb.from("profiles").upsert({ //  Profil məlumatını əlavə və ya yenilə.
        id: data.user.id, //  Profil id auth user id ilə eyni olur.
        full_name: fullName, //  Tam ad.
        address, //  Ünvan.
        bio, //  Bio.
        email, //  Email.
      }); //  upsert birdən çox vəziyyəti rahat idarə edir.
    }
    showToast("Registration complete. Please check your email if confirmation is enabled."); //  Uğurlu mesaj.
    form.reset(); //  Formanı təmizlə.
  });
}

// ===============================================================
//  Bu funksiya login formasını idarə edir.
// ===============================================================
function bindLoginForm() { //  login.html üçün.
  const form = $("#loginForm"); //  Login forması.
  if (!form) return; //  Yoxdursa çıx.
  form.addEventListener("submit", async (event) => { //  Submit hadisəsi.
    event.preventDefault(); //  Default davranışı dayandırırıq.
    const formData = new FormData(form); //  Form dəyərlərini oxuyuruq.
    const email = formData.get("email"); //  Email.
    const password = formData.get("password"); //  Şifrə.
    const { error } = await sb.auth.signInWithPassword({ email, password }); //  Email/şifrə ilə giriş.
    if (error) { //  Səhv halı.
      showToast(error.message, true); //  Xəta toastı.
      return; //  Dayan.
    }
    showToast("Welcome back."); //  Uğurlu giriş mesajı.
    window.location.href = "index.html"; //  Ana səhifəyə yönləndir.
  });
}

// ===============================================================
//  Bu funksiya şifrə sıfırlama formasını idarə edir.
// ===============================================================
function bindResetPasswordForm() { //  reset-password.html üçün.
  const form = $("#resetForm"); //  Reset forması.
  if (!form) return; //  Yoxdursa çıx.
  form.addEventListener("submit", async (event) => { //  Submit.
    event.preventDefault(); //  Default submit dayanır.
    const email = new FormData(form).get("email"); //  Email dəyərini götürürük.
    const redirectTo = `${window.location.origin}${window.location.pathname.replace("reset-password.html", "profile.html")}`; //  Reset linkdən sonra yönləndiriləcək ünvan.
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo }); //  Şifrə yeniləmə email-i göndəririk.
    if (error) { //  Səhv halı.
      showToast(error.message, true); //  Xəta göstər.
      return; //  Dayan.
    }
    showToast("Password reset email has been sent."); //  Uğurlu mesaj.
    form.reset(); //  Formanı təmizlə.
  });
}

// ===============================================================
//  Bu funksiya istifadəçi profil səhifəsini yükləyir və redaktəni işləyir.
// ===============================================================
async function bindProfilePage() { //  profile.html üçün.
  const form = $("#profileForm"); //  Profil forması.
  if (!form) return; //  Element yoxdursa çıx.
  const user = await getCurrentUser(); //  Giriş etmiş user.
  if (!user) { //  Giriş yoxdursa.
    showToast("Please log in to view your profile.", true); //  Bildiriş.
    window.location.href = "login.html"; //  Login səhifəsinə yönləndir.
    return; //  Dayan.
  }
  const profile = await getProfile(user.id); //  Profil məlumatı.
  $("#profileEmail").value = profile?.email || user.email || ""; //  Email sahəsi.
  $("#profileName").value = profile?.full_name || ""; //  Ad sahəsi.
  $("#profileAddress").value = profile?.address || ""; //  Ünvan sahəsi.
  $("#profileAvatar").value = profile?.avatar_url || ""; //  Şəkil URL sahəsi.
  $("#profileBio").value = profile?.bio || ""; //  Bio sahəsi.
  form.addEventListener("submit", async (event) => { //  Profil yenilə.
    event.preventDefault(); //  Standart submit dayanır.
    const payload = { //  Yenilənəcək obyekt.
      id: user.id, //  Profil ID.
      email: user.email, //  Email.
      full_name: $("#profileName").value.trim(), //  Tam ad.
      address: $("#profileAddress").value.trim(), //  Ünvan.
      avatar_url: $("#profileAvatar").value.trim(), //  Avatar URL.
      bio: $("#profileBio").value.trim(), //  Bio.
      updated_at: new Date().toISOString(), //  Yenilənmə tarixi.
    };
    const { error } = await sb.from("profiles").upsert(payload); //  Profili yeniləyirik.
    if (error) { //  Səhv halı.
      showToast(error.message, true); //  Xəta.
      return; //  Dayan.
    }
    showToast("Profile updated successfully."); //  Uğur.
  });
}

// ===============================================================
//  Bu funksiya favori düymələrinə klik hadisəsi bağlayır.
// ===============================================================
function bindFavoriteButtons() { //  Dinamik kartlar yeniləndikdən sonra çağırılır.
  $$(".favorite-toggle").forEach((button) => { //  Bütün favorit düymələri üzrə dönürük.
    button.addEventListener("click", async () => { //  Klik hadisəsi.
      const user = await getCurrentUser(); //  Cari istifadəçi.
      if (!user) { //  Giriş etməyibsə.
        showToast("Please log in to save favorites.", true); //  Mesaj.
        window.location.href = "login.html"; //  Login-ə yönləndir.
        return; //  Dayan.
      }
      const bookId = button.dataset.bookId; //  data-book-id atributu.
      const { error } = await sb.from("favorites").insert({ user_id: user.id, book_id: bookId }); //  Favorit əlavə.
      if (error && !error.message.toLowerCase().includes("duplicate")) { //  Duplicate istisna olmaqla səhv.
        showToast(error.message, true); //  Xəta göstər.
        return; //  Dayan.
      }
      showToast("Book saved to favorites."); //  Uğurlu mesaj.
    }, { once: true }); //  Eyni düyməyə təkrar çoxsaylı bağlanmanın qarşısını alır.
  });
}

// ===============================================================
//  Bu funksiya favorit səhifəsini doldurur.
// ===============================================================
async function renderFavoritesPage() { //  favorites.html üçün.
  const holder = $("#favoritesGrid"); //  Hədəf grid.
  if (!holder) return; //  Yoxdursa çıx.
  const user = await getCurrentUser(); //  Cari user.
  if (!user) { //  Login edilməyibsə.
    showToast("Please log in to access your favorites.", true); //  Bildiriş.
    window.location.href = "login.html"; //  Login-ə keç.
    return; //  Dayan.
  }
  holder.innerHTML = `<div class="spinner"></div>`; //  Gözləmə.
  const { data, error } = await sb //  Favorit sorğusu.
    .from("favorites")
    .select(`
      id,
      books (
        *,
        authors ( id, name, biography, nationality ),
        categories ( id, name, slug )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false }); //  Son əlavə edilənlər yuxarıda.
  if (error) { //  Səhv halı.
    showToast(error.message, true); //  Xəta.
    holder.innerHTML = `<div class="empty-state">Favorites could not be loaded.</div>`; //  Boş vəziyyət.
    return; //  Dayan.
  }
  const books = (data || []).map((row) => row.books).filter(Boolean); //  İçindəki book obyektlərini çıxardırıq.
  holder.innerHTML = books.length ? books.map(createBookCard).join("") : `<div class="empty-state">Your saved books will appear here.</div>`; //  Kartlar və ya boş hal.
  bindFavoriteButtons(); //  Favorit düymələrini yenidən bağla.
}

// ===============================================================
//  Bu funksiya home səhifə axtarışını qurur.
// ===============================================================
function bindHeroSearch() { //  index.html üçün.
  const form = $("#searchForm"); //  Axtarış forması.
  if (!form) return; //  Tapılmadısa çıx.
  form.addEventListener("submit", async (event) => { //  Submit.
    event.preventDefault(); //  Default submit dayanır.
    const query = $("#searchInput")?.value || ""; //  Input dəyərini oxuyuruq.
    if (page !== "home") { //  Ana səhifədə deyiliksə.
      window.location.href = `index.html?search=${encodeURIComponent(query)}`; //  Sorğunu URL ilə home səhifəyə ötürürük.
      return; //  Cari səhifədə davam etmirik.
    }
    await renderBooksGrid("#booksGrid", { query, limit: 12 }); //  Filtrlənmiş kitabları göstəririk.
    document.getElementById("books")?.scrollIntoView({ behavior: "smooth" }); //  Kitablar bölməsinə sürüşdürürük.
  });
}

// ===============================================================
//  Bu funksiya admin səhifəsinin icazəsini yoxlayır.
// ===============================================================
async function assertAdmin() { //  Admin panelə giriş üçün.
  const user = await getCurrentUser(); //  Cari user.
  if (!user) { //  Giriş yoxdursa.
    showToast("Please log in first.", true); //  Mesaj.
    window.location.href = "login.html"; //  Login səhifəsinə.
    return null; //  Null qaytar.
  }
  const profile = await getProfile(user.id); //  Profil məlumatı.
  if (profile?.role !== "admin") { //  Admin deyilsə.
    showToast("Admin access is required.", true); //  Xəta.
    window.location.href = "index.html"; //  Ana səhifəyə qaytar.
    return null; //  Null.
  }
  return user; //  İcazə varsa user qaytar.
}

// ===============================================================
//  Bu funksiya admin üçün kateqoriya seçimlərini doldurur.
// ===============================================================
async function populateCategorySelect(selector) { //  selector select elementidir.
  const select = $(selector); //  Select-i tuturuq.
  if (!select) return; //  Yoxdursa çıx.
  const categories = await fetchCategories(); //  Kateqoriyaları al.
  select.innerHTML = `<option value="">Select category</option>` + categories.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join(""); //  Option-ları qur.
}

// ===============================================================
//  Bu funksiya admin üçün müəllif seçimlərini doldurur.
// ===============================================================
async function populateAuthorSelect(selector) { //  selector select elementidir.
  const select = $(selector); //  Select elementi.
  if (!select) return; //  Yoxdursa çıx.
  const authors = await fetchAuthors(); //  Müəllifləri alırıq.
  select.innerHTML = `<option value="">Select author</option>` + authors.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join(""); //  Option HTML-si.
}

// ===============================================================
//  Bu funksiya admin cədvəlini kitablarla doldurur.
// ===============================================================
async function renderAdminBooksTable() { //  Admin kitab siyahısı.
  const body = $("#adminBooksTableBody"); //  tbody elementi.
  if (!body) return; //  Yoxdursa çıx.
  const books = await fetchBooks({ limit: 100 }); //  Kitabları al.
  body.innerHTML = books.length ? books.map((book) => `
    <tr>
      <td>${escapeHtml(book.title)}</td>
      <td>${escapeHtml(safe(book.authors?.name, "Unknown"))}</td>
      <td>${escapeHtml(safe(book.categories?.name, "General"))}</td>
      <td>${escapeHtml(safe(book.publish_year, "—"))}</td>
      <td>
        <div class="inline-list">
          <button class="btn btn-secondary admin-edit" data-book-id="${book.id}">Edit</button>
          <button class="btn btn-ghost admin-delete" data-book-id="${book.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("") : `<tr><td colspan="5">No books in the catalog yet.</td></tr>`; //  Cədvəl sətirləri.
  bindAdminTableActions(books); //  Edit və delete düymələrinə klik bağla.
}

// ===============================================================
//  Bu funksiya şəkli Supabase storage-a yükləyir.
// ===============================================================
async function uploadBookCover(file) { //  file input-dan gələn fayl.
  if (!file) return ""; //  Fayl yoxdursa boş sətir qaytar.
  const fileExt = file.name.split(".").pop(); //  Fayl uzantısı.
  const fileName = `cover-${Date.now()}.${fileExt}`; //  Unikal ad yaradırıq.
  const filePath = `public/${fileName}`; //  Bucket içində yol.
  const { error } = await sb.storage.from("book-covers").upload(filePath, file, { upsert: false }); //  Storage upload.
  if (error) { //  Səhv halı.
    throw error; //  Yuxarı funksiyaya ötürürük.
  }
  const { data } = sb.storage.from("book-covers").getPublicUrl(filePath); //  Public URL alırıq.
  return data.publicUrl; //  Şəkil URL-ni qaytarırıq.
}

// ===============================================================
//  Bu funksiya admin formasını işləyir.
//  Yeni kitab əlavə etmə və mövcud kitabı redaktə etmə eyni formadadır.
// ===============================================================
async function bindAdminPage() { //  admin.html üçün əsas loader.
  const user = await assertAdmin(); //  Admin yoxlaması.
  if (!user) return; //  İcazə yoxdursa dayan.
  await populateCategorySelect("#bookCategory"); //  Kateqoriya select doldurulur.
  await populateAuthorSelect("#bookAuthor"); //  Müəllif select doldurulur.
  await renderAdminBooksTable(); //  Kitab cədvəli qurulur.
  bindAddCategoryForm(); //  Kateqoriya əlavə formu.
  bindAddAuthorForm(); //  Müəllif əlavə formu.

  const form = $("#bookForm"); //  Kitab forması.
  if (!form) return; //  Form yoxdursa çıx.
  form.addEventListener("submit", async (event) => { //  Submit hadisəsi.
    event.preventDefault(); //  Səhifənin yenilənməsinin qarşısı alınır.
    try { //  Upload və DB əməliyyatları üçün qoruyucu blok.
      const formData = new FormData(form); //  Form məlumatları.
      const editId = $("#bookId").value.trim(); //  Dolu olarsa redaktə rejimidir.
      const coverFile = $("#bookCoverFile").files[0]; //  Fayl input-dan şəkil.
      let coverUrl = $("#bookCoverUrl").value.trim(); //  Əvvəlki URL və ya əl ilə URL.
      if (coverFile) { //  Yeni şəkil seçilibsə.
        coverUrl = await uploadBookCover(coverFile); //  Storage-a yükləyib public URL alırıq.
      }
      const payload = { //  books cədvəlinə gedəcək obyekt.
        title: formData.get("title"), //  Kitab adı.
        author_id: formData.get("author_id"), //  Müəllif id.
        category_id: formData.get("category_id"), //  Kateqoriya id.
        short_description: formData.get("short_description"), //  Qısa açıqlama.
        description: formData.get("description"), //  Tam açıqlama.
        publish_year: Number(formData.get("publish_year")) || null, //  Nəşr ili.
        pages: Number(formData.get("pages")) || null, //  Səhifə sayı.
        isbn: formData.get("isbn"), //  ISBN.
        language: formData.get("language"), //  Dil.
        format_type: formData.get("format_type"), //  Format.
        cover_url: coverUrl, //  Şəkil URL.
        is_published: true, //  Saytda göstərilsin.
      };
      const response = editId //  Əgər editId varsa update, yoxdursa insert.
        ? await sb.from("books").update(payload).eq("id", editId) //  Mövcud kitabı yenilə.
        : await sb.from("books").insert(payload); //  Yeni kitab əlavə et.
      if (response.error) throw response.error; //  Səhv varsa try/catch-ə ötür.
      showToast(editId ? "Book updated successfully." : "New book added successfully."); //  Uğur.
      form.reset(); //  Formu təmizlə.
      $("#bookId").value = ""; //  Edit gizli sahəsini sıfırla.
      await renderAdminBooksTable(); //  Cədvəli yenilə.
    } catch (error) { //  Xəta tutma bloku.
      console.error(error); //  Konsola yaz.
      showToast(error.message || "Admin action failed.", true); //  İstifadəçiyə göstər.
    }
  });
}

// ===============================================================
//  Bu funksiya admin cədvəlində edit və delete əməliyyatlarını bağlayır.
// ===============================================================
function bindAdminTableActions(books) { //  books render edilmiş kitab massividir.
  $$(".admin-edit").forEach((button) => { //  Bütün edit düymələri.
    button.addEventListener("click", () => { //  Klik hadisəsi.
      const bookId = button.dataset.bookId; //  data-book-id dəyəri.
      const book = books.find((item) => String(item.id) === String(bookId)); //  Həmin kitabı massivdə tapırıq.
      if (!book) return; //  Tapılmazsa çıx.
      $("#bookId").value = book.id; //  Gizli id sahəsinə yaz.
      $("#bookTitle").value = book.title || ""; //  Form sahələrini doldur.
      $("#bookAuthor").value = book.author_id || ""; //  Müəllif select.
      $("#bookCategory").value = book.category_id || ""; //  Kateqoriya select.
      $("#bookShortDescription").value = book.short_description || ""; //  Qısa təsvir.
      $("#bookDescription").value = book.description || ""; //  Tam təsvir.
      $("#bookPublishYear").value = book.publish_year || ""; //  Nəşr ili.
      $("#bookPages").value = book.pages || ""; //  Səhifə sayı.
      $("#bookIsbn").value = book.isbn || ""; //  ISBN.
      $("#bookLanguage").value = book.language || "English"; //  Dil.
      $("#bookFormat").value = book.format_type || "Paperback"; //  Format.
      $("#bookCoverUrl").value = book.cover_url || ""; //  Qabıq URL.
      window.scrollTo({ top: 0, behavior: "smooth" }); //  Formun olduğu yerə yuxarı çıxırıq.
      showToast("Book data loaded into the form."); //  İstifadəçiyə xəbər.
    });
  });

  $$(".admin-delete").forEach((button) => { //  Bütün delete düymələri.
    button.addEventListener("click", async () => { //  Klik hadisəsi.
      const confirmed = window.confirm("Delete this book from the catalog?"); //  Təsdiq pəncərəsi.
      if (!confirmed) return; //  Ləğv edilərsə çıx.
      const { error } = await sb.from("books").delete().eq("id", button.dataset.bookId); //  DB-dən silirik.
      if (error) { //  Səhv halı.
        showToast(error.message, true); //  Xəta.
        return; //  Dayan.
      }
      showToast("Book deleted."); //  Uğurlu mesaj.
      await renderAdminBooksTable(); //  Cədvəli yenilə.
    });
  });
}

// ===============================================================
//  Bu funksiya admin paneldə yeni kateqoriya əlavə edir.
// ===============================================================
function bindAddCategoryForm() { //  categoryForm üçün.
  const form = $("#categoryForm"); //  Forma elementi.
  if (!form) return; //  Yoxdursa çıx.
  form.addEventListener("submit", async (event) => { //  Submit hadisəsi.
    event.preventDefault(); //  Default submit dayanır.
    const name = $("#categoryName").value.trim(); //  Kateqoriya adı.
    if (!name) return; //  Boşdursa çıx.
    const slug = normalizeText(name).replace(/\s+/g, "-"); //  URL-dostu slug hazırlayırıq.
    const { error } = await sb.from("categories").insert({ name, slug }); //  Cədvələ əlavə.
    if (error) { //  Səhv halı.
      showToast(error.message, true); //  Xəta.
      return; //  Dayan.
    }
    showToast("Category added."); //  Uğurlu mesaj.
    form.reset(); //  Form təmizlə.
    await populateCategorySelect("#bookCategory"); //  Select yenilə.
  });
}

// ===============================================================
//  Bu funksiya admin paneldə yeni müəllif əlavə edir.
// ===============================================================
function bindAddAuthorForm() { //  authorForm üçün.
  const form = $("#authorForm"); //  Forma elementi.
  if (!form) return; //  Yoxdursa çıx.
  form.addEventListener("submit", async (event) => { //  Submit.
    event.preventDefault(); //  Default submit dayanır.
    const payload = { //  authors cədvəli üçün obyekt.
      name: $("#authorName").value.trim(), //  Müəllif adı.
      nationality: $("#authorNationality").value.trim(), //  Mənsubiyyət.
      birth_year: Number($("#authorBirthYear").value) || null, //  Doğum ili.
      biography: $("#authorBiography").value.trim(), //  Bio.
    };
    const { error } = await sb.from("authors").insert(payload); //  DB insert.
    if (error) { //  Səhv halı.
      showToast(error.message, true); //  Xəta.
      return; //  Dayan.
    }
    showToast("Author added."); //  Uğur.
    form.reset(); //  Form təmizlə.
    await populateAuthorSelect("#bookAuthor"); //  Müəllif select yenilə.
    await renderAuthorMarquee(); //  Ana səhifə müəllifləri də gələcəkdə yenilənsin.
  });
}

// ===============================================================
//  Bu funksiya home səhifədə ümumi statistikaları qurur.
// ===============================================================
async function renderHomeStats() { //  Hero altındakı rəqəmlər üçün.
  const totalBooksEl = $("#statBooks"); //  Kitab sayı elementi.
  const totalAuthorsEl = $("#statAuthors"); //  Müəllif sayı elementi.
  const totalCategoriesEl = $("#statCategories"); //  Kateqoriya sayı elementi.
  if (!totalBooksEl || !totalAuthorsEl || !totalCategoriesEl) return; //  Hər hansı element yoxdursa çıx.
  const books = await fetchBooks({}); //  Kitabları alırıq.
  const authors = await fetchAuthors(); //  Müəllifləri alırıq.
  const categories = await fetchCategories(); //  Kateqoriyaları alırıq.
  totalBooksEl.textContent = books.length; //  Kitab sayı.
  totalAuthorsEl.textContent = authors.length; //  Müəllif sayı.
  totalCategoriesEl.textContent = categories.length; //  Kateqoriya sayı.
}

// ===============================================================
//  Bu funksiya səhifədəki ümumi footer məlumatlarını doldurur.
// ===============================================================
function renderStaticFooter() { //  Ünvan və əlaqə hissəsi.
  const yearEl = $("#currentYear"); //  Cari il elementi.
  if (yearEl) yearEl.textContent = new Date().getFullYear(); //  İli avtomatik yeniləyirik.
}

// ===============================================================
//  Bu funksiya bütün səhifələrin başlanğıc işlərini birləşdirir.
// ===============================================================
async function boot() { //  Səhifə ilk açıldıqda çağırılır.
  renderStaticFooter(); //  Footer ilini doldur.
  await renderHeaderAuth(); //  Header auth vəziyyəti.
  bindHeroSearch(); //  Home search form eventləri.
  bindRegisterForm(); //  Register form eventləri.
  bindLoginForm(); //  Login form eventləri.
  bindResetPasswordForm(); //  Reset form eventləri.
  await renderAuthorMarquee(); //  Müəllif marqısı.
  await renderHomeStats(); //  Sayğaclar.
  if (page === "home") { //  Ana səhifədə kitabları göstər.
    const initialQuery = getParam("search") || ""; //  URL-də search parametri varsa oxuyuruq.
    const searchInput = $("#searchInput"); //  Header input-u.
    if (searchInput) searchInput.value = initialQuery; //  Sorğunu input-da göstəririk.
    await renderBooksGrid("#booksGrid", { limit: 8, query: initialQuery }); //  İlk açılışda və ya URL sorğusunda kitabları göstər.
  }
  if (page === "book-detail") { //  Detail səhifəsi.
    await renderBookDetailPage(); //  Seçilən kitabı göstər.
  }
  if (page === "author-detail") { //  Müəllif detaili.
    await renderAuthorDetailPage(); //  Müəllif məlumatı və kitabları.
  }
  if (page === "profile") { //  Profil səhifəsi.
    await bindProfilePage(); //  Profil loader.
  }
  if (page === "favorites") { //  Favorit səhifəsi.
    await renderFavoritesPage(); //  Favorit kitabları göstər.
  }
  if (page === "admin") { //  Admin səhifəsi.
    await bindAdminPage(); //  Admin loader.
  }
}

//  DOM tam yüklənəndə əsas boot funksiyasını başladırıq.
document.addEventListener("DOMContentLoaded", boot); //  Səhifə hazır olanda işə düşür.
