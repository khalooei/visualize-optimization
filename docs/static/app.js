/**
 * visualize_optimization — 3D Plotly: hill climbing vs random search, trilingual UI.
 */

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function linspace(a, b, n) {
  const out = [];
  if (n <= 1) return [a];
  for (let i = 0; i < n; i++) out.push(a + ((b - a) * i) / (n - 1));
  return out;
}

const LANDSCAPES = {
  smooth_bowl: {
    domain: { x: [-2.5, 2.5], y: [-2.5, 2.5] },
    f(x, y) {
      return (x - 0.4) ** 2 + (y + 0.3) ** 2;
    },
    globalMin: { x: 0.4, y: -0.3 },
    localHints: [],
  },
  double_well: {
    domain: { x: [-2.85, 2.85], y: [-2.85, 2.85] },
    f(x, y) {
      const reg = 0.018 * (x * x + y * y);
      const g1 = -3.05 * Math.exp(-((x + 1.32) ** 2 + (y + 1.32) ** 2) / 0.34);
      const g2 = -1.12 * Math.exp(-((x - 1.68) ** 2 + (y - 1.68) ** 2) / 0.82);
      return reg + g1 + g2;
    },
    globalMin: { x: -1.32, y: -1.32 },
    localHints: [{ x: 1.68, y: 1.68 }],
  },
  rastrigin: {
    domain: { x: [-2.12, 2.12], y: [-2.12, 2.12] },
    f(x, y) {
      const A = 10;
      return A * 2 + (x * x - A * Math.cos(2 * Math.PI * x)) + (y * y - A * Math.cos(2 * Math.PI * y));
    },
    globalMin: { x: 0, y: 0 },
    localHints: [],
  },
  ackley: {
    domain: { x: [-4, 4], y: [-4, 4] },
    f(x, y) {
      const a = 20;
      const b = 0.2;
      const c = 2 * Math.PI;
      const s = 0.5 * (x * x + y * y);
      const t1 = -a * Math.exp(-b * Math.sqrt(s));
      const t2 = -Math.exp(0.5 * (Math.cos(c * x) + Math.cos(c * y)));
      return t1 + t2 + Math.E + a;
    },
    globalMin: { x: 0, y: 0 },
    localHints: [],
  },
};

