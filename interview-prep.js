const questions = [

    // ================= HR QUESTIONS =================

    {
        type: "subjective",
        section: "HR ROUND",
        step: 1,

        question:
            "Tell me about yourself.",

        tip:
            "Focus on your education, technical skills, projects, achievements and career goals.",

        keywords: [
            "student",
            "skills",
            "project",
            "experience",
            "learning",
            "career"
        ]
    },

    {
        type: "subjective",
        section: "HR ROUND",
        step: 1,

        question:
            "What are your greatest strengths?",

        tip:
            "Mention strengths that are relevant to the job role and support them with examples.",

        keywords: [
            "communication",
            "team",
            "problem",
            "learning",
            "leadership",
            "adapt"
        ]
    },

    {
        type: "subjective",
        section: "HR ROUND",
        step: 1,

        question:
            "Why should we hire you?",

        tip:
            "Connect your skills and abilities directly with the company's requirements.",

        keywords: [
            "skills",
            "experience",
            "contribute",
            "team",
            "learning",
            "value"
        ]
    },


    // ================= JOB ROLE QUESTIONS =================

    {
        type: "subjective",
        section: "JOB ROLE QUESTIONS",
        step: 2,

        question:
            "Explain the difference between frontend and backend development.",

        tip:
            "Clearly explain client-side and server-side responsibilities.",

        keywords: [
            "frontend",
            "backend",
            "client",
            "server",
            "database",
            "api"
        ]
    },

    {
        type: "subjective",
        section: "JOB ROLE QUESTIONS",
        step: 2,

        question:
            "What happens when you enter a URL into a browser?",

        tip:
            "Try explaining DNS, server request, HTTP/HTTPS and browser rendering.",

        keywords: [
            "dns",
            "server",
            "request",
            "http",
            "browser",
            "response"
        ]
    },


    // ================= MCQ =================

    {
        type: "mcq",
        section: "MCQ ROUND",
        step: 3,

        question:
            "Which data structure follows the LIFO principle?",

        options: [
            "Queue",
            "Stack",
            "Linked List",
            "Tree"
        ],

        correct: 1
    },

    {
        type: "mcq",
        section: "MCQ ROUND",
        step: 3,

        question:
            "Which keyword is used to declare a constant in JavaScript?",

        options: [
            "var",
            "let",
            "const",
            "static"
        ],

        correct: 2
    },

    {
        type: "mcq",
        section: "MCQ ROUND",
        step: 3,

        question:
            "Which HTTP status code means 'Not Found'?",

        options: [
            "200",
            "301",
            "404",
            "500"
        ],

        correct: 2
    },


    // ================= SUBJECTIVE =================

    {
        type: "subjective",
        section: "SUBJECTIVE ROUND",
        step: 4,

        question:
            "Explain what Object-Oriented Programming is and describe its main principles.",

        tip:
            "Try explaining encapsulation, inheritance, polymorphism and abstraction.",

        keywords: [
            "object",
            "class",
            "encapsulation",
            "inheritance",
            "polymorphism",
            "abstraction"
        ]
    },

    {
        type: "subjective",
        section: "SUBJECTIVE ROUND",
        step: 4,

        question:
            "Describe a challenging project or problem you worked on and explain how you solved it.",

        tip:
            "Use the STAR method: Situation, Task, Action and Result.",

        keywords: [
            "problem",
            "solution",
            "team",
            "challenge",
            "result",
            "project"
        ]
    }

];



let currentQuestion = 0;

let answers = [];

let selectedOption = null;



const questionText =
    document.getElementById("questionText");

const category =
    document.getElementById("category");

const questionTip =
    document.getElementById("questionTip");

const answerInput =
    document.getElementById("answerInput");

const subjectiveArea =
    document.getElementById("subjectiveArea");

const mcqArea =
    document.getElementById("mcqArea");

const nextBtn =
    document.getElementById("nextBtn");

const prevBtn =
    document.getElementById("prevBtn");

const questionCounter =
    document.getElementById("questionCounter");

const progressText =
    document.getElementById("progressText");

const progressNumber =
    document.getElementById("progressNumber");

const wordCount =
    document.getElementById("wordCount");



/* LOAD QUESTION */

