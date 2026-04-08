
// ===============================================================
// AZ QEYD: Bu fayl saytın bütün canlı funksiyalarını idarə edir.
// AZ QEYD: Burada:
// AZ QEYD: 1) Supabase ilə bağlantı qurulur,
// AZ QEYD: 2) kitablar, müəlliflər, kateqoriyalar oxunur,
// AZ QEYD: 3) login, register, logout, reset-password işləyir,
// AZ QEYD: 4) admin paneldə CRUD əməliyyatları icra olunur,
// AZ QEYD: 5) favoritlər, profil, axtarış və dinamik səhifələr işləyir.
// ===============================================================

// AZ QEYD: Qısa yol üçün client dəyişəni yaradırıq.
const sb = window.supabaseClient; // AZ QEYD: Supabase client-in qısa adı.

// AZ QEYD: document.body üzərindən cari səhifə adını oxuyuruq.
const page = document.body.dataset.page || "default"; // AZ QEYD: data-page atributu yoxdursa "default" olur.

// AZ QEYD: DOM seçmək üçün qısa yardımçı funksiya.
const $ = (selector) => document.querySelector(selector); // AZ QEYD: Birinci uyğun elementi qaytarır.

// AZ QEYD: DOM içində birdən çox elementi seçmək üçün qısa yardımçı funksiya.
const $$ = (selector) => Array.from(document.querySelectorAll(selector)); // AZ QEYD: NodeList-i massivə çevirir.

// AZ QEYD: Şəkil yoxdursa istifadə ediləcək placeholder ünvanı.
const PLACEHOLDER_COVER = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80"; // AZ QEYD: Ehtiyat kitab qabığı.

// AZ QEYD: Toast göstərmək üçün taymer ID-sini saxlayırıq.
let toastTimer = null; // AZ QEYD: Sonrakı bildirişləri idarə etmək üçün.

// ===============================================================
// AZ QEYD: Bu funksiya ekranda özümüzə məxsus bildiriş göstərir.
// AZ QEYD: GitHub Pages alert-ləri yerinə daha səliqəli toast istifadə olunur.
// ===============================================================
function showToast(message, isError = false) { // AZ QEYD: message mətnini, isError isə rəng tonunu təyin edir.
  const toast = $("#toast"); // AZ QEYD: Toast konteynerini götürürük.
  if (!toast) return; // AZ QEYD: Element yoxdursa funksiyanı dayandırırıq.
  toast.textContent = message; // AZ QEYD: Bildiriş mətnini yazırıq.
  toast.style.background = isError // AZ QEYD: Səhv və ya uğur fonu seçilir.
    ? "linear-gradient(135deg, #e84a5f, #a50e28)" // AZ QEYD: Səhv üçün qırmızı ton.
    : "linear-gradient(135deg, #0a6fe8, #084db0)"; // AZ QEYD: Normal hal üçün mavi ton.
  toast.classList.add("show"); // AZ QEYD: Görünüş sinifini əlavə edirik.
  window.clearTimeout(toastTimer); // AZ QEYD: Köhnə taymeri dayandırırıq.
  toastTimer = window.setTimeout(() => { // AZ QEYD: Yeni gizlənmə taymeri qururuq.
    toast.classList.remove("show"); // AZ QEYD: Müəyyən vaxtdan sonra toast gizlənir.
  }, 3000); // AZ QEYD: 3 saniyə sonra.
}

// ===============================================================
// AZ QEYD: Bu funksiya URL-dəki sorğu parametrini oxuyur.
// AZ QEYD: Məsələn ?id=123 kimi hissədən "id" dəyərini götürür.
// ===============================================================
function getParam(name) { // AZ QEYD: name oxunacaq parametr adıdır.
  const params = new URLSearchParams(window.location.search); // AZ QEYD: Cari URL sorğusunu parçalayırıq.
  return params.get(name); // AZ QEYD: Lazım olan parametr dəyərini qaytarırıq.
}

// ===============================================================
// AZ QEYD: Bu funksiya mətn daxilində axtarış üçün təhlükəsiz, kiçik hərfli forma yaradır.
// ===============================================================
function normalizeText(value = "") { // AZ QEYD: Boş dəyər gəlsə də işləsin deyə default boş mətn veririk.
  return String(value).trim().toLowerCase(); // AZ QEYD: Mətnə çevir, boşluqları sil, kiçik hərfə sal.
}

// ===============================================================
// AZ QEYD: Bu funksiya qiyməti və ya mətn dəyərini ekranda təhlükəsiz göstərmək üçündür.
// ===============================================================
function safe(value, fallback = "—") { // AZ QEYD: value yoxdursa fallback qaytarılır.
  return value === null || value === undefined || value === "" ? fallback : value; // AZ QEYD: Boş yoxlama.
}

// ===============================================================
// AZ QEYD: Bu funksiya tarix dəyərini oxunaqlı formaya salır.
// ===============================================================
function formatDate(dateValue) { // AZ QEYD: dateValue bazadan gələn tarixdir.
  if (!dateValue) return "Unknown"; // AZ QEYD: Tarix yoxdursa standart mətn.
  const date = new Date(dateValue); // AZ QEYD: JavaScript Date obyektinə çeviririk.
  if (Number.isNaN(date.getTime())) return "Unknown"; // AZ QEYD: Tarix yanlışdırsa qoruyuruq.
  return new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "long", day: "numeric" }).format(date); // AZ QEYD: İngiliscə formatlayırıq.
}

// ===============================================================
// AZ QEYD: Bu funksiya yazıların HTML içində təhlükəsiz görünməsi üçün xüsusi simvolları dəyişir.
// ===============================================================
function escapeHtml(value = "") { // AZ QEYD: Xüsusi simvolları təhlükəsiz mətnə çevirir.
  return String(value)
    .replaceAll("&", "&amp;") // AZ QEYD: & simvolunu HTML entity edir.
    .replaceAll("<", "&lt;") // AZ QEYD: < simvolunu entity edir.
    .replaceAll(">", "&gt;") // AZ QEYD: > simvolunu entity edir.
    .replaceAll('"', "&quot;") // AZ QEYD: " simvolunu entity edir.
    .replaceAll("'", "&#39;"); // AZ QEYD: ' simvolunu entity edir.
}

