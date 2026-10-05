// ============================================================
// DEPLOYMENT TRACKER
// ============================================================

// ------------------------------
// SAMPLE DATA
// ------------------------------

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
                history: [],
                originalScopeId: null
            },
            {
                id: 2,
                night: 1,
                description: "Configure POS Terminals",
                status: "Completed",
                history: [],
                originalScopeId: null
            },
            {
                id: 3,
                night: 2,
                description: "Install CCTV Cameras",
                status: "Completed",
                history: [],
                originalScopeId: null
            },
            {
                id: 4,
                night: 3,
                description: "Test Network Connectivity",
                status: "In Progress",
                history: [],
                originalScopeId: null
            },
            {
                id: 5,
                night: 3,
                description: "Validate Registers",
                status: "Not Started",
                history: [],
                originalScopeId: null
            },
            {
                id: 6,
                night: 4,
                description: "Final System Validation",
                status: "Not Started",
                history: [],
                originalScopeId: null
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
                history: [],
                originalScopeId: null
            },
            {
                id: 8,
                night: 1,
                description: "Configure POS Terminals",
                status: "Completed",
                history: [],
                originalScopeId: null
            }
        ]
    },

    {
        storeNumber: "0789",
        technician: "Technician C",
        currentNight: 1,
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


// ------------------------------
// GLOBAL VARIABLES
// ------------------------------

let selectedStoreNumber = null;

let recentUpdates = [];

let nextTaskId = 100;


// ------------------------------
// INITIAL LOAD
// ------------------------------

document.addEventListener("DOMContentLoaded", function () {

    renderOverview();

    setupEventListeners();

});


// ============================================================
// GENERAL HELPERS
// ============================================================

function getSelectedStore() {

    return stores.find(
        store => store.storeNumber === selectedStoreNumber
    );

}


function getCurrentTimestamp() {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");

    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;

}


function getStatusClass(status) {

    return status
        .toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll("'", "");

}


// IMPORTANT FIX
// This prevents the scope list from disappearing when a new scope
// is added or when the scope status is rendered.

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

    const activeTasks = store.tasks.filter(
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

    const hasProgress = activeTasks.some(
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

    const activeTasks = store.tasks.filter(
        task => task.status !== "Cancelled"
    );

    if (activeTasks.length === 0) {

        return 0;

    }

    const completedTasks = activeTasks.filter(
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

    const storeGrid = document.getElementById("storeGrid");

    if (!storeGrid) {

        return;

    }

    storeGrid.innerHTML = "";

    stores.forEach(store => {

        const status = getStoreStatus(store);

        const progress = calculateProgress(store);

        const card = document.createElement("div");

        card.className = "store-card";

        card.onclick = function () {

            openStoreDetail(store.storeNumber);

        };


        card.innerHTML = `

            <div class="store-card-header">

                <div>

                    <div class="store-number">
                        Store ${store.storeNumber}
                    </div>

                    <div class="technician-name">
                        ${store.technician || "Unassigned"}
                    </div>

                </div>

                <span class="status-badge ${getStatusClass(status)}">
                    ${status}
                </span>

            </div>


            <div class="store-card-info">

                <div>
                    <strong>Current Night:</strong>
                    Night ${store.currentNight || 1}
                </div>

                <div>
                    <strong>Progress:</strong>
                    ${progress}%
                </div>

                <div>
                    <strong>Check-in:</strong>
                    ${
                        store.checkedIn
                            ? store.checkedIn
                            : "Not checked in"
                    }
                </div>

            </div>


            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width: ${progress}%"
                ></div>

            </div>


            <button
                class="check-in-btn"
                onclick="event.stopPropagation(); checkIn('${store.storeNumber}')"
                ${store.checkedIn ? "disabled" : ""}
            >

                ${
                    store.checkedIn
                        ? "Checked In"
                        : "Technician Check-In"
                }

            </button>

        `;

        storeGrid.appendChild(card);

    });


    renderSummary();

    renderRecentUpdates();

}


// ============================================================
// SUMMARY CARDS
// ============================================================

function renderSummary() {

    const totalStores = stores.length;

    const completedStores = stores.filter(
        store => getStoreStatus(store) === "Completed"
    ).length;

    const inProgressStores = stores.filter(
        store => getStoreStatus(store) === "In Progress"
    ).length;

    const notStartedStores = stores.filter(
        store => getStoreStatus(store) === "Not Started"
    ).length;


    const totalElement =
        document.getElementById("totalStores");

    const completedElement =
        document.getElementById("completedStores");

    const inProgressElement =
        document.getElementById("inProgressStores");

    const notStartedElement =
        document.getElementById("notStartedStores");


    if (totalElement) {

        totalElement.textContent = totalStores;

    }

    if (completedElement) {

        completedElement.textContent = completedStores;

    }

    if (inProgressElement) {

        inProgressElement.textContent = inProgressStores;

    }

    if (notStartedElement) {

        notStartedElement.textContent = notStartedStores;

    }

}


// ============================================================
// CHECK-IN
// ============================================================

function checkIn(storeNumber) {

    const store = stores.find(
        item => item.storeNumber === storeNumber
    );

    if (!store) {

        return;

    }

    if (store.checkedIn) {

        return;

    }

    const timestamp = getCurrentTimestamp();

    store.checkedIn = timestamp;


    recentUpdates.unshift({

        storeNumber: store.storeNumber,

        technician: store.technician,

        message: "Technician checked in",

        timestamp: timestamp,

        source: "check-in"

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


    const technicianUpdates = recentUpdates.filter(
        update =>
            update.source === "technician" ||
            update.source === "check-in"
    );


    if (technicianUpdates.length === 0) {

        container.innerHTML = `

            <div class="no-updates">
                No recent updates.
            </div>

        `;

        return;

    }


    technicianUpdates.forEach(update => {

        const item = document.createElement("div");

        item.className = "recent-update-item";


        item.innerHTML = `

            <div class="recent-update-title">

                Store ${update.storeNumber}
                — ${update.technician}

            </div>


            <div class="recent-update-message">

                ${update.message}

            </div>


            <div class="recent-update-time">

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

    selectedStoreNumber = storeNumber;

    const overview =
        document.getElementById("overviewSection");

    const storeDetail =
        document.getElementById("storeDetailSection");


    if (overview) {

        overview.style.display = "none";

    }

    if (storeDetail) {

        storeDetail.style.display = "block";

    }


    renderStoreDetail();

}


// ============================================================
// STORE DETAIL
// ============================================================

function renderStoreDetail() {

    const store = getSelectedStore();

    if (!store) {

        return;

    }


    const storeNumberElement =
        document.getElementById("detailStoreNumber");

    const technicianElement =
        document.getElementById("detailTechnician");

    const currentNightElement =
        document.getElementById("detailCurrentNight");


    if (storeNumberElement) {

        storeNumberElement.textContent =
            `Store ${store.storeNumber}`;

    }

    if (technicianElement) {

        technicianElement.textContent =
            store.technician || "Unassigned";

    }

    if (currentNightElement) {

        currentNightElement.textContent =
            `Night ${store.currentNight || 1}`;

    }


    renderNightSections();

    renderScopeManagementOptions();

}


// ============================================================
// NIGHT SECTIONS
// ============================================================

function renderNightSections() {

    const container =
        document.getElementById("nightSections");

    if (!container) {

        return;

    }

    container.innerHTML = "";


    const store = getSelectedStore();

    if (!store) {

        return;

    }


    for (let night = 1; night <= 5; night++) {

        const section =
            document.createElement("div");

        section.className = "night-section";


        const nightTasks =
            (store.tasks || []).filter(
                task => task.night === night
            );


        let taskHtml = "";


        if (nightTasks.length === 0) {

            taskHtml = `

                <div class="no-scope">

                    No deployment scope added.

                </div>

            `;

        } else {

            nightTasks.forEach(task => {

                taskHtml += createScopeElement(task);

            });

        }


        section.innerHTML = `

            <div class="night-section-header">

                <h3>
                    Night ${night}
                </h3>

                <span>
                    ${nightTasks.length} scope(s)
                </span>

            </div>


            <div class="night-scope-list">

                ${taskHtml}

            </div>

        `;


        container.appendChild(section);

    }

}


// ============================================================
// CREATE SCOPE ELEMENT
// ============================================================

function createScopeElement(task) {

    const statusClass =
        getScopeStatusClass(task.status);


    const historyHtml =
        buildScopeHistoryHtml(task);


    const element =
        document.createElement("div");

    element.className =
        `scope-item ${statusClass}`;


    element.setAttribute(
        "data-task-id",
        task.id
    );


    element.innerHTML = `

        <div class="scope-main">

            <div class="scope-description">

                ${task.description}

            </div>


            <span class="scope-status ${statusClass}">

                ${task.status}

            </span>

        </div>


        ${
            historyHtml
                ? `
                    <div class="scope-history">

                        ${historyHtml}

                    </div>
                `
                : ""
        }


        <button
            class="delete-scope-btn"
            onclick="deleteScope(${task.id})"
        >

            Delete

        </button>

    `;


    // Long press behavior

    let pressTimer = null;


    element.addEventListener(
        "touchstart",
        function () {

            pressTimer = setTimeout(() => {

                element.classList.add(
                    "show-delete"
                );

            }, 700);

        }
    );


    element.addEventListener(
        "touchend",
        function () {

            clearTimeout(pressTimer);

        }
    );


    element.addEventListener(
        "touchmove",
        function () {

            clearTimeout(pressTimer);

        }
    );


    element.addEventListener(
        "contextmenu",
        function (event) {

            event.preventDefault();

            element.classList.add(
                "show-delete"
            );

        }
    );


    return element.outerHTML;

}


// ============================================================
// SCOPE HISTORY
// ============================================================

function buildScopeHistoryHtml(task) {

    if (!task.history || task.history.length === 0) {

        return "";

    }


    let html = "";


    task.history.forEach(history => {

        html += `

            <div class="scope-history-item">

                <strong>
                    ${history.action}
                </strong>

                <div>
                    ${history.timestamp || ""}
                </div>

                ${
                    history.reason
                        ? `
                            <div>
                                Reason: ${history.reason}
                            </div>
                        `
                        : ""
                }

                ${
                    history.fromNight
                        ? `
                            <div>
                                Night ${history.fromNight}
                                → Night ${history.toNight}
                            </div>
                        `
                        : ""
                }

            </div>

        `;

    });


    return html;

}


// ============================================================
// ADD DEPLOYMENT SCOPE
// ============================================================

function addScope() {

    const store = getSelectedStore();

    if (!store) {

        return;

    }


    const nightInput =
        document.getElementById("scopeNight");

    const scopeInput =
        document.getElementById("scopeDescription");


    if (!nightInput || !scopeInput) {

        return;

    }


    const night =
        Number(nightInput.value);


    const description =
        scopeInput.value.trim();


    if (!description) {

        alert("Please enter a deployment scope.");

        return;

    }


    const newTask = {

        id: nextTaskId++,

        night: night,

        description: description,

        // IMPORTANT:
        // Newly added scopes ALWAYS start as Not Started.

        status: "Not Started",

        history: [],

        originalScopeId: null

    };


    if (!store.tasks) {

        store.tasks = [];

    }


    store.tasks.push(newTask);


    scopeInput.value = "";


    renderStoreDetail();

}


// ============================================================
// SCOPE MANAGEMENT OPTIONS
// ============================================================

function renderScopeManagementOptions() {

    const select =
        document.getElementById("scopeManagementSelect");

    if (!select) {

        return;

    }


    const store = getSelectedStore();

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


        option.value = task.id;


        option.textContent =
            `Night ${task.night} — ${task.description} (${task.status})`;


        select.appendChild(option);

    });


    handleScopeActionChange();

}


// ============================================================
// SCOPE ACTION CHANGE
// ============================================================

function handleScopeActionChange() {

    const actionSelect =
        document.getElementById("scopeAction");

    const reasonGroup =
        document.getElementById("scopeReasonGroup");

    const moveGroup =
        document.getElementById("moveNightGroup");


    if (!actionSelect) {

        return;

    }


    const action =
        actionSelect.value;


    if (reasonGroup) {

        if (
            action === "pending" ||
            action === "cancel" ||
            action === "move"
        ) {

            reasonGroup.style.display = "block";

        } else {

            reasonGroup.style.display = "none";

        }

    }


    if (moveGroup) {

        if (action === "move") {

            moveGroup.style.display = "block";

        } else {

            moveGroup.style.display = "none";

        }

    }

}


// ============================================================
// APPLY SCOPE MANAGEMENT
// ============================================================

function applyScopeManagement() {

    const store = getSelectedStore();

    if (!store) {

        return;

    }


    const scopeSelect =
        document.getElementById("scopeManagementSelect");

    const actionSelect =
        document.getElementById("scopeAction");

    const reasonInput =
        document.getElementById("scopeReason");

    const targetNightSelect =
        document.getElementById("moveNight");


    if (!scopeSelect || !actionSelect) {

        return;

    }


    const taskId =
        Number(scopeSelect.value);


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
            item => item.id === taskId
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


    // --------------------------------------------------------
    // MARK AS PENDING
    // --------------------------------------------------------

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


        const previousStatus =
            task.status;


        task.status = "Pending";


        task.pendingReason =
            reason;


        if (!task.history) {

            task.history = [];

        }


        task.history.push({

            action: "Marked as Pending",

            timestamp: timestamp,

            night: task.night,

            previousStatus: previousStatus,

            reason: reason

        });


        showScopeManagementMessage(
            "Scope marked as Pending.",
            false
        );


        renderStoreDetail();

        return;

    }


    // --------------------------------------------------------
    // CANCEL SCOPE
    // --------------------------------------------------------

    if (action === "cancel") {

        if (task.status === "Completed") {

            showScopeManagementMessage(
                "Completed scopes cannot be cancelled.",
                true
            );

            return;

        }


        if (task.status === "Cancelled") {

            showScopeManagementMessage(
                "This scope is already cancelled.",
                true
            );

            return;

        }


        task.status = "Cancelled";


        task.cancellationReason =
            reason;


        if (!task.history) {

            task.history = [];

        }


        task.history.push({

            action: "Cancelled",

            timestamp: timestamp,

            night: task.night,

            reason: reason

        });


        showScopeManagementMessage(
            "Scope cancelled.",
            false
        );


        renderStoreDetail();

        return;

    }


    // --------------------------------------------------------
    // MOVE TO ANOTHER NIGHT
    // --------------------------------------------------------

    if (action === "move") {

        // Only Pending scopes can be moved.

        if (task.status !== "Pending") {

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
            Number(targetNightSelect.value);


        if (!targetNight) {

            showScopeManagementMessage(
                "Please select the target night.",
                true
            );

            return;

        }


        if (targetNight === task.night) {

            showScopeManagementMessage(
                "Please select a different night.",
                true
            );

            return;

        }


        if (!task.history) {

            task.history = [];

        }


        // Keep the ORIGINAL scope exactly where it was.
        // Example:
        // Night 1 = Pending
        //
        // Then create a NEW active copy on Night 2.

        const originalNight =
            task.night;


        const movedTask = {

            id: nextTaskId++,

            night: targetNight,

            description: task.description,

            status: "Not Started",

            history: [

                {

                    action: "Moved from Another Night",

                    timestamp: timestamp,

                    fromNight: originalNight,

                    toNight: targetNight,

                    reason: reason

                }

            ],

            originalScopeId: task.id,

            originalNight: originalNight

        };


        // Add history to the ORIGINAL Pending scope.

        task.history.push({

            action: "Moved to Another Night",

            timestamp: timestamp,

            fromNight: originalNight,

            toNight: targetNight,

            reason: reason

        });


        // Add new active copy.

        store.tasks.push(movedTask);


        showScopeManagementMessage(
            `Scope copied to Night ${targetNight}. Original Pending scope remains on Night ${originalNight}.`,
            false
        );


        renderStoreDetail();

        return;

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


    element.textContent = message;


    if (isError) {

        element.className =
            "scope-management-message error";

    } else {

        element.className =
            "scope-management-message success";

    }

}


// ============================================================
// DELETE SCOPE
// ============================================================

function deleteScope(taskId) {

    const store = getSelectedStore();

    if (!store) {

        return;

    }


    const task =
        store.tasks.find(
            item => item.id === taskId
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
            item => item.id !== taskId
        );


    renderStoreDetail();

}


// ============================================================
// EDIT STORE INFORMATION
// ============================================================

function editStoreInfo() {

    const store = getSelectedStore();

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

        alert("Store Number cannot be empty.");

        return;

    }


    // Check duplicate store number.

    const duplicate =
        stores.some(
            item =>
                item !== store &&
                item.storeNumber === cleanedStoreNumber
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


    const cleanedTechnician =
        newTechnician.trim();


    store.storeNumber =
        cleanedStoreNumber;


    store.technician =
        cleanedTechnician || "Unassigned";


    selectedStoreNumber =
        store.storeNumber;


    renderStoreDetail();


    alert("Store information updated.");

}


// ============================================================
// NIGHT ASSIGNMENT
// ============================================================

function saveNightAssignment() {

    const store = getSelectedStore();

    if (!store) {

        return;

    }


    const nightSelect =
        document.getElementById(
            "currentNightAssignment"
        );


    if (!nightSelect) {

        return;

    }


    const selectedNight =
        Number(nightSelect.value);


    if (!selectedNight) {

        return;

    }


    store.currentNight =
        selectedNight;


    renderStoreDetail();


    alert(
        `Current deployment night updated to Night ${selectedNight}.`
    );

}


// ============================================================
// BACK TO OVERVIEW
// ============================================================

function backToOverview() {

    const overview =
        document.getElementById(
            "overviewSection"
        );

    const storeDetail =
        document.getElementById(
            "storeDetailSection"
        );


    if (storeDetail) {

        storeDetail.style.display = "none";

    }


    if (overview) {

        overview.style.display = "block";

    }


    selectedStoreNumber = null;


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


// ============================================================
// EVENT LISTENERS
// ============================================================

function setupEventListeners() {

    // Add Scope

    const addScopeButton =
        document.getElementById(
            "addScopeButton"
        );


    if (addScopeButton) {

        addScopeButton.addEventListener(
            "click",
            addScope
        );

    }


    // Scope action dropdown

    const scopeAction =
        document.getElementById(
            "scopeAction"
        );


    if (scopeAction) {

        scopeAction.addEventListener(
            "change",
            handleScopeActionChange
        );

    }


    // Apply scope management

    const applyScopeButton =
        document.getElementById(
            "applyScopeManagement"
        );


    if (applyScopeButton) {

        applyScopeButton.addEventListener(
            "click",
            applyScopeManagement
        );

    }


    // Edit Store

    const editStoreButton =
        document.getElementById(
            "editStoreButton"
        );


    if (editStoreButton) {

        editStoreButton.addEventListener(
            "click",
            editStoreInfo
        );

    }


    // Back button

    const backButton =
        document.getElementById(
            "backToOverviewButton"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            backToOverview
        );

    }


    // Night assignment

    const saveNightButton =
        document.getElementById(
            "saveNightAssignment"
        );


    if (saveNightButton) {

        saveNightButton.addEventListener(
            "click",
            saveNightAssignment
        );

    }

}
