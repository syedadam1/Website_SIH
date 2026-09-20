/* =========================================
   ECHO FRONTEND
   ========================================= */


/* =========================================
   REAL-WORLD MANGANESE LOCATIONS
   ========================================= */

/*
   Prototype locations in India.

   These points represent manganese-bearing
   regions/areas used for the SIH prototype.

   They should NOT be interpreted as exact
   mine-boundary survey coordinates.
*/

const manganeseLocations = [

    {
        id: "balaghat",

        name: "Balaghat",

        state: "Madhya Pradesh",

        latitude: 21.8129,

        longitude: 80.1838,

        mineral: "Manganese",

        prospectivity: "Very High",

        description:
            "Manganese-bearing region in Balaghat district, Madhya Pradesh."
    },


    {
        id: "tirodi",

        name: "Tirodi",

        state: "Madhya Pradesh",

        latitude: 21.688,

        longitude: 79.950,

        mineral: "Manganese",

        prospectivity: "High",

        description:
            "Manganese-bearing area associated with the Balaghat mineral belt."
    },


    {
        id: "bharweli",

        name: "Bharweli",

        state: "Madhya Pradesh",

        latitude: 21.810,

        longitude: 80.190,

        mineral: "Manganese",

        prospectivity: "High",

        description:
            "Manganese-bearing area in the Balaghat region."
    },


    {
        id: "sitapatore",

        name: "Sitapatore",

        state: "Madhya Pradesh",

        latitude: 21.780,

        longitude: 80.100,

        mineral: "Manganese",

        prospectivity: "Medium",

        description:
            "Manganese-bearing area used as a prototype exploration point."
    }

];



/* =========================================
   MAP VARIABLES
   ========================================= */

let dashboardMap = null;

let reserveMap = null;

let dashboardMarkers = [];

let reserveMarkers = [];



/* =========================================
   PAGE NAVIGATION
   ========================================= */

function showPage(pageId, clickedButton) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(page => {

        page.classList.remove("active");

    });


    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    const buttons =
        document.querySelectorAll(".menu");


    buttons.forEach(button => {

        button.classList.remove("active");

    });


    if (clickedButton) {

        clickedButton.classList.add("active");

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    /*
       Leaflet sometimes needs a resize calculation
       when its container was hidden.
    */

    setTimeout(() => {

        if (dashboardMap) {

            dashboardMap.invalidateSize();

        }


        if (reserveMap) {

            reserveMap.invalidateSize();

        }

    }, 200);

}



/* =========================================
   AI ANALYSIS DEMO
   ========================================= */

function runAI() {

    const button =
        document.querySelector(".hero .primary");


    if (!button) return;


    button.innerHTML =
        "⟳ Running AI Analysis...";


    button.disabled = true;


    showToast(
        "AI pipeline started: Data Fusion → XGBoost → Decision Layer"
    );


    setTimeout(() => {

        const reserveValue =
            document.getElementById("reserveValue");


        if (reserveValue) {

            reserveValue.innerHTML =
                "486.2 Mt";

        }


        button.innerHTML =
            "✓ Analysis Complete";


        button.disabled = false;


        showToast(
            "Analysis complete. Dashboard updated."
        );


        setTimeout(() => {

            button.innerHTML =
                "▶ Run AI Analysis";

        }, 2500);

    }, 2500);

}



/* =========================================
   TOAST
   ========================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    if (!toast) return;


    toast.innerText =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}



/* =========================================
   CREATE POPUP
   ========================================= */

function createLocationPopup(location) {

    return `

        <div class="location-popup">

            <h3>
                📍 ${location.name}
            </h3>

            <p>
                <b>State:</b>
                ${location.state}
            </p>

            <p>
                <b>Mineral:</b>
                ${location.mineral}
            </p>

            <p>
                <b>Prospectivity:</b>

                <span class="high">
                    ${location.prospectivity}
                </span>

            </p>

            <p>
                <b>Latitude:</b>
                ${location.latitude}
            </p>

            <p>
                <b>Longitude:</b>
                ${location.longitude}
            </p>

        </div>

    `;

}



/* =========================================
   MAP MARKER ICON
   ========================================= */

