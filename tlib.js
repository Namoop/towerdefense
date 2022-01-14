//general variable setup, defaults
var __gameid__ = 0
function Game() {
	var __self__ = this;
	this.gameid = __gameid__++;
	this.clearEveryFrame = true;
	this.cnv = 0;
	this.pen = 0;
	this.stop = false;
	this.keyPressed = {};
	this.onEvent = {};
	this.mouse = {
		get x() { return __self__.windowMouseX - __self__.cnv.getBoundingClientRect().left },
		get y() { return __self__.windowMouseY - __self__.cnv.getBoundingClientRect().top  },
		get left()   { return mouseDown[0] },
		get middle() { return mouseDown[1] },
		get right()  { return mouseDown[2] }
	};
	this.windowMouseX = 0;
	this.windowMouseY = 0;
	this.logEvents = false;
	this.mouseDown = [false,false,false];
	this.run = undefined;
	this.onmousedown = undefined;
	this.mouseIn = (x1, y1, x2, y2) => __self__.mouse.x > x1 && __self__.mouse.x < x2 && __self__.mouse.y > y1 && __self__.mouse.y < y2
	this.clickIn = (x1, y1, x2, y2) => __self__.mouse.x > x1 && __self__.mouse.x < x2 && __self__.mouse.y > y1 && __self__.mouse.y < y2 && __self__.mouseDown[0]
	this.setup = function() {
		document.getElementById("body").innerHTML = `<canvas id="game${__self__.gameid}" width="800" height="400" style="border:0px solid #000000;"></canvas>` + document.getElementById("body").innerHTML
		__self__.cnv = document.getElementById(`game${__self__.gameid}`);
		__self__.pen = __self__.cnv.getContext("2d");
		onmousemove = e => [__self__.windowMouseX, __self__.windowMouseY] = [e.clientX, e.clientY]
		onkeydown = onkeyup = function (e) {
			var _kp = __self__.keyPressed
			if (e.key.length == 1) _kp[e.key.toLowerCase() == e.key ? e.key.toUpperCase() : e.key.toLowerCase()] = 0;
			_kp[e.key] = e.type == 'keydown' ? (_kp[e.key] || Date.now()) : 0
			var event = `key ${e.key} ${e.type.slice(3)}`
			try { __self__.onEvent[event](event, Date.now()-_kp[e.key]) } catch(e){}
			if (__self__.logEvents) console.log(event)
		}
		onmouseup = function (e) {
			__self__.mouseDown[e.button] = false
		}
		onmousedown = function (e) {
			__self__.mouseDown[e.button] = true
			__self__.onmousedown?.()
		}
	}
	this.loop = function () {

		if (__self__.clearEveryFrame) __self__.draw.clear();
		__self__.run?.()
		if (!__self__.stop) window.requestAnimationFrame(__self__.loop)
	}
	this.draw = {
		clear () {__self__.pen.clearRect(0, 0, __self__.cnv.width, __self__.cnv.height)},
		get color()  { return __self__.pen.strokeStyle },
		set color(i) { __self__.pen.strokeStyle = t = __self__.pen.fillStyle = String(i) },
		get size()  { return __self__.pen.lineWidth },
		set size(i) { __self__.pen.lineWidth = i},
		ellipse(x, y, radius1, radius2, fill) {
			__self__.pen.beginPath();
			__self__.pen.ellipse(x, y, radius1, radius2, 0, 0, Math.PI * 2);
			if (fill) __self__.pen.fill();
			else __self__.pen.stroke();
		},
		rect(x, y, width, height, fill) {
			__self__.pen.beginPath();
			__self__.pen.rect(x, y, width, height);
			if (fill) __self__.pen.fill();
			else __self__.pen.stroke();
		},
		text(x, y, size, text, font="Arial") {
			__self__.pen.font = size + 'px ' + font;
			__self__.pen.fillText(text, x, y);
			__self__.pen.textAlign = 'start';
		},
		line(x1, y1, x2, y2) {
			__self__.pen.beginPath();
			__self__.pen.moveTo(x1, y1);
			__self__.pen.lineTo(x2, y2);
			__self__.pen.stroke();
		},
		alpha(v) {
			__self__.pen.globalAlpha = v;
		}
	}
}