// ===============================================================
// AZ QEYD: Bu funksiya kitabın kart HTML-ni hazırlayır.
// AZ QEYD: Kart üzərinə klik ediləndə detail səhifəsinə keçid verir.
// ===============================================================
function createBookCard(book) { // AZ QEYD: book obyektində bazadan gələn kitab məlumatı var.
  const category = safe(book.categories?.name, "General"); // AZ QEYD: Kateqoriya adını götürürük.
  const author = safe(book.authors?.name, "Unknown Author"); // AZ QEYD: Müəllif adını götürürük.
  const cover = book.cover_url || PLACEHOLDER_COVER; // AZ QEYD: Qabıq varsa onu, yoxdursa placeholder.
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
  `; // AZ QEYD: Hazır kart HTML mətnini qaytarırıq.
}

// ===============================================================
// AZ QEYD: Bu funksiya müəllif kartını yaradır.
// AZ QEYD: Kart author-details səhifəsinə açılır.
// ===============================================================
function createAuthorCard(author) { // AZ QEYD: author obyektini qəbul edir.
  return `
    <a class="author-card" href="author-details.html?id=${author.id}">
      <div class="tag">${escapeHtml(safe(author.nationality, "Author"))}</div>
      <h4>${escapeHtml(author.name)}</h4>
      <p class="muted clamp-2">${escapeHtml(safe(author.biography, "A curated author profile with selected books and background."))}</p>
    </a>
  `; // AZ QEYD: Müəllif kartının HTML nəticəsi.
}

// ===============================================================
// AZ QEYD: Bu funksiya cari istifadəçini oxuyur.
// ===============================================================
async function getCurrentUser() { // AZ QEYD: Supabase auth sessiyasından istifadəçi alınır.
  const { data, error } = await sb.auth.getUser(); // AZ QEYD: Giriş etmiş user məlumatı.
  if (error) { // AZ QEYD: Səhv baş veribsə.
    console.error(error); // AZ QEYD: Konsolda göstər.
    return null; // AZ QEYD: Boş qaytar.
  }
  return data.user || null; // AZ QEYD: User varsa onu, yoxdursa null qaytar.
}

// ===============================================================
// AZ QEYD: Bu funksiya istifadəçinin profilini bazadan oxuyur.
// ===============================================================
async function getProfile(userId) { // AZ QEYD: userId auth istifadəçi identifikatorudur.
  if (!userId) return null; // AZ QEYD: userId yoxdursa dayan.
  const { data, error } = await sb // AZ QEYD: Supabase sorğusunu başlayırıq.
    .from("profiles") // AZ QEYD: profiles cədvəlindən.
    .select("*") // AZ QEYD: Bütün sütunları götürürük.
    .eq("id", userId) // AZ QEYD: id userId-yə bərabər olsun.
    .single(); // AZ QEYD: Tək sətir gözləyirik.
  if (error) { // AZ QEYD: Səhv halı.
    console.error(error); // AZ QEYD: Konsola yaz.
    return null; // AZ QEYD: Null qaytar.
  }
  return data; // AZ QEYD: Profil məlumatını qaytarırıq.
}

// ===============================================================
// AZ QEYD: Bu funksiya header-də user vəziyyətini yeniləyir.
// AZ QEYD: Login, logout, profile linklərini buna görə göstərir.
// ===============================================================
async function renderHeaderAuth() { // AZ QEYD: Başlıq sağ hissəsini dinamik qurur.
  const holder = $("#authActions"); // AZ QEYD: Header auth konteyneri.
  if (!holder) return; // AZ QEYD: Element yoxdursa dayan.
  const user = await getCurrentUser(); // AZ QEYD: Cari istifadəçi məlumatını alırıq.
  if (!user) { // AZ QEYD: User giriş etməyibsə.
    holder.innerHTML = `
      <a class="btn btn-secondary" href="login.html">Log In</a>
      <a class="btn btn-primary" href="register.html">Sign Up</a>
    `; // AZ QEYD: Qonaq düymələri göstərilir.
    return; // AZ QEYD: Funksiyanı bitiririk.
  }
  const profile = await getProfile(user.id); // AZ QEYD: İstifadəçi profilini alırıq.
  const isAdmin = profile?.role === "admin"; // AZ QEYD: Admin olub-olmadığını yoxlayırıq.
  holder.innerHTML = `
    <a class="btn btn-secondary" href="favorites.html">Favorites</a>
    <a class="btn btn-secondary" href="profile.html">Profile</a>
    ${isAdmin ? '<a class="btn btn-secondary" href="admin.html">Admin</a>' : ""}
    <button class="btn btn-primary" id="logoutBtn">Log Out</button>
  `; // AZ QEYD: Giriş etmiş istifadəçi menyusu.
  $("#logoutBtn")?.addEventListener("click", async () => { // AZ QEYD: Çıxış düyməsinə klik.
    const { error } = await sb.auth.signOut(); // AZ QEYD: Sessiyanı bağlayırıq.
    if (error) { // AZ QEYD: Səhv halı.
      showToast(error.message, true); // AZ QEYD: İstifadəçiyə göstər.
      return; // AZ QEYD: Dayan.
    }
    showToast("You have been logged out."); // AZ QEYD: Uğurlu mesajı.
    window.location.href = "index.html"; // AZ QEYD: Ana səhifəyə yönləndir.
  });
}

// ===============================================================
// AZ QEYD: Bu funksiya ümumi kitab sorğusunu qurur.
// AZ QEYD: title, author, description və category üzrə axtarış edə bilir.
// ===============================================================
async function fetchBooks(options = {}) { // AZ QEYD: options ilə filter, limit və kateqoriya verilə bilər.
  const queryText = normalizeText(options.query || ""); // AZ QEYD: Axtarış mətnini normallaşdırırıq.
  let query = sb // AZ QEYD: Sorğunu başladırıq.
    .from("books") // AZ QEYD: books cədvəli.
    .select(`
      *,
      authors ( id, name, biography, nationality ),
      categories ( id, name, slug )
    `) // AZ QEYD: Əlaqəli müəllif və kateqoriyanı da gətir.
    .eq("is_published", true) // AZ QEYD: Yalnız görünən kitablar.
    .order("created_at", { ascending: false }); // AZ QEYD: Yenilər yuxarıda olsun.

  if (options.categoryId) { // AZ QEYD: Kateqoriya filteri varsa.
    query = query.eq("category_id", options.categoryId); // AZ QEYD: Həmin kateqoriyaya görə süzürük.
  }

  if (options.limit) { // AZ QEYD: Limit verilibsə.
    query = query.limit(options.limit); // AZ QEYD: Sorğunu limitləyirik.
  }

  const { data, error } = await query; // AZ QEYD: Sorğunu icra edirik.
  if (error) { // AZ QEYD: Səhv baş veribsə.
    console.error(error); // AZ QEYD: Konsola yaz.
    showToast("Unable to load books right now.", true); // AZ QEYD: İstifadəçiyə bildir.
    return []; // AZ QEYD: Boş massiv qaytar.
  }

  if (!queryText) return data || []; // AZ QEYD: Axtarış mətni yoxdursa bütün nəticəni qaytar.

  return (data || []).filter((book) => { // AZ QEYD: Frontend tərəfdə çoxsahəli filter.
    const haystack = normalizeText([
      book.title,
      book.short_description,
      book.description,
      book.categories?.name,
      book.authors?.name,
      book.authors?.biography,
    ].join(" ")); // AZ QEYD: Axtarılacaq mətnləri birləşdiririk.
    return haystack.includes(queryText); // AZ QEYD: Sorğu mətni bu birləşmənin içindədirsə saxla.
  });
}

// ===============================================================
// AZ QEYD: Bu funksiya bütün müəllifləri oxuyur.
// ===============================================================
async function fetchAuthors(limit = null) { // AZ QEYD: İstəyə görə limit qəbul edir.
  let query = sb.from("authors").select("*").order("name", { ascending: true }); // AZ QEYD: Müəlliflər əlifba sırası ilə.
  if (limit) query = query.limit(limit); // AZ QEYD: Limit varsa tətbiq edirik.
  const { data, error } = await query; // AZ QEYD: Sorğunu işləyirik.
  if (error) { // AZ QEYD: Səhv halı.
    console.error(error); // AZ QEYD: Konsola yaz.
    return []; // AZ QEYD: Boş massiv.
  }
  return data || []; // AZ QEYD: Nəticəni qaytar.
}

// ===============================================================
// AZ QEYD: Bu funksiya kateqoriyaları oxuyur.
// ===============================================================
async function fetchCategories() { // AZ QEYD: Kateqoriya siyahısı üçün.
  const { data, error } = await sb.from("categories").select("*").order("name", { ascending: true }); // AZ QEYD: Əlifba sırası.
  if (error) { // AZ QEYD: Səhv halı.
    console.error(error); // AZ QEYD: Konsol.
    return []; // AZ QEYD: Boş nəticə.
  }
  return data || []; // AZ QEYD: Kateqoriyaları qaytar.
}

// ===============================================================
// AZ QEYD: Bu funksiya home səhifəsində müəllif lentini qurur.
// AZ QEYD: Vizual effekti davamlı etmək üçün massiv iki dəfə təkrarlanır.
// ===============================================================
async function renderAuthorMarquee() { // AZ QEYD: Ana səhifə müəllif marqısı.
  const container = $("#authorTrack"); // AZ QEYD: Track elementi.
  if (!container) return; // AZ QEYD: Yoxdursa çıx.
  const authors = await fetchAuthors(8); // AZ QEYD: İlk müəllifləri alırıq.
  const looped = [...authors, ...authors]; // AZ QEYD: Davamlı animasiya üçün ikiqatlayırıq.
  container.innerHTML = looped.length
    ? looped.map(createAuthorCard).join("") // AZ QEYD: Kartları HTML-ə çevir.
    : `<div class="empty-state">Authors will appear here after records are added.</div>`; // AZ QEYD: Boş hal.
}

// ===============================================================
// AZ QEYD: Bu funksiya kitab gridini ekranda göstərir.
// ===============================================================
async function renderBooksGrid(selector, options = {}) { // AZ QEYD: selector hədəf konteynerdir.
  const holder = $(selector); // AZ QEYD: Hədəf element.
  if (!holder) return; // AZ QEYD: Tapılmadısa dayan.
  holder.innerHTML = `<div class="spinner"></div>`; // AZ QEYD: Gözləmə vəziyyəti.
  const books = await fetchBooks(options); // AZ QEYD: Kitabları alırıq.
  holder.innerHTML = books.length
    ? books.map(createBookCard).join("") // AZ QEYD: Kartları yerləşdir.
    : `<div class="empty-state">No books matched your current search.</div>`; // AZ QEYD: Boş vəziyyət.
  bindFavoriteButtons(); // AZ QEYD: Yeni yaranan düymələrə event bağla.
}

// ===============================================================
// AZ QEYD: Bu funksiya kitab detalını bazadan oxuyur.
// ===============================================================
async function fetchBookById(bookId) { // AZ QEYD: bookId URL-dən gəlir.
  const { data, error } = await sb
    .from("books")
    .select(`
      *,
      authors ( id, name, biography, nationality, birth_year ),
      categories ( id, name, slug )
    `)
    .eq("id", bookId)
    .single(); // AZ QEYD: Tək kitab qaytarılır.
  if (error) { // AZ QEYD: Səhv halı.
    console.error(error); // AZ QEYD: Konsol.
    return null; // AZ QEYD: Null.
  }
  return data; // AZ QEYD: Kitabı qaytar.
}

// ===============================================================
// AZ QEYD: Bu funksiya müəllif detalını bazadan oxuyur.
// ===============================================================
async function fetchAuthorById(authorId) { // AZ QEYD: authorId URL parametridir.
  const { data, error } = await sb.from("authors").select("*").eq("id", authorId).single(); // AZ QEYD: Tək müəllif sorğusu.
  if (error) { // AZ QEYD: Səhv varsa.
    console.error(error); // AZ QEYD: Konsol.
    return null; // AZ QEYD: Null.
  }
  return data; // AZ QEYD: Müəllif məlumatı.
}

// ===============================================================
// AZ QEYD: Bu funksiya detail səhifəsini qurur.
// AZ QEYD: Seçilən kitab yuxarıda, digər kitablar aşağıda göstərilir.
// ===============================================================
async function renderBookDetailPage() { // AZ QEYD: book-details.html üçün əsas loader.
  const holder = $("#bookDetailSection"); // AZ QEYD: Məzmun konteyneri.
  if (!holder) return; // AZ QEYD: Yoxdursa dayan.
  const bookId = getParam("id"); // AZ QEYD: URL-dən id oxu.
  if (!bookId) { // AZ QEYD: id yoxdursa.
    holder.innerHTML = `<div class="empty-state">No book has been selected.</div>`; // AZ QEYD: Boş mesaj.
    return; // AZ QEYD: Dayan.
  }
  holder.innerHTML = `<div class="spinner"></div>`; // AZ QEYD: Gözləmə görünüşü.
  const book = await fetchBookById(bookId); // AZ QEYD: Kitabı al.
  if (!book) { // AZ QEYD: Tapılmadısa.
    holder.innerHTML = `<div class="empty-state">This book could not be found.</div>`; // AZ QEYD: Xəta məzmunu.
    return; // AZ QEYD: Dayan.
  }
  document.title = `${book.title} | BlueShelf Bookstore`; // AZ QEYD: Səhifə başlığını dəyişirik.
  const cover = book.cover_url || PLACEHOLDER_COVER; // AZ QEYD: Qabıq URL-i.
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
  `; // AZ QEYD: Seçilmiş kitab detali.
  bindFavoriteButtons(); // AZ QEYD: Favorit düyməsini aktivləşdiririk.
  await renderBooksGrid("#relatedBooksGrid", { categoryId: book.category_id, limit: 4 }); // AZ QEYD: Aşağıda oxşar kitablar.
}

