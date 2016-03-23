(function ($) {
    function Robot(options) {
        var opt = options || {};
        var $canvas = opt.canvas || $("canvas");
        var wRatio = opt.widthRatio || 0.6;
        var hRatio = opt.heightRatio || 0.5;
        var frequency = opt.frequency || 50;
        var debug = opt.debug || true;
        var stop;
        var algorithms = {
            "point": simulateRandomPoint,
            "line": simulateRandomLine
        };

        /*
         * Simulate user click on the point of target rectangle
         */
        function simulateClick(x, y) {
            var downMouse = new $.Event("mousedown");
            var upMouse = new $.Event("mouseup");
            var absCoord = getAbsoluteRectPosition();
            if(debug) {
                console.log("coords: (" + x + ", " + y + ")");
            }
            downMouse.clientX = x + absCoord.x;
            downMouse.clientY = y + absCoord.y;
            $canvas.trigger(downMouse);
            // user up mouse button
            $canvas.trigger(upMouse)
        }

        /*
         * Simulate human behavior of clicking based on random point picking
         * */
        function simulateRandomLine() {
            var start = getRandomCoords();
            var end = getRandomCoords();
            if(debug) {
                console.log("start coords: (" + start.x + ", " + start.y + ")");
                console.log("end coords: (" + end.x + ", " + end.y + ")");
            }
            //TODO refactor logic
            var stepX = start.x, stepY = start.y;
            if(start.x <= end.x && start.y <= end.y) {
                for (; stepX < end.x || stepY < end.y; stepX++, stepY++) {
                    simulateClick(stepX, stepY);
                }
            } else if(start.x >= end.x && start.y <= end.y) {
                for (; stepX > end.x || stepY < end.y; stepX--, stepY++) {
                    simulateClick(stepX, stepY);
                }
            } else if(start.x <= end.x && start.y >= end.y) {
                for (; stepX < end.x || stepY > end.y; stepX++, stepY--) {
                    simulateClick(stepX, stepY);
                }
            } else {
                for (; stepX >= end.x || stepY >= end.y; stepX--, stepY--) {
                    simulateClick(stepX, stepY);
                }
            }
        }

        /*
         * Simulate human behavior of clicking based on random continuous line
         * */
        function simulateRandomPoint() {
            var coords = getRandomCoords();
            simulateClick(coords.x, coords.y);
        }


        function startSimulation(algorithmName) {
            var algorithm =  algorithmName ? algorithms[algorithmName] : simulateRandomPoint;
            stop = setInterval(algorithm, frequency);
        }

        function stopSimulation() {
            clearInterval(stop);
        }

        function getRectParams() {
            var width = $canvas.width() * wRatio;
            var height = $canvas.height() * hRatio;

            return {
                x: ($canvas.width() - width) / 2,
                y: ($canvas.height() - height) / 2,
                w: width,
                h: height
            };
        }

        function getAbsoluteRectPosition() {
            var canvasCoord = $canvas.offset();
            var rect = getRectParams();
            return {
                x: canvasCoord.left + rect.x,
                y: canvasCoord.top + rect.y
            }
        }

        function getRandomCoords() {
            var rect = getRectParams();
            return {
                x: getRandomIntInclusive(0, rect.w),
                y: getRandomIntInclusive(0, rect.h)
            }
        }

        function getRandomIntInclusive(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }


        this.simulateClick = simulateClick;
        this.simulateRandomPoint = simulateRandomPoint;
        this.simulateRandomLine = simulateRandomLine;
        this.startSimulation = startSimulation;
        this.stopSimulation = stopSimulation;
    }

    window.Robot = Robot;
})(jQuery);