function loadQuestion() {

    const question =
        questions[currentQuestion];


    questionText.textContent =
        question.question;


    category.textContent =
        question.section;


    questionCounter.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;


    const progress =
        Math.round(
            ((currentQuestion + 1) / questions.length) * 100
        );


    progressText.textContent =
        progress + "%";


    progressNumber.textContent =
        progress + "%";


    updateSteps(question.step);


    if (question.type === "mcq") {

        subjectiveArea.classList.add("hidden");

        mcqArea.classList.remove("hidden");


        questionTip.textContent =
            "Select the most appropriate answer.";


        for (let i = 0; i < 4; i++) {

            document.getElementById(
                `option${i}`
            ).textContent =
                question.options[i];

        }


        selectedOption =
            answers[currentQuestion] ?? null;


        document
            .querySelectorAll(".option")
            .forEach(option => {

                option.classList.remove(
                    "selected"
                );

            });


        if (selectedOption !== null) {

            document
                .querySelector(
                    `[data-option="${selectedOption}"]`
                )
                .classList.add("selected");

        }

    }

    else {

        subjectiveArea.classList.remove("hidden");

        mcqArea.classList.add("hidden");


        questionTip.textContent =
            "Tip: " + question.tip;


        answerInput.value =
            answers[currentQuestion] || "";


        updateWordCount();

    }


    prevBtn.style.visibility =
        currentQuestion === 0
            ? "hidden"
            : "visible";


    nextBtn.innerHTML =
        currentQuestion === questions.length - 1
            ? `Finish Interview <i class="fa-solid fa-check"></i>`
            : `Save & Next <i class="fa-solid fa-arrow-right"></i>`;



    updateStatus();

}



/* UPDATE STEPS */

function updateSteps(currentStep) {

    for (let i = 1; i <= 4; i++) {

        const step =
            document.getElementById(`step${i}`);


        if (i <= currentStep) {

            step.classList.add(
                "active-step"
            );

        }

        else {

            step.classList.remove(
                "active-step"
            );

        }

    }

}



/* MCQ OPTION CLICK */

document
    .querySelectorAll(".option")
    .forEach(option => {

        option.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".option")
                    .forEach(item => {

                        item.classList.remove(
                            "selected"
                        );

                    });


                this.classList.add(
                    "selected"
                );


                selectedOption =
                    Number(
                        this.dataset.option
                    );

            }
        );

    });



/* SAVE ANSWER */

function saveAnswer() {

    const question =
        questions[currentQuestion];


    if (question.type === "mcq") {

        if (selectedOption === null) {

            alert(
                "Please select an answer."
            );

            return false;

        }


        answers[currentQuestion] =
            selectedOption;

    }

    else {

        const answer =
            answerInput.value.trim();


        if (answer.length < 10) {

            alert(
                "Please write a more detailed answer."
            );

            return false;

        }


        answers[currentQuestion] =
            answer;

    }


    return true;

}



/* NEXT QUESTION */

nextBtn.addEventListener(
    "click",
    function () {

        const saved =
            saveAnswer();


        if (!saved) return;


        if (
            currentQuestion <
            questions.length - 1
        ) {

            currentQuestion++;

            loadQuestion();

        }

        else {

            calculateFinalScore();

        }

    }
);



/* PREVIOUS QUESTION */

prevBtn.addEventListener(
    "click",
    function () {

        if (currentQuestion > 0) {

            currentQuestion--;

            loadQuestion();

        }

    }
);



/* WORD COUNT */

answerInput.addEventListener(
    "input",
    updateWordCount
);


function updateWordCount() {

    const text =
        answerInput.value.trim();


    if (text === "") {

        wordCount.textContent = 0;

        return;

    }


    wordCount.textContent =
        text.split(/\s+/).length;

}



/* KEYWORD-BASED SUBJECTIVE EVALUATION */

function evaluateSubjective(
    answer,
    keywords
) {

    const text =
        answer.toLowerCase();


    let matched = 0;


    keywords.forEach(keyword => {

        if (
            text.includes(
                keyword.toLowerCase()
            )
        ) {

            matched++;

        }

    });


    const keywordScore =
        (matched / keywords.length) * 70;


    const wordCount =
        answer.trim()
            .split(/\s+/)
            .length;


    let lengthScore = 0;


    if (wordCount >= 40) {

        lengthScore = 30;

    }

    else if (wordCount >= 25) {

        lengthScore = 20;

    }

    else if (wordCount >= 15) {

        lengthScore = 10;

    }


    return Math.min(
        Math.round(
            keywordScore + lengthScore
        ),
        100
    );

}



/* CALCULATE SCORE */

