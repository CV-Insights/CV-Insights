const body         = document.body;
const sidebar      = document.querySelector(".sidebar");
const menuBtn      = document.getElementById("menuBtn");
const themeBtn     = document.getElementById("themeBtn");
const generateBtn  = document.getElementById("generateBtn");
const generateBtn2 = document.getElementById("generateBtn2");
const sendBtn      = document.getElementById("sendBtn");
const chatInput    = document.getElementById("chatInput");
const chatBox      = document.getElementById("chatBox");


let doneCount = 3;
const totalCount = 9;


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
        } else {
            localStorage.setItem("theme", "light");
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    });
}


function markDone(btn) {
    const card = btn.closest(".ai-card");
    card.classList.add("completed");
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Done!';
    btn.classList.add("done-state");
    btn.disabled = true;
    updateProgress(1);
    showToast("Great job! Suggestion marked as done.");
}


function skipCard(btn) {
    const card = btn.closest(".ai-card");
    card.classList.add("skipped");
    showToast("Suggestion skipped.");
}


function updateProgress(delta) {
    doneCount = Math.min(doneCount + delta, totalCount);
    const pct = Math.round((doneCount / totalCount) * 100);
    const fill = document.getElementById("progressFill");
    const label = document.getElementById("progressLabel");
    if (fill) {
        fill.style.width = pct + "%";
        fill.querySelector("span").textContent = pct + "%";
    }
    if (label) {
        label.textContent = doneCount + " / " + totalCount + " Completed";
    }
}


function handleGenerate(btn) {
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = btn === generateBtn
            ? '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate New Suggestions'
            : '<i class="fa-solid fa-rotate"></i> Regenerate';
        btn.disabled = false;
        showToast("New AI suggestions generated!");
    }, 2200);
}

if (generateBtn) generateBtn.addEventListener("click", () => handleGenerate(generateBtn));
if (generateBtn2) generateBtn2.addEventListener("click", () => handleGenerate(generateBtn2));


const aiResponses = [
    "Great question! To improve your ATS score, focus on adding cloud keywords like <strong>AWS, Docker</strong> and <strong>Kubernetes</strong>.",
    "I recommend quantifying your experience bullets. For example: <em>\"Reduced API response time by 40%\"</em> is stronger.",
    "Your projects section is a bit thin. Add 2-3 projects with <strong>GitHub links</strong> and measurable impact.",
    "Your formatting looks good overall, but reducing white space by 15% could get you one extra recruiter look.",
    "Your grammar is excellent at 98%! Focus your energy on adding missing keywords for the biggest ATS boost.",
    "Consider adding a <strong>Technical Summary</strong> at the top of your resume tailored to each job application.",
    "For certifications, I suggest <strong>AWS Cloud Practitioner</strong> or <strong>Google Cloud Associate</strong> — both are high demand.",
    "Your resume is in the <strong>top 10%</strong> of candidates. Fix the missing keywords and you could hit 95+ ATS score!"
];
let responseIndex = 0;

function addMessage(text, isUser) {
    const msg = document.createElement("div");
    msg.className = "ai-msg " + (isUser ? "user" : "bot");

    const avatar = document.createElement("div");
    avatar.className = "ai-avatar";
    avatar.innerHTML = isUser
        ? '<i class="fa-solid fa-user"></i>'
        : '<i class="fa-solid fa-robot"></i>';

    const bubble = document.createElement("div");
    bubble.className = "ai-bubble";
    bubble.innerHTML = "<p>" + text + "</p>";

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, true);
    chatInput.value = "";

    
    const typingEl = document.createElement("div");
    typingEl.className = "ai-msg bot";
    typingEl.innerHTML = `
        <div class="ai-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="ai-bubble" style="padding:12px 16px;">
            <span class="typing-dots">AI is typing<span>.</span><span>.</span><span>.</span></span>
        </div>
    `;
    chatBox.appendChild(typingEl);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        chatBox.removeChild(typingEl);
        const reply = aiResponses[responseIndex % aiResponses.length];
        responseIndex++;
        addMessage(reply, false);
    }, 1300);
}

if (sendBtn)   sendBtn.addEventListener("click", sendMessage);
if (chatInput) chatInput.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });

// Typing dots animation
(function injectTypingCSS() {
    const s = document.createElement("style");
    s.textContent = `
        .typing-dots span {
            animation: blink 1.2s infinite;
            font-size: 18px;
            line-height: 1;
        }
        .typing-dots span:nth-child(2) { animation-delay: .2s; }
        .typing-dots span:nth-child(3) { animation-delay: .4s; }
        @keyframes blink { 0%,80%,100%{opacity:0} 40%{opacity:1} }
    `;
    document.head.appendChild(s);
})();


document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mouseenter", () => { card.style.transform = "translateY(-10px) scale(1.02)"; });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});


document.querySelectorAll(".ai-tracker-item.pending").forEach(item => {
    item.addEventListener("click", () => {
        if (!item.classList.contains("done")) {
            item.classList.remove("pending");
            item.classList.add("done");
            item.querySelector("i").className = "fa-solid fa-circle-check";
            updateProgress(1);
            showToast("Task marked as complete!");
        }
    });
});


function showToast(msg) {
    let toast = document.querySelector(".ai-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "ai-toast";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

(function injectToastCSS() {
    const s = document.createElement("style");
    s.textContent = `
        .ai-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #7c3aed, #a855f7);
            color: #fff;
            padding: 14px 24px;
            border-radius: 14px;
            font-size: 15px;
            font-family: Poppins, sans-serif;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(124,58,237,.35);
            opacity: 0;
            transform: translateY(20px);
            transition: .35s;
            z-index: 9999;
            pointer-events: none;
        }
        .ai-toast.show { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(s);
})();

// Make markDone & skipCard globally available
window.markDone = markDone;
window.skipCard = skipCard;

console.log("AI Suggestions JS loaded.");