const I18N = {
  fa: {
    title: "بهینه‌سازی تعاملی در ۳ بعد — تپه نوردی در مقابل جستجوی تصادفی",
    subtitle: "منظرهٔ هزینه، کمینهٔ سراسری و محلی؛ نمای سه‌بعدی و نقشهٔ دوبعدی هم‌زمان",
    intro_title: "ایدهٔ آموزشی",
    intro_p1:
      "در کمینه‌سازی، «کمینهٔ سراسری» بهترین مقدار در کل دامنه است؛ «کمینهٔ محلی» فقط از نظر همسایگی بهتر است. تپه نوردی (HC) فقط بهبودهای محلی می‌پذیرد؛ بنابراین اغلب در چاله‌های کم‌عمق گیر می‌کند. جستجوی تصادفی (RS) نمونه‌ها را در کل دامنه می‌پاشد و گاهی چالهٔ عمیق‌تر را می‌یابد — هرچه بودجهٔ نمونه بیشتر شود، شانس یافتن سراسری بهتر می‌شود.",
    bullet_hc: "HC: از نقطهٔ شروع، فقط اگر نقطهٔ جدید هزینه را کاهش دهد حرکت می‌کند؛ مسیر پیوسته و حریص است.",
    bullet_rs: "RS: نمونه‌های مستقل در دامنه؛ بهترین نمونه گزارش می‌شود — بدون حریص بودن محلی.",
    bullet_local: "کمینهٔ محلی: اطرافش را بالا بروید هزینه بدتر می‌شود؛ اما جای بهتری در جای دیگر دامنه وجود دارد.",
    bullet_global: "کمینهٔ سراسری: هیچ نقطه‌ای در دامنه بهتر از آن نیست (در این دمو با نشانگر طلایی مشخص شده است).",
    repro_note: "بذرهٔ تصادفی را تغییر دهید تا شروع و نمونه‌های RS تکرارپذیر یا متفاوت شوند.",
    formula_note:
      "نمونه‌ها: کاسهٔ صاف (یک چاله)، چالهٔ دوتایی (سراسری عمیق و محلی کم‌عمق)، Rastrigin و Ackley (چاله‌های متعدد). هدف: min f(x,y).",
    controls_title: "کنترل‌ها",
    label_landscape: "منظرهٔ تابع",
    landscape_bowl: "کاسهٔ صاف (یک کمینه)",
    landscape_double: "دو چاله — سراسری و محلی",
    landscape_rastrigin: "Rastrigin (چاله‌های متعدد)",
    landscape_ackley: "Ackley (بشقاب موج‌دار)",
    label_seed: "بذرهٔ تصادفی",
    label_start_x: "شروع x₀",
    label_start_y: "شروع y₀",
    label_hc_mode: "حالت تپه نوردی",
    hc_mode_random: "گام تصادفی در شعاع",
    hc_mode_neighbors: "۸ همسایهٔ شبکه‌ای",
    label_hc_steps: "حداکثر گام HC",
    label_hc_step: "اندازهٔ گام HC",
    label_rs_samples: "تعداد نمونهٔ RS",
    label_anim_delay: "تأخیر انیمیشن HC (میلی‌ثانیه)",
    label_show_all_rs: "نمایش همهٔ نمونه‌های RS",
    btn_run: "اجرای مقایسه",
    btn_animate_hc: "پخش تدریجی مسیر HC",
    btn_stop: "توقف",
    btn_reset_view: "بازنشانی نما (۳بعدی و محورهای ۲بعدی)",
    chart_pair_lead:
      "چیدمان از چپ به راست: سه‌بعدی، سپس دوبعدی. نوار باریک وسط را بکشید تا یک پنجره بزرگ‌تر شود — برای تمرکز روی شکل فضایی یا روی نقشهٔ تراز.",
    chart_title_3d: "سطح سه‌بعدی f(x, y)",
    chart_hint_3d:
      "بچرخانید و زوم کنید. رنگ‌ها همان f است. سیان: مسیر HC؛ بنفش: RS؛ ستاره: کمینهٔ سراسری؛ ضربدر: کمینهٔ محلی (دوچاله).",
    chart_title_2d: "نقشهٔ تراز (کانتور) روی صفحهٔ (x, y)",
    chart_hint_2d:
      "همان دامنه و همان نمادها، از بالا: چاله‌ها و مسیر HC روی خطوط تراز دیده می‌شود. محورها با مقیاس یکسان‌اند تا فاصله در دامنه درست باشد.",
    gutter_help: "کشیدن نوار وسط برای تغییر نسبت عرض نمودار سه‌بعدی و دوبعدی",
    metric_hc_final: "بهترین مقدار HC",
    metric_rs_best: "بهترین مقدار RS",
    metric_global_ref: "مقدار در کمینهٔ سراسری (مرجع)",
    legend_surface: "سطح f(x,y)",
    legend_hc: "مسیر HC",
    legend_rs: "نمونه‌های RS",
    legend_global: "کمینهٔ سراسری",
    legend_local: "کمینهٔ محلی (نمونه)",
    status_running: "در حال اجرا…",
    status_done: "آماده.",
    status_stopped: "متوقف شد.",
    status_anim: "پخش مسیر HC…",
    theme_dark: "شب",
    theme_light: "روز",
    footer: "تهیه‌شده توسط محمد خالوئی",
  },
  en: {
    title: "Interactive 3D optimization — hill climbing vs random search",
    subtitle: "3D surface plus 2D contour map — same data, clearer basins and paths",
    intro_title: "Teaching idea",
    intro_p1:
      "In minimization, a global minimum is the best value over the entire domain; a local minimum is only best in a neighborhood. Hill climbing (HC) accepts only improving moves, so it often gets trapped in a shallow basin. Random search (RS) draws independent samples across the domain and keeps the best — with more samples, the chance of finding a deeper (often global) basin improves.",
    bullet_hc: "HC: from the start point, moves only when a candidate lowers the cost; the path is greedy and connected.",
    bullet_rs: "RS: independent uniform samples; reports the best sample — no local greed.",
    bullet_local: "Local minimum: moving a little in any direction worsens the cost, yet a better point exists elsewhere.",
    bullet_global: "Global minimum: no point in the domain is better (marked with a gold star in this demo).",
    repro_note: "Change the random seed to make starts and RS samples reproducible or varied.",
    formula_note:
      "Landscapes: smooth bowl (one well), double well (deep global vs shallow local), Rastrigin and Ackley (many wells). Objective: minimize f(x,y).",
    controls_title: "Controls",
    label_landscape: "Objective landscape",
    landscape_bowl: "Smooth bowl (unimodal)",
    landscape_double: "Double well (global + local)",
    landscape_rastrigin: "Rastrigin (many local wells)",
    landscape_ackley: "Ackley (rippled plate)",
    label_seed: "Random seed",
    label_start_x: "Start x₀",
    label_start_y: "Start y₀",
    label_hc_mode: "Hill climbing mode",
    hc_mode_random: "Random step in radius",
    hc_mode_neighbors: "8 grid neighbors",
    label_hc_steps: "Max HC iterations",
    label_hc_step: "HC step size",
    label_rs_samples: "Random search samples",
    label_anim_delay: "HC animation delay (ms)",
    label_show_all_rs: "Show all RS samples",
    btn_run: "Run comparison",
    btn_animate_hc: "Animate HC path",
    btn_stop: "Stop",
    btn_reset_view: "Reset 3D camera & 2D axes",
    chart_pair_lead:
      "Layout is left-to-right: 3D then 2D. Drag the narrow bar between panes to resize — focus on the surface shape or the contour map.",
    chart_title_3d: "3D surface f(x, y)",
    chart_hint_3d:
      "Drag to orbit, scroll to zoom. Colors encode f. Cyan: HC path; purple: RS; star: global minimum; crosses: local minimum (double well).",
    chart_title_2d: "Contour map (top-down)",
    chart_hint_2d:
      "Same domain and markers as 3D, from above: basins and the HC path on level sets. Axes use a 1:1 scale so distances in the domain are true.",
    gutter_help: "Drag the middle bar to resize the 3D vs 2D pane widths",
    metric_hc_final: "Best HC value",
    metric_rs_best: "Best RS value",
    metric_global_ref: "Value at global min (ref)",
    legend_surface: "Surface f(x,y)",
    legend_hc: "HC path",
    legend_rs: "RS samples",
    legend_global: "Global minimum",
    legend_local: "Local minimum (demo)",
    status_running: "Running…",
    status_done: "Ready.",
    status_stopped: "Stopped.",
    status_anim: "Animating HC…",
    theme_dark: "Night",
    theme_light: "Day",
    footer: "Prepared by Mohammad Khalooei",
  },
  ar: {
    title: "تحسين تفاعلي ثلاثي الأبعاد — صعود التل مقابل البحث العشوائي",
    subtitle: "منظر دالة التكلفة، الحد الأدنى العام مقابل المحلي، مسارات تفاعلية",
    intro_title: "الفكرة التعليمية",
    intro_p1:
      "في التصغير، الحد الأدنى العام هو الأفضل على كامل المجال، والحد الأدنى المحلي أفضل فقط في جوار نقطة ما. صعود التل (HC) يقبل تحسينات محلية فقط، فيعلق غالبا في حوض ضحل. البحث العشوائي (RS) يأخذ عينات مستقلة عبر المجال ويحتفظ بالأفضل — ومع زيادة عدد العينات تزداد فرصة إيجاد حوض أعمق (غالبا عام).",
    bullet_hc: "HC: من نقطة البداية يتحرك فقط إذا خفّت التكلفة؛ المسار جشع ومتصل.",
    bullet_rs: "RS: عينات موحدة مستقلة؛ يُبلغ عن أفضل عينة — بلا جشع محلي.",
    bullet_local: "حد أدنى محلي: أي إزاحة صغيرة تزيد التكلفة، لكن توجد نقطة أفضل في مكان آخر.",
    bullet_global: "حد أدنى عام: لا توجد نقطة أفضل في المجال (يُمثل بنجمة ذهبية في العرض).",
    repro_note: "غيّر البذرة لتكرار أو تنويع نقطة البداية وعينات RS.",
    formula_note:
      "المناظر: كأس ناعم، بئر مزدوج (عام عميق ومحلي ضحل)، Rastrigin وAckley (آبار متعددة). الهدف: min f(x,y).",
    controls_title: "عناصر التحكم",
    label_landscape: "منظر الدالة",
    landscape_bowl: "كأس ناعم (واحد)",
    landscape_double: "بئر مزدوج (عام + محلي)",
    landscape_rastrigin: "Rastrigin (آبار كثيرة)",
    landscape_ackley: "Ackley (هضبة متموجة)",
    label_seed: "البذرة العشوائية",
    label_start_x: "البداية x₀",
    label_start_y: "البداية y₀",
    label_hc_mode: "نمط صعود التل",
    hc_mode_random: "خطوة عشوائية في نصف قطر",
    hc_mode_neighbors: "8 جيران شبكية",
    label_hc_steps: "أقصى تكرار لـ HC",
    label_hc_step: "حجم خطوة HC",
    label_rs_samples: "عينات البحث العشوائي",
    label_anim_delay: "تأخير حركة HC (مللي ث)",
    label_show_all_rs: "إظهار كل عينات RS",
    btn_run: "تشغيل المقارنة",
    btn_animate_hc: "تشغيل مسار HC",
    btn_stop: "إيقاف",
    btn_reset_view: "إعادة ضبط الكاميرا والمحاور ثنائية البعد",
    chart_pair_lead:
      "من اليسار إلى اليمين: ثلاثي الأبعاد ثم ثنائي. اسحب الشريط الوسطي لتغيير حجم اللوحتين.",
    chart_title_3d: "سطح ثلاثي f(x, y)",
    chart_hint_3d:
      "اسحب للدوران والتكبير. الألوان تمثل f. سماوي: HC؛ بنفسجي: RS؛ نجمة: الحد العام؛ صليب: حد محلي (البئر المزدوج).",
    chart_title_2d: "خريطة كنتور من الأعلى",
    chart_hint_2d:
      "نفس المجال والرموز: الحفر ومسار HC على خطوط التساوي. المحاور بنسبة 1:1 لمسافات صحيحة.",
    gutter_help: "اسحب الشريط الوسطي لتغيير عرض اللوحتين",
    metric_hc_final: "أفضل قيمة HC",
    metric_rs_best: "أفضل قيمة RS",
    metric_global_ref: "القيمة عند الحد العام (مرجع)",
    legend_surface: "السطح f(x,y)",
    legend_hc: "مسار HC",
    legend_rs: "عينات RS",
    legend_global: "الحد الأدنى العام",
    legend_local: "الحد الأدنى المحلي (عرض)",
    status_running: "جار التشغيل…",
    status_done: "جاهز.",
    status_stopped: "تم الإيقاف.",
    status_anim: "تشغيل مسار HC…",
    theme_dark: "ليلي",
    theme_light: "نهاري",
    footer: "إعداد محمد خالوئی — Mohammad Khalooei",
  },
};

