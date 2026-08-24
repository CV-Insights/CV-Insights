// Password show / hide
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {
        password.type = "text";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    } else {
        password.type = "password";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    }

});


// Confirm Password show / hide
const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

const confirmPassword =
    document.getElementById("confirmPassword");

toggleConfirmPassword.addEventListener("click", function () {

    if (confirmPassword.type === "password") {
        confirmPassword.type = "text";

        toggleConfirmPassword.classList.remove("fa-eye");
        toggleConfirmPassword.classList.add("fa-eye-slash");

    } else {
        confirmPassword.type = "password";

        toggleConfirmPassword.classList.remove("fa-eye-slash");
        toggleConfirmPassword.classList.add("fa-eye");
    }

});


// Signup button
const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", function () {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;
    const terms = document.getElementById("terms").checked;


    // Check name
    if (name === "") {
        alert("Please enter your name.");
        return;
    }


    // Check email
    if (email === "") {
        alert("Please enter your email address.");
        return;
    }


    // Check password
    if (passwordValue === "") {
        alert("Please enter a password.");
        return;
    }


    // Check confirm password
    if (confirmPasswordValue === "") {
        alert("Please confirm your password.");
        return;
    }


    // Check password match
    if (passwordValue !== confirmPasswordValue) {
        alert("Passwords do not match.");
        return;
    }


    // Check terms
    if (!terms) {
        alert("Please agree to the Terms & Conditions.");
        return;
    }


    // Successful signup
    alert("Account created successfully!");

    window.location.href = "profile-setup.html";

});