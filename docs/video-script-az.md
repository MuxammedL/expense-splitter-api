# 15 dəqiqəlik video mətni - Expense Splitter API

Bu mətn `expense-splitter-api` reposu üçün ekran yazısı + səsli izah formatında hazırlanıb. Məqsəd videoda layihənin ideyasını, texnologiyalarını, strukturunu, əsas API axınını, balans hesablamasını, testləri və Docker/GitHub Actions hissəsini aydın göstərməkdir.

## Video planı

| Vaxt | Bölmə | Ekranda göstər |
| --- | --- | --- |
| 00:00-01:00 | Giriş və problem | README, layihə adı |
| 01:00-02:20 | Texnologiyalar | package.json, scripts |
| 02:20-03:40 | Struktur | `src`, `tests`, Dockerfile |
| 03:40-05:20 | Express app və endpointlər | `src/app.ts`, `src/routes/groupRoutes.ts` |
| 05:20-07:30 | Controller axını | `groupController.ts` |
| 07:30-10:00 | Balans və settlement məntiqi | `expenseService.ts` |
| 10:00-12:30 | API demo | terminalda `npm run dev` və curl/Postman |
| 12:30-14:00 | Testlər | `npm test`, integration/unit testlər |
| 14:00-15:00 | Docker və yekun | Dockerfile, README, yekun söz |

---

## 00:00-01:00 - Giriş

Salam. Bu videoda mən `Expense Splitter API` layihəmi təqdim edəcəyəm. Layihənin əsas məqsədi qrup daxilində paylaşılan xərcləri idarə etmək və sonunda kimin kimə nə qədər pul ödəməli olduğunu avtomatik hesablamaqdır.

Məsələn, üç nəfər birlikdə səyahətə gedir. Bir nəfər yeməyə pul ödəyir, başqa biri taksiyə pul ödəyir. Sonda hər kəsin öz payı bərabər bölünməlidir. Əl ilə hesablamaq vaxt aparır və səhv etmək ehtimalı var. Bu API həmin prosesi avtomatlaşdırır.

Layihədə istifadəçi qrup yarada bilir, qrupa üzvlər əlavə edə bilir, həmin qrupa xərclər əlavə edir və sistem avtomatik olaraq balansları və settlement nəticəsini qaytarır. Əsas biznes xüsusiyyəti avtomatik borc balanslaşdırmasıdır.

---

## 01:00-02:20 - Texnologiyalar

İndi texnologiyalara baxaq. Layihə Node.js üzərində qurulub və TypeScript istifadə edir. Backend framework kimi Express seçilib. TypeScript istifadə etməyimin səbəbi kodun daha təhlükəsiz, oxunaqlı və maintainable olmasıdır.

Test üçün Jest və Supertest istifadə olunur. Jest servis məntiqini test etmək üçün, Supertest isə API endpointlərini integration səviyyəsində yoxlamaq üçün istifadə edilir.

Layihədə ESLint də var. Bu, kod stilini qorumaq və potensial səhvləri erkən tapmaq üçün faydalıdır. Bundan əlavə Dockerfile mövcuddur, yəni tətbiqi container kimi build və run etmək mümkündür. GitHub Actions hissəsi isə CI üçün nəzərdə tutulub.

`package.json` faylında əsas scriptlər bunlardır: development üçün `npm run dev`, production build üçün `npm run build`, compiled versiyanı işə salmaq üçün `npm start`, testlər üçün `npm test`, lint yoxlaması üçün isə `npm run lint`.

---

## 02:20-03:40 - Layihə strukturu

İndi repo strukturunu göstərirəm. `src` qovluğu əsas tətbiq kodunu saxlayır. `app.ts` Express tətbiqini yaradır, middleware və routes burada qoşulur. `server.ts` serveri işə salır.

`controllers` qovluğunda request və response logic yerləşir. Yəni istifadəçidən gələn sorğunu qəbul edir, validasiya edir və cavab qaytarır.

`routes` qovluğu endpointləri controller funksiyalarına bağlayır. `services` qovluğunda isə əsas biznes məntiqi var. Bu layihədə ən önəmli hissə `expenseService.ts` faylıdır, çünki balans və settlement hesablaması orada edilir.

`models` və `types` qovluqları data strukturlarını daha aydın saxlamaq üçündür. `data/store` isə sadə in-memory storage kimi istifadə olunur. Bu layihədə database yoxdur; məlumatlar tətbiq işlədiyi müddətdə yaddaşda saxlanılır. Bu, demo və learning project üçün kifayət edir.

---

## 03:40-05:20 - Express app və endpointlər

İndi `src/app.ts` faylına baxaq. Burada Express import olunur, `dotenv` konfiqurasiyası yüklənir və `express.json()` middleware kimi əlavə edilir. Bu middleware JSON body-ləri oxumağa imkan verir.