// ===============================================================
// AZ QEYD: Bu funksiya müəllif detal səhifəsini qurur.
// ===============================================================
async function renderAuthorDetailPage() { // AZ QEYD: author-details.html üçün.
  const holder = $("#authorDetailSection"); // AZ QEYD: Hədəf konteyner.
  if (!holder) return; // AZ QEYD: Yoxdursa çıx.
  const authorId = getParam("id"); // AZ QEYD: URL parametrindən id.
  if (!authorId) { // AZ QEYD: id yoxdursa.
    holder.innerHTML = `<div class="empty-state">No author has been selected.</div>`; // AZ QEYD: Boş hal.
    return; // AZ QEYD: Dayan.
  }
  holder.innerHTML = `<div class="spinner"></div>`; // AZ QEYD: Gözləmə indikatoru.
  const author = await fetchAuthorById(authorId); // AZ QEYD: Müəllifi al.
  if (!author) { // AZ QEYD: Tapılmadısa.
    holder.innerHTML = `<div class="empty-state">Author information is unavailable.</div>`; // AZ QEYD: Mesaj.
    return; // AZ QEYD: Dayan.
  }
  const books = await fetchBooks({}); // AZ QEYD: Müəllifin kitablarını frontend-də süzəcəyik.
  const byAuthor = books.filter((book) => book.author_id === author.id); // AZ QEYD: Həmin müəllifə aid kitablar.
  holder.innerHTML = `
    <div class="panel">
      <div class="inline-list">
        <span class="tag">${escapeHtml(safe(author.nationality, "Author"))}</span>
        <span class="tag">${escapeHtml(safe(author.birth_year, "Unknown birth year"))}</span>
      </div>
      <h2>${escapeHtml(author.name)}</h2>
      <p>${escapeHtml(safe(author.biography, "Biography has not been added yet."))}</p>
    </div>
  `; // AZ QEYD: Müəllif paneli.
  const grid = $("#authorBooksGrid"); // AZ QEYD: Kitablar üçün grid.
  if (grid) { // AZ QEYD: Element varsa.
    grid.innerHTML = byAuthor.length ? byAuthor.map(createBookCard).join("") : `<div class="empty-state">No books for this author yet.</div>`; // AZ QEYD: Kartları göstər.
    bindFavoriteButtons(); // AZ QEYD: Favorit düymələrinə klik bağla.
  }
}

