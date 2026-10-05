/* =========================================
   DEPLOYMENT TRACKER
   Version 1 - Prototype
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  console.log("Deployment Tracker loaded.");

  /*
    =========================================
    STORE DATA
    =========================================

    This is temporary prototype data.
    Later, this will come from a database.
  */

  const stores = [
    {
      storeNumber: "0123",
      night: "Night 1",
      technician: "Technician A",
      status: "In Progress",
      progress: 80
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
    =========================================
    STORE CARD CLICK
    =========================================

    Later, clicking a store will open
    that store's deployment page.

    Example:

    Store 0123
        ↓
    Store 0123 Detail Page
  */

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

      console.log(
        `Opening deployment page for Store ${storeNumber}`
      );

      /*
        Temporary behavior:

        For now, we'll show an alert.
        Later, this will open the actual
        Store Detail page.
      */

      alert(
        `Opening deployment page for Store ${storeNumber}`
      );

    });

  });


  /*
    =========================================
    DEPLOYMENT DATA
    =========================================
  */

  console.log("Stores loaded:", stores);


  /*
    =========================================
    FUTURE FEATURES
    =========================================

    These will be added next:

    - Store detail page
    - Add deployment scope
    - Night 1 / Night 2 scope
    - Task status
    - Technician updates
    - Bridge check-in
    - Automatic timestamp
    - Equipment check
    - Missing equipment notes
    - Scope changes
    - Scope moved to another night
    - Technician access control
  */

});
