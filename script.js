/* =========================================================
   DEPLOYMENT TRACKER
   Prototype Version
========================================================= */


/* =========================================================
   STORE DATA
========================================================= */

let stores = [

    {
        number: "0123",
        technician: "Technician A",

        currentNight: 3,

        status: "In Progress",

        checkedIn: "2026-10-05 16:11",

        tasks: [

            {
                night: 1,
                description: "Remove Register 1",
                status: "Completed"
            },

            {
                night: 1,
                description: "Remove Register 2",
                status: "Completed"
            },

            {
                night: 2,
                description: "Install Register 1",
                status: "Completed"
            },

            {
                night: 3,
                description: "Remove Register 3",
                status: "Not Started"
            },

            {
                night: 3,
                description: "Install new fixture",
                status: "In Progress"
            },

            {
                night: 3,
                description: "Equipment Check",
                status: "Not Started"
            }

        ]
    },


    {
        number: "0456",
        technician: "Technician B",

        currentNight: 1,

        status: "Completed",

        checkedIn: "2026-10-05 16:11",

        tasks: [

            {
                night: 1,
                description: "Remove Register 1",
                status: "Completed"
            },

            {
                night: 1,
                description: "Install Register 1",
                status: "Completed"
            }

        ]
    },


    {
        number: "0789",
        technician: "Technician C",

        currentNight: 1,

        status: "Not Started",

        checkedIn: "",

        tasks: []

    },


    {
        number: "1011",
        technician: "Technician D",

        currentNight: 1,

        status: "Not Started",

        checkedIn: "",

        tasks: []

    },


    {
        number: "1213",
        technician: "Technician E",

        currentNight: 1,

        status: "Not Started",

        checkedIn: "",

        tasks: []

    },


    {
        number: "1415",
        technician: "Technician F",

        currentNight: 1,

        status: "Not Started",

        checkedIn: "",

        tasks: []

    }

];


/* =========================================================
   RECENT UPDATES
========================================================= */

let recentUpdates = [

    {
        store: "0123",
        technician: "Technician A",
        update: "Install new fixture marked as In Progress.",
        timestamp: "2026-10-05 14:30"
    },

    {
        store: "0123",
        technician: "Technician A",
        update: "Night 3 scope started.",
        timestamp: "2026-10-05 13:55"
    },

    {
        store: "0456",
        technician: "Technician B",
        update: "Deployment completed.",
        timestamp: "2026-10-05 12:40"
    }

];


/* =========================================================
   CURRENT STORE
========================================================= */

let selectedStoreNumber = null;


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderOverview();

    }
);


/* =========================================================
   FIND STORE
========================================================= */

function getStore(storeNumber) {

    return stores.find(
        store =>
            store.number === storeNumber
    );

}


/* =========================================================
   OVERVIEW
========================================================= */

function renderOverview() {

    const storeGrid =
        document.getElementById(
            "storeGrid"
        );


    storeGrid.innerHTML = "";


    stores.forEach(store => {

        const progress =
            calculateProgress(store);


        const card =
            document.createElement("div");


        card.className =
            "store-card";


        /*
            Clicking anywhere on the card
            opens the Store Detail page.
        */

        card.onclick = function () {

            openStoreDetail(
                store.number
            );

        };


        const checkedInHTML =
            store.checkedIn

                ? `

                    <div class="checked-in">
                        ✓ Checked In
                    </div>

                    <div class="check-in-time">
                        Checked in at
                        ${formatTimestamp(
                            store.checkedIn
                        )}
                    </div>

                  `

                : `

                    <button
                        class="store-checkin-button"
                        onclick="checkInStore(event, '${store.number}')"
                    >
                        Check In
                    </button>

                  `;


        card.innerHTML = `

            <div class="store-status-row">

                <h3>
                    Store ${store.number}
                </h3>

                <span
                    class="store-status
                    ${getStatusClass(store.status)}"
                >
                    ${store.status}
                </span>

            </div>


            <div class="store-info-line">

                Technician:
                <strong>
                    ${store.technician}
                </strong>

            </div>


            <div class="store-info-line">

                Current Night:
                <strong>
                    Night ${store.currentNight}
                </strong>

            </div>


            <div class="store-progress">

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${progress}%"
                    ></div>

                </div>


                <div class="progress-text">

                    ${progress}% Complete

                </div>

            </div>


            <div class="store-checkin">

                ${checkedInHTML}

            </div>

        `;


        storeGrid.appendChild(
            card
        );

    });


    updateSummary();

    renderRecentUpdates();

}


