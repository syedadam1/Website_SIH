/* =========================================================
   ECHO CONTROL TOWER - CORRECTED FRONTEND SCRIPT
   Maps + Production Prediction + Forecast + Filters + AI Demo
   ========================================================= */

"use strict";

/* =========================================================
   REAL-WORLD MANGANESE LOCATIONS
   Prototype visualization points - NOT mine-boundary surveys.
   ========================================================= */

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


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let dashboardMap = null;
let reserveMap = null;

let dashboardMarkers = [];
let reserveMarkers = [];

let resizeTimer = null;


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(pageId, clickedButton) {

    const pages = document.querySelectorAll(".page");

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

    } else {

        const matchingButton =
            [...buttons].find(button =>
                button.getAttribute("onclick") &&
                button.getAttribute("onclick").includes(
                    `'${pageId}'`
                )
            );

        if (matchingButton) {
            matchingButton.classList.add("active");
        }
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /*
       Leaflet needs invalidateSize()
       when its container becomes visible.
    */

    setTimeout(() => {

        if (dashboardMap) {
            dashboardMap.invalidateSize();
        }

        if (reserveMap) {
            reserveMap.invalidateSize();
        }


        /*
           Redraw charts when Production page
           becomes visible.
        */

        if (
            pageId === "dashboard" ||
            pageId === "production"
        ) {

            createChart("productionChart");

            createForecastChart(
                "productionChart2"
            );

            createForecastChart(
                "productionForecastChart"
            );
        }


        /*
           Create reserve map only when required.
        */

        if (
            pageId === "reserve" &&
            !reserveMap &&
            typeof L !== "undefined"
        ) {

            createReserveMap();

        }

    }, 300);
}


/* =========================================================
   AI ANALYSIS DEMO
   ========================================================= */

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


/* =========================================================
   TOAST
   ========================================================= */

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


/* =========================================================
   LOAD LEAFLET
   ========================================================= */

function loadLeaflet() {

    return new Promise((resolve, reject) => {

        /*
           Already loaded.
        */

        if (typeof L !== "undefined") {

            resolve();

            return;
        }


        /*
           Add Leaflet CSS.
        */

        if (
            !document.querySelector(
                'link[data-echo-leaflet="true"]'
            )
        ) {

            const css =
                document.createElement("link");


            css.rel =
                "stylesheet";


            css.href =
                "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";


            css.dataset.echoLeaflet =
                "true";


            document.head.appendChild(css);
        }


        /*
           Add Leaflet JavaScript.
        */

        const existing =
            document.querySelector(
                'script[data-echo-leaflet="true"]'
            );


        if (existing) {

            existing.addEventListener(
                "load",
                () => resolve()
            );


            existing.addEventListener(
                "error",
                () =>
                    reject(
                        new Error(
                            "Leaflet failed to load"
                        )
                    )
            );


            return;
        }


        const script =
            document.createElement("script");


        script.src =
            "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";


        script.dataset.echoLeaflet =
            "true";


        script.onload =
            () => resolve();


        script.onerror =
            () =>
                reject(
                    new Error(
                        "Leaflet failed to load"
                    )
                );


        document.head.appendChild(script);

    });
}


/* =========================================================
   LOCATION POPUP
   ========================================================= */

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
                <strong>
                    ${location.prospectivity}
                </strong>
            </p>

            <p>
                ${location.description}
            </p>

            <p>
                <b>Latitude:</b>
                ${location.latitude}
            </p>

            <p>
                <b>Longitude:</b>
                ${location.longitude}
            </p>

            <small>
                Prototype visualization point —
                not a surveyed mine boundary.
            </small>

        </div>

    `;
}


/* =========================================================
   MAP MARKER ICON
   ========================================================= */

function createMarkerIcon(prospectivity) {

    let color =
        "#16845b";


    if (
        prospectivity === "Very High"
    ) {

        color =
            "#ff3b30";

    }

    else if (
        prospectivity === "High"
    ) {

        color =
            "#ff8a00";

    }

    else if (
        prospectivity === "Medium"
    ) {

        color =
            "#ffd60a";

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
                    0 2px 10px
                    rgba(0,0,0,.55);
            "></div>

        `,

        iconSize:
            [18, 18],

        iconAnchor:
            [9, 9]

    });
}


