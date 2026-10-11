/* =========================================================
   TECHNICIAN PORTAL
   UI + SESSION ACTIVITY TIMESTAMPS
   ========================================================= */


/* =========================================================
   TIMEZONE MAPPING
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
   SAMPLE TECHNICIAN DATA
   All equipment starts as Not Checked.
   ========================================================= */

const technicianStores = {

    "0123": {
        technician: "Technician A",
        timezone: "EST",
        currentNight: 1,

        equipment: createDefaultEquipment(),

        scopes: [
            {
                id: "SCOPE-001",
                title: "Install Register 1 to new HCS",
                status: "Not Started",
                note: "",
                noteUpdatedAt: null,
                statusUpdatedAt: null
            },
            {
                id: "SCOPE-002",
                title: "Install Register 2 to new HCS",
                status: "Not Started",
                note: "",
                noteUpdatedAt: null,
                statusUpdatedAt: null
            },
            {
                id: "SCOPE-003",
                title: "Test Register 1",
                status: "Not Started",
                note: "",
                noteUpdatedAt: null,
                statusUpdatedAt: null
            }
        ],

        fixtureHandedOver: false,
        fixtureTime: null,
        fixtureConfirmedAt: null,
        activityLog: []
    },

    "0456": {
        technician: "Technician B",
        timezone: "PST",
        currentNight: 1,

        equipment: createDefaultEquipment(),

        scopes: [
            {
                id: "SCOPE-001",
                title: "Install Register 1 to new HCS",
                status: "Not Started",
                note: "",
                noteUpdatedAt: null,
                statusUpdatedAt: null
            },
            {
                id: "SCOPE-002",
                title: "Test Register 1",
                status: "Not Started",
                note: "",
                noteUpdatedAt: null,
                statusUpdatedAt: null
            }
        ],

        fixtureHandedOver: false,
        fixtureTime: null,
        fixtureConfirmedAt: null,
        activityLog: []
    },

    "0789": {
        technician: "Technician C",
        timezone: "CST",
        currentNight: 2,

        equipment: createDefaultEquipment(),

        scopes: [
            {
                id: "SCOPE-001",
                title: "Install Register 1 to new HCS",
                status: "Not Started",
                note: "",
                noteUpdatedAt: null,
                statusUpdatedAt: null
            }
        ],

        fixtureHandedOver: false,
        fixtureTime: null,
        fixtureConfirmedAt: null,
        activityLog: []
    }
};


/* =========================================================
   DEFAULT EQUIPMENT
   ========================================================= */

function createDefaultEquipment() {

    const equipmentItems = [
        {
            id: "EQ-001",
            name: "New CPU",
            quantity: 1,
            trackingId: "TRK-001234"
        },
        {
            id: "EQ-002",
            name: "New handheld scanners (SCO lanes)",
            quantity: 5,
            trackingId: "TRK-001235"
        },
        {
            id: "EQ-003",
            name: "New printers (SCO lanes)",
            quantity: 4,
            trackingId: "TRK-001236"
        },
        {
            id: "EQ-004",
            name: "New table top scanners (Regular lanes)",
            quantity: 5,
            trackingId: "TRK-001237"
        },
        {
            id: "EQ-005",
            name: "New Toshiba Cash Drawers (Regular lanes)",
            quantity: 5,
            trackingId: "TRK-001238"
        },
        {
            id: "EQ-006",
            name: "Monitor poles (Regular lanes)",
            quantity: 5,
            trackingId: "TRK-001239"
        },
        {
            id: "EQ-007",
            name: "VE Monitor poles (SCO lanes)",
            quantity: 4,
            trackingId: "TRK-001240"
        },
        {
            id: "EQ-008",
            name: "Monitor pole (Host stand)",
            quantity: 1,
            trackingId: "TRK-001241"
        }
    ];

    return equipmentItems.map(item => ({
        ...item,
        status: "Not Checked",
        note: "",
        noteUpdatedAt: null,
        statusUpdatedAt: null
    }));
}