let lang = "fa";
let lastHcPath = [];
let lastRsPoints = [];
let lastRsBest = null;
let lastGlobalZ = 0;
let animTimer = null;
let animating = false;
let plot3dInitialized = false;
let plot2dInitialized = false;

const SPLIT_KEY = "vizopt-split-ratio";
let splitRatio = 0.5;
try {
  const s = parseFloat(localStorage.getItem(SPLIT_KEY));
  if (!Number.isNaN(s) && s >= 0.22 && s <= 0.78) splitRatio = s;
} catch (_) {}

function applySplitLayout() {
  const wrap = document.getElementById("charts-split");
  if (!wrap) return;
  if (window.matchMedia("(max-width: 960px)").matches) {
    wrap.style.gridTemplateColumns = "";
    return;
  }
  wrap.style.gridTemplateColumns = `${splitRatio}fr 12px ${1 - splitRatio}fr`;
}

function resizePlots() {
  const e3 = document.getElementById("plot-3d");
  const e2 = document.getElementById("plot-2d");
  if (plot3dInitialized && e3) Plotly.Plots.resize(e3);
  if (plot2dInitialized && e2) Plotly.Plots.resize(e2);
}

function initSplitGutter() {
  const gutter = document.getElementById("split-gutter");
  const wrap = document.getElementById("charts-split");
  if (!gutter || !wrap) return;

  let capPid = null;

  const onPointerMove = (ev) => {
    const r = wrap.getBoundingClientRect();
    const total = r.width - 12;
    if (total <= 0) return;
    const x = ev.clientX - r.left;
    splitRatio = clamp(x / total, 0.22, 0.78);
    applySplitLayout();
    resizePlots();
  };

  const endDrag = () => {
    if (capPid != null) {
      try {
        gutter.releasePointerCapture(capPid);
      } catch (_) {}
      capPid = null;
    }
    gutter.removeEventListener("pointermove", onPointerMove);
    gutter.removeEventListener("pointerup", endDrag);
    gutter.removeEventListener("pointercancel", endDrag);
    try {
      localStorage.setItem(SPLIT_KEY, String(splitRatio));
    } catch (_) {}
  };

  gutter.addEventListener("pointerdown", (e) => {
    if (window.matchMedia("(max-width: 960px)").matches) return;
    e.preventDefault();
    capPid = e.pointerId;
    gutter.setPointerCapture(capPid);
    gutter.addEventListener("pointermove", onPointerMove);
    gutter.addEventListener("pointerup", endDrag);
    gutter.addEventListener("pointercancel", endDrag);
  });
}

