/* =========================================================
   DEPLOYMENT TRACKER
   ========================================================= */

/* =========================================================
   STORE TIMEZONES
   Store timezone labels mapped to IANA timezone names.
   IANA automatically handles daylight saving time.
   ========================================================= */

const STORE_TIMEZONES = {
    EST: "America/New_York",
    CST: "America/Chicago",
    MST: "America/Denver",
    ARZ: "America/Phoenix",
    PST: "America/Los_Angeles",
    "Puerto Rico": "America/Puerto_Rico",
    Guam: "Pacific/Guam",
    Hawaii: "Pacific/Honolulu"
};


/* =========================================================
   SAMPLE STORE DATA
   ========================================================= */

let stores = [
    {
        id: 1,
        number: "0123",
        technician: "Tech A",
        currentNight: 3,
        timezone: "EST",
        checkIn: "2026-10-05 16:11",
        scopes: [
            {
                id: 101,
                night: 1,
                description: "Remove registers",
                status: "Completed",
                reason: ""
            },
            {
                id: 102,
                night: 2,
                description: "Remove fixtures",
                status: "Completed",
                reason: ""
            },
            {
                id: 103,
                night: 3,
                description: "Install new registers",
                status: "Not Started",
                reason: ""
            }
        ],
        fixtureHandovers: {}
    },

    {
        id: 2,
        number: "0456",
        technician: "Tech B",
        currentNight: 1,
        timezone: "PST",
        checkIn: "2026-10-05 16:11",
        scopes: [
            {
                id: 201,
                night: 1,
                description: "Register removal",
                status: "In Progress",
                reason: ""
            }
        ],
        fixtureHandovers: {}
    },

    {
        id: 3,
        number: "0789",
        technician: "Tech C",
        currentNight: 2,
        timezone: "CST",
        checkIn: "",
        scopes: [
            {
                id: 301,
                night: 2,
                description: "Fixture removal",
                status: "Not Started",
                reason: ""
            }
        ],
        fixtureHandovers: {}
    },

    {
        id: 4,
        number: "1011",
        technician: "Tech D",
        currentNight: 1,
        timezone: "MST",
        checkIn: "",
        scopes: [],
        fixtureHandovers: {}
    },

    {
        id: 5,
        number: "1213",
        technician: "Tech E",
        currentNight: 2,
        timezone: "EST",
        checkIn: "",
        scopes: [],
        fixtureHandovers: {}
    },

    {
        id: 6,
        number: "1415",
        technician: "Tech F",
        currentNight: 4,
        timezone: "PST",
        checkIn: "",
        scopes: [],
        fixtureHandovers: {}
    }
];


/* =========================================================
   APP STATE
   ========================================================= */

let selectedStoreId = null;

let recentUpdates = [];

let longPressTimer = null;


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeStores();
    setupDeploymentNightSelect();
    renderOverview();
});


function initializeStores() {
    stores.forEach(store => {
        if (!Array.isArray(store.scopes)) {
            store.scopes = [];
        }

        if (!store.fixtureHandovers) {
            store.fixtureHandovers = {};
        }
    });
}


/* =========================================================
   TIMEZONE HELPERS
   ========================================================= */

/*
   Detects the timezone of the device/browser being used.

   Example:
   Philippines:
   Asia/Manila

   US Eastern:
   America/New_York
*/
function getDeviceTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}


/*
   Returns the selected store timezone label.
*/
function getStoreTimezone(store) {
    return store?.timezone || "EST";
}


/*
   Converts a store timezone label to its IANA timezone.
*/
function getStoreIanaTimezone(storeOrTimezone) {
    let timezoneLabel = "EST";

    if (typeof storeOrTimezone === "object" && storeOrTimezone !== null) {
        timezoneLabel = getStoreTimezone(storeOrTimezone);
    } else if (typeof storeOrTimezone === "string") {
        timezoneLabel = normalizeStoreTimezone(storeOrTimezone) || storeOrTimezone;
    }

    return STORE_TIMEZONES[timezoneLabel] || "America/New_York";
}


