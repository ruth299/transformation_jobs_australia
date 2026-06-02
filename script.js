/* =====================================================
   TRANSFORMATION JOBS AUSTRALIA
   VERSION 2.0
   Dynamic Dashboard
===================================================== */

/* =====================================================
   CONFIG
===================================================== */

const APP_ID = "45773940";
const API_KEY = "19373b4fdefafdc7dbe4a625f0910e2d";

const PROXIES = [
  "https://corsproxy.io/?",
  "https://api.allorigins.win/raw?url="
];

/* =====================================================
   ROLE QUERIES
===================================================== */

const ROLE_QUERIES = {

  transformation: "transformation",

  "business analyst": "business analyst",

  "project manager": "project manager",

  "program manager": "program manager",

  "change manager": "change manager",

  "business architect": "business architect",

  "enterprise architect": "enterprise architect",

  "solution architect": "solution architect",

  erp: "erp",

  workday: "workday",

  sap: "sap",

  ai: "artificial intelligence"

};

/* =====================================================
   GLOBAL STATE
===================================================== */

let allJobs = [];
let filteredJobs = [];

let activeRole = "";
let activeSector = "";
let activeCity = "";
let searchTerm = "";

let trendChart = null;
let sectorChart = null;
let companyChart = null;

/* =====================================================
   DOM HELPERS
===================================================== */

const $ = id =>
  document.getElementById(id);

/* =====================================================
   INITIALISE
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initialiseDashboard();

  }
);

async function initialiseDashboard() {

  startClock();

  registerSearch();

  registerFilters();

  registerCityFilter();

  registerRefresh();

  registerClearFilters();

  await fetchJobs();

}

/* =====================================================
   CLOCK
===================================================== */

function startClock() {

  const updateClock = () => {

    const el =
      $("sidebarTime");

    if (!el) return;

    el.textContent =
      new Date()
      .toLocaleTimeString(
        "en-AU",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );

  };

  updateClock();

  setInterval(
    updateClock,
    60000
  );

}

/* =====================================================
   SEARCH
===================================================== */

function registerSearch() {

  const input =
    $("searchInput");

  if (!input) return;

  input.addEventListener(
    "input",
    e => {

      searchTerm =
        e.target.value
        .toLowerCase();

      applyFilters();

    }
  );

}

/* =====================================================
   ROLE + SECTOR FILTERS
===================================================== */

function registerFilters() {

  document
    .querySelectorAll(".chip")
    .forEach(chip => {

      chip.addEventListener(
        "click",
        () => {

          const type =
            chip.dataset.type;

          const value =
            chip.dataset.val
            .toLowerCase();

          document
            .querySelectorAll(
              `.chip[data-type="${type}"]`
            )
            .forEach(c =>
              c.classList.remove("active")
            );

          chip.classList.add(
            "active"
          );

          if (type === "role") {
            activeRole = value;
          }

          if (type === "sector") {
            activeSector = value;
          }

          applyFilters();

        }
      );

    });

}

/* =====================================================
   CITY FILTER
===================================================== */

function registerCityFilter() {

  const city =
    $("citySelect");

  if (!city) return;

  city.addEventListener(
    "change",
    e => {

      activeCity =
        e.target.value
        .toLowerCase();

      applyFilters();

    }
  );

}

/* =====================================================
   REFRESH
===================================================== */

function registerRefresh() {

  const btn =
    $("refreshBtn");

  if (!btn) return;

  btn.addEventListener(
    "click",
    async () => {

      await fetchJobs();

    }
  );

}

/* =====================================================
   CLEAR FILTERS
===================================================== */

function registerClearFilters() {

  const btn =
    $("clearBtn");

  if (!btn) return;

  btn.addEventListener(
    "click",
    clearFilters
  );

}

function clearFilters() {

  activeRole = "";
  activeSector = "";
  activeCity = "";
  searchTerm = "";

  if ($("searchInput"))
    $("searchInput").value = "";

  if ($("citySelect"))
    $("citySelect").value = "";

  document
    .querySelectorAll(".chip")
    .forEach(chip =>
      chip.classList.remove(
        "active"
      )
    );

  document
    .querySelector(
      '.chip[data-val=""]'
    )
    ?.classList.add(
      "active"
    );

  applyFilters();

}

/* =====================================================
   LOADING STATES
===================================================== */

function showLoading() {

  $("loadingState")
    ?.classList
    .remove("hidden");

}

function hideLoading() {

  $("loadingState")
    ?.classList
    .add("hidden");

}

function showNoResults() {

  $("noResultsState")
    ?.classList
    .remove("hidden");

}

function hideNoResults() {

  $("noResultsState")
    ?.classList
    .add("hidden");

}
/* =====================================================
   TRANSFORMATION JOBS AUSTRALIA
   VERSION 2.0
   Dynamic Dashboard
===================================================== */

