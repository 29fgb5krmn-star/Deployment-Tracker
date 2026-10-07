// ============================================================
// DEPLOYMENT TRACKER
// ============================================================


// ============================================================
// TIMEZONE CONFIGURATION
// ============================================================
//
// Fixed US timezone offsets are used intentionally:
//
// EST = UTC-5
// CST = UTC-6
// MST = UTC-7
// PST = UTC-8
//
// This intentionally does NOT apply daylight-saving changes.
// ============================================================

const STORE_TIMEZONES = {

    EST: -5,
    CST: -6,
    MST: -7,
    PST: -8

};


// ============================================================
// SAMPLE DATA
// ============================================================

let stores = [

    {
        storeNumber: "0123",
        technician: "Technician A",
        timezone: "EST",
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

        ],

        fixtureHandover: {}

    },


    {
        storeNumber: "0456",
        technician: "Technician B",
        timezone: "PST",
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

        ],

        fixtureHandover: {}

    },


    {
        storeNumber: "0789",
        technician: "Technician C",
        timezone: "CST",
        currentNight: 2,
        checkedIn: "",
        tasks: [],
        fixtureHandover: {}
    },


    {
        storeNumber: "1011",
        technician: "Technician D",
        timezone: "MST",
        currentNight: 1,
        checkedIn: "",
        tasks: [],
        fixtureHandover: {}
    },


    {
        storeNumber: "1213",
        technician: "Technician E",
        timezone: "EST",
        currentNight: 1,
        checkedIn: "",
        tasks: [],
        fixtureHandover: {}
    },


    {
        storeNumber: "1415",
        technician: "Technician F",
        timezone: "PST",
        currentNight: 1,
        checkedIn: "",
        tasks: [],
        fixtureHandover: {}
    }

];


// ============================================================
// VARIABLES
// ============================================================

let selectedStoreNumber = null;

let recentUpdates = [];

let nextTaskId = 100;

let assignmentMessageTimer = null;

let scopeManagementMessageTimer = null;


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


// ============================================================
// TIMEZONE HELPERS
// ============================================================

function getStoreTimezone(store) {

    if (
        store &&
        STORE_TIMEZONES[store.timezone] !== undefined
    ) {

        return store.timezone;

    }

    return "EST";

}


function getTimezoneOffset(store) {

    const timezone =
        getStoreTimezone(store);

    return STORE_TIMEZONES[timezone];

}


// ============================================================
// CURRENT STORE TIME
// ============================================================

function getCurrentTimestamp(store = getSelectedStore()) {

    const now =
        new Date();

    const offsetHours =
        getTimezoneOffset(store);

    const utcMilliseconds =
        now.getTime() +
        (now.getTimezoneOffset() * 60000);

    const storeMilliseconds =
        utcMilliseconds +
        (offsetHours * 60 * 60 * 1000);

    const storeDate =
        new Date(storeMilliseconds);


    const year =
        storeDate.getUTCFullYear();

    const month =
        String(
            storeDate.getUTCMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            storeDate.getUTCDate()
        ).padStart(2, "0");

    const hours =
        String(
            storeDate.getUTCHours()
        ).padStart(2, "0");

    const minutes =
        String(
            storeDate.getUTCMinutes()
        ).padStart(2, "0");


    return `${year}-${month}-${day} ${hours}:${minutes}`;

}


// ============================================================
// DISPLAY TIMESTAMP
// ============================================================

function getDisplayTimestamp(
    timestamp,
    timezone
) {

    if (!timestamp) {
        return "";
    }


    const parts =
        timestamp.split(" ");


    if (parts.length !== 2) {
        return `${timestamp} ${timezone || ""}`.trim();
    }


    const dateParts =
        parts[0].split("-");

    const timeParts =
        parts[1].split(":");


    if (
        dateParts.length !== 3 ||
        timeParts.length !== 2
    ) {

        return `${timestamp} ${timezone || ""}`.trim();

    }


    const year =
        Number(dateParts[0]);

    const month =
        Number(dateParts[1]) - 1;

    const day =
        Number(dateParts[2]);

    const hour =
        Number(timeParts[0]);

    const minute =
        Number(timeParts[1]);


    const date =
        new Date(
            Date.UTC(
                year,
                month,
                day,
                hour,
                minute
            )
        );


    const formatted =
        date.toLocaleString(
            "en-US",
            {
                timeZone: "UTC",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit"
            }
        );


    return `${formatted} ${timezone || ""}`.trim();

}