/*
   Accepts timezone names such as:
   EST
   CST
   MST
   ARZ
   PST
   Puerto Rico
   Guam
   Hawaii
*/
function normalizeStoreTimezone(value) {
    if (!value) {
        return null;
    }

    const cleaned = String(value).trim().toLowerCase();

    const aliases = {
        "est": "EST",
        "eastern": "EST",
        "eastern time": "EST",
        "et": "EST",

        "cst": "CST",
        "central": "CST",
        "central time": "CST",
        "ct": "CST",

        "mst": "MST",
        "mountain": "MST",
        "mountain time": "MST",
        "mt": "MST",

        "arz": "ARZ",
        "arizona": "ARZ",
        "az": "ARZ",

        "pst": "PST",
        "pacific": "PST",
        "pacific time": "PST",
        "pt": "PST",

        "puerto rico": "Puerto Rico",
        "puerto rico time": "Puerto Rico",
        "pr": "Puerto Rico",

        "guam": "Guam",

        "hawaii": "Hawaii",
        "hawaiian": "Hawaii"
    };

    return aliases[cleaned] || null;
}


/* =========================================================
   CURRENT TIMESTAMP
   ========================================================= */

/*
   IMPORTANT:
   We store system-generated timestamps as ISO timestamps.

   Example:
   2026-10-07T03:28:00.000Z

   This represents one exact moment in time.

   When displayed, it is converted automatically from
   the user's device timezone to the store timezone.
*/
function getCurrentTimestamp() {
    return new Date().toISOString();
}


/* =========================================================
   FORMAT SYSTEM TIMESTAMPS
   ========================================================= */

function formatInstantForStore(timestamp, store) {
    if (!timestamp) {
        return "";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return String(timestamp);
    }

    const timezone = getStoreIanaTimezone(store);

    return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short"
    }).format(date);
}


/*
   Time-only version.

   Used when displaying Fixture Handover if needed.
*/
function formatInstantTimeForStore(timestamp, store) {
    if (!timestamp) {
        return "";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return String(timestamp);
    }

    const timezone = getStoreIanaTimezone(store);

    return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short"
    }).format(date);
}


/* =========================================================
   LEGACY TIMESTAMP SUPPORT
   ========================================================= */

/*
   Existing sample data uses:
   YYYY-MM-DD HH:MM

   These older timestamps are already stored as store-local
   time, so we DO NOT convert them.

   This prevents existing data from changing unexpectedly.
*/
function formatLegacyTimestamp(timestamp, timezoneLabel) {
    if (!timestamp) {
        return "";
    }

    const match = String(timestamp).match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/
    );

    if (!match) {
        return String(timestamp);
    }

    const [
        ,
        year,
        month,
        day,
        hour,
        minute
    ] = match;

    const date = new Date(
        Date.UTC(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute)
        )
    );

    const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: "UTC",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).format(date);

    return `${formatted} ${timezoneLabel}`;
}


/*
   Main timestamp formatter.

   New ISO timestamps:
   Device timezone -> Store timezone automatically.

   Old timestamps:
   Preserve as store-local time.
*/
function getDisplayTimestamp(timestamp, storeOrTimezone) {
    if (!timestamp) {
        return "";
    }

    const timezoneLabel =
        typeof storeOrTimezone === "object"
            ? getStoreTimezone(storeOrTimezone)
            : normalizeStoreTimezone(storeOrTimezone) || storeOrTimezone || "EST";

    const isLegacy =
        /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}$/.test(String(timestamp));

    if (isLegacy) {
        return formatLegacyTimestamp(timestamp, timezoneLabel);
    }

    return formatInstantForStore(timestamp, {
        timezone: timezoneLabel
    });
}


/* =========================================================
   DEPLOYMENT NIGHT SELECTS
   ========================================================= */

function setupDeploymentNightSelect() {
    const selects = [
        document.getElementById("assignedNight"),
        document.getElementById("scopeNight"),
        document.getElementById("moveToNight")
    ];

    selects.forEach(select => {
        if (!select) {
            return;
        }

        const currentValue = select.value;

        if (!select.querySelector('option[value=""]')) {
            const placeholder = document.createElement("option");

            placeholder.value = "";
            placeholder.textContent = "Select deployment night";

            select.insertBefore(
                placeholder,
                select.firstChild
            );
        }

        /*
           Make placeholder the default when no value
           has already been selected.
        */
        if (!currentValue) {
            select.value = "";
        }
    });
}


/* =========================================================
   OVERVIEW
   ========================================================= */