function renderBothPlots(hcPathSlice) {
  const meta = land();
  const p3 = buildPlot(hcPathSlice, lastRsPoints, lastRsBest, meta);
  const p2 = buildPlot2D(hcPathSlice, lastRsPoints, lastRsBest, meta);
  const el3 = document.getElementById("plot-3d");
  const el2 = document.getElementById("plot-2d");
  if (plot3dInitialized) Plotly.react(el3, p3.traces, p3.layout, p3.config);
  else {
    Plotly.newPlot(el3, p3.traces, p3.layout, p3.config);
    plot3dInitialized = true;
  }
  if (plot2dInitialized) Plotly.react(el2, p2.traces, p2.layout, p2.config);
  else {
    Plotly.newPlot(el2, p2.traces, p2.layout, p2.config);
    plot2dInitialized = true;
  }
}

function currentLandId() {
  return document.getElementById("select-landscape").value;
}

function land() {
  return LANDSCAPES[currentLandId()];
}

function applyI18n() {
  const dict = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" || lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.querySelectorAll("select option[data-i18n-opt]").forEach((opt) => {
    const key = opt.getAttribute("data-i18n-opt");
    if (dict[key] !== undefined) opt.textContent = dict[key];
  });
  document.getElementById("lang-fa").classList.toggle("active", lang === "fa");
  document.getElementById("lang-ar").classList.toggle("active", lang === "ar");
  document.getElementById("lang-en").classList.toggle("active", lang === "en");
}

function getChartTheme() {
  const light = document.documentElement.getAttribute("data-theme") === "light";
  const fg = light ? "#0f172a" : "#e8edf4";
  const grid = light ? "rgba(15,23,42,0.12)" : "rgba(255,255,255,0.08)";
  return {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { color: fg, family: "DM Sans, Vazirmatn, Noto Sans Arabic, sans-serif", size: 11 },
    scene: {
      xaxis: {
        title: { text: "x" },
        backgroundcolor: light ? "rgba(248,250,252,0.4)" : "rgba(22,29,39,0.35)",
        gridcolor: grid,
        showbackground: true,
      },
      yaxis: {
        title: { text: "y" },
        backgroundcolor: light ? "rgba(248,250,252,0.4)" : "rgba(22,29,39,0.35)",
        gridcolor: grid,
        showbackground: true,
      },
      zaxis: {
        title: { text: "f(x, y)" },
        backgroundcolor: light ? "rgba(248,250,252,0.4)" : "rgba(22,29,39,0.35)",
        gridcolor: grid,
        showbackground: true,
      },
    },
  };
}

function defaultCamera() {
  return {
    eye: { x: 1.65, y: -1.85, z: 1.35 },
    center: { x: 0, y: 0, z: -0.08 },
  };
}