function calculateFinalScore() {

    let hrScores = [];

    let roleScores = [];

    let mcqScores = [];

    let subjectiveScores = [];


    questions.forEach(
        (question, index) => {

            let score = 0;


            if (
                question.type === "mcq"
            ) {

                score =
                    answers[index] ===
                    question.correct
                        ? 100
                        : 0;

            }

            else {

                score =
                    evaluateSubjective(
                        answers[index],
                        question.keywords
                    );

            }


            if (
                question.step === 1
            ) {

                hrScores.push(score);

            }

            else if (
                question.step === 2
            ) {

                roleScores.push(score);

            }

            else if (
                question.step === 3
            ) {

                mcqScores.push(score);

            }

            else if (
                question.step === 4
            ) {

                subjectiveScores.push(score);

            }

        }
    );


    const average = array => {

        if (array.length === 0)
            return 0;


        return Math.round(

            array.reduce(
                (a, b) => a + b,
                0
            )

            / array.length

        );

    };


    const hrScore =
        average(hrScores);

    const roleScore =
        average(roleScores);

    const mcqScore =
        average(mcqScores);

    const subjectiveScore =
        average(subjectiveScores);



    /* FINAL WEIGHTED SCORE */

    const finalScore =
        Math.round(

            (hrScore * 0.25) +

            (roleScore * 0.30) +

            (mcqScore * 0.20) +

            (subjectiveScore * 0.25)

        );


    document.getElementById(
        "finalScore"
    ).textContent =
        finalScore + "%";


    document.getElementById(
        "finalHrScore"
    ).textContent =
        hrScore + "%";


    document.getElementById(
        "finalRoleScore"
    ).textContent =
        roleScore + "%";


    document.getElementById(
        "finalMcqScore"
    ).textContent =
        mcqScore + "%";


    document.getElementById(
        "finalSubjectiveScore"
    ).textContent =
        subjectiveScore + "%";


    let message = "";


    if (finalScore >= 85) {

        message =
            "Excellent! You are highly prepared for your interview.";

    }

    else if (finalScore >= 70) {

        message =
            "Great job! You have a strong foundation. Practice a little more.";

    }

    else if (finalScore >= 50) {

        message =
            "Good effort! Focus on improving weak areas before your interview.";

    }

    else {

        message =
            "Keep practicing. Review the concepts and improve your answer structure.";

    }


    document.getElementById(
        "scoreMessage"
    ).textContent =
        message;


    document.getElementById(
        "liveScore"
    ).innerHTML =
        finalScore +
        "<span>%</span>";


    document.getElementById(
        "resultModal"
    ).classList.remove(
        "hidden"
    );

}



/* UPDATE RIGHT PANEL STATUS */

function updateStatus() {

    let hrCompleted = 0;
    let roleCompleted = 0;
    let mcqCompleted = 0;
    let subjectiveCompleted = 0;


    answers.forEach(
        (answer, index) => {

            if (
                answer === undefined
            ) return;


            if (
                questions[index].step === 1
            ) {

                hrCompleted++;

            }

            else if (
                questions[index].step === 2
            ) {

                roleCompleted++;

            }

            else if (
                questions[index].step === 3
            ) {

                mcqCompleted++;

            }

            else if (
                questions[index].step === 4
            ) {

                subjectiveCompleted++;

            }

        }
    );


    document.getElementById(
        "hrStatus"
    ).textContent =
        `${hrCompleted} / 3`;


    document.getElementById(
        "roleStatus"
    ).textContent =
        `${roleCompleted} / 2`;


    document.getElementById(
        "mcqStatus"
    ).textContent =
        `${mcqCompleted} / 3`;


    document.getElementById(
        "subjectiveStatus"
    ).textContent =
        `${subjectiveCompleted} / 2`;

}



/* CLOSE MODAL */

document.getElementById(
    "closeModal"
).addEventListener(
    "click",
    function () {

        document.getElementById(
            "resultModal"
        ).classList.add(
            "hidden"
        );

    }
);



/* RESTART */

document.getElementById(
    "restartBtn"
).addEventListener(
    "click",
    function () {

        currentQuestion = 0;

        answers = [];

        selectedOption = null;


        document.getElementById(
            "resultModal"
        ).classList.add(
            "hidden"
        );


        document.getElementById(
            "liveScore"
        ).innerHTML =
            `0<span>%</span>`;


        loadQuestion();

    }
);



/* START */

loadQuestion();