// ===============================
// SAVE ACCOUNT CHANGES
// ===============================

const saveAccountBtn = document.getElementById("saveAccountBtn");

saveAccountBtn.addEventListener("click", function () {

    const name = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const location = document.getElementById("location").value;

    if (name === "" || email === "") {
        alert("Please enter your name and email.");
        return;
    }

    // Save data in browser
    localStorage.setItem("fullName", name);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
    localStorage.setItem("location", location);

    alert("Account details saved successfully!");
});


// ===============================
// CHANGE PASSWORD
// ===============================

const changePasswordBtn = document.getElementById("changePasswordBtn");

changePasswordBtn.addEventListener("click", function () {

    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmNewPassword").value;


    if (currentPassword === "" ||
        newPassword === "" ||
        confirmPassword === "") {

        alert("Please fill all password fields.");
        return;
    }


    if (newPassword !== confirmPassword) {

        alert("New passwords do not match!");
        return;
    }


    if (newPassword.length < 6) {

        alert("Password must contain at least 6 characters.");
        return;
    }


    alert("Password updated successfully!");

    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmNewPassword").value = "";
});


// ===============================
// DARK MODE
// ===============================

const darkMode = document.getElementById("darkMode");

darkMode.addEventListener("change", function () {

    if (darkMode.checked) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

});


// ===============================
// COMPACT MODE
// ===============================

const compactMode = document.getElementById("compactMode");

compactMode.addEventListener("change", function () {

    if (compactMode.checked) {
        document.body.classList.add("compact-mode");
    } else {
        document.body.classList.remove("compact-mode");
    }

});


// ===============================
// DELETE ACCOUNT
// ===============================

const deleteAccountBtn =
    document.getElementById("deleteAccountBtn");

deleteAccountBtn.addEventListener("click", function () {

    const confirmDelete =
        confirm("Are you sure you want to delete your account?");

    if (confirmDelete) {

        localStorage.clear();

        alert("Account deleted successfully!");

        window.location.href = "login.html";
    }

});


// ===============================
// LOGOUT
// ===============================

const logoutBtn =
    document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        window.location.href = "login.html";
    }

});


// ===============================
// LOAD SAVED ACCOUNT DATA
// ===============================

window.addEventListener("load", function () {

    const savedName = localStorage.getItem("fullName");
    const savedEmail = localStorage.getItem("email");
    const savedPhone = localStorage.getItem("phone");
    const savedLocation = localStorage.getItem("location");


    if (savedName) {
        document.getElementById("fullName").value = savedName;
    }

    if (savedEmail) {
        document.getElementById("email").value = savedEmail;
    }

    if (savedPhone) {
        document.getElementById("phone").value = savedPhone;
    }

    if (savedLocation) {
        document.getElementById("location").value = savedLocation;
    }

});