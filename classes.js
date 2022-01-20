let health, gold, wave, selected, ctw, wavetick, wavecurr, map, command = false;
const main = new Game(), dots = [], towers = [], bullets = [], active = {}, debug = [], tails = [], buttons = [], shapes = [];
const nextWave = () => {wave++; wavecurr = 0;}
const inRect = (px, py, rx, ry, w, h) => ((px >= rx && px <= rx+w) && (py >= ry && py <= ry+h))
//var rollcall = {}, bulletIndex = 0;

class Button {
	constructor({x, y, width, height, color="grey", text="", textColor="white", textSize=20, callback=function(){}, param=[]}) {
		this.x = x;
		this.y = y;
		this.w = width;
		this.h = height;
		this.color = color;
		this.text = text;
		this.textcolor = textColor;
		this.textsize = textSize;
		this.param = param;
		this.callback = callback;
		buttons.push(this);
		main.onclicks.push([()=> {
			if(main.mouseIn(this.x, this.y, this.x+this.w, this.y+this.h))
				this.callback(...this.param);
		}, 0])
	}
	draw() {
		main.draw.color = this.color;
		main.draw.rect(this.x, this.y, this.w, this.h, true);
		if(this.text != null) {
			main.draw.color = this.textcolor;
			main.draw.text(this.x, this.y, this.textsize, this.text);
		}
	}
	delete() {buttons.splice(buttons.indexOf(this),1)}
}

class Dot {
	constructor(pathindex, distance, health) {
		this.health = health;
		this.index = dots.length;
		this.distance = distance ?? 1;
		this.pathindex = pathindex;
		dots.push(this);
	}
	pop(damage) {
		this.health -= damage;
		if(this.health <= 0) {
			gold += this.constructor.value;
			if (this.onDeath)
				for (let n in this.constructor.onDeath)
					newDot(this.constructor.onDeath[n], this.pathindex, this.distance-10*n);
			
			this.delete();
		}
	}
	draw() {
		main.draw.color = this.constructor.color;
		main.draw.ellipse(...mapDistToXy(this.distance, this.pathindex), 10, 10, true);
	}
	delete() {
		dots.splice(this.index, 1);
		for(var k of dots) if(k.index > this.index) k.index--;
		if (dots.length == 0) if(getCurr({
			map:map,index:wavecurr,
			wave:wave > waves[map].length ?waves[map].length-1 : wave-1
		}).every(a=>isNaN(a))) nextWave();
		this.index = -1;
	}
}

