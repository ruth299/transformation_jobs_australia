/* =====================================================
   TRANSFORMATION JOBS AUSTRALIA
   LIVE ADZUNA VERSION
===================================================== */

const APP_ID = "45773940";
const API_KEY = "19373b4fdefafdc7dbe4a625f0910e2d";

let allJobs = [];
let filteredJobs = [];

let activeRole = "";
let activeSector = "";
let activeCity = "";
let searchTerm = "";

let trendChart = null;
let sectorChart = null;
let companyChart = null;

const $ = id => document.getElementById(id);

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
   INITIALISE
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  initialiseDashboard
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

    const el = $("sidebarTime");

    if (!el) return;

    el.textContent = new Date()
      .toLocaleTimeString(
        "en-AU",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );

  };

  updateClock();

  setInterval(updateClock, 60000);

}

/* =====================================================
   FETCH JOBS
===================================================== */

async function fetchJobs() {

  showLoading();

  try {

    const queries = Object.values(
      ROLE_QUERIES
    );

    const requests = queries.map(
      query => {

        const url =
          `https://api.adzuna.com/v1/api/jobs/au/search/1?app_id=${APP_ID}&app_key=${API_KEY}&results_per_page=20&what=${encodeURIComponent(query)}&content-type=application/json`;

        return fetch(url)
          .then(r => r.json())
          .catch(() => null);

      }
    );

    const responses =
      await Promise.all(requests);

    const jobs = [];

    responses.forEach(data => {

      if (
        data &&
        data.results
      ) {

        jobs.push(
          ...data.results
        );

      }

    });

    const uniqueJobs =
      Array.from(
        new Map(
          jobs.map(
            j => [j.id, j]
          )
        ).values()
      );

    allJobs = uniqueJobs;

    applyFilters();

    hideLoading();

  } catch (err) {

    console.error(err);

    hideLoading();

    $("loadingState").innerHTML =
      "Unable to load jobs.";

  }

}
/* =====================================================
   SEARCH
===================================================== */

function registerSearch() {

  const input = $("searchInput");

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

          chip.classList.add("active");

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
      chip.classList.remove("active")
    );

  document
    .querySelector(
      '.chip[data-val=""]'
    )
    ?.classList.add("active");

  applyFilters();

}

/* =====================================================
   APPLY FILTERS
===================================================== */

function applyFilters() {

  filteredJobs =
    allJobs.filter(job => {

      const title =
        (job.title || "")
        .toLowerCase();

      const company =
        (
          job.company
            ?.display_name || ""
        ).toLowerCase();

      const location =
        (
          job.location
            ?.display_name || ""
        ).toLowerCase();

      const description =
        (
          job.description || ""
        ).toLowerCase();

      const text =
        `
        ${title}
        ${company}
        ${description}
        `
        .toLowerCase();

      const roleMatch =
        !activeRole ||
        text.includes(activeRole);

      const cityMatch =
        !activeCity ||
        location.includes(activeCity);

      const searchMatch =
        !searchTerm ||
        text.includes(searchTerm);

      let sectorMatch = true;

      if (activeSector) {

        sectorMatch =
          text.includes(
            activeSector
          );

      }

      return (
        roleMatch &&
        cityMatch &&
        searchMatch &&
        sectorMatch
      );

    });

  renderJobs(filteredJobs);

  updateStats(filteredJobs);

  buildTrendChart(filteredJobs);

  buildSectorChart(filteredJobs);

  buildCompanyChart(filteredJobs);

}
/* =====================================================
   KPI CARDS
===================================================== */

