/* =========================================
   DEPLOYMENT TRACKER
   Version 2 - Store Detail Prototype
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const stores = [
    {
      storeNumber: "0123",
      night: "Night 3",
      technician: "Technician A",
      status: "In Progress",
      progress: 50
    },
    {
      storeNumber: "0456",
      night: "Night 1",
      technician: "Technician B",
      status: "Completed",
      progress: 100
    },
    {
      storeNumber: "0789",
      night: "Night 2",
      technician: "Technician C",
      status: "Not Started",
      progress: 0
    },
    {
      storeNumber: "1011",
      night: "Night 2",
      technician: "Technician D",
      status: "In Progress",
      progress: 45
    },
    {
      storeNumber: "1213",
      night: "Night 1",
      technician: "Technician E",
      status: "Cancelled",
      progress: 0
    },
    {
      storeNumber: "1415",
      night: "Night 2",
      technician: "Technician F",
      status: "In Progress",
      progress: 60
    }
  ];

  /*
    Temporary prototype scope data.

    Later:
    - Admin will add scopes
    - Technician will update task status
    - Night 1-5 will be dynamic
    - Database will store everything
  */

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
     STORE CARD CLICK
  ========================================= */

  const storeCards = document.querySelectorAll(".store-card");

  storeCards.forEach((card) => {

    card.addEventListener("click", () => {

      const storeNumberElement =
        card.querySelector(".store-number");

      if (!storeNumberElement) {
        return;
      }

      const storeNumber =
        storeNumberElement.textContent
          .replace("Store", "")
          .trim();

      openStoreDetail(storeNumber);

    });

  });


  /* =========================================
     OPEN STORE DETAIL
  ========================================= */

  function openStoreDetail(storeNumber) {

    const store = stores.find(
      (item) => item.storeNumber === storeNumber
    );

    if (!store) {
      alert(`Store ${storeNumber} was not found.`);
      return;
    }

    const scopes =
      storeScopes[storeNumber] || {};

    const existingContent =
      document.querySelector(".container");

    if (!existingContent) {
      return;
    }

    let nightsHTML = "";

    const nights = [
      "Night 1",
      "Night 2",
      "Night 3",
      "Night 4",
      "Night 5"
    ];

    nights.forEach((night) => {

      const tasks = scopes[night] || [];

      let tasksHTML = "";

      if (tasks.length === 0) {

        tasksHTML = `
          <div class="scope-task">
            <div>
              <div class="scope-task-name">
                No scope added yet
              </div>
              <div class="scope-task-note">
                Deployment Team can add scope for this night.
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

              <span class="status ${getStatusClass(task.status)}">
                ${task.status}
              </span>

            </div>
          `;

        });

      }

      nightsHTML += `
        <div class="night-section">

          <div class="night-header">

            <div>
              <h3>${night}</h3>
              <div class="night-status">
                ${night === store.night
                  ? "Current Night"
                  : "Scope"}
              </div>
            </div>

          </div>

          <div class="scope-list">
            ${tasksHTML}
          </div>

        </div>
      `;

    });


    existingContent.innerHTML = `

      <div class="store-detail-header">

        <div class="store-detail-title">

          <h2>
            Store ${store.storeNumber}
          </h2>

          <p>
            Technician: ${store.technician}
            &nbsp; • &nbsp;
            Current Deployment: ${store.night}
          </p>

        </div>

        <button
          class="back-button"
          onclick="location.reload()"
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
          ${store.night}

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

        <h2>Bridge Check-In</h2>

        <div class="check-in-box">

          <button
            class="primary-button"
            id="checkInButton"
          >
            Check In Technician
          </button>

          <div
            class="check-in-time"
            id="checkInTime"
          >
            Technician has not checked in yet.
          </div>

        </div>

      </div>


      <div class="section">

        <h2>Deployment Scope</h2>

        ${nightsHTML}

      </div>

    `;


    /* =========================================
       CHECK-IN
    ========================================= */

    const checkInButton =
      document.querySelector("#checkInButton");

    const checkInTime =
      document.querySelector("#checkInTime");

    if (checkInButton) {

      checkInButton.addEventListener("click", () => {

        const now = new Date();

        const formattedTime =
          now.toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short"
          });

        checkInTime.textContent =
          `Checked in at ${formattedTime}`;

        checkInButton.textContent =
          "✓ Technician Checked In";

        checkInButton.disabled = true;

      });

    }

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
