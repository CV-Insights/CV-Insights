/*==================================================
            CV INSIGHTS
            INTRO.JS
            PART 1
==================================================*/


/*==================================================
            SELECT ELEMENTS
==================================================*/

const navbar = document.querySelector(".navbar");

const scrollProgress = document.querySelector(".scroll-progress");

const cursor = document.querySelector(".cursor");

const cursorBlur = document.querySelector(".cursor-blur");

const menuToggle = document.querySelector(".menu-toggle");

const navLinks = document.querySelector(".nav-links");

const allLinks = document.querySelectorAll("a[href^='#']");



/*==================================================
            SCROLL PROGRESS BAR
==================================================*/

window.addEventListener("scroll", () => {

    const scrollTop = window.pageYOffset;

    const height =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress = (scrollTop / height) * 100;

    if (scrollProgress) {

        scrollProgress.style.width = progress + "%";

    }

});



/*==================================================
            NAVBAR SCROLL EFFECT
==================================================*/

window.addEventListener("scroll", () => {

    if (!navbar) return;

    if (window.scrollY > 60) {

        navbar.style.background =
            "rgba(255,255,255,.95)";

        navbar.style.boxShadow =
            "0 12px 35px rgba(0,0,0,.08)";

        navbar.style.height = "75px";

    }

    else {

        navbar.style.background =
            "rgba(255,255,255,.85)";

        navbar.style.boxShadow = "none";

        navbar.style.height = "85px";

    }

});



/*==================================================
            CUSTOM CURSOR
==================================================*/

document.addEventListener("mousemove", e => {

    if (!cursor || !cursorBlur) return;

    cursor.style.left = e.clientX + "px";

    cursor.style.top = e.clientY + "px";

    cursorBlur.style.left = e.clientX - 12 + "px";

    cursorBlur.style.top = e.clientY - 12 + "px";

});



/*==================================================
            CURSOR HOVER
==================================================*/

document.querySelectorAll(

"a,button,.feature-card,.template-card"

).forEach(item => {

    item.addEventListener("mouseenter", () => {

        cursor.style.transform =

            "scale(1.8)";

        cursorBlur.style.transform =

            "scale(2.5)";

    });

    item.addEventListener("mouseleave", () => {

        cursor.style.transform =

            "scale(1)";

        cursorBlur.style.transform =

            "scale(1)";

    });

});



/*==================================================
            MOBILE MENU
==================================================*/

if (menuToggle) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        menuToggle.classList.toggle("open");

    });

}



/*==================================================
            CLOSE MENU
==================================================*/

document.querySelectorAll(

".nav-links a"

).forEach(link => {

    link.addEventListener("click", () => {

        if (navLinks) {

            navLinks.classList.remove("active");

        }

        if (menuToggle) {

            menuToggle.classList.remove("open");

        }

    });

});



/*==================================================
            SMOOTH SCROLL
==================================================*/

allLinks.forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target =

            document.querySelector(

                this.getAttribute("href")

            );

        if (!target) return;

        e.preventDefault();

        window.scrollTo({

            top:

                target.offsetTop - 80,

            behavior: "smooth"

        });

    });

});



/*==================================================
            ACTIVE NAVIGATION
==================================================*/

const sections =

document.querySelectorAll("section");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const top =

            section.offsetTop - 150;

        if (pageYOffset >= top) {

            current = section.getAttribute("id");

        }

    });

    document.querySelectorAll(

        ".nav-links a"

    ).forEach(link => {

        link.classList.remove("active");

        if (

            link.getAttribute("href") ===

            "#" + current

        ) {

            link.classList.add("active");

        }

    });

});



/*==================================================
            HERO FLOATING CARD
==================================================*/

const floatingCard =

document.querySelector(".floating-card");

if (floatingCard) {

    let direction = 1;

    let position = 0;

    function floatCard() {

        position += 0.15 * direction;

        if (position > 12) direction = -1;

        if (position < -12) direction = 1;

        floatingCard.style.transform =

            `translateY(${position}px)`;

        requestAnimationFrame(

            floatCard

        );

    }

    floatCard();

}



/*==================================================
            HERO PARALLAX
==================================================*/

const hero =

document.querySelector(".hero");

window.addEventListener("scroll", () => {

    if (!hero) return;

    hero.style.backgroundPositionY =

        window.scrollY * 0.3 + "px";

});



/*==================================================
            INITIALIZE
==================================================*/

window.addEventListener("load", () => {

    document.body.classList.add(

        "loaded"

    );

    console.log(

        "CV Insights Loaded Successfully"

    );

});


/*==================================================
            END PART 1
==================================================*/
/*==================================================
            CV INSIGHTS
            INTRO.JS
            PART 2
==================================================*/