/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(status) {

    return status
        .toLowerCase()
        .replaceAll(" ", "-");

}


/* =========================================================
   SUMMARY
========================================================= */

function updateSummary() {

    document
        .getElementById(
            "totalStores"
        )
        .textContent = 12;


    let inProgress = 0;

    let completed = 0;

    let checkedIn = 0;


    stores.forEach(store => {

        if (
            store.status ===
            "In Progress"
        ) {

            inProgress++;

        }


        if (
            store.status ===
            "Completed"
        ) {

            completed++;

        }


        if (store.checkedIn) {

            checkedIn++;

        }

    });


    document
        .getElementById(
            "inProgressStores"
        )
        .textContent =
        inProgress;


    document
        .getElementById(
            "completedStores"
        )
        .textContent =
        completed;


    document
        .getElementById(
            "checkedInStores"
        )
        .textContent =
        checkedIn;

}


/* =========================================================
   PROGRESS
========================================================= */

function calculateProgress(store) {

    if (
        !store.tasks ||
        !store.tasks.length
    ) {

        return 0;

    }


    const completed =
        store.tasks.filter(
            task =>
                task.status ===
                "Completed"
        ).length;


    return Math.round(
        (
            completed /
            store.tasks.length
        ) * 100
    );

}


/* =========================================================
   RECENT UPDATES
========================================================= */

function renderRecentUpdates() {

    const container =
        document.getElementById(
            "recentUpdates"
        );


    container.innerHTML = "";


    recentUpdates
        .slice()
        .reverse()
        .forEach(item => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "update-item";


            div.innerHTML = `

                <div class="update-header">

                    <span class="update-store">
                        Store ${item.store}
                    </span>

                    <span>—</span>

                    <span class="update-tech">
                        ${item.technician}
                    </span>

                </div>


                <div class="update-message">

                    ${item.update}

                </div>


                <div class="update-time">

                    ${formatTimestamp(
                        item.timestamp
                    )}

                </div>

            `;


            container.appendChild(
                div
            );

        });

}


/* =========================================================
   STORE CHECK-IN
========================================================= */

function checkInStore(
    event,
    storeNumber
) {

    /*
        Prevent the button click from
        opening the Store Detail page.
    */

    event.stopPropagation();


    const store =
        getStore(storeNumber);


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


    recentUpdates.push({

        store: store.number,

        technician:
            store.technician,

        update:
            "Technician checked in for deployment.",

        timestamp:
            timestamp

    });


    renderOverview();

}


/* =========================================================
   OPEN STORE DETAIL
========================================================= */

function openStoreDetail(
    storeNumber
) {

    const store =
        getStore(storeNumber);


    if (!store) {

        return;

    }


    selectedStoreNumber =
        storeNumber;


    document
        .getElementById(
            "overviewPage"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "storeDetailPage"
        )
        .classList.remove(
            "hidden"
        );


    renderStoreDetail();

}


/* =========================================================
   STORE DETAIL
========================================================= */

function renderStoreDetail() {

    const store =
        getStore(
            selectedStoreNumber
        );


    if (!store) {

        return;

    }


    document
        .getElementById(
            "detailStoreNumber"
        )
        .textContent =
        store.number;


    document
        .getElementById(
            "detailStoreNumberInfo"
        )
        .textContent =
        store.number;


    document
        .getElementById(
            "detailTechnician"
        )
        .textContent =
        store.technician;


    document
        .getElementById(
            "detailCurrentNight"
        )
        .textContent =
        `Night ${store.currentNight}`;


    document
        .getElementById(
            "detailCheckIn"
        )
        .textContent =
        store.checkedIn
            ? formatTimestamp(
                store.checkedIn
            )
            : "Not Checked In";


    document
        .getElementById(
            "detailStoreStatus"
        )
        .textContent =
        `${store.status} • ${calculateProgress(store)}% deployment progress`;


    document
        .getElementById(
            "assignedNight"
        )
        .value =
        store.currentNight;


    renderNightSections();

}


