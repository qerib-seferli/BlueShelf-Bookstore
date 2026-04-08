# BOOKNEST - Onlayn Kitab Mağazası (Diplom üçün sadə tezis layihəsi)

Bu layihə **çox sadə, dizayn yönümlü, işlək demo sayt** kimi hazırlanıb. Məqsəd odur ki:
- GitHub-a rahat yüklənsin
- müdafiədə göstərilə bilsin
- login / register / logout işləsin
- axtarış işləsin
- kitabın üstünə basanda detalları açılsın
- ERD diaqramı olsun
- kodların içində Azərbaycan dilində qeyd olsun

---

# 1) Layihədə olan fayllar

## Əsas fayllar
- `index.html` → Ana səhifə, kitablar, axtarış, kitab detail modalı
- `login.html` → Login səhifəsi
- `register.html` → Qeydiyyat səhifəsi
- `diagrams.html` → ERD diaqramlarının göstərildiyi səhifə
- `notes.html` → Qısa layihə izahı olan səhifə
- `style.css` → Bütün dizayn kodları
- `app.js` → Bütün JavaScript məntiqi

## Qovluq
- `assets/erd-main.svg`
- `assets/erd-simple.svg`

---

# 2) Layihə necə işləyir?

Bu versiyada **real backend və real database yoxdur**. Diplom üçün sadə işlək demo kimi qurulub.
Məlumatların saxlanması üçün **localStorage** istifadə olunub.

Yəni:
- istifadəçi qeydiyyatdan keçəndə məlumat brauzerdə saxlanır
- login edəndə həmin məlumat localStorage-dən yoxlanılır
- logout edəndə current user silinir

Bu yanaşma diplom üçün uyğundur, çünki sadədir və izah etmək rahatdır.

---

# 3) Saytın əsas funksiyaları

## A) Login / Register / Logout
Bu hissə `app.js` faylında yazılıb.

### Register necə işləyir?
1. İstifadəçi ad, email, şifrə daxil edir
2. JavaScript əvvəlki istifadəçiləri `localStorage` içindən götürür
3. Eyni email varsa, xəbərdarlıq verir
4. Yoxdursa, yeni user yaradılır
5. `booknestUsers` adlı localStorage açarına yazılır
6. Eyni anda user login olmuş kimi `booknestCurrentUser` da yazılır

### Login necə işləyir?
1. İstifadəçi email və şifrə daxil edir
2. `localStorage` içindəki istifadəçilər arasında axtarılır
3. Doğru email + şifrə tapılsa login olur
4. `booknestCurrentUser` yazılır
5. User ana səhifəyə yönləndirilir

### Logout necə işləyir?
1. `booknestCurrentUser` silinir
2. User çıxış etmiş sayılır
3. Düymələr yenilənir

---

## B) Axtarış necə işləyir?
Ana səhifədə search input var.

Axtarışda bu sahələrə baxılır:
- kitab adı
- müəllif adı
- kateqoriya

JavaScript-də `filter()` metodu ilə kitablar süzülür.

Sadə izah:
- istifadəçi nəsə yazır
- JS hər kitabı yoxlayır
- uyğun kitablar qalır
- uyğun olmayanlar gizlənir

---

## C) Kitab detallarının açılması necə işləyir?
Hər kitab kartının üstünə klik olunanda `openBookModal(book.id)` işləyir.

Bu funksiya:
1. Həmin kitabı massivdən tapır
2. Modal içini dinamik HTML ilə doldurur
3. Müəllif, janr, il, kitab haqqında məlumatı göstərir
4. Modalı ekranda açır

Bu hissə müdafiədə çox rahat izah olunur:
> “Mən click event ilə seçilmiş kitabın ID-sini götürüb həmin obyektin detalları əsasında modal pəncərəni doldurmuşam.”

---

# 4) Niyə localStorage istifadə olunub?
Çünki bu layihə sadə tezis layihəsidir və GitHub Pages-də backend işlətmək olmur.

GitHub Pages:
- HTML
- CSS
- JS

statik faylları işlədiyinə görə sadə demo üçün localStorage ən rahat seçimdir.

Müdafiədə belə deyə bilərsən:
> “Bu layihənin demo versiyasında server tərəfi olmadığı üçün istifadəçi məlumatlarını brauzerin localStorage mexanizmi ilə saxladım. Real sistem qurulacağı halda bu hissə database və backend API ilə əvəz olunmalıdır.”

---

# 5) ERD diaqram nəyi göstərir?
ERD diaqramı verilənlər bazasında cədvəllər arasındakı əlaqəni göstərir.

