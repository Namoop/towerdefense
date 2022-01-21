let health, gold, wave, selected, ctw, wavetick, wavecurr, map, command = false;
const main = new Game(), dots = [], towers = [], bullets = [], active = {}, debug = [], tails = [], buttons = [], shapes = [];
const nextWave = () => {wave++; wavecurr = 0;}
const inRect = (px, py, rx, ry, w, h) => ((px >= rx && px <= rx+w) && (py >= ry && py <= ry+h))
const inRadius = (tx, ty, dx, dy, r) => Math.hypot(tx-dx,ty-dy) <= r
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
			
			if (this.constructor.onDeath)
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
	constructor(x, y) {
		//this.inner = towerTypes[type].inner;
		this.index = towers.length;
		//this.type = type;
		this.x = x;
		this.y = y;
		/*this.color = towerTypes[type].color;
		this.radius = towerTypes[type].radius;
		this.delay = towerTypes[type].delay;
		this.bullet = towerTypes[type].bullet;
		this.burst = towerTypes[type].burst;
		this.burstd = towerTypes[type].burstd;
		this.nshot = towerTypes[type].nshot;
		this.constant = towerTypes[type].constant;
		this.price = towerTypes[type].price;*/
		this.burstc = 1;//this.burst;
		this.currdelay = 1//this.delay;
		this.popcount = 0;
		this.popsec = Array(10).fill(0); /*use date.now array*/
		this.dir = 0.2;
		this.angle = 0;
		this.idle = false;
		//this.ticks = 0;
		this.up = [0, 0];
		towers.push(this);
		//if (type == "drone") this.sub = "normal"
	}
	upgrade(t) {
		
		let u = this.constructor.upgrades[t][this.up[t]++];

		if(gold - u.price < 0)
			return --this.up[t];
		gold -= u.price;

		//this.something[idk] //actually change values
	}
	targeting() {
		this.currdelay = this.delay;
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
					this.shoot(d, dotx, doty);
					this.idle = false;
					break;
				}
			}
			if(this.idle) this.currdelay = 1;
		}
	}
	shoot(d, dotx, doty, target) {
		this.angle = Math.atan2(this.y+THALF-doty, this.x+THALF-dotx) + Math.PI;
/*
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
			//for(let i = 0; i < this.nshot; i++)
				new Bullet(this);
		}*/

		new Bullet(this, d);
		
		
		if(--this.burstc) this.currdelay = 5;
		else this.burstc = this.bullet.burst;
	}
	draw() {
		let nw, nh;

		main.pen.save();
		main.pen.translate((this.x+THALF)*main.scaleX, (this.y+THALF)*main.scaleY);
		main.pen.rotate(this.angle);
		main.pen.translate((0-this.x-THALF)*main.scaleX, (0-this.y-THALF)*main.scaleY);
		main.draw.color = this.constructor.color;
		main.draw.rect(this.x, this.y, TSIZE, TSIZE, true);
		main.draw.color = "black";
		switch(this.constructor) {
		case Wizard: /*add different tower art at some point*/
		case Gunner:
		case Speedy:
		case Cannoneer:
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
	constructor(tower, tg) {
		//this.index = bullets.length;
		this.k = {...tower.bullet}
		this.x = tower.x+THALF;
		this.y = tower.y+THALF;
		this.distance = 1;
		this.pierced = [];
		//this.cooldown = bulletTypes[type].cooldown;
		//this.cooldownCounter = bulletTypes[type].cooldown;
		this.angle = tower.angle + (Math.random()*this.k.spread - 0.5*this.k.spread);
		this.alpha = 1;
		if (this.k.attributes.includes("target")) this.target = tg
		//if (this.type == "drone") this.sub = tower.sub;
		bullets.push(this);
		//if (this.type == "drone") this.rollcallIndex = bulletIndex++
		//if (this.type == "drone") rollcall[this.rollcallIndex] = this;
	}
	draw() {
		main.draw.color = this.k.color;
		//if (this.type == "drone") main.draw.text(this.x,this.y,10,Math.round(this.alpha*100)/100)
		main.draw.alpha(this.alpha<0 ? 0.01 : this.alpha);
		/*if(this.bclass == "drone") {
			main.pen.save()
			main.draw.color = "black"
			main.draw.rect(this.x-this.size/2-1, this.y+this.size/2-1, this.size+2, this.size+2, true);
			main.pen.restore()
			main.draw.rect(this.x-this.size/2, this.y+this.size/2, this.size, this.size, true);
		}
		else*/
			main.draw.ellipse(this.x, this.y, this.k.size, this.k.size, true);
		main.draw.alpha(1);
	}
	tick() {
		//movement
		this.x += this.k.speed/5 * Math.cos(this.angle);
		this.y += this.k.speed/5 * Math.sin(this.angle);
		this.distance += this.k.speed/5;
		if(this.distance > this.k.range-this.k.speed*10) { //not accurate
			//this.alpha = (this.range-this.speed*100) //...or something
			if(this.alpha >= 0.01)
				this.alpha -= 0.01;
		}
		if (this.distance > this.k.range) this.delete("range")
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
		//targeting
		if (this.k.attributes.includes("target")) tails.push([this, this.x, this.y, this.k.size]);
		if(this.target?.index == -1) {
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
		//collision
		for(let n of dots) {
			if (this.pierced.includes(n)) continue;
			let skip = false;
			for (let i of (this.k.attributes??[])) if (n.constructor.immune.includes(i)) {skip = true; break;}
			if (skip) continue;
			let [dotx, doty] = mapDistToXy(n.distance, n.pathindex);
			let distance = Math.sqrt((Math.pow(dotx-this.x,2))+(Math.pow(doty-this.y,2)));
			if(distance < 10) {
				let rpops = this.power;
				if(n.health < this.power)
					rpops = n.health;
				//this.tower.popsec[0] += rpops;
				//this.tower.popcount += rpops;

				this.pierced.push(n)
				let dothealth = n.health
				n.pop(this.k.power);
				if (this.k.attributes.includes("impact")) {if ((this.k.power -= dothealth) <= 0) this.delete("impact"); break;}
				else if (!--this.k.piercing) {this.delete("pierce"); break;}
				
			}
		}
		
	}
	delete(death) {
		this.death = death;
		bullets.splice(bullets.indexOf(this), 1);
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