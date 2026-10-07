/* ============================================================
   TECHNICIAN DEPLOYMENT TRACKER
   PHASE 1 PROTOTYPE
   ============================================================ */


/* ============================================================
   SAMPLE TECHNICIAN DATA
   ============================================================ */

const technicianStores = [

    {
        storeNumber: "0123",

        technician: "Technician A",

        timezone: "EST",

        currentNight: 1,


        /* ====================================================
           CURRENT NIGHT SCOPES
           ==================================================== */

        tasks: [

            {
                id: 1,
                night: 1,
                description:
                    "Install Register 1 to new HCS",
                status:
                    "Not Started",
                note:
                    ""
            },

            {
                id: 2,
                night: 1,
                description:
                    "Install Register 2 to new HCS",
                status:
                    "Not Started",
                note:
                    ""
            },

            {
                id: 3,
                night: 1,
                description:
                    "Test Register 1",
                status:
                    "Not Started",
                note:
                    ""
            }

        ],


        /* ====================================================
           EQUIPMENT CHECKLIST
           ==================================================== */

        equipment: [

            {
                id: 1,
                name: "Register 1",
                status: "Complete",
                note: ""
            },

            {
                id: 2,
                name: "Register 2",
                status: "Complete",
                note: ""
            },

            {
                id: 3,
                name: "HCS",
                status: "Complete",
                note: ""
            },

            {
                id: 4,
                name: "Pinpad",
                status: "Missing",
                note:
                    "Missing pinpad cable"
            },

            {
                id: 5,
                name: "Scanner",
                status: "Complete",
                note: ""
            },

            {
                id: 6,
                name: "Receipt Printer",
                status: "Incomplete",
                note:
                    "Power cable missing"
            },

            {
                id: 7,
                name: "Network Switch",
                status: "Complete",
                note: ""
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
                id: 10,
                night: 1,
                description:
                    "Install Network Equipment",
                status:
                    "Completed",
                note:
                    ""
            },

            {
                id: 11,
                night: 1,
                description:
                    "Configure POS Terminals",
                status:
                    "In Progress",
                note:
                    ""
            }

        ],

        equipment: [

            {
                id: 10,
                name: "Register 1",
                status: "Complete",
                note: ""
            },

            {
                id: 11,
                name: "Register 2",
                status: "Complete",
                note: ""
            },

            {
                id: 12,
                name: "HCS",
                status: "Complete",
                note: ""
            },

            {
                id: 13,
                name: "Pinpad",
                status: "Complete",
                note: ""
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
                id: 20,
                night: 2,
                description:
                    "Install Network Equipment",
                status:
                    "Not Started",
                note:
                    ""
            }

        ],

        equipment: [

            {
                id: 20,
                name: "Register 1",
                status: "Complete",
                note: ""
            },

            {
                id: 21,
                name: "Register 2",
                status: "Complete",
                note: ""
            },

            {
                id: 22,
                name: "HCS",
                status: "Complete",
                note: ""
            },

            {
                id: 23,
                name: "Pinpad",
                status: "Complete",
                note: ""
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
   GET STORE
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

        message.textContent =
            "";

    }


    input.value =
        "";


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
   DASHBOARD
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


    renderEquipmentChecklist();

    renderCurrentNightScopes();

    renderFixtureHandover();

}


/* ============================================================
   EQUIPMENT CHECKLIST
   ============================================================ */

function renderEquipmentChecklist() {

    const store =
        getTechnicianStore();

    const container =
        document.getElementById(
            "equipmentList"
        );

    const summary =
        document.getElementById(
            "equipmentSummary"
        );


    if (!store || !container) {
        return;
    }


    container.innerHTML =
        "";


    const equipment =
        store.equipment || [];


    if (equipment.length === 0) {

        container.innerHTML = `
            <div class="empty-equipment">
                No equipment checklist assigned.
            </div>
        `;

        if (summary) {

            summary.textContent =
                "0 of 0 complete";

        }

        return;
    }


    equipment.forEach(
        item => {

            container.appendChild(
                createEquipmentElement(
                    item
                )
            );

        }
    );


    updateEquipmentSummary();

}


/* ============================================================
   CREATE EQUIPMENT ITEM
   ============================================================ */

function createEquipmentElement(
    item
) {

    const element =
        document.createElement(
            "div"
        );

    element.className =
        "equipment-item";


    const main =
        document.createElement(
            "div"
        );

    main.className =
        "equipment-main";


    const name =
        document.createElement(
            "div"
        );

    name.className =
        "equipment-name";

    name.textContent =
        item.name;


    const status =
        document.createElement(
            "select"
        );

    status.className =
        `equipment-status ${getEquipmentStatusClass(
            item.status
        )}`;


    [
        "Complete",
        "Missing",
        "Incomplete"
    ].forEach(
        statusValue => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                statusValue;

            option.textContent =
                statusValue;

            if (
                item.status ===
                statusValue
            ) {

                option.selected =
                    true;

            }

            status.appendChild(
                option
            );

        }
    );


    status.onchange =
        function () {

            updateEquipmentStatus(
                item.id,
                status.value
            );

        };


    main.appendChild(
        name
    );

    main.appendChild(
        status
    );


    element.appendChild(
        main
    );


    const noteButton =
        document.createElement(
            "button"
        );

    noteButton.type =
        "button";

    noteButton.className =
        "equipment-note-button";

    noteButton.textContent =
        item.note
            ? "Edit Note"
            : "＋ Add Note";


    noteButton.onclick =
        function () {

            editEquipmentNote(
                item.id
            );

        };


    element.appendChild(
        noteButton
    );


    if (item.note) {

        const note =
            document.createElement(
                "div"
            );

        note.className =
            "equipment-note";

        note.textContent =
            item.note;

        element.appendChild(
            note
        );

    }


    return element;

}


/* ============================================================
   EQUIPMENT STATUS CLASS
   ============================================================ */

function getEquipmentStatusClass(
    status
) {

    return status
        .toLowerCase()
        .replaceAll(
            " ",
            "-"
        );

}


/* ============================================================
   UPDATE EQUIPMENT STATUS
   ============================================================ */

function updateEquipmentStatus(
    equipmentId,
    newStatus
) {

    const store =
        getTechnicianStore();

    if (!store) {
        return;
    }


    const item =
        store.equipment.find(
            equipment =>
                equipment.id ===
                equipmentId
        );


    if (!item) {
        return;
    }


    item.status =
        newStatus;


    renderEquipmentChecklist();


    showTechnicianMessage(
        `${item.name} marked as ${newStatus}.`,
        false
    );

}


/* ============================================================
   EQUIPMENT NOTE
   ============================================================ */

function editEquipmentNote(
    equipmentId
) {

    const store =
        getTechnicianStore();

    if (!store) {
        return;
    }


    const item =
        store.equipment.find(
            equipment =>
                equipment.id ===
                equipmentId
        );


    if (!item) {
        return;
    }


    const note =
        prompt(
            `Add note for ${item.name}:`,
            item.note || ""
        );


    if (note === null) {
        return;
    }


    item.note =
        note.trim();


    renderEquipmentChecklist();


    showTechnicianMessage(
        item.note
            ? "Equipment note saved."
            : "Equipment note cleared.",
        false
    );

}


/* ============================================================
   EQUIPMENT SUMMARY
   ============================================================ */

function updateEquipmentSummary() {

    const store =
        getTechnicianStore();

    const summary =
        document.getElementById(
            "equipmentSummary"
        );


    if (!store || !summary) {
        return;
    }


    const equipment =
        store.equipment || [];


    const complete =
        equipment.filter(
            item =>
                item.status ===
                "Complete"
        ).length;


    summary.textContent =
        `${complete} of ${equipment.length} complete`;

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
   CREATE SCOPE
   ============================================================ */

function createTechnicianScope(
    task
) {

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


    item.appendChild(
        top
    );


    const controls =
        document.createElement(
            "div"
        );

    controls.className =
        "scope-controls";


    [
        "Not Started",
        "In Progress",
        "Completed"
    ].forEach(
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
        controls
    );


    /* ========================================================
       TECHNICIAN NOTE
       ======================================================== */

    const noteButton =
        document.createElement(
            "button"
        );

    noteButton.type =
        "button";

    noteButton.className =
        "scope-note-button";

    noteButton.textContent =
        task.note
            ? "Edit Note"
            : "＋ Add Note";


    noteButton.onclick =
        function () {

            editScopeNote(
                task.id
            );

        };


    item.appendChild(
        noteButton
    );


    if (task.note) {

        const note =
            document.createElement(
                "div"
            );

        note.className =
            "equipment-note";

        note.textContent =
            task.note;

        item.appendChild(
            note
        );

    }


    return item;

}


/* ============================================================
   STATUS CLASS
   ============================================================ */

function getStatusClass(
    status
) {

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


    renderCurrentNightScopes();


    showTechnicianMessage(
        `Scope updated to ${newStatus}.`,
        false
    );

}


/* ============================================================
   SCOPE NOTE
   ============================================================ */

function editScopeNote(
    taskId
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


    const note =
        prompt(
            "Add note for this scope:",
            task.note || ""
        );


    if (note === null) {
        return;
    }


    task.note =
        note.trim();


    renderCurrentNightScopes();


    showTechnicianMessage(
        task.note
            ? "Scope note saved."
            : "Scope note cleared.",
        false
    );

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
   SAVE HANDOVER
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


    renderFixtureHandover();


    showTechnicianMessage(
        "Fixture handover confirmed.",
        false
    );

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
