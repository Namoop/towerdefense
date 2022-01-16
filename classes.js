function Dot (type) {
	this.index = dots.length;
	dots.push(this);
	this.type = type;
	this.distance = 1;
	
	this.update = function() {
		this.health = dotTypes[this.type].health;
		this.speed = dotTypes[this.type].speed;
		this.color = dotTypes[this.type].color;
	}
	this.update();
	
	this.pop = function () {
		gold += 5;
		this.health--;
		if(!this.health) {
			this.type = dotTypes[this.type].link;
			if(!this.type)
				this.delete();
			else
				this.update();
		}
	}
	this.draw = function () {
		main.draw.color = this.color;
		main.draw.ellipse(...mapDistToXy(this.distance), 10, 10, true);
	}
	this.delete = function () {
		dots.splice(this.index, 1);
		for(var k of dots)
			if(k.index > this.index)
				k.index--;
		if(wavecurr > waves[map].length)
			nextWave();
		this.index = -1;
	}
}

let nextWave = () => {wave++; wavecurr = 0;}

function spawnDot() {
	let i;

	if (wave < 1) return;
	if(wave > waves[map].length)
		i = waves[map][waves[map].length-1][wavecurr++];
	else
		i = waves[map][wave-1][wavecurr++];
	if(Number(i))
		new Dot(Number(i));
}

function Tower (type, x, y) {
	this.index = towers.length;
	towers.push(this);
	this.type = type;

	this.x = x;
	this.y = y;
	this.color = towerTypes[type].color;
	this.radius = towerTypes[type].radius;
	this.currdelay = towerTypes[type].delay;
	this.bullet = towerTypes[type].bullet;
	this.burst = towerTypes[type].burst;
	this.burstd = towerTypes[type].burstd;
	this.nshot = towerTypes[type].nshot;
	this.constant = towerTypes[type].constant;
	this.dir = 0.2;
	this.angle = 0;
	this.idle = false;

	this.shoot = function (d, dotx, doty, target) {
		if(target)
			this.angle = Math.atan2(this.y+THALF-doty, this.x+THALF-dotx) + Math.PI;

		switch(this.type) {
		case "drones":
			for(let i = 0; i < this.nshot; i++)
				new Bullet(this.x+THALF, this.y+THALF, Math.PI*2 * (i/this.nshot), this.bullet);
			break;
		case "wizard":
			for(let i = 0; i < this.nshot; i++)
				new Bullet(this.x+THALF, this.y+THALF, this.angle, this.bullet);
			bullets[bullets.length-1].target = d;
			break;
		default:
			for(let i = 0; i < this.nshot; i++)
				new Bullet(this.x+THALF, this.y+THALF, this.angle, this.bullet);
		}
		this.burst--;
		if(this.burst > 0)
			this.currdelay = 5;
		if(this.burst == -this.burstd)
			this.burst = towerTypes[type].burst;
	}
	this.targeting = function () {
		this.currdelay = towerTypes[this.type].delay;
		let inRadius = (tx, ty, dx, dy, r) => (tx-dx)*(tx-dx) + (ty-dy)*(ty-dy) <= r*r
		
		if(this.index != ctw) {
			if(this.constant) {
				if(dots.length > 0)
					this.shoot(dots[0], 0, 0, false);
				return;
			}
			let sortedDots = [...dots];
			sortedDots.sort((a, b) => b.distance - a.distance);
			this.idle = true;
			for(let d of sortedDots) {
				let [dotx, doty] = mapDistToXy(d.distance);

				if(inRadius(this.x+THALF, this.y+THALF, dotx, doty, this.radius)) {
					this.shoot(d, dotx, doty, true);
					this.idle = false;
					break;
				}
			}
			if(this.idle)
				this.currdelay = 1;
		}
	}
	this.draw = function () {
		let nw, nh;

		main.pen.save();
		main.pen.translate((this.x+THALF)*main.scaleX, (this.y+THALF)*main.scaleY);
		main.pen.rotate(this.angle);
		main.pen.translate((0-this.x-THALF)*main.scaleX, (0-this.y-THALF)*main.scaleY);
		main.draw.color = this.color;
		main.draw.rect(this.x, this.y, TSIZE, TSIZE, true);
		main.draw.color = "black";
		switch(this.type) {
		case "wizard":
		case "gunner":
		case "speedy":
		case "cannon":
			nw = TSIZE*(4/5);
			nh = TSIZE*(1/5);
			main.draw.rect(this.x+THALF*1, this.y+THALF-(nh/2), nw, nh, true);
			break;
		case "drones":
			main.draw.rect(this.x + (TSIZE*0.5/2), this.y + (TSIZE*0.5/2), TSIZE*0.5, TSIZE*0.5, true);
			break;
		/*
		case "cannon":
			nw = TSIZE*(3.5/5);
			nh = TSIZE*(2/5);
			main.draw.rect(this.x + THALF*1, this.y+THALF-(nh/2), nw, nh, true);
			break;*/
		}
		
		main.pen.restore();
	}
	this.delete = function () {
		//clearInterval(this.shooter) //comment out for invisible towers
		towers.splice(this.index, 1);
		for(var k of towers) 
			if(k.index > this.index)
				k.index--;
	}
}