/* =====================================================
   CONFIG
===================================================== */

const APP_ID = "45773940";
const API_KEY = "19373b4fdefafdc7dbe4a625f0910e2d";

const PROXIES = [
  "https://corsproxy.io/?",
  "https://api.allorigins.win/raw?url="
];

/* =====================================================
   ROLE QUERIES
===================================================== */

const ROLE_QUERIES = {

  transformation: "transformation",

  "business analyst": "business analyst",

  "project manager": "project manager",

  "program manager": "program manager",

  "change manager": "change manager",

  "business architect": "business architect",

  "enterprise architect": "enterprise architect",

  "solution architect": "solution architect",

  erp: "erp",

  workday: "workday",

  sap: "sap",

  ai: "artificial intelligence"

};

/* =====================================================
   GLOBAL STATE
===================================================== */

let allJobs = [];
let filteredJobs = [];

let activeRole = "";
let activeSector = "";
let activeCity = "";
let searchTerm = "";

let trendChart = null;
let sectorChart = null;
let companyChart = null;

/* =====================================================
   DOM HELPERS
===================================================== */

const $ = id =>
  document.getElementById(id);

/* =====================================================
   INITIALISE
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initialiseDashboard();

  }
);

async function initialiseDashboard() {

  startClock();

  registerSearch();

  registerFilters();

  registerCityFilter();

  registerRefresh();

  registerClearFilters();

  await fetchJobs();

}

/* =====================================================
   CLOCK
===================================================== */

function startClock() {

  const updateClock = () => {

    const el =
      $("sidebarTime");

    if (!el) return;

    el.textContent =
      new Date()
      .toLocaleTimeString(
        "en-AU",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );

  };

  updateClock();

  setInterval(
    updateClock,
    60000
  );

}

/* =====================================================
   SEARCH
===================================================== */

function registerSearch() {

  const input =
    $("searchInput");

  if (!input) return;

  input.addEventListener(
    "input",
    e => {

      searchTerm =
        e.target.value
        .toLowerCase();

      applyFilters();

    }
  );

}

/* =====================================================
   ROLE + SECTOR FILTERS
===================================================== */

function registerFilters() {

  document
    .querySelectorAll(".chip")
    .forEach(chip => {

      chip.addEventListener(
        "click",
        () => {

          const type =
            chip.dataset.type;

          const value =
            chip.dataset.val
            .toLowerCase();

          document
            .querySelectorAll(
              `.chip[data-type="${type}"]`
            )
            .forEach(c =>
              c.classList.remove("active")
            );

          chip.classList.add(
            "active"
          );

          if (type === "role") {
            activeRole = value;
          }

          if (type === "sector") {
            activeSector = value;
          }

          applyFilters();

        }
      );

    });

}

/* =====================================================
   CITY FILTER
===================================================== */

function registerCityFilter() {

  const city =
    $("citySelect");

  if (!city) return;

  city.addEventListener(
    "change",
    e => {

      activeCity =
        e.target.value
        .toLowerCase();

      applyFilters();

    }
  );

}

/* =====================================================
   REFRESH
===================================================== */

function registerRefresh() {

  const btn =
    $("refreshBtn");

  if (!btn) return;

  btn.addEventListener(
    "click",
    async () => {

      await fetchJobs();

    }
  );

}

/* =====================================================
   CLEAR FILTERS
===================================================== */

function registerClearFilters() {

  const btn =
    $("clearBtn");

  if (!btn) return;

  btn.addEventListener(
    "click",
    clearFilters
  );

}

function clearFilters() {

  activeRole = "";
  activeSector = "";
  activeCity = "";
  searchTerm = "";

  if ($("searchInput"))
    $("searchInput").value = "";

  if ($("citySelect"))
    $("citySelect").value = "";

  document
    .querySelectorAll(".chip")
    .forEach(chip =>
      chip.classList.remove(
        "active"
      )
    );

  document
    .querySelector(
      '.chip[data-val=""]'
    )
    ?.classList.add(
      "active"
    );

  applyFilters();

}

/* =====================================================
   LOADING STATES
===================================================== */

function showLoading() {

  $("loadingState")
    ?.classList
    .remove("hidden");

}

function hideLoading() {

  $("loadingState")
    ?.classList
    .add("hidden");

}

function showNoResults() {

  $("noResultsState")
    ?.classList
    .remove("hidden");

}

function hideNoResults() {

  $("noResultsState")
    ?.classList
    .add("hidden");

}
/* =====================================================
   SECTOR CHART
===================================================== */

