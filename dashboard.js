/*=========================================
 CV Insight Dashboard JavaScript
 Part 4A
=========================================*/

// ================================
// DOM Elements
// ================================

const body = document.body;
const sidebar = document.querySelector(".sidebar");
const menuBtn = document.getElementById("menuBtn");
const themeBtn = document.getElementById("themeBtn");
const searchInput = document.querySelector(".search-box input");

const cards = document.querySelectorAll(".card");
const panels = document.querySelectorAll(".panel");
const progressBars = document.querySelectorAll(".progress div");

// ================================
// Sidebar Toggle
// ================================

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        sidebar.classList.toggle("active");

    });

}

// ================================
// Dark Mode
// ================================

function loadTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        body.classList.add("dark");

        if (themeBtn) {

            themeBtn.innerHTML =
                '<i class="fa-solid fa-sun"></i>';

        }

    }

}

loadTheme();

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        body.classList.toggle("dark");

        if (body.classList.contains("dark")) {

            localStorage.setItem("theme", "dark");

            themeBtn.innerHTML =
                '<i class="fa-solid fa-sun"></i>';

        }

        else {

            localStorage.setItem("theme", "light");

            themeBtn.innerHTML =
                '<i class="fa-solid fa-moon"></i>';

        }

    });

}

// ================================
// Card Hover Animation
// ================================

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-10px) scale(1.02)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});

// ================================
// Panel Animation on Load
// ================================

window.addEventListener("load", () => {

    panels.forEach((panel, index) => {

        panel.style.opacity = "0";

        panel.style.transform = "translateY(30px)";

        setTimeout(() => {

            panel.style.transition = "0.6s";

            panel.style.opacity = "1";

            panel.style.transform = "translateY(0)";

        }, index * 100);

    });

});

// ================================
// Search Filter
// ================================

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        cards.forEach(card => {

            const text =
                card.innerText.toLowerCase();

            if (text.includes(value)) {

                card.style.display = "flex";

            }

            else {

                card.style.display = "none";

            }

        });

    });

}

// ================================
// Animated Counter
// ================================

function animateCounter(id, target) {

    const element = document.getElementById(id);

    if (!element) return;

    let count = 0;

    const speed = Math.ceil(target / 80);

    const interval = setInterval(() => {

        count += speed;

        if (count >= target) {

            count = target;

            clearInterval(interval);

        }

        element.innerHTML = count + "%";

    }, 20);

}

animateCounter("atsScore", 87);

// ================================
// Progress Bar Animation
// ================================

function animateBars() {

    progressBars.forEach(bar => {

        const width = bar.style.width;

        bar.style.width = "0";

        setTimeout(() => {

            bar.style.transition = "2s";

            bar.style.width = width;

        }, 500);

    });

}

animateBars();

// ================================
// Welcome Button Animation
// ================================

const welcomeBtn =
document.querySelector(".welcome button");

if (welcomeBtn) {

    welcomeBtn.addEventListener("mouseenter", () => {

        welcomeBtn.style.transform =
            "scale(1.05)";

    });

    welcomeBtn.addEventListener("mouseleave", () => {

        welcomeBtn.style.transform =
            "scale(1)";

    });

}

// ================================
// Download Button Effect
// ================================

const downloadBtn =
document.querySelector(".download");

if (downloadBtn) {

    downloadBtn.addEventListener("click", () => {

        downloadBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Preparing...';

        setTimeout(() => {

            downloadBtn.innerHTML =
                '<i class="fa-solid fa-download"></i> Download Report';

        }, 2000);

    });

}

// ================================
// Smooth Scroll
// ================================

document.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", e => {

        if (link.getAttribute("href") === "#") {

            e.preventDefault();

        }

    });

});

// ================================
// Active Sidebar Menu
// ================================

const menuItems =
document.querySelectorAll(".menu li");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(i => {

            i.classList.remove("active");

        });

        item.classList.add("active");

    });

});

