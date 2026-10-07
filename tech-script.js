/* ============================================================
   TECHNICIAN DEPLOYMENT TRACKER
   PHASE 1 PROTOTYPE
   ============================================================ */


/* ============================================================
   SAMPLE DATA
   ============================================================ */

const technicianStores = [

    {
        storeNumber: "0123",
        technician: "Technician A",
        timezone: "EST",
        currentNight: 3,

        tasks: [
            {
                id: 1,
                night: 3,
                description: "Test Network Connectivity",
                status: "In Progress"
            },
            {
                id: 2,
                night: 3,
                description: "Validate Registers",
                status: "Not Started"
            }
        ],

        fixtureHandover: null
    },


    {
        storeNumber: "0456",
        technician: "Technician B",
        timezone: "PST",
        currentNight: 1,

        tasks: [
            {
                id: 3,
                night: 1,
                description: "Install Network Equipment",
                status: "Completed"
            },
            {
                id: 4,
                night: 1,
                description: "Configure POS Terminals",
                status: "In Progress"
            }
        ],

        fixtureHandover: null
    },


    {
        storeNumber: "0789",
        technician: "Technician C",
        timezone: "CST",
        currentNight: 2,

        tasks: [
            {
                id: 5,
                night: 2,
                description: "Install Network Equipment",
                status: "Not Started"
            }
        ],

        fixtureHandover: null
    }

];


/* ============================================================
   CURRENT TECHNICIAN
   ============================================================ */

let loggedInStoreNumber = null;


/* ============================================================
   PAGE LOAD
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        showLoginPage();

    }
);


/* ============================================================
   HELPERS
   ============================================================ */

function getTechnicianStore() {

    return technicianStores.find(
        store =>
            store.storeNumber ===
            loggedInStoreNumber
    );

}


/* ============================================================
   LOGIN
   ============================================================ */

function technicianLogin() {

    const input =
        document.getElementById(
            "storeNumberInput"
        );

    const message =
        document.getElementById(
            "loginMessage"
        );

    if (!input) {
        return;
    }

    const enteredNumber =
        input.value
            .trim()
            .padStart(4, "0");

    const store =
        technicianStores.find(
            item =>
                item.storeNumber ===
                enteredNumber
        );

    if (!store) {

        if (message) {

            message.textContent =
                "Store not found.";

        }

        return;
    }

    loggedInStoreNumber =
        store.storeNumber;

    if (message) {
        message.textContent = "";
    }

    input.value = "";

    showTechnicianPage();

}


/* ============================================================
   SHOW LOGIN
   ============================================================ */

function showLoginPage() {

    const loginPage =
        document.getElementById(
            "loginPage"
        );

    const technicianPage =
        document.getElementById(
            "technicianPage"
        );

    if (loginPage) {
        loginPage.classList.remove(
            "hidden"
        );
    }

    if (technicianPage) {
        technicianPage.classList.add(
            "hidden"
        );
    }

}


/* ============================================================
   SHOW TECHNICIAN PAGE
   ============================================================ */

function showTechnicianPage() {

    const loginPage =
        document.getElementById(
            "loginPage"
        );

    const technicianPage =
        document.getElementById(
            "technicianPage"
        );

    if (loginPage) {
        loginPage.classList.add(
            "hidden"
        );
    }

    if (technicianPage) {
        technicianPage.classList.remove(
            "hidden"
        );
    }

    renderTechnicianDashboard();

}


/* ============================================================
   LOGOUT
   ============================================================ */

function technicianLogout() {

    loggedInStoreNumber =
        null;

    showLoginPage();

}


/* ============================================================
   RENDER DASHBOARD
   ============================================================ */

function renderTechnicianDashboard() {

    const store =
        getTechnicianStore();

    if (!store) {
        return;
    }

    const storeNumber =
        document.getElementById(
            "techStoreNumber"
        );

    const technician =
        document.getElementById(
            "techName"
        );

    const infoNumber =
        document.getElementById(
            "storeInfoNumber"
        );

    const infoTechnician =
        document.getElementById(
            "storeInfoTechnician"
        );

    const infoNight =
        document.getElementById(
            "storeInfoNight"
        );

    const infoTimezone =
        document.getElementById(
            "storeInfoTimezone"
        );

    const nightTitle =
        document.getElementById(
            "currentNightTitle"
        );


    if (storeNumber) {

        storeNumber.textContent =
            `Store ${store.storeNumber}`;

    }

    if (technician) {

        technician.textContent =
            store.technician;

    }

    if (infoNumber) {

        infoNumber.textContent =
            store.storeNumber;

    }

    if (infoTechnician) {

        infoTechnician.textContent =
            store.technician;

    }

    if (infoNight) {

        infoNight.textContent =
            `Night ${store.currentNight}`;

    }

    if (infoTimezone) {

        infoTimezone.textContent =
            store.timezone;

    }

    if (nightTitle) {

        nightTitle.textContent =
            `Night ${store.currentNight}`;

    }


    renderCurrentNightScopes();

    renderFixtureHandover();

}


/* ============================================================
   CURRENT NIGHT SCOPES
   ============================================================ */

function renderCurrentNightScopes() {

    const store =
        getTechnicianStore();

    const container =
        document.getElementById(
            "scopeList"
        );

    const progressSummary =
        document.getElementById(
            "nightProgress"
        );

    if (!store || !container) {
        return;
    }

    container.innerHTML =
        "";


    const currentNightTasks =
        (store.tasks || []).filter(
            task =>
                task.night ===
                store.currentNight
        );


    if (
        currentNightTasks.length ===
        0
    ) {

        container.innerHTML = `
            <div class="empty-scope">
                No deployment scope assigned
                for this night.
            </div>
        `;

        if (progressSummary) {

            progressSummary.textContent =
                "0% Complete";

        }

        return;
    }


    currentNightTasks.forEach(
        task => {

            container.appendChild(
                createTechnicianScope(
                    task
                )
            );

        }
    );


    updateNightProgress(
        currentNightTasks
    );

}


