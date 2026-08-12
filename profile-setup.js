/*==================================================
        PROFILE SETUP
            PART 1
==================================================*/


/*==========================================
        DOM ELEMENTS
==========================================*/

const form = document.getElementById("setupForm");

const steps = document.querySelectorAll(".step");

const nextButtons = document.querySelectorAll(".next-btn");

const prevButtons = document.querySelectorAll(".prev-btn");

const progressFill = document.getElementById("progressFill");

const progressText = document.getElementById("progressText");

const stepList = document.querySelectorAll(".step-list li");

let currentStep = 1;

const totalSteps = 6;



/*==========================================
        SHOW STEP
==========================================*/

function showStep(step){

    steps.forEach(section=>{

        section.classList.remove("active-step");

    });

    document.querySelector(

        `.step[data-step="${step}"]`

    ).classList.add("active-step");

    updateProgress(step);

}



/*==========================================
        UPDATE PROGRESS BAR
==========================================*/

function updateProgress(step){

    const percentage =

        ((step-1)/(totalSteps-1))*100;

    progressFill.style.width =

        percentage + "%";

    progressText.textContent =

        `${step} / ${totalSteps}`;

    stepList.forEach((item,index)=>{

        item.classList.remove("active");

        if(index < step){

            item.classList.add("active");

        }

    });

}



/*==========================================
        VALIDATE CURRENT STEP
==========================================*/

function validateStep(step){

    const currentSection =

        document.querySelector(

            `.step[data-step="${step}"]`

        );

    const requiredFields =

        currentSection.querySelectorAll(

            "input[required], select[required], textarea[required]"

        );

    let valid = true;

    requiredFields.forEach(field=>{

        field.classList.remove("input-error");

        if(field.value.trim()===""){

            valid = false;

            field.classList.add("input-error");

        }

    });

    return valid;

}



/*==========================================
        NEXT BUTTON
==========================================*/

nextButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        if(!validateStep(currentStep)){

            alert(

                "Please complete all required fields."

            );

            return;

        }

        if(currentStep < totalSteps){

            currentStep++;

            showStep(currentStep);

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        }

    });

});



/*==========================================
        PREVIOUS BUTTON
==========================================*/

prevButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        if(currentStep>1){

            currentStep--;

            showStep(currentStep);

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        }

    });

});



/*==========================================
        REMOVE ERROR ON INPUT
==========================================*/

document.querySelectorAll(

"input,textarea,select"

).forEach(field=>{

    field.addEventListener("input",()=>{

        field.classList.remove("input-error");

    });

});



/*==========================================
        INITIALIZE
==========================================*/

showStep(currentStep);


/*==================================================
            END PART 1
==================================================*/
/*==================================================
        PROFILE SETUP
            PART 2
==================================================*/


/*==========================================
        PROFILE IMAGE
==========================================*/

const profileImageInput =
document.getElementById("profileImage");

const profilePreview =
document.getElementById("profilePreview");

const uploadPhotoBtn =
document.querySelector(".upload-photo");


if(uploadPhotoBtn){

    uploadPhotoBtn.addEventListener("click",()=>{

        profileImageInput.click();

    });

}


if(profileImageInput){

    profileImageInput.addEventListener("change",(e)=>{

        const file=e.target.files[0];

        if(!file) return;

        const reader=new FileReader();

        reader.onload=function(event){

            profilePreview.src=event.target.result;

            localStorage.setItem(

                "profileImage",

                event.target.result

            );

        };

        reader.readAsDataURL(file);

    });

}



/*==========================================
        RESUME UPLOAD
==========================================*/

const resumeInput =
document.getElementById("resumeFile");

const uploadResumeBtn =
document.querySelector(".upload-btn");

const resumeName =
document.getElementById("resumeName");


if(uploadResumeBtn){

    uploadResumeBtn.addEventListener("click",()=>{

        resumeInput.click();

    });

}


if(resumeInput){

    resumeInput.addEventListener("change",(e)=>{

        const file=e.target.files[0];

        if(!file) return;

        resumeName.textContent=file.name;

        const resumeData={

            name:file.name,

            size:file.size,

            type:file.type,

            uploaded:new Date().toLocaleString()

        };

        localStorage.setItem(

            "resumeInfo",

            JSON.stringify(resumeData)

        );

    });

}



/*==========================================
        AUTO SAVE FORM
==========================================*/

const allFields=document.querySelectorAll(

"input, textarea, select"

);


allFields.forEach(field=>{

    field.addEventListener("input",saveProfile);

    field.addEventListener("change",saveProfile);

});