// ================================
// Card Click Animation
// ================================

cards.forEach(card => {

    card.addEventListener("click", () => {

        card.animate(

            [

                {
                    transform: "scale(1)"
                },

                {
                    transform: "scale(.96)"
                },

                {
                    transform: "scale(1)"
                }

            ],

            {

                duration: 250

            }

        );

    });

});

// ================================
// Console Message
// ================================

console.log(
"%cCV Insight Dashboard Loaded Successfully!",
"color:#5B5FEF;font-size:18px;font-weight:bold;"
);
/*=========================================
    PART 4B-1A
    Resume Analysis Radar Chart
=========================================*/

const chartCanvas = document.getElementById("resumeChart");

if (chartCanvas) {

    const ctx = chartCanvas.getContext("2d");

    // Gradient Fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);

    gradient.addColorStop(0, "rgba(91,95,239,0.45)");
    gradient.addColorStop(1, "rgba(122,92,255,0.05)");

    const resumeChart = new Chart(ctx, {

        type: "radar",

        data: {

            labels: [

                "Technical Skills",
                "Experience",
                "Education",
                "Projects",
                "Achievements",
                "Certifications"

            ],

            datasets: [

                {

                    label: "Resume Score",

                    data: [

                        90,
                        84,
                        92,
                        86,
                        74,
                        81

                    ],

                    backgroundColor: gradient,

                    borderColor: "#5B5FEF",

                    borderWidth: 3,

                    pointRadius: 5,

                    pointHoverRadius: 8,

                    pointBackgroundColor: "#5B5FEF",

                    pointBorderColor: "#ffffff",

                    pointBorderWidth: 2

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {

                duration: 2000,

                easing: "easeOutQuart"

            },

            plugins: {

                legend: {

                    display: true,

                    position: "top",

                    labels: {

                        color: "#444",

                        font: {

                            size: 14,

                            weight: "bold"

                        }

                    }

                },

                tooltip: {

                    backgroundColor: "#5B5FEF",

                    titleColor: "#fff",

                    bodyColor: "#fff",

                    cornerRadius: 10,

                    padding: 12,

                    callbacks: {

                        label: function (context) {

                            return context.formattedValue + "%";

                        }

                    }

                }

            },

            scales: {

                r: {

                    beginAtZero: true,

                    min: 0,

                    max: 100,

                    ticks: {

                        stepSize: 20,

                        backdropColor: "transparent",

                        color: "#666"

                    },

                    pointLabels: {

                        color: "#333",

                        font: {

                            size: 13,

                            weight: "600"

                        }

                    },

                    grid: {

                        color: "#d9d9d9"

                    },

                    angleLines: {

                        color: "#d9d9d9"

                    }

                }

            }

        }

    });

}

/*=========================================
    Animate Score Numbers
=========================================*/

function animateValue(element, endValue) {

    if (!element) return;

    let start = 0;

    const duration = 1500;

    const increment = endValue / (duration / 20);

    const timer = setInterval(() => {

        start += increment;

        if (start >= endValue) {

            start = endValue;

            clearInterval(timer);

        }

        element.textContent = Math.floor(start) + "%";

    }, 20);

}

/*=========================================
    Animate Overview Cards
=========================================*/

const overviewNumbers = document.querySelectorAll(".overview h2");

const overviewTargets = [

    94,
    87,
    91,
    89

];

overviewNumbers.forEach((item, index) => {

    animateValue(item, overviewTargets[index]);

});

/*=========================================
    Scroll Reveal Animation
=========================================*/

const revealItems = document.querySelectorAll(

    ".panel, .card, .overview, .skill-card, .suggestion-card"

);

const revealObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";

                entry.target.style.transform = "translateY(0)";

            }

        });

    },

    {

        threshold: 0.15

    }

);

