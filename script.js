// ========================================
// SMART MULTI-TANK IoT DASHBOARD
// ========================================


// ========================================
// MOBILE MENU
// ========================================

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        menuToggle.classList.toggle("active");
    });
}


// ========================================
// CLOSE MOBILE MENU
// ========================================

const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach(link => {
    link.addEventListener("click", () => {

        if (navMenu) {
            navMenu.classList.remove("active");
        }

        if (menuToggle) {
            menuToggle.classList.remove("active");
        }

    });
});


// ========================================
// HEADER SCROLL EFFECT
// ========================================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


// ========================================
// SMOOTH SCROLLING
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target = document.querySelector(
            this.getAttribute("href")
        );

        if (target) {

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


// ========================================
// BACK TO TOP
// ========================================

const backToTop = document.querySelector(".back-to-top");

if (backToTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }

    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


// ========================================
// CURRENT YEAR
// ========================================

const yearElement = document.querySelector("#current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// ========================================
// SCROLL REVEAL
// ========================================

const revealElements = document.querySelectorAll(
    ".reveal, .section, .card, .product-card"
);

const revealOnScroll = () => {

    revealElements.forEach(element => {

        const elementTop =
            element.getBoundingClientRect().top;

        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            element.classList.add("visible");
        }

    });

};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);


// ========================================
// TANK DATA
// ========================================

const tanks = {

    1: {
        level: 65,
        distance: 140,
        pump: false
    },

    2: {
        level: 78,
        distance: 88,
        pump: false
    },

    3: {
        level: 18,
        distance: 328,
        pump: true
    }

};


// ========================================
// UPDATE TANK DISPLAY
// ========================================

function updateTank(tankNumber) {

    const tank = tanks[tankNumber];

    const waterElement =
        document.querySelector(`#tank${tankNumber}Water`);

    const levelElement =
        document.querySelector(`#tank${tankNumber}Level`);

    const distanceElement =
        document.querySelector(`#tank${tankNumber}Distance`);

    const tankCard =
        document.querySelectorAll(".tank-card")[tankNumber - 1];

    if (!tank) return;


    // Water animation

    if (waterElement) {
        waterElement.style.height = `${tank.level}%`;
    }


    // Percentage

    if (levelElement) {
        levelElement.textContent =
            `${Math.round(tank.level)}%`;
    }


    // Water level text

    if (distanceElement) {
        distanceElement.textContent =
            `${Math.round(tank.level)}%`;
    }


    // Tank status

    if (tankCard) {

        const status =
            tankCard.querySelector(".tank-status");

        const pump =
            tankCard.querySelector(".data-item:last-child strong");


        if (status) {

            status.classList.remove(
                "safe",
                "warning",
                "critical"
            );


            if (tank.level < 20) {

                status.textContent = "CRITICAL";
                status.classList.add("critical");

            }

            else if (tank.level < 40) {

                status.textContent = "WARNING";
                status.classList.add("warning");

            }

            else {

                status.textContent = "SAFE";
                status.classList.add("safe");

            }

        }


        // Pump status

        if (pump) {

            if (tank.pump) {

                pump.textContent = "ON";

                pump.classList.remove("pump-off");
                pump.classList.add("pump-on");

            }

            else {

                pump.textContent = "OFF";

                pump.classList.remove("pump-on");
                pump.classList.add("pump-off");

            }

        }

    }

}


// ========================================
// UPDATE ALL TANKS
// ========================================

function updateAllTanks() {

    updateTank(1);
    updateTank(2);
    updateTank(3);

}


// ========================================
// SYSTEM LEVEL
// ========================================

function updateSystemLevel() {

    const systemLevel =
        document.querySelector("#systemLevel");

    if (!systemLevel) return;


    const average =
        (
            tanks[1].level +
            tanks[2].level +
            tanks[3].level
        ) / 3;


    systemLevel.textContent =
        `${Math.round(average)}%`;

}


// ========================================
// PUMP COUNT
// ========================================

function updatePumpCount() {

    const pumpsRunning =
        document.querySelector("#pumpsRunning");

    if (!pumpsRunning) return;


    let count = 0;

    if (tanks[1].pump) count++;
    if (tanks[2].pump) count++;
    if (tanks[3].pump) count++;


    pumpsRunning.textContent = count;

}


// ========================================
// ALERT COUNT
// ========================================