function saveProfile(){

    const user={

        firstName:document.getElementById("firstName")?.value||"",

        lastName:document.getElementById("lastName")?.value||"",

        email:document.getElementById("email")?.value||"",

        phone:document.getElementById("phone")?.value||"",

        dob:document.getElementById("dob")?.value||"",

        gender:document.getElementById("gender")?.value||"",

        country:document.getElementById("country")?.value||"",

        state:document.getElementById("state")?.value||"",

        city:document.getElementById("city")?.value||"",

        qualification:document.getElementById("qualification")?.value||"",

        graduationYear:document.getElementById("graduationYear")?.value||"",

        college:document.getElementById("college")?.value||"",

        degree:document.getElementById("degree")?.value||"",

        branch:document.getElementById("branch")?.value||"",

        cgpa:document.getElementById("cgpa")?.value||"",

        class10:document.getElementById("class10")?.value||"",

        class12:document.getElementById("class12")?.value||"",

        currentRole:document.getElementById("currentRole")?.value||"",

        experience:document.getElementById("experience")?.value||"",

        preferredRole:document.getElementById("preferredRole")?.value||"",

        industry:document.getElementById("industry")?.value||"",

        salary:document.getElementById("salary")?.value||"",

        workMode:document.getElementById("workMode")?.value||"",

        summary:document.getElementById("summary")?.value||"",

        technicalSkills:document.getElementById("technicalSkills")?.value||"",

        softSkills:document.getElementById("softSkills")?.value||"",

        languages:document.getElementById("languages")?.value||"",

        certifications:document.getElementById("certifications")?.value||"",

        linkedin:document.getElementById("linkedin")?.value||"",

        github:document.getElementById("github")?.value||"",

        portfolio:document.getElementById("portfolio")?.value||"",

        projects:document.getElementById("projects")?.value||"",

        achievements:document.getElementById("achievements")?.value||""

    };

    localStorage.setItem(

        "cvInsightsUser",

        JSON.stringify(user)

    );

}



/*==========================================
        LOAD SAVED DATA
==========================================*/

function loadProfile(){

    const user=JSON.parse(

        localStorage.getItem("cvInsightsUser")

    );

    if(!user) return;

    Object.keys(user).forEach(key=>{

        const field=document.getElementById(key);

        if(field){

            field.value=user[key];

        }

    });

    const savedImage=

    localStorage.getItem("profileImage");

    if(savedImage){

        profilePreview.src=savedImage;

    }

    const resume=

    JSON.parse(

        localStorage.getItem("resumeInfo")

    );

    if(resume){

        resumeName.textContent=

        resume.name;

    }

}


loadProfile();


/*==================================================
            END PART 2
==================================================*/
/*==================================================
        PROFILE SETUP
            PART 3
==================================================*/


/*==========================================
        REVIEW PAGE
==========================================*/

function populateReview(){

    const user = JSON.parse(

        localStorage.getItem("cvInsightsUser")

    );

    if(!user) return;

    const set = (id,value)=>{

        const element = document.getElementById(id);

        if(element){

            element.textContent = value || "-";

        }

    };

    set(

        "reviewName",

        `${user.firstName} ${user.lastName}`

    );

    set(

        "reviewRole",

        user.currentRole

    );

    set(

        "reviewEmail",

        user.email

    );

    set(

        "reviewPhone",

        user.phone

    );

    set(

        "reviewCountry",

        user.country

    );

    set(

        "reviewCity",

        user.city

    );

    set(

        "reviewCollege",

        user.college

    );

    set(

        "reviewDegree",

        user.degree

    );

    set(

        "reviewExperience",

        user.experience + " Years"

    );

    set(

        "reviewSkills",

        user.technicalSkills

    );

    const savedImage =

    localStorage.getItem("profileImage");

    if(savedImage){

        document.getElementById(

            "reviewImage"

        ).src = savedImage;

    }

}



/*==========================================
        REVIEW WHEN STEP 6 OPENS
==========================================*/

nextButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        if(currentStep===6){

            populateReview();

        }

    });

});



/*==========================================
        FINISH BUTTON
==========================================*/

const finishButton =

document.querySelector(".finish-btn");

const successModal =

document.getElementById("successModal");

const dashboardButton =

document.getElementById("goDashboard");


if(finishButton){

finishButton.addEventListener("click",(e)=>{

e.preventDefault();

saveProfile();

populateReview();

successModal.classList.add("active");

});

}



/*==========================================
        DASHBOARD REDIRECT
==========================================*/

if(dashboardButton){

dashboardButton.addEventListener("click",()=>{

window.location.href="dashboard.html";

});

}



/*==========================================
        AUTO CREATE PROFILE DATA
==========================================*/

function createProfile(){

const user = JSON.parse(

localStorage.getItem(

"cvInsightsUser"

)

);

if(!user) return;

const profile={

name:user.firstName+" "+user.lastName,

email:user.email,

phone:user.phone,

city:user.city,

country:user.country,

college:user.college,

degree:user.degree,

role:user.currentRole,

skills:user.technicalSkills,

linkedin:user.linkedin,

github:user.github,

portfolio:user.portfolio,

summary:user.summary

};

localStorage.setItem(

"profile",

JSON.stringify(profile)

);

}

