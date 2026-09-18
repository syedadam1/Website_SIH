/* =========================================
   ECHO FRONTEND
   ========================================= */


/* PAGE NAVIGATION */

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


    /* Update sidebar */

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

}


/* =========================================
   AI ANALYSIS DEMO
   ========================================= */

function runAI() {

    const button =
        document.querySelector(".hero .primary");

    button.innerHTML =
        "⟳ Running AI Analysis...";

    button.disabled = true;


    showToast(
        "AI pipeline started: Data Fusion → XGBoost → Decision Layer"
    );


    setTimeout(() => {

        document.getElementById(
            "reserveValue"
        ).innerHTML = "486.2 Mt";


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
   TOAST MESSAGE
   ========================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.innerText = message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================================
   PRODUCTION CHART
   ========================================= */

function createChart(canvasId) {

    const canvas =
        document.getElementById(canvasId);

    if (!canvas) return;


    const ctx =
        canvas.getContext("2d");


    const width =
        canvas.clientWidth;

    const height = 260;


    const ratio =
        window.devicePixelRatio || 1;


    canvas.width =
        width * ratio;

    canvas.height =
        height * ratio;


    ctx.scale(ratio, ratio);


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


    /* Clear */

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* Grid */

    ctx.strokeStyle =
        "#e8edf2";

    ctx.lineWidth = 1;


    [12, 15, 18, 21].forEach(
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


    /* Draw function */

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

                } else {

                    ctx.lineTo(
                        X(index),
                        Y(value)
                    );

                }

            }
        );


        if (dashed) {

            ctx.setLineDash([
                5,
                5
            ]);

        }


        ctx.strokeStyle =
            lineColor;

        ctx.lineWidth = 2;


        ctx.stroke();


        ctx.setLineDash([]);


        /* Points */

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


    /* Months */

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


    /* Legend */

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


/* Create charts */

createChart("productionChart");

createChart("productionChart2");


/* Redraw on resize */

window.addEventListener(
    "resize",
    () => {

        createChart("productionChart");

        createChart("productionChart2");

    }
);