// ===============================================================
// AZ QEYD: Bu funksiya qeydiyyat formasını idarə edir.
// AZ QEYD: Auth user yaradır və profil məlumatını trigger vasitəsilə əlavə etdirir.
// ===============================================================
function bindRegisterForm() { // AZ QEYD: register.html üçün.
  const form = $("#registerForm"); // AZ QEYD: Forma elementi.
  if (!form) return; // AZ QEYD: Yoxdursa çıx.
  form.addEventListener("submit", async (event) => { // AZ QEYD: Submit hadisəsi.
    event.preventDefault(); // AZ QEYD: Brauzerin yenilənməsini dayandırırıq.
    const formData = new FormData(form); // AZ QEYD: Form dəyərlərini yığırıq.
    const email = formData.get("email"); // AZ QEYD: Email dəyəri.
    const password = formData.get("password"); // AZ QEYD: Şifrə dəyəri.
    const fullName = formData.get("full_name"); // AZ QEYD: Ad və soyad.
    const address = formData.get("address"); // AZ QEYD: Ünvan.
    const bio = formData.get("bio"); // AZ QEYD: Qısa bio.
    const { data, error } = await sb.auth.signUp({ // AZ QEYD: Supabase auth qeydiyyatı.
      email, // AZ QEYD: İstifadəçi emaili.
      password, // AZ QEYD: İstifadəçi şifrəsi.
      options: { // AZ QEYD: Meta məlumatlar.
        data: { // AZ QEYD: auth metadata obyektidir.
          full_name: fullName, // AZ QEYD: Tam ad saxlanır.
          address, // AZ QEYD: Ünvan saxlanır.
          bio, // AZ QEYD: Bio saxlanır.
        },
      },
    });
    if (error) { // AZ QEYD: Səhv halı.
      showToast(error.message, true); // AZ QEYD: İstifadəçiyə göstər.
      return; // AZ QEYD: Dayan.
    }
    if (data.user?.id) { // AZ QEYD: User uğurla yaranıbsa.
      await sb.from("profiles").upsert({ // AZ QEYD: Profil məlumatını əlavə və ya yenilə.
        id: data.user.id, // AZ QEYD: Profil id auth user id ilə eyni olur.
        full_name: fullName, // AZ QEYD: Tam ad.
        address, // AZ QEYD: Ünvan.
        bio, // AZ QEYD: Bio.
        email, // AZ QEYD: Email.
      }); // AZ QEYD: upsert birdən çox vəziyyəti rahat idarə edir.
    }
    showToast("Registration complete. Please check your email if confirmation is enabled."); // AZ QEYD: Uğurlu mesaj.
    form.reset(); // AZ QEYD: Formanı təmizlə.
  });
}

// ===============================================================
// AZ QEYD: Bu funksiya login formasını idarə edir.
// ===============================================================
function bindLoginForm() { // AZ QEYD: login.html üçün.
  const form = $("#loginForm"); // AZ QEYD: Login forması.
  if (!form) return; // AZ QEYD: Yoxdursa çıx.
  form.addEventListener("submit", async (event) => { // AZ QEYD: Submit hadisəsi.
    event.preventDefault(); // AZ QEYD: Default davranışı dayandırırıq.
    const formData = new FormData(form); // AZ QEYD: Form dəyərlərini oxuyuruq.
    const email = formData.get("email"); // AZ QEYD: Email.
    const password = formData.get("password"); // AZ QEYD: Şifrə.
    const { error } = await sb.auth.signInWithPassword({ email, password }); // AZ QEYD: Email/şifrə ilə giriş.
    if (error) { // AZ QEYD: Səhv halı.
      showToast(error.message, true); // AZ QEYD: Xəta toastı.
      return; // AZ QEYD: Dayan.
    }
    showToast("Welcome back."); // AZ QEYD: Uğurlu giriş mesajı.
    window.location.href = "index.html"; // AZ QEYD: Ana səhifəyə yönləndir.
  });
}

