var injectSVG = function injectSVG() {
    document.body.insertAdjacentHTML(
        "beforeend", "\n    <svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" style=\"display:none\">\n      <defs>\n        <filter id=\"goo\">\n          <fegaussianblur\n            in=\"SourceGraphic\"\n            stddeviation=\"10\"\n            result=\"blur\"\n          ></fegaussianblur>\n          <fecolormatrix\n            in=\"blur\"\n            mode=\"matrix\"\n            values=\"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8\"\n            result=\"goo\"\n          ></fecolormatrix>\n          <fecomposite in=\"SourceGraphic\" in2=\"goo\" operator=\"atop\"></fecomposite>\n        </filter>\n      </defs>\n    </svg>");


};

var gooeyButtons = function gooeyButtons() {
    var buttons = document.querySelectorAll("button[data-gooey]");
    var mouseDot = document.createElement("SPAN");
    var margin = 50;
    var size = 100;

    mouseDot.style.display = "block";
    mouseDot.style.position = "absolute";
    mouseDot.style.zIndex = -1;
    mouseDot.style.width = "30px";
    mouseDot.style.height = "30px";
    mouseDot.style.borderRadius = "50%";
    mouseDot.style.background = "palevioletred";
    mouseDot.style.visibility = "hidden";
    mouseDot.style.opacity = 0.5;

    injectSVG();

    document.body.style.filter = "url('#goo')";

    document.body.appendChild(mouseDot);

    var calcDistance = function calcDistance(mouse, bounds) {
        var
            mX = mouse.clientX,
            mY = mouse.clientY;
        var distanceXLeft = Math.min(
            1,
            (mX - (bounds.x - margin)) / (margin + bounds.width / 2));

        var distanceXRight = Math.min(
            1,
            -(mX - (bounds.x + bounds.width + margin)) / (margin + bounds.width / 2));

        var distanceYTop = Math.min(
            1,
            (mY - (bounds.y - margin)) / (margin + bounds.height / 2));

        var distanceYBottom = Math.min(
            1,
            -(mY - (bounds.y + bounds.height + margin)) / (margin + bounds.height / 2));

        return Math.min(
            distanceXLeft,
            distanceXRight,
            distanceYTop,
            distanceYBottom);

    };

    window.addEventListener("mousemove", function (e) {
        var x = e.clientX;
        var y = e.clientY;
        var inside = buttons.length;

        buttons.forEach(function (button) {
            var bounds = button.getBoundingClientRect();

            if (
                x > bounds.x - margin &&
                x < bounds.x + bounds.width + margin &&
                y > bounds.y - margin &&
                y < bounds.y + bounds.height + margin) {
                inside++;
                var distance = calcDistance(e, bounds);
                mouseDot.size = size * distance;
                mouseDot.style.width = size * distance + "px";
                mouseDot.style.height = size * distance + "px";
                mouseDot.style.background = window.getComputedStyle(
                    button).
                backgroundColor;
            } else {
                inside--;
            }
        });

        if (inside !== 0) {
            mouseDot.style.visibility = "visible";
            mouseDot.style.left = x - mouseDot.size / 2 + "px";
            mouseDot.style.top = y - mouseDot.size / 2 + "px";
        } else {
            mouseDot.style.visibility = "hidden";
        }
    });
};