// ============================================================
// DEPLOYMENT TRACKER
// ============================================================


// ============================================================
// SAMPLE DATA
// ============================================================

let stores = [

    {
        storeNumber: "0123",
        technician: "Technician A",
        currentNight: 3,
        checkedIn: "2026-10-05 16:11",

        tasks: [
            {
                id: 1,
                night: 1,
                description: "Install Network Equipment",
                status: "Completed",
                reason: "",
                history: []
            },

            {
                id: 2,
                night: 1,
                description: "Configure POS Terminals",
                status: "Completed",
                reason: "",
                history: []
            },

            {
                id: 3,
                night: 2,
                description: "Install CCTV Cameras",
                status: "Completed",
                reason: "",
                history: []
            },

            {
                id: 4,
                night: 3,
                description: "Test Network Connectivity",
                status: "In Progress",
                reason: "",
                history: []
            },

            {
                id: 5,
                night: 3,
                description: "Validate Registers",
                status: "Not Started",
                reason: "",
                history: []
            },

            {
                id: 6,
                night: 4,
                description: "Final System Validation",
                status: "Not Started",
                reason: "",
                history: []
            }
        ]
    },


    {
        storeNumber: "0456",
        technician: "Technician B",
        currentNight: 1,
        checkedIn: "2026-10-05 16:11",

        tasks: [
            {
                id: 7,
                night: 1,
                description: "Install Network Equipment",
                status: "Completed",
                reason: "",
                history: []
            },

            {
                id: 8,
                night: 1,
                description: "Configure POS Terminals",
                status: "Completed",
                reason: "",
                history: []
            }
        ]
    },


    {
        storeNumber: "0789",
        technician: "Technician C",
        currentNight: 2,
        checkedIn: "",
        tasks: []
    },


    {
        storeNumber: "1011",
        technician: "Technician D",
        currentNight: 1,
        checkedIn: "",
        tasks: []
    },


    {
        storeNumber: "1213",
        technician: "Technician E",
        currentNight: 1,
        checkedIn: "",
        tasks: []
    },


    {
        storeNumber: "1415",
        technician: "Technician F",
        currentNight: 1,
        checkedIn: "",
        tasks: []
    }

];


// ============================================================
// VARIABLES
// ============================================================

let selectedStoreNumber = null;

let recentUpdates = [];

let nextTaskId = 100;


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    seedExistingCheckIns();

    renderOverview();

});


// ============================================================
// BASIC HELPERS
// ============================================================

function getSelectedStore() {

    return stores.find(
        store => store.storeNumber === selectedStoreNumber
    );

}


function getCurrentTimestamp() {

    const now = new Date();

    const year = now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;

}


function formatCheckInTime(timestamp) {

    if (!timestamp) {
        return "";
    }

    const parts = timestamp.split(" ");

    if (parts.length !== 2) {
        return timestamp;
    }

    const dateParts = parts[0].split("-");
    const timeParts = parts[1].split(":");

    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]) - 1;
    const day = Number(dateParts[2]);

    const hour = Number(timeParts[0]);
    const minute = Number(timeParts[1]);

    const date = new Date(
        year,
        month,
        day,
        hour,
        minute
    );

    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });

}


function getStatusClass(status) {

    return status
        .toLowerCase()
        .replaceAll(" ", "-");

}


function getScopeStatusClass(status) {

    if (status === "Moved to Another Night") {
        return "moved";
    }

    return getStatusClass(status);

}


// ============================================================
// STORE STATUS
// ============================================================

function getStoreStatus(store) {

    if (!store.tasks || store.tasks.length === 0) {
        return "Not Started";
    }

    const activeTasks =
        store.tasks.filter(
            task => task.status !== "Cancelled"
        );

    if (activeTasks.length === 0) {
        return "Cancelled";
    }

    const allCompleted =
        activeTasks.every(
            task => task.status === "Completed"
        );

    if (allCompleted) {
        return "Completed";
    }

    const hasProgress =
        activeTasks.some(
            task =>
                task.status === "In Progress" ||
                task.status === "Completed"
        );

    if (hasProgress) {
        return "In Progress";
    }

    return "Not Started";

}


