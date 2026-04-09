BlueShelf Bookstore — Tam Müdafiə və Quraşdırma Sənədi
Bütün qeydlər, texniki izahlar və görülən dəyişikliklər

1. Layihənin məqsədi
Bu layihə BlueShelf Bookstore adlı premium görünüşlü onlayn kitab mağazası platformasıdır.
Layihə sıfırdan qurulmuşdur və aşağıdakı əsas məqsədləri daşıyır:
istifadəçilərə kitab kataloqu təqdim etmək
kitabları müəllif və kateqoriyaya görə göstərmək
qeydiyyat və giriş sistemi qurmaq
favorit kitab saxlamaq
istifadəçi profil idarəetməsi
admin panel ilə bütün kontenti idarə etmək
ERD diaqram ilə database strukturu göstərmək
responsive premium UI/UX təmin etmək
Bu layihə tam frontend + cloud backend modelində qurulmuşdur.

2. İstifadə olunan texnologiyalar
Layihədə istifadə olunmuş texnologiyalar:
HTML5
CSS3
Vanilla JavaScript
Supabase
GitHub Pages
Font Awesome
Supabase Storage
Supabase Auth
SQL (PostgreSQL)

3. Layihənin fayl strukturu
Layihənin əsas faylları:
index.html → ana səhifə
login.html → giriş səhifəsi
register.html → qeydiyyat
reset-password.html → reset email göndərmə
update-password.html → yeni şifrə təyin etmə
profile.html → istifadəçi profili
favorites.html → favorit kitablar
book-details.html → kitab detail
author-details.html → müəllif detail
admin.html → admin panel
diagrams.html → ERD diaqram
style.css → bütün dizayn
app.js → bütün JS funksionallıq
js/supabase-config.js → Supabase bağlantısı

4. Layihənin qurulması prosesi
Layihə sıfırdan mərhələli şəkildə qurulmuşdur.
Əsas mərhələlər:
frontend skeleton
UI dizayn
database dizayn
auth sistemi
admin panel
favorites
reset password
ERD
responsive düzəlişlər

5. Frontend hissəsi
Frontend tam manual olaraq yazılmışdır.
Framework istifadə olunmayıb.
Bu müəllim qarşısında üstünlükdür.
Çünki:
layihənin bütün məntiqi sıfırdan özümüz tərəfindən yazılmışdır

6. Ana səhifə
index.html
Ana səhifədə aşağıdakılar yerləşir:
premium header
logo
sayt adı
search sistemi
navigation menu
auth buttons
kitab kartları
müəllif marquee
footer

7. Search sistemi
Search hissəsi kitabları aşağıdakılara görə axtarır:
title
author
category
description
JS funksiyası:
bindHeroSearch()

8. Detail səhifələr
Layihədə ayrıca detail səhifələr qurulmuşdur.

Book details
book-details.html
Burada göstərilir:
title
author
category
ISBN
publish year
pages
language
format
short description
full description
cover image

Author details
author-details.html
Burada:
müəllif bio
nationality
birth year
müəllifin kitabları
göstərilir

9. User authentication
Authentication Supabase Auth ilə qurulmuşdur.
İşləyən hissələr:
register
login
logout
reset password
update password

10. Database strukturu
Supabase PostgreSQL istifadə olunub.
Əsas cədvəllər:
profiles
authors
categories
books
favorites

11. Cədvəllər arası əlaqə
Əlaqələr belədir:
authors → books
categories → books
profiles → favorites
books → favorites

12. Books əsas cədvəldir
Books əsas biznes cədvəlidir.
Burada saxlanılır:
author_id
category_id
title
isbn
publish_year
pages
language
format_type
short_description
description
cover_url
is_published

13. Favorites sistemi
favoritə əlavə edir
yenidən klikdə silir
state sinxron qalır
Əsas funksiyalar:
toggleFavoriteBook()
bindFavoriteButtons()
syncFavoriteButtonsState()

14. Profile sistemi
profile.html
İstifadəçi aşağıdakıları dəyişə bilir:
full name
address
avatar
bio
JS funksiyası:
bindProfilePage()

15. Admin panel
admin.html
Layihənin ən güclü hissəsidir.

Admin books
add
edit
delete

Admin categories
add
edit
delete

Admin authors
add
edit
delete

Users directory
Accordion + modal sistemi quruldu.
Admin bütün istifadəçiləri görə bilir.

16. Users problemi
Yeni user qeydiyyatdan keçən kimi avtomatik profiles cədvəlinə düşür.

17. ERD diaqram
diagrams.html
Əl ilə professional ERD quruldu.
SVG xətləri ilə əlaqələr çəkildi.
Cədvəllər:
AUTHORS
CATEGORIES
BOOKS
PROFILES
FAVORITES
Bu hissə müdafiə üçün çox vacibdir.

18. Supabase Storage
Book cover şəkilləri storage-a upload olunur.
Bucket:
book-covers
Funksiya:
uploadBookCover()

19. Responsive dizayn
Desktop və mobile üçün ayrıca düzəlişlər edildi.
Xüsusilə:
header
admin buttons
cards
modal
search
footer

20. Təhlükəsizlik
RLS istifadə olunmuşdur.
Bu o deməkdir:
user yalnız öz profilini dəyişir
user yalnız öz favoritini dəyişir
admin bütün contenti dəyişir

21. Müdafiədə hazır cümlə
Bu layihə sıfırdan HTML, CSS, JavaScript və Supabase istifadə edilərək hazırlanmış tam işlək online bookstore platformasıdır. Burada authentication, admin panel, favorites, ERD, responsive UI və cloud database tam işlək şəkildə qurulmuşdur.

22. Layihənin əsas üstünlükləri
sıfırdan yazılmış
framework-siz
premium UI
responsive
auth
admin dashboard
ERD
favorites
storage
cloud backend
GitHub deployment

23. Nəticə
Layihə tam işlək vəziyyətdədir.
Sıfırdan qurulmuş, professional səviyyədə bookstore platformasıdır.
Müdafiə üçün tam hazırdır.