class Tower {
	constructor(type, x, y) {
		this.inner = towerTypes[type].inner;
		this.index = towers.length;
		this.type = type;
		this.x = x;
		this.y = y;
		this.color = towerTypes[type].color;
		this.radius = towerTypes[type].radius;
		this.delay = towerTypes[type].delay;
		this.bullet = towerTypes[type].bullet;
		this.burst = towerTypes[type].burst;
		this.burstd = towerTypes[type].burstd;
		this.nshot = towerTypes[type].nshot;
		this.constant = towerTypes[type].constant;
		this.price = towerTypes[type].price;
		this.burstc = this.burst;
		this.currdelay = this.delay;
		this.popcount = 0;
		this.popsec = Array(10).fill(0);
		this.dir = 0.2;
		this.angle = 0;
		this.idle = false;
		this.ticks = 0;
		this.up = [0, 0];
		towers.push(this);
		if (type == "drone") this.sub = "normal"
	}
	shoot(d, dotx, doty, target) {
		if(target) this.angle = Math.atan2(this.y+THALF-doty, this.x+THALF-dotx) + Math.PI;

		switch(this.type) {
		case "drones":
			for(let i = 0; i < this.nshot; i++)
				new Bullet(this.x+THALF, this.y+THALF, Math.PI*2 * (i/this.nshot), this, this.bullet);
			break;
		case "wizard":
			for(let i = 0; i < this.nshot; i++) {
				new Bullet(this.x+THALF, this.y+THALF, this.angle, this, this.bullet);
				if(i == 0) bullets.at(-1).target = d;
				else {
					if(dots.length) bullets.at(-1).target = dots[Math.floor(Math.random() * dots.length)];
				}
			}
			break;
		default:
			for(let i = 0; i < this.nshot; i++)
				new Bullet(this.x+THALF, this.y+THALF, this.angle, this, this.bullet);
		}
		this.burstc--;
		if(this.burstc > 0)
			this.currdelay = 5;
		if(this.burstc == -this.burstd)
			this.burstc = this.burst;
	}
	targeting() {
		this.currdelay = this.delay;
		let inRadius = (tx, ty, dx, dy, r) => Math.hypot(tx-dx,ty-dy) <= r
		
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
				let [dotx, doty] = mapDistToXy(d.distance, d.pathindex);

				if(inRadius(this.x+THALF, this.y+THALF, dotx, doty, this.radius)
				  && (this.inner ? (!inRadius(this.x+THALF,this.y+THALF,dotx,doty,this.inner)) : true)) {
					this.shoot(d, dotx, doty, true);
					this.idle = false;
					break;
				}
			}
			if(this.idle) this.currdelay = 1;
		}
	}
	upgrade(t) {
		let u = upgrades[this.type][t];

		if(this.up[t] || gold-u[0] < 0)
			return;
		this.up[t] = 1;
		gold -= u[0];
		this.price += u[0];
		
		for(let i in u[1]) this[u[1][i][0]] = u[1][i][1];
		/* //ENZO DONT USE SO MANY SWITCHES COMPLETELY UNNECESARILY
		for(let i in u[1])
			switch(u[1][i][0]) {
			case "nshot":	this.nshot = u[1][i][1]; break;
			case "burst":	this.burst = u[1][i][1]; break;
			case "radius":	this.radius = u[1][i][1]; break;
			case "bullet":	this.bullet = u[1][i][1]; break;
			case "delay":	this.delay = u[1][i][1]; break;
			}*/
	}
	draw() {
		let nw, nh;

		main.pen.save();
		main.pen.translate((this.x+THALF)*main.scaleX, (this.y+THALF)*main.scaleY);
		main.pen.rotate(this.angle);
		main.pen.translate((0-this.x-THALF)*main.scaleX, (0-this.y-THALF)*main.scaleY);
		main.draw.color = this.color;
		main.draw.rect(this.x, this.y, TSIZE, TSIZE, true);
		main.draw.color = "black";
		switch(this.type) {
		case "wizard": /*add different tower art at some point*/
		case "gunner": /*maybe move to config?*/
		case "speedy":
		case "cannon":
			nw = TSIZE*(4/5);
			nh = TSIZE*(1/5);
			main.draw.rect(this.x+THALF*1, this.y+THALF-(nh/2), nw, nh, true);
			break;
		case "drones":
			main.draw.rect(this.x + (TSIZE*0.5/2), this.y + (TSIZE*0.5/2), TSIZE*0.5, TSIZE*0.5, true);
			break;
		}
		main.pen.restore();
	}
	delete() {
		towers.splice(this.index, 1);
		for(var k of towers) if(k.index > this.index) k.index--;
	}
}