/* =========================================================
   RENDER NIGHTS
========================================================= */

function renderNightSections() {

    const store =
        getStore(
            selectedStoreNumber
        );


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

        const tasks =
            store.tasks.filter(
                task =>
                    task.night === night
            );


        const section =
            document.createElement(
                "div"
            );


        section.className =
            "night-section";


        section.innerHTML = `

            <div class="night-header">

                <h4>
                    Night ${night}
                </h4>

                <span>
                    ${tasks.length}
                    scope item(s)
                </span>

            </div>


            <div
                class="scope-list"
                id="night-${night}"
            ></div>

        `;


        container.appendChild(
            section
        );


        const scopeList =
            section.querySelector(
                ".scope-list"
            );


        if (!tasks.length) {

            scopeList.innerHTML = `

                <div class="empty-scope">

                    No scope added for
                    Night ${night}.

                </div>

            `;

            continue;

        }


        tasks.forEach(
            (task, taskIndex) => {

                const taskElement =
                    createScopeElement(
                        task,
                        taskIndex
                    );


                scopeList.appendChild(
                    taskElement
                );

            }
        );

    }

}


/* =========================================================
   CREATE SCOPE ITEM
========================================================= */

function createScopeElement(
    task,
    taskIndex
) {

    const div =
        document.createElement(
            "div"
        );


    div.className =
        "scope-item";


    let pressTimer = null;


    function startPress(event) {

        if (
            event.type ===
                "mousedown" &&
            event.button !== 0
        ) {

            return;

        }


        pressTimer =
            setTimeout(
                () => {

                    div.classList.add(
                        "long-press-active"
                    );

                },
                700
            );

    }


    function cancelPress() {

        clearTimeout(
            pressTimer
        );

    }


    div.addEventListener(
        "mousedown",
        startPress
    );


    div.addEventListener(
        "mouseup",
        cancelPress
    );


    div.addEventListener(
        "mouseleave",
        cancelPress
    );


    div.addEventListener(
        "touchstart",
        startPress,
        {
            passive: true
        }
    );


    div.addEventListener(
        "touchend",
        cancelPress
    );


    div.addEventListener(
        "touchmove",
        cancelPress
    );


    div.innerHTML = `

        <div class="scope-main">

            <div class="scope-description">

                ${task.description}

            </div>


            <div class="scope-status">

                ${task.status}

            </div>

        </div>


        <button
            class="scope-delete"
            onclick="deleteScope(
                ${taskIndex},
                ${task.night}
            )"
        >
            Delete
        </button>

    `;


    return div;

}


/* =========================================================
   ADD SCOPE
========================================================= */

function addScope() {

    const store =
        getStore(
            selectedStoreNumber
        );


    const night =
        Number(
            document
                .getElementById(
                    "scopeNight"
                )
                .value
        );


    const description =
        document
            .getElementById(
                "scopeDescription"
            )
            .value
            .trim();


    const status =
        document
            .getElementById(
                "scopeStatus"
            )
            .value;


    if (!description) {

        alert(
            "Please enter the deployment scope."
        );

        return;

    }


    store.tasks.push({

        night:
            night,

        description:
            description,

        status:
            status

    });


    /*
        If a scope is added to a store
        that was Not Started, move it
        to In Progress.
    */

    if (
        store.status ===
        "Not Started"
    ) {

        store.status =
            "In Progress";

    }


    recentUpdates.push({

        store:
            store.number,

        technician:
            store.technician,

        update:
            `Added scope "${description}" to Night ${night}.`,

        timestamp:
            getCurrentTimestamp()

    });


    document
        .getElementById(
            "scopeDescription"
        )
        .value = "";


    renderStoreDetail();

}


