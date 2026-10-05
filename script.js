/* =========================================
   DEPLOYMENT TRACKER
   Version 4
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     STORE DATA
  ========================================= */

  const stores = [

    {
      storeNumber: "0123",
      technician: "Technician A",
      currentNight: "Night 3",
      status: "In Progress",
      progress: 50,
      checkedIn: false,
      checkInTime: null
    },

    {
      storeNumber: "0456",
      technician: "Technician B",
      currentNight: "Night 1",
      status: "Completed",
      progress: 100,
      checkedIn: false,
      checkInTime: null
    },

    {
      storeNumber: "0789",
      technician: "Technician C",
      currentNight: "Night 2",
      status: "Not Started",
      progress: 0,
      checkedIn: false,
      checkInTime: null
    },

    {
      storeNumber: "1011",
      technician: "Technician D",
      currentNight: "Night 2",
      status: "In Progress",
      progress: 45,
      checkedIn: false,
      checkInTime: null
    },

    {
      storeNumber: "1213",
      technician: "Technician E",
      currentNight: "Night 2",
      status: "Cancelled",
      progress: 0,
      checkedIn: false,
      checkInTime: null
    },

    {
      storeNumber: "1415",
      technician: "Technician F",
      currentNight: "Night 2",
      status: "In Progress",
      progress: 60,
      checkedIn: false,
      checkInTime: null
    }

  ];


  /* =========================================
     SCOPE DATA
  ========================================= */

  const storeScopes = {

    "0123": {

      "Night 1": [

        {
          name: "Remove Register 1",
          status: "Completed"
        },

        {
          name: "Remove Register 2",
          status: "Completed"
        }

      ],

      "Night 2": [

        {
          name: "Install Register 1",
          status: "Completed"
        }

      ],

      "Night 3": [

        {
          name: "Remove Register 3",
          status: "Not Started"
        },

        {
          name: "Install new fixture",
          status: "In Progress"
        },

        {
          name: "Equipment Check",
          status: "Not Started"
        }

      ],

      "Night 4": [],

      "Night 5": []

    }

  };


  /* =========================================
     RECENT UPDATES
  ========================================= */

  let recentUpdates = [

    {
      message:
        "Technician A updated Store 0123 — Install new fixture is In Progress.",
      time: "Today, 2:15 PM"
    },

    {
      message:
        "Deployment Team added scope for Store 0123 — Night 3.",
      time: "Today, 1:42 PM"
    },

    {
      message:
        "Store 0456 deployment completed.",
      time: "Today, 12:30 PM"
    },

    {
      message:
        "Store 1213 Night 1 scope cancelled — fixture not delivered.",
      time: "Yesterday, 11:20 PM"
    }

  ];


  /* =========================================
     ELEMENTS
  ========================================= */

  const storeGrid =
    document.getElementById("storeGrid");

  const overviewSection =
    document.getElementById("overviewSection");

  const recentUpdatesSection =
    document.getElementById("recentUpdatesSection");

  const recentUpdatesContainer =
    document.getElementById("recentUpdates");

  const storeDetail =
    document.getElementById("storeDetail");


  /* =========================================
     INITIAL LOAD
  ========================================= */

  renderOverview();

  renderRecentUpdates();


  /* =========================================
     RENDER OVERVIEW
  ========================================= */

  function renderOverview() {

    storeGrid.innerHTML = "";


    stores.forEach((store) => {

      const card =
        document.createElement("div");

      card.className = "store-card";


      card.innerHTML = `

        <div class="store-header">

          <span class="store-number">
            Store ${store.storeNumber}
          </span>

          <span
            class="status ${getStatusClass(store.status)}"
          >
            ${store.status}
          </span>

        </div>


        <div class="store-info">

          <strong>Technician:</strong>
          ${store.technician}

          <br>

          <strong>Current Night:</strong>
          ${store.currentNight}

        </div>


        <div class="progress-bar">

          <div
            class="progress"
            style="width: ${store.progress}%"
          ></div>

        </div>


        <div class="store-info">

          ${store.progress}% Complete

        </div>


        <div class="check-in-box">

          ${
            store.checkedIn

            ? `

              <button
                class="check-in-button checked"
                disabled
              >
                ✓ Checked In
              </button>

              <div class="check-in-time">

                Checked in at
                ${store.checkInTime}

              </div>

            `

            : `

              <button
                class="check-in-button"
                data-store="${store.storeNumber}"
              >
                Check In Technician
              </button>

              <div class="check-in-time">

                Not checked in yet

              </div>

            `
          }

        </div>

      `;


      /* =====================================
         CLICK STORE CARD
      ===================================== */

      card.addEventListener(
        "click",
        (event) => {

          if (
            event.target.closest(
              ".check-in-button"
            )
          ) {
            return;
          }

          openStoreDetail(
            store.storeNumber
          );

        }
      );


      /* =====================================
         CHECK-IN BUTTON
      ===================================== */

      const checkInButton =
        card.querySelector(
          ".check-in-button"
        );


      if (
        checkInButton &&
        !store.checkedIn
      ) {

        checkInButton.addEventListener(
          "click",
          (event) => {

            event.stopPropagation();

            checkInTechnician(
              store.storeNumber
            );

          }
        );

      }


      storeGrid.appendChild(card);

    });


    updateSummary();

  }


  /* =========================================
     CHECK-IN TECHNICIAN
  ========================================= */

  function checkInTechnician(
    storeNumber
  ) {

    const store =
      stores.find(
        item =>
          item.storeNumber === storeNumber
      );


    if (!store) return;


    const now =
      new Date();


    const formattedTime =
      now.toLocaleString(
        "en-PH",
        {
          dateStyle: "medium",
          timeStyle: "short"
        }
      );


    store.checkedIn = true;

    store.checkInTime =
      formattedTime;


    /* ADD RECENT UPDATE */

    recentUpdates.unshift({

      message:
        `${store.technician} checked in for Store ${store.storeNumber}.`,

      time:
        formattedTime

    });


    renderOverview();

    renderRecentUpdates();

  }


  /* =========================================
     OPEN STORE DETAIL
  ========================================= */

  function openStoreDetail(
    storeNumber
  ) {

    const store =
      stores.find(
        item =>
          item.storeNumber === storeNumber
      );


    if (!store) return;


    overviewSection.style.display =
      "none";

    recentUpdatesSection.style.display =
      "none";

    storeDetail.style.display =
      "block";


    storeDetail.innerHTML = `

      <div class="store-detail-header">

        <div class="store-detail-title">

          <h2>
            Store ${store.storeNumber}
          </h2>

          <p>

            Technician:
            ${store.technician}

            &nbsp; • &nbsp;

            Current Deployment:
            ${store.currentNight}

          </p>

        </div>


        <button
          class="back-button"
          id="backToOverview"
        >
          ← Back to Overview
        </button>

      </div>


      <div class="section">

        <h2>
          Deployment Status
        </h2>


        <div class="store-info">

          <strong>
            Technician:
          </strong>

          ${store.technician}

          <br>


          <strong>
            Current Night:
          </strong>

          ${store.currentNight}

          <br>


          <strong>
            Status:
          </strong>

          ${store.status}

        </div>


        <div class="progress-bar">

          <div
            class="progress"
            style="width: ${store.progress}%"
          ></div>

        </div>


        <strong>
          ${store.progress}% Complete
        </strong>

      </div>


      <div class="section">

        <div class="section-title">

          <div>

            <h2>
              Deployment Scope
            </h2>

            <p>
              Deployment Team / Admin
            </p>

          </div>


          <button
            class="primary-button"
            id="addScopeButton"
          >
            + Add Scope
          </button>

        </div>


        <div id="addScopeForm"></div>

        <div id="nightContainer"></div>

      </div>

    `;


    /* =====================================
       BACK BUTTON
    ===================================== */

    document
      .getElementById(
        "backToOverview"
      )
      .addEventListener(
        "click",
        () => {

          storeDetail.style.display =
            "none";

          overviewSection.style.display =
            "block";

          recentUpdatesSection.style.display =
            "block";

          renderOverview();

          renderRecentUpdates();

        }
      );


    /* =====================================
       ADD SCOPE
    ===================================== */

    document
      .getElementById(
        "addScopeButton"
      )
      .addEventListener(
        "click",
        () => {

          showAddScopeForm(
            store
          );

        }
      );


    renderNights(store);

  }


  /* =========================================
     RENDER NIGHTS
  ========================================= */

  function renderNights(
    store
  ) {

    const nightContainer =
      document.getElementById(
        "nightContainer"
      );


    nightContainer.innerHTML = "";


    const nights = [

      "Night 1",
      "Night 2",
      "Night 3",
      "Night 4",
      "Night 5"

    ];


    nights.forEach(
      (night) => {

        const tasks =
          storeScopes[
            store.storeNumber
          ]?.[night] || [];


        let tasksHTML = "";


        if (
          tasks.length === 0
        ) {

          tasksHTML = `

            <div class="scope-task">

              <div>

                <div
                  class="scope-task-name"
                >
                  No scope added yet
                </div>

                <div
                  class="scope-task-note"
                >
                  Admin can add scope
                  for this night.
                </div>

              </div>

            </div>

          `;

        }

        else {

          tasks.forEach(
            (task) => {

              tasksHTML += `

                <div
                  class="scope-task"
                >

                  <div>

                    <div
                      class="scope-task-name"
                    >
                      ${task.name}
                    </div>

                  </div>


                  <span
                    class="status
                    ${getStatusClass(
                      task.status
                    )}"
                  >

                    ${task.status}

                  </span>

                </div>

              `;

            }
          );

        }


        nightContainer.innerHTML += `

          <div
            class="night-section"
          >

            <div
              class="night-header"
            >

              <div>

                <h3>
                  ${night}
                </h3>

                <div
                  class="night-status"
                >

                  ${
                    night ===
                    store.currentNight

                    ? "★ Current Night"

                    : "Scope"
                  }

                </div>

              </div>

            </div>


            <div
              class="scope-list"
            >

              ${tasksHTML}

            </div>

          </div>

        `;

      }
    );

  }


  /* =========================================
     ADD SCOPE FORM
  ========================================= */

  function showAddScopeForm(
    store
  ) {

    const formContainer =
      document.getElementById(
        "addScopeForm"
      );


    formContainer.innerHTML = `

      <div
        class="add-scope-box"
      >

        <div
          class="form-group"
        >

          <label>
            Deployment Night
          </label>


          <select
            id="scopeNight"
          >

            <option>
              Night 1
            </option>

            <option>
              Night 2
            </option>

            <option>
              Night 3
            </option>

            <option>
              Night 4
            </option>

            <option>
              Night 5
            </option>

          </select>

        </div>


        <div
          class="form-group"
        >

          <label>
            Scope / Task
          </label>


          <input
            type="text"
            id="scopeName"
            placeholder="Example: Remove Register 4"
          >

        </div>


        <button
          class="primary-button"
          id="saveScope"
        >
          Save Scope
        </button>


        <button
          class="secondary-button"
          id="cancelScope"
        >
          Cancel
        </button>

      </div>

    `;


    /* CANCEL */

    document
      .getElementById(
        "cancelScope"
      )
      .addEventListener(
        "click",
        () => {

          formContainer.innerHTML =
            "";

        }
      );


    /* SAVE */

    document
      .getElementById(
        "saveScope"
      )
      .addEventListener(
        "click",
        () => {

          const night =
            document.getElementById(
              "scopeNight"
            ).value;


          const scopeName =
            document.getElementById(
              "scopeName"
            ).value.trim();


          if (!scopeName) {

            alert(
              "Please enter a scope/task."
            );

            return;

          }


          if (
            !storeScopes[
              store.storeNumber
            ]
          ) {

            storeScopes[
              store.storeNumber
            ] = {};

          }


          if (
            !storeScopes[
              store.storeNumber
            ][night]
          ) {

            storeScopes[
              store.storeNumber
            ][night] = [];

          }


          storeScopes[
            store.storeNumber
          ][night].push({

            name:
              scopeName,

            status:
              "Not Started"

          });


          /* RECENT UPDATE */

          const now =
            new Date();


          const formattedTime =
            now.toLocaleString(
              "en-PH",
              {
                dateStyle: "medium",
                timeStyle: "short"
              }
            );


          recentUpdates.unshift({

            message:
              `Deployment Team added "${scopeName}" to Store ${store.storeNumber} — ${night}.`,

            time:
              formattedTime

          });


          formContainer.innerHTML =
            "";


          renderNights(store);

        }
      );

  }


  /* =========================================
     RECENT UPDATES
  ========================================= */

  function renderRecentUpdates() {

    recentUpdatesContainer.innerHTML =
      "";


    if (
      recentUpdates.length === 0
    ) {

      recentUpdatesContainer.innerHTML = `

        <div class="update">

          <div class="update-main">
            No recent updates.
          </div>

        </div>

      `;

      return;

    }


    recentUpdates
      .slice(0, 8)
      .forEach(
        (update) => {

          const updateElement =
            document.createElement(
              "div"
            );


          updateElement.className =
            "update";


          updateElement.innerHTML = `

            <div
              class="update-main"
            >
              ${update.message}
            </div>

            <div
              class="update-time"
            >
              ${update.time}
            </div>

          `;


          recentUpdatesContainer
            .appendChild(
              updateElement
            );

        }
      );

  }


  /* =========================================
     SUMMARY
  ========================================= */

  function updateSummary() {

    const inProgress =
      stores.filter(
        store =>
          store.status ===
          "In Progress"
      ).length;


    const completed =
      stores.filter(
        store =>
          store.status ===
          "Completed"
      ).length;


    const checkedIn =
      stores.filter(
        store =>
          store.checkedIn
      ).length;


    document
      .getElementById(
        "totalStores"
      )
      .textContent =
      "12";


    document
      .getElementById(
        "inProgress"
      )
      .textContent =
      inProgress;


    document
      .getElementById(
        "completed"
      )
      .textContent =
      completed;


    document
      .getElementById(
        "checkedIn"
      )
      .textContent =
      checkedIn;

  }


  /* =========================================
     STATUS CLASS
  ========================================= */

  function getStatusClass(
    status
  ) {

    switch (status) {

      case "Completed":
        return "completed";

      case "In Progress":
        return "in-progress";

      case "Cancelled":
        return "cancelled";

      case "Missing":
        return "missing";

      default:
        return "not-started";

    }

  }


  console.log(
    "Deployment Tracker loaded successfully."
  );

});