// ============================================================
// PROGRESS
// ============================================================

function calculateProgress(store) {

    if (!store.tasks || store.tasks.length === 0) {
        return 0;
    }

    const activeTasks =
        store.tasks.filter(
            task => task.status !== "Cancelled"
        );

    if (activeTasks.length === 0) {
        return 0;
    }

    const completedTasks =
        activeTasks.filter(
            task => task.status === "Completed"
        );

    return Math.round(
        (completedTasks.length / activeTasks.length) * 100
    );

}


// ============================================================
// OVERVIEW
// ============================================================

function renderOverview() {

    const overviewPage =
        document.getElementById("overviewPage");

    const storeDetailPage =
        document.getElementById("storeDetailPage");

    if (overviewPage) {
        overviewPage.classList.remove("hidden");
    }

    if (storeDetailPage) {
        storeDetailPage.classList.add("hidden");
    }


    const storeGrid =
        document.getElementById("storeGrid");

    if (!storeGrid) {
        return;
    }


    storeGrid.innerHTML = "";


    stores.forEach(store => {

        const status =
            getStoreStatus(store);

        const progress =
            calculateProgress(store);


        const card =
            document.createElement("div");

        card.className =
            "store-card";


        card.onclick = function () {

            openStoreDetail(
                store.storeNumber
            );

        };


        let checkInHTML;


        // ----------------------------------------------------
        // CHECK-IN DISPLAY
        // ----------------------------------------------------

        if (store.checkedIn) {

            checkInHTML = `

                <div class="store-checkin">

                    <button
                        class="store-checkin-button checked"
                        disabled
                    >
                        ✓ Checked In
                    </button>

                    <div class="check-in-time">
                        Checked in at
                        ${formatCheckInTime(store.checkedIn)}
                    </div>

                </div>

            `;

        } else {

            checkInHTML = `

                <div class="store-checkin">

                    <button
                        class="store-checkin-button"
                        onclick="event.stopPropagation(); checkIn('${store.storeNumber}')"
                    >
                        Technician Check-In
                    </button>

                </div>

            `;

        }


        // ----------------------------------------------------
        // STORE CARD
        // ----------------------------------------------------

        card.innerHTML = `

            <div class="store-status-row">

                <h3>
                    Store ${store.storeNumber}
                </h3>

                <span class="store-status ${getStatusClass(status)}">
                    ${status}
                </span>

            </div>


            <div class="store-info-line">

                <strong>Technician:</strong>
                ${store.technician || "Unassigned"}

            </div>


            <div class="store-info-line">

                <strong>Current Night:</strong>
                Night ${store.currentNight || 1}

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


            ${checkInHTML}

        `;


        storeGrid.appendChild(card);

    });


    renderSummary();

    renderRecentUpdates();

}


// ============================================================
// SUMMARY
// ============================================================

function renderSummary() {

    const totalStores =
        stores.length;


    const inProgressStores =
        stores.filter(
            store =>
                getStoreStatus(store) === "In Progress"
        ).length;


    const completedStores =
        stores.filter(
            store =>
                getStoreStatus(store) === "Completed"
        ).length;


    const checkedInStores =
        stores.filter(
            store => !!store.checkedIn
        ).length;


    const totalElement =
        document.getElementById("totalStores");

    const inProgressElement =
        document.getElementById("inProgressStores");

    const completedElement =
        document.getElementById("completedStores");

    const checkedInElement =
        document.getElementById("checkedInStores");


    if (totalElement) {
        totalElement.textContent =
            totalStores;
    }

    if (inProgressElement) {
        inProgressElement.textContent =
            inProgressStores;
    }

    if (completedElement) {
        completedElement.textContent =
            completedStores;
    }

    if (checkedInElement) {
        checkedInElement.textContent =
            checkedInStores;
    }

}


// ============================================================
// EXISTING CHECK-IN HISTORY
// ============================================================

