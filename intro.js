

// Select upload elements
const uploadBox = document.querySelector(".upload-box");
const fileInput = document.querySelector("#resumeFile");
const browseBtn = document.querySelector(".browse-btn");

// 1. Open the file browser when clicking the "Browse Resume" button
if (browseBtn && fileInput) {
    browseBtn.addEventListener("click", () => {
        fileInput.click();
    });
}

// 2. Handle file selection and update UI with file details
if (fileInput && uploadBox) {
    fileInput.addEventListener("change", function () {
        if (this.files.length > 0) {
            const file = this.files[0];
            const fileSizeKB = (file.size / 1024).toFixed(1);

            uploadBox.classList.add("uploaded");
            uploadBox.querySelector("h3").textContent = file.name;
            uploadBox.querySelector("p").textContent = `${fileSizeKB} KB`;
        }
    });
}

// FAQ Accordion Toggle using display: none / display: block
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(question => {
    question.addEventListener("click", () => {
        const answer = question.nextElementSibling;
        const isOpen = answer.style.display == "block";

        // Hide all answers
        document.querySelectorAll(".faq-answer").forEach(ans => {
            ans.style.display = "none";
        });

        // Show clicked answer if it was not already open
        if (!isOpen) {
            answer.style.display = "block";
        }
    });
});