/*=========================================
 CV Insight — Job Description JavaScript
=========================================*/

// ================================
// DOM Elements
// ================================

const body = document.body;
const sidebar = document.querySelector(".sidebar");
const menuBtn = document.getElementById("menuBtn");
const themeBtn = document.getElementById("themeBtn");

const jobTitle = document.getElementById("jobTitle");
const companyName = document.getElementById("companyName");
const jdTextarea = document.getElementById("jdTextarea");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");

const clearBtn = document.getElementById("clearBtn");
const pasteBtn = document.getElementById("pasteBtn");
const analyzeJdBtn = document.getElementById("analyzeJdBtn");

const analysisResults = document.getElementById("analysisResults");
const resultTitle = document.getElementById("resultTitle");
const resultCompany = document.getElementById("resultCompany");
const resultKeywords = document.getElementById("resultKeywords");
const resultWords = document.getElementById("resultWords");

const skillTags = document.getElementById("skillTags");
const skillCount = document.getElementById("skillCount");
const requirementsList = document.getElementById("requirementsList");
const reqCount = document.getElementById("reqCount");

const matchResumeBtn = document.getElementById("matchResumeBtn");
const matchContent = document.getElementById("matchContent");
const matchResults = document.getElementById("matchResults");

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
// Panel Animation on Load
// ================================

const panels = document.querySelectorAll(".panel");

window.addEventListener("load", () => {

    panels.forEach((panel, index) => {

        panel.style.opacity = "0";

        panel.style.transform = "translateY(30px)";

        setTimeout(() => {

            panel.style.transition = "0.6s";

            panel.style.opacity = "1";

            panel.style.transform = "translateY(0)";

        }, index * 150);

    });

});

// ================================
// Scroll Reveal
// ================================

