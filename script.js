/* =========================================
   DEPLOYMENT TRACKER
   Version 3
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
     ELEMENTS
  ========================================= */

  const storeGrid =
    document.getElementById("storeGrid");

  const overviewSection =
    document.getElementById("overviewSection");

  const storeDetail =
    document.getElementById("storeDetail");


  /* =========================================
     INITIAL LOAD
  ========================================= */

  renderOverview();


  /* =========================================
     RENDER OVERVIEW
  ========================================= */

  function renderOverview() {

    storeGrid.innerHTML = "";

    stores.forEach((store) => {

      const card = document.createElement("div");

      card.className = "store-card";

      card.innerHTML = `

        <div class="store-header">

          <span class="store-number">
            Store ${store.storeNumber}
          </span>

          <span class="status ${getStatusClass(store.status)}">
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


      /* OPEN STORE */

      card.addEventListener("click", (event) => {

        if (
          event.target.classList.contains("check-in-button")
        ) {
          return;
        }

        openStoreDetail(store.storeNumber);

      });


      /* CHECK-IN */

      const checkInButton =
        card.querySelector(".check-in-button");

      if (checkInButton && !store.checkedIn) {

        checkInButton.addEventListener(
          "click",
          (event) => {

            event.stopPropagation();

            checkInTechnician(store.storeNumber);

          }
        );

      }


      storeGrid.appendChild(card);

    });

    updateSummary();

  }


  /* =========================================
     CHECK-IN
  ========================================= */

  function checkInTechnician(storeNumber) {

    const store =
      stores.find(
        item => item.storeNumber === storeNumber
      );

    if (!store) return;

    const now = new Date();

    const formattedTime =
      now.toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short"
      });

    store.checkedIn = true;
    store.checkInTime = formattedTime;

    renderOverview();

  }


  /* =========================================
     STORE DETAIL
  ========================================= */

  function openStoreDetail(storeNumber) {

    const store =
      stores.find(
        item => item.storeNumber === storeNumber
      );

    if (!store) return;

    overviewSection.style.display = "none";

    storeDetail.style.display = "block";

    storeDetail.innerHTML = `

      <div class="store-detail-header">

        <div class="store-detail-title">

          <h2>
            Store ${store.storeNumber}
          </h2>

          <p>
            Technician: ${store.technician}
            &nbsp; • &nbsp;
            Current Deployment: ${store.currentNight}
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

        <h2>Deployment Status</h2>

        <div class="store-info">

          <strong>Technician:</strong>
          ${store.technician}

          <br>

          <strong>Current Night:</strong>
          ${store.currentNight}

          <br>

          <strong>Status:</strong>
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

            <h2>Deployment Scope</h2>

            <p>
              Deployment Team / Admin only
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


    document
      .getElementById("backToOverview")
      .addEventListener("click", () => {

        storeDetail.style.display = "none";
        overviewSection.style.display = "block";

        renderOverview();

      });


    document
      .getElementById("addScopeButton")
      .addEventListener("click", () => {

        showAddScopeForm(store);

      });


    renderNights(store);

  }


  /* =========================================
     RENDER NIGHTS
  ========================================= */

  function renderNights(store) {

    const nightContainer =
      document.getElementById("nightContainer");

    nightContainer.innerHTML = "";

    const nights = [
      "Night 1",
      "Night 2",
      "Night 3",
      "Night 4",
      "Night 5"
    ];


    nights.forEach((night) => {

      const tasks =
        storeScopes[store.storeNumber]?.[night] || [];


      let tasksHTML = "";


      if (tasks.length === 0) {

        tasksHTML = `

          <div class="scope-task">

            <div>

              <div class="scope-task-name">
                No scope added yet
              </div>

              <div class="scope-task-note">
                Admin can add scope for this night.
              </div>

            </div>

          </div>

        `;

      } else {

        tasks.forEach((task) => {

          tasksHTML += `

            <div class="scope-task">

              <div>

                <div class="scope-task-name">
                  ${task.name}
                </div>

              </div>

              <span
                class="status ${getStatusClass(task.status)}"
              >
                ${task.status}
              </span>

            </div>

          `;

        });

      }


      nightContainer.innerHTML += `

        <div class="night-section">

          <div class="night-header">

            <div>

              <h3>${night}</h3>

              <div class="night-status">

                ${
                  night === store.currentNight
                    ? "★ Current Night"
                    : "Scope"

                }

              </div>

            </div>

          </div>

          <div class="scope-list">

            ${tasksHTML}

          </div>

        </div>

      `;

    });

  }


  /* =========================================
     ADD SCOPE FORM
  ========================================= */

  function showAddScopeForm(store) {

    const formContainer =
      document.getElementById("addScopeForm");

    formContainer.innerHTML = `

      <div class="add-scope-box">

        <div class="form-group">

          <label>
            Deployment Night
          </label>

          <select id="scopeNight">

            <option>Night 1</option>
            <option>Night 2</option>
            <option>Night 3</option>
            <option>Night 4</option>
            <option>Night 5</option>

          </select>

        </div>


        <div class="form-group">

          <label>
            Scope / Task
          </label>

          <input
            type="text"
            id="scopeName"
            placeholder="Example: Remove Register 4"
          >

        </div>


        <div>

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

      </div>

    `;


    document
      .getElementById("cancelScope")
      .addEventListener("click", () => {

        formContainer.innerHTML = "";

      });


    document
      .getElementById("saveScope")
      .addEventListener("click", () => {

        const night =
          document.getElementById("scopeNight").value;

        const scopeName =
          document.getElementById("scopeName").value.trim();


        if (!scopeName) {

          alert("Please enter a scope/task.");

          return;

        }


        if (!storeScopes[store.storeNumber]) {

          storeScopes[store.storeNumber] = {};

        }


        if (!storeScopes[store.storeNumber][night]) {

          storeScopes[store.storeNumber][night] = [];

        }


        storeScopes[store.storeNumber][night].push({

          name: scopeName,

          status: "Not Started"

        });


        formContainer.innerHTML = "";

        renderNights(store);

      });

  }


  /* =========================================
     SUMMARY
  ========================================= */

  function updateSummary() {

    const inProgress =
      stores.filter(
        store => store.status === "In Progress"
      ).length;

    const completed =
      stores.filter(
        store => store.status === "Completed"
      ).length;

    const checkedIn =
      stores.filter(
        store => store.checkedIn
      ).length;


    document.getElementById("totalStores").textContent =
      12;

    document.getElementById("inProgress").textContent =
      inProgress;

    document.getElementById("completed").textContent =
      completed;

    document.getElementById("checkedIn").textContent =
      checkedIn;

  }


  /* =========================================
     STATUS CLASS
  ========================================= */

  function getStatusClass(status) {

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


  console.log("Deployment Tracker loaded.");

});
