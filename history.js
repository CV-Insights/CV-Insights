// ================= ELEMENTS =================

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const historyItems =
    document.querySelectorAll(".history-item");

const historyList =
    document.getElementById("historyList");

const emptyState =
    document.getElementById("emptyState");

const clearAllBtn =
    document.getElementById("clearAllBtn");

const viewButtons =
    document.querySelectorAll(".view-btn");

const deleteButtons =
    document.querySelectorAll(".delete-btn");

const detailsModal =
    document.getElementById("detailsModal");

const closeModal =
    document.getElementById("closeModal");

const closeDetailsBtn =
    document.getElementById("closeDetailsBtn");


// ================= CURRENT FILTER =================

let currentFilter = "all";


// ================= SEARCH =================

searchInput.addEventListener(
    "input",
    function () {

        filterHistory();

    }
);


// ================= FILTER BUTTONS =================

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            // Remove active class

            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active-filter"
                );

            });


            // Add active class

            this.classList.add(
                "active-filter"
            );


            // Get filter

            currentFilter =
                this.dataset.filter;


            filterHistory();

        }
    );

});


// ================= FILTER FUNCTION =================

function filterHistory() {

    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    let visibleItems = 0;


    document
        .querySelectorAll(".history-item")
        .forEach(item => {


            const name =
                item.dataset.name
                    .toLowerCase();


            const type =
                item.dataset.type;


            const matchesSearch =
                name.includes(searchValue);


            const matchesFilter =
                currentFilter === "all"
                ||
                type === currentFilter;


            if (
                matchesSearch
                &&
                matchesFilter
            ) {

                item.classList.remove(
                    "hidden"
                );

                visibleItems++;

            }

            else {

                item.classList.add(
                    "hidden"
                );

            }

        });


    // Show empty state

    if (visibleItems === 0) {

        emptyState.classList.remove(
            "hidden"
        );

    }

    else {

        emptyState.classList.add(
            "hidden"
        );

    }

}


// ================= VIEW DETAILS =================

viewButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            const title =
                this.dataset.title;

            const score =
                this.dataset.score;

            const type =
                this.dataset.type;


            document.getElementById(
                "modalTitle"
            ).textContent =
                title;


            document.getElementById(
                "modalScore"
            ).textContent =
                score;


            document.getElementById(
                "modalType"
            ).textContent =
                type;


            detailsModal.classList.remove(
                "hidden"
            );

        }
    );

});


// ================= CLOSE MODAL =================

closeModal.addEventListener(
    "click",
    closeDetailsModal
);


closeDetailsBtn.addEventListener(
    "click",
    closeDetailsModal
);


function closeDetailsModal() {

    detailsModal.classList.add(
        "hidden"
    );

}


// ================= CLOSE WHEN CLICKING OUTSIDE =================

detailsModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === detailsModal
        ) {

            closeDetailsModal();

        }

    }
);


// ================= DELETE ITEM =================

document.addEventListener(
    "click",
    function (event) {

        const deleteButton =
            event.target.closest(
                ".delete-btn"
            );


        if (!deleteButton) return;


        const historyItem =
            deleteButton.closest(
                ".history-item"
            );


        if (
            confirm(
                "Are you sure you want to delete this history item?"
            )
        ) {

            historyItem.remove();

            updateStatistics();

            checkEmptyHistory();

        }

    }
);


// ================= CLEAR ALL =================

clearAllBtn.addEventListener(
    "click",
    function () {

        const items =
            document.querySelectorAll(
                ".history-item"
            );


        if (items.length === 0) return;


        const confirmation =
            confirm(
                "Are you sure you want to clear your entire history?"
            );


        if (confirmation) {

            items.forEach(item => {

                item.remove();

            });


            updateStatistics();

            checkEmptyHistory();

        }

    }
);


// ================= EMPTY CHECK =================

function checkEmptyHistory() {

    const items =
        document.querySelectorAll(
            ".history-item"
        );


    if (items.length === 0) {

        emptyState.classList.remove(
            "hidden"
        );


        clearAllBtn.style.display =
            "none";

    }

    else {

        emptyState.classList.add(
            "hidden"
        );


        clearAllBtn.style.display =
            "inline-block";

    }

}


// ================= UPDATE STATISTICS =================

function updateStatistics() {

    const items =
        document.querySelectorAll(
            ".history-item"
        );


    let resumeCount = 0;

    let interviewCount = 0;

    let bestScore = 0;


    items.forEach(item => {


        const type =
            item.dataset.type;


        if (type === "resume") {

            resumeCount++;

        }


        if (type === "interview") {

            interviewCount++;

        }


        const scoreText =
            item
                .querySelector(".score-box strong")
                .textContent;


        const score =
            parseInt(scoreText);


        if (score > bestScore) {

            bestScore = score;

        }

    });


    // Total analyses

    document.getElementById(
        "totalAnalyses"
    ).textContent =
        resumeCount;


    // Interview sessions

    document.getElementById(
        "totalInterviews"
    ).textContent =
        interviewCount;


    // Best score

    document.getElementById(
        "bestScore"
    ).textContent =
        bestScore + "%";

}


// ================= INITIALIZE =================

updateStatistics();

checkEmptyHistory();