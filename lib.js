//general variable setup, defaults
var __gameid__ = 0;
function Game() {
	let me = this;
	this.gameid = __gameid__++;
	this.clearEveryFrame = true;
	this.cnv = 0;
	this.pen = 0;
	this.gamespeed = false;
	this.stop = false;
	this.keyPressed = {};
	this.onEvent = {};
	this.mouse = {
		get rat() {return window.innerHeight < window.innerWidth ? 800 : 400},
		get fs() {return this.rat-400 ? (window.innerHeight/400) : (window.innerWidth/800)},
		get x() {
			if (document.fullscreen && this.rat-400) return (main.windowMouseX-(window.innerWidth-this.fs*800)/2)/this.fs
			if (document.fullscreen) return me.windowMouseX/this.fs;
			return (me.windowMouseX - me.cnv.getBoundingClientRect().x) / me.scaleX
		},
		get y() {
			if (document.fullscreen && this.rat-800) return (main.windowMouseX-(window.innerWidth-this.fs*400)/2)/this.fs
			if (document.fullscreen) return me.windowMouseY/this.fs;
			return (me.windowMouseY - me.cnv.getBoundingClientRect().y) / me.scaleY
		},
		get left()   { return me.mouseDown[0] },
		get middle() { return me.mouseDown[1] },
		get right()  { return me.mouseDown[2] },
	};
	this.windowMouseX = 0;
	this.windowMouseY = 0;
	this.logEvents = false;
	this.mouseDown = [false,false,false];
	this.onclicks = []
	this.mouseIn = (x1, y1, x2, y2) => me.mouse.x > x1 && me.mouse.x < x2 && me.mouse.y > y1 && me.mouse.y < y2
	this.clickIn = (x1, y1, x2, y2) => me.mouse.x > x1 && me.mouse.x < x2 && me.mouse.y > y1 && me.mouse.y < y2 && (me.mouse.left || me.mouse.right)
	this.setup = function(scale, scaleTo) {
		switch (scaleTo) {
			case "width":
				this.scaleX = this.scaleY = (window.innerWidth-20) / 800 * scale/100;
				break;
			case "height":
				this.scaleX = this.scaleY = (window.innerHeight-40) / 400 * scale/100;
				break;
			case "stretch":
				this.scaleX = (window.innerWidth-20) / 800 * scale/100;
				this.scaleY = (window.innerHeight-40) / 400 * scale/100;
				break;
			case "fullscreen":
				this.scaleX = this.scaleY = window.innerWidth/400
				setTimeout(()=>me.cnv.requestFullscreen(),100)
				break;
			default:
				this.scaleX = this.scaleY = scale/100;
		}
		document.getElementById("gamespace"+me.gameid).innerHTML = `<canvas oncontextmenu="return false" id="game${me.gameid}" width="${800*me.scaleX}" height="${400*me.scaleY}" style="border:0px solid #000000;"></canvas>`
		me.cnv = document.getElementById(`game${me.gameid}`);
		me.pen = me.cnv.getContext("2d");
		Object.defineProperty(window, 'here', { get: function() { console.log("here") }, set: function(x) { console.log(x) } });
		onmousemove = e => [me.windowMouseX, me.windowMouseY] = [e.clientX, e.clientY]
		ontouchmove = e => [me.windowMouseX, me.windowMouseY] = [e.touches[0].clientX, e.touches[0].clientY] //tap and place?
		onkeydown = onkeyup = function (e) {
			var _kp = me.keyPressed
			if (e.key.length == 1) _kp[e.key.toLowerCase() == e.key ? e.key.toUpperCase() : e.key.toLowerCase()] = 0;
			_kp[e.key] = e.type == 'keydown' ? (_kp[e.key] || Date.now()) : 0
			var event = `key ${e.key} ${e.type.slice(3)}`
			me.onEvent?.[event]?.(event, Date.now()-_kp[e.key])
			if (me.logEvents) console.log(event)
		}
		onmouseup = function (e) {
			me.mouseDown[e.button] = false
		}
		ontouchend = function (e) {
			me.mouseDown[0] = false
		}
		onmousedown = function (e) {
			me.mouseDown[e.button] = true
			for (let i of me.onclicks) if (e.button == i[1]) i[0](e)
		}
		ontouchstart = function (e) {
			[me.windowMouseX, me.windowMouseY] = [e.touches[0].clientX, e.touches[0].clientY]
			me.mouseDown[0] = true
			for (let i of me.onclicks) if (e.button == i[1]) i[0](e)
		}
	}
	this.loop = function () {
		if (me.clearEveryFrame) me.draw.clear();
		me.run?.()
		if (!me.stop) {
			if (!me.gamespeed) window.requestAnimationFrame(me.loop);
			else setTimeout(window.requestAnimationFrame, me.gamespeed, me.loop)
		}
	}
	this.draw = {
		clear () {me.pen.clearRect(0, 0, me.cnv.width, me.cnv.height)},
		get color()  { return me.pen.strokeStyle },
		set color(i) { me.pen.strokeStyle = t = me.pen.fillStyle = String(i) },
		get size()  { return me.pen.lineWidth },
		set size(i) { me.pen.lineWidth = i},
		ellipse(x, y, radius1, radius2, fill) {
			me.pen.beginPath();
			me.pen.ellipse(x*me.scaleX, y*me.scaleY, radius1*me.scaleX, radius2*me.scaleY, 0, 0, 2*Math.PI);
			if (fill) me.pen.fill();
			else me.pen.stroke();
		},
		rect(x, y, width, height, fill) {
			me.pen.beginPath();
			me.pen.rect(x*me.scaleX, y*me.scaleY, width*me.scaleX, height*me.scaleY);
			if (fill) me.pen.fill();
			else me.pen.stroke();
		},
		text(x, y, size, text, font="Arial") {
			me.pen.font = (size*me.scaleX) + 'px ' + font;
			me.pen.fillText(text, x*me.scaleX, y*me.scaleY);
			me.pen.textAlign = 'start';
		},
		line(x1, y1, x2, y2) {
			me.pen.beginPath();
			me.pen.moveTo(x1*me.scaleX, y1*me.scaleY);
			me.pen.lineTo(x2*me.scaleX, y2*me.scaleY);
			me.pen.stroke();
		},
		alpha(v) {
			me.pen.globalAlpha = v;
		},
		arc(x, y, r, sa, ea, fill) {
			me.pen.beginPath();
			me.pen.arc(x,y,r,sa,ea,false);
			if (fill) me.pen.fill();
			else me.pen.stroke();
		},
		circle(x, y, r, fill, stroke, strokeWidth) {
			me.draw.size = strokeWidth
			if (fill) me.draw.ellipse(x,y,r,r,true)
			if (stroke ) me.draw.ellipse(x,y,r,r,false)
			/*
  			me.pen.beginPath()
  			me.pen.arc(x, y, r, 0, 2*Math.PI, false)
  			if(fill) {
    				me.pen.fillStyle = fill
    				me.pen.fill()
  			}
  			if (stroke) {
    				me.pen.lineWidth = strokeWidth
   	 			me.pen.strokeStyle = stroke
   		 		me.pen.stroke()
  			}*/
		},
	}
}