// ===============================================================
// AZ QEYD: Bu funksiya şifrə sıfırlama formasını idarə edir.
// ===============================================================
function bindResetPasswordForm() { // AZ QEYD: reset-password.html üçün.
  const form = $("#resetForm"); // AZ QEYD: Reset forması.
  if (!form) return; // AZ QEYD: Yoxdursa çıx.
  form.addEventListener("submit", async (event) => { // AZ QEYD: Submit.
    event.preventDefault(); // AZ QEYD: Default submit dayanır.
    const email = new FormData(form).get("email"); // AZ QEYD: Email dəyərini götürürük.
    const redirectTo = `${window.location.origin}${window.location.pathname.replace("reset-password.html", "profile.html")}`; // AZ QEYD: Reset linkdən sonra yönləndiriləcək ünvan.
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo }); // AZ QEYD: Şifrə yeniləmə email-i göndəririk.
    if (error) { // AZ QEYD: Səhv halı.
      showToast(error.message, true); // AZ QEYD: Xəta göstər.
      return; // AZ QEYD: Dayan.
    }
    showToast("Password reset email has been sent."); // AZ QEYD: Uğurlu mesaj.
    form.reset(); // AZ QEYD: Formanı təmizlə.
  });
}

// ===============================================================
// AZ QEYD: Bu funksiya istifadəçi profil səhifəsini yükləyir və redaktəni işləyir.
// ===============================================================
async function bindProfilePage() { // AZ QEYD: profile.html üçün.
  const form = $("#profileForm"); // AZ QEYD: Profil forması.
  if (!form) return; // AZ QEYD: Element yoxdursa çıx.
  const user = await getCurrentUser(); // AZ QEYD: Giriş etmiş user.
  if (!user) { // AZ QEYD: Giriş yoxdursa.
    showToast("Please log in to view your profile.", true); // AZ QEYD: Bildiriş.
    window.location.href = "login.html"; // AZ QEYD: Login səhifəsinə yönləndir.
    return; // AZ QEYD: Dayan.
  }
  const profile = await getProfile(user.id); // AZ QEYD: Profil məlumatı.
  $("#profileEmail").value = profile?.email || user.email || ""; // AZ QEYD: Email sahəsi.
  $("#profileName").value = profile?.full_name || ""; // AZ QEYD: Ad sahəsi.
  $("#profileAddress").value = profile?.address || ""; // AZ QEYD: Ünvan sahəsi.
  $("#profileAvatar").value = profile?.avatar_url || ""; // AZ QEYD: Şəkil URL sahəsi.
  $("#profileBio").value = profile?.bio || ""; // AZ QEYD: Bio sahəsi.
  form.addEventListener("submit", async (event) => { // AZ QEYD: Profil yenilə.
    event.preventDefault(); // AZ QEYD: Standart submit dayanır.
    const payload = { // AZ QEYD: Yenilənəcək obyekt.
      id: user.id, // AZ QEYD: Profil ID.
      email: user.email, // AZ QEYD: Email.
      full_name: $("#profileName").value.trim(), // AZ QEYD: Tam ad.
      address: $("#profileAddress").value.trim(), // AZ QEYD: Ünvan.
      avatar_url: $("#profileAvatar").value.trim(), // AZ QEYD: Avatar URL.
      bio: $("#profileBio").value.trim(), // AZ QEYD: Bio.
      updated_at: new Date().toISOString(), // AZ QEYD: Yenilənmə tarixi.
    };
    const { error } = await sb.from("profiles").upsert(payload); // AZ QEYD: Profili yeniləyirik.
    if (error) { // AZ QEYD: Səhv halı.
      showToast(error.message, true); // AZ QEYD: Xəta.
      return; // AZ QEYD: Dayan.
    }
    showToast("Profile updated successfully."); // AZ QEYD: Uğur.
  });
}

// ===============================================================
// AZ QEYD: Bu funksiya favori düymələrinə klik hadisəsi bağlayır.
// ===============================================================
function bindFavoriteButtons() { // AZ QEYD: Dinamik kartlar yeniləndikdən sonra çağırılır.
  $$(".favorite-toggle").forEach((button) => { // AZ QEYD: Bütün favorit düymələri üzrə dönürük.
    button.addEventListener("click", async () => { // AZ QEYD: Klik hadisəsi.
      const user = await getCurrentUser(); // AZ QEYD: Cari istifadəçi.
      if (!user) { // AZ QEYD: Giriş etməyibsə.
        showToast("Please log in to save favorites.", true); // AZ QEYD: Mesaj.
        window.location.href = "login.html"; // AZ QEYD: Login-ə yönləndir.
        return; // AZ QEYD: Dayan.
      }
      const bookId = button.dataset.bookId; // AZ QEYD: data-book-id atributu.
      const { error } = await sb.from("favorites").insert({ user_id: user.id, book_id: bookId }); // AZ QEYD: Favorit əlavə.
      if (error && !error.message.toLowerCase().includes("duplicate")) { // AZ QEYD: Duplicate istisna olmaqla səhv.
        showToast(error.message, true); // AZ QEYD: Xəta göstər.
        return; // AZ QEYD: Dayan.
      }
      showToast("Book saved to favorites."); // AZ QEYD: Uğurlu mesaj.
    }, { once: true }); // AZ QEYD: Eyni düyməyə təkrar çoxsaylı bağlanmanın qarşısını alır.
  });
}

// ===============================================================
// AZ QEYD: Bu funksiya favorit səhifəsini doldurur.
// ===============================================================
async function renderFavoritesPage() { // AZ QEYD: favorites.html üçün.
  const holder = $("#favoritesGrid"); // AZ QEYD: Hədəf grid.
  if (!holder) return; // AZ QEYD: Yoxdursa çıx.
  const user = await getCurrentUser(); // AZ QEYD: Cari user.
  if (!user) { // AZ QEYD: Login edilməyibsə.
    showToast("Please log in to access your favorites.", true); // AZ QEYD: Bildiriş.
    window.location.href = "login.html"; // AZ QEYD: Login-ə keç.
    return; // AZ QEYD: Dayan.
  }
  holder.innerHTML = `<div class="spinner"></div>`; // AZ QEYD: Gözləmə.
  const { data, error } = await sb // AZ QEYD: Favorit sorğusu.
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
    .order("created_at", { ascending: false }); // AZ QEYD: Son əlavə edilənlər yuxarıda.
  if (error) { // AZ QEYD: Səhv halı.
    showToast(error.message, true); // AZ QEYD: Xəta.
    holder.innerHTML = `<div class="empty-state">Favorites could not be loaded.</div>`; // AZ QEYD: Boş vəziyyət.
    return; // AZ QEYD: Dayan.
  }
  const books = (data || []).map((row) => row.books).filter(Boolean); // AZ QEYD: İçindəki book obyektlərini çıxardırıq.
  holder.innerHTML = books.length ? books.map(createBookCard).join("") : `<div class="empty-state">Your saved books will appear here.</div>`; // AZ QEYD: Kartlar və ya boş hal.
  bindFavoriteButtons(); // AZ QEYD: Favorit düymələrini yenidən bağla.
}