function renderOverview() {
    renderSummary();
    renderStoreGrid();
    renderRecentUpdates();
}


function renderSummary() {
    const totalStores = stores.length;

    let inProgress = 0;
    let completed = 0;
    let checkedIn = 0;

    stores.forEach(store => {
        const status = getStoreStatus(store);

        if (status === "In Progress") {
            inProgress++;
        }

        if (status === "Completed") {
            completed++;
        }

        if (store.checkIn) {
            checkedIn++;
        }
    });

    const totalStoresElement =
        document.getElementById("totalStores");

    const inProgressElement =
        document.getElementById("inProgressStores");

    const completedElement =
        document.getElementById("completedStores");

    const checkedInElement =
        document.getElementById("checkedInStores");

    if (totalStoresElement) {
        totalStoresElement.textContent = totalStores;
    }

    if (inProgressElement) {
        inProgressElement.textContent = inProgress;
    }

    if (completedElement) {
        completedElement.textContent = completed;
    }

    if (checkedInElement) {
        checkedInElement.textContent = checkedIn;
    }
}


/* =========================================================
   STORE STATUS / PROGRESS
   ========================================================= */

/*
   IMPORTANT:
   Fixture Handover is NOT included in scope progress.

   It is documentation only.
*/
function getStoreProgress(store) {
    const scopes = store.scopes || [];

    if (scopes.length === 0) {
        return 0;
    }

    const completed = scopes.filter(
        scope => scope.status === "Completed"
    ).length;

    return Math.round(
        (completed / scopes.length) * 100
    );
}


function getStoreStatus(store) {
    const scopes = store.scopes || [];

    if (scopes.length === 0) {
        return "Not Started";
    }

    const completed = scopes.every(
        scope => scope.status === "Completed"
    );

    if (completed) {
        return "Completed";
    }

    const hasStarted = scopes.some(
        scope =>
            scope.status === "In Progress" ||
            scope.status === "Completed" ||
            scope.status === "Pending" ||
            scope.status === "Cancelled" ||
            scope.status === "Moved to Another Night"
    );

    if (hasStarted) {
        return "In Progress";
    }

    return "Not Started";
}


/* =========================================================
   STORE GRID
   ========================================================= */

