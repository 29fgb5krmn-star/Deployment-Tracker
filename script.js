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
                reasonTimestamp: "",
                history: []
            },

            {
                id: 2,
                night: 1,
                description: "Configure POS Terminals",
                status: "Completed",
                reason: "",
                reasonTimestamp: "",
                history: []
            },

            {
                id: 3,
                night: 2,
                description: "Install CCTV Cameras",
                status: "Completed",
                reason: "",
                reasonTimestamp: "",
                history: []
            },

            {
                id: 4,
                night: 3,
                description: "Test Network Connectivity",
                status: "In Progress",
                reason: "",
                reasonTimestamp: "",
                history: []
            },

            {
                id: 5,
                night: 3,
                description: "Validate Registers",
                status: "Not Started",
                reason: "",
                reasonTimestamp: "",
                history: []
            },

            {
                id: 6,
                night: 4,
                description: "Final System Validation",
                status: "Not Started",
                reason: "",
                reasonTimestamp: "",
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
                reasonTimestamp: "",
                history: []
            },

            {
                id: 8,
                night: 1,
                description: "Configure POS Terminals",
                status: "Completed",
                reason: "",
                reasonTimestamp: "",
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


function formatReasonTimestamp(timestamp) {

    if (!timestamp) {
        return "";
    }

    const date =
        new Date(
            timestamp.replace(" ", "T")
        );

    if (isNaN(date.getTime())) {
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
            store.checkedIn || "Not checked in";

    }


    if (detailStoreStatus) {

        detailStoreStatus.textContent =
            getStoreStatus(store);

    }


    const assignedNight =
        document.getElementById(
            "assignedNight"
        );


    if (assignedNight) {

        assignedNight.value = "";

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
    // REASON / NOTES
    // --------------------------------------------------------

    if (task.reason) {

        const reason =
            document.createElement("div");

        reason.className =
            "scope-reason";


        const timestampText =
            formatReasonTimestamp(
                task.reasonTimestamp
            );


        reason.innerHTML = `

            <div>
                <strong>Reason:</strong>
                ${task.reason}
            </div>

            ${
                timestampText
                    ? `
                        <div class="scope-reason-time">
                            ${timestampText}
                        </div>
                    `
                    : ""
            }

        `;


        element.appendChild(reason);

    }


    // --------------------------------------------------------
    // EDIT BUTTON
    // --------------------------------------------------------

    const editButton =
        document.createElement("button");

    editButton.className =
        "scope-edit";

    editButton.type =
        "button";

    editButton.textContent =
        "Edit";


    editButton.onclick =
        function (event) {

            event.stopPropagation();

            editScope(task.id);

        };


    element.appendChild(
        editButton
    );


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

        reasonTimestamp:
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
// RESET MANAGEMENT FORM
// ============================================================

function resetScopeManagementForm() {

    const scopeSelect =
        document.getElementById("manageScope");

    const actionSelect =
        document.getElementById("scopeAction");

    const reasonInput =
        document.getElementById("scopeReason");

    const reasonGroup =
        document.getElementById("scopeReasonGroup");

    const moveGroup =
        document.getElementById("moveNightGroup");

    const message =
        document.getElementById("scopeManagementMessage");


    if (scopeSelect) {
        scopeSelect.value = "";
    }

    if (actionSelect) {
        actionSelect.value = "";
    }

    if (reasonInput) {
        reasonInput.value = "";
        reasonInput.placeholder =
            "Enter reason or notes";
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

    const moveGroup =
        document.getElementById(
            "moveNightGroup"
        );

    const reasonInput =
        document.getElementById(
            "scopeReason"
        );


    if (!actionSelect) {
        return;
    }


    const action =
        actionSelect.value;


    const selectedTaskId =
        scopeSelect
            ? Number(scopeSelect.value)
            : 0;


    let selectedTask = null;


    const store =
        getSelectedStore();


    if (
        store &&
        selectedTaskId
    ) {

        selectedTask =
            store.tasks.find(
                task =>
                    task.id === selectedTaskId
            );

    }


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
    // LOAD EXISTING REASON FOR EDIT
    // --------------------------------------------------------

    if (
        action === "editReason" &&
        selectedTask &&
        reasonInput
    ) {

        reasonInput.value =
            selectedTask.reason || "";

        reasonInput.placeholder =
            "Update reason or notes";

    } else if (
        action !== "editReason" &&
        reasonInput
    ) {

        reasonInput.value = "";

        reasonInput.placeholder =
            "Enter reason or notes";

    }


    // --------------------------------------------------------
    // MOVE FIELD
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
    // EDIT REASON / NOTES
    // ========================================================

    if (action === "editReason") {

        if (!reason) {

            showScopeManagementMessage(
                "Please enter a reason or note.",
                true
            );

            return;

        }


        task.reason =
            reason;

        task.reasonTimestamp =
            timestamp;


        showScopeManagementMessage(
            "Reason / notes updated.",
            false
        );


        resetScopeManagementFieldsAfterSave();

        renderStoreDetail();

        return;

    }


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


        task.status =
            "Pending";


        task.reason =
            reason;


        task.reasonTimestamp =
            reason
                ? timestamp
                : "";


        showScopeManagementMessage(
            "Scope marked as Pending.",
            false
        );


        resetScopeManagementFieldsAfterSave();

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


        task.status =
            "Cancelled";


        task.reason =
            reason;


        task.reasonTimestamp =
            reason
                ? timestamp
                : "";


        showScopeManagementMessage(
            "Scope cancelled.",
            false
        );


        resetScopeManagementFieldsAfterSave();

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

            reasonTimestamp:
                reason
                    ? timestamp
                    : "",

            history: [],

            originalScopeId:
                task.id

        });


        showScopeManagementMessage(
            `Scope copied to Night ${targetNight}.`,
            false
        );


        resetScopeManagementFieldsAfterSave();

        renderStoreDetail();

        return;

    }

}


// ============================================================
// RESET AFTER SAVE
// ============================================================

function resetScopeManagementFieldsAfterSave() {

    const scopeSelect =
        document.getElementById("manageScope");

    const actionSelect =
        document.getElementById("scopeAction");

    const reasonInput =
        document.getElementById("scopeReason");

    const reasonGroup =
        document.getElementById("scopeReasonGroup");

    const moveGroup =
        document.getElementById("moveNightGroup");


    if (scopeSelect) {
        scopeSelect.value = "";
    }

    if (actionSelect) {
        actionSelect.value = "";
    }

    if (reasonInput) {
        reasonInput.value = "";
        reasonInput.placeholder =
            "Enter reason or notes";
    }

    if (reasonGroup) {
        reasonGroup.classList.add("hidden");
    }

    if (moveGroup) {
        moveGroup.classList.add("hidden");
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


    if (!isError) {

        setTimeout(function () {

            if (element.textContent === message) {

                element.textContent = "";

            }

        }, 5000);

    }

}


// ============================================================
// EDIT SCOPE
// ============================================================

function editScope(taskId) {

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


    const newDescription =
        prompt(
            "Edit deployment scope:",
            task.description
        );


    if (newDescription === null) {
        return;
    }


    const cleanedDescription =
        newDescription.trim();


    if (!cleanedDescription) {

        alert(
            "Scope cannot be empty."
        );

        return;

    }


    task.description =
        cleanedDescription;


    renderStoreDetail();

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


    const detailCurrentNight =
        document.getElementById(
            "detailCurrentNight"
        );


    if (!assignedNight) {
        return;
    }


    const selectedNight =
        Number(
            assignedNight.value
        );


    if (!selectedNight) {

        if (assignmentMessage) {

            assignmentMessage.textContent =
                "Please select a deployment night.";

            assignmentMessage.style.color =
                "#b91c1c";

        }

        return;

    }


    store.currentNight =
        selectedNight;


    if (detailCurrentNight) {

        detailCurrentNight.textContent =
            `Night ${selectedNight}`;

    }


    if (assignmentMessage) {

        assignmentMessage.textContent =
            `Current assigned night updated to Night ${selectedNight}.`;

        assignmentMessage.style.color =
            "#047857";

    }


    // Reset dropdown
    assignedNight.value = "";


    // Clear success message after 5 seconds
    setTimeout(function () {

        if (
            assignmentMessage &&
            assignmentMessage.textContent ===
                `Current assigned night updated to Night ${selectedNight}.`
        ) {

            assignmentMessage.textContent = "";

        }

    }, 5000);

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