/*==================================================
            COUNTER ANIMATION
==================================================*/

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;

        const target = parseFloat(counter.dataset.target);

        let current = 0;

        const increment = target / 120;

        function updateCounter() {

            current += increment;

            if (current >= target) {

                if (Number.isInteger(target)) {

                    counter.textContent =
                        target.toLocaleString();

                } else {

                    counter.textContent =
                        target.toFixed(1);

                }

                return;

            }

            if (Number.isInteger(target)) {

                counter.textContent =
                    Math.floor(current).toLocaleString();

            } else {

                counter.textContent =
                    current.toFixed(1);

            }

            requestAnimationFrame(updateCounter);

        }

        updateCounter();

        counterObserver.unobserve(counter);

    });

}, {

    threshold: 0.4

});

counters.forEach(counter => {

    counterObserver.observe(counter);

});



/*==================================================
            FEATURE CARD ANIMATION
==================================================*/

const featureCards =

document.querySelectorAll(".feature-card");

featureCards.forEach((card, index) => {

    card.style.transitionDelay =

        `${index * 0.08}s`;

});



/*==================================================
            HERO BUTTON RIPPLE
==================================================*/

document.querySelectorAll(

".primary-btn,.secondary-btn"

).forEach(button => {

    button.addEventListener("click", function (e) {

        const ripple =

            document.createElement("span");

        const rect =

            this.getBoundingClientRect();

        const size =

            Math.max(rect.width, rect.height);

        ripple.style.width =

            ripple.style.height =

            size + "px";

        ripple.style.left =

            e.clientX - rect.left - size / 2 + "px";

        ripple.style.top =

            e.clientY - rect.top - size / 2 + "px";

        ripple.className =

            "ripple";

        this.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        }, 600);

    });

});



/*==================================================
            FLOATING HERO SHAPES
==================================================*/

const heroShapes =

document.querySelectorAll(".hero-circle");

heroShapes.forEach((shape, index) => {

    let angle = index * 100;

    function animateShape() {

        angle += 0.005;

        shape.style.transform =

            `translateY(${Math.sin(angle) * 15}px)
             translateX(${Math.cos(angle) * 10}px)`;

        requestAnimationFrame(animateShape);

    }

    animateShape();

});



/*==================================================
            DASHBOARD CARD TILT
==================================================*/

const dashboard =

document.querySelector(".dashboard-card");