// ===============================================================
// AZ QEYD: Bu funksiya home səhifə axtarışını qurur.
// ===============================================================
function bindHeroSearch() { // AZ QEYD: index.html üçün.
  const form = $("#searchForm"); // AZ QEYD: Axtarış forması.
  if (!form) return; // AZ QEYD: Tapılmadısa çıx.
  form.addEventListener("submit", async (event) => { // AZ QEYD: Submit.
    event.preventDefault(); // AZ QEYD: Default submit dayanır.
    const query = $("#searchInput")?.value || ""; // AZ QEYD: Input dəyərini oxuyuruq.
    if (page !== "home") { // AZ QEYD: Ana səhifədə deyiliksə.
      window.location.href = `index.html?search=${encodeURIComponent(query)}`; // AZ QEYD: Sorğunu URL ilə home səhifəyə ötürürük.
      return; // AZ QEYD: Cari səhifədə davam etmirik.
    }
    await renderBooksGrid("#booksGrid", { query, limit: 12 }); // AZ QEYD: Filtrlənmiş kitabları göstəririk.
    document.getElementById("books")?.scrollIntoView({ behavior: "smooth" }); // AZ QEYD: Kitablar bölməsinə sürüşdürürük.
  });
}

// ===============================================================
// AZ QEYD: Bu funksiya admin səhifəsinin icazəsini yoxlayır.
// ===============================================================
async function assertAdmin() { // AZ QEYD: Admin panelə giriş üçün.
  const user = await getCurrentUser(); // AZ QEYD: Cari user.
  if (!user) { // AZ QEYD: Giriş yoxdursa.
    showToast("Please log in first.", true); // AZ QEYD: Mesaj.
    window.location.href = "login.html"; // AZ QEYD: Login səhifəsinə.
    return null; // AZ QEYD: Null qaytar.
  }
  const profile = await getProfile(user.id); // AZ QEYD: Profil məlumatı.
  if (profile?.role !== "admin") { // AZ QEYD: Admin deyilsə.
    showToast("Admin access is required.", true); // AZ QEYD: Xəta.
    window.location.href = "index.html"; // AZ QEYD: Ana səhifəyə qaytar.
    return null; // AZ QEYD: Null.
  }
  return user; // AZ QEYD: İcazə varsa user qaytar.
}

// ===============================================================
// AZ QEYD: Bu funksiya admin üçün kateqoriya seçimlərini doldurur.
// ===============================================================
async function populateCategorySelect(selector) { // AZ QEYD: selector select elementidir.
  const select = $(selector); // AZ QEYD: Select-i tuturuq.
  if (!select) return; // AZ QEYD: Yoxdursa çıx.
  const categories = await fetchCategories(); // AZ QEYD: Kateqoriyaları al.
  select.innerHTML = `<option value="">Select category</option>` + categories.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join(""); // AZ QEYD: Option-ları qur.
}

// ===============================================================
// AZ QEYD: Bu funksiya admin üçün müəllif seçimlərini doldurur.
// ===============================================================
async function populateAuthorSelect(selector) { // AZ QEYD: selector select elementidir.
  const select = $(selector); // AZ QEYD: Select elementi.
  if (!select) return; // AZ QEYD: Yoxdursa çıx.
  const authors = await fetchAuthors(); // AZ QEYD: Müəllifləri alırıq.
  select.innerHTML = `<option value="">Select author</option>` + authors.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join(""); // AZ QEYD: Option HTML-si.
}