const revealItems = document.querySelectorAll(

    ".panel, .info-card, .template-item"

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

// ================================
// Character & Word Count
// ================================

if (jdTextarea) {

    jdTextarea.addEventListener("input", () => {

        const text = jdTextarea.value;

        charCount.textContent = text.length + " characters";

        const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

        wordCount.textContent = words + " words";

    });

}

// ================================
// Clear Button
// ================================

if (clearBtn) {

    clearBtn.addEventListener("click", () => {

        jobTitle.value = "";

        companyName.value = "";

        jdTextarea.value = "";

        charCount.textContent = "0 characters";

        wordCount.textContent = "0 words";

        analysisResults.classList.remove("active");

        matchResults.classList.remove("active");

        matchContent.style.display = "block";

        showToast("Fields cleared!", "success");

    });

}

// ================================
// Paste Button
// ================================

if (pasteBtn) {

    pasteBtn.addEventListener("click", async () => {

        try {

            const text = await navigator.clipboard.readText();

            jdTextarea.value = text;

            // Trigger input event to update counts

            jdTextarea.dispatchEvent(new Event("input"));

            showToast("Pasted from clipboard!", "success");

        } catch (err) {

            showToast("Unable to access clipboard. Please paste manually.", "error");

        }

    });

}

// ================================
// Quick Templates
// ================================

const templateItems = document.querySelectorAll(".template-item");

templateItems.forEach(item => {

    item.addEventListener("click", () => {

        const title = item.getAttribute("data-title");

        const company = item.getAttribute("data-company");

        const jd = item.getAttribute("data-jd");

        jobTitle.value = title;

        companyName.value = company;

        jdTextarea.value = jd;

        // Trigger input event

        jdTextarea.dispatchEvent(new Event("input"));

        // Highlight selected

        templateItems.forEach(t => t.style.borderColor = "#edf0f5");

        item.style.borderColor = "var(--primary)";

        showToast("Template loaded: " + title, "success");

        // Scroll to textarea

        jdTextarea.focus();

    });

});

// ================================
// Skills & Keywords Database
// ================================

const techSkills = [

    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin",
    "React", "React.js", "Angular", "Vue", "Vue.js", "Next.js", "Nuxt.js", "Svelte",
    "Node.js", "Express", "Express.js", "Django", "Flask", "Spring", "FastAPI", "Laravel",
    "HTML", "HTML5", "CSS", "CSS3", "Sass", "SCSS", "Tailwind", "Bootstrap",
    "MongoDB", "MySQL", "PostgreSQL", "Redis", "Firebase", "Supabase", "SQL", "NoSQL", "DynamoDB", "Cassandra",
    "AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions",
    "CI/CD", "DevOps", "Linux", "Git", "REST", "RESTful", "REST API", "GraphQL", "gRPC",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow", "PyTorch", "scikit-learn",
    "Pandas", "NumPy", "Matplotlib", "Jupyter",
    "Power BI", "Tableau", "Excel", "Data Visualization", "Data Analysis", "Data Science", "Data Engineering",
    "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "InDesign",
    "Agile", "Scrum", "Jira", "Confluence", "Trello",
    "Microservices", "Serverless", "Blockchain", "Web3", "Solidity",
    "React Native", "Flutter", "Ionic", "Xamarin",
    "Webpack", "Vite", "Babel", "ESLint", "Prettier",
    "Jest", "Mocha", "Cypress", "Selenium", "Playwright",
    "OAuth", "JWT", "SSO", "Authentication", "Authorization",
    "SageMaker", "Vertex AI", "MLOps", "Prometheus", "Grafana",
    "Bash", "Shell", "PowerShell", "Nginx", "Apache"

];

const requirementKeywords = [

    "years of experience", "bachelor", "master", "phd", "degree",
    "problem-solving", "communication", "leadership", "teamwork", "team player",
    "fast-paced", "self-motivated", "detail-oriented", "critical thinking",
    "full-time", "part-time", "remote", "hybrid", "on-site", "onsite",
    "salary", "benefits", "equity", "bonus",
    "portfolio", "certification", "certified",
    "mentor", "collaborate", "cross-functional",
    "responsive", "scalable", "high-performance", "production",
    "deploy", "maintain", "design", "develop", "implement", "optimize", "test",
    "strong", "excellent", "proficient", "expert", "knowledge of", "experience with", "familiarity with",
    "hands-on", "proven track record"

];

// ================================
// Analyze Job Description
// ================================

if (analyzeJdBtn) {

    analyzeJdBtn.addEventListener("click", () => {

        const title = jobTitle.value.trim();

        const company = companyName.value.trim();

        const jdText = jdTextarea.value.trim();

        // Validation

        if (jdText.length < 20) {

            showToast("Please enter a valid job description (minimum 20 characters).", "error");

            return;

        }

        // Show loading

        analyzeJdBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';

        analyzeJdBtn.style.pointerEvents = "none";

        setTimeout(() => {

            performAnalysis(title, company, jdText);

            analyzeJdBtn.innerHTML =
                '<i class="fa-solid fa-wand-magic-sparkles"></i> Analyze Job Description';

            analyzeJdBtn.style.pointerEvents = "auto";

        }, 1500);

    });

}

// ================================
// Perform Analysis
// ================================

function performAnalysis(title, company, jdText) {

    const textLower = jdText.toLowerCase();

    // Extract skills

    const foundSkills = [];

    techSkills.forEach(skill => {

        const skillLower = skill.toLowerCase();

        // Word boundary match

        const regex = new RegExp("\\b" + escapeRegex(skillLower) + "\\b", "i");

        if (regex.test(jdText)) {

            foundSkills.push(skill);

        }

    });

    // Remove duplicates (case-insensitive)

    const uniqueSkills = [...new Set(foundSkills.map(s => s))];

    // Extract requirements

    const foundReqs = [];

    const sentences = jdText.split(/[.!?;\n]+/).filter(s => s.trim().length > 10);

    sentences.forEach(sentence => {

        const sentLower = sentence.toLowerCase();

        requirementKeywords.forEach(keyword => {

            if (sentLower.includes(keyword) && !foundReqs.includes(sentence.trim())) {

                foundReqs.push(sentence.trim());

            }

        });

    });

    // Limit to top 8 requirements

    const topReqs = foundReqs.slice(0, 8);

    // Word count

    const words = jdText.trim().split(/\s+/).length;

    // Update info cards

    resultTitle.textContent = title || "Not Specified";

    resultCompany.textContent = company || "Not Specified";

    resultKeywords.textContent = uniqueSkills.length;

    resultWords.textContent = words;

    // Update skill tags

    skillTags.innerHTML = "";

    uniqueSkills.forEach((skill, index) => {

        const span = document.createElement("span");

        span.textContent = skill;

        span.style.opacity = "0";

        span.style.transform = "translateY(10px)";

        skillTags.appendChild(span);

        setTimeout(() => {

            span.style.transition = ".4s";

            span.style.opacity = "1";

            span.style.transform = "translateY(0)";

        }, index * 60);

    });

    skillCount.textContent = uniqueSkills.length + " Found";

    // Update requirements

    requirementsList.innerHTML = "";

    topReqs.forEach((req, index) => {

        const div = document.createElement("div");

        div.className = "req-item";

        div.style.opacity = "0";

        div.style.transform = "translateY(10px)";

        div.innerHTML = `
            <i class="fa-solid fa-circle-check" style="color:var(--primary)"></i>
            <p>${req}</p>
        `;

        requirementsList.appendChild(div);

        setTimeout(() => {

            div.style.transition = ".5s";

            div.style.opacity = "1";

            div.style.transform = "translateY(0)";

        }, index * 100);

    });

    if (topReqs.length === 0) {

        requirementsList.innerHTML = '<div class="req-item"><i class="fa-solid fa-info-circle" style="color:#f59e0b"></i><p>No specific requirements extracted. Try adding more detail to the job description.</p></div>';

    }

    reqCount.textContent = topReqs.length + " Found";

    // Reset match section

    matchResults.classList.remove("active");

    matchContent.style.display = "block";

    // Show results

    analysisResults.classList.add("active");

    // Scroll to results

    analysisResults.scrollIntoView({ behavior: "smooth", block: "start" });

    showToast("Analysis complete! " + uniqueSkills.length + " skills found.", "success");

}

// ================================
// Escape Regex special chars
// ================================

function escapeRegex(string) {

    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

}

// ================================
// Match Resume Button
// ================================

if (matchResumeBtn) {

    matchResumeBtn.addEventListener("click", () => {

        matchResumeBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Matching...';

        matchResumeBtn.style.pointerEvents = "none";

        setTimeout(() => {

            performMatch();

            matchResumeBtn.innerHTML =
                '<i class="fa-solid fa-code-compare"></i> Match Resume';

            matchResumeBtn.style.pointerEvents = "auto";

        }, 2000);

    });

}

// ================================
// Perform Resume Match (Simulated)
// ================================

function performMatch() {

    // Hide placeholder, show results

    matchContent.style.display = "none";

    matchResults.classList.add("active");

    // Simulated resume skills

    const resumeSkills = [
        "HTML", "CSS", "JavaScript", "React", "Node.js",
        "MongoDB", "Git", "REST API", "Bootstrap", "Express.js",
        "Python", "SQL", "Agile", "Figma", "Docker"
    ];

    // Get extracted skills from analysis

    const extractedSkills = [];

    skillTags.querySelectorAll("span").forEach(span => {

        extractedSkills.push(span.textContent);

    });

    // Find matched and missing

    const matched = [];

    const missing = [];

    extractedSkills.forEach(skill => {

        if (resumeSkills.some(rs => rs.toLowerCase() === skill.toLowerCase())) {

            matched.push(skill);

        } else {

            missing.push(skill);

        }

    });

    // Calculate scores

    const skillMatch = extractedSkills.length > 0 ?
        Math.round((matched.length / extractedSkills.length) * 100) : 0;

    const expMatch = Math.floor(Math.random() * 20) + 75;  // Simulated 75-95

    const keywordMatch = Math.floor(Math.random() * 15) + 70;  // Simulated 70-85

    const eduMatch = Math.floor(Math.random() * 20) + 70;  // Simulated 70-90

    const overallMatch = Math.round(
        (skillMatch * 0.4) + (expMatch * 0.25) + (keywordMatch * 0.2) + (eduMatch * 0.15)
    );

    // Animate match circle

    animateMatchCircle(overallMatch);

    // Animate bars

    animateBar("skillMatchBar", "skillMatchPct", skillMatch);

    animateBar("expMatchBar", "expMatchPct", expMatch);

    animateBar("keywordMatchBar", "keywordMatchPct", keywordMatch);

    animateBar("eduMatchBar", "eduMatchPct", eduMatch);

    // Populate matched tags

    const matchedTags = document.getElementById("matchedTags");

    matchedTags.innerHTML = "";

    matched.forEach((skill, i) => {

        const span = document.createElement("span");

        span.textContent = skill;

        span.style.opacity = "0";

        matchedTags.appendChild(span);

        setTimeout(() => {

            span.style.transition = ".4s";

            span.style.opacity = "1";

        }, i * 80);

    });

    if (matched.length === 0) {

        matchedTags.innerHTML = '<span style="background:#f3f4f6;color:#6b7280">None found</span>';

    }

    // Populate missing tags

    const missingTags = document.getElementById("missingTags");

    missingTags.innerHTML = "";

    missing.forEach((skill, i) => {

        const span = document.createElement("span");

        span.textContent = skill;

        span.style.opacity = "0";

        missingTags.appendChild(span);

        setTimeout(() => {

            span.style.transition = ".4s";

            span.style.opacity = "1";

        }, i * 80);

    });

    if (missing.length === 0) {

        missingTags.innerHTML = '<span style="background:#ecfdf5;color:#16a34a">All matched!</span>';

    }

    showToast("Resume matched! Overall score: " + overallMatch + "%", "success");

}

// ================================
// Animate Match Circle
// ================================

function animateMatchCircle(target) {

    const circle = document.getElementById("matchCircle");

    const text = document.getElementById("matchScoreText");

    let current = 0;

    const interval = setInterval(() => {

        current++;

        text.textContent = current + "%";

        circle.style.background =
            `conic-gradient(
                #5B5FEF 0deg,
                #7A5CFF ${current * 3.6}deg,
                #e5e7eb ${current * 3.6}deg
            )`;

        if (current >= target) {

            clearInterval(interval);

        }

    }, 18);

}

// ================================
// Animate Progress Bar
// ================================

function animateBar(barId, pctId, target) {

    const bar = document.getElementById(barId);

    const pct = document.getElementById(pctId);

    bar.style.width = "0%";

    setTimeout(() => {

        bar.style.width = target + "%";

        pct.textContent = target + "%";

    }, 300);

}

// ================================
// Table Row Interactions
// ================================

const tableRows = document.querySelectorAll(".history-table tbody tr");

tableRows.forEach(row => {

    row.addEventListener("mouseenter", () => {

        row.style.transform = "scale(1.01)";

        row.style.transition = ".3s";

    });

    row.addEventListener("mouseleave", () => {

        row.style.transform = "scale(1)";

    });

});

// Delete buttons

const deleteButtons = document.querySelectorAll(".action-btn.delete");

deleteButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        const row = btn.closest("tr");

        row.style.transition = ".5s";

        row.style.opacity = "0";

        row.style.transform = "translateX(50px)";

        setTimeout(() => {

            row.remove();

            showToast("Job description deleted!", "success");

        }, 500);

    });

});