function createMarkerIcon(prospectivity) {

    let color =
        "#16845b";


    if (prospectivity === "Very High") {

        color =
            "#d83b20";

    }

    else if (prospectivity === "High") {

        color =
            "#df7217";

    }

    else if (prospectivity === "Medium") {

        color =
            "#e2ae19";

    }


    return L.divIcon({

        className:
            "custom-map-marker",

        html: `

            <div style="

                width:18px;

                height:18px;

                border-radius:50%;

                background:${color};

                border:3px solid white;

                box-shadow:
                    0 2px 8px rgba(0,0,0,0.4);

            "></div>

        `,

        iconSize:
            [18, 18],

        iconAnchor:
            [9, 9]

    });

}



/* =========================================
   CREATE DASHBOARD MAP
   ========================================= */

function createDashboardMap() {

    const mapElement =
        document.getElementById("dashboardMap");


    if (!mapElement) return;


    if (dashboardMap) {

        return;

    }


    /*
       Center on Balaghat / central India.
    */

    dashboardMap =
        L.map("dashboardMap");


    dashboardMap.setView(

        [
            21.8129,
            80.1838
        ],

        8

    );


    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap contributors"

        }

    ).addTo(dashboardMap);


    manganeseLocations.forEach(

        location => {

            const marker =
                L.marker(

                    [
                        location.latitude,
                        location.longitude
                    ],

                    {
                        icon:
                            createMarkerIcon(
                                location.prospectivity
                            )
                    }

                );


            marker
                .addTo(dashboardMap)
                .bindPopup(
                    createLocationPopup(location)
                );


            dashboardMarkers.push(marker);

        }

    );

}



/* =========================================
   CREATE RESERVE MAP
   ========================================= */

function createReserveMap() {

    const mapElement =
        document.getElementById("reserveMap");


    if (!mapElement) return;


    if (reserveMap) {

        return;

    }


    reserveMap =
        L.map("reserveMap");


    reserveMap.setView(

        [
            21.8129,
            80.1838
        ],

        8

    );


    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap contributors"

        }

    ).addTo(reserveMap);


    manganeseLocations.forEach(

        (location, index) => {

            const marker =
                L.marker(

                    [
                        location.latitude,
                        location.longitude
                    ],

                    {

                        icon:
                            createMarkerIcon(
                                location.prospectivity
                            )

                    }

                );


            marker
                .addTo(reserveMap)
                .bindPopup(
                    createLocationPopup(location)
                );


            marker.on(

                "click",

                () => {

                    updateLocationInfo(
                        location
                    );

                }

            );


            reserveMarkers[index] =
                marker;

        }

    );


    /*
       Show all points.
    */

    const bounds =
        L.latLngBounds(

            manganeseLocations.map(
                location => [

                    location.latitude,

                    location.longitude

                ]
            )

        );


    reserveMap.fitBounds(

        bounds,

        {
            padding: [30, 30]
        }

    );

}



/* =========================================
   UPDATE LOCATION INFORMATION
   ========================================= */

function updateLocationInfo(location) {

    const title =
        document.getElementById(
            "selectedLocation"
        );


    const info =
        document.getElementById(
            "selectedLocationInfo"
        );


    if (title) {

        title.innerText =
            `${location.name}, ${location.state}`;

    }


    if (info) {

        info.innerHTML = `

            ${location.description}

            <br><br>

            <b>
                Coordinates:
            </b>

            ${location.latitude},
            ${location.longitude}

            <br>

            <b>
                Prospectivity:
            </b>

            ${location.prospectivity}

        `;

    }

}



/* =========================================
   FOCUS LOCATION
   ========================================= */

function focusLocation(index) {

    const location =
        manganeseLocations[index];


    if (!location) return;


    /*
       Open Reserve Map.
    */

    showPage("reserve");


    /*
       Wait until map becomes visible.
    */

    setTimeout(() => {

        if (!reserveMap) {

            createReserveMap();

        }


        reserveMap.invalidateSize();


        reserveMap.setView(

            [
                location.latitude,
                location.longitude
            ],

            11

        );


        if (reserveMarkers[index]) {

            reserveMarkers[index].openPopup();

        }


        updateLocationInfo(
            location
        );

    }, 300);

}