function renderStoreGrid() {
    const grid = document.getElementById("storeGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    stores.forEach(store => {
        const status = getStoreStatus(store);
        const progress = getStoreProgress(store);

        const card = document.createElement("div");

        card.className = "store-card";

        card.onclick = () => openStoreDetail(store.id);

        card.innerHTML = `
            <div class="store-card-header">
                <div>
                    <span class="eyebrow">Store</span>
                    <h3>${escapeHtml(store.number)}</h3>
                </div>
                <span class="status-badge ${getStatusClass(status)}">
                    ${escapeHtml(status)}
                </span>
            </div>

            <div class="store-card-info">
                <div>
                    <span>Technician</span>
                    <strong>${escapeHtml(store.technician || "Unassigned")}</strong>
                </div>

                <div>
                    <span>Current Night</span>
                    <strong>
                        ${store.currentNight
                            ? `Night ${store.currentNight}`
                            : "Not Assigned"}
                    </strong>
                </div>

                <div>
                    <span>Timezone</span>
                    <strong>${escapeHtml(getStoreTimezone(store))}</strong>
                </div>

                <div>
                    <span>Check-In</span>
                    <strong>
                        ${
                            store.checkIn
                                ? getDisplayTimestamp(store.checkIn, store)
                                : "Not Checked In"
                        }
                    </strong>
                </div>
            </div>

            <div class="progress-section">
                <div class="progress-label">
                    <span>Scope Progress</span>
                    <strong>${progress}%</strong>
                </div>

                <div class="progress-bar">
                    <div
                        class="progress-fill"
                        style="width: ${progress}%"
                    ></div>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}


function getStatusClass(status) {
    return String(status)
        .toLowerCase()
        .replace(/\s+/g, "-");
}


/* =========================================================
   RECENT UPDATES
   ========================================================= */

function addRecentUpdate(store, message, source = "deployment") {
    recentUpdates.unshift({
        id: Date.now() + Math.random(),
        storeId: store.id,
        storeNumber: store.number,
        technician: store.technician,
        message,
        source,
        timestamp: getCurrentTimestamp()
    });

    /*
       Keep only the latest 50 updates.
    */
    recentUpdates = recentUpdates.slice(0, 50);
}


function renderRecentUpdates() {
    const container =
        document.getElementById("recentUpdates");

    if (!container) {
        return;
    }

    if (recentUpdates.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                No recent updates yet.
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    recentUpdates.forEach(update => {
        const store = stores.find(
            item => item.id === update.storeId
        );

        if (!store) {
            return;
        }

        const item = document.createElement("div");

        item.className = "update-item";

        item.innerHTML = `
            <div class="update-item-main">
                <strong>
                    Store ${escapeHtml(update.storeNumber)}
                </strong>

                <p>${escapeHtml(update.message)}</p>

                <span>
                    ${escapeHtml(update.technician || "Unknown")}
                </span>
            </div>

            <div class="update-item-time">
                ${escapeHtml(
                    getDisplayTimestamp(
                        update.timestamp,
                        store
                    )
                )}
            </div>
        `;

        container.appendChild(item);
    });
}


/* =========================================================
   OPEN STORE DETAIL
   ========================================================= */

function openStoreDetail(storeId) {
    selectedStoreId = storeId;

    const store = stores.find(
        item => item.id === storeId
    );

    if (!store) {
        return;
    }

    document
        .getElementById("overviewPage")
        ?.classList.add("hidden");

    document
        .getElementById("storeDetailPage")
        ?.classList.remove("hidden");

    renderStoreDetail();
}


function backToOverview() {
    selectedStoreId = null;

    document
        .getElementById("storeDetailPage")
        ?.classList.add("hidden");

    document
        .getElementById("overviewPage")
        ?.classList.remove("hidden");

    renderOverview();
}


/* =========================================================
   STORE DETAIL
   ========================================================= */

function renderStoreDetail() {
    const store = stores.find(
        item => item.id === selectedStoreId
    );

    if (!store) {
        return;
    }

    document.getElementById("detailStoreNumber").textContent =
        store.number;

    document.getElementById("detailStoreNumberInfo").textContent =
        store.number;

    document.getElementById("detailTechnician").textContent =
        store.technician || "Unassigned";

    document.getElementById("detailCurrentNight").textContent =
        store.currentNight
            ? `Night ${store.currentNight}`
            : "Not Assigned";

    document.getElementById("detailTimezone").textContent =
        getStoreTimezone(store);

    document.getElementById("detailCheckIn").textContent =
        store.checkIn
            ? getDisplayTimestamp(store.checkIn, store)
            : "Not Checked In";

    document.getElementById("detailStoreStatus").textContent =
        `${getStoreStatus(store)} • ${getStoreProgress(store)}% scope progress`;

    const assignedNight =
        document.getElementById("assignedNight");

    if (assignedNight) {
        assignedNight.value =
            store.currentNight
                ? String(store.currentNight)
                : "";
    }

    renderManageScopeDropdown();
    renderNightSections();
}


/* =========================================================
   CHECK-IN
   ========================================================= */

function checkInTechnician() {
    const store = stores.find(
        item => item.id === selectedStoreId
    );

    if (!store) {
        return;
    }

    /*
       System timestamp = exact phone/browser moment.
       It will automatically display in the store timezone.
    */
    store.checkIn = getCurrentTimestamp();

    addRecentUpdate(
        store,
        "Technician checked in.",
        "technician"
    );

    renderStoreDetail();
    renderOverview();
}


/* =========================================================
   SCOPE ASSIGNMENT
   ========================================================= */

function saveNightAssignment() {
    const store = stores.find(
        item => item.id === selectedStoreId
    );

    if (!store) {
        return;
    }

    const select =
        document.getElementById("assignedNight");

    const night = select?.value;

    if (!night) {
        showMessage(
            "assignmentMessage",
            "Please select a deployment night."
        );

        return;
    }

    store.currentNight = Number(night);

    addRecentUpdate(
        store,
        `Current deployment night updated to Night ${night}.`,
        "deployment"
    );

    showMessage(
        "assignmentMessage",
        `Assignment updated to Night ${night}.`
    );

    renderStoreDetail();
    renderOverview();
}


/* =========================================================
   ADD DEPLOYMENT SCOPE
   ========================================================= */

function addScope() {
    const store = stores.find(
        item => item.id === selectedStoreId
    );

    if (!store) {
        return;
    }

    const night =
        document.getElementById("scopeNight")?.value;

    const description =
        document
            .getElementById("scopeDescription")
            ?.value
            .trim();

    if (!night) {
        alert("Please select a deployment night.");
        return;
    }

    if (!description) {
        alert("Please enter a deployment scope.");
        return;
    }

    const scope = {
        id: Date.now() + Math.random(),
        night: Number(night),
        description,
        status: "Not Started",
        reason: ""
    };

    store.scopes.push(scope);

    addRecentUpdate(
        store,
        `Added scope "${description}" to Night ${night}.`,
        "deployment"
    );

    document.getElementById("scopeDescription").value = "";

    renderStoreDetail();
    renderOverview();
}


/* =========================================================
   MANAGE SCOPE DROPDOWN
   ========================================================= */

function renderManageScopeDropdown() {
    const select =
        document.getElementById("manageScope");

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="">Select scope</option>
    `;

    const store = stores.find(
        item => item.id === selectedStoreId
    );

    if (!store) {
        return;
    }

    store.scopes.forEach(scope => {
        const option = document.createElement("option");

        option.value = String(scope.id);

        option.textContent =
            `Night ${scope.night} — ${scope.description}`;

        select.appendChild(option);
    });
}


/* =========================================================
   SCOPE ACTION UI
   ========================================================= */

function handleScopeActionChange() {
    const action =
        document.getElementById("scopeAction")?.value;

    const reasonGroup =
        document.getElementById("scopeReasonGroup");

    const moveGroup =
        document.getElementById("moveNightGroup");

    if (!reasonGroup || !moveGroup) {
        return;
    }

    const needsReason =
        action === "pending" ||
        action === "cancel" ||
        action === "move";

    reasonGroup.classList.toggle(
        "hidden",
        !needsReason
    );

    moveGroup.classList.toggle(
        "hidden",
        action !== "move"
    );
}


/* =========================================================
   APPLY SCOPE MANAGEMENT
   ========================================================= */

function applyScopeManagement() {
    const store = stores.find(
        item => item.id === selectedStoreId
    );

    if (!store) {
        return;
    }

    const scopeId =
        document.getElementById("manageScope")?.value;

    const action =
        document.getElementById("scopeAction")?.value;

    const reason =
        document
            .getElementById("scopeReason")
            ?.value
            .trim();

    if (!scopeId) {
        alert("Please select a scope.");
        return;
    }

    if (!action) {
        alert("Please select an action.");
        return;
    }

    const scope = store.scopes.find(
        item => String(item.id) === String(scopeId)
    );

    if (!scope) {
        return;
    }

    if (
        (
            action === "pending" ||
            action === "cancel" ||
            action === "move"
        ) &&
        !reason
    ) {
        alert("Please enter a reason or notes.");
        return;
    }

    if (action === "pending") {
        scope.status = "Pending";
        scope.reason = reason;

        addRecentUpdate(
            store,
            `Scope "${scope.description}" marked as Pending. Reason: ${reason}`,
            "deployment"
        );

        showMessage(
            "scopeManagementMessage",
            "Scope marked as Pending."
        );
    }

    else if (action === "cancel") {
        scope.status = "Cancelled";
        scope.reason = reason;

        addRecentUpdate(
            store,
            `Scope "${scope.description}" was cancelled. Reason: ${reason}`,
            "deployment"
        );

        showMessage(
            "scopeManagementMessage",
            "Scope cancelled."
        );
    }

    else if (action === "move") {
        const moveTo =
            document.getElementById("moveToNight")?.value;

        if (!moveTo) {
            alert("Please select the night to move the scope to.");
            return;
        }

        const oldNight = scope.night;

        scope.night = Number(moveTo);
        scope.status = "Moved to Another Night";
        scope.reason = reason;

        addRecentUpdate(
            store,
            `Scope "${scope.description}" moved from Night ${oldNight} to Night ${moveTo}. Reason: ${reason}`,
            "deployment"
        );

        showMessage(
            "scopeManagementMessage",
            `Scope moved to Night ${moveTo}.`
        );
    }

    document.getElementById("scopeReason").value = "";
    document.getElementById("scopeAction").value = "";
    document.getElementById("manageScope").value = "";

    handleScopeActionChange();

    renderStoreDetail();
    renderOverview();
}


/* =========================================================
   NIGHT SECTIONS
   ========================================================= */

function renderNightSections() {
    const container =
        document.getElementById("nightSections");

    if (!container) {
        return;
    }

    const store = stores.find(
        item => item.id === selectedStoreId
    );

    if (!store) {
        return;
    }

    container.innerHTML = "";

    for (let night = 1; night <= 5; night++) {
        const scopes =
            store.scopes.filter(
                scope => Number(scope.night) === night
            );

        const section =
            document.createElement("div");

        section.className = "night-section";

        section.innerHTML = `
            <div class="night-section-header">
                <div>
                    <h4>Night ${night}</h4>
                    <p>
                        ${
                            scopes.length
                                ? `${scopes.length} scope${scopes.length === 1 ? "" : "s"}`
                                : "No deployment scope assigned"
                        }
                    </p>
                </div>
            </div>

            <div class="scope-list">
                ${
                    scopes.length
                        ? scopes.map(scope =>
                            renderScopeItem(scope)
                        ).join("")
                        : `
                            <div class="empty-scope">
                                No scope assigned for this night.
                            </div>
                        `
                }
            </div>

            <!-- Fixture Handover is separate from scope -->
            ${renderFixtureHandover(store, night)}
        `;

        container.appendChild(section);

        attachLongPressHandlers(section);
    }
}


/* =========================================================
   SCOPE ITEM
   ========================================================= */

function renderScopeItem(scope) {
    return `
        <div
            class="scope-item"
            data-scope-id="${scope.id}"
        >
            <div class="scope-item-main">
                <strong>${escapeHtml(scope.description)}</strong>

                <span class="scope-status ${getStatusClass(scope.status)}">
                    ${escapeHtml(scope.status)}
                </span>

                ${
                    scope.reason
                        ? `
                            <p class="scope-reason">
                                ${escapeHtml(scope.reason)}
                            </p>
                        `
                        : ""
                }
            </div>

            <div class="scope-actions hidden">
                <button
                    type="button"
                    onclick="editScopeReason(${scope.id})"
                >
                    Edit Reason
                </button>

                <button
                    type="button"
                    onclick="deleteScope(${scope.id})"
                >
                    Delete
                </button>
            </div>
        </div>
    `;
}


/* =========================================================
   LONG PRESS
   ========================================================= */

function attachLongPressHandlers(container) {
    const scopeItems =
        container.querySelectorAll(".scope-item");

    scopeItems.forEach(item => {
        const actions =
            item.querySelector(".scope-actions");

        if (!actions) {
            return;
        }

        item.addEventListener("mousedown", () => {
            longPressTimer = setTimeout(() => {
                actions.classList.remove("hidden");
            }, 600);
        });

        item.addEventListener("mouseup", () => {
            clearTimeout(longPressTimer);
        });

        item.addEventListener("mouseleave", () => {
            clearTimeout(longPressTimer);
        });

        item.addEventListener("touchstart", () => {
            longPressTimer = setTimeout(() => {
                actions.classList.remove("hidden");
            }, 600);
        }, { passive: true });

        item.addEventListener("touchend", () => {
            clearTimeout(longPressTimer);
        });

        item.addEventListener("touchmove", () => {
            clearTimeout(longPressTimer);
        });
    });
}


/* =========================================================
   EDIT SCOPE REASON
   ========================================================= */

function editScopeReason(scopeId) {
    const store = stores.find(
        item => item.id === selectedStoreId
    );

    if (!store) {
        return;
    }

    const scope = store.scopes.find(
        item => String(item.id) === String(scopeId)
    );

    if (!scope) {
        return;
    }

    const newReason = prompt(
        "Edit reason / notes:",
        scope.reason || ""
    );

    if (newReason === null) {
        return;
    }

    scope.reason = newReason.trim();

    addRecentUpdate(
        store,
        `Reason updated for scope "${scope.description}".`,
        "deployment"
    );

    renderStoreDetail();
    renderOverview();
}


/* =========================================================
   DELETE SCOPE
   ========================================================= */

function deleteScope(scopeId) {
    const store = stores.find(
        item => item.id === selectedStoreId
    );

    if (!store) {
        return;
    }

    const scopeIndex = store.scopes.findIndex(
        item => String(item.id) === String(scopeId)
    );

    if (scopeIndex === -1) {
        return;
    }

    const scope = store.scopes[scopeIndex];

    const confirmed = confirm(
        `Delete scope "${scope.description}"?`
    );

    if (!confirmed) {
        return;
    }

    store.scopes.splice(scopeIndex, 1);

    addRecentUpdate(
        store,
        `Deleted scope "${scope.description}".`,
        "deployment"
    );

    renderStoreDetail();
    renderOverview();
}


/* =========================================================
   FIXTURE HANDOVER
   ========================================================= */

/*
   IMPORTANT SPECIAL RULE:

   Fixture Handover input is ALREADY in STORE TIME.

   Example:
   Store timezone = EST
   Technician enters = 11:28 PM

   We DO NOT convert 11:28 PM from the phone timezone.

   We simply save/display:
   11:28 PM EST

   The phone/browser timezone is NOT used for the
   Fixture Handover TIME ITSELF.

   Only the "saved/updated at" Recent Update timestamp
   uses automatic phone timezone -> store timezone conversion.
*/

function renderFixtureHandover(store, night) {
    const handover =
        store.fixtureHandovers?.[night];

    if (!handover) {
        return `
            <div class="fixture-handover">
                <div class="fixture-handover-header">
                    <div>
                        <strong>Fixture Handover</strong>
                        <span>
                            Enter the handover time in store local time.
                        </span>
                    </div>

                    <div class="fixture-handover-input">
                        <input
                            type="time"
                            id="fixtureTime-${store.id}-${night}"
                        />

                        <button
                            type="button"
                            onclick="saveFixtureHandover(${night})"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="fixture-handover">
            <div class="fixture-handover-header">
                <div>
                    <strong>Fixture Handover</strong>

                    <span>
                        Handover time:
                        ${escapeHtml(handover.time)}
                        ${escapeHtml(getStoreTimezone(store))}
                    </span>
                </div>

                <button
                    type="button"
                    class="secondary-button"
                    onclick="editFixtureHandover(${night})"
                >
                    Edit
                </button>
            </div>
        </div>
    `;
}


/*
   Save Fixture Handover.

   The entered value is treated as STORE LOCAL TIME.
   No phone timezone conversion happens here.
*/
function saveFixtureHandover(night) {
    const store = stores.find(
        item => item.id === selectedStoreId
    );

    if (!store) {
        return;
    }

    const input =
        document.getElementById(
            `fixtureTime-${store.id}-${night}`
        );

    if (!input || !input.value) {
        alert("Please enter the fixture handover time.");
        return;
    }

    const enteredTime = input.value;

    if (!store.fixtureHandovers) {
        store.fixtureHandovers = {};
    }

    store.fixtureHandovers[night] = {
        time: formatTimeForDisplay(enteredTime),
        updatedAt: getCurrentTimestamp()
    };

    /*
       IMPORTANT:
       The handover time in the message is exactly what
       the technician entered. It is NOT converted.
    */
    addRecentUpdate(
        store,
        `Fixture Handover recorded for Night ${night} at ${formatTimeForDisplay(enteredTime)} ${getStoreTimezone(store)}.`,
        "technician"
    );

    renderStoreDetail();
    renderOverview();
}


/*
   Edit Fixture Handover.

   Again, no timezone conversion.
*/
function editFixtureHandover(night) {
    const store = stores.find(
        item => item.id === selectedStoreId
    );

    if (!store) {
        return;
    }

    const handover =
        store.fixtureHandovers?.[night];

    if (!handover) {
        return;
    }

    const currentTime =
        convertDisplayTimeToInput(handover.time);

    const newTime = prompt(
        `Enter Fixture Handover time in ${getStoreTimezone(store)}:`,
        currentTime
    );

    if (newTime === null) {
        return;
    }

    const cleanedTime = normalizeTimeInput(newTime);

    if (!cleanedTime) {
        alert("Please enter a valid time such as 11:28 PM.");
        return;
    }

    handover.time =
        formatTimeForDisplay(cleanedTime);

    /*
       Updated timestamp = actual moment the technician
       edited it. This timestamp DOES use automatic
       phone timezone -> store timezone conversion.
    */
    handover.updatedAt = getCurrentTimestamp();

    addRecentUpdate(
        store,
        `Fixture Handover updated for Night ${night} to ${handover.time} ${getStoreTimezone(store)}.`,
        "technician"
    );

    renderStoreDetail();
    renderOverview();
}


/* =========================================================
   FIXTURE HANDOVER TIME HELPERS
   ========================================================= */

function normalizeTimeInput(value) {
    if (!value) {
        return null;
    }

    const trimmed = String(value).trim();

    /*
       Native input format:
       HH:MM
    */
    if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
        const [hour, minute] =
            trimmed.split(":").map(Number);

        if (
            hour >= 0 &&
            hour <= 23 &&
            minute >= 0 &&
            minute <= 59
        ) {
            return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        }
    }

    /*
       Also accept:
       11:28 PM
       11:28AM
       7:05 pm
    */
    const match =
        trimmed.match(
            /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
        );

    if (!match) {
        return null;
    }

    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const period = match[3].toUpperCase();

    if (
        hour < 1 ||
        hour > 12 ||
        minute < 0 ||
        minute > 59
    ) {
        return null;
    }

    if (period === "AM") {
        if (hour === 12) {
            hour = 0;
        }
    } else {
        if (hour !== 12) {
            hour += 12;
        }
    }

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}


function formatTimeForDisplay(value) {
    if (!value) {
        return "";
    }

    const normalized = normalizeTimeInput(value);

    if (!normalized) {
        return String(value);
    }

    const [hour, minute] =
        normalized.split(":").map(Number);

    const date = new Date();

    date.setHours(hour, minute, 0, 0);

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).format(date);
}