// View buttons

const viewButtons = document.querySelectorAll(".action-btn.view");

viewButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        const row = btn.closest("tr");

        const name = row.querySelector(".file-name-cell").textContent.trim();

        showToast("Opening " + name + "...", "success");

    });

});

// ================================
// Toast Notification
// ================================

function showToast(message, type) {

    const existingToast = document.querySelector(".toast");

    if (existingToast) existingToast.remove();

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 16px 24px;
        border-radius: 15px;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        font-weight: 600;
        color: white;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,.2);
        animation: slideInToast .4s ease;
    `;

    if (type === "success") {

        toast.style.background = "linear-gradient(135deg, #22c55e, #16a34a)";
        toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + message;

    } else if (type === "error") {

        toast.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
        toast.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + message;

    }

    document.body.appendChild(toast);

    if (!document.getElementById("toastStyle")) {

        const style = document.createElement("style");

        style.id = "toastStyle";

        style.textContent = `
            @keyframes slideInToast {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;

        document.head.appendChild(style);

    }

    setTimeout(() => {

        toast.style.transition = ".4s";

        toast.style.opacity = "0";

        toast.style.transform = "translateY(30px)";

        setTimeout(() => toast.remove(), 400);

    }, 3000);

}

// ================================
// Console Message
// ================================

console.log(
"%cCV Insight Job Description Page Loaded Successfully!",
"color:#5B5FEF;font-size:18px;font-weight:bold;"
);