/* =========================================================
   DASHBOARD MAP
   ========================================================= */

function createDashboardMap() {

    let mapElement =
        document.getElementById(
            "dashboardMap"
        );


    /*
       Compatibility with older HTML.
    */

    if (!mapElement) {

        mapElement =
            document.querySelector(
                ".map-panel .map"
            );


        if (mapElement) {

            mapElement.id =
                "dashboardMap";


            mapElement.innerHTML =
                "";

        }
    }


    if (
        !mapElement ||
        typeof L === "undefined"
    ) {

        return;
    }


    if (dashboardMap) {

        dashboardMap.invalidateSize();

        return;
    }


    dashboardMap =
        L.map(
            mapElement,
            {
                zoomControl: true,
                scrollWheelZoom: true
            }
        );


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
    ).addTo(
        dashboardMap
    );


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
                    createLocationPopup(
                        location
                    )
                );


            dashboardMarkers.push(
                marker
            );

        }
    );


    setTimeout(() => {

        dashboardMap.invalidateSize();

    }, 200);
}


/* =========================================================
   RESERVE MAP
   ========================================================= */

function createReserveMap() {

    let mapElement =
        document.getElementById(
            "reserveMap"
        );


    /*
       Compatibility with older HTML.
    */

    if (!mapElement) {

        mapElement =
            document.querySelector(
                "#reserve .large-map"
            );


        if (mapElement) {

            mapElement.id =
                "reserveMap";


            mapElement.innerHTML =
                "";

        }
    }


    if (
        !mapElement ||
        typeof L === "undefined"
    ) {

        return;
    }


    if (reserveMap) {

        reserveMap.invalidateSize();

        return;
    }


    reserveMap =
        L.map(
            mapElement,
            {
                zoomControl: true,
                scrollWheelZoom: true
            }
        );


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
    ).addTo(
        reserveMap
    );


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
                    createLocationPopup(
                        location
                    )
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


    const bounds =
        L.latLngBounds(

            manganeseLocations.map(
                location => [
                    location.latitude,
                    location.longitude
                ]
            )

        );


    if (bounds.isValid()) {

        reserveMap.fitBounds(
            bounds,
            {
                padding:
                    [30, 30]
            }
        );

    }


    setTimeout(() => {

        reserveMap.invalidateSize();

    }, 200);
}


/* =========================================================
   UPDATE LOCATION INFORMATION
   ========================================================= */

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


/* =========================================================
   FOCUS LOCATION
   ========================================================= */

function focusLocation(index) {

    const location =
        manganeseLocations[index];


    if (!location) return;


    showPage("reserve");


    setTimeout(() => {

        if (!reserveMap) {

            createReserveMap();

        }


        if (!reserveMap) return;


        reserveMap.invalidateSize();


        reserveMap.setView(
            [
                location.latitude,
                location.longitude
            ],
            11
        );


        if (
            reserveMarkers[index]
        ) {

            reserveMarkers[index]
                .openPopup();

        }


        updateLocationInfo(
            location
        );

    }, 400);
}


/* =========================================================
   LOCATION TABLE
   ========================================================= */

function populateLocationTable() {

    const table =
        document.getElementById(
            "locationTable"
        );


    if (!table) return;


    table.innerHTML =
        "";


    manganeseLocations.forEach(
        (location, index) => {

            const row =
                document.createElement(
                    "tr"
                );


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
                () =>
                    focusLocation(index)
            );


            table.appendChild(row);

        }
    );
}


/* =========================================================
   MAP FILTER
   ========================================================= */