function Bullet (x, y, angle, type="normal") {
	this.index = bullets.length;
	bullets.push(this);
	this.type = type;

	this.x = x;
	this.y = y;
	this.distance = 1;
	this.range = bulletTypes[type].range;
	this.speed = bulletTypes[type].speed;
	this.power = bulletTypes[type].power;
	this.size = bulletTypes[type].size;
	this.cooldown = bulletTypes[type].cooldown;
	this.angle = angle + (Math.random()*bulletTypes[type].spread - 0.5*bulletTypes[type].spread);
	this.alpha = 1;

	this.draw = function () {
		main.draw.color = "#fff";
		main.draw.alpha(this.alpha);
		if(this.type == "drone")
			main.draw.rect(this.x-this.size/2, this.y+this.size/2, this.size, this.size, true);
		else
			main.draw.ellipse(this.x, this.y, this.size, this.size, true);
		main.draw.alpha(1);
	}
	this.tick = function () {
		if(this.type == "drone" && --this.cooldown <= 0) {
			for(let i = 0; i < 4; i++) {
				new Bullet(this.x, this.y, Math.PI/2 * i, "fast");
				if(dots.length > 0)
					bullets[bullets.length-1].target = dots[Math.floor(Math.random() * dots.length)];
			}
			this.cooldown = bulletTypes[type].cooldown;
		}
		if(this.type == "magic")
			tails.push([this, this.x, this.y, this.size]);
		if(this.target) {
			if(this.target.index == -1)
				this.target = dots[0];
			if(this.target) {
				[dotx, doty] = mapDistToXy(this.target.distance);
				//magicky future upgrade, swarm of them
				/*
				let v = Math.atan2(this.y-doty, this.x-dotx) + Math.PI
				this.angle += Math.min(Math.abs(this.angle-v), 2*Math.PI) * (this.angle-1 < 0 ? 1 : -1)*/
				let prev = this.angle;
				this.angle = Math.atan2(this.y-doty, this.x-dotx) + Math.PI;
				if(this.angle-prev > 0.1)
					this.angle = prev + 0.1;
				else if(this.angle-prev < -0.1)
					this.angle = prev - 0.1;
			}
		}
		this.x += this.speed/5 * Math.cos(this.angle);
		this.y += this.speed/5 * Math.sin(this.angle);
		this.distance += this.speed/5;
		//collision
		for(n of dots) {
			let [dotx, doty] = mapDistToXy(n.distance);
			distance = Math.sqrt((Math.pow(dotx-this.x,2))+(Math.pow(doty-this.y,2)));
			if(distance < 10) {
				n.pop();
				if (!--this.power)
					this.delete();
			}
		}
		if(this.distance > this.range-this.speed*10)
			this.alpha -= 0.01;
		if(this.alpha < 0.05)
			this.delete();
	}
	this.delete = function () {
		bullets.splice(this.index, 1);
		for(var k of bullets)
			if(k.index > this.index)
				k.index--;
	}
}