/* =========================================
   LOCATION TABLE
   ========================================= */

function populateLocationTable() {

    const table =
        document.getElementById(
            "locationTable"
        );


    if (!table) return;


    table.innerHTML = "";


    manganeseLocations.forEach(

        (location, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td class="location-name">

                    ${location.name}

                </td>


                <td class="location-state">

                    ${location.state}

                </td>


                <td>

                    <span class="badge">

                        ${location.prospectivity}

                    </span>

                </td>


                <td>

                    ${location.latitude}

                </td>


                <td>

                    ${location.longitude}

                </td>


                <td>

                    ${location.mineral}

                </td>

            `;


            row.style.cursor =
                "pointer";


            row.addEventListener(

                "click",

                () => {

                    focusLocation(index);

                }

            );


            table.appendChild(row);

        }

    );

}



/* =========================================
   MAP FILTER
   ========================================= */

function applyMapFilters() {

    const regionFilter =
        document.getElementById(
            "regionFilter"
        );


    const prospectivityFilter =
        document.getElementById(
            "prospectivityFilter"
        );


    if (!regionFilter ||
        !prospectivityFilter) {

        return;

    }


    const region =
        regionFilter.value;


    const prospectivity =
        prospectivityFilter.value;


    manganeseLocations.forEach(

        (location, index) => {

            let visible =
                true;


            if (
                region !== "all" &&
                location.id !== region
            ) {

                visible =
                    false;

            }


            if (
                prospectivity !== "all" &&
                location.prospectivity !==
                    prospectivity
            ) {

                visible =
                    false;

            }


            const marker =
                reserveMarkers[index];


            if (!marker ||
                !reserveMap) {

                return;

            }


            if (visible) {

                if (
                    !reserveMap.hasLayer(
                        marker
                    )
                ) {

                    marker.addTo(
                        reserveMap
                    );

                }

            }

            else {

                if (
                    reserveMap.hasLayer(
                        marker
                    )
                ) {

                    reserveMap.removeLayer(
                        marker
                    );

                }

            }

        }

    );

}



/* =========================================
   FILTER EVENTS
   ========================================= */

function setupFilters() {

    const regionFilter =
        document.getElementById(
            "regionFilter"
        );


    const prospectivityFilter =
        document.getElementById(
            "prospectivityFilter"
        );


    if (regionFilter) {

        regionFilter.addEventListener(

            "change",

            applyMapFilters

        );

    }


    if (prospectivityFilter) {

        prospectivityFilter.addEventListener(

            "change",

            applyMapFilters

        );

    }

}



/* =========================================
   PRODUCTION CHART
   ========================================= */

function createChart(canvasId) {

    function createChart(canvasId) {

    const canvas =
        document.getElementById(canvasId);

    if (!canvas) {

        console.error(
            "Canvas not found:",
            canvasId
        );

        return;

    }


    const ctx =
        canvas.getContext("2d");

    if (!ctx) {

        console.error(
            "Could not get canvas context:",
            canvasId
        );

        return;

    }


    const width =
        canvas.clientWidth;

    const height =
        260;


    if (width <= 0) {

        console.error(
            "Canvas has zero width:",
            canvasId
        );

        return;

    }


    const ratio =
        window.devicePixelRatio || 1;


    canvas.width =
        width * ratio;

    canvas.height =
        height * ratio;


    ctx.scale(
        ratio,
        ratio
    );

    // KEEP THE REST OF YOUR EXISTING
    // createChart() CODE BELOW THIS


    const actual = [

        14.2,
        15.1,
        15.4,
        14.8,
        16.3,
        16.9,
        16.1,
        17.4,
        17.0,
        18.1,
        18.0,
        18.7

    ];


    const predicted = [

        14.4,
        14.8,
        15.2,
        15.3,
        16.0,
        16.5,
        16.4,
        17.0,
        17.5,
        17.7,
        18.3,
        19.1

    ];


    const left = 35;

    const right = 15;

    const top = 20;

    const bottom = 35;


    const max = 21;

    const min = 12;


    function X(index) {

        return left +

            index *

            (
                width -
                left -
                right
            ) /

            (actual.length - 1);

    }


    function Y(value) {

        return top +

            (
                max - value
            ) *

            (
                height -
                top -
                bottom
            ) /

            (max - min);

    }


    ctx.clearRect(

        0,
        0,
        width,
        height

    );


    /*
       Grid
    */

    ctx.strokeStyle =
        "#e8edf2";


    ctx.lineWidth =
        1;


    [
        12,
        15,
        18,
        21

    ].forEach(

        value => {

            ctx.beginPath();


            ctx.moveTo(

                left,
                Y(value)

            );


            ctx.lineTo(

                width - right,
                Y(value)

            );


            ctx.stroke();


            ctx.fillStyle =
                "#8b9aaa";


            ctx.font =
                "9px Arial";


            ctx.fillText(

                value,
                8,
                Y(value) + 3

            );

        }

    );


    /*
       Draw line
    */

    function drawLine(

        data,
        dashed,
        lineColor

    ) {

        ctx.beginPath();


        data.forEach(

            (value, index) => {

                if (index === 0) {

                    ctx.moveTo(

                        X(index),
                        Y(value)

                    );

                }

                else {

                    ctx.lineTo(

                        X(index),
                        Y(value)

                    );

                }

            }

        );


        if (dashed) {

            ctx.setLineDash(
                [5, 5]
            );

        }


        ctx.strokeStyle =
            lineColor;


        ctx.lineWidth =
            2;


        ctx.stroke();


        ctx.setLineDash([]);


        data.forEach(

            (value, index) => {

                ctx.beginPath();


                ctx.arc(

                    X(index),
                    Y(value),
                    3,
                    0,
                    Math.PI * 2

                );


                ctx.fillStyle =
                    lineColor;


                ctx.fill();

            }

        );

    }


    drawLine(

        actual,
        false,
        "#1677aa"

    );


    drawLine(

        predicted,
        true,
        "#8059bb"

    );


    /*
       Months
    */

    const months = [

        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug"

    ];


    ctx.fillStyle =
        "#8b9aaa";


    ctx.font =
        "8px Arial";


    months.forEach(

        (month, index) => {

            ctx.fillText(

                month,
                X(index) - 8,
                height - 10

            );

        }

    );


    /*
       Legend
    */

    ctx.fillStyle =
        "#1677aa";


    ctx.fillRect(

        width - 140,
        10,
        9,
        2

    );


    ctx.fillStyle =
        "#66798a";


    ctx.fillText(

        "Actual",
        width - 125,
        13

    );


    ctx.fillStyle =
        "#8059bb";


    ctx.fillRect(

        width - 75,
        10,
        9,
        2

    );


    ctx.fillStyle =
        "#66798a";


    ctx.fillText(

        "Predicted",
        width - 60,
        13

    );

}



/* =========================================
   EXPORT REPORT DEMO
   ========================================= */

function exportReport() {

    showToast(
        "ECHO report generation started."
    );


    setTimeout(() => {

        showToast(
            "Prototype report ready."
        );

    }, 1200);

}



/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
           CREATE CHARTS FIRST
           ------------------
           Even if the map has an issue,
           the charts will still work.
        */

        createChart("productionChart");

        createChart("productionChart2");


        /*
           LOCATION TABLE
        */

        populateLocationTable();


        /*
           FILTERS
        */

        setupFilters();


        /*
           CREATE MAPS
        */

        if (typeof L !== "undefined") {

            createDashboardMap();

            createReserveMap();

        }

        else {

            console.error(
                "Leaflet failed to load. Maps cannot be initialized."
            );

        }

    }
);


/* =========================================
   REDRAW CHARTS ON RESIZE
========================================= */

window.addEventListener(

    "resize",

    () => {

        createChart(
            "productionChart"
        );


        createChart(
            "productionChart2"
        );


        if (dashboardMap) {

            dashboardMap.invalidateSize();

        }


        if (reserveMap) {

            reserveMap.invalidateSize();

        }

    }

);



/* =========================================
   CONSOLE
========================================= */

console.log(
    "ECHO Control Tower initialized."
);


console.log(
    "Manganese locations loaded:",
    manganeseLocations
);
