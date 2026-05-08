<div align="center">

# visualize-optimization

**شبیه‌ساز سه‌بعدی و چندزبانه برای آموزش بهینه‌سازی — Hill Climbing در برابر Random Search**

[![Repository](https://img.shields.io/badge/GitHub-khalooei%2Fvisualize--optimization-1c2533?style=flat-square&logo=github)](https://github.com/khalooei/visualize-optimization)
[![License](https://img.shields.io/badge/License-MIT-0d9488?style=flat-square)](https://github.com/khalooei/visualize-optimization/blob/main/LICENSE)
[![Stack](https://img.shields.io/badge/Stack-FastAPI%20%2B%20Plotly-38bdf8?style=flat-square)](https://fastapi.tiangolo.com/)

[**پرش به العربية**](#النسخة-العربية-rtl) · [**Jump to English**](#english-version-ltr)

[![نسخهٔ زنده — GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-0d9488?style=for-the-badge)](https://khalooei.github.io/visualize-optimization/)

</div>

---

## نسخهٔ زنده (GitHub Pages)

**آدرس دمو:** [**https://khalooei.github.io/visualize-optimization/**](https://khalooei.github.io/visualize-optimization/)

| نقش | توضیح |
|-----|--------|
| **دانشجو / مخاطب** | همان لینک؛ مرورگر مدرن کافی است؛ **نیازی به Python نیست**. |
| **منتشرکنندهٔ مخزن** | GitHub Pages فقط **فایل‌های استاتیک** را سرو می‌کند؛ **سرور FastAPI روی Pages اجرا نمی‌شود**. خودِ رابط کاربری این پروژه **کاملاً در مرورگر** (HTML + JavaScript + Plotly از CDN) کار می‌کند؛ workflow زیر همان bundle را می‌سازد و منتشر می‌کند. |

### فعال‌سازی یک‌بار در تنظیمات GitHub

1. در مخزن بروید به **Settings** → **Pages**.
2. در **Build and deployment**، فیلد **Source** را روی **GitHub Actions** بگذارید (نه «Deploy from a branch» مگر اینکه خودتان پوشهٔ `docs/` را به‌صورت دستی پر کرده باشید).
3. فایل workflow همین پروژه است: [`.github/workflows/pages.yml`](.github/workflows/pages.yml). با هر **push** به شاخهٔ `main` اجرا می‌شود؛ یا از تب **Actions** گزینهٔ **Run workflow** را بزنید.
4. پس از پایان jobهای **build** و **deploy** (معمولاً ۱–۳ دقیقه)، آدرس بالا باید **برنامهٔ تعاملی سه‌بعدی** را نشان دهد.

> **اگر هنوز متن README یا مارک‌داون «خام» می‌بینید:** احتمالاً Pages هنوز از منبع دیگری (مثلاً ریشهٔ branch بدون `index.html` درست) تغذیه می‌شود. **Source** را حتماً روی **GitHub Actions** تنظیم کنید تا خروجی workflow (شامل `index.html` و `static/`) مستقر شود.

---

## پیوند با دیگر ابزارهای آموزشی بهینه‌سازی

این مخزن بخشی از مجموعهٔ آموزشی بهینه‌سازی است. برای مبحث **فضای نمونه در برابر فضای پارامتر** و **گرادیان کاهشی** روی منظرهٔ خطا، شبیه‌ساز رگرسیون خطی را ببینید:

[![tutorial-linear-regression-simulator-app](https://img.shields.io/badge/آموزش--رگرسیون--خطی-tutorial--linear--regression--simulator--app-f472b6?style=for-the-badge&logo=github)](https://github.com/khalooei/tutorial-linear-regression-simulator-app)

| مخزن | تمرکز آموزشی |
|------|----------------|
| [**visualize-optimization**](https://github.com/khalooei/visualize-optimization) (همین پروژه) | مقایسهٔ **Hill Climbing** و **Random Search** روی مناظر \(f(x,y)\)، مفاهیم **بهینهٔ محلی / سراسری**، نمای **۳ بعدی تعاملی** |
| [**tutorial-linear-regression-simulator-app**](https://github.com/khalooei/tutorial-linear-regression-simulator-app) | رگرسیون خطی، **MSE / MAE / Huber**، **Gradient Descent**، جزئیات گام‌به‌گام با **LaTeX** |

---

## نسخهٔ فارسی (RTL)

### معرفی

بهینه‌سازی را می‌توان بدون ورود زودهنگام به جبر سنگین، با **دیدن** منظرهٔ تابع و **حرکت الگوریتم** روی آن آموزش داد. این برنامه یک **منظرهٔ سه‌بعدی تعاملی** از تابع هدف \(f(x,y)\) نشان می‌دهد و هم‌زمان دو رویکرد کلاسیک را کنار هم می‌گذارد:

- **تپه نوردی (Hill Climbing)** روی مسئلهٔ **کمینه‌سازی**: فقط حرکت‌هایی پذیرفته می‌شوند که مقدار تابع را کاهش دهند؛ مسیر معمولاً **حریص** و **محلی** است و ممکن است در یک **بهینهٔ محلی** گیر کند.
- **جستجوی تصادفی (Random Search)**: نمونه‌گیری در کل **دامنه**؛ بهترین نمونه گزارش می‌شود. با افزایش بودجهٔ نمونه، **شانس رسیدن به درهٔ عمیق‌تر** (اغلب نزدیک **بهینهٔ سراسری**) بیشتر می‌شود.

رابط کاربری به **سه زبان فارسی، عربی و انگلیسی** طراحی شده است تا در کلاس‌های چندزبانه یا بین‌المللی بدون تغییر کد قابل استفاده باشد.

### پیش‌نمایش (چه چیزی می‌بینید؟)

- سطح رنگی \(z = f(x,y)\) با **چرخش و زوم** (Plotly)
- **مسیر Hill Climbing** (خط) از نقطهٔ شروع تا توقف
- **نمونه‌های Random Search** و **بهترین نمونه**
- نشانگر **بهینهٔ سراسری** (مرجع آموزشی) و در منظرهٔ «دو چاله»، نمونه‌ای از **بهینهٔ محلی**

### مناظر نمونه (تابع هدف)

| منظره | هدف آموزشی کوتاه |
|--------|---------------------|
| کاسهٔ صاف | یک چاله؛ همگرایی شهودی هر دو روش در شرایط ساده |
| دو چاله | تفاوت آشکار **سراسری عمیق** و **محلی کم‌عمق** |
| Rastrigin | چاله‌های متعدد؛ گیر محلی Hill Climbing |
| Ackley | بشقاب موج‌دار؛ مقایسهٔ اکتشاف محلی و سراسری |

### قابلیت‌ها

- تم **تیره / روز** و ذخیرهٔ ترجیح در مرورگر
- حالت Hill Climbing: **گام تصادفی در شعاع** یا **۸ همسایهٔ شبکه‌ای**
- کنترل **بذرهٔ تصادفی**، نقطهٔ شروع، گام‌ها، اندازهٔ گام و تعداد نمونه‌های RS
- **انیمیشن تدریجی مسیر HC** با تأخیر قابل تنظیم و دکمهٔ توقف
- شمارنده‌های **بهترین مقدار HC / RS** و مرجع مقدار در **کمینهٔ سراسری** نمایش‌داده‌شده

### اجرای سریع

```bash
git clone https://github.com/khalooei/visualize-optimization.git
cd visualize-optimization
python -m venv .venv
```

**Windows (PowerShell):**

```powershell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Linux / macOS:**

```bash
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

سپس مرورگر را باز کنید: **`http://127.0.0.1:8000`**

> **نکته:** اگر هم‌زمان [شبیه‌ساز رگرسیون خطی](https://github.com/khalooei/tutorial-linear-regression-simulator-app) را روی پورت دیگری اجرا می‌کنید، برای جلوگیری از تداخل، پورت این برنامه را عوض کنید (مثلاً `--port 8001`).

### سناریوی پیشنهادی برای تدریس

1. منظرهٔ **کاسهٔ صاف** را باز کنید و اثر نقطهٔ شروع را نشان دهید.
2. به **دو چاله** بروید: **بهینهٔ سراسری** و **محلی** را روی سطح و در اعداد مقایسه کنید.
3. **Rastrigin** را با بذره‌های مختلف امتحان کنید؛ توقف HC در بهینه‌های محلی را بحث کنید.
4. بودجهٔ **Random Search** را زیاد کنید و ببینید چه زمانی RS به درهٔ سراسری نزدیک‌تر می‌شود.
5. در پایان، پیوند بدهید به شبیه‌ساز GD در فضای پارامتر رگرسیون خطی:  
   [**tutorial-linear-regression-simulator-app**](https://github.com/khalooei/tutorial-linear-regression-simulator-app)

### مخزن و مجوز

- مخزن اصلی این پروژه: **[github.com/khalooei/visualize-optimization](https://github.com/khalooei/visualize-optimization)**  
- مجوز: **MIT** (طبق [فایل LICENSE](https://github.com/khalooei/visualize-optimization/blob/main/LICENSE) در GitHub)

---

## النسخة العربية (RTL)

### عرض مباشر (GitHub Pages)

[**https://khalooei.github.io/visualize-optimization/**](https://khalooei.github.io/visualize-optimization/) — يعمل في المتصفح فقط (HTML/JS). لنشر التحديثات: **Settings → Pages → Source: GitHub Actions** ثم دفع إلى `main` أو تشغيل workflow **Deploy GitHub Pages**.

<div align="center">

[![المستودع](https://img.shields.io/badge/GitHub-visualize--optimization-1c2533?style=flat-square&logo=github)](https://github.com/khalooei/visualize-optimization)
[![الترخيص](https://img.shields.io/badge/License-MIT-0d9488?style=flat-square)](https://github.com/khalooei/visualize-optimization/blob/main/LICENSE)

[**الربط بمشروع الانحدار الخطي التعليمي**](https://github.com/khalooei/tutorial-linear-regression-simulator-app)

</div>

### نظرة عامة

هذه الأداة تعلّم مفاهيم التحسين بطريقة بصرية عبر **سطح ثلاثي الأبعاد تفاعلي** للدالة \(f(x,y)\)، وتقارن مباشرةً بين:

- **صعود التل (Hill Climbing)** لمسألة **التصغير**: يقبل فقط الخطوات التي تخفّض قيمة الدالة؛ غالباً ما يكون **جشعاً** وقد **يعلق في حد أدنى محلي**.
- **البحث العشوائي (Random Search)**: عينات موزّعة على **كامل المجال**؛ يُبلغ عن أفضل عينة. مع زيادة عدد العينات تزداد فرصة الوصول إلى **حوض أعمق** (غالباً قريب من **الحد الأدنى العام**).

واجهة المستخدم تدعم **العربية والفارسية والإنجليزية** لاستخدام أكاديمي مرن.

### المشهد التعليمي المقترن

لمشاهدة **فضاء العينة مقابل فضاء المعاملات** وحركة **انحدار التدرج (Gradient Descent)** مع تفاصيل **LaTeX**، راجع المشروع المرافق:

[![tutorial-linear-regression-simulator-app](https://img.shields.io/badge/محاكي--الانحدار--الخطي-tutorial--linear--regression--simulator--app-f472b6?style=for-the-badge&logo=github)](https://github.com/khalooei/tutorial-linear-regression-simulator-app)

### التشغيل السريع

```bash
git clone https://github.com/khalooei/visualize-optimization.git
cd visualize-optimization
python -m venv .venv
```

**Windows (PowerShell):**

```powershell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Linux / macOS:**

```bash
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

افتح المتصفح على: **`http://127.0.0.1:8000`**

### الروابط

- مستودع هذا المشروع: **[github.com/khalooei/visualize-optimization](https://github.com/khalooei/visualize-optimization)**

---

## English version (LTR)

### Live site (GitHub Pages)

**Demo URL:** [**https://khalooei.github.io/visualize-optimization/**](https://khalooei.github.io/visualize-optimization/)

This URL must serve the **static web app** (`index.html` + `static/*`), not a raw README. GitHub Pages does **not** run FastAPI; deployment is handled by [**`.github/workflows/pages.yml`**](.github/workflows/pages.yml), which copies `templates/index.html` and `static/` into the Pages artifact.

**One-time setup:** Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**. Push to `main` (or run the workflow manually). After **Deploy GitHub Pages** completes, the demo link should load the interactive Plotly UI.

<div align="center">

[![GitHub — visualize-optimization](https://img.shields.io/badge/GitHub-khalooei%2Fvisualize--optimization-1c2533?style=flat-square&logo=github)](https://github.com/khalooei/visualize-optimization)
[![License: MIT](https://img.shields.io/badge/License-MIT-0d9488?style=flat-square)](https://github.com/khalooei/visualize-optimization/blob/main/LICENSE)

**Companion repo (sample vs parameter space, gradient descent):**  
[![tutorial-linear-regression-simulator-app](https://img.shields.io/badge/Related-repo-tutorial--linear--regression--simulator--app-f472b6?style=for-the-badge&logo=github)](https://github.com/khalooei/tutorial-linear-regression-simulator-app)

</div>

### Overview

**visualize-optimization** is a small, browser-based teaching lab for **black-box optimization intuition**. It renders a **3D surface** for a 2D objective \(f(x,y)\) and compares:

- **Hill climbing (minimization)**: accept moves only if they **lower** the objective. The trajectory is typically **greedy** and may converge to a **local minimum**.
- **Random search**: draw **i.i.d.** samples across the domain and track the best point. With more samples, you increase the chance of landing in a **deeper basin** (often closer to a **global** minimizer on these demo landscapes).

The UI is **trilingual** (**Persian / Arabic / English**) so the same deployment works for multilingual classrooms without code changes.

### What you can demonstrate

- **Global vs local minima** using the **double-well** landscape (star vs cross markers)
- **Multimodal** difficulty using **Rastrigin** and **Ackley**
- **Algorithmic contrast**: connected greedy path (HC) vs scattered exploration (RS)
- Optional **animated** playback of the HC path (configurable delay + stop)

### Quick start

```bash
git clone https://github.com/khalooei/visualize-optimization.git
cd visualize-optimization
python -m venv .venv
```

**Windows (PowerShell):**

```powershell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Linux / macOS:**

```bash
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Open: **`http://127.0.0.1:8000`**

> **Tip:** If you also run the [linear regression optimization simulator](https://github.com/khalooei/tutorial-linear-regression-simulator-app) locally, pick different ports for each app.

### Repository

- This project: **[github.com/khalooei/visualize-optimization](https://github.com/khalooei/visualize-optimization)**

### Tech stack

- **FastAPI** (server + templates)
- **Plotly** (interactive 3D charts)
- Static **HTML / CSS / JavaScript** frontend

---

## Author / الاتصال / نویسنده

**Mohammad Khalooei**

- GitHub: [@khalooei](https://github.com/khalooei)
- This repo: **[khalooei/visualize-optimization](https://github.com/khalooei/visualize-optimization)**
- Related teaching repo: **[khalooei/tutorial-linear-regression-simulator-app](https://github.com/khalooei/tutorial-linear-regression-simulator-app)**

For academic questions or collaboration (as in the companion project README): **khalooei@aut.ac.ir**

---

<div align="center">

<sub>Prepared with a focus on clarity, classroom usability, and a clean bridge to the regression + gradient descent simulator.</sub>

</div>