/* =========================================================
   CURRENT STORE
   ========================================================= */

let currentStore = null;


/* =========================================================
   ACTIVITY LOG
   Session-only until database integration is added.
   ========================================================= */

function logActivity(action, details) {

    const store = technicianStores[currentStore];

    if (!store) return;

    if (!store.activityLog) {
        store.activityLog = [];
    }

    store.activityLog.unshift({
        storeNumber: currentStore,
        technician: store.technician,
        action,
        details,
        timestamp: new Date().toISOString()
    });
}


/* =========================================================
   TIMESTAMP DISPLAY
   ========================================================= */

function formatTimestamp(timestamp) {

    if (!timestamp) return "";

    const store = technicianStores[currentStore];

    const timezone =
        STORE_TIMEZONES[store?.timezone] ||
        "America/New_York";

    try {
        return new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short"
        }).format(new Date(timestamp));

    } catch (error) {
        return new Date(timestamp).toLocaleString("en-US");
    }
}


/* =========================================================
   LOGIN
   ========================================================= */

function loginTechnician() {

    const input =
        document.getElementById("storeLoginInput");

    const storeNumber =
        input.value.trim().padStart(4, "0");

    const error =
        document.getElementById("loginError");

    if (!technicianStores[storeNumber]) {
        error.textContent =
            "Store not found. Please check your store number.";
        return;
    }

    currentStore = storeNumber;
    error.textContent = "";

    document
        .getElementById("loginPage")
        .classList.add("hidden");

    document
        .getElementById("dashboardPage")
        .classList.remove("hidden");

    renderDashboard();
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutTechnician() {

    currentStore = null;

    document
        .getElementById("dashboardPage")
        .classList.add("hidden");

    document
        .getElementById("loginPage")
        .classList.remove("hidden");

    document
        .getElementById("storeLoginInput")
        .value = "";

    document
        .getElementById("loginError")
        .textContent = "";
}


/* =========================================================
   DASHBOARD
   ========================================================= */

function renderDashboard() {

    const store = technicianStores[currentStore];

    document.getElementById("storeNumber").textContent =
        currentStore;

    document.getElementById("technicianName").textContent =
        store.technician;

    document.getElementById("currentNight").textContent =
        `Night ${store.currentNight}`;

    document.getElementById("storeTimezone").textContent =
        store.timezone;

    document.getElementById("scopeNight").textContent =
        `Night ${store.currentNight}`;

    renderEquipment();
    renderScopes();
    renderFixture();
}


/* =========================================================
   EQUIPMENT
   ========================================================= */

function renderEquipment() {

    const store = technicianStores[currentStore];

    const container =
        document.getElementById("equipmentList");

    container.innerHTML = "";

    store.equipment.forEach(equipment => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="equipment-name">
                    ${escapeHtml(equipment.name)}
                </div>
            </td>

            <td>
                <span class="equipment-qty">
                    ${equipment.quantity}
                </span>
            </td>

            <td>
                <div class="tracking-cell">
                    <span class="tracking-id">
                        ${escapeHtml(equipment.trackingId)}
                    </span>

                    <button
                        type="button"
                        class="copy-tracking-btn"
                        onclick="copyTrackingId('${equipment.id}')"
                    >
                        Copy
                    </button>
                </div>
            </td>

            <td>
                <select
                    id="equipment-status-${equipment.id}"
                    class="equipment-status-select"
                    aria-label="Status for ${escapeHtml(equipment.name)}"
                    onchange="updateEquipmentStatus(
                        '${equipment.id}',
                        this.value
                    )"
                >
                    <option value="Not Checked"
                        ${equipment.status === "Not Checked" ? "selected" : ""}>
                        Not Checked
                    </option>

                    <option value="Complete"
                        ${equipment.status === "Complete" ? "selected" : ""}>
                        Complete
                    </option>

                    <option value="Missing"
                        ${equipment.status === "Missing" ? "selected" : ""}>
                        Missing
                    </option>

                    <option value="Incomplete"
                        ${equipment.status === "Incomplete" ? "selected" : ""}>
                        Incomplete
                    </option>
                </select>
            </td>
        `;

        container.appendChild(row);

        updateEquipmentDropdownColor(equipment.id);


        /*
         * Only show the note row when equipment
         * is Missing or Incomplete.
         */

        if (
            equipment.status === "Missing" ||
            equipment.status === "Incomplete"
        ) {

            const noteRow = document.createElement("tr");
            noteRow.className = "equipment-note-row";

            let noteHtml = "";

            if (equipment.note) {

                noteHtml = `
                    <div class="equipment-note">
                        <strong>Note:</strong>
                        ${escapeHtml(equipment.note)}

                        ${
                            equipment.noteUpdatedAt
                                ? `<span class="equipment-note-time">
                                    · ${escapeHtml(formatTimestamp(equipment.noteUpdatedAt))}
                                   </span>`
                                : ""
                        }

                        <button
                            type="button"
                            class="edit-equipment-note"
                            onclick="addEquipmentNote('${equipment.id}')"
                        >
                            Edit
                        </button>
                    </div>
                `;

            } else {

                noteHtml = `
                    <button
                        type="button"
                        class="add-equipment-note"
                        onclick="addEquipmentNote('${equipment.id}')"
                    >
                        + Add Note
                    </button>
                `;
            }

            noteRow.innerHTML = `
                <td colspan="4">${noteHtml}</td>
            `;

            container.appendChild(noteRow);
        }
    });

    updateEquipmentProgress();
}


/* =========================================================
   EQUIPMENT STATUS COLOR
   ========================================================= */

function updateEquipmentDropdownColor(equipmentId) {

    const store = technicianStores[currentStore];

    const equipment = store.equipment.find(
        item => item.id === equipmentId
    );

    if (!equipment) return;

    const dropdown = document.getElementById(
        `equipment-status-${equipmentId}`
    );

    if (!dropdown) return;

    dropdown.classList.remove(
        "status-not-checked",
        "status-complete",
        "status-missing",
        "status-incomplete"
    );

    const classByStatus = {
        "Not Checked": "status-not-checked",
        "Complete": "status-complete",
        "Missing": "status-missing",
        "Incomplete": "status-incomplete"
    };

    dropdown.classList.add(
        classByStatus[equipment.status] || "status-not-checked"
    );
}


/* =========================================================
   EQUIPMENT STATUS UPDATE
   ========================================================= */

function updateEquipmentStatus(equipmentId, status) {

    const store = technicianStores[currentStore];

    const equipment = store.equipment.find(
        item => item.id === equipmentId
    );

    const allowedStatuses = [
        "Not Checked",
        "Complete",
        "Missing",
        "Incomplete"
    ];

    if (!equipment || !allowedStatuses.includes(status)) return;

    if (equipment.status === status) return;

    const previousStatus = equipment.status;
    const timestamp = new Date().toISOString();

    equipment.status = status;
    equipment.statusUpdatedAt = timestamp;
    equipment.updatedAt = timestamp;

    if (status === "Complete" || status === "Not Checked") {

        if (equipment.note) {
            equipment.note = "";
            equipment.noteUpdatedAt = null;
        }
    }

    logActivity(
        "Equipment status updated",
        `${equipment.name}: ${previousStatus} → ${status}`
    );

    renderEquipment();
}


/* =========================================================
   EQUIPMENT NOTE
   ========================================================= */

function addEquipmentNote(equipmentId) {

    const store = technicianStores[currentStore];

    const equipment = store.equipment.find(
        item => item.id === equipmentId
    );

    if (!equipment) return;

    if (
        equipment.status !== "Missing" &&
        equipment.status !== "Incomplete"
    ) {
        return;
    }

    const note = prompt(
        "Enter equipment note:",
        equipment.note || ""
    );

    if (note === null) return;

    const cleanedNote = note.trim();

    if (cleanedNote === equipment.note) return;

    const timestamp = new Date().toISOString();

    equipment.note = cleanedNote;
    equipment.noteUpdatedAt = cleanedNote ? timestamp : null;
    equipment.updatedAt = timestamp;

    logActivity(
        "Equipment note updated",
        `${equipment.name}: ${cleanedNote || "Note cleared"}`
    );

    renderEquipment();
}


/* =========================================================
   COPY TRACKING ID
   ========================================================= */

function copyTrackingId(equipmentId) {

    const store = technicianStores[currentStore];

    const equipment = store.equipment.find(
        item => item.id === equipmentId
    );

    if (!equipment) return;

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
        alert(`Tracking ID: ${equipment.trackingId}`);
        return;
    }

    navigator.clipboard
        .writeText(equipment.trackingId)
        .then(() => {
            alert(`Tracking ID copied: ${equipment.trackingId}`);
        })
        .catch(() => {
            alert(`Tracking ID: ${equipment.trackingId}`);
        });
}


/* =========================================================
   EQUIPMENT PROGRESS
   ========================================================= */

function updateEquipmentProgress() {

    const store = technicianStores[currentStore];

    const completed = store.equipment.filter(
        item => item.status === "Complete"
    ).length;

    const total = store.equipment.length;

    document.getElementById("equipmentProgress").textContent =
        `${completed} of ${total} complete`;
}


/* =========================================================
   NIGHT SCOPE
   ========================================================= */

function renderScopes() {

    const store = technicianStores[currentStore];

    const container = document.getElementById("scopeList");

    container.innerHTML = "";

    if (!store.scopes.length) {

        container.innerHTML = `
            <div class="scope-card">
                <div class="scope-title">
                    No scope assigned for this night.
                </div>
            </div>
        `;

        return;
    }

    store.scopes.forEach(scope => {

        const card = document.createElement("div");
        card.className = "scope-card";

        let noteHtml = "";

        if (scope.note) {

            noteHtml = `
                <div class="scope-note">
                    <strong>Note:</strong>
                    ${escapeHtml(scope.note)}

                    ${
                        scope.noteUpdatedAt
                            ? `<span class="scope-note-time">
                                Updated ${escapeHtml(formatTimestamp(scope.noteUpdatedAt))}
                               </span>`
                            : ""
                    }
                </div>
            `;
        }

        card.innerHTML = `
            <div class="scope-title">
                ${escapeHtml(scope.title)}
            </div>

            <div class="scope-controls">

                <select
                    id="scope-status-${scope.id}"
                    class="scope-status-select"
                    onchange="updateScopeStatus(
                        '${scope.id}',
                        this.value
                    )"
                >
                    <option value="Not Started"
                        ${scope.status === "Not Started" ? "selected" : ""}>
                        Not Started
                    </option>

                    <option value="In Progress"
                        ${scope.status === "In Progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="Completed"
                        ${scope.status === "Completed" ? "selected" : ""}>
                        Completed
                    </option>
                </select>

                <button
                    type="button"
                    class="scope-note-btn"
                    onclick="addScopeNote('${scope.id}')"
                >
                    ${scope.note ? "Edit Note" : "Add Note"}
                </button>

            </div>

            ${noteHtml}
        `;

        container.appendChild(card);

        updateScopeDropdownColor(scope.id);
    });
}


/* =========================================================
   SCOPE STATUS UPDATE
   ========================================================= */

function updateScopeStatus(scopeId, status) {

    const store = technicianStores[currentStore];

    const scope = store.scopes.find(
        item => item.id === scopeId
    );

    const allowedStatuses = [
        "Not Started",
        "In Progress",
        "Completed"
    ];

    if (!scope || !allowedStatuses.includes(status)) return;

    if (scope.status === status) return;

    const previousStatus = scope.status;
    const timestamp = new Date().toISOString();

    scope.status = status;
    scope.statusUpdatedAt = timestamp;
    scope.updatedAt = timestamp;

    logActivity(
        "Scope status updated",
        `${scope.title}: ${previousStatus} → ${status}`
    );

    updateScopeDropdownColor(scopeId);
}


/* =========================================================
   SCOPE DROPDOWN COLOR
   ========================================================= */

function updateScopeDropdownColor(scopeId) {

    const store = technicianStores[currentStore];

    const scope = store.scopes.find(
        item => item.id === scopeId
    );

    if (!scope) return;

    const dropdown = document.getElementById(
        `scope-status-${scopeId}`
    );

    if (!dropdown) return;

    dropdown.classList.remove(
        "status-not-started",
        "status-in-progress",
        "status-completed"
    );

    const classByStatus = {
        "Not Started": "status-not-started",
        "In Progress": "status-in-progress",
        "Completed": "status-completed"
    };

    dropdown.classList.add(
        classByStatus[scope.status] || "status-not-started"
    );
}


/* =========================================================
   SCOPE NOTE
   ========================================================= */

function addScopeNote(scopeId) {

    const store = technicianStores[currentStore];

    const scope = store.scopes.find(
        item => item.id === scopeId
    );

    if (!scope) return;

    const note = prompt(
        "Enter note:",
        scope.note || ""
    );

    if (note === null) return;

    const cleanedNote = note.trim();

    if (cleanedNote === scope.note) return;

    const timestamp = new Date().toISOString();

    scope.note = cleanedNote;
    scope.noteUpdatedAt = cleanedNote ? timestamp : null;
    scope.updatedAt = timestamp;

    logActivity(
        "Scope note updated",
        `${scope.title}: ${cleanedNote || "Note cleared"}`
    );

    renderScopes();
}


/* =========================================================
   FIXTURE HANDOVER
   ========================================================= */

function renderFixture() {

    const store = technicianStores[currentStore];

    const timeInput =
        document.getElementById("fixtureHandoverTime");

    const confirmation =
        document.getElementById("fixtureConfirmation");

    const button =
        document.getElementById("fixtureButton");

    timeInput.disabled = store.fixtureHandedOver;
    timeInput.value = store.fixtureTime || "";

    button.disabled = store.fixtureHandedOver;
    button.classList.toggle(
        "confirmed",
        store.fixtureHandedOver
    );

    button.textContent = store.fixtureHandedOver
        ? "Fixture Handover Confirmed"
        : "Confirm Fixture Handover";

    if (store.fixtureHandedOver) {

        confirmation.style.color = "#15803d";

        confirmation.textContent =
            `Handover time: ${formatTimeForDisplay(store.fixtureTime)}. ` +
            `Confirmed at ${formatTimestamp(store.fixtureConfirmedAt)}.`;

    } else {

        confirmation.textContent = "";
    }
}


function confirmFixtureHandover() {

    const store = technicianStores[currentStore];

    const timeInput =
        document.getElementById("fixtureHandoverTime");

    const confirmation =
        document.getElementById("fixtureConfirmation");

    const handoverTime = timeInput.value;

    if (!handoverTime) {

        confirmation.textContent =
            "Please enter the fixture handover time first.";

        confirmation.style.color = "#dc2626";
        return;
    }

    if (store.fixtureHandedOver) return;

    const timestamp = new Date().toISOString();

    store.fixtureHandedOver = true;
    store.fixtureTime = handoverTime;
    store.fixtureConfirmedAt = timestamp;

    logActivity(
        "Fixture handover confirmed",
        `Handover time: ${formatTimeForDisplay(handoverTime)}`
    );

    renderFixture();
}


/* =========================================================
   FIXTURE TIME DISPLAY
   ========================================================= */

function formatTimeForDisplay(timeValue) {

    if (!timeValue) return "";

    const [hours, minutes] = timeValue.split(":");

    const date = new Date();

    date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    );

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit"
    }).format(date);
}


/* =========================================================
   HTML SAFETY
   ========================================================= */

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   ENTER KEY LOGIN
   ========================================================= */

document
    .getElementById("storeLoginInput")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            loginTechnician();
        }
    });
