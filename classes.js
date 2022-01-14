function Dot (type) {
	this.index = dots.length;
	dots.push(this);
	this.distance = 1;
	this.health;
	this.type = type;
	this.speed = type;
	this.color = ["#ff0000", "#0000ff", "#00ff00"][type-1]
	this.pop = function () {
		this.health--
		if (!this.health) {this.type--; this.health=this.type}
		if (!this.type) {} //delete
		this.speed = this.type;
		this.color = ["red", "blue", "green", "yellow"][type-1]
	}
	this.draw = function () {
		main.draw.color = this.color
		main.draw.ellipse(...mapDistToXy(this.distance), 10, 10, true)
	}
	this.delete = function () {
		dots.splice(this.index, 1)
		for (var k of dots) if (k.index > this.index) k.index--
		if (!dots.length) runWave("dotlane")
	}
}

async function runWave(map) {
	wave++;
	for (let i of waves[map][wave-1]) {
		if (Number(i)) new Dot(Number(i))
		await new Promise(resolve => setTimeout(resolve, 550)) //wait (sleep) roughly half a second
	}
	
}

function Tower (type, x, y) {
	this.index = towers.length;
	towers.push(this);
	this.type = type;
	this.x = x;
	this.y = y;
	this.color = towerTypes[type];
	this.radius = 100;
	this.dir = 0.2;
	this.angle = 0;
	this.delay = 300 //change according to type
	this.target;
	this.shooter = setInterval(()=>this.targeting, this.delay)
	this.idle = false;
	
	this.targeting = function () {
		function inRadius(tx, ty, r, x, y) {
			if(x < tx-r || x > tx+r || y < ty-r || y > ty+r)
				return 0
			return 1
		}	
		if(this.index != ctw) {
			//tower targetting
			if(!this.target)
				for(let d of dots) {
					let [x, y] = mapDistToXy(d.distance)
					if(inRadius(this.x, this.y, this.radius, x, y)) {
						this.target = d
						break;
					}
				}
			else {
				let [x, y] = mapDistToXy(this.target.distance)
				if(!inRadius(this.x, this.y, this.radius, x, y))
					this.target = undefined
				else {
					this.idle = false;
					new Bullet (this.x+25, this.y+25, this.angle, "normal")
				}
			}
			if (!this.target) {
				setTimeout(()=>this.idle = true,1000)
			}
		}
	}

	this.draw = function () {
		main.pen.save()
		main.pen.translate(this.x+25, this.y+25)
		main.pen.rotate(this.angle*(Math.PI/180))
		main.pen.translate(0-this.x-25, 0-this.y-25)
		main.draw.color = this.color
		main.draw.rect(this.x, this.y, 50, 50, true)
		main.draw.color = "black"
		main.draw.rect(this.x+20, this.y+20, 40, 10, true)
		main.pen.restore()
	}
	
	this.delete = function () {
		towers.splice(this.index, 1)
		for (var k of towers) if (k.index > this.index) k.index--
	}
}

function Bullet (x, y, angle, type="normal") {
	this.index = bullets.length
	bullets.push(this)
	this.range = 200;
	this.speed = 8;
	this.power = 2;
	this.distance = 25;
	this.angle = angle;

	this.draw = function () {
		main.draw.color = "#fff"
		main.draw.ellipse(x+this.distance*Math.cos(angle * (Math.PI / 180)), y+this.distance*Math.sin(angle * (Math.PI / 180)), 2, 2, true)
	}
	this.checkCollision = function () {
		//
	}
	this.delete = function () {
		bullets.splice(this.index, 1)
		for (var k of bullets) if (k.index > this.index) k.index--
	}
	
}