function hillClimb(f, x0, y0, bounds, step, maxIter, mode, rng) {
  let x = clamp(x0, bounds.x[0], bounds.x[1]);
  let y = clamp(y0, bounds.y[0], bounds.y[1]);
  const path = [{ x, y, z: f(x, y) }];
  const neigh = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  for (let i = 0; i < maxIter; i++) {
    if (mode === "neighbors") {
      const curZ = f(x, y);
      let bestNX = x;
      let bestNY = y;
      let bestNZ = curZ;
      for (const [dx, dy] of neigh) {
        const nx = clamp(x + dx * step, bounds.x[0], bounds.x[1]);
        const ny = clamp(y + dy * step, bounds.y[0], bounds.y[1]);
        const nz = f(nx, ny);
        if (nz < bestNZ) {
          bestNX = nx;
          bestNY = ny;
          bestNZ = nz;
        }
      }
      if (bestNZ < curZ - 1e-15) {
        x = bestNX;
        y = bestNY;
        path.push({ x, y, z: bestNZ });
      }
    } else {
      const ang = rng() * Math.PI * 2;
      const rad = rng() * step;
      const nx = clamp(x + Math.cos(ang) * rad, bounds.x[0], bounds.x[1]);
      const ny = clamp(y + Math.sin(ang) * rad, bounds.y[0], bounds.y[1]);
      const nz = f(nx, ny);
      const fz = f(x, y);
      if (nz < fz - 1e-15) {
        x = nx;
        y = ny;
        path.push({ x, y, z: nz });
      }
    }
  }
  return path;
}

function randomSearch(f, bounds, n, rng) {
  const pts = [];
  let bx = 0,
    by = 0,
    bz = Infinity;
  const [x0, x1] = bounds.x;
  const [y0, y1] = bounds.y;
  for (let i = 0; i < n; i++) {
    const x = x0 + rng() * (x1 - x0);
    const y = y0 + rng() * (y1 - y0);
    const z = f(x, y);
    pts.push({ x, y, z });
    if (z < bz) {
      bz = z;
      bx = x;
      by = y;
    }
  }
  return { points: pts, best: { x: bx, y: by, z: bz } };
}

function buildSurfaceGrid(meta, nx = 52, ny = 52) {
  const { f, domain } = meta;
  const xs = linspace(domain.x[0], domain.x[1], nx);
  const ys = linspace(domain.y[0], domain.y[1], ny);
  const Z = [];
  for (let i = 0; i < ny; i++) {
    const row = [];
    for (let j = 0; j < nx; j++) row.push(f(xs[j], ys[i]));
    Z.push(row);
  }
  return { xs, ys, Z };
}

function traceLabels() {
  if (lang === "fa")
    return { surf: "سطح", hc: "HC", rs: "RS", g: "سراسری", l: "محلی", rsBest: "بهترین RS" };
  if (lang === "ar") return { surf: "السطح", hc: "HC", rs: "RS", g: "عام", l: "محلي", rsBest: "أفضل RS" };
  return { surf: "Surface", hc: "Hill climb", rs: "Random search", g: "Global", l: "Local", rsBest: "Best RS" };
}

function buildPlot(hcPathSlice, rsPoints, rsBest, meta) {
  const theme = getChartTheme();
  const light = document.documentElement.getAttribute("data-theme") === "light";
  const { xs, ys, Z } = buildSurfaceGrid(meta);
  const lbl = traceLabels();
  const colorscale = light
    ? [
        [0, "#f8fafc"],
        [0.2, "#bae6fd"],
        [0.45, "#38bdf8"],
        [0.7, "#0e7490"],
        [1, "#164e63"],
      ]
    : [
        [0, "#0c1220"],
        [0.25, "#1e3a5f"],
        [0.5, "#155e75"],
        [0.72, "#0d9488"],
        [0.88, "#5eead4"],
        [1, "#fef3c7"],
      ];

  const traces = [
    {
      type: "surface",
      x: xs,
      y: ys,
      z: Z,
      name: lbl.surf,
      opacity: 0.92,
      showscale: true,
      colorscale,
      colorbar: {
        title: "f",
        thickness: 12,
        len: 0.65,
        tickfont: { size: 10 },
      },
      lighting: { ambient: 0.42, diffuse: 0.88, specular: 0.25, roughness: 0.45 },
    },
  ];

  const hcShow = hcPathSlice && hcPathSlice.length > 0;
  if (hcShow && hcPathSlice.length > 1) {
    traces.push({
      type: "scatter3d",
      mode: "lines",
      x: hcPathSlice.map((p) => p.x),
      y: hcPathSlice.map((p) => p.y),
      z: hcPathSlice.map((p) => p.z),
      name: lbl.hc,
      line: { color: light ? "#0369a1" : "#38bdf8", width: 8 },
      showlegend: true,
    });
  }
  if (hcShow) {
    traces.push({
      type: "scatter3d",
      mode: "markers",
      x: [hcPathSlice[hcPathSlice.length - 1].x],
      y: [hcPathSlice[hcPathSlice.length - 1].y],
      z: [hcPathSlice[hcPathSlice.length - 1].z],
      name: lang === "fa" ? "پایان HC" : lang === "ar" ? "نهاية HC" : "HC end",
      marker: { size: 10, color: light ? "#0284c7" : "#7dd3fc", symbol: "circle", line: { width: 1, color: "#fff" } },
      showlegend: true,
    });
  }

  const showAll = document.getElementById("chk-show-all-rs").checked;
  if (rsPoints && rsPoints.length && showAll) {
    traces.push({
      type: "scatter3d",
      mode: "markers",
      x: rsPoints.map((p) => p.x),
      y: rsPoints.map((p) => p.y),
      z: rsPoints.map((p) => p.z),
      name: lbl.rs,
      marker: {
        size: 3,
        color: light ? "rgba(124,58,237,0.55)" : "rgba(192,132,252,0.5)",
        line: { width: 0 },
      },
      showlegend: true,
    });
  }

  if (rsBest) {
    traces.push({
      type: "scatter3d",
      mode: "markers",
      x: [rsBest.x],
      y: [rsBest.y],
      z: [rsBest.z],
      name: lbl.rsBest,
      marker: {
        size: 12,
        color: light ? "#7c3aed" : "#c084fc",
        symbol: "diamond",
        line: { width: 2, color: "#fff" },
      },
      showlegend: true,
    });
  }

  const g = meta.globalMin;
  const gz = meta.f(g.x, g.y);
  traces.push({
    type: "scatter3d",
    mode: "markers",
    x: [g.x],
    y: [g.y],
    z: [gz],
    name: lbl.g,
    marker: { size: 14, color: light ? "#b45309" : "#fbbf24", symbol: "star", line: { width: 2, color: "#fff" } },
    showlegend: true,
  });

  for (const p of meta.localHints) {
    const lz = meta.f(p.x, p.y);
    traces.push({
      type: "scatter3d",
      mode: "markers",
      x: [p.x],
      y: [p.y],
      z: [lz],
      name: lbl.l,
      marker: {
        size: 11,
        color: light ? "#e11d48" : "#fb7185",
        symbol: "cross",
        line: { width: 2, color: "#fff" },
      },
      showlegend: true,
    });
  }

  const layout = {
    ...theme,
    margin: { l: 0, r: 0, t: 28, b: 0 },
    scene: {
      ...theme.scene,
      aspectmode: "cube",
      camera: defaultCamera(),
    },
    legend: {
      orientation: "h",
      y: 1.02,
      x: 0,
      font: { size: 10 },
      bgcolor: light ? "rgba(255,255,255,0.65)" : "rgba(15,20,28,0.55)",
      bordercolor: light ? "rgba(15,23,42,0.12)" : "rgba(255,255,255,0.1)",
      borderwidth: 1,
    },
  };

  return { traces, layout, config: { responsive: true, displayModeBar: true, displaylogo: false } };
}