revealItems.forEach((item) => {

    item.style.opacity = "0";

    item.style.transform = "translateY(40px)";

    item.style.transition = "all .8s ease";

    revealObserver.observe(item);

});

/*=========================================
    Dashboard Loaded Message
=========================================*/

console.log("Resume Analysis Chart Initialized");
/*=========================================
    PART 4B-1B
    ATS Circular Score Animation
=========================================*/

const atsCircle = document.querySelector(".circle");
const atsText = document.querySelector(".circle span");

if (atsCircle && atsText) {

    let current = 0;
    const target = 87;

    const animateATS = setInterval(() => {

        current++;

        atsText.innerHTML = current + "%";

        atsCircle.style.background =
            `conic-gradient(
                #5B5FEF 0deg,
                #7A5CFF ${current * 3.6}deg,
                #e5e7eb ${current * 3.6}deg
            )`;

        if (current >= target) {

            clearInterval(animateATS);

        }

    }, 20);

}

/*=========================================
    Resume Strength Animation
=========================================*/

const strengths = document.querySelectorAll(".strength .progress div");

strengths.forEach(bar => {

    const width = bar.getAttribute("data-width") || bar.style.width;

    bar.style.width = "0";

    setTimeout(() => {

        bar.style.transition = "1.8s ease";

        bar.style.width = width;

    }, 500);

});

/*=========================================
    Skill Card Hover Animation
=========================================*/

const skillCards = document.querySelectorAll(".skill-card");

skillCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.animate([

            { transform: "translateY(0px)" },

            { transform: "translateY(-10px)" }

        ], {

            duration: 300,
            fill: "forwards"

        });

    });

    card.addEventListener("mouseleave", () => {

        card.animate([

            { transform: "translateY(-10px)" },

            { transform: "translateY(0px)" }

        ], {

            duration: 300,
            fill: "forwards"

        });

    });

});

/*=========================================
    AI Suggestion Card Animation
=========================================*/

const suggestions = document.querySelectorAll(".suggestion-card");

suggestions.forEach(card => {

    card.addEventListener("click", () => {

        card.animate([

            { transform: "scale(1)" },

            { transform: "scale(.97)" },

            { transform: "scale(1)" }

        ], {

            duration: 250

        });

    });

});

/*=========================================
    Company Hover Effect
=========================================*/

const companies = document.querySelectorAll(".company");

companies.forEach(company => {

    company.addEventListener("mouseenter", () => {

        company.style.background = "#eef2ff";

    });

    company.addEventListener("mouseleave", () => {

        company.style.background = "";

    });

});

/*=========================================
    Live ATS Score Update Demo
=========================================*/

setInterval(() => {

    const score = document.getElementById("atsScore");

    if (!score) return;

    let value = parseInt(score.innerText);

    value += Math.floor(Math.random() * 2);

    if (value > 90) value = 87;

    score.innerHTML = value + "%";

}, 10000);

console.log("ATS Animation Loaded");

/*=========================================
    PART 4B-2
    Toast Notification System
=========================================*/

function showToast(message, type = "success") {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = `
        <i class="fa-solid ${
            type === "success"
                ? "fa-circle-check"
                : "fa-circle-info"
        }"></i>
        <span>${message}</span>
    `;

    toast.style.position = "fixed";
    toast.style.top = "30px";
    toast.style.right = "30px";
    toast.style.padding = "15px 22px";
    toast.style.background = "#5B5FEF";
    toast.style.color = "#fff";
    toast.style.borderRadius = "12px";
    toast.style.boxShadow = "0 12px 25px rgba(0,0,0,.2)";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "12px";
    toast.style.zIndex = "99999";
    toast.style.transform = "translateX(120%)";
    toast.style.transition = ".4s";

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.style.transform = "translateX(0)";

    }, 100);

    setTimeout(() => {

        toast.style.transform = "translateX(120%)";

        setTimeout(() => {

            toast.remove();

        }, 500);

    }, 3000);

}