function updateAlerts() {

    const alertCount =
        document.querySelector("#alertCount");

    const alertBox =
        document.querySelector("#alertBox");

    if (!alertCount || !alertBox) return;


    let alerts = 0;


    if (tanks[1].level < 20) alerts++;
    if (tanks[2].level < 20) alerts++;
    if (tanks[3].level < 20) alerts++;


    alertCount.textContent = alerts;


    if (alerts === 0) {

        alertBox.innerHTML = `

            <div class="alert-icon">
                ✓
            </div>

            <div>
                <strong>No Active Alerts</strong>
                <p>All tanks are operating normally.</p>
            </div>

        `;

    }

    else {

        alertBox.innerHTML = `

            <div class="alert-icon">
                ⚠
            </div>

            <div>
                <strong>${alerts} Tank Alert${alerts > 1 ? "s" : ""}</strong>
                <p>One or more tanks require attention.</p>
            </div>

        `;

    }

}


// ========================================
// AUTOMATIC PUMP CONTROL
// ========================================

function automaticPumpControl() {

    const autoMode =
        document.querySelector("#autoMode");

    if (!autoMode) return;


    if (!autoMode.checked) return;


    for (let i = 1; i <= 3; i++) {

        if (tanks[i].level < 20) {

            tanks[i].pump = true;

        }

        else if (tanks[i].level >= 80) {

            tanks[i].pump = false;

        }

    }


   updateDashboard();
updatePumpButton();

}


// ========================================
// MANUAL PUMP CONTROL
// ========================================

const pumpButton =
    document.querySelector("#pumpButton");

function updatePumpButton() {

    if (!pumpButton) return;

    if (tanks[3].pump) {

        pumpButton.textContent = "Turn Pump OFF";

    } else {

        pumpButton.textContent = "Turn Pump ON";

    }

}


if (pumpButton) {

    pumpButton.addEventListener("click", () => {

        const systemAccess =
            document.querySelector("#systemAccess");

        const autoMode =
            document.querySelector("#autoMode");


        // System access check

        if (systemAccess && !systemAccess.checked) {

            alert("System Access is disabled.");

            return;

        }


        // Automatic mode check

        if (autoMode && autoMode.checked) {

            alert(
                "Turn OFF Automatic Mode before manually controlling the pump."
            );

            return;

        }


        // Toggle Tank 3 pump

        tanks[3].pump = !tanks[3].pump;


        // Update button immediately

        updatePumpButton();


        // Update dashboard

        updateDashboard();

    });

}
// ========================================
// AUTOMATIC MODE SWITCH
// ========================================

const autoMode =
    document.querySelector("#autoMode");

if (autoMode) {

    autoMode.addEventListener("change", () => {

        automaticPumpControl();

        updateDashboard();

    });

}


// ========================================
// SYSTEM ACCESS SWITCH
// ========================================

const systemAccess =
    document.querySelector("#systemAccess");

if (systemAccess) {

    systemAccess.addEventListener("change", () => {

        const enabled =
            systemAccess.checked;


        if (!enabled) {

            tanks[1].pump = false;
            tanks[2].pump = false;
            tanks[3].pump = false;

        }


        updateDashboard();

    });

}


// ========================================
// COMPLETE DASHBOARD UPDATE
// ========================================

function updateDashboard() {

    updateAllTanks();

    updateSystemLevel();

    updatePumpCount();

    updateAlerts();

}


// ========================================
// START DASHBOARD
// ========================================

updateDashboard();
// ========================================
// DEMO SENSOR SIMULATION
// ========================================

setInterval(() => {

    const systemAccess =
        document.querySelector("#systemAccess");

    const autoMode =
        document.querySelector("#autoMode");


    // System access disabled = stop simulation
    if (systemAccess && !systemAccess.checked) {
        return;
    }


    // ========================================
    // AUTOMATIC MODE
    // ========================================

    if (autoMode && autoMode.checked) {

        for (let i = 1; i <= 3; i++) {

            // Pump OFF → tank level decreases
            if (!tanks[i].pump) {
                tanks[i].level -= 1;
            }

            // Pump ON → tank level increases
            else {
                tanks[i].level += 2;
            }

        }

        // Automatically decide which pumps should run
        automaticPumpControl();

    }


    // ========================================
    // MANUAL MODE
    // ========================================

    else {

        // Only Tank 3 is controlled by our manual button

        if (tanks[3].pump) {

            // Pump ON → tank fills
            tanks[3].level += 2;

        } else {

            // Pump OFF → tank level decreases
            tanks[3].level -= 1;

        }

    }


    // ========================================
    // KEEP LEVEL BETWEEN 0 AND 100
    // ========================================

    for (let i = 1; i <= 3; i++) {

        tanks[i].level = Math.max(
            0,
            Math.min(100, tanks[i].level)
        );

    }


    // ========================================
    // UPDATE DASHBOARD
    // ========================================

    updateDashboard();


}, 1000);