if (dashboard) {

    dashboard.addEventListener(

        "mousemove",

        e => {

            const rect =

                dashboard.getBoundingClientRect();

            const x =

                e.clientX - rect.left;

            const y =

                e.clientY - rect.top;

            const rotateX =

                ((y / rect.height) - 0.5) * -12;

            const rotateY =

                ((x / rect.width) - 0.5) * 12;

            dashboard.style.transform =

                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)`;

        }

    );

    dashboard.addEventListener(

        "mouseleave",

        () => {

            dashboard.style.transform =

                "perspective(900px) rotateX(0) rotateY(0)";

        }

    );

}



/*==================================================
            TEMPLATE CARD HOVER
==================================================*/

document.querySelectorAll(

".template-card"

).forEach(card => {

    card.addEventListener(

        "mouseenter",

        () => {

            card.style.transform =

                "translateY(-15px) scale(1.03)";

        }

    );

    card.addEventListener(

        "mouseleave",

        () => {

            card.style.transform =

                "translateY(0) scale(1)";

        }

    );

});



/*==================================================
            FADE IN ON SCROLL
==================================================*/

const revealItems =

document.querySelectorAll(

".feature-card,.template-card,.timeline-card,.testimonial-card"

);

const revealObserver =

new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add(

                "show"

            );

        }

    });

}, {

    threshold: 0.15

});

revealItems.forEach(item => {

    revealObserver.observe(item);

});



/*==================================================
            MOUSE PARALLAX
==================================================*/

document.addEventListener(

    "mousemove",

    e => {

        heroShapes.forEach((shape, index) => {

            const speed =

                (index + 1) * 0.01;

            const x =

                (window.innerWidth / 2 - e.clientX) * speed;

            const y =

                (window.innerHeight / 2 - e.clientY) * speed;

            shape.style.transform +=

                ` translate(${x}px,${y}px)`;

        });

    }

);



/*==================================================
            HERO TEXT ANIMATION
==================================================*/

const heroTitle =

document.querySelector(".hero-left h1");

if (heroTitle) {

    heroTitle.style.opacity = "0";

    heroTitle.style.transform =

        "translateY(40px)";

    setTimeout(() => {

        heroTitle.style.transition =

            "all .8s ease";

        heroTitle.style.opacity = "1";

        heroTitle.style.transform =

            "translateY(0)";

    }, 300);

}



/*==================================================
            LOGO HOVER
==================================================*/

const logo =

document.querySelector(".logo");

if (logo) {

    logo.addEventListener(

        "mouseenter",

        () => {

            logo.style.transform =

                "scale(1.05)";

        }

    );

    logo.addEventListener(

        "mouseleave",

        () => {

            logo.style.transform =

                "scale(1)";

        }

    );

}


/*==================================================
            END PART 2
==================================================*/

/*==================================================
            CV INSIGHTS
            INTRO.JS
            PART 3
==================================================*/


/*==================================================
            FAQ ACCORDION
==================================================*/

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        faqItems.forEach(faq => {

            if (faq !== item) {

                faq.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});


/*==================================================
            UPLOAD AREA
==================================================*/

const uploadBox = document.querySelector(".upload-box");

const fileInput = document.querySelector("#resumeFile");

const browseBtn = document.querySelector(".browse-btn");

if (browseBtn && fileInput) {

    browseBtn.addEventListener("click", () => {

        fileInput.click();

    });

}

if (fileInput) {

    fileInput.addEventListener("change", function () {

        if (this.files.length > 0) {

            const file = this.files[0];

            uploadBox.classList.add("uploaded");

            uploadBox.querySelector("h3").textContent = file.name;

            uploadBox.querySelector("p").textContent =
                (file.size / 1024).toFixed(1) + " KB";

        }

    });

}


/*==================================================
            DRAG & DROP
==================================================*/

if (uploadBox) {

    ["dragenter","dragover"].forEach(event => {

        uploadBox.addEventListener(event,e=>{

            e.preventDefault();

            uploadBox.classList.add("dragging");

        });

    });

    ["dragleave","dragend"].forEach(event=>{

        uploadBox.addEventListener(event,()=>{

            uploadBox.classList.remove("dragging");

        });

    });

    uploadBox.addEventListener("drop",e=>{

        e.preventDefault();

        uploadBox.classList.remove("dragging");

        if(e.dataTransfer.files.length){

            fileInput.files=e.dataTransfer.files;

            fileInput.dispatchEvent(new Event("change"));

        }

    });

}


/*==================================================
            BUTTON HOVER EFFECT
==================================================*/

document.querySelectorAll(

".primary-btn,.secondary-btn,.template-btn"

).forEach(button=>{

button.addEventListener("mouseenter",()=>{

button.style.transform="translateY(-5px)";

});

button.addEventListener("mouseleave",()=>{

button.style.transform="translateY(0px)";

});

});


/*==================================================
            SECTION REVEAL
==================================================*/

const revealElements=document.querySelectorAll(

".feature-card,.timeline-card,.template-card,.testimonial-card,.stat-card"

);

const revealObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";

}

});

},{threshold:0.2});

revealElements.forEach(element=>{

element.style.opacity="0";

element.style.transform="translateY(60px)";

element.style.transition="all .8s ease";

revealObserver.observe(element);

});


/*==================================================
            TEMPLATE HOVER
==================================================*/

document.querySelectorAll(".template-card").forEach(card=>{

card.addEventListener("mousemove",e=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

const rotateX=((y/rect.height)-0.5)*-8;

const rotateY=((x/rect.width)-0.5)*8;

card.style.transform=

`perspective(900px)
 rotateX(${rotateX}deg)
 rotateY(${rotateY}deg)
 translateY(-8px)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform=

"perspective(900px) rotateX(0) rotateY(0)";

});

});


/*==================================================
            HERO STATS PULSE
==================================================*/

const statBoxes=document.querySelectorAll(".stat-box");

statBoxes.forEach(box=>{

setInterval(()=>{

box.animate([

{transform:"scale(1)"},

{transform:"scale(1.05)"},

{transform:"scale(1)"}

],{

duration:1200,

iterations:1

});

},5000);

});


/*==================================================
            COMPANY LOGO HOVER
==================================================*/

document.querySelectorAll(

".company-slider span"

).forEach(company=>{

company.addEventListener("mouseenter",()=>{

company.style.letterSpacing="1px";

});

company.addEventListener("mouseleave",()=>{

company.style.letterSpacing="0";

});

});


/*==================================================
            SECTION TITLE FADE
==================================================*/

document.querySelectorAll(

".section-heading"

).forEach(title=>{

title.animate([

{

opacity:.6

},

{

opacity:1

}

],{

duration:1500,

iterations:Infinity,

direction:"alternate"

});

});


/*==================================================
            END PART 3
==================================================*/
/*==================================================
            CV INSIGHTS
            INTRO.JS
            PART 4
==================================================*/