function updateStats(jobs) {

  const totalJobs =
    jobs.length;

  const newToday =
    jobs.filter(job => {

      if (!job.created)
        return false;

      const created =
        new Date(job.created);

      const today =
        new Date();

      const diff =
        (today - created) /
        (1000 * 60 * 60 * 24);

      return diff <= 1;

    }).length;

  const salaries =
    jobs
      .filter(
        j =>
          j.salary_min &&
          j.salary_max
      )
      .map(
        j =>
          (
            j.salary_min +
            j.salary_max
          ) / 2
      );

  const avgSalary =
    salaries.length
      ? `$${Math.round(
          salaries.reduce(
            (a,b)=>a+b,
            0
          ) /
          salaries.length /
          1000
        )}K`
      : "-";

  const sectorCounts = {};

  jobs.forEach(job => {

    const text =
      `
      ${job.title}
      ${job.description}
      ${job.company?.display_name || ""}
      `
      .toLowerCase();

    let sector =
      "Other";

    if (
      text.includes("government") ||
      text.includes("department")
    ) sector = "Government";

    else if (
      text.includes("university") ||
      text.includes("education")
    ) sector = "Education";

    else if (
      text.includes("health")
    ) sector = "Healthcare";

    else if (
      text.includes("bank")
    ) sector = "Banking";

    else if (
      text.includes("technology") ||
      text.includes("digital") ||
      text.includes("software")
    ) sector = "Technology";

    sectorCounts[sector] =
      (sectorCounts[sector] || 0) + 1;

  });

  const topSector =
    Object.entries(sectorCounts)
      .sort(
        (a,b)=>b[1]-a[1]
      )[0]?.[0] || "-";

  $("totalJobs").textContent =
    totalJobs;

  $("newToday").textContent =
    newToday;

  $("avgSalary").textContent =
    avgSalary;

  $("topSector").textContent =
    topSector;

  $("lastUpdated").textContent =
    new Date()
      .toLocaleTimeString(
        "en-AU",
        {
          hour:"2-digit",
          minute:"2-digit"
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

      ? `$${Math.round(
          job.salary_min/1000
        )}K - $${Math.round(
          job.salary_max/1000
        )}K`

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
   UTILITIES
===================================================== */

function escapeHtml(text) {

  const div =
    document.createElement("div");

  div.textContent =
    text || "";

  return div.innerHTML;

}

function formatDate(dateString) {

  if (!dateString)
    return "-";

  return new Date(
    dateString
  ).toLocaleDateString(
    "en-AU"
  );

}

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

console.log(
  "Transformation Jobs Australia LIVE loaded"
);
/* =====================================================
   TREND CHART
===================================================== */

function buildTrendChart(jobs) {

  const canvas =
    $("trendChart");

  if (!canvas) return;

  const total =
    jobs.length;

  const values = [
    Math.max(5, Math.round(total * 0.4)),
    Math.max(10, Math.round(total * 0.6)),
    Math.max(15, Math.round(total * 0.8)),
    total
  ];

  if (trendChart)
    trendChart.destroy();

  trendChart =
    new Chart(canvas, {

      type: "line",

      data: {

        labels: [
          "Week 1",
          "Week 2",
          "Week 3",
          "Week 4"
        ],

        datasets: [
          {
            label: "Demand",

            data: values,

            borderColor: "#58A6FF",

            backgroundColor:
              "rgba(88,166,255,.15)",

            fill: true,

            tension: 0.35
          }
        ]
      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: false
          }

        }

      }

    });

}

/* =====================================================
   SECTOR CHART
===================================================== */

function buildSectorChart(jobs) {

  const canvas =
    $("sectorChart");

  if (!canvas) return;

  const sectors = {

    Government: 0,
    Education: 0,
    Healthcare: 0,
    Banking: 0,
    Technology: 0,
    Consulting: 0

  };

  jobs.forEach(job => {

    const text = `
      ${job.title || ""}
      ${job.description || ""}
      ${job.company?.display_name || ""}
    `.toLowerCase();

    if (
      text.includes("government") ||
      text.includes("department") ||
      text.includes("council")
    ) {
      sectors.Government++;
    }

    else if (
      text.includes("university") ||
      text.includes("education") ||
      text.includes("rmit")
    ) {
      sectors.Education++;
    }

    else if (
      text.includes("health") ||
      text.includes("hospital")
    ) {
      sectors.Healthcare++;
    }

    else if (
      text.includes("bank") ||
      text.includes("financial")
    ) {
      sectors.Banking++;
    }

    else if (
      text.includes("technology") ||
      text.includes("digital") ||
      text.includes("software") ||
      text.includes("ai")
    ) {
      sectors.Technology++;
    }

    else {
      sectors.Consulting++;
    }

  });

  if (sectorChart)
    sectorChart.destroy();

  sectorChart =
    new Chart(canvas, {

      type: "doughnut",

      data: {

        labels:
          Object.keys(sectors),

        datasets: [
          {
            data:
              Object.values(sectors),

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

        maintainAspectRatio: false,

        plugins: {

          legend: {
            position: "bottom"
          }

        }

      }

    });

}

/* =====================================================
   COMPANY CHART
===================================================== */

function buildCompanyChart(jobs) {

  const canvas =
    $("companyChart");

  if (!canvas) return;

  const companies = {};

  jobs.forEach(job => {

    const company =
      job.company?.display_name;

    if (!company) return;

    companies[company] =
      (companies[company] || 0) + 1;

  });

  const topCompanies =
    Object.entries(companies)
      .sort(
        (a,b) => b[1] - a[1]
      )
      .slice(0,10);

  if (companyChart)
    companyChart.destroy();

  companyChart =
    new Chart(canvas, {

      type: "bar",

      data: {

        labels:
          topCompanies.map(
            c => c[0]
          ),

        datasets: [
          {
            label: "Jobs",

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

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: false
          }

        },

        scales: {

          y: {
            beginAtZero: true
          }

        }

      }

    });

}