function applyMapFilters() {

    const regionFilter =
        document.getElementById(
            "regionFilter"
        );


    const prospectivityFilter =
        document.getElementById(
            "prospectivityFilter"
        );


    if (
        !regionFilter ||
        !prospectivityFilter ||
        !reserveMap
    ) {

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


            if (!marker) return;


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


/* =========================================================
   FILTER EVENTS
   ========================================================= */

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


/* =========================================================
   PRODUCTION DATA
   ========================================================= */

const productionData = {

    months: [
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
    ],


    actual: [
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
    ],


    predicted: [
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
    ],


    forecastMonths: [
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb"
    ],


    forecast: [
        19.1,
        19.4,
        19.8,
        20.1,
        20.5,
        20.9
    ]

};


/* =========================================================
   CANVAS SIZE
   ========================================================= */

function getCanvasSize(canvas) {

    let width =
        canvas.clientWidth;


    /*
       Hidden page fallback.
    */

    if (
        width <= 0 &&
        canvas.parentElement
    ) {

        width =
            canvas.parentElement
                .clientWidth;

    }


    if (width <= 0) {

        width =
            650;

    }


    return {

        width:
            Math.max(
                320,
                width
            ),

        height:
            280

    };
}


/* =========================================================
   CHART GRID
   ========================================================= */

function drawChartGrid(
    ctx,
    width,
    height,
    left,
    right,
    top,
    bottom,
    min,
    max
) {

    ctx.strokeStyle =
        "rgba(160,180,200,.18)";


    ctx.fillStyle =
        "#8fa1b3";


    ctx.lineWidth =
        1;


    ctx.font =
        "11px Arial";


    const steps =
        4;


    for (
        let i = 0;
        i <= steps;
        i++
    ) {

        const value =
            min +
            ((max - min) / steps) *
            i;


        const y =
            top +
            (max - value) *
            (height - top - bottom) /
            (max - min);


        ctx.beginPath();


        ctx.moveTo(
            left,
            y
        );


        ctx.lineTo(
            width - right,
            y
        );


        ctx.stroke();


        ctx.fillText(
            value.toFixed(0),
            7,
            y + 4
        );

    }
}


/* =========================================================
   DRAW LINE
   ========================================================= */

function drawLineChart(
    ctx,
    data,
    xFn,
    yFn,
    color,
    dashed = false
) {

    if (!data.length) return;


    ctx.save();


    ctx.beginPath();


    data.forEach(
        (value, index) => {

            const x =
                xFn(index);


            const y =
                yFn(value);


            if (index === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            }

            else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    ctx.strokeStyle =
        color;


    ctx.lineWidth =
        3;


    ctx.lineJoin =
        "round";


    ctx.lineCap =
        "round";


    if (dashed) {

        ctx.setLineDash(
            [7, 6]
        );

    }


    ctx.stroke();


    ctx.setLineDash([]);


    /*
       Points.
    */

    data.forEach(
        (value, index) => {

            ctx.beginPath();


            ctx.arc(
                xFn(index),
                yFn(value),
                4,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                color;


            ctx.fill();

        }
    );


    ctx.restore();
}


/* =========================================================
   PRODUCTION TREND
   ACTUAL VS PREDICTED
   ========================================================= */

function createChart(canvasId) {

    const canvas =
        document.getElementById(
            canvasId
        );


    if (!canvas) {

        console.warn(
            "Canvas not found:",
            canvasId
        );

        return;

    }


    const ctx =
        canvas.getContext(
            "2d"
        );


    if (!ctx) {

        console.error(
            "Canvas context unavailable:",
            canvasId
        );

        return;

    }


    const {
        width,
        height
    } =
        getCanvasSize(
            canvas
        );


    const ratio =
        window.devicePixelRatio ||
        1;


    canvas.width =
        Math.floor(
            width * ratio
        );


    canvas.height =
        Math.floor(
            height * ratio
        );


    canvas.style.height =
        `${height}px`;


    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const actual =
        productionData.actual;


    const predicted =
        productionData.predicted;


    const allValues =
        [
            ...actual,
            ...predicted
        ];


    const min =
        Math.floor(
            Math.min(
                ...allValues
            ) - 1
        );


    const max =
        Math.ceil(
            Math.max(
                ...allValues
            ) + 1
        );


    const left =
        40;


    const right =
        25;


    const top =
        30;


    const bottom =
        45;


    function X(index) {

        return (
            left +
            index *
            (
                width -
                left -
                right
            ) /
            (
                actual.length -
                1
            )
        );

    }


    function Y(value) {

        return (
            top +
            (
                max -
                value
            ) *
            (
                height -
                top -
                bottom
            ) /
            (
                max -
                min
            )
        );

    }


    drawChartGrid(
        ctx,
        width,
        height,
        left,
        right,
        top,
        bottom,
        min,
        max
    );


    /*
       Actual line.
    */

    drawLineChart(
        ctx,
        actual,
        X,
        Y,
        "#20a7ff",
        false
    );


    /*
       Predicted line.
    */

    drawLineChart(
        ctx,
        predicted,
        X,
        Y,
        "#b47cff",
        true
    );


    /*
       Months.
    */

    ctx.fillStyle =
        "#91a3b5";


    ctx.font =
        "10px Arial";


    productionData.months.forEach(
        (month, index) => {

            ctx.fillText(
                month,
                X(index) - 9,
                height - 12
            );

        }
    );


    /*
       Legend.
    */

    ctx.fillStyle =
        "#20a7ff";


    ctx.fillRect(
        width - 175,
        12,
        20,
        3
    );


    ctx.fillStyle =
        "#d4dce5";


    ctx.font =
        "11px Arial";


    ctx.fillText(
        "Actual",
        width - 150,
        16
    );


    ctx.fillStyle =
        "#b47cff";


    ctx.fillRect(
        width - 85,
        12,
        20,
        3
    );


    ctx.fillStyle =
        "#d4dce5";


    ctx.fillText(
        "Predicted",
        width - 60,
        16
    );


    /*
       Latest value.
    */

    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 12px Arial";


    ctx.fillText(
        `Latest: ${
            actual[
                actual.length - 1
            ]
        } Mt`,
        left,
        17
    );
}


/* =========================================================
   PRODUCTION FORECAST
   ========================================================= */

function createForecastChart(
    canvasId
) {

    const canvas =
        document.getElementById(
            canvasId
        );


    if (!canvas) {

        return;

    }


    const ctx =
        canvas.getContext(
            "2d"
        );


    if (!ctx) return;


    const {
        width,
        height
    } =
        getCanvasSize(
            canvas
        );


    const ratio =
        window.devicePixelRatio ||
        1;


    canvas.width =
        Math.floor(
            width * ratio
        );


    canvas.height =
        Math.floor(
            height * ratio
        );


    canvas.style.height =
        `${height}px`;


    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const historical =
        productionData.actual;


    const forecast =
        productionData.forecast;


    const values =
        [
            ...historical,
            ...forecast
        ];


    const min =
        Math.floor(
            Math.min(
                ...values
            ) - 1
        );


    const max =
        Math.ceil(
            Math.max(
                ...values
            ) + 1
        );


    const left =
        40;


    const right =
        25;


    const top =
        35;


    const bottom =
        45;


    const totalPoints =
        historical.length +
        forecast.length;


    function X(index) {

        return (
            left +
            index *
            (
                width -
                left -
                right
            ) /
            (
                totalPoints -
                1
            )
        );

    }


    function Y(value) {

        return (
            top +
            (
                max -
                value
            ) *
            (
                height -
                top -
                bottom
            ) /
            (
                max -
                min
            )
        );

    }


    drawChartGrid(
        ctx,
        width,
        height,
        left,
        right,
        top,
        bottom,
        min,
        max
    );


    /*
       Historical actual.
    */

    const historicalX =
        index =>
            X(index);


    drawLineChart(
        ctx,
        historical,
        historicalX,
        Y,
        "#20a7ff",
        false
    );


    /*
       Forecast starts from last actual.
    */

    const forecastLine = [
        historical[
            historical.length - 1
        ],
        ...forecast
    ];


    ctx.save();


    ctx.beginPath();


    forecastLine.forEach(
        (value, index) => {

            const globalIndex =
                historical.length -
                1 +
                index;


            const px =
                X(globalIndex);


            const py =
                Y(value);


            if (index === 0) {

                ctx.moveTo(
                    px,
                    py
                );

            }

            else {

                ctx.lineTo(
                    px,
                    py
                );

            }

        }
    );


    ctx.strokeStyle =
        "#ff9f43";


    ctx.lineWidth =
        3;


    ctx.lineJoin =
        "round";


    ctx.setLineDash(
        [8, 6]
    );


    ctx.stroke();


    ctx.restore();


    /*
       Forecast points.
    */

    forecast.forEach(
        (value, index) => {

            const globalIndex =
                historical.length +
                index;


            ctx.beginPath();


            ctx.arc(
                X(globalIndex),
                Y(value),
                4,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#ff9f43";


            ctx.fill();

        }
    );


    /*
       Labels.
    */

    const labels = [
        ...productionData.months,
        ...productionData.forecastMonths
    ];


    labels.forEach(
        (label, index) => {

            if (
                index % 2 === 0 ||
                index >= historical.length
            ) {

                ctx.fillStyle =
                    "#91a3b5";


                ctx.font =
                    "10px Arial";


                ctx.fillText(
                    label,
                    X(index) - 9,
                    height - 12
                );

            }

        }
    );


    /*
       Forecast divider.
    */

    const dividerX =
        X(
            historical.length - 1
        );


    ctx.save();


    ctx.strokeStyle =
        "rgba(255,159,67,.5)";


    ctx.setLineDash(
        [4, 5]
    );


    ctx.beginPath();


    ctx.moveTo(
        dividerX,
        top
    );


    ctx.lineTo(
        dividerX,
        height - bottom
    );


    ctx.stroke();


    ctx.restore();


    ctx.fillStyle =
        "#ff9f43";


    ctx.font =
        "bold 11px Arial";


    ctx.fillText(
        "FORECAST",
        Math.min(
            dividerX + 8,
            width - 85
        ),
        top + 15
    );


    /*
       Legend.
    */

    ctx.fillStyle =
        "#20a7ff";


    ctx.fillRect(
        width - 180,
        12,
        20,
        3
    );


    ctx.fillStyle =
        "#d4dce5";


    ctx.font =
        "11px Arial";


    ctx.fillText(
        "Actual",
        width - 155,
        16
    );


    ctx.fillStyle =
        "#ff9f43";


    ctx.fillRect(
        width - 90,
        12,
        20,
        3
    );


    ctx.fillStyle =
        "#d4dce5";


    ctx.fillText(
        "Forecast",
        width - 65,
        16
    );
}


/* =========================================================
   FORECAST KPI UPDATE
   ========================================================= */

function updateForecastCards() {

    const latestForecast =
        productionData.forecast[
            productionData.forecast.length - 1
        ];


    const forecastElements =
        document.querySelectorAll(
            "[data-forecast-value]"
        );


    forecastElements.forEach(
        element => {

            element.textContent =
                `${latestForecast.toFixed(1)} Mt`;

        }
    );
}


/* =========================================================
   EXPORT REPORT
   ========================================================= */

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


/* =========================================================
   INITIALIZATION
   ========================================================= */

async function initializeEcho() {

    console.log(
        "ECHO: JavaScript loaded."
    );


    /*
       CHARTS FIRST

       Maps cannot stop the charts from working.
    */

    try {

        createChart(
            "productionChart"
        );


        createForecastChart(
            "productionChart2"
        );


        createForecastChart(
            "productionForecastChart"
        );


        updateForecastCards();


        console.log(
            "ECHO: charts initialized."
        );

    }

    catch (error) {

        console.error(
            "ECHO CHART ERROR:",
            error
        );

    }


    /*
       TABLE + FILTERS
    */

    try {

        populateLocationTable();

        setupFilters();

    }

    catch (error) {

        console.error(
            "ECHO TABLE/FILTER ERROR:",
            error
        );

    }


    /*
       MAPS

       Loaded separately so map failure
       cannot break the rest of the website.
    */

    try {

        await loadLeaflet();


        createDashboardMap();


        createReserveMap();


        console.log(
            "ECHO: maps initialized."
        );

    }

    catch (error) {

        console.error(
            "ECHO MAP ERROR:",
            error
        );


        showToast(
            "Map service could not be loaded. Charts are still available."
        );

    }


    console.log(
        "ECHO Control Tower initialized."
    );
}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeEcho
);


/* =========================================================
   RESPONSIVE REDRAW
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(() => {

                createChart(
                    "productionChart"
                );


                createForecastChart(
                    "productionChart2"
                );


                createForecastChart(
                    "productionForecastChart"
                );


                if (dashboardMap) {

                    dashboardMap.invalidateSize();

                }


                if (reserveMap) {

                    reserveMap.invalidateSize();

                }

            }, 150);

    }
);


/* =========================================================
   FINAL CONSOLE MESSAGE
   ========================================================= */

console.log(
    "ECHO Control Tower script loaded successfully."
);

console.log(
    "Manganese locations loaded:",
    manganeseLocations
);