/*==================================================
            NEWSLETTER VALIDATION
==================================================*/

const newsletterForm =
document.querySelector(".newsletter");

if(newsletterForm){

newsletterForm.addEventListener("submit",(e)=>{

e.preventDefault();

const email=
newsletterForm.querySelector("input");

const pattern=
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(email.value.trim()===""){

alert("Please enter your email.");

email.focus();

return;

}

if(!pattern.test(email.value)){

alert("Please enter a valid email.");

email.focus();

return;

}

alert("Thank you for subscribing!");

newsletterForm.reset();

});

}



/*==================================================
            FAQ ACCORDION
==================================================*/

const faqItems=
document.querySelectorAll(".faq-item");

faqItems.forEach(item=>{

const question=
item.querySelector(".faq-question");

question.addEventListener("click",()=>{

faqItems.forEach(faq=>{

if(faq!==item){

faq.classList.remove("active");

}

});

item.classList.toggle("active");

});

});



/*==================================================
            TESTIMONIAL AUTO SLIDER
==================================================*/

const testimonialCards=
document.querySelectorAll(".testimonial-card");

let testimonialIndex=0;

function rotateTestimonials(){

testimonialCards.forEach(card=>{

card.style.opacity=".35";

card.style.transform="scale(.95)";

});

testimonialCards[testimonialIndex].style.opacity="1";

testimonialCards[testimonialIndex].style.transform="scale(1)";

testimonialIndex++;

if(testimonialIndex>=testimonialCards.length){

testimonialIndex=0;

}

}

if(testimonialCards.length){

rotateTestimonials();

setInterval(

rotateTestimonials,

3000

);

}



/*==================================================
            FLOATING BUTTON ANIMATION
==================================================*/

document.querySelectorAll(

".primary-btn,.signup-btn"

).forEach(button=>{

button.animate([

{

transform:"translateY(0px)"

},

{

transform:"translateY(-6px)"

},

{

transform:"translateY(0px)"

}

],{

duration:3000,

iterations:Infinity,

easing:"ease-in-out"

});

});



/*==================================================
            FEATURE CARD GLOW
==================================================*/

document.querySelectorAll(

".feature-card"

).forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.boxShadow=

"0 20px 50px rgba(37,99,235,.18)";

});

card.addEventListener("mouseleave",()=>{

card.style.boxShadow="";

});

});



/*==================================================
            DASHBOARD BARS
==================================================*/

const bars=
document.querySelectorAll(

".progress span,.bar span"

);

const progressObserver=

new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const width=

entry.target.style.width;

entry.target.style.width="0";

setTimeout(()=>{

entry.target.style.transition=

"width 2s ease";

entry.target.style.width=width;

},200);

}

});

});

bars.forEach(bar=>{

progressObserver.observe(bar);

});



/*==================================================
            HERO PARALLAX
==================================================*/

const heroCircles=
document.querySelectorAll(".hero-circle");

window.addEventListener("mousemove",(e)=>{

const x=e.clientX/window.innerWidth;

const y=e.clientY/window.innerHeight;

heroCircles.forEach((circle,index)=>{

const speed=(index+1)*25;

circle.style.transform=

`translate(${x*speed}px,
${y*speed}px)`;

});

});



/*==================================================
            PAGE LOADER
==================================================*/

window.addEventListener("load",()=>{

document.body.classList.add("loaded");

const loader=

document.querySelector(".loader");

if(loader){

loader.style.opacity="0";

setTimeout(()=>{

loader.remove();

},600);

}

});



/*==================================================
            SCROLL TO TOP
==================================================*/

const topButton=

document.createElement("button");

topButton.className="top-btn";

topButton.innerHTML=

'<i class="fas fa-arrow-up"></i>';

document.body.appendChild(topButton);

window.addEventListener("scroll",()=>{

if(window.scrollY>500){

topButton.classList.add("show");

}else{

topButton.classList.remove("show");

}

});

topButton.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});



/*==================================================
            LAZY IMAGE FADE
==================================================*/

document.querySelectorAll("img").forEach(img=>{

img.onload=()=>{

img.style.opacity="1";

};

});



/*==================================================
            CONSOLE MESSAGE
==================================================*/

console.log(
"%cCV Insights Loaded Successfully",
"color:#2563EB;font-size:18px;font-weight:bold;"
);



/*==================================================
            PERFORMANCE
==================================================*/

window.addEventListener(

"resize",

()=>{

clearTimeout(window.resizeTimer);

window.resizeTimer=

setTimeout(()=>{

console.log("Layout Updated");

},300);

});



/*==================================================
            INITIALIZATION
==================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

console.log("CV Insights Ready");

});



/*==================================================
            END OF INTRO.JS
==================================================*/