/* =========================================================
   DEPLOYMENT TRACKER
========================================================= */


/* =========================================================
   SAMPLE DATA
========================================================= */

let stores = [

    {
        storeNumber: "0123",
        technician: "Technician A",
        currentNight: 3,
        checkedIn: "2026-10-05 16:11",
        statusOverride: null,

        tasks: [

            {
                id: 1,
                night: 3,
                description: "Remove Register 1",
                status: "Completed",
                history: []
            },

            {
                id: 2,
                night: 3,
                description: "Remove Register 2",
                status: "Completed",
                history: []
            },

            {
                id: 3,
                night: 3,
                description: "Remove Register 3",
                status: "Completed",
                history: []
            },

            {
                id: 4,
                night: 3,
                description: "Install new fixture",
                status: "In Progress",
                history: []
            },

            {
                id: 5,
                night: 3,
                description: "Validate equipment",
                status: "Not Started",
                history: []
            },

            {
                id: 6,
                night: 3,
                description: "Final deployment check",
                status: "Not Started",
                history: []
            }

        ]
    },


    {
        storeNumber: "0456",
        technician: "Technician B",
        currentNight: 1,
        checkedIn: "2026-10-05 16:11",
        statusOverride: null,

        tasks: [

            {
                id: 7,
                night: 1,
                description: "Remove Register 1",
                status: "Completed",
                history: []
            },

            {
                id: 8,
                night: 1,
                description: "Remove Register 2",
                status: "Completed",
                history: []
            }

        ]
    },


    {
        storeNumber: "0789",
        technician: "Technician C",
        currentNight: 1,
        checkedIn: null,
        statusOverride: null,
        tasks: []
    },


    {
        storeNumber: "1011",
        technician: "Technician D",
        currentNight: 1,
        checkedIn: null,
        statusOverride: null,
        tasks: []
    },


    {
        storeNumber: "1213",
        technician: "Technician E",
        currentNight: 1,
        checkedIn: null,
        statusOverride: null,
        tasks: []
    },


    {
        storeNumber: "1415",
        technician: "Technician F",
        currentNight: 1,
        checkedIn: null,
        statusOverride: null,
        tasks: []
    }

];


/* =========================================================
   RECENT UPDATES
   ONLY TECHNICIAN + CHECK-IN EVENTS
========================================================= */

let recentUpdates = [

    {
        storeNumber: "0123",
        technician: "Technician A",
        message: "Install new fixture marked In Progress.",
        timestamp: "2026-10-05 14:30",
        source: "technician"
    },

    {
        storeNumber: "0123",
        technician: "Technician A",
        message: "Night 3 scope started.",
        timestamp: "2026-10-05 13:55",
        source: "technician"
    },

    {
        storeNumber: "0456",
        technician: "Technician B",
        message: "Deployment completed.",
        timestamp: "2026-10-05 12:40",
        source: "technician"
    }

];


let selectedStoreNumber = null;


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    renderOverview();

});


/* =========================================================
   HELPERS
========================================================= */

function getStore(storeNumber) {

    return stores.find(
        store => store.storeNumber === storeNumber
    );

}


function getStatusClass(status) {

    return status
        .toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll("'", "");

}


function getScopeStatusClass(status) {

    if (status === "Moved to Another Night") {
        return "moved";
    }

    return getStatusClass(status);

}


function formatTimestamp(timestamp) {

    if (!timestamp) {
        return "—";
    }

    const date = new Date(timestamp.replace(" ", "T"));

    if (Number.isNaN(date.getTime())) {
        return timestamp;
    }

    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });

}