/*
   Converts displayed 12-hour time back to native
   input format for editing.

   Example:
   11:28 PM -> 23:28
*/
function convertDisplayTimeToInput(value) {
    return normalizeTimeInput(value) || "";
}


/* =========================================================
   EDIT STORE / TECHNICIAN / TIMEZONE
   ========================================================= */

function editStoreInfo() {
    const store = stores.find(
        item => item.id === selectedStoreId
    );

    if (!store) {
        return;
    }

    const newTechnician = prompt(
        "Technician:",
        store.technician || ""
    );

    if (newTechnician === null) {
        return;
    }

    const timezoneList =
        Object.keys(STORE_TIMEZONES).join(", ");

    const timezoneInput = prompt(
        `Store Timezone:\n\nAvailable: ${timezoneList}`,
        getStoreTimezone(store)
    );

    if (timezoneInput === null) {
        return;
    }

    const newTimezone =
        normalizeStoreTimezone(timezoneInput);

    if (!newTimezone) {
        alert(
            `Invalid timezone.\n\nPlease use one of:\n${timezoneList}`
        );

        return;
    }

    store.technician =
        newTechnician.trim() || "Unassigned";

    store.timezone = newTimezone;

    addRecentUpdate(
        store,
        `Store information updated. Technician: ${store.technician}. Timezone: ${newTimezone}.`,
        "deployment"
    );

    renderStoreDetail();
    renderOverview();
}