/* ============================================================
   CREATE TECHNICIAN SCOPE
   ============================================================ */

function createTechnicianScope(task) {

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "scope-item";


    const top =
        document.createElement(
            "div"
        );

    top.className =
        "scope-top";


    const description =
        document.createElement(
            "div"
        );

    description.className =
        "scope-description";

    description.textContent =
        task.description;


    const status =
        document.createElement(
            "span"
        );

    status.className =
        `scope-status ${getStatusClass(
            task.status
        )}`;

    status.textContent =
        task.status;


    top.appendChild(
        description
    );

    top.appendChild(
        status
    );


    const controls =
        document.createElement(
            "div"
        );

    controls.className =
        "scope-controls";


    const statuses = [
        "Not Started",
        "In Progress",
        "Completed"
    ];


    statuses.forEach(
        statusValue => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "scope-progress-button";

            button.textContent =
                statusValue;

            if (
                task.status ===
                statusValue
            ) {

                button.classList.add(
                    "active"
                );

            }

            button.onclick =
                function () {

                    updateScopeProgress(
                        task.id,
                        statusValue
                    );

                };

            controls.appendChild(
                button
            );

        }
    );


    item.appendChild(
        top
    );

    item.appendChild(
        controls
    );


    return item;

}


/* ============================================================
   STATUS CLASS
   ============================================================ */

function getStatusClass(status) {

    return status
        .toLowerCase()
        .replaceAll(
            " ",
            "-"
        );

}


/* ============================================================
   UPDATE SCOPE PROGRESS
   ============================================================ */

function updateScopeProgress(
    taskId,
    newStatus
) {

    const store =
        getTechnicianStore();

    if (!store) {
        return;
    }


    const task =
        store.tasks.find(
            item =>
                item.id ===
                taskId
        );


    if (!task) {
        return;
    }


    task.status =
        newStatus;


    showTechnicianMessage(
        `Scope updated to ${newStatus}.`,
        false
    );


    renderCurrentNightScopes();

}


/* ============================================================
   NIGHT PROGRESS
   ============================================================ */

function updateNightProgress(
    tasks
) {

    const progressSummary =
        document.getElementById(
            "nightProgress"
        );

    if (!progressSummary) {
        return;
    }


    if (!tasks.length) {

        progressSummary.textContent =
            "0% Complete";

        return;

    }


    const completed =
        tasks.filter(
            task =>
                task.status ===
                "Completed"
        ).length;


    const percentage =
        Math.round(
            (
                completed /
                tasks.length
            ) * 100
        );


    progressSummary.textContent =
        `${percentage}% Complete`;

}


/* ============================================================
   FIXTURE HANDOVER
   ============================================================ */

function renderFixtureHandover() {

    const store =
        getTechnicianStore();

    const container =
        document.getElementById(
            "handoverContent"
        );

    if (!store || !container) {
        return;
    }


    container.innerHTML =
        "";


    if (
        store.fixtureHandover
    ) {

        const confirmed =
            document.createElement(
                "div"
            );

        confirmed.className =
            "handover-confirmed";

        confirmed.textContent =
            `✓ Fixture handed over at ${formatTime(
                store.fixtureHandover
            )} ${store.timezone}`;

        container.appendChild(
            confirmed
        );

        return;
    }


    const row =
        document.createElement(
            "div"
        );

    row.className =
        "handover-row";


    const inputGroup =
        document.createElement(
            "div"
        );

    inputGroup.className =
        "handover-input-group";


    const label =
        document.createElement(
            "label"
        );

    label.textContent =
        "Time fixture was handed over";


    const input =
        document.createElement(
            "input"
        );

    input.type =
        "time";

    input.id =
        "technicianHandoverTime";


    inputGroup.appendChild(
        label
    );

    inputGroup.appendChild(
        input
    );


    const button =
        document.createElement(
            "button"
        );

    button.type =
        "button";

    button.className =
        "handover-save";

    button.textContent =
        "Confirm Handover";


    button.onclick =
        function () {

            saveFixtureHandover();

        };


    row.appendChild(
        inputGroup
    );

    row.appendChild(
        button
    );


    container.appendChild(
        row
    );

}


/* ============================================================
   SAVE FIXTURE HANDOVER
   ============================================================ */

function saveFixtureHandover() {

    const store =
        getTechnicianStore();

    const input =
        document.getElementById(
            "technicianHandoverTime"
        );

    if (!store || !input) {
        return;
    }


    if (!input.value) {

        showTechnicianMessage(
            "Please enter the fixture handover time.",
            true
        );

        return;

    }


    store.fixtureHandover =
        input.value;


    showTechnicianMessage(
        "Fixture handover confirmed.",
        false
    );


    renderFixtureHandover();

}


/* ============================================================
   FORMAT TIME
   ============================================================ */

function formatTime(
    timeValue
) {

    const parts =
        timeValue.split(":");


    if (parts.length < 2) {
        return timeValue;
    }


    let hour =
        Number(parts[0]);

    const minute =
        parts[1];


    const suffix =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12 || 12;


    return `${hour}:${minute} ${suffix}`;

}


/* ============================================================
   MESSAGE
   ============================================================ */

function showTechnicianMessage(
    message,
    isError
) {

    const element =
        document.getElementById(
            "technicianMessage"
        );

    if (!element) {
        return;
    }


    element.textContent =
        message;

    element.style.color =
        isError
            ? "#b91c1c"
            : "#047857";


    setTimeout(
        function () {

            element.textContent =
                "";

        },
        4000
    );

}
