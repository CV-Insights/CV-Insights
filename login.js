const togglePassword =
document.getElementById("togglePassword");

const password =
document.getElementById("password");

togglePassword.onclick = function(){

if(password.type==="password"){

password.type="text";

togglePassword.classList.remove("fa-eye");

togglePassword.classList.add("fa-eye-slash");

}

else{

password.type="password";

togglePassword.classList.remove("fa-eye-slash");

togglePassword.classList.add("fa-eye");

}

}

// Login Button

document.getElementById("loginBtn").onclick=function(){

let email=document.getElementById("email").value;

let pass=document.getElementById("password").value;

if(email==="" || pass===""){

alert("Please fill all fields.");

return;

}

this.innerHTML="Logging In...";

setTimeout(()=>{

    const profileCompleted =
        localStorage.getItem("profileSetup");

    if(profileCompleted === "completed"){

        window.location.href = "dashboard.html";

    }
    else{

        window.location.href = "profile-setup.html";

    }

},1200);
};