function formatCheckInTime(
    timestamp,
    store = getSelectedStore()
) {

    if (!timestamp) {
        return "";
    }


    return getDisplayTimestamp(
        timestamp,
        getStoreTimezone(store)
    );

}


function formatReasonTimestamp(
    timestamp,
    store = getSelectedStore()
) {

    if (!timestamp) {
        return "";
    }


    return getDisplayTimestamp(
        timestamp,
        getStoreTimezone(store)
    );

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
// SELECT PLACEHOLDER
// ============================================================

function setupDeploymentNightSelect(selectId) {

    const select =
        document.getElementById(selectId);


    if (!select) {
        return;
    }


    const existingPlaceholder =
        select.querySelector(
            'option[data-placeholder="true"]'
        );


    if (existingPlaceholder) {
        existingPlaceholder.remove();
    }


    const placeholder =
        document.createElement("option");


    placeholder.value =
        "";

    placeholder.textContent =
        "Select deployment night";

    placeholder.disabled =
        true;

    placeholder.selected =
        true;

    placeholder.setAttribute(
        "data-placeholder",
        "true"
    );


    select.insertBefore(
        placeholder,
        select.firstChild
    );


    select.value =
        "";

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
            task =>
                task.status !== "Cancelled"
        );


    if (activeTasks.length === 0) {
        return "Cancelled";
    }


    const allCompleted =
        activeTasks.every(
            task =>
                task.status === "Completed"
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
            task =>
                task.status !== "Cancelled"
        );


    if (activeTasks.length === 0) {
        return 0;
    }


    const completedTasks =
        activeTasks.filter(
            task =>
                task.status === "Completed"
        );


    return Math.round(
        (
            completedTasks.length /
            activeTasks.length
        ) * 100
    );

}


// ============================================================
// OVERVIEW
// ============================================================

