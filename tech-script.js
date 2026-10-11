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
   CURRENT STORE
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

    document
        .getElementById("storeNumber")
        .textContent = currentStore;

    document
        .getElementById("technicianName")
        .textContent = store.technician;

    document
        .getElementById("currentNight")
        .textContent = `Night ${store.currentNight}`;

    document
        .getElementById("storeTimezone")
        .textContent = store.timezone;

    document
        .getElementById("scopeNight")
        .textContent = `Night ${store.currentNight}`;

    renderEquipment();

    renderScopes();

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


        /*
         * Show note area only for
         * Missing / Incomplete.
         */

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
   EQUIPMENT STATUS
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

    updateScopeDropdownColor(scopeId);
}


/* =========================================================
   SCOPE DROPDOWN COLOR
   ========================================================= */

function updateScopeDropdownColor(scopeId) {

    const store =
        technicianStores[currentStore];

    const scope =
        store.scopes.find(
            item => item.id === scopeId
        );

    if (!scope) return;

    const dropdown =
        document.getElementById(
            `scope-status-${scopeId}`
        );

    if (!dropdown) return;

    dropdown.classList.remove(
        "status-not-started",
        "status-in-progress",
        "status-completed"
    );

    if (scope.status === "Not Started") {

        dropdown.classList.add(
            "status-not-started"
        );

    } else if (scope.status === "In Progress") {

        dropdown.classList.add(
            "status-in-progress"
        );

    } else if (scope.status === "Completed") {

        dropdown.classList.add(
            "status-completed"
        );
    }
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
   FIXTURE HANDOVER
   ========================================================= */

function confirmFixtureHandover() {

    const store =
        technicianStores[currentStore];

    const timeInput =
        document.getElementById(
            "fixtureHandoverTime"
        );

    const confirmation =
        document.getElementById(
            "fixtureConfirmation"
        );

    const button =
        document.getElementById(
            "fixtureButton"
        );

    const handoverTime =
        timeInput.value;

    if (!handoverTime) {

        confirmation.textContent =
            "Please enter the fixture handover time first.";

        confirmation.style.color =
            "#dc2626";

        return;
    }

    store.fixtureHandedOver = true;

    store.fixtureTime =
        handoverTime;

    button.textContent =
        "Fixture Handover Confirmed";

    button.classList.add("confirmed");

    button.disabled = true;

    timeInput.disabled = true;

    confirmation.textContent =
        `Handover confirmed at ${formatTimeForDisplay(handoverTime)}`;

    confirmation.style.color =
        "#15803d";
}


/* =========================================================
   FIXTURE TIME DISPLAY
   ========================================================= */

function formatTimeForDisplay(timeValue) {

    if (!timeValue) return "";

    const [hours, minutes] =
        timeValue.split(":");

    const date =
        new Date();

    date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    );

    return new Intl.DateTimeFormat(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    ).format(date);
}


/* =========================================================
   HTML SAFETY
   ========================================================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
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
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                loginTechnician();
            }

        }
    );