function buildPlot2D(hcPathSlice, rsPoints, rsBest, meta) {
  const theme = getChartTheme();
  const light = document.documentElement.getAttribute("data-theme") === "light";
  const { xs, ys, Z } = buildSurfaceGrid(meta);
  const lbl = traceLabels();
  const colorscale = light
    ? [
        [0, "#f8fafc"],
        [0.2, "#bae6fd"],
        [0.45, "#38bdf8"],
        [0.7, "#0e7490"],
        [1, "#164e63"],
      ]
    : [
        [0, "#0c1220"],
        [0.25, "#1e3a5f"],
        [0.5, "#155e75"],
        [0.72, "#0d9488"],
        [0.88, "#5eead4"],
        [1, "#fef3c7"],
      ];

  const traces = [
    {
      type: "contour",
      x: xs,
      y: ys,
      z: Z,
      colorscale,
      contours: { coloring: "fill", showlines: true },
      line: { width: 0.55, color: light ? "rgba(15,23,42,0.14)" : "rgba(255,255,255,0.12)" },
      showscale: true,
      colorbar: {
        title: "f",
        thickness: 11,
        len: 0.55,
        tickfont: { size: 9 },
        titlefont: { size: 10 },
      },
      name: lbl.surf,
      showlegend: false,
      hovertemplate: "x=%{x:.4f}<br>y=%{y:.4f}<br>f=%{z:.5f}<extra></extra>",
    },
  ];

  const hcShow = hcPathSlice && hcPathSlice.length > 0;
  if (hcShow && hcPathSlice.length > 1) {
    traces.push({
      type: "scatter",
      mode: "lines",
      x: hcPathSlice.map((p) => p.x),
      y: hcPathSlice.map((p) => p.y),
      name: lbl.hc,
      line: { color: light ? "#0369a1" : "#38bdf8", width: 3.2 },
      showlegend: false,
      hovertemplate: "HC<br>x=%{x:.4f}<br>y=%{y:.4f}<extra></extra>",
    });
  }
  if (hcShow) {
    const last = hcPathSlice[hcPathSlice.length - 1];
    traces.push({
      type: "scatter",
      mode: "markers",
      x: [last.x],
      y: [last.y],
      name: lang === "fa" ? "پایان HC" : lang === "ar" ? "نهاية HC" : "HC end",
      marker: { size: 11, color: light ? "#0284c7" : "#7dd3fc", line: { width: 1.5, color: "#fff" } },
      showlegend: false,
      hovertemplate: "HC end<br>x=%{x:.4f}<br>y=%{y:.4f}<extra></extra>",
    });
  }

  const showAll = document.getElementById("chk-show-all-rs").checked;
  if (rsPoints && rsPoints.length && showAll) {
    traces.push({
      type: "scatter",
      mode: "markers",
      x: rsPoints.map((p) => p.x),
      y: rsPoints.map((p) => p.y),
      text: rsPoints.map((p) => p.z.toFixed(5)),
      name: lbl.rs,
      marker: {
        size: 4,
        color: light ? "rgba(124,58,237,0.65)" : "rgba(192,132,252,0.55)",
        line: { width: 0 },
      },
      showlegend: false,
      hovertemplate: "RS<br>x=%{x:.4f}<br>y=%{y:.4f}<br>f=%{text}<extra></extra>",
    });
  }

  if (rsBest) {
    traces.push({
      type: "scatter",
      mode: "markers",
      x: [rsBest.x],
      y: [rsBest.y],
      name: lbl.rsBest,
      marker: {
        size: 13,
        color: light ? "#7c3aed" : "#c084fc",
        symbol: "diamond",
        line: { width: 2, color: "#fff" },
      },
      showlegend: false,
      hovertemplate: "best RS<br>x=%{x:.4f}<br>y=%{y:.4f}<br>f=" + rsBest.z.toFixed(5) + "<extra></extra>",
    });
  }

  const g = meta.globalMin;
  traces.push({
    type: "scatter",
    mode: "markers",
    x: [g.x],
    y: [g.y],
    name: lbl.g,
    marker: { size: 15, color: light ? "#b45309" : "#fbbf24", symbol: "star", line: { width: 2, color: "#fff" } },
    showlegend: false,
    hovertemplate:
      (lang === "fa" ? "کمینهٔ سراسری (مرجع)" : lang === "ar" ? "الحد العام (مرجع)" : "Global min (ref)") +
      "<br>x=%{x:.4f}<br>y=%{y:.4f}<extra></extra>",
  });

  for (const p of meta.localHints) {
    traces.push({
      type: "scatter",
      mode: "markers",
      x: [p.x],
      y: [p.y],
      name: lbl.l,
      marker: {
        size: 12,
        color: light ? "#e11d48" : "#fb7185",
        symbol: "cross",
        line: { width: 2, color: "#fff" },
      },
      showlegend: false,
      hovertemplate:
        (lang === "fa" ? "کمینهٔ محلی (نمونه)" : lang === "ar" ? "حد محلي (عرض)" : "Local min (demo)") +
        "<br>x=%{x:.4f}<br>y=%{y:.4f}<extra></extra>",
    });
  }

  const domain = meta.domain;
  const grid = light ? "rgba(15,23,42,0.1)" : "rgba(255,255,255,0.08)";
  const linec = light ? "rgba(15,23,42,0.28)" : "rgba(255,255,255,0.22)";
  const xTitle = lang === "fa" ? "x" : lang === "ar" ? "x" : "x";
  const yTitle = lang === "fa" ? "y" : lang === "ar" ? "y" : "y";

  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: light ? "rgba(248,250,252,0.35)" : "rgba(22,29,39,0.25)",
    font: theme.font,
    margin: { l: 54, r: 70, t: 20, b: 50 },
    xaxis: {
      title: { text: xTitle, font: { size: 12 } },
      range: [domain.x[0], domain.x[1]],
      scaleanchor: "y",
      scaleratio: 1,
      constrain: "domain",
      gridcolor: grid,
      zeroline: false,
      showline: true,
      linecolor: linec,
      tickfont: { size: 10 },
    },
    yaxis: {
      title: { text: yTitle, font: { size: 12 } },
      range: [domain.y[0], domain.y[1]],
      gridcolor: grid,
      zeroline: false,
      showline: true,
      linecolor: linec,
      tickfont: { size: 10 },
    },
    showlegend: false,
    hovermode: "closest",
  };

  return { traces, layout, config: { responsive: true, displayModeBar: true, displaylogo: false } };
}

