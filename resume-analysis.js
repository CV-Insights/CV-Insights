
const body       = document.body;
const sidebar    = document.querySelector(".sidebar");
const menuBtn    = document.getElementById("menuBtn");
const themeBtn   = document.getElementById("themeBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const exportBtn  = document.getElementById("exportBtn");
const refreshChartBtn = document.getElementById("refreshChartBtn");


if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });
}


function loadTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
        body.classList.add("dark");
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}
loadTheme();

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        body.classList.toggle("dark");
        if (body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            updateChartColors("dark");
        } else {
            localStorage.setItem("theme", "light");
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            updateChartColors("light");
        }
    });
}


const radarCtx = document.getElementById("radarChart");
let radarChart;

const radarData = {
    labels: [
        "Technical Skills",
        "Experience",
        "Education",
        "Projects",
        "Achievements",
        "Certifications",
        "Keywords"
    ],
    datasets: [{
        label: "Resume Score",
        data: [92, 90, 88, 81, 73, 96, 78],
        backgroundColor: "rgba(91,95,239,0.15)",
        borderColor: "#5B5FEF",
        pointBackgroundColor: "#5B5FEF",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#7A5CFF",
        borderWidth: 2.5,
        pointRadius: 6
    }]
};

function buildChart(darkMode) {
    if (radarChart) radarChart.destroy();

    const gridColor = darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
    const labelColor = darkMode ? "#cbd5e1" : "#555";

    radarChart = new Chart(radarCtx, {
        type: "radar",
        data: radarData,
        options: {
            responsive: true,
            animation: { duration: 1000, easing: "easeInOutQuart" },
            plugins: {
                legend: {
                    labels: { color: labelColor, font: { size: 14, family: "Poppins" } }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        color: labelColor,
                        backdropColor: "transparent",
                        font: { size: 12, family: "Poppins" }
                    },
                    grid: { color: gridColor },
                    angleLines: { color: gridColor },
                    pointLabels: {
                        color: labelColor,
                        font: { size: 13, family: "Poppins", weight: "600" }
                    }
                }
            }
        }
    });
}

if (radarCtx) {
    buildChart(body.classList.contains("dark"));
}

function updateChartColors(mode) {
    buildChart(mode === "dark");
}


if (refreshChartBtn) {
    refreshChartBtn.addEventListener("click", () => {
        // Slightly randomize data for demo
        radarData.datasets[0].data = radarData.datasets[0].data.map(v => {
            const delta = Math.floor(Math.random() * 7) - 3;
            return Math.max(55, Math.min(100, v + delta));
        });
        buildChart(body.classList.contains("dark"));
        showToast("Chart refreshed!");
    });
}


if (analyzeBtn) {
    analyzeBtn.addEventListener("click", () => {
        analyzeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
        analyzeBtn.disabled = true;

        setTimeout(() => {
            analyzeBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Re-Analyze Resume';
            analyzeBtn.disabled = false;
            showToast("Analysis complete!");
        }, 2500);
    });
}


if (exportBtn) {
    exportBtn.addEventListener("click", () => {
        showToast("Generating PDF report...");
        setTimeout(() => showToast("Report ready! Download started."), 1500);
    });
}


const progressBars = document.querySelectorAll(".progress div");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = "growBar 1.5s ease forwards";
        }
    });
}, { threshold: 0.3 });

progressBars.forEach(bar => observer.observe(bar));


document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px) scale(1.02)";
    });
    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
    });
});


function showToast(msg) {
    let toast = document.querySelector(".ra-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "ra-toast";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}


(function injectToastCSS() {
    const s = document.createElement("style");
    s.textContent = `
        .ra-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg,#5B5FEF,#7A5CFF);
            color: #fff;
            padding: 14px 24px;
            border-radius: 14px;
            font-size: 15px;
            font-family: Poppins, sans-serif;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(91,95,239,.35);
            opacity: 0;
            transform: translateY(20px);
            transition: .35s;
            z-index: 9999;
            pointer-events: none;
        }
        .ra-toast.show { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(s);
})();

document.querySelectorAll(".ra-check-item").forEach(item => {
    item.addEventListener("click", () => {
        item.style.boxShadow = "0 0 0 3px rgba(91,95,239,.3)";
        setTimeout(() => item.style.boxShadow = "", 500);
    });
});

console.log("Resume Analysis JS loaded.");