createProfile();



/*==========================================
        PROFILE COMPLETION
==========================================*/

function calculateCompletion(){

const user=JSON.parse(

localStorage.getItem(

"cvInsightsUser"

)

);

if(!user) return;

let total=0;

let completed=0;

Object.keys(user).forEach(key=>{

total++;

if(user[key]!=""){

completed++;

}

});

const percentage=Math.round(

(completed/total)*100

);

localStorage.setItem(

"profileCompletion",

percentage

);

}

calculateCompletion();



/*==========================================
        LAST UPDATED
==========================================*/

localStorage.setItem(

"profileLastUpdated",

new Date().toLocaleString()

);



/*==========================================
        SAVE FLAG
==========================================*/

localStorage.setItem(

"profileSetup",

"completed"

);



/*==================================================
            END PART 3
==================================================*/


/*==================================================
        PROFILE SETUP
            PART 4
==================================================*/


/*==========================================
        EDIT PROFILE MODE
==========================================*/

function checkProfileSetup(){

    const completed = localStorage.getItem("profileSetup");

    if(completed==="completed"){

        console.log("Profile already exists.");

    }

}

checkProfileSetup();



/*==========================================
        IMAGE VALIDATION
==========================================*/

if(profileImageInput){

profileImageInput.addEventListener("change",(e)=>{

const file=e.target.files[0];

if(!file) return;

const allowed=["image/png","image/jpeg","image/jpg"];

if(!allowed.includes(file.type)){

alert("Please upload PNG or JPG image.");

profileImageInput.value="";

return;

}

if(file.size>2*1024*1024){

alert("Image size should be below 2 MB.");

profileImageInput.value="";

return;

}

});

}



/*==========================================
        RESUME VALIDATION
==========================================*/

if(resumeInput){

resumeInput.addEventListener("change",(e)=>{

const file=e.target.files[0];

if(!file) return;

const extensions=[

"application/pdf",

"application/msword",

"application/vnd.openxmlformats-officedocument.wordprocessingml.document"

];

if(!extensions.includes(file.type)){

alert("Upload only PDF, DOC or DOCX.");

resumeInput.value="";

resumeName.textContent="No file selected";

return;

}

if(file.size>5*1024*1024){

alert("Resume should be below 5 MB.");

resumeInput.value="";

resumeName.textContent="No file selected";

return;

}

});

}



/*==========================================
        KEYBOARD SHORTCUTS
==========================================*/

document.addEventListener("keydown",(e)=>{

if(e.key==="ArrowRight"){

if(currentStep<totalSteps){

currentStep++;

showStep(currentStep);

}

}

if(e.key==="ArrowLeft"){

if(currentStep>1){

currentStep--;

showStep(currentStep);

}

}

});



/*==========================================
        AUTO SAVE MESSAGE
==========================================*/

const saveMessage=document.createElement("div");

saveMessage.className="save-message";

saveMessage.textContent="✔ Changes Saved";

document.body.appendChild(saveMessage);

function showSaveMessage(){

saveMessage.classList.add("show");

setTimeout(()=>{

saveMessage.classList.remove("show");

},1800);

}

allFields.forEach(field=>{

field.addEventListener("change",()=>{

saveProfile();

showSaveMessage();

});

});



/*==========================================
        FORM RESET
==========================================*/

function clearProfile(){

localStorage.removeItem("cvInsightsUser");

localStorage.removeItem("profile");

localStorage.removeItem("profileImage");

localStorage.removeItem("resumeInfo");

localStorage.removeItem("profileCompletion");

localStorage.removeItem("profileSetup");

localStorage.removeItem("profileLastUpdated");

}



/*==========================================
        PAGE LEAVE WARNING
==========================================*/

let formChanged=false;

allFields.forEach(field=>{

field.addEventListener("input",()=>{

formChanged=true;

});

});

window.addEventListener("beforeunload",(e)=>{

if(formChanged){

e.preventDefault();

e.returnValue="";

}

});



/*==========================================
        PROFILE SUMMARY
==========================================*/

function getProfileSummary(){

const user=JSON.parse(

localStorage.getItem("cvInsightsUser")

);

if(!user) return;

console.table({

Name:user.firstName+" "+user.lastName,

Email:user.email,

Phone:user.phone,

College:user.college,

Role:user.currentRole,

Skills:user.technicalSkills

});

}

getProfileSummary();



/*==========================================
        DASHBOARD DATA
==========================================*/

window.cvInsightsUser=

JSON.parse(

localStorage.getItem(

"cvInsightsUser"

)

);



/*==========================================
        INITIALIZATION
==========================================*/

document.addEventListener("DOMContentLoaded",()=>{

loadProfile();

showStep(currentStep);

calculateCompletion();

console.log(

"CV Insights Profile Wizard Ready"

);

});



/*==========================================
        END
==========================================*/