function syncSlidersToDomain() {
  const m = land();
  const sx = document.getElementById("slider-x0");
  const sy = document.getElementById("slider-y0");
  const [xlo, xhi] = m.domain.x;
  const [ylo, yhi] = m.domain.y;
  sx.min = xlo;
  sx.max = xhi;
  sy.min = ylo;
  sy.max = yhi;
  sx.value = clamp(parseFloat(sx.value) || 0, xlo, xhi);
  sy.value = clamp(parseFloat(sy.value) || 0, ylo, yhi);
  document.getElementById("out-x0").textContent = parseFloat(sx.value).toFixed(2);
  document.getElementById("out-y0").textContent = parseFloat(sy.value).toFixed(2);
}

function runComparison() {
  stopAnim();
  const meta = land();
  const seed = Math.max(0, parseInt(document.getElementById("input-seed").value, 10) || 0);
  const rng = mulberry32(seed + 1337);
  const rng2 = mulberry32(seed + 977);
  const x0 = parseFloat(document.getElementById("slider-x0").value);
  const y0 = parseFloat(document.getElementById("slider-y0").value);
  const hcSteps = Math.max(10, parseInt(document.getElementById("input-hc-steps").value, 10) || 180);
  const step = Math.max(0.01, parseFloat(document.getElementById("input-hc-step").value) || 0.18);
  const rsN = Math.max(10, parseInt(document.getElementById("input-rs-n").value, 10) || 220);
  const mode = document.getElementById("select-hc-mode").value;

  const bounds = { x: [...meta.domain.x], y: [...meta.domain.y] };
  const f = meta.f.bind(meta);

  document.getElementById("status-line").textContent = I18N[lang].status_running;

  lastHcPath = hillClimb(f, x0, y0, bounds, step, hcSteps, mode, rng);
  const rs = randomSearch(f, bounds, rsN, rng2);
  lastRsPoints = rs.points;
  lastRsBest = rs.best;

  const g = meta.globalMin;
  lastGlobalZ = meta.f(g.x, g.y);

  const hcBest = lastHcPath.length ? lastHcPath[lastHcPath.length - 1].z : Infinity;
  document.getElementById("metric-hc").textContent = hcBest.toFixed(6);
  document.getElementById("metric-rs").textContent = lastRsBest.z.toFixed(6);
  document.getElementById("metric-global").textContent = lastGlobalZ.toFixed(6);

  document.getElementById("status-line").textContent = I18N[lang].status_done;

  renderBothPlots(lastHcPath);
}