/*=========================================
    Download Report
=========================================*/

const downloadReport =
document.querySelector(".download");

if(downloadReport){

downloadReport.addEventListener("click",()=>{

showToast("Preparing Resume Report...");

setTimeout(()=>{

showToast("Report Downloaded Successfully");

},2500);

});

}

/*=========================================
    Notification Badge
=========================================*/

const notification =
document.querySelector(".notification");

let notificationCount=3;

if(notification){

const badge=document.createElement("span");

badge.className="badge";

badge.innerHTML=notificationCount;

badge.style.position="absolute";
badge.style.top="-6px";
badge.style.right="-6px";
badge.style.width="20px";
badge.style.height="20px";
badge.style.background="#ef4444";
badge.style.color="#fff";
badge.style.borderRadius="50%";
badge.style.display="flex";
badge.style.alignItems="center";
badge.style.justifyContent="center";
badge.style.fontSize="12px";

notification.style.position="relative";

notification.appendChild(badge);

setInterval(()=>{

notificationCount++;

badge.innerHTML=notificationCount;

},20000);

}

/*=========================================
    Resume Upload
=========================================*/

const uploadInput=document.getElementById("resumeUpload");

if(uploadInput){

uploadInput.addEventListener("change",(e)=>{

const file=e.target.files[0];

if(!file)return;

showToast(file.name+" uploaded successfully");

});

}

/*=========================================
    Fake Live Activity
=========================================*/

const activityMessages=[

"Resume analyzed successfully",

"New keyword matched",

"Grammar improved",

"ATS score increased",

"Formatting optimized",

"Projects section updated",

"Experience matched"

];

setInterval(()=>{

const random=Math.floor(

Math.random()*activityMessages.length

);

showToast(activityMessages[random],"info");

},30000);

/*=========================================
    Job Match Hover
=========================================*/

document.querySelectorAll(".company").forEach(company=>{

company.addEventListener("mouseenter",()=>{

company.style.transform="scale(1.03)";

});

company.addEventListener("mouseleave",()=>{

company.style.transform="scale(1)";

});

});

/*=========================================
    Resume History Row Effect
=========================================*/

document.querySelectorAll(".history-table tbody tr").forEach(row=>{

row.addEventListener("click",()=>{

row.animate([

{

background:"#eef2ff"

},

{

background:"#ffffff"

}

],{

duration:500

});

});

});

/*=========================================
    Next Step Cards
=========================================*/

document.querySelectorAll(".step").forEach(step=>{

step.addEventListener("click",()=>{

showToast(

step.querySelector("h4").innerText

);

});

});

/*=========================================
    Console
=========================================*/

console.log(

"%cDashboard Advanced Features Loaded",

"color:#22c55e;font-size:18px;font-weight:bold"

);
/*=========================================
    PART 4C
    Final Dashboard Features
=========================================*/

/*=========================================
    Profile Dropdown
=========================================*/

const profile = document.querySelector(".profile");

if (profile) {

    const menu = document.createElement("div");

    menu.className = "profile-menu";

    menu.innerHTML = `
        <ul>
            <li><i class="fa-solid fa-user"></i> My Profile</li>
            <li><i class="fa-solid fa-file"></i> My Resume</li>
            <li><i class="fa-solid fa-gear"></i> Settings</li>
            <li><i class="fa-solid fa-right-from-bracket"></i> Logout</li>
        </ul>
    `;

    menu.style.position = "absolute";
    menu.style.top = "70px";
    menu.style.right = "0";
    menu.style.width = "220px";
    menu.style.background = "#fff";
    menu.style.borderRadius = "15px";
    menu.style.boxShadow = "0 15px 35px rgba(0,0,0,.12)";
    menu.style.display = "none";
    menu.style.padding = "15px";
    menu.style.zIndex = "10000";

    profile.style.position = "relative";
    profile.appendChild(menu);

    profile.addEventListener("click", () => {

        menu.style.display =
            menu.style.display === "block"
                ? "none"
                : "block";

    });

    document.addEventListener("click", e => {

        if (!profile.contains(e.target)) {

            menu.style.display = "none";

        }

    });

}