/* =========================================================
   UI MESSAGE
   ========================================================= */

function showMessage(elementId, message) {
    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.textContent = message;
    element.classList.remove("hidden");

    clearTimeout(element._messageTimer);

    element._messageTimer =
        setTimeout(() => {
            element.textContent = "";
            element.classList.add("hidden");
        }, 5000);
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   OPTIONAL: SEED EXISTING CHECK-INS INTO RECENT UPDATES
   ========================================================= */

function seedExistingCheckIns() {
    stores.forEach(store => {
        if (!store.checkIn) {
            return;
        }

        /*
           Don't add duplicate seed updates.
        */
        const alreadyExists =
            recentUpdates.some(
                update =>
                    update.storeId === store.id &&
                    update.message === "Technician checked in."
            );

        if (alreadyExists) {
            return;
        }

        recentUpdates.push({
            id: Date.now() + Math.random(),
            storeId: store.id,
            storeNumber: store.number,
            technician: store.technician,
            message: "Technician checked in.",
            source: "technician",
            timestamp: store.checkIn
        });
    });

    recentUpdates.sort(
        (a, b) =>
            new Date(b.timestamp) -
            new Date(a.timestamp)
    );

    recentUpdates =
        recentUpdates.slice(0, 50);
}


/* =========================================================
   INITIAL CHECK-IN DATA
   ========================================================= */

seedExistingCheckIns();