// ===============================================================
// AZ QEYD: Bu funksiya admin cədvəlini kitablarla doldurur.
// ===============================================================
async function renderAdminBooksTable() { // AZ QEYD: Admin kitab siyahısı.
  const body = $("#adminBooksTableBody"); // AZ QEYD: tbody elementi.
  if (!body) return; // AZ QEYD: Yoxdursa çıx.
  const books = await fetchBooks({ limit: 100 }); // AZ QEYD: Kitabları al.
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
  `).join("") : `<tr><td colspan="5">No books in the catalog yet.</td></tr>`; // AZ QEYD: Cədvəl sətirləri.
  bindAdminTableActions(books); // AZ QEYD: Edit və delete düymələrinə klik bağla.
}

// ===============================================================
// AZ QEYD: Bu funksiya şəkli Supabase storage-a yükləyir.
// ===============================================================
async function uploadBookCover(file) { // AZ QEYD: file input-dan gələn fayl.
  if (!file) return ""; // AZ QEYD: Fayl yoxdursa boş sətir qaytar.
  const fileExt = file.name.split(".").pop(); // AZ QEYD: Fayl uzantısı.
  const fileName = `cover-${Date.now()}.${fileExt}`; // AZ QEYD: Unikal ad yaradırıq.
  const filePath = `public/${fileName}`; // AZ QEYD: Bucket içində yol.
  const { error } = await sb.storage.from("book-covers").upload(filePath, file, { upsert: false }); // AZ QEYD: Storage upload.
  if (error) { // AZ QEYD: Səhv halı.
    throw error; // AZ QEYD: Yuxarı funksiyaya ötürürük.
  }
  const { data } = sb.storage.from("book-covers").getPublicUrl(filePath); // AZ QEYD: Public URL alırıq.
  return data.publicUrl; // AZ QEYD: Şəkil URL-ni qaytarırıq.
}

// ===============================================================
// AZ QEYD: Bu funksiya admin formasını işləyir.
// AZ QEYD: Yeni kitab əlavə etmə və mövcud kitabı redaktə etmə eyni formadadır.
// ===============================================================
async function bindAdminPage() { // AZ QEYD: admin.html üçün əsas loader.
  const user = await assertAdmin(); // AZ QEYD: Admin yoxlaması.
  if (!user) return; // AZ QEYD: İcazə yoxdursa dayan.
  await populateCategorySelect("#bookCategory"); // AZ QEYD: Kateqoriya select doldurulur.
  await populateAuthorSelect("#bookAuthor"); // AZ QEYD: Müəllif select doldurulur.
  await renderAdminBooksTable(); // AZ QEYD: Kitab cədvəli qurulur.
  bindAddCategoryForm(); // AZ QEYD: Kateqoriya əlavə formu.
  bindAddAuthorForm(); // AZ QEYD: Müəllif əlavə formu.

  const form = $("#bookForm"); // AZ QEYD: Kitab forması.
  if (!form) return; // AZ QEYD: Form yoxdursa çıx.
  form.addEventListener("submit", async (event) => { // AZ QEYD: Submit hadisəsi.
    event.preventDefault(); // AZ QEYD: Səhifənin yenilənməsinin qarşısı alınır.
    try { // AZ QEYD: Upload və DB əməliyyatları üçün qoruyucu blok.
      const formData = new FormData(form); // AZ QEYD: Form məlumatları.
      const editId = $("#bookId").value.trim(); // AZ QEYD: Dolu olarsa redaktə rejimidir.
      const coverFile = $("#bookCoverFile").files[0]; // AZ QEYD: Fayl input-dan şəkil.
      let coverUrl = $("#bookCoverUrl").value.trim(); // AZ QEYD: Əvvəlki URL və ya əl ilə URL.
      if (coverFile) { // AZ QEYD: Yeni şəkil seçilibsə.
        coverUrl = await uploadBookCover(coverFile); // AZ QEYD: Storage-a yükləyib public URL alırıq.
      }
      const payload = { // AZ QEYD: books cədvəlinə gedəcək obyekt.
        title: formData.get("title"), // AZ QEYD: Kitab adı.
        author_id: formData.get("author_id"), // AZ QEYD: Müəllif id.
        category_id: formData.get("category_id"), // AZ QEYD: Kateqoriya id.
        short_description: formData.get("short_description"), // AZ QEYD: Qısa açıqlama.
        description: formData.get("description"), // AZ QEYD: Tam açıqlama.
        publish_year: Number(formData.get("publish_year")) || null, // AZ QEYD: Nəşr ili.
        pages: Number(formData.get("pages")) || null, // AZ QEYD: Səhifə sayı.
        isbn: formData.get("isbn"), // AZ QEYD: ISBN.
        language: formData.get("language"), // AZ QEYD: Dil.
        format_type: formData.get("format_type"), // AZ QEYD: Format.
        cover_url: coverUrl, // AZ QEYD: Şəkil URL.
        is_published: true, // AZ QEYD: Saytda göstərilsin.
      };
      const response = editId // AZ QEYD: Əgər editId varsa update, yoxdursa insert.
        ? await sb.from("books").update(payload).eq("id", editId) // AZ QEYD: Mövcud kitabı yenilə.
        : await sb.from("books").insert(payload); // AZ QEYD: Yeni kitab əlavə et.
      if (response.error) throw response.error; // AZ QEYD: Səhv varsa try/catch-ə ötür.
      showToast(editId ? "Book updated successfully." : "New book added successfully."); // AZ QEYD: Uğur.
      form.reset(); // AZ QEYD: Formu təmizlə.
      $("#bookId").value = ""; // AZ QEYD: Edit gizli sahəsini sıfırla.
      await renderAdminBooksTable(); // AZ QEYD: Cədvəli yenilə.
    } catch (error) { // AZ QEYD: Xəta tutma bloku.
      console.error(error); // AZ QEYD: Konsola yaz.
      showToast(error.message || "Admin action failed.", true); // AZ QEYD: İstifadəçiyə göstər.
    }
  });
}

// ===============================================================
// AZ QEYD: Bu funksiya admin cədvəlində edit və delete əməliyyatlarını bağlayır.
// ===============================================================
function bindAdminTableActions(books) { // AZ QEYD: books render edilmiş kitab massividir.
  $$(".admin-edit").forEach((button) => { // AZ QEYD: Bütün edit düymələri.
    button.addEventListener("click", () => { // AZ QEYD: Klik hadisəsi.
      const bookId = button.dataset.bookId; // AZ QEYD: data-book-id dəyəri.
      const book = books.find((item) => String(item.id) === String(bookId)); // AZ QEYD: Həmin kitabı massivdə tapırıq.
      if (!book) return; // AZ QEYD: Tapılmazsa çıx.
      $("#bookId").value = book.id; // AZ QEYD: Gizli id sahəsinə yaz.
      $("#bookTitle").value = book.title || ""; // AZ QEYD: Form sahələrini doldur.
      $("#bookAuthor").value = book.author_id || ""; // AZ QEYD: Müəllif select.
      $("#bookCategory").value = book.category_id || ""; // AZ QEYD: Kateqoriya select.
      $("#bookShortDescription").value = book.short_description || ""; // AZ QEYD: Qısa təsvir.
      $("#bookDescription").value = book.description || ""; // AZ QEYD: Tam təsvir.
      $("#bookPublishYear").value = book.publish_year || ""; // AZ QEYD: Nəşr ili.
      $("#bookPages").value = book.pages || ""; // AZ QEYD: Səhifə sayı.
      $("#bookIsbn").value = book.isbn || ""; // AZ QEYD: ISBN.
      $("#bookLanguage").value = book.language || "English"; // AZ QEYD: Dil.
      $("#bookFormat").value = book.format_type || "Paperback"; // AZ QEYD: Format.
      $("#bookCoverUrl").value = book.cover_url || ""; // AZ QEYD: Qabıq URL.
      window.scrollTo({ top: 0, behavior: "smooth" }); // AZ QEYD: Formun olduğu yerə yuxarı çıxırıq.
      showToast("Book data loaded into the form."); // AZ QEYD: İstifadəçiyə xəbər.
    });
  });

  $$(".admin-delete").forEach((button) => { // AZ QEYD: Bütün delete düymələri.
    button.addEventListener("click", async () => { // AZ QEYD: Klik hadisəsi.
      const confirmed = window.confirm("Delete this book from the catalog?"); // AZ QEYD: Təsdiq pəncərəsi.
      if (!confirmed) return; // AZ QEYD: Ləğv edilərsə çıx.
      const { error } = await sb.from("books").delete().eq("id", button.dataset.bookId); // AZ QEYD: DB-dən silirik.
      if (error) { // AZ QEYD: Səhv halı.
        showToast(error.message, true); // AZ QEYD: Xəta.
        return; // AZ QEYD: Dayan.
      }
      showToast("Book deleted."); // AZ QEYD: Uğurlu mesaj.
      await renderAdminBooksTable(); // AZ QEYD: Cədvəli yenilə.
    });
  });
}

// ===============================================================
// AZ QEYD: Bu funksiya admin paneldə yeni kateqoriya əlavə edir.
// ===============================================================
function bindAddCategoryForm() { // AZ QEYD: categoryForm üçün.
  const form = $("#categoryForm"); // AZ QEYD: Forma elementi.
  if (!form) return; // AZ QEYD: Yoxdursa çıx.
  form.addEventListener("submit", async (event) => { // AZ QEYD: Submit hadisəsi.
    event.preventDefault(); // AZ QEYD: Default submit dayanır.
    const name = $("#categoryName").value.trim(); // AZ QEYD: Kateqoriya adı.
    if (!name) return; // AZ QEYD: Boşdursa çıx.
    const slug = normalizeText(name).replace(/\s+/g, "-"); // AZ QEYD: URL-dostu slug hazırlayırıq.
    const { error } = await sb.from("categories").insert({ name, slug }); // AZ QEYD: Cədvələ əlavə.
    if (error) { // AZ QEYD: Səhv halı.
      showToast(error.message, true); // AZ QEYD: Xəta.
      return; // AZ QEYD: Dayan.
    }
    showToast("Category added."); // AZ QEYD: Uğurlu mesaj.
    form.reset(); // AZ QEYD: Form təmizlə.
    await populateCategorySelect("#bookCategory"); // AZ QEYD: Select yenilə.
  });
}

// ===============================================================
// AZ QEYD: Bu funksiya admin paneldə yeni müəllif əlavə edir.
// ===============================================================
function bindAddAuthorForm() { // AZ QEYD: authorForm üçün.
  const form = $("#authorForm"); // AZ QEYD: Forma elementi.
  if (!form) return; // AZ QEYD: Yoxdursa çıx.
  form.addEventListener("submit", async (event) => { // AZ QEYD: Submit.
    event.preventDefault(); // AZ QEYD: Default submit dayanır.
    const payload = { // AZ QEYD: authors cədvəli üçün obyekt.
      name: $("#authorName").value.trim(), // AZ QEYD: Müəllif adı.
      nationality: $("#authorNationality").value.trim(), // AZ QEYD: Mənsubiyyət.
      birth_year: Number($("#authorBirthYear").value) || null, // AZ QEYD: Doğum ili.
      biography: $("#authorBiography").value.trim(), // AZ QEYD: Bio.
    };
    const { error } = await sb.from("authors").insert(payload); // AZ QEYD: DB insert.
    if (error) { // AZ QEYD: Səhv halı.
      showToast(error.message, true); // AZ QEYD: Xəta.
      return; // AZ QEYD: Dayan.
    }
    showToast("Author added."); // AZ QEYD: Uğur.
    form.reset(); // AZ QEYD: Form təmizlə.
    await populateAuthorSelect("#bookAuthor"); // AZ QEYD: Müəllif select yenilə.
    await renderAuthorMarquee(); // AZ QEYD: Ana səhifə müəllifləri də gələcəkdə yenilənsin.
  });
}

// ===============================================================
// AZ QEYD: Bu funksiya home səhifədə ümumi statistikaları qurur.
// ===============================================================
async function renderHomeStats() { // AZ QEYD: Hero altındakı rəqəmlər üçün.
  const totalBooksEl = $("#statBooks"); // AZ QEYD: Kitab sayı elementi.
  const totalAuthorsEl = $("#statAuthors"); // AZ QEYD: Müəllif sayı elementi.
  const totalCategoriesEl = $("#statCategories"); // AZ QEYD: Kateqoriya sayı elementi.
  if (!totalBooksEl || !totalAuthorsEl || !totalCategoriesEl) return; // AZ QEYD: Hər hansı element yoxdursa çıx.
  const books = await fetchBooks({}); // AZ QEYD: Kitabları alırıq.
  const authors = await fetchAuthors(); // AZ QEYD: Müəllifləri alırıq.
  const categories = await fetchCategories(); // AZ QEYD: Kateqoriyaları alırıq.
  totalBooksEl.textContent = books.length; // AZ QEYD: Kitab sayı.
  totalAuthorsEl.textContent = authors.length; // AZ QEYD: Müəllif sayı.
  totalCategoriesEl.textContent = categories.length; // AZ QEYD: Kateqoriya sayı.
}

// ===============================================================
// AZ QEYD: Bu funksiya səhifədəki ümumi footer məlumatlarını doldurur.
// ===============================================================
function renderStaticFooter() { // AZ QEYD: Ünvan və əlaqə hissəsi.
  const yearEl = $("#currentYear"); // AZ QEYD: Cari il elementi.
  if (yearEl) yearEl.textContent = new Date().getFullYear(); // AZ QEYD: İli avtomatik yeniləyirik.
}

// ===============================================================
// AZ QEYD: Bu funksiya bütün səhifələrin başlanğıc işlərini birləşdirir.
// ===============================================================
async function boot() { // AZ QEYD: Səhifə ilk açıldıqda çağırılır.
  renderStaticFooter(); // AZ QEYD: Footer ilini doldur.
  await renderHeaderAuth(); // AZ QEYD: Header auth vəziyyəti.
  bindHeroSearch(); // AZ QEYD: Home search form eventləri.
  bindRegisterForm(); // AZ QEYD: Register form eventləri.
  bindLoginForm(); // AZ QEYD: Login form eventləri.
  bindResetPasswordForm(); // AZ QEYD: Reset form eventləri.
  await renderAuthorMarquee(); // AZ QEYD: Müəllif marqısı.
  await renderHomeStats(); // AZ QEYD: Sayğaclar.
  if (page === "home") { // AZ QEYD: Ana səhifədə kitabları göstər.
    const initialQuery = getParam("search") || ""; // AZ QEYD: URL-də search parametri varsa oxuyuruq.
    const searchInput = $("#searchInput"); // AZ QEYD: Header input-u.
    if (searchInput) searchInput.value = initialQuery; // AZ QEYD: Sorğunu input-da göstəririk.
    await renderBooksGrid("#booksGrid", { limit: 8, query: initialQuery }); // AZ QEYD: İlk açılışda və ya URL sorğusunda kitabları göstər.
  }
  if (page === "book-detail") { // AZ QEYD: Detail səhifəsi.
    await renderBookDetailPage(); // AZ QEYD: Seçilən kitabı göstər.
  }
  if (page === "author-detail") { // AZ QEYD: Müəllif detaili.
    await renderAuthorDetailPage(); // AZ QEYD: Müəllif məlumatı və kitabları.
  }
  if (page === "profile") { // AZ QEYD: Profil səhifəsi.
    await bindProfilePage(); // AZ QEYD: Profil loader.
  }
  if (page === "favorites") { // AZ QEYD: Favorit səhifəsi.
    await renderFavoritesPage(); // AZ QEYD: Favorit kitabları göstər.
  }
  if (page === "admin") { // AZ QEYD: Admin səhifəsi.
    await bindAdminPage(); // AZ QEYD: Admin loader.
  }
}

// AZ QEYD: DOM tam yüklənəndə əsas boot funksiyasını başladırıq.
document.addEventListener("DOMContentLoaded", boot); // AZ QEYD: Səhifə hazır olanda işə düşür.