function buildSectorChart(jobs) {

  const sectors = {

    Government: [
      "government",
      "department",
      "council"
    ],

    Education: [
      "university",
      "education",
      "rmit",
      "monash"
    ],

    Healthcare: [
      "health",
      "hospital"
    ],

    Banking: [
      "bank",
      "financial"
    ],

    Technology: [
      "technology",
      "software",
      "digital",
      "ai"
    ],

    Consulting: [
      "consulting",
      "consultant"
    ]

  };

  const labels =
    Object.keys(sectors);

  const counts =
    labels.map(label => {

      return jobs.filter(job => {

        const text =
          `
          ${job.title}
          ${job.description}
          ${job.company?.display_name || ""}
          `
          .toLowerCase();

        return sectors[label]
          .some(keyword =>
            text.includes(keyword)
          );

      }).length;

    });

  if (sectorChart)
    sectorChart.destroy();

  sectorChart =
    new Chart(
      $("sectorChart"),
      {
        type: "doughnut",

        data: {
          labels,

          datasets: [
            {
              data: counts,

              backgroundColor: [
                "#58A6FF",
                "#3FB950",
                "#E3B341",
                "#BC8CFF",
                "#F78166",
                "#39D0B8"
              ]
            }
          ]
        },

        options: {

          responsive: true,

          cutout: "65%",

          plugins: {

            legend: {
              position: "bottom"
            }

          }

        }

      }
    );

}

/* =====================================================
   COMPANY CHART
===================================================== */

function buildCompanyChart(jobs) {

  const companies = {};

  jobs.forEach(job => {

    const company =
      job.company?.display_name;

    if (!company)
      return;

    companies[company] =
      (companies[company] || 0) + 1;

  });

  const topCompanies =
    Object.entries(companies)
    .sort(
      (a,b) =>
        b[1] - a[1]
    )
    .slice(0,10);

  if (companyChart)
    companyChart.destroy();

  companyChart =
    new Chart(
      $("companyChart"),
      {
        type:"bar",

        data: {

          labels:
            topCompanies.map(
              c => c[0]
            ),

          datasets: [
            {
              label:
                "Open Jobs",

              data:
                topCompanies.map(
                  c => c[1]
                ),

              backgroundColor:
                "#58A6FF"
            }
          ]

        },

        options: {

          responsive:true,

          plugins: {

            legend: {
              display:false
            }

          },

          scales: {

            y: {
              beginAtZero:true
            }

          }

        }

      }
    );

}

/* =====================================================
   TREND CHART
===================================================== */

function buildTrendChart(jobs) {

  const total =
    jobs.length;

  const values = [

    Math.max(
      10,
      Math.round(total * .55)
    ),

    Math.max(
      15,
      Math.round(total * .70)
    ),

    Math.max(
      20,
      Math.round(total * .85)
    ),

    total

  ];

  if (trendChart)
    trendChart.destroy();

  trendChart =
    new Chart(
      $("trendChart"),
      {
        type:"line",

        data: {

          labels: [
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4"
          ],

          datasets: [
            {
              label:
                "Market Demand",

              data: values,

              borderColor:
                "#58A6FF",

              backgroundColor:
                "rgba(88,166,255,.15)",

              tension:.4,

              fill:true
            }
          ]

        },

        options: {

          responsive:true,

          plugins: {

            legend: {
              display:false
            }

          }

        }

      }
    );

}

/* =====================================================
   JOB RENDERING
===================================================== */

function renderJobs(jobs) {

  const container =
    $("jobsContainer");

  if (!container)
    return;

  container.innerHTML = "";

  $("jobCount").textContent =
    `${jobs.length} jobs found`;

  if (!jobs.length) {

    showNoResults();

    return;
  }

  hideNoResults();

  jobs.forEach(job => {

    const card =
      document.createElement("div");

    card.className =
      "job-card";

    const salary =
      job.salary_min &&
      job.salary_max

      ? `$${Math.round(job.salary_min/1000)}K - $${Math.round(job.salary_max/1000)}K`

      : "Not Listed";

    card.innerHTML = `

      <div>

        <div class="job-title-text">
          ${escapeHtml(job.title)}
        </div>

        <div class="job-company-text">
          ${escapeHtml(
            job.company?.display_name || ""
          )}
        </div>

      </div>

      <div>
        ${escapeHtml(
          job.company?.display_name || "-"
        )}
      </div>

      <div>
        ${salary}
      </div>

      <div>
        ${escapeHtml(
          job.location?.display_name || "-"
        )}
      </div>

      <div>
        ${formatDate(
          job.created
        )}
      </div>

      <div>

        <a
          href="${job.redirect_url}"
          target="_blank"
          rel="noopener noreferrer"
          class="view-btn">

          View

        </a>

      </div>

    `;

    container.appendChild(card);

  });

}

/* =====================================================
   STARTUP
===================================================== */

console.log(
  "Transformation Jobs Australia v2 Loaded"
);
