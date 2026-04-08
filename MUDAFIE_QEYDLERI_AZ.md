
# Müdafiə və quraşdırma qeydləri

Bu fayl saytda görünmür. Bu yalnız sənin izah etməyin üçündür.

## 1. Layihənin strukturu
- `index.html` — ana səhifə
- `login.html` — giriş
- `register.html` — qeydiyyat
- `reset-password.html` — şifrə yeniləmə
- `profile.html` — istifadəçi profili
- `favorites.html` — favoritlər
- `book-details.html` — seçilmiş kitabın ayrıca səhifəsi
- `author-details.html` — seçilmiş müəllifin ayrıca səhifəsi
- `admin.html` — kitab, müəllif, kateqoriya idarəetməsi
- `diagrams.html` — ERD diaqramı
- `style.css` — dizayn, animasiya, responsive görünüş
- `app.js` — bütün funksionallıq
- `js/supabase-config.js` — Supabase bağlantı parametrləri
- `sql/*.sql` — Supabase-də run ediləcək SQL faylları

## 2. Müdafiədə necə izah etmək olar
- Frontend `HTML + CSS + JavaScript` ilə qurulub.
- Verilənlər bazası və autentifikasiya `Supabase` üzərindən idarə olunur.
- `profiles`, `authors`, `categories`, `books`, `favorites` cədvəlləri var.
- `books` əsas cədvəldir və `authors` ilə `categories` cədvəllərinə foreign key ilə bağlıdır.
- `favorites` cədvəli istifadəçi ilə kitab arasında münasibət yaradır.
- `RLS` təhlükəsizlik üçündür:
  - hamı kitabları görə bilir,
  - yalnız admin kitab əlavə/silmə/redaktə edə bilir,
  - istifadəçi yalnız öz profilini və öz favoritlərini dəyişə bilir.
- Login və qeydiyyat `Supabase Auth` ilə edilir.
- `app.js` faylında səhifəyə görə funksiyalar bölünüb:
  - `bindLoginForm()`
  - `bindRegisterForm()`
  - `renderBooksGrid()`
  - `renderBookDetailPage()`
  - `bindAdminPage()`
  - və s.

## 3. Niyə ayrıca detail səhifə var?
Kartda qısa məlumat verilir. Klik etdikdə ayrıca `book-details.html` açılır:
- müəllif
- janr
- nə haqqında olduğu
- tarix
- səhifə sayı
- ISBN
- və aşağı hissədə digər kitablar

Bu, UI/UX baxımından daha təmiz görünüş yaradır.

## 4. Niyə müəlliflər ayrıca hərəkətli lentdədir?
- vizual dinamika verir
- mağaza hissi yaradır
- istifadəçi müəllifə klik edib ayrıca müəllif səhifəsinə keçə bilir

## 5. Admin panel necə işləyir?
- Admin login olur
- Kateqoriya əlavə edir
- Müəllif əlavə edir
- Kitab formunu doldurur
- İstəsə cover şəkli URL ilə verir və ya storage-a upload edir
- Daxil edilən məlumat `books` cədvəlinə yazılır
- Cədvəldə edit və delete əməliyyatları var

## 6. GitHub Pages üçün niyə uyğundur?
- Backend server tələb etmir
- Frontend statikdir
- Supabase bütün database və auth hissəsini cloud üzərindən verir

## 7. Quraşdırma sırası
1. Supabase project aç
2. `01_schema_and_policies.sql` run et
3. `02_seed_demo_data.sql` run et
4. Register ol
5. `03_make_user_admin.sql` içində email-i dəyiş və run et
6. Bu qovluğu GitHub Pages-ə yüklə

## 8. Vacib qeyd
Anon key public açardır və frontend üçün istifadə olunur. Service role açarı frontend-ə qoyulmur.
