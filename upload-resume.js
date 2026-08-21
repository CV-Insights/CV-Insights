

const body = document.body;
const sidebar = document.querySelector(".sidebar");
const menuBtn = document.getElementById("menuBtn");
const themeBtn = document.getElementById("themeBtn");

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const browseBtn = document.getElementById("browseBtn");

const uploadProgress = document.getElementById("uploadProgress");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const removeBtn = document.getElementById("removeBtn");

const uploadSuccess = document.getElementById("uploadSuccess");
const analyzeBtn = document.getElementById("analyzeBtn");
const reuploadBtn = document.getElementById("reuploadBtn");



if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        sidebar.classList.toggle("active");

    });

}



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



document.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", e => {

        if (link.getAttribute("href") === "#") {

            e.preventDefault();

        }

    });

});



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


const revealItems = document.querySelectorAll(

    ".panel, .tip-item, .upload-panel"

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

// Prevent default drag behaviors on the page

["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {

    document.body.addEventListener(eventName, (e) => {

        e.preventDefault();

        e.stopPropagation();

    });

});



if (dropZone) {

    ["dragenter", "dragover"].forEach(eventName => {

        dropZone.addEventListener(eventName, () => {

            dropZone.classList.add("drag-over");

        });

    });

    ["dragleave", "drop"].forEach(eventName => {

        dropZone.addEventListener(eventName, () => {

            dropZone.classList.remove("drag-over");

        });

    });


    dropZone.addEventListener("drop", (e) => {

        const files = e.dataTransfer.files;

        if (files.length > 0) {

            handleFile(files[0]);

        }

    });


    dropZone.addEventListener("click", (e) => {

        // Don't trigger if clicking the remove button
        if (e.target.closest(".remove-btn")) return;

        fileInput.click();

    });

}



if (browseBtn) {

    browseBtn.addEventListener("click", (e) => {

        e.stopPropagation();

        fileInput.click();

    });

}

// File input change

if (fileInput) {

    fileInput.addEventListener("change", () => {

        if (fileInput.files.length > 0) {

            handleFile(fileInput.files[0]);

        }

    });

}


function handleFile(file) {

    // Validate file type

    const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain"
    ];

    const validExtensions = [".pdf", ".doc", ".docx", ".txt"];

    const ext = "." + file.name.split(".").pop().toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {

        showToast("Invalid file type! Please upload PDF, DOCX, or TXT.", "error");

        return;

    }

    // Validate file size (5MB max)

    if (file.size > 5 * 1024 * 1024) {

        showToast("File too large! Maximum size is 5MB.", "error");

        return;

    }

    // Show file info

    fileName.textContent = file.name;

    fileSize.textContent = formatFileSize(file.size);

    // Set the correct icon based on file type

    const fileIcon = document.querySelector(".file-info > i");

    if (ext === ".pdf") {

        fileIcon.className = "fa-solid fa-file-pdf";

        fileIcon.style.color = "#ef4444";

    } else if (ext === ".doc" || ext === ".docx") {

        fileIcon.className = "fa-solid fa-file-word";

        fileIcon.style.color = "#2563eb";

    } else {

        fileIcon.className = "fa-solid fa-file-lines";

        fileIcon.style.color = "#6b7280";

    }

    // Hide the drop content, show progress

    document.querySelector(".drop-zone-content").style.display = "none";

    uploadProgress.classList.add("active");

    // Simulate upload progress

    simulateUpload();

}


// Simulate Upload Progress

function simulateUpload() {

    let progress = 0;

    const interval = setInterval(() => {

        // Random increment for realistic feel

        progress += Math.random() * 12 + 3;

        if (progress >= 100) {

            progress = 100;

            clearInterval(interval);

            // Show success after a brief pause

            setTimeout(() => {

                showUploadSuccess();

            }, 400);

        }

        progressFill.style.width = progress + "%";

        progressText.textContent = "Uploading... " + Math.floor(progress) + "%";

    }, 200);

}



function showUploadSuccess() {

    dropZone.style.display = "none";

    uploadSuccess.classList.add("active");

    showToast("Resume uploaded successfully!", "success");

}



if (removeBtn) {

    removeBtn.addEventListener("click", (e) => {

        e.stopPropagation();

        resetUpload();

    });

}



if (reuploadBtn) {

    reuploadBtn.addEventListener("click", () => {

        resetUpload();

    });

}

// Analyze Button


if (analyzeBtn) {

    analyzeBtn.addEventListener("click", () => {

        analyzeBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';

        setTimeout(() => {

            // Redirect to analysis page (or show message)

            showToast("Redirecting to analysis...", "success");

            analyzeBtn.innerHTML =
                '<i class="fa-solid fa-magnifying-glass-chart"></i> Analyze Now';

        }, 2000);

    });

}

// Reset Upload State


function resetUpload() {

    // Reset file input

    fileInput.value = "";

    // Reset progress

    progressFill.style.width = "0%";

    progressText.textContent = "Uploading... 0%";

    // Hide progress and success

    uploadProgress.classList.remove("active");

    uploadSuccess.classList.remove("active");

    // Show drop zone content

    dropZone.style.display = "block";

    document.querySelector(".drop-zone-content").style.display = "flex";

}



function formatFileSize(bytes) {

    if (bytes === 0) return "0 Bytes";

    const sizes = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + " " + sizes[i];

}



function showToast(message, type) {

    // Remove existing toast

    const existingToast = document.querySelector(".toast");

    if (existingToast) existingToast.remove();

    // Create toast element

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
// Table Row Hover Animation
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



const deleteButtons = document.querySelectorAll(".action-btn.delete");

deleteButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        const row = btn.closest("tr");

        row.style.transition = ".5s";

        row.style.opacity = "0";

        row.style.transform = "translateX(50px)";

        setTimeout(() => {

            row.remove();

            showToast("File deleted successfully!", "success");

        }, 500);

    });

});


const viewButtons = document.querySelectorAll(".action-btn.view");

viewButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        const row = btn.closest("tr");

        const name = row.querySelector(".file-name-cell").textContent.trim();

        showToast("Opening " + name + "...", "success");

    });

});



const downloadButtons = document.querySelectorAll(".action-btn.download-action");

downloadButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        const row = btn.closest("tr");

        const name = row.querySelector(".file-name-cell").textContent.trim();

        showToast("Downloading " + name + "...", "success");

    });

});



console.log(
"%cCV Insight Upload Page Loaded Successfully!",
"color:#5B5FEF;font-size:18px;font-weight:bold;"
);