function seedExistingCheckIns() {

    stores.forEach(store => {

        if (!store.checkedIn) {
            return;
        }


        recentUpdates.push({

            storeNumber:
                store.storeNumber,

            technician:
                store.technician,

            message:
                "Technician checked in",

            timestamp:
                store.checkedIn,

            source:
                "check-in"

        });

    });

}


// ============================================================
// CHECK-IN
// ============================================================

function checkIn(storeNumber) {

    const store =
        stores.find(
            item =>
                item.storeNumber === storeNumber
        );


    if (!store) {
        return;
    }


    if (store.checkedIn) {
        return;
    }


    const timestamp =
        getCurrentTimestamp();


    store.checkedIn =
        timestamp;


    recentUpdates.unshift({

        storeNumber:
            store.storeNumber,

        technician:
            store.technician,

        message:
            "Technician checked in",

        timestamp:
            timestamp,

        source:
            "check-in"

    });


    renderOverview();

}


// ============================================================
// RECENT UPDATES
// ============================================================

function renderRecentUpdates() {

    const container =
        document.getElementById("recentUpdates");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const updates =
        recentUpdates.filter(
            update =>
                update.source === "technician" ||
                update.source === "check-in"
        );


    if (updates.length === 0) {

        container.innerHTML = `

            <div class="empty-updates">
                No recent updates.
            </div>

        `;

        return;
    }


    updates.forEach(update => {

        const item =
            document.createElement("div");

        item.className =
            "update-item";


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
                ${update.timestamp}
            </div>

        `;


        container.appendChild(item);

    });

}


// ============================================================
// OPEN STORE DETAIL
// ============================================================

function openStoreDetail(storeNumber) {

    /*
     * IMPORTANT:
     * selectedStoreNumber always contains the exact store
     * currently being viewed.
     *
     * All scope and night changes are applied only to the
     * store returned by getSelectedStore().
     */

    selectedStoreNumber =
        storeNumber;


    const overviewPage =
        document.getElementById("overviewPage");

    const storeDetailPage =
        document.getElementById("storeDetailPage");


    if (overviewPage) {
        overviewPage.classList.add("hidden");
    }


    if (storeDetailPage) {
        storeDetailPage.classList.remove("hidden");
    }


    resetScopeManagementForm();

    renderStoreDetail();

}


// ============================================================
// STORE DETAIL
// ============================================================

function renderStoreDetail() {

    /*
     * IMPORTANT:
     * Every time the detail page is rendered, all values are
     * loaded from the currently selected store.
     *
     * This prevents Night 2 assigned to Store A from appearing
     * as the assigned Night for Store B.
     */

    const store =
        getSelectedStore();


    if (!store) {
        return;
    }


    const detailStoreNumber =
        document.getElementById(
            "detailStoreNumber"
        );

    const detailStoreNumberInfo =
        document.getElementById(
            "detailStoreNumberInfo"
        );

    const detailTechnician =
        document.getElementById(
            "detailTechnician"
        );

    const detailCurrentNight =
        document.getElementById(
            "detailCurrentNight"
        );

    const detailCheckIn =
        document.getElementById(
            "detailCheckIn"
        );

    const detailStoreStatus =
        document.getElementById(
            "detailStoreStatus"
        );


    if (detailStoreNumber) {

        detailStoreNumber.textContent =
            store.storeNumber;

    }


    if (detailStoreNumberInfo) {

        detailStoreNumberInfo.textContent =
            store.storeNumber;

    }


    if (detailTechnician) {

        detailTechnician.textContent =
            store.technician || "Unassigned";

    }


    if (detailCurrentNight) {

        detailCurrentNight.textContent =
            `Night ${store.currentNight || 1}`;

    }


    if (detailCheckIn) {

        detailCheckIn.textContent =
            store.checkedIn
                ? formatCheckInTime(store.checkedIn)
                : "Not checked in";

    }


    if (detailStoreStatus) {

        detailStoreStatus.textContent =
            getStoreStatus(store);

    }


    // --------------------------------------------------------
    // STORE-SPECIFIC NIGHT ASSIGNMENT
    // --------------------------------------------------------

    const assignedNight =
        document.getElementById(
            "assignedNight"
        );


    if (assignedNight) {

        assignedNight.value =
            String(
                Number(store.currentNight) || 1
            );

    }


    // --------------------------------------------------------
    // DEFAULT NEW SCOPE NIGHT
    // --------------------------------------------------------

    const scopeNight =
        document.getElementById(
            "scopeNight"
        );


    if (scopeNight) {

        scopeNight.value =
            String(
                Number(store.currentNight) || 1
            );

    }


    renderNightSections();

    renderScopeManagementOptions();

}


// ============================================================
// NIGHT SECTIONS
// ============================================================

function renderNightSections() {

    const container =
        document.getElementById(
            "nightSections"
        );


    if (!container) {
        return;
    }


    const store =
        getSelectedStore();


    if (!store) {
        return;
    }


    container.innerHTML = "";


    for (let night = 1; night <= 5; night++) {

        const section =
            document.createElement("div");

        section.className =
            "night-section";


        const nightTasks =
            (store.tasks || []).filter(
                task =>
                    task.night === night
            );


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
                scope${nightTasks.length === 1 ? "" : "s"}
            </span>

        `;


        const scopeList =
            document.createElement("div");

        scopeList.className =
            "scope-list";


        if (nightTasks.length === 0) {

            scopeList.innerHTML = `

                <div class="empty-scope">
                    No deployment scope added.
                </div>

            `;

        } else {

            nightTasks.forEach(task => {

                scopeList.appendChild(
                    createScopeElement(task)
                );

            });

        }


        section.appendChild(header);

        section.appendChild(scopeList);

        container.appendChild(section);

    }

}


// ============================================================
// CREATE SCOPE ELEMENT
// ============================================================

function createScopeElement(task) {

    const element =
        document.createElement("div");


    const statusClass =
        getScopeStatusClass(
            task.status
        );


    element.className =
        "scope-item";


    element.setAttribute(
        "data-task-id",
        task.id
    );


    const main =
        document.createElement("div");

    main.className =
        "scope-main";


    const description =
        document.createElement("div");

    description.className =
        "scope-description";

    description.textContent =
        task.description;


    const status =
        document.createElement("span");

    status.className =
        `scope-status ${statusClass}`;

    status.textContent =
        task.status;


    main.appendChild(description);

    main.appendChild(status);

    element.appendChild(main);


    // --------------------------------------------------------
    // CURRENT REASON
    // --------------------------------------------------------

    if (task.reason) {

        const currentReason =
            document.createElement("div");

        currentReason.className =
            "scope-current-reason";

        currentReason.innerHTML = `
            <strong>Reason:</strong>
            ${escapeHtml(task.reason)}
        `;

        element.appendChild(
            currentReason
        );

    }


    // --------------------------------------------------------
    // HISTORY
    // --------------------------------------------------------

    if (
        task.history &&
        task.history.length > 0
    ) {

        const historyContainer =
            document.createElement("div");

        historyContainer.className =
            "scope-history";

        historyContainer.innerHTML =
            buildScopeHistoryHtml(task);

        element.appendChild(
            historyContainer
        );

    }


    // --------------------------------------------------------
    // DELETE BUTTON
    // --------------------------------------------------------

    const deleteButton =
        document.createElement("button");

    deleteButton.className =
        "scope-delete";

    deleteButton.type =
        "button";

    deleteButton.textContent =
        "Delete";


    deleteButton.onclick =
        function (event) {

            event.stopPropagation();

            deleteScope(task.id);

        };


    element.appendChild(
        deleteButton
    );


    // --------------------------------------------------------
    // LONG PRESS
    // --------------------------------------------------------

    let pressTimer = null;


    function startLongPress() {

        clearTimeout(pressTimer);


        pressTimer =
            setTimeout(function () {

                element.classList.add(
                    "long-press-active"
                );

            }, 700);

    }


    function cancelLongPress() {

        clearTimeout(pressTimer);

    }


    element.addEventListener(
        "touchstart",
        startLongPress,
        { passive: true }
    );


    element.addEventListener(
        "touchend",
        cancelLongPress
    );


    element.addEventListener(
        "touchmove",
        cancelLongPress
    );


    element.addEventListener(
        "mousedown",
        startLongPress
    );


    element.addEventListener(
        "mouseup",
        cancelLongPress
    );


    element.addEventListener(
        "mouseleave",
        cancelLongPress
    );


    element.addEventListener(
        "contextmenu",
        function (event) {

            event.preventDefault();

            element.classList.add(
                "long-press-active"
            );

        }
    );


    return element;

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ============================================================
// SCOPE HISTORY HTML
// ============================================================

function buildScopeHistoryHtml(task) {

    if (
        !task.history ||
        task.history.length === 0
    ) {

        return "";

    }


    let html = "";


    task.history.forEach(history => {

        html += `

            <div class="scope-history-item">

                <strong>
                    ${escapeHtml(history.action)}
                </strong>

                <div>
                    ${escapeHtml(history.timestamp || "")}
                </div>

                ${
                    history.reason
                    ?
                    `
                        <div>
                            Reason: ${escapeHtml(history.reason)}
                        </div>
                    `
                    :
                    ""
                }

                ${
                    history.fromNight
                    ?
                    `
                        <div>
                            Night ${history.fromNight}
                            → Night ${history.toNight}
                        </div>
                    `
                    :
                    ""
                }

            </div>

        `;

    });


    return html;

}


// ============================================================
// ADD SCOPE
// ============================================================

function addScope() {

    const store =
        getSelectedStore();


    if (!store) {
        return;
    }


    const nightInput =
        document.getElementById(
            "scopeNight"
        );

    const scopeInput =
        document.getElementById(
            "scopeDescription"
        );


    if (!nightInput || !scopeInput) {
        return;
    }


    const night =
        Number(
            nightInput.value
        );


    const description =
        scopeInput.value.trim();


    if (!description) {

        alert(
            "Please enter a deployment scope."
        );

        return;

    }


    if (!store.tasks) {

        store.tasks = [];

    }


    /*
     * The scope is pushed ONLY into the currently selected
     * store's tasks array.
     */

    store.tasks.push({

        id:
            nextTaskId++,

        night:
            night,

        description:
            description,

        status:
            "Not Started",

        reason:
            "",

        history:
            []

    });


    scopeInput.value = "";


    renderStoreDetail();

}


// ============================================================
// SCOPE MANAGEMENT OPTIONS
// ============================================================

function renderScopeManagementOptions() {

    const select =
        document.getElementById(
            "manageScope"
        );


    if (!select) {
        return;
    }


    const store =
        getSelectedStore();


    if (!store) {
        return;
    }


    select.innerHTML = `

        <option value="">
            Select a scope
        </option>

    `;


    (store.tasks || []).forEach(task => {

        const option =
            document.createElement("option");


        option.value =
            task.id;


        option.textContent =
            `Night ${task.night} — ${task.description} (${task.status})`;


        select.appendChild(
            option
        );

    });


    handleScopeActionChange();

}


// ============================================================
// ACTION CHANGE
// ============================================================

function handleScopeActionChange() {

    const actionSelect =
        document.getElementById(
            "scopeAction"
        );

    const scopeSelect =
        document.getElementById(
            "manageScope"
        );

    const reasonGroup =
        document.getElementById(
            "scopeReasonGroup"
        );

    const reasonInput =
        document.getElementById(
            "scopeReason"
        );

    const moveGroup =
        document.getElementById(
            "moveNightGroup"
        );


    if (!actionSelect) {
        return;
    }


    const action =
        actionSelect.value;


    const store =
        getSelectedStore();


    const taskId =
        scopeSelect
            ? Number(scopeSelect.value)
            : 0;


    const task =
        store && taskId
            ? (store.tasks || []).find(
                item => item.id === taskId
            )
            : null;


    // --------------------------------------------------------
    // REASON FIELD
    // --------------------------------------------------------

    if (reasonGroup) {

        if (
            action === "pending" ||
            action === "cancel" ||
            action === "move" ||
            action === "editReason"
        ) {

            reasonGroup.classList.remove(
                "hidden"
            );

        } else {

            reasonGroup.classList.add(
                "hidden"
            );

        }

    }


    // --------------------------------------------------------
    // PRELOAD EXISTING REASON WHEN EDITING
    // --------------------------------------------------------

    if (
        action === "editReason" &&
        reasonInput &&
        task
    ) {

        reasonInput.value =
            task.reason ||
            getLatestReason(task);

    }


    // --------------------------------------------------------
    // MOVE NIGHT
    // --------------------------------------------------------

    if (moveGroup) {

        if (action === "move") {

            moveGroup.classList.remove(
                "hidden"
            );

        } else {

            moveGroup.classList.add(
                "hidden"
            );

        }

    }

}


// ============================================================
// GET LATEST REASON
// ============================================================

function getLatestReason(task) {

    if (
        !task ||
        !task.history ||
        task.history.length === 0
    ) {
        return "";
    }


    for (
        let i = task.history.length - 1;
        i >= 0;
        i--
    ) {

        if (task.history[i].reason) {
            return task.history[i].reason;
        }

    }


    return "";

}


// ============================================================
// APPLY SCOPE MANAGEMENT
// ============================================================

function applyScopeManagement() {

    const store =
        getSelectedStore();


    if (!store) {
        return;
    }


    const scopeSelect =
        document.getElementById(
            "manageScope"
        );

    const actionSelect =
        document.getElementById(
            "scopeAction"
        );

    const reasonInput =
        document.getElementById(
            "scopeReason"
        );

    const targetNightSelect =
        document.getElementById(
            "moveToNight"
        );


    if (!scopeSelect || !actionSelect) {
        return;
    }


    const taskId =
        Number(
            scopeSelect.value
        );


    const action =
        actionSelect.value;


    const reason =
        reasonInput
            ? reasonInput.value.trim()
            : "";


    if (!taskId) {

        showScopeManagementMessage(
            "Please select a scope.",
            true
        );

        return;

    }


    if (!action) {

        showScopeManagementMessage(
            "Please select an action.",
            true
        );

        return;

    }


    const task =
        store.tasks.find(
            item =>
                item.id === taskId
        );


    if (!task) {

        showScopeManagementMessage(
            "Scope not found.",
            true
        );

        return;

    }


    const timestamp =
        getCurrentTimestamp();


    // ========================================================
    // PENDING
    // ========================================================

    if (action === "pending") {

        if (
            task.status === "Completed" ||
            task.status === "Cancelled"
        ) {

            showScopeManagementMessage(
                "This scope cannot be marked as Pending.",
                true
            );

            return;

        }


        if (!reason) {

            showScopeManagementMessage(
                "Please enter a reason or note.",
                true
            );

            return;

        }


        task.status =
            "Pending";

        task.reason =
            reason;


        if (!task.history) {
            task.history = [];
        }


        task.history.push({

            action:
                "Marked as Pending",

            timestamp:
                timestamp,

            reason:
                reason

        });


        showScopeManagementMessage(
            "Scope marked as Pending.",
            false
        );


        renderStoreDetail();

        return;

    }


    // ========================================================
    // CANCEL
    // ========================================================

    if (action === "cancel") {

        if (
            task.status === "Completed"
        ) {

            showScopeManagementMessage(
                "Completed scopes cannot be cancelled.",
                true
            );

            return;

        }


        if (
            task.status === "Cancelled"
        ) {

            showScopeManagementMessage(
                "This scope is already cancelled.",
                true
            );

            return;

        }


        if (!reason) {

            showScopeManagementMessage(
                "Please enter a reason or note.",
                true
            );

            return;

        }


        task.status =
            "Cancelled";

        task.reason =
            reason;


        if (!task.history) {
            task.history = [];
        }


        task.history.push({

            action:
                "Cancelled",

            timestamp:
                timestamp,

            reason:
                reason

        });


        showScopeManagementMessage(
            "Scope cancelled.",
            false
        );


        renderStoreDetail();

        return;

    }


    // ========================================================
    // MOVE TO ANOTHER NIGHT
    // ========================================================

    if (action === "move") {

        if (
            task.status !== "Pending"
        ) {

            showScopeManagementMessage(
                "Only Pending scopes can be moved to another night.",
                true
            );

            return;

        }


        if (!reason) {

            showScopeManagementMessage(
                "Please enter a reason or note.",
                true
            );

            return;

        }


        if (!targetNightSelect) {
            return;
        }


        const targetNight =
            Number(
                targetNightSelect.value
            );


        if (
            targetNight === task.night
        ) {

            showScopeManagementMessage(
                "Please select a different night.",
                true
            );

            return;

        }


        const originalNight =
            task.night;


        if (!task.history) {
            task.history = [];
        }


        task.history.push({

            action:
                "Moved to Another Night",

            timestamp:
                timestamp,

            fromNight:
                originalNight,

            toNight:
                targetNight,

            reason:
                reason

        });


        /*
         * The original Pending scope stays in the original night.
         * A new active scope is created for the target night.
         *
         * Both are stored inside THIS STORE'S tasks array only.
         */

        store.tasks.push({

            id:
                nextTaskId++,

            night:
                targetNight,

            description:
                task.description,

            status:
                "Not Started",

            reason:
                reason,

            history: [

                {

                    action:
                        "Moved from Another Night",

                    timestamp:
                        timestamp,

                    fromNight:
                        originalNight,

                    toNight:
                        targetNight,

                    reason:
                        reason

                }

            ],

            originalScopeId:
                task.id

        });


        showScopeManagementMessage(
            `Scope copied to Night ${targetNight}. Original Pending scope remains on Night ${originalNight}.`,
            false
        );


        renderStoreDetail();

        return;

    }


    // ========================================================
    // EDIT REASON
    // ========================================================

    if (action === "editReason") {

        if (!reason) {

            showScopeManagementMessage(
                "Please enter a new reason.",
                true
            );

            return;

        }


        if (!task.history) {
            task.history = [];
        }


        /*
         * Store the current/latest reason directly on the task.
         */

        task.reason =
            reason;


        /*
         * Update the latest history entry that has a reason.
         *
         * This means we are editing the existing reason instead
         * of creating another duplicate history event.
         */

        let updatedHistory = false;


        for (
            let i = task.history.length - 1;
            i >= 0;
            i--
        ) {

            if (
                task.history[i].reason !== undefined
            ) {

                task.history[i].reason =
                    reason;

                updatedHistory = true;

                break;

            }

        }


        /*
         * If there is no previous history reason,
         * create a small reason history entry.
         */

        if (!updatedHistory) {

            task.history.push({

                action:
                    "Reason Updated",

                timestamp:
                    timestamp,

                reason:
                    reason

            });

        }


        showScopeManagementMessage(
            "Reason updated successfully.",
            false
        );


        renderStoreDetail();

        return;

    }

}


// ============================================================
// RESET MANAGEMENT FORM
// ============================================================

function resetScopeManagementForm() {

    const scopeSelect =
        document.getElementById(
            "manageScope"
        );

    const actionSelect =
        document.getElementById(
            "scopeAction"
        );

    const reasonInput =
        document.getElementById(
            "scopeReason"
        );

    const moveNightSelect =
        document.getElementById(
            "moveToNight"
        );

    const reasonGroup =
        document.getElementById(
            "scopeReasonGroup"
        );

    const moveGroup =
        document.getElementById(
            "moveNightGroup"
        );

    const message =
        document.getElementById(
            "scopeManagementMessage"
        );


    if (scopeSelect) {
        scopeSelect.value = "";
    }

    if (actionSelect) {
        actionSelect.value = "";
    }

    if (reasonInput) {
        reasonInput.value = "";
    }

    if (moveNightSelect) {
        moveNightSelect.value = "1";
    }

    if (reasonGroup) {
        reasonGroup.classList.add("hidden");
    }

    if (moveGroup) {
        moveGroup.classList.add("hidden");
    }

    if (message) {
        message.textContent = "";
    }

}


// ============================================================
// MANAGEMENT MESSAGE
// ============================================================

function showScopeManagementMessage(
    message,
    isError
) {

    const element =
        document.getElementById(
            "scopeManagementMessage"
        );


    if (!element) {

        alert(message);

        return;

    }


    element.textContent =
        message;


    element.style.color =
        isError
            ? "#b91c1c"
            : "#047857";

}


// ============================================================
// DELETE SCOPE
// ============================================================

function deleteScope(taskId) {

    const store =
        getSelectedStore();


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
            `Delete this scope?\n\n${task.description}`
        );


    if (!confirmed) {
        return;
    }


    store.tasks =
        store.tasks.filter(
            item =>
                item.id !== taskId
        );


    renderStoreDetail();

}


// ============================================================
// EDIT STORE / TECHNICIAN
// ============================================================

function editStoreInfo() {

    const store =
        getSelectedStore();


    if (!store) {
        return;
    }


    const newStoreNumber =
        prompt(
            "Enter Store Number:",
            store.storeNumber
        );


    if (newStoreNumber === null) {
        return;
    }


    const cleanedStoreNumber =
        newStoreNumber
            .trim()
            .replace(/^Store\s*/i, "");


    if (!cleanedStoreNumber) {

        alert(
            "Store Number cannot be empty."
        );

        return;

    }


    const duplicate =
        stores.some(
            item =>
                item !== store &&
                item.storeNumber ===
                    cleanedStoreNumber
        );


    if (duplicate) {

        alert(
            "That Store Number already exists."
        );

        return;

    }


    const newTechnician =
        prompt(
            "Enter Technician Name:",
            store.technician || ""
        );


    if (newTechnician === null) {
        return;
    }


    store.storeNumber =
        cleanedStoreNumber;


    store.technician =
        newTechnician.trim() ||
        "Unassigned";


    selectedStoreNumber =
        store.storeNumber;


    renderStoreDetail();


    alert(
        "Store information updated."
    );

}


// ============================================================
// SAVE NIGHT ASSIGNMENT
// ============================================================

function saveNightAssignment() {

    const store =
        getSelectedStore();


    if (!store) {
        return;
    }


    const assignedNight =
        document.getElementById(
            "assignedNight"
        );


    const assignmentMessage =
        document.getElementById(
            "assignmentMessage"
        );


    if (!assignedNight) {
        return;
    }


    const selectedNight =
        Number(
            assignedNight.value
        );


    /*
     * IMPORTANT:
     * Save the Night ONLY to the currently selected store.
     *
     * No other store object is modified here.
     */

    store.currentNight =
        selectedNight;


    if (assignmentMessage) {

        assignmentMessage.textContent =
            `Store ${store.storeNumber}'s current assigned night updated to Night ${selectedNight}.`;

    }


    renderStoreDetail();

}


// ============================================================
// BACK TO OVERVIEW
// ============================================================

function backToOverview() {

    selectedStoreNumber =
        null;


    const overviewPage =
        document.getElementById(
            "overviewPage"
        );

    const storeDetailPage =
        document.getElementById(
            "storeDetailPage"
        );


    if (storeDetailPage) {

        storeDetailPage.classList.add(
            "hidden"
        );

    }


    if (overviewPage) {

        overviewPage.classList.remove(
            "hidden"
        );

    }


    renderOverview();

}


// ============================================================
// TECHNICIAN UPDATE
// ============================================================

function addTechnicianUpdate(
    storeNumber,
    message
) {

    const store =
        stores.find(
            item =>
                item.storeNumber === storeNumber
        );


    if (!store) {
        return;
    }


    const cleanMessage =
        message.trim();


    if (!cleanMessage) {
        return;
    }


    recentUpdates.unshift({

        storeNumber:
            store.storeNumber,

        technician:
            store.technician,

        message:
            cleanMessage,

        timestamp:
            getCurrentTimestamp(),

        source:
            "technician"

    });


    renderOverview();

}