Bu layihəyə uyğun əsas cədvəllər:

## USERS
- user_id (PK)
- full_name
- email
- password

## AUTHORS
- author_id (PK)
- author_name
- bio

## CATEGORIES
- category_id (PK)
- category_name

## BOOKS
- book_id (PK)
- title
- description
- publish_year
- author_id (FK)
- category_id (FK)

---

# 6) Cədvəllər arasındakı əlaqə

## Author → Books
Bir müəllifin bir neçə kitabı ola bilər.
Yəni:
- **1 author → many books**

## Category → Books
Bir kateqoriyada bir neçə kitab ola bilər.
Yəni:
- **1 category → many books**

## User
Bu sadə versiyada user sadəcə login üçün istifadə olunur.
İstəsən sonra basket, order, favorites əlavə edə bilərik.

---

# 7) Müdafiədə verilə biləcək suallar və cavablar

## Sual: Bu layihədə hansı texnologiyalardan istifadə etmisiniz?
Cavab:
- HTML5
- CSS3
- JavaScript
- LocalStorage
- SVG ERD diagrams

## Sual: Niyə backend istifadə etməmisiniz?
Cavab:
Bu ilkin tezis demo versiyasıdır və GitHub Pages üçün hazırlanıb. GitHub Pages server-side texnologiya işlətmədiyi üçün sadə demo məqsədilə localStorage istifadə olunub.

## Sual: Login necə işləyir?
Cavab:
JavaScript istifadəçi məlumatlarını localStorage-də saxlayır. Login zamanı daxil edilən email və şifrə saxlanılan user məlumatı ilə müqayisə olunur.

## Sual: Search necə işləyir?
Cavab:
JavaScript-də kitab massivi `filter()` metodu ilə süzülür. Axtarış title, author və category sahələri üzərindən edilir.

## Sual: Kitab detalları necə açılır?
Cavab:
Hər kart klik event-i ilə seçilir, sonra həmin kitabın ID-sinə görə məlumatlar tapılır və modal pəncərədə göstərilir.

## Sual: ERD diaqramın məqsədi nədir?
Cavab:
ERD diaqram sistemdəki entity-ləri və onların əlaqələrini göstərir. Bu isə gələcəkdə real database qurmaq üçün baza rolunu oynayır.

---

# 8) Kod hissələrinin sadə izahı

## HTML nə edir?
HTML saytın skeletidir.
Məsələn:
- header
- button
- input
- cards
- modal

## CSS nə edir?
CSS görünüşü idarə edir.
Məsələn:
- rənglər
- ölçülər
- responsive görünüş
- shadow, border-radius
- grid və flex düzülüşü

## JavaScript nə edir?
JS saytın canlı işləyən hissəsidir.
Məsələn:
- register
- login
- logout
- search
- modal open/close
- DOM-a kitab kartlarını dinamik yazmaq

---

# 9) localStorage açarları
Layihədə istifadə olunan localStorage açarları:

- `booknestUsers` → qeydiyyatdan keçmiş user-lər
- `booknestCurrentUser` → hazırda login olmuş user

---

# 10) Real sistemə keçid üçün nə etmək olar?
Gələcəkdə layihəni böyütmək üçün:
- Firebase əlavə etmək
- Node.js + Express backend qurmaq
- MySQL və ya PostgreSQL qoşmaq
- Password hash etmək
- Admin panel yaratmaq
- Cart / order sistemi əlavə etmək
- Favorite books bölməsi yaratmaq

---

# 11) Tövsiyə olunan müdafiə cümləsi
Belə deyə bilərsən:

> “Bu layihə online book store mövzusunda sadə və dizayn yönümlü bir veb tətbiq kimi hazırlanmışdır. Layihədə istifadəçi qeydiyyatı, giriş-çıxış sistemi, kitab axtarışı və kitab detalları funksiyaları reallaşdırılmışdır. Demo versiyada məlumatların saxlanılması üçün localStorage istifadə edilmiş, gələcək genişləndirmə üçün isə uyğun ERD diaqramları hazırlanmışdır.”

---

# 12) Vacib qeyd
Bu layihə **tezis üçün sadə, təqdimata uyğun demo** versiyadır.
Real commercial sistem deyil.
Yəni şifrələr plain text saxlanır, backend yoxdur.
Bu, demo məqsədilə belə saxlanılıb.

İstəsən növbəti mərhələdə bunları da əlavə edə bilərik:
1. admin panel
2. real database
3. səbət sistemi
4. sifariş sistemi
5. daha premium animasiyalar
6. daha çox kitab və real şəkillər