function stopAnim() {
  if (animTimer) {
    clearTimeout(animTimer);
    animTimer = null;
  }
  animating = false;
  document.getElementById("btn-animate-hc").disabled = false;
  document.getElementById("btn-run").disabled = false;
  document.getElementById("btn-stop").style.display = "none";
}

function animateHcPlayback() {
  if (!lastHcPath.length) {
    runComparison();
  }
  stopAnim();
  animating = true;
  document.getElementById("btn-animate-hc").disabled = true;
  document.getElementById("btn-run").disabled = true;
  document.getElementById("btn-stop").style.display = "";
  document.getElementById("status-line").textContent = I18N[lang].status_anim;

  const delay = Math.max(0, parseInt(document.getElementById("input-anim-delay").value, 10) || 0);
  let i = 1;

  function step() {
    if (!animating) return;
    const slice = lastHcPath.slice(0, Math.max(1, i));
    renderBothPlots(slice);
    i++;
    if (i > lastHcPath.length) {
      stopAnim();
      document.getElementById("status-line").textContent = I18N[lang].status_done;
      return;
    }
    animTimer = setTimeout(step, delay);
  }
  step();
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.getElementById("theme-dark").classList.toggle("active", theme === "dark");
  document.getElementById("theme-light").classList.toggle("active", theme === "light");
  try {
    localStorage.setItem("vizopt-theme", theme);
  } catch (_) {}
  if (lastHcPath.length && plot3dInitialized) {
    renderBothPlots(lastHcPath);
  }
}

function resetViews() {
  if (!plot3dInitialized) return;
  Plotly.relayout(document.getElementById("plot-3d"), { "scene.camera": defaultCamera() });
  const m = land();
  Plotly.relayout(document.getElementById("plot-2d"), {
    "xaxis.range": [m.domain.x[0], m.domain.x[1]],
    "yaxis.range": [m.domain.y[0], m.domain.y[1]],
  });
}

document.getElementById("select-landscape").addEventListener("change", () => {
  syncSlidersToDomain();
  runComparison();
});

document.getElementById("select-hc-mode").addEventListener("change", () => {
  if (!animating) runComparison();
});

document.getElementById("input-seed").addEventListener("change", () => {
  if (!animating) runComparison();
});

document.getElementById("slider-x0").addEventListener("input", (e) => {
  document.getElementById("out-x0").textContent = parseFloat(e.target.value).toFixed(2);
  if (!animating) runComparison();
});

document.getElementById("slider-y0").addEventListener("input", (e) => {
  document.getElementById("out-y0").textContent = parseFloat(e.target.value).toFixed(2);
  if (!animating) runComparison();
});

["input-hc-steps", "input-hc-step", "input-rs-n", "chk-show-all-rs"].forEach((id) => {
  document.getElementById(id).addEventListener("change", () => {
    if (!animating) runComparison();
  });
});

document.getElementById("chk-show-all-rs").addEventListener("input", () => {
  if (!animating) runComparison();
});

document.getElementById("btn-run").addEventListener("click", runComparison);
document.getElementById("btn-animate-hc").addEventListener("click", animateHcPlayback);
document.getElementById("btn-stop").addEventListener("click", () => {
  animating = false;
  stopAnim();
  document.getElementById("status-line").textContent = I18N[lang].status_stopped;
  if (lastHcPath.length && plot3dInitialized) {
    renderBothPlots(lastHcPath);
  }
});

document.getElementById("btn-reset-view").addEventListener("click", resetViews);

document.getElementById("lang-fa").addEventListener("click", () => {
  lang = "fa";
  applyI18n();
  if (lastHcPath.length && plot3dInitialized) {
    renderBothPlots(lastHcPath);
  }
});

document.getElementById("lang-ar").addEventListener("click", () => {
  lang = "ar";
  applyI18n();
  if (lastHcPath.length && plot3dInitialized) {
    renderBothPlots(lastHcPath);
  }
});

document.getElementById("lang-en").addEventListener("click", () => {
  lang = "en";
  applyI18n();
  if (lastHcPath.length && plot3dInitialized) {
    renderBothPlots(lastHcPath);
  }
});

document.getElementById("theme-dark").addEventListener("click", () => setTheme("dark"));
document.getElementById("theme-light").addEventListener("click", () => setTheme("light"));

window.addEventListener("resize", () => {
  applySplitLayout();
  resizePlots();
});

try {
  const t = localStorage.getItem("vizopt-theme");
  if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
} catch (_) {}

applyI18n();
applySplitLayout();
initSplitGutter();
syncSlidersToDomain();
runComparison();