function renderOverview() {

    const overviewPage =
        document.getElementById(
            "overviewPage"
        );

    const storeDetailPage =
        document.getElementById(
            "storeDetailPage"
        );


    if (overviewPage) {
        overviewPage.classList.remove("hidden");
    }


    if (storeDetailPage) {
        storeDetailPage.classList.add("hidden");
    }


    const storeGrid =
        document.getElementById(
            "storeGrid"
        );


    if (!storeGrid) {
        return;
    }


    storeGrid.innerHTML =
        "";


    stores.forEach(store => {

        const status =
            getStoreStatus(store);

        const progress =
            calculateProgress(store);


        const card =
            document.createElement("div");


        card.className =
            "store-card";


        card.onclick =
            function () {

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
                        ${formatCheckInTime(store.checkedIn, store)}
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

                <strong>Timezone:</strong>
                ${getStoreTimezone(store)}

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
            store =>
                !!store.checkedIn
        ).length;


    const totalElement =
        document.getElementById(
            "totalStores"
        );

    const inProgressElement =
        document.getElementById(
            "inProgressStores"
        );

    const completedElement =
        document.getElementById(
            "completedStores"
        );

    const checkedInElement =
        document.getElementById(
            "checkedInStores"
        );


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
        getCurrentTimestamp(store);


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
        document.getElementById(
            "recentUpdates"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


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


        const store =
            stores.find(
                item =>
                    item.storeNumber ===
                    update.storeNumber
            );


        const timezone =
            getStoreTimezone(store);


        item.innerHTML = `

            <div class="update-header">

                <span class="update-store">
                    Store ${update.storeNumber}
                </span>

                <span>—</span>

                <span class="update-tech">
                    ${update.technician || "Unassigned"}
                </span>

            </div>


            <div class="update-message">
                ${update.message}
            </div>


            <div class="update-time">
                ${getDisplayTimestamp(
                    update.timestamp,
                    timezone
                )}
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
        document.getElementById(
            "overviewPage"
        );

    const storeDetailPage =
        document.getElementById(
            "storeDetailPage"
        );


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


    if (!store.fixtureHandover) {
        store.fixtureHandover = {};
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

    const detailTimezone =
        document.getElementById(
            "detailTimezone"
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
            store.technician ||
            "Unassigned";

    }


    if (detailCurrentNight) {

        detailCurrentNight.textContent =
            `Night ${store.currentNight || 1}`;

    }


    if (detailTimezone) {

        detailTimezone.textContent =
            getStoreTimezone(store);

    }


    if (detailCheckIn) {

        detailCheckIn.textContent =
            store.checkedIn
                ? formatCheckInTime(
                    store.checkedIn,
                    store
                )
                : "Not checked in";

    }


    if (detailStoreStatus) {

        detailStoreStatus.textContent =
            getStoreStatus(store);

    }


    setupDeploymentNightSelect(
        "assignedNight"
    );

    setupDeploymentNightSelect(
        "scopeNight"
    );

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


    if (!store.fixtureHandover) {
        store.fixtureHandover = {};
    }


    container.innerHTML =
        "";


    for (
        let night = 1;
        night <= 5;
        night++
    ) {

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


        // ====================================================
        // SCOPE LIST
        // ====================================================

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


        // ====================================================
        // FIXTURE HANDOVER
        // Separate from scopes
        // ====================================================

        const fixtureBox =
            createFixtureHandoverElement(
                store,
                night
            );


        // IMPORTANT:
        // Header -> Scopes -> Fixture Handover

        section.appendChild(header);

        section.appendChild(scopeList);

        section.appendChild(fixtureBox);

        container.appendChild(section);

    }

}


// ============================================================
// FIXTURE HANDOVER ELEMENT
// ============================================================

function createFixtureHandoverElement(
    store,
    night
) {

    const box =
        document.createElement("div");


    box.className =
        "fixture-handover";


    const saved =
        store.fixtureHandover &&
        store.fixtureHandover[night]
            ? store.fixtureHandover[night]
            : null;


    const title =
        document.createElement("div");


    title.className =
        "fixture-handover-title";


    title.textContent =
        "Fixture Handover Time";


    box.appendChild(title);


    // ========================================================
    // SAVED STATE
    // ========================================================

    if (saved && saved.time) {

        const display =
            document.createElement("div");


        display.className =
            "fixture-handover-display";


        const timeText =
            document.createElement("span");


        timeText.textContent =
            `✓ Fixture handed over at ${formatTimeForDisplay(saved.time)} ${getStoreTimezone(store)}`;


        display.appendChild(
            timeText
        );


        const editButton =
            document.createElement("button");


        editButton.type =
            "button";

        editButton.className =
            "fixture-handover-edit";

        editButton.textContent =
            "Edit";


        editButton.onclick =
            function (event) {

                event.stopPropagation();

                editFixtureHandover(
                    night
                );

            };


        display.appendChild(
            editButton
        );


        box.appendChild(
            display
        );


        if (saved.updatedAt) {

            const updated =
                document.createElement("div");


            updated.className =
                "fixture-handover-updated";


            updated.textContent =
                `Recorded/updated at ${formatReasonTimestamp(
                    saved.updatedAt,
                    store
                )}`;


            box.appendChild(
                updated
            );

        }


        return box;

    }


    // ========================================================
    // UNSAVED STATE
    // ========================================================

    const row =
        document.createElement("div");


    row.className =
        "fixture-handover-row";


    const inputGroup =
        document.createElement("div");


    inputGroup.className =
        "fixture-handover-input-group";


    const label =
        document.createElement("label");


    label.textContent =
        "Time fixture was handed over";


    const input =
        document.createElement("input");


    input.type =
        "time";

    input.id =
        `fixtureHandover-${night}`;


    inputGroup.appendChild(
        label
    );

    inputGroup.appendChild(
        input
    );


    const saveButton =
        document.createElement("button");


    saveButton.type =
        "button";

    saveButton.className =
        "fixture-handover-save";

    saveButton.textContent =
        "Save Time";


    saveButton.onclick =
        function (event) {

            event.stopPropagation();

            saveFixtureHandover(
                night
            );

        };


    row.appendChild(
        inputGroup
    );

    row.appendChild(
        saveButton
    );


    box.appendChild(
        row
    );


    const noRecord =
        document.createElement("div");


    noRecord.className =
        "fixture-handover-display";


    noRecord.style.color =
        "#94a3b8";


    noRecord.textContent =
        "No fixture handover time recorded.";


    box.appendChild(
        noRecord
    );


    return box;

}


// ============================================================
// FORMAT FIXTURE TIME
// ============================================================

function formatTimeForDisplay(timeValue) {

    if (!timeValue) {
        return "";
    }


    const parts =
        timeValue.split(":");


    if (parts.length < 2) {
        return timeValue;
    }


    let hour =
        Number(parts[0]);

    const minute =
        parts[1];


    if (isNaN(hour)) {
        return timeValue;
    }


    const suffix =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12 || 12;


    return `${hour}:${minute} ${suffix}`;

}


// ============================================================
// SAVE FIXTURE HANDOVER
// ============================================================

function saveFixtureHandover(night) {

    const store =
        getSelectedStore();


    if (!store) {
        return;
    }


    const input =
        document.getElementById(
            `fixtureHandover-${night}`
        );


    if (!input) {
        return;
    }


    const selectedTime =
        input.value;


    if (!selectedTime) {

        alert(
            "Please enter the fixture handover time."
        );

        return;

    }


    if (!store.fixtureHandover) {
        store.fixtureHandover = {};
    }


    const existing =
        store.fixtureHandover[night];


    const timestamp =
        getCurrentTimestamp(store);


    // IMPORTANT:
    // selectedTime is already the store's local wall-clock time.
    // We DO NOT convert it to another timezone.

    store.fixtureHandover[night] = {

        time:
            selectedTime,

        updatedAt:
            timestamp

    };


    const handoverDisplay =
        formatTimeForDisplay(
            selectedTime
        );


    const message =
        existing && existing.time
            ? `Fixture handover updated to ${handoverDisplay} ${getStoreTimezone(store)} — Night ${night}`
            : `Fixture handover recorded at ${handoverDisplay} ${getStoreTimezone(store)} — Night ${night}`;


    // Technician update for Overview
    recentUpdates.unshift({

        storeNumber:
            store.storeNumber,

        technician:
            store.technician,

        message:
            message,

        timestamp:
            timestamp,

        source:
            "technician"

    });


    renderStoreDetail();

    renderOverview();

    // Return to the selected store detail page
    const overviewPage =
        document.getElementById(
            "overviewPage"
        );

    const storeDetailPage =
        document.getElementById(
            "storeDetailPage"
        );

    if (overviewPage) {
        overviewPage.classList.add("hidden");
    }

    if (storeDetailPage) {
        storeDetailPage.classList.remove("hidden");
    }

}


// ============================================================
// EDIT FIXTURE HANDOVER
// ============================================================

function editFixtureHandover(night) {

    const store =
        getSelectedStore();


    if (!store) {
        return;
    }


    if (
        !store.fixtureHandover ||
        !store.fixtureHandover[night]
    ) {

        return;

    }


    const currentTime =
        store.fixtureHandover[night].time;


    const newTime =
        prompt(
            "Enter the correct fixture handover time (HH:MM):",
            currentTime
        );


    if (newTime === null) {
        return;
    }


    const cleanedTime =
        newTime.trim();


    if (
        !/^\d{1,2}:\d{2}$/.test(cleanedTime)
    ) {

        alert(
            "Please enter the time in HH:MM format."
        );

        return;

    }


    const parts =
        cleanedTime.split(":");


    let hour =
        Number(parts[0]);

    const minute =
        Number(parts[1]);


    if (
        hour < 0 ||
        hour > 23 ||
        minute < 0 ||
        minute > 59
    ) {

        alert(
            "Invalid time."
        );

        return;

    }


    const formattedTime =
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;


    const timestamp =
        getCurrentTimestamp(store);


    store.fixtureHandover[night] = {

        time:
            formattedTime,

        updatedAt:
            timestamp

    };


    recentUpdates.unshift({

        storeNumber:
            store.storeNumber,

        technician:
            store.technician,

        message:
            `Fixture handover updated to ${formatTimeForDisplay(formattedTime)} ${getStoreTimezone(store)} — Night ${night}`,

        timestamp:
            timestamp,

        source:
            "technician"

    });


    renderStoreDetail();

    renderOverview();


    const overviewPage =
        document.getElementById(
            "overviewPage"
        );

    const storeDetailPage =
        document.getElementById(
            "storeDetailPage"
        );

    if (overviewPage) {
        overviewPage.classList.add("hidden");
    }

    if (storeDetailPage) {
        storeDetailPage.classList.remove("hidden");
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


    main.appendChild(
        description
    );

    main.appendChild(
        status
    );

    element.appendChild(
        main
    );


    // ========================================================
    // REASON / NOTES
    // ========================================================

    if (task.reason) {

        const reason =
            document.createElement("div");


        reason.className =
            "scope-reason";


        const reasonText =
            document.createElement("div");


        const reasonLabel =
            document.createElement("strong");


        reasonLabel.textContent =
            "Reason: ";


        reasonText.appendChild(
            reasonLabel
        );


        reasonText.appendChild(
            document.createTextNode(
                task.reason
            )
        );


        reason.appendChild(
            reasonText
        );


        const timestampText =
            formatReasonTimestamp(
                task.reasonTimestamp,
                getSelectedStore()
            );


        if (timestampText) {

            const reasonTime =
                document.createElement("div");


            reasonTime.className =
                "scope-reason-time";


            reasonTime.textContent =
                timestampText;


            reason.appendChild(
                reasonTime
            );

        }


        element.appendChild(
            reason
        );

    }


    // ========================================================
    // ACTION BUTTONS
    // ========================================================

    const actions =
        document.createElement("div");


    actions.className =
        "scope-actions";


    // EDIT
    const editButton =
        document.createElement("button");


    editButton.className =
        "scope-action-button scope-edit";

    editButton.type =
        "button";

    editButton.textContent =
        "Edit";


    editButton.onclick =
        function (event) {

            event.stopPropagation();

            editScope(task.id);

        };


    actions.appendChild(
        editButton
    );


    // EDIT REASON
    if (task.reason) {

        const editReasonButton =
            document.createElement("button");


        editReasonButton.className =
            "scope-action-button scope-edit-reason";

        editReasonButton.type =
            "button";

        editReasonButton.textContent =
            "Edit Reason";


        editReasonButton.onclick =
            function (event) {

                event.stopPropagation();

                editReason(task.id);

            };


        actions.appendChild(
            editReasonButton
        );

    }


    // DELETE
    const deleteButton =
        document.createElement("button");


    deleteButton.className =
        "scope-action-button scope-delete";

    deleteButton.type =
        "button";

    deleteButton.textContent =
        "Delete";


    deleteButton.onclick =
        function (event) {

            event.stopPropagation();

            deleteScope(task.id);

        };


    actions.appendChild(
        deleteButton
    );


    element.appendChild(
        actions
    );


    // ========================================================
    // LONG PRESS
    // ========================================================

    let pressTimer =
        null;


    function startLongPress() {

        clearTimeout(
            pressTimer
        );


        pressTimer =
            setTimeout(
                function () {

                    document
                        .querySelectorAll(
                            ".scope-item.long-press-active"
                        )
                        .forEach(item => {

                            if (item !== element) {

                                item.classList.remove(
                                    "long-press-active"
                                );

                            }

                        });


                    element.classList.add(
                        "long-press-active"
                    );

                },
                700
            );

    }


    function cancelLongPress() {

        clearTimeout(
            pressTimer
        );

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


    if (!night) {

        alert(
            "Please select a deployment night."
        );

        return;

    }


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


    scopeInput.value =
        "";


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

        reasonInput.value =
            "";

        reasonInput.placeholder =
            "Enter reason or notes";

    }


    if (reasonGroup) {
        reasonGroup.classList.add(
            "hidden"
        );
    }


    if (moveGroup) {
        moveGroup.classList.add(
            "hidden"
        );
    }


    if (message) {
        message.textContent = "";
    }


    if (scopeManagementMessageTimer) {

        clearTimeout(
            scopeManagementMessageTimer
        );

        scopeManagementMessageTimer =
            null;

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


    if (reasonGroup) {

        if (
            action === "pending" ||
            action === "cancel" ||
            action === "move"
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


    if (reasonInput) {

        reasonInput.value =
            "";

        reasonInput.placeholder =
            "Enter reason or notes";

    }


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
        getCurrentTimestamp(store);


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


        if (!task.history) {
            task.history = [];
        }


        task.history.push({

            action:
                "Marked as Pending",

            reason:
                reason,

            timestamp:
                timestamp

        });


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


        if (!task.history) {
            task.history = [];
        }


        task.history.push({

            action:
                "Cancelled",

            reason:
                reason,

            timestamp:
                timestamp

        });


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


        if (!targetNight) {

            showScopeManagementMessage(
                "Please select a deployment night.",
                true
            );

            return;

        }


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

            history:
                [],

            originalScopeId:
                task.id

        });


        if (!task.history) {
            task.history = [];
        }


        task.history.push({

            action:
                "Moved to Another Night",

            reason:
                reason,

            timestamp:
                timestamp,

            fromNight:
                task.night,

            toNight:
                targetNight

        });


        showScopeManagementMessage(
            `Scope copied to Night ${targetNight}.`,
            false
        );


        resetScopeManagementFieldsAfterSave();

        renderStoreDetail();

        return;

    }


    showScopeManagementMessage(
        "This action is not supported.",
        true
    );

}


// ============================================================
// RESET AFTER SAVE
// ============================================================

function resetScopeManagementFieldsAfterSave() {

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

    const reasonGroup =
        document.getElementById(
            "scopeReasonGroup"
        );

    const moveGroup =
        document.getElementById(
            "moveNightGroup"
        );


    if (scopeSelect) {
        scopeSelect.value = "";
    }


    if (actionSelect) {
        actionSelect.value = "";
    }


    if (reasonInput) {

        reasonInput.value =
            "";

        reasonInput.placeholder =
            "Enter reason or notes";

    }


    if (reasonGroup) {
        reasonGroup.classList.add(
            "hidden"
        );
    }


    if (moveGroup) {
        moveGroup.classList.add(
            "hidden"
        );
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


    if (scopeManagementMessageTimer) {

        clearTimeout(
            scopeManagementMessageTimer
        );

    }


    element.textContent =
        message;


    element.style.color =
        isError
            ? "#b91c1c"
            : "#047857";


    scopeManagementMessageTimer =
        setTimeout(
            function () {

                element.textContent =
                    "";

                scopeManagementMessageTimer =
                    null;

            },
            5000
        );

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
// EDIT REASON
// ============================================================

function editReason(taskId) {

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


    if (!task.reason) {
        return;
    }


    const newReason =
        prompt(
            "Edit reason / notes:",
            task.reason
        );


    if (newReason === null) {
        return;
    }


    const cleanedReason =
        newReason.trim();


    const timestamp =
        getCurrentTimestamp(store);


    if (!cleanedReason) {

        task.reason =
            "";

        task.reasonTimestamp =
            "";


        if (!task.history) {
            task.history = [];
        }


        task.history.push({

            action:
                "Reason cleared",

            reason:
                "",

            timestamp:
                timestamp

        });


        renderStoreDetail();

        return;

    }


    task.reason =
        cleanedReason;


    task.reasonTimestamp =
        timestamp;


    if (!task.history) {
        task.history = [];
    }


    task.history.push({

        action:
            "Reason updated",

        reason:
            cleanedReason,

        timestamp:
            timestamp

    });


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
            .replace(
                /^Store\s*/i,
                ""
            );


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


    const newTimezone =
        prompt(
            "Enter Store Timezone (EST, CST, MST, or PST):",
            getStoreTimezone(store)
        );


    if (newTimezone === null) {
        return;
    }


    const cleanedTimezone =
        newTimezone
            .trim()
            .toUpperCase();


    if (
        !Object.prototype.hasOwnProperty.call(
            STORE_TIMEZONES,
            cleanedTimezone
        )
    ) {

        alert(
            "Invalid timezone. Please use EST, CST, MST, or PST."
        );

        return;

    }


    store.storeNumber =
        cleanedStoreNumber;


    store.technician =
        newTechnician.trim() ||
        "Unassigned";


    store.timezone =
        cleanedTimezone;


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


            if (assignmentMessageTimer) {

                clearTimeout(
                    assignmentMessageTimer
                );

            }


            assignmentMessageTimer =
                setTimeout(
                    function () {

                        assignmentMessage.textContent =
                            "";

                        assignmentMessageTimer =
                            null;

                    },
                    5000
                );

        }

        return;

    }


    store.currentNight =
        selectedNight;


    if (detailCurrentNight) {

        detailCurrentNight.textContent =
            `Night ${selectedNight}`;

    }


    const successMessage =
        `Current assigned night updated to Night ${selectedNight}.`;


    if (assignmentMessage) {

        assignmentMessage.textContent =
            successMessage;

        assignmentMessage.style.color =
            "#047857";

    }


    setupDeploymentNightSelect(
        "assignedNight"
    );


    if (assignmentMessageTimer) {

        clearTimeout(
            assignmentMessageTimer
        );

    }


    assignmentMessageTimer =
        setTimeout(
            function () {

                if (
                    assignmentMessage &&
                    assignmentMessage.textContent ===
                        successMessage
                ) {

                    assignmentMessage.textContent =
                        "";

                }


                assignmentMessageTimer =
                    null;

            },
            5000
        );

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
            getCurrentTimestamp(store),

        source:
            "technician"

    });


    renderOverview();

}