Əsas root endpoint `/` sadəcə API-nin işlədiyini göstərir. `/health` endpointi status olaraq `UP` qaytarır. Bu endpoint production mühitdə və Docker health check üçün faydalıdır.

`/version` endpointi tətbiqin versiyasını qaytarır. Əgər environment variable olaraq `APP_VERSION` verilibsə onu istifadə edir, yoxdursa default olaraq `1.0.0` qaytarır.

Əsas API hissəsi `/groups` route-u altındadır. `groupRoutes.ts` faylında bu endpointlər var:

- `POST /groups` - yeni qrup yaratmaq üçün
- `POST /groups/:groupId/members` - qrupa üzv əlavə etmək üçün
- `POST /groups/:groupId/expenses` - qrupa xərc əlavə etmək üçün
- `GET /groups` - bütün qrupları görmək üçün
- `GET /groups/:groupId` - konkret qrupun detallarını görmək üçün
- `GET /groups/:groupId/balances` - üzvlərin net balansını hesablamaq üçün
- `GET /groups/:groupId/settlements` - kimin kimə nə qədər ödəməli olduğunu görmək üçün

---

## 05:20-07:30 - Controller logic

İndi `groupController.ts` faylına keçək. Burada bir neçə əsas funksiya var.

Birinci funksiya `createGroup`-dur. Bu funksiya request body-dən `name` dəyərini götürür. Əgər name yoxdursa və ya string deyilsə, 400 status kodu ilə error qaytarır. Əgər məlumat düzgündürsə, yeni qrup yaradılır. Qrupun `id`, `name`, `members` və `expenses` sahələri olur. Başlanğıcda members və expenses boş array olur.

Növbəti funksiya `addMemberToGroup`-dur. Burada əvvəlcə `groupId` ilə qrup tapılır. Qrup tapılmasa 404 qaytarılır. Sonra member adı validate olunur. Əgər eyni adda üzv artıq varsa, duplicate member əlavə etməyə icazə verilmir. Bu, data consistency üçün vacibdir.

`addExpenseToGroup` funksiyası daha çox validasiya edir. Burada title, amount, paidByMemberId və participantIds yoxlanılır. Amount mütləq 0-dan böyük number olmalıdır. `paidByMemberId` həmin qrupda mövcud olan member olmalıdır. `participantIds` boş olmamalıdır və iştirakçıların hamısı həmin qrupa aid olmalıdır.

Bu validasiyalar ona görə vacibdir ki, balans hesablaması düzgün data üzərində işləsin. Əgər mövcud olmayan member xərc ödəyən kimi göstərilsəydi və ya participant list səhv olsaydı, hesablamalar da səhv nəticə verərdi.

---

## 07:30-10:00 - Balans və settlement alqoritmi

İndi layihənin ən vacib hissəsinə, `expenseService.ts` faylına baxaq.

Burada iki əsas funksiya var: `calculateBalances` və `calculateSettlements`.

`calculateBalances` əvvəlcə hər member üçün balansı 0 olaraq başlayır. Sonra bütün expenses üzərindən keçir. Hər xərc üçün amount iştirakçıların sayına bölünür. Buna split amount deyirik.

Məsələn, Dinner xərci 90 manatdır və 3 nəfər arasında bölünürsə, hər kəsin payı 30 manat olur. Əgər Ali 90 manat ödəyibsə, sistem əvvəlcə Ali-nin balansına 90 əlavə edir. Sonra iştirakçıların hər birindən 30 çıxır. Nəticədə Ali üçün 60, Veli üçün -30, Ayse üçün -30 alınır.

Burada pozitiv balans o deməkdir ki, həmin şəxs başqalarından pul almalıdır. Negativ balans isə həmin şəxsin pul ödəməli olduğunu göstərir.

`calculateSettlements` isə bu balansları real ödəniş təkliflərinə çevirir. Əvvəlcə pozitiv balanslı şəxslər creditor kimi ayrılır. Negativ balanslı şəxslər debtor kimi ayrılır. Sonra sistem ən böyük borclu ilə ən böyük alacaqlını qarşılaşdırır və minimum məbləği payment amount kimi götürür.

Bu proses creditor və debtor listləri bitənə qədər davam edir. Nəticədə sistem daha optimallaşdırılmış settlement list qaytarır. Yəni hər kəsin hər kəsə ayrıca pul göndərməsi lazım olmur; minimum sayda ödənişlə balans bağlanır.

Bu layihənin əsas dəyəri məhz buradadır: sadə inputlardan istifadə edərək net borcları hesablamaq və istifadəçiyə aydın payment plan vermək.

---

## 10:00-12:30 - API demo

İndi qısa demo göstərək. Terminalda əvvəlcə dependency-ləri install edirik:

```bash
npm install
```

Sonra development serveri işə salırıq:

```bash
npm run dev
```