/*=========================================
    Welcome Banner Auto Text
=========================================*/

const welcomeTitle = document.querySelector(".welcome h2");

if (welcomeTitle) {

    const titles = [

        "Welcome Back 👋",
        "Resume Ready 🚀",
        "Let's Improve Your ATS Score",
        "Keep Building Your Career"

    ];

    let index = 0;

    setInterval(() => {

        index++;

        if (index >= titles.length)
            index = 0;

        welcomeTitle.innerHTML = titles[index];

    }, 5000);

}

/*=========================================
    Card Floating Animation
=========================================*/

document.querySelectorAll(".card").forEach((card, i) => {

    setInterval(() => {

        card.animate([

            {
                transform: "translateY(0px)"
            },

            {
                transform: "translateY(-5px)"
            },

            {
                transform: "translateY(0px)"
            }

        ], {

            duration: 2500 + (i * 250),

            iterations: 1

        });

    }, 3500 + (i * 300));

});

/*=========================================
    Live Clock
=========================================*/

const clock = document.getElementById("liveClock");

if (clock) {

    setInterval(() => {

        const d = new Date();

        clock.innerHTML = d.toLocaleTimeString();

    }, 1000);

}

/*=========================================
    Fake Resume Analysis Progress
=========================================*/

const analyzeBtn = document.getElementById("analyzeResume");

if (analyzeBtn) {

    analyzeBtn.addEventListener("click", () => {

        let progress = 0;

        analyzeBtn.disabled = true;

        analyzeBtn.innerHTML = "Analyzing...";

        const timer = setInterval(() => {

            progress += 10;

            analyzeBtn.innerHTML =
                "Analyzing " + progress + "%";

            if (progress >= 100) {

                clearInterval(timer);

                analyzeBtn.innerHTML =
                    "Analysis Completed";

                showToast("Resume Analysis Completed");

            }

        }, 300);

    });

}

/*=========================================
    Random ATS Demo
=========================================*/

const ats = document.getElementById("atsScore");

if (ats) {

    setInterval(() => {

        ats.innerHTML =
            (85 + Math.floor(Math.random() * 8)) + "%";

    }, 15000);

}

/*=========================================
    Keyboard Shortcut
=========================================*/

document.addEventListener("keydown", e => {

    if (e.ctrlKey && e.key === "d") {

        e.preventDefault();

        document.body.classList.toggle("dark");

    }

});

/*=========================================
    Scroll To Top Button
=========================================*/

const topBtn = document.createElement("button");

topBtn.innerHTML =
'<i class="fa-solid fa-arrow-up"></i>';

topBtn.style.position = "fixed";
topBtn.style.right = "30px";
topBtn.style.bottom = "30px";
topBtn.style.width = "55px";
topBtn.style.height = "55px";
topBtn.style.border = "none";
topBtn.style.borderRadius = "50%";
topBtn.style.background = "#5B5FEF";
topBtn.style.color = "#fff";
topBtn.style.fontSize = "20px";
topBtn.style.cursor = "pointer";
topBtn.style.display = "none";
topBtn.style.zIndex = "9999";

document.body.appendChild(topBtn);

window.addEventListener("scroll", () => {

    topBtn.style.display =
        window.scrollY > 250
            ? "block"
            : "none";

});

topBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

/*=========================================
    Sidebar Collapse on Mobile
=========================================*/

window.addEventListener("resize", () => {

    if (window.innerWidth > 992) {

        sidebar.classList.remove("active");

    }

});

/*=========================================
    Final Console
=========================================*/

console.log(
"%cCV Insight Dashboard Ready 🚀",
"font-size:22px;color:#5B5FEF;font-weight:bold"
);