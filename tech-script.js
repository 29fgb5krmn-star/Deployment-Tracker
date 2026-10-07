/* =========================================================
   TECHNICIAN PORTAL
   ========================================================= */


/* =========================================================
   SAMPLE TECHNICIAN DATA
   ========================================================= */

const technicianStores = {

    "0123": {
        technician: "Technician A",
        timezone: "EST",
        currentNight: 1,

        equipment: [
            {
                id: "EQ-001",
                name: "New CPU",
                quantity: 1,
                trackingId: "TRK-001234",
                status: "Complete",
                note: ""
            },

            {
                id: "EQ-002",
                name: "New handheld scanners (SCO lanes)",
                quantity: 5,
                trackingId: "TRK-001235",
                status: "Incomplete",
                note: "1 of 5 handheld scanners missing."
            },

            {
                id: "EQ-003",
                name: "New printers (SCO lanes)",
                quantity: 4,
                trackingId: "TRK-001236",
                status: "Missing",
                note: ""
            },

            {
                id: "EQ-004",
                name: "New table top scanners (Regular lanes)",
                quantity: 5,
                trackingId: "TRK-001237",
                status: "Complete",
                note: ""
            },

            {
                id: "EQ-005",
                name: "New Toshiba Cash Drawers (Regular lanes)",
                quantity: 5,
                trackingId: "TRK-001238",
                status: "Complete",
                note: ""
            },

            {
                id: "EQ-006",
                name: "Monitor poles (Regular lanes)",
                quantity: 5,
                trackingId: "TRK-001239",
                status: "Complete",
                note: ""
            },

            {
                id: "EQ-007",
                name: "VE Monitor poles (SCO lanes)",
                quantity: 4,
                trackingId: "TRK-001240",
                status: "Missing",
                note: ""
            },

            {
                id: "EQ-008",
                name: "Monitor pole (Host stand)",
                quantity: 1,
                trackingId: "TRK-001241",
                status: "Complete",
                note: ""
            }
        ],

        scopes: [
            {
                id: "SCOPE-001",
                title: "Install Register 1 to new HCS",
                status: "Not Started",
                note: ""
            },

            {
                id: "SCOPE-002",
                title: "Install Register 2 to new HCS",
                status: "Not Started",
                note: ""
            },

            {
                id: "SCOPE-003",
                title: "Test Register 1",
                status: "Not Started",
                note: ""
            }
        ],

        checkedIn: false,
        checkInTime: null,

        fixtureHandedOver: false,
        fixtureTime: null
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
                note: ""
            },

            {
                id: "SCOPE-002",
                title: "Test Register 1",
                status: "Not Started",
                note: ""
            }
        ],

        checkedIn: false,
        checkInTime: null,

        fixtureHandedOver: false,
        fixtureTime: null
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
                note: ""
            }
        ],

        checkedIn: false,
        checkInTime: null,

        fixtureHandedOver: false,
        fixtureTime: null
    }

};


/* =========================================================
   DEFAULT EQUIPMENT
   ========================================================= */

function createDefaultEquipment() {

    return [
        {
            id: "EQ-001",
            name: "New CPU",
            quantity: 1,
            trackingId: "TRK-001234",
            status: "Complete",
            note: ""
        },

        {
            id: "EQ-002",
            name: "New handheld scanners (SCO lanes)",
            quantity: 5,
            trackingId: "TRK-001235",
            status: "Complete",
            note: ""
        },

        {
            id: "EQ-003",
            name: "New printers (SCO lanes)",
            quantity: 4,
            trackingId: "TRK-001236",
            status: "Complete",
            note: ""
        },

        {
            id: "EQ-004",
            name: "New table top scanners (Regular lanes)",
            quantity: 5,
            trackingId: "TRK-001237",
            status: "Complete",
            note: ""
        },

        {
            id: "EQ-005",
            name: "New Toshiba Cash Drawers (Regular lanes)",
            quantity: 5,
            trackingId: "TRK-001238",
            status: "Complete",
            note: ""
        },

        {
            id: "EQ-006",
            name: "Monitor poles (Regular lanes)",
            quantity: 5,
            trackingId: "TRK-001239",
            status: "Complete",
            note: ""
        },

        {
            id: "EQ-007",
            name: "VE Monitor poles (SCO lanes)",
            quantity: 4,
            trackingId: "TRK-001240",
            status: "Complete",
            note: ""
        },

        {
            id: "EQ-008",
            name: "Monitor pole (Host stand)",
            quantity: 1,
            trackingId: "TRK-001241",
            status: "Complete",
            note: ""
        }
    ];
}


