let towerTypes = ["blue", "cyan", "red", "pink"];

function Dot (type) {
	this.index = dots.length;
	dots.push(this);
	this.distance = 1;
	this.firing = false;
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function runWave(map) {
	wave++;
	for (let i of waves[map][wave-1]) {
		if (Number(i)) new Dot(Number(i))
		await sleep(550)
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
	this.target;
	
	this.tick = function () {
		function inRadius(tx, ty, r, x, y) {
			if(x < tx-r || x > tx + r || y < ty-r || y > ty+r)
				return 0
			return 1
		}	
		if(t.index != ctw) {
			//tower targetting
			if(!target)
				for(let d of dots) {
					let [x, y] = mapDistToXy(d.distance)
					if(inRadius(t.x, t.y, t.radius, x, y)) {
						target = [x, y]
						break;
					}
				}
			if(target) {
				//this.angle += 			
			} else {
				t.angle += t.dir
				if (Math.random() > 0.999)
					t.dir = (Math.random() * 0.2 - 0.1) * 3
			}
		}
		if(ctw >= 0) {
			towers[ctw].x = main.mouse.x-25
			towers[ctw].y = main.mouse.y-25
			if(!main.mouseDown[0]) {
				if(towers[ctw].x < 0 || towers[ctw].x > 550 || towers[ctw].y <= 10 || towers[ctw].y > 390)
					towers[ctw].delete()
				ctw = -1
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

function Bullet (x, y, type) {
	let bulletTypes = {
		fast: {
			range: 3,
			speed: 2,
			power: 1,
		}
	}
	
	this.range = 100;
	this.speed = 3;
	this.power = 2;

	this.draw = function () {
		//
	}
	this.delete = function () {
		//
	}
	
}

//[ [amount, type], waittime, [amount, type]]
//001111110002200055300600333
const waves = {
	dotlane: [
		"1111111111",
		"1111100222",
		"1111110002222222",
		"11110000111000333002222"
	]
}