/* =========================================================
   DELETE SCOPE
========================================================= */

function deleteScope(
    taskIndex,
    night
) {

    const store =
        getStore(
            selectedStoreNumber
        );


    const tasks =
        store.tasks.filter(
            task =>
                task.night === night
        );


    const task =
        tasks[taskIndex];


    if (!task) {

        return;

    }


    const confirmed =
        confirm(
            `Delete "${task.description}" from Night ${night}?`
        );


    if (!confirmed) {

        return;

    }


    const actualIndex =
        store.tasks.indexOf(
            task
        );


    store.tasks.splice(
        actualIndex,
        1
    );


    recentUpdates.push({

        store:
            store.number,

        technician:
            store.technician,

        update:
            `Deleted scope "${task.description}" from Night ${night}.`,

        timestamp:
            getCurrentTimestamp()

    });


    renderStoreDetail();

}


/* =========================================================
   EDIT STORE + TECHNICIAN
========================================================= */

function editStoreInfo() {

    const store =
        getStore(
            selectedStoreNumber
        );


    const newStoreNumber =
        prompt(
            "Enter Store Number:",
            store.number
        );


    if (
        newStoreNumber === null ||
        !newStoreNumber.trim()
    ) {

        return;

    }


    const newTechnician =
        prompt(
            "Enter Technician Name:",
            store.technician
        );


    if (
        newTechnician === null ||
        !newTechnician.trim()
    ) {

        return;

    }


    const cleanStoreNumber =
        newStoreNumber.trim();


    const duplicate =
        stores.some(
            existing =>
                existing !== store &&
                existing.number ===
                    cleanStoreNumber
        );


    if (duplicate) {

        alert(
            "That Store Number already exists."
        );

        return;

    }


    const oldStoreNumber =
        store.number;


    store.number =
        cleanStoreNumber;


    store.technician =
        newTechnician.trim();


    selectedStoreNumber =
        cleanStoreNumber;


    recentUpdates.push({

        store:
            cleanStoreNumber,

        technician:
            store.technician,

        update:
            `Store information updated from Store ${oldStoreNumber}.`,

        timestamp:
            getCurrentTimestamp()

    });


    renderStoreDetail();

}


/* =========================================================
   SAVE NIGHT ASSIGNMENT
========================================================= */

function saveNightAssignment() {

    const store =
        getStore(
            selectedStoreNumber
        );


    const night =
        Number(
            document
                .getElementById(
                    "assignedNight"
                )
                .value
        );


    store.currentNight =
        night;


    recentUpdates.push({

        store:
            store.number,

        technician:
            store.technician,

        update:
            `Technician scope assignment changed to Night ${night}.`,

        timestamp:
            getCurrentTimestamp()

    });


    document
        .getElementById(
            "assignmentMessage"
        )
        .textContent =
        `Assignment saved. Technician is currently assigned to Night ${night}.`;


    renderStoreDetail();

}


/* =========================================================
   BACK TO OVERVIEW
========================================================= */

function backToOverview() {

    document
        .getElementById(
            "storeDetailPage"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "overviewPage"
        )
        .classList.remove(
            "hidden"
        );


    renderOverview();

}


/* =========================================================
   TIMESTAMP
========================================================= */

function getCurrentTimestamp() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        )
        .padStart(
            2,
            "0"
        );


    const hours =
        String(
            now.getHours()
        )
        .padStart(
            2,
            "0"
        );


    const minutes =
        String(
            now.getMinutes()
        )
        .padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day} ${hours}:${minutes}`;

}


/* =========================================================
   DISPLAY TIMESTAMP
========================================================= */

function formatTimestamp(
    timestamp
) {

    if (!timestamp) {

        return "";

    }


    const date =
        new Date(
            timestamp.replace(
                " ",
                "T"
            )
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return timestamp;

    }


    return date.toLocaleString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );

}