/* =========================================================
   CURRENT TECHNICIAN
   ========================================================= */

let currentStore = null;


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
}


/* =========================================================
   DASHBOARD
   ========================================================= */

function renderDashboard() {

    const store =
        technicianStores[currentStore];

    document.getElementById("storeNumber")
        .textContent = currentStore;

    document.getElementById("technicianName")
        .textContent = store.technician;

    document.getElementById("currentNight")
        .textContent = `Night ${store.currentNight}`;

    document.getElementById("storeTimezone")
        .textContent = store.timezone;

    renderEquipment();

    renderScopes();

    renderCheckIn();

    renderFixture();
}


/* =========================================================
   EQUIPMENT
   ========================================================= */

function renderEquipment() {

    const store =
        technicianStores[currentStore];

    const container =
        document.getElementById("equipmentList");

    container.innerHTML = "";

    store.equipment.forEach((equipment) => {

        const row =
            document.createElement("tr");

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
                        class="copy-tracking-btn"
                        onclick="copyTrackingId('${equipment.id}')"
                    >
                        Copy
                    </button>

                </div>
            </td>

            <td>

                <select
                    class="equipment-status-select"
                    onchange="updateEquipmentStatus(
                        '${equipment.id}',
                        this.value
                    )"
                >

                    <option value="Complete"
                        ${equipment.status === "Complete" ? "selected" : ""}>
                        Complete
                    </option>

                    <option value="Incomplete"
                        ${equipment.status === "Incomplete" ? "selected" : ""}>
                        Incomplete
                    </option>

                    <option value="Missing"
                        ${equipment.status === "Missing" ? "selected" : ""}>
                        Missing
                    </option>

                </select>

            </td>
        `;

        container.appendChild(row);


        /* Add note row only when needed */

        if (
            equipment.status === "Missing" ||
            equipment.status === "Incomplete"
        ) {

            const noteRow =
                document.createElement("tr");

            noteRow.className =
                "equipment-note-row";

            let noteHtml = "";

            if (equipment.note) {

                noteHtml = `
                    <div class="equipment-note">
                        <strong>Note:</strong>
                        ${escapeHtml(equipment.note)}

                        <button
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
                        class="add-equipment-note"
                        onclick="addEquipmentNote('${equipment.id}')"
                    >
                        + Add Note
                    </button>
                `;
            }

            noteRow.innerHTML = `
                <td colspan="4">
                    ${noteHtml}
                </td>
            `;

            container.appendChild(noteRow);
        }

    });

    updateEquipmentProgress();
}


/* =========================================================
   EQUIPMENT STATUS UPDATE
   ========================================================= */

function updateEquipmentStatus(
    equipmentId,
    status
) {

    const store =
        technicianStores[currentStore];

    const equipment =
        store.equipment.find(
            item => item.id === equipmentId
        );

    if (!equipment) return;

    equipment.status = status;

    /*
     * Clear note when equipment becomes Complete.
     */
    if (status === "Complete") {
        equipment.note = "";
    }

    renderEquipment();
}


/* =========================================================
   EQUIPMENT NOTE
   ========================================================= */

function addEquipmentNote(equipmentId) {

    const store =
        technicianStores[currentStore];

    const equipment =
        store.equipment.find(
            item => item.id === equipmentId
        );

    if (!equipment) return;

    const note =
        prompt(
            "Enter equipment note:",
            equipment.note || ""
        );

    if (note === null) return;

    equipment.note =
        note.trim();

    renderEquipment();
}


/* =========================================================
   COPY TRACKING ID
   ========================================================= */

function copyTrackingId(equipmentId) {

    const store =
        technicianStores[currentStore];

    const equipment =
        store.equipment.find(
            item => item.id === equipmentId
        );

    if (!equipment) return;

    navigator.clipboard
        .writeText(equipment.trackingId)
        .then(() => {

            /*
             * Simple confirmation.
             */
            alert(
                `Tracking ID copied: ${equipment.trackingId}`
            );

        })
        .catch(() => {

            alert(
                `Tracking ID: ${equipment.trackingId}`
            );

        });
}


/* =========================================================
   EQUIPMENT PROGRESS
   ========================================================= */

function updateEquipmentProgress() {

    const store =
        technicianStores[currentStore];

    const completed =
        store.equipment.filter(
            item => item.status === "Complete"
        ).length;

    const total =
        store.equipment.length;

    document
        .getElementById("equipmentProgress")
        .textContent =
        `${completed} of ${total} complete`;
}


/* =========================================================
   NIGHT SCOPE
   ========================================================= */

function renderScopes() {

    const store =
        technicianStores[currentStore];

    const container =
        document.getElementById("scopeList");

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


    store.scopes.forEach((scope) => {

        const card =
            document.createElement("div");

        card.className =
            "scope-card";

        let noteHtml = "";

        if (scope.note) {

            noteHtml = `
                <div class="scope-note">
                    <strong>Note:</strong>
                    ${escapeHtml(scope.note)}
                </div>
            `;
        }

        card.innerHTML = `

            <div class="scope-title">
                ${escapeHtml(scope.title)}
            </div>

            <div class="scope-controls">

                <select
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
                    class="scope-note-btn"
                    onclick="addScopeNote('${scope.id}')"
                >
                    ${scope.note ? "Edit Note" : "Add Note"}
                </button>

            </div>

            ${noteHtml}

        `;

        container.appendChild(card);

    });
}


/* =========================================================
   SCOPE STATUS
   ========================================================= */

function updateScopeStatus(
    scopeId,
    status
) {

    const store =
        technicianStores[currentStore];

    const scope =
        store.scopes.find(
            item => item.id === scopeId
        );

    if (!scope) return;

    scope.status = status;

    renderScopes();
}


/* =========================================================
   SCOPE NOTE
   ========================================================= */

function addScopeNote(scopeId) {

    const store =
        technicianStores[currentStore];

    const scope =
        store.scopes.find(
            item => item.id === scopeId
        );

    if (!scope) return;

    const note =
        prompt(
            "Enter note:",
            scope.note || ""
        );

    if (note === null) return;

    scope.note =
        note.trim();

    renderScopes();
}


/* =========================================================
   CHECK-IN
   ========================================================= */

function checkInTechnician() {

    const store =
        technicianStores[currentStore];

    if (store.checkedIn) return;

    store.checkedIn = true;

    store.checkInTime =
        new Date();

    renderCheckIn();
}


function renderCheckIn() {

    const store =
        technicianStores[currentStore];

    const button =
        document.getElementById("checkInButton");

    if (store.checkedIn) {

        button.textContent =
            `Checked In ${formatTime(store.checkInTime)}`;

        button.classList.add("checked-in");

        button.disabled = true;

    } else {

        button.textContent =
            "Check In";

        button.classList.remove("checked-in");

        button.disabled = false;
    }
}


/* =========================================================
   FIXTURE HANDOVER
   ========================================================= */

function confirmFixtureHandover() {

    const store =
        technicianStores[currentStore];

    if (store.fixtureHandedOver) return;

    store.fixtureHandedOver = true;

    store.fixtureTime =
        new Date();

    renderFixture();
}


function renderFixture() {

    const store =
        technicianStores[currentStore];

    const status =
        document.getElementById("fixtureStatus");

    const time =
        document.getElementById("fixtureTime");

    const button =
        document.getElementById("fixtureButton");

    if (store.fixtureHandedOver) {

        status.textContent =
            "Confirmed";

        time.textContent =
            `Confirmed at ${formatDateTime(store.fixtureTime)}`;

        button.textContent =
            "Fixture Handover Confirmed";

        button.classList.add("confirmed");

        button.disabled = true;

    } else {

        status.textContent =
            "Not Confirmed";

        time.textContent = "";

        button.textContent =
            "Confirm Fixture Handover";

        button.classList.remove("confirmed");

        button.disabled = false;
    }
}


/* =========================================================
   DATE / TIME
   ========================================================= */

function formatTime(date) {

    if (!date) return "";

    return new Intl.DateTimeFormat(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    ).format(date);
}


function formatDateTime(date) {

    if (!date) return "";

    return new Intl.DateTimeFormat(
        "en-US",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(date);
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