function getCurrentTimestamp() {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");

    const hours = String(
        now.getHours()
    ).padStart(2, "0");

    const minutes = String(
        now.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;

}


/* =========================================================
   STORE STATUS
========================================================= */

function getStoreStatus(store) {

    if (store.statusOverride) {
        return store.statusOverride;
    }

    const tasks = store.tasks || [];

    if (tasks.length === 0) {
        return "Not Started";
    }

    const activeTasks = tasks.filter(
        task => task.status !== "Cancelled"
    );

    if (activeTasks.length === 0) {
        return "Cancelled";
    }

    const allCompleted = activeTasks.every(
        task => task.status === "Completed"
    );

    if (allCompleted) {
        return "Completed";
    }

    const hasStarted = activeTasks.some(
        task =>
            task.status === "In Progress" ||
            task.status === "Completed"
    );

    if (hasStarted) {
        return "In Progress";
    }

    return "Not Started";

}


/* =========================================================
   PROGRESS
========================================================= */

function calculateProgress(store) {

    const tasks = store.tasks || [];

    const activeTasks = tasks.filter(
        task => task.status !== "Cancelled"
    );

    if (activeTasks.length === 0) {
        return 0;
    }

    const completedTasks = activeTasks.filter(
        task => task.status === "Completed"
    ).length;

    return Math.round(
        (completedTasks / activeTasks.length) * 100
    );

}


/* =========================================================
   OVERVIEW
========================================================= */

function renderOverview() {

    renderSummary();

    renderStoreCards();

    renderRecentUpdates();

}


function renderSummary() {

    const totalStores = stores.length;

    const inProgressStores = stores.filter(
        store => getStoreStatus(store) === "In Progress"
    ).length;

    const completedStores = stores.filter(
        store => getStoreStatus(store) === "Completed"
    ).length;

    const checkedInStores = stores.filter(
        store => store.checkedIn
    ).length;


    document.getElementById("totalStores").textContent =
        totalStores;

    document.getElementById("inProgressStores").textContent =
        inProgressStores;

    document.getElementById("completedStores").textContent =
        completedStores;

    document.getElementById("checkedInStores").textContent =
        checkedInStores;

}


/* =========================================================
   STORE CARDS
========================================================= */

function renderStoreCards() {

    const grid = document.getElementById("storeGrid");

    grid.innerHTML = "";


    stores.forEach(store => {

        const status = getStoreStatus(store);

        const progress = calculateProgress(store);

        const card = document.createElement("div");

        card.className = "store-card";


        card.addEventListener(
            "click",
            function () {

                openStoreDetail(
                    store.storeNumber
                );

            }
        );


        const checkInHtml = store.checkedIn

            ? `
                <div class="checked-in">
                    ✓ Checked In
                </div>

                <div class="check-in-time">
                    Checked in at ${formatTimestamp(store.checkedIn)}
                </div>
              `

            : `
                <button
                    class="store-checkin-button"
                    onclick="checkInStore(event, '${store.storeNumber}')"
                >
                    Check In
                </button>
              `;


        card.innerHTML = `

            <div class="store-status-row">

                <h3>
                    Store ${store.storeNumber}
                </h3>

                <span class="
                    store-status
                    ${getStatusClass(status)}
                ">
                    ${status}
                </span>

            </div>


            <div class="store-info-line">
                Technician:
                <strong>${store.technician}</strong>
            </div>


            <div class="store-info-line">
                Current Night:
                <strong>Night ${store.currentNight}</strong>
            </div>


            <div class="store-progress">

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width: ${progress}%"
                    ></div>

                </div>

                <div class="progress-text">
                    ${progress}% Complete
                </div>

            </div>


            <div class="store-checkin">

                ${checkInHtml}

            </div>

        `;


        grid.appendChild(card);

    });

}


/* =========================================================
   CHECK-IN
========================================================= */

function checkInStore(event, storeNumber) {

    event.stopPropagation();


    const store = getStore(storeNumber);

    if (!store) {
        return;
    }

    if (store.checkedIn) {
        return;
    }


    const timestamp = getCurrentTimestamp();

    store.checkedIn = timestamp;


    /* IMPORTANT:
       Check-in IS allowed in Recent Updates.
    */

    recentUpdates.unshift({

        storeNumber: store.storeNumber,

        technician: store.technician,

        message: "✓ Technician checked in for deployment.",

        timestamp: timestamp,

        source: "check-in"

    });


    renderOverview();

}


/* =========================================================
   RECENT UPDATES
========================================================= */

function renderRecentUpdates() {

    const container =
        document.getElementById("recentUpdates");

    container.innerHTML = "";


    /*
       Extra protection:
       Only technician and check-in updates
       are allowed to appear here.
    */

    const visibleUpdates =
        recentUpdates.filter(
            update =>
                update.source === "technician" ||
                update.source === "check-in"
        );


    if (visibleUpdates.length === 0) {

        container.innerHTML = `
            <div class="empty-updates">
                No technician updates yet.
            </div>
        `;

        return;
    }


    visibleUpdates.forEach(update => {

        const item =
            document.createElement("div");

        item.className = "update-item";


        item.innerHTML = `

            <div class="update-header">

                <span class="update-store">
                    Store ${update.storeNumber}
                </span>

                <span>—</span>

                <span class="update-tech">
                    ${update.technician}
                </span>

            </div>


            <div class="update-message">
                ${update.message}
            </div>


            <div class="update-time">
                ${formatTimestamp(update.timestamp)}
            </div>

        `;


        container.appendChild(item);

    });

}


/* =========================================================
   OPEN STORE DETAIL
========================================================= */

function openStoreDetail(storeNumber) {

    selectedStoreNumber = storeNumber;


    document.getElementById("overviewPage")
        .classList.add("hidden");

    document.getElementById("storeDetailPage")
        .classList.remove("hidden");


    renderStoreDetail();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   STORE DETAIL
========================================================= */

function renderStoreDetail() {

    const store =
        getStore(selectedStoreNumber);

    if (!store) {
        return;
    }


    const status =
        getStoreStatus(store);


    document.getElementById(
        "detailStoreNumber"
    ).textContent = store.storeNumber;


    document.getElementById(
        "detailStoreNumberInfo"
    ).textContent = store.storeNumber;


    document.getElementById(
        "detailTechnician"
    ).textContent = store.technician;


    document.getElementById(
        "detailCurrentNight"
    ).textContent =
        `Night ${store.currentNight}`;


    document.getElementById(
        "detailCheckIn"
    ).textContent =
        store.checkedIn
            ? formatTimestamp(store.checkedIn)
            : "Not checked in";


    document.getElementById(
        "detailStoreStatus"
    ).textContent =
        `${status} • ${calculateProgress(store)}% Complete`;


    document.getElementById(
        "assignedNight"
    ).value =
        store.currentNight;


    renderScopeManagementOptions();

    renderNightSections();

}


/* =========================================================
   ASSIGN NIGHT
========================================================= */

function saveNightAssignment() {

    const store =
        getStore(selectedStoreNumber);

    if (!store) {
        return;
    }


    const night =
        Number(
            document.getElementById(
                "assignedNight"
            ).value
        );


    store.currentNight = night;


    document.getElementById(
        "assignmentMessage"
    ).textContent =
        `Technician assignment updated to Night ${night}.`;


    renderStoreDetail();

}


/* =========================================================
   ADD SCOPE
========================================================= */

function addScope() {

    const store =
        getStore(selectedStoreNumber);

    if (!store) {
        return;
    }


    const night =
        Number(
            document.getElementById(
                "scopeNight"
            ).value
        );


    const description =
        document.getElementById(
            "scopeDescription"
        ).value.trim();


    if (!description) {

        alert(
            "Please enter a scope description."
        );

        return;
    }


    /*
       IMPORTANT:
       New scope ALWAYS starts as Not Started.
    */

    store.tasks.push({

        id: Date.now(),

        night: night,

        description: description,

        status: "Not Started",

        history: []

    });


    document.getElementById(
        "scopeDescription"
    ).value = "";


    /*
       Deployment Team action is intentionally
       NOT added to Recent Updates.
    */

    renderStoreDetail();

}


/* =========================================================
   SCOPE MANAGEMENT DROPDOWN
========================================================= */

function renderScopeManagementOptions() {

    const store =
        getStore(selectedStoreNumber);

    if (!store) {
        return;
    }


    const select =
        document.getElementById(
            "manageScope"
        );


    const previousValue =
        select.value;


    select.innerHTML = "";


    if (store.tasks.length === 0) {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "No scopes available";

        select.appendChild(option);

        return;
    }


    store.tasks.forEach(task => {

        const option =
            document.createElement("option");

        option.value = task.id;


        option.textContent =
            `Night ${task.night} — ${task.description} (${task.status})`;


        select.appendChild(option);

    });


    if (
        store.tasks.some(
            task =>
                String(task.id) === previousValue
        )
    ) {

        select.value = previousValue;

    }

}


/* =========================================================
   SCOPE ACTION UI
========================================================= */

function handleScopeActionChange() {

    const action =
        document.getElementById(
            "scopeAction"
        ).value;


    const reasonGroup =
        document.getElementById(
            "scopeReasonGroup"
        );


    const moveNightGroup =
        document.getElementById(
            "moveNightGroup"
        );


    reasonGroup.classList.add("hidden");

    moveNightGroup.classList.add("hidden");


    if (action === "pending") {

        reasonGroup.classList.remove("hidden");

    }


    if (action === "cancel") {

        reasonGroup.classList.remove("hidden");

    }


    if (action === "move") {

        reasonGroup.classList.remove("hidden");

        moveNightGroup.classList.remove("hidden");

    }

}


/* =========================================================
   APPLY SCOPE MANAGEMENT
========================================================= */

function applyScopeManagement() {

    const store =
        getStore(selectedStoreNumber);

    if (!store) {
        return;
    }


    const taskId =
        document.getElementById(
            "manageScope"
        ).value;


    const action =
        document.getElementById(
            "scopeAction"
        ).value;


    const reason =
        document.getElementById(
            "scopeReason"
        ).value.trim();


    const task =
        store.tasks.find(
            item =>
                String(item.id) === String(taskId)
        );


    if (!task) {

        alert(
            "Please select a scope."
        );

        return;
    }


    if (!action) {

        alert(
            "Please select an action."
        );

        return;
    }


    /*
       A completed or cancelled scope
       should not be moved/cancelled again.
    */

    if (
        task.status === "Completed" &&
        action !== "pending"
    ) {

        alert(
            "A completed scope cannot be cancelled or moved."
        );

        return;
    }


    if (
        task.status === "Cancelled" &&
        action !== "cancel"
    ) {

        alert(
            "A cancelled scope cannot be moved or changed."
        );

        return;
    }


    if (!reason) {

        alert(
            "Please enter a reason or note."
        );

        return;
    }


    const timestamp =
        getCurrentTimestamp();


    /* =========================================
       PENDING
    ========================================== */

    if (action === "pending") {

        const previousStatus =
            task.status;


        task.status = "Pending";


        task.history =
            task.history || [];


        task.history.push({

            action: "Marked as Pending",

            timestamp: timestamp,

            night: task.night,

            previousStatus: previousStatus,

            reason: reason

        });


        showScopeManagementMessage(
            "Scope marked as Pending."
        );

    }


    /* =========================================
       CANCEL
    ========================================== */

    if (action === "cancel") {

        const previousStatus =
            task.status;


        task.status = "Cancelled";


        task.cancellationReason =
            reason;


        task.history =
            task.history || [];


        task.history.push({

            action: "Cancelled",

            timestamp: timestamp,

            night: task.night,

            previousStatus: previousStatus,

            reason: reason

        });


        showScopeManagementMessage(
            "Scope cancelled."
        );

    }


    /* =========================================
       MOVE TO ANOTHER NIGHT
    ========================================== */

    if (action === "move") {

        const targetNight =
            Number(
                document.getElementById(
                    "moveToNight"
                ).value
            );


        const originalNight =
            task.night;


        if (
            targetNight === originalNight
        ) {

            alert(
                "Please select a different deployment night."
            );

            return;
        }


        const previousStatus =
            task.status;


        task.originalNight =
            task.originalNight ||
            originalNight;


        task.night =
            targetNight;


        /*
           Once moved, it becomes a fresh
           pending scope for the technician
           on the new night.
        */

        task.status = "Not Started";


        task.moveReason =
            reason;


        task.history =
            task.history || [];


        task.history.push({

            action: "Moved to Another Night",

            timestamp: timestamp,

            fromNight: originalNight,

            toNight: targetNight,

            previousStatus: previousStatus,

            reason: reason

        });


        showScopeManagementMessage(
            `Scope moved from Night ${originalNight} to Night ${targetNight}.`
        );

    }


    /*
       Deployment Team action:
       NEVER added to Recent Updates.
    */


    document.getElementById(
        "scopeAction"
    ).value = "";


    document.getElementById(
        "scopeReason"
    ).value = "";


    renderStoreDetail();

}


/* =========================================================
   MANAGEMENT MESSAGE
========================================================= */

function showScopeManagementMessage(
    message
) {

    const element =
        document.getElementById(
            "scopeManagementMessage"
        );


    element.textContent =
        message;


    setTimeout(
        function () {

            element.textContent = "";

        },
        3000
    );

}


/* =========================================================
   NIGHT SECTIONS
========================================================= */

function renderNightSections() {

    const store =
        getStore(selectedStoreNumber);

    if (!store) {
        return;
    }


    const container =
        document.getElementById(
            "nightSections"
        );


    container.innerHTML = "";


    for (
        let night = 1;
        night <= 5;
        night++
    ) {

        const nightTasks =
            store.tasks.filter(
                task =>
                    task.night === night
            );


        const section =
            document.createElement("div");

        section.className =
            "night-section";


        const header =
            document.createElement("div");

        header.className =
            "night-header";


        header.innerHTML = `

            <h4>
                Night ${night}
            </h4>

            <span>
                ${nightTasks.length}
                ${nightTasks.length === 1
                    ? "scope"
                    : "scopes"}
            </span>

        `;


        section.appendChild(header);


        const list =
            document.createElement("div");

        list.className =
            "scope-list";


        if (nightTasks.length === 0) {

            list.innerHTML = `
                <div class="empty-scope">
                    No deployment scope assigned.
                </div>
            `;

        } else {

            nightTasks.forEach(
                task => {

                    list.appendChild(
                        createScopeElement(task)
                    );

                }
            );

        }


        section.appendChild(list);

        container.appendChild(section);

    }

}


/* =========================================================
   CREATE SCOPE ELEMENT
========================================================= */

function createScopeElement(task) {

    const item =
        document.createElement("div");

    item.className =
        "scope-item";


    const statusClass =
        getScopeStatusClass(
            task.status
        );


    const historyHtml =
        buildScopeHistoryHtml(task);


    item.innerHTML = `

        <div class="scope-main">

            <div class="scope-description">
                ${task.description}
            </div>

            <div class="
                scope-status
                ${statusClass}
            ">
                ${task.status}
            </div>

        </div>


        ${historyHtml}


        <button
            class="scope-delete"
            onclick="deleteScope(event, ${task.id})"
        >
            Delete Scope
        </button>

    `;


    setupLongPress(
        item,
        task.id
    );


    return item;

}


/* =========================================================
   SCOPE HISTORY
========================================================= */

function buildScopeHistoryHtml(task) {

    if (
        !task.history ||
        task.history.length === 0
    ) {

        return "";

    }


    let historyItems = "";


    task.history.forEach(
        history => {

            let text = "";


            if (
                history.action ===
                "Moved to Another Night"
            ) {

                text =
                    `Moved from Night ${history.fromNight} to Night ${history.toNight} — ${history.reason}`;

            }


            else if (
                history.action ===
                "Cancelled"
            ) {

                text =
                    `Cancelled — ${history.reason}`;

            }


            else if (
                history.action ===
                "Marked as Pending"
            ) {

                text =
                    `Pending — ${history.reason}`;

            }


            else {

                text =
                    `${history.action} — ${history.reason || ""}`;

            }


            historyItems += `

                <div class="scope-history-item">
                    ${text}
                    <br>
                    ${formatTimestamp(history.timestamp)}
                </div>

            `;

        }
    );


    return `

        <div class="scope-history">

            <strong>History</strong>

            ${historyItems}

        </div>

    `;

}


/* =========================================================
   LONG PRESS
========================================================= */

function setupLongPress(
    element,
    taskId
) {

    let timer = null;


    const startPress =
        function () {

            timer =
                setTimeout(
                    function () {

                        element.classList.add(
                            "long-press-active"
                        );

                    },
                    600
                );

        };


    const cancelPress =
        function () {

            clearTimeout(timer);

        };


    element.addEventListener(
        "mousedown",
        startPress
    );

    element.addEventListener(
        "mouseup",
        cancelPress
    );

    element.addEventListener(
        "mouseleave",
        cancelPress
    );


    element.addEventListener(
        "touchstart",
        startPress,
        {
            passive: true
        }
    );

    element.addEventListener(
        "touchend",
        cancelPress
    );

}


/* =========================================================
   DELETE SCOPE
========================================================= */

function deleteScope(
    event,
    taskId
) {

    event.stopPropagation();


    const store =
        getStore(selectedStoreNumber);

    if (!store) {
        return;
    }


    const task =
        store.tasks.find(
            item =>
                item.id === taskId
        );


    if (!task) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${task.description}"?`
        );


    if (!confirmed) {
        return;
    }


    store.tasks =
        store.tasks.filter(
            item =>
                item.id !== taskId
        );


    /*
       Deployment Team deletion is NOT
       added to Recent Updates.
    */


    renderStoreDetail();

}


/* =========================================================
   EDIT STORE INFO
========================================================= */

function editStoreInfo() {

    const store =
        getStore(selectedStoreNumber);

    if (!store) {
        return;
    }


    const technician =
        prompt(
            "Technician name:",
            store.technician
        );


    if (
        technician === null ||
        technician.trim() === ""
    ) {

        return;
    }


    store.technician =
        technician.trim();


    /*
       Deployment Team edit is NOT
       added to Recent Updates.
    */


    renderStoreDetail();

}


/* =========================================================
   BACK TO OVERVIEW
========================================================= */

function backToOverview() {

    selectedStoreNumber = null;


    document.getElementById(
        "storeDetailPage"
    ).classList.add("hidden");


    document.getElementById(
        "overviewPage"
    ).classList.remove("hidden");


    renderOverview();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   FUTURE TECHNICIAN UPDATE HELPER
========================================================= */

/*
   This function is ready for the future
   Technician View.

   When a technician changes task progress,
   we can call:

   addTechnicianUpdate(
       "0123",
       "Started removing Register 3."
   );

   This WILL appear in Recent Updates.

   Deployment Team actions DO NOT use this.
*/

function addTechnicianUpdate(
    storeNumber,
    message
) {

    const store =
        getStore(storeNumber);

    if (!store) {
        return;
    }


    recentUpdates.unshift({

        storeNumber: store.storeNumber,

        technician: store.technician,

        message: message,

        timestamp: getCurrentTimestamp(),

        source: "technician"

    });


    renderOverview();

}