class Bullet {
	constructor(x, y, angle, link, type="normal") {
		//this.index = bullets.length;
		this.type = type;
		this.x = x;
		this.y = y;
		this.distance = 1;
		this.link = link;
		this.pierced = [];
		this.attributes = bulletTypes[type].attributes;
		this.color = bulletTypes[type].color
		this.bclass = bulletTypes[type].bclass;
		this.range = bulletTypes[type].range;
		this.speed = bulletTypes[type].speed;
		this.power = bulletTypes[type].power;
		this.size = bulletTypes[type].size;
		this.cooldown = bulletTypes[type].cooldown;
		this.cooldownCounter = bulletTypes[type].cooldown;
		this.angle = angle + (Math.random()*bulletTypes[type].spread - 0.5*bulletTypes[type].spread);
		this.alpha = 1;
		if (this.type == "drone") this.sub = link.sub;
		bullets.push(this);
		//if (this.type == "drone") this.rollcallIndex = bulletIndex++
		//if (this.type == "drone") rollcall[this.rollcallIndex] = this;
	}
	draw() {
		main.draw.color = this.color;
		//if (this.type == "drone") main.draw.text(this.x,this.y,10,Math.round(this.alpha*100)/100)
		main.draw.alpha(this.alpha<0 ? 0.01 : this.alpha);
		if(this.bclass == "drone") {
			main.pen.save()
			main.draw.color = "black"
			main.draw.rect(this.x-this.size/2-1, this.y+this.size/2-1, this.size+2, this.size+2, true);
			main.pen.restore()
			main.draw.rect(this.x-this.size/2, this.y+this.size/2, this.size, this.size, true);
		}
		else
			main.draw.ellipse(this.x, this.y, this.size, this.size, true);
		main.draw.alpha(1);
	}
	tick() {
		//movement
		this.x += this.speed/5 * Math.cos(this.angle);
		this.y += this.speed/5 * Math.sin(this.angle);
		this.distance += this.speed/5;
		if(this.distance > this.range-this.speed*10) { //not accurate
			//this.alpha = (this.range-this.speed*100) //...or something
			if(this.alpha >= 0.01)
				this.alpha -= 0.01;
		}
		if (this.distance > this.range) this.delete("range")
		else if(this.alpha < 0.01) this.delete("alpha");
		else if (!inRect(this.x, this.y, 0, 10, 600, 390)) this.delete("out of bounds")

		
		//drone targeting
		if(this.bclass == "drone" && --this.cooldownCounter <= 0) {
			for(let i = 0; i < 4; i++) {
				new Bullet(this.x, this.y, Math.PI/2 * i, this.link, this.sub);
				if(dots.length > 0)
					bullets.at(-1).target = dots[Math.floor(Math.random() * dots.length)];
			}
			this.cooldownCounter = this.cooldown;
		}
		//wizard targeting
		if(this.bclass == "magic")
			tails.push([this, this.x, this.y, this.size]);
		if(this.target) {
			if(this.target.index == -1) {
				if(dots.length) this.target = dots[0];
				else this.target = undefined;
			}
			if(this.target) {
				let [dotx, doty] = mapDistToXy(this.target.distance, this.target.pathindex);
				//magicky future upgrade, swarm of them
				/*
				let v = Math.atan2(this.y-doty, this.x-dotx) + Math.PI
				this.angle += Math.min(Math.abs(this.angle-v), 2*Math.PI) * (this.angle-1 < 0 ? 1 : -1)*/
				let prev = this.angle;
				this.angle = Math.atan2(this.y-doty, this.x-dotx) + Math.PI;
				if(this.angle-prev > 0.07)
					this.angle = prev + 0.07;
				else if(this.angle-prev < -0.07)
					this.angle = prev - 0.07;
			}
		}
		//collision
		for(let n of dots) {
			if (this.pierced.includes(n)) continue;
			let skip = false;
			for (let i of (this.attributes?this.attributes:[])) if (n.constructor.immune.includes(i)) {skip = true; break;}
			if (skip) continue;
			let [dotx, doty] = mapDistToXy(n.distance, n.pathindex);
			let distance = Math.sqrt((Math.pow(dotx-this.x,2))+(Math.pow(doty-this.y,2)));
			if(distance < 10) {
				let rpops = this.power;
				if(n.health < this.power)
					rpops = n.health;
				this.link.popsec[0] += rpops;
				this.link.popcount += rpops;

				this.pierced.push(n)
				let dothealth = n.health
				n.pop(this.power);
				if (this.attributes.includes("impact")) {if ((this.power -= dothealth) <= 0) this.delete("impact");}
				else if (!--this.piercing) this.delete("pierce");
				
			}
		}
		
	}
	delete(death) {
		this.death = death;
		bullets.splice(bullets.indexOf(this), 1);/*
		if (this.type == "drone") delete rollcall[this.rollcallIndex];
		//for(var k of bullets) if(k.index > this.index) k.index--;
		if (this.type == "drone") switch (death) {
			case ("alpha"): //notice how the dissapearing dots don't leave this behind -- they aren't getting deleted, they are maybe being removed from the bullets array in some other way?
				//debug.push(new Shape({x: this.x, y:this.y, color:"white", shape:"text", param:[10, Math.round(this.alpha*1000)/1000],}))
				break;
			case ("impact"):
				console.log("wtf");
				throw new Error("why tf is it impact dying --stacktrace")
				break;
			case ("pierce"): //seems to be working
				//console.log("hit a dot")
				break;
			default:
				throw new Error("holy shit this thing is broken --stacktrace")
		}*/
		//this.index = -1
	}
}

class Shape {
	constructor({x,y,param=[],color="black",size=1,alpha=1,shape="rect"}) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.size = size;
		this.alpha = alpha;
		this.param = param;
		this.shape = shape;
		shapes.push(this)
	}	
	draw() {
		main.pen.save();
		main.draw.color = this.color;
		main.draw.size = this.size;
		main.draw.alpha(this.alpha);
		main.draw[this.shape](this.x,this.y,...this.param)
		main.pen.restore();
	}
	delete() {shapes.splice(shapes.indexOf(this),1)}
}