Server işə düşəndən sonra əvvəlcə health endpointini yoxlaya bilərik:

```bash
curl http://localhost:3000/health
```

Cavab olaraq status `UP` gəlməlidir.

İndi yeni qrup yaradaq:

```bash
curl -X POST http://localhost:3000/groups \
  -H "Content-Type: application/json" \
  -d '{"name":"Weekend Trip"}'
```

Cavabda group id gələcək. Bu id-ni növbəti sorğularda istifadə edirik.

Sonra qrupa üzvlər əlavə edirik:

```bash
curl -X POST http://localhost:3000/groups/<GROUP_ID>/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali"}'

curl -X POST http://localhost:3000/groups/<GROUP_ID>/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Veli"}'

curl -X POST http://localhost:3000/groups/<GROUP_ID>/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Ayse"}'
```

Hər member üçün ayrıca id gələcək. İndi bir xərc əlavə edirik. Məsələn, Ali 90 manat Dinner ödəyib və bu xərc üç nəfər arasında bölünür:

```bash
curl -X POST http://localhost:3000/groups/<GROUP_ID>/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Dinner",
    "amount":90,
    "paidByMemberId":"<ALI_ID>",
    "participantIds":["<ALI_ID>","<VELI_ID>","<AYSE_ID>"]
  }'
```

İndi balansları yoxlayırıq:

```bash
curl http://localhost:3000/groups/<GROUP_ID>/balances
```

Burada Ali-nin balansı müsbət, Veli və Ayse-nin balansı mənfi görünməlidir.

Sonda settlement endpointini çağırırıq:

```bash
curl http://localhost:3000/groups/<GROUP_ID>/settlements
```

Nəticədə sistem göstərir ki, Veli Ali-yə 30 manat, Ayse də Ali-yə 30 manat ödəməlidir. Bu nəticə balansları bağlayır.

---

## 12:30-14:00 - Testlər

İndi test hissəsinə baxaq. Bu layihədə həm unit testlər, həm də integration testlər var.

`expenseService.test.ts` servis məntiqini yoxlayır. Məsələn, bir xərc olduqda balansların düzgün hesablanması, settlement nəticəsinin düzgün qaytarılması, xərc olmadıqda balansların sıfır qalması və partial participation kimi hallar test olunur.

`group.integration.test.ts` isə real API axınını test edir. Burada qrup yaradılır, üzvlər əlavə olunur, xərc əlavə olunur və sonra balances və settlements endpointləri çağırılır.

Bundan əlavə negative integration testlər də var. Məsələn, group name göndərilməyəndə 400 qaytarılması, olmayan qrupa member əlavə edəndə 404 qaytarılması, duplicate member əlavə etməyə çalışanda error qaytarılması, amount 0 olduqda error qaytarılması kimi hallar yoxlanılır.

Testləri işə salmaq üçün terminalda yazırıq:

```bash
npm test
```

Bu hissə layihənin keyfiyyətini göstərmək üçün vacibdir. Çünki sadəcə API yazmaq kifayət deyil; əsas biznes məntiqinin düzgün işlədiyini testlərlə sübut etmək lazımdır.

---

## 14:00-15:00 - Docker, CI və yekun

Sonda Dockerfile hissəsini göstərək. Dockerfile tətbiqi container içində build edib run etməyə imkan verir. Bu, layihəni başqa mühitdə daha rahat işə salmaq üçün faydalıdır.

Tipik olaraq image build etmək üçün belə command istifadə edə bilərik:

```bash
docker build -t expense-splitter-api:1.0.0 .
```

Sonra containeri run edirik:

```bash
docker run -p 3000:3000 --name expense-api expense-splitter-api:1.0.0
```

GitHub Actions isə CI prosesində build, lint və test kimi addımları avtomatlaşdırmaq üçün istifadə olunur. Bu, hər dəyişiklikdən sonra layihənin işlək qaldığını yoxlamağa kömək edir.

Yekun olaraq, bu layihə TypeScript və Express ilə yazılmış sadə, amma real problem həll edən backend API-dir. Burada REST endpointlər, validation, service layer, unit testlər, integration testlər, Docker və CI kimi backend development üçün vacib anlayışlar istifadə olunur.

Videonun məqsədi həm layihənin necə işlədiyini göstərmək, həm də kodun arxasındakı qərarları izah etmək idi. Diqqətiniz üçün təşəkkür edirəm.

---

## Çəkiliş üçün qısa checklist

- Terminal fontunu böyüt.
- Serveri əvvəlcədən `npm install` ilə hazırla.
- Demo üçün group/member id-ləri kopyalamağa hazır ol.
- Əvvəlcə README göstər, sonra kod, sonra terminal demo.
- Sonda `npm test` və Dockerfile göstər.
- Videoda çox sürətli keçmə; hər endpointin məqsədini bir cümlə ilə izah et.
