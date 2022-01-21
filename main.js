function init(scale) {
	towers.length = bullets.length = dots.length = main.onclicks.length = tails.length = buttons.length = wavecurr = shapes.length = 0;
	selected = ctw = -1;
	wavetick = 55;
	
	main.loop();
	main.draw.size = 100;
	main.clearEveryFrame = false;
	
	main.draw.color = "#5e5e5e";
	main.draw.rect(0,0,800,400,true);
	main.draw.color = "#ffffff";
	main.draw.text(60, 100, 70, "Dots Defense Towers");
	main.draw.text(30, 200, 30, "Dot Lane");
	main.draw.text(30, 250, 30, "Dot Mines");
	main.draw.text(30, 300, 30, "Dot Park");

	main.run = runMenu;
}

function runMenu () {
	if (main.clickIn(30,170,160,200)) { //Dot Lane
		health = 50;
		gold= 1000;
		wave= -5;
		map= "dotlane";
		mapSetup();
		
		main.run = runGame;
	}
	if (main.clickIn(30,210,170,250)) { //Dot Mines
		health = 50;
		gold= 1000;
		wave= -5;
		map= "dotmines";
		mapSetup();
		
		main.run = runGame;
		
	}
	if (main.clickIn()) {}
}

function mapSetup () {
	let waveInterval = setInterval(()=>{if(++wave == 1) {clearInterval(waveInterval)}},1000);

	main.onEvent["key / down"] = function () {
		if (command) {command.remove(); command = false;}
		else {
			command = document.createElement("input");
			command.style = `
				border:0;outline:0;position:absolute;background:none;color:white;
				top:${main.cnv.height-13}px;left:${main.cnv.width-330}px;width:330px;`
			document.body.appendChild(command)
			command.focus()
		}
	}
	main.onEvent["key Enter down"] = function () {
		if (command) {
			let cont = true;
			let val = command.value.split(" ")
			switch (val[0]) {
				case ("/reset"):
					//
					break;
				case ("/godmode"):
					if (!active.godmode) {active.godmode = true; gold = 999999; health = 999999;}
					else {active.godmode = false; gold = 2000; health = 50;}
					break;
				case ("/test"):
					console.log("test")
					break;
				case ("/health"):
					if (isNaN(Number(val[1]))) cont = false;
					health = val[1];
					break;
				case ("/gold"):
					if (isNaN(Number(val[1]))) cont = false;
					gold = val[1];
					break;
				case ("/instakill"):
					if (!active.instakill) {
						active.instakill = true;
						Object.defineProperties(Bullet.prototype, {
							power: {
								get: function () {return 9999},
								set: function (x) {},
								configurable: true,
							},
							attributes: {
								get: function () {return ["impact"]},
								set: function (x) {},
								configurable: true,
							},
						})
					}
					else {
						active.instakill = false;
						delete Bullet.prototype.power;
						delete Bullet.prototype.attributes;
					}
					break;
				default:
					try {Function(command.value)();} catch(e) {cont=false;}
			}
			if (cont) {command.remove(); command = false;}
		}
	}
	
	//tower selection
	main.onclicks.push([function() {
		if(selected != ctw || selected == -1) {
			let isin = 0;
				for(let i in towers)
				if(main.mouseIn(towers[i].x, towers[i].y, towers[i].x+TSIZE, towers[i].y+TSIZE)) {
					selected = (selected == i) ? -1 : i;
					isin = 1;
				}
			if(!isin && main.mouseIn(0, 10, 600, 400)) selected = -1;
		}
	}, 0])
	//tower sell
	main.onclicks.push([function() {
		for(let t of towers) {
			if(t.index != ctw && main.mouseIn(t.x, t.y, t.x+TSIZE, t.y+TSIZE)) {
				t.delete();
				selected = -1;
				debugger;
				let value = t.constructor.price;
				for (let i = 0; i < t.up[0]; i++) value += t.constructor.upgrades[0][i].price
				for (let i = 0; i < t.up[1]; i++) value += t.constructor.upgrades[1][i].price
				gold += Math.floor(value / 1.5);
				break;
			}
		}
	}, 2])
	//tower icons
	let yo = 0, xo = 0;
	for(let t in activeTowers) {
		if(17+yo*70 > 285) {
			xo += ISIZE*1.5;
			yo = 0;
		}
		new Button ({
			x: 620+xo, y: 25+yo*70,
			width: ISIZE, height: ISIZE,
			color: activeTowers[t].color,
			text: "$"+activeTowers[t].price,
			textColor: "#c2d211", textSize: 15,
			callback: function (t) {
				newTower(t, main.mouse.x-IHALF, main.mouse.y-IHALF);
				ctw = towers.length-1;
				selected = ctw;
			}, param: [t],
		})
		yo++;
	}
	//upgrade panel
	new Button ({
		x: 610, y: 300, width: 90, height: 100,
		color: "#5e5e5e",
		callback: function () {if(selected >= 0) towers[selected].upgrade(0);},
	})
	new Button ({
		x: 710, y: 300, width: 90, height: 100,
		color: "#5e5e5e",
		callback: function () {if(selected >= 0) towers[selected].upgrade(1);},
	})
}

function runGame () {
	for(t of towers) {
		if(ctw >= 0) {
			towers[ctw].x = main.mouse.x-THALF;
			towers[ctw].y = main.mouse.y-THALF;

			//let inRect = (px, py, rx, ry, w, h) => {
				//debug.push(["rect", [rx, ry, w, h, true], "#1a077f", 1, 0.5])
			//	return ((px >= rx && px <= rx+w) && (py <= ry && py >= ry-h))
			//}
			//debug.length = 0;
			/*
			for (let i = 0; i < maps[map].path.length-1; i++) {
				debug.push(new Shape({
					x: towers[ctw].x, y: towers[ctw].y,
					color: "white", shape: "ellipse",
					param: [5, 5, true],
				}))
				debug.push(new Shape({
					x: maps[map].path[i][0]-PHALF,
					y: maps[map].path[i][1]-PHALF,
					param: [
						maps[map].path[i+1][0]-maps[map].path[i][0] || PSIZE,
						maps[map].path[i+1][1]-maps[map].path[i][1] || PSIZE,
					true],
					alpha: 0.5, shape: "rect"
				}))
				//inRect(towers[ctw].x, towers[ctw].y,
				//		maps[map].path[i][0]-PHALF, maps[map].path[i][1]-PHALF,
				//		maps[map].path[i+1][0]-maps[map].path[i][0] || PSIZE,
				//		maps[map].path[i+1][1]-maps[map].path[i][1] || PSIZE)
				//inRect(towers[ctw].x, towers[ctw].y, maps[map].path[i][0]-PHALF, maps[map].path[i][1]-PHALF, PSIZE, PSIZE)
			} debug.push(new Shape({
				x: 600, y: 10, alpha: 0.5,
				param: [300, 390, true],
				shape: "rect",
			}))*/
			
			if(!main.mouseDown[0]) {
				let out;
				/*for (let i = 0; i < maps[map].path.length-1; i++) {
					if (inRect(towers[ctw].x, towers[ctw].y,
						maps[map].path[i][0]-PHALF, maps[map].path[i][1]-PHALF,
						maps[map].path[i+1][0]-maps[map].path[i][0] || PSIZE,
						maps[map].path[i+1][1]-maps[map].path[i][1] || PSIZE)
					  ) {
						here;
						out = true;
						break;
					}
				}*/
				if(out || towers[ctw].x < 0 || towers[ctw].x > 550 || towers[ctw].y <= 10 || towers[ctw].y > 390
					|| gold-towers[ctw].constructor.price < 0)
					towers[ctw].delete();
				else {
					towers[ctw].idle = true;
					gold -= towers[ctw].constructor.price;
				}
				ctw = selected = -1;
			}
		}
		if(t.idle) {
			t.angle += t.dir / 100;
			if(Math.random() > 0.999) t.dir = (Math.random()*0.2 - 0.1) * 3;
		}
	}

	if(--wavetick == 0) {
		wavetick = 55;
		spawnDot();
	}
	
	drawGame();

/*
	for (let j in rollcall) {
		if (!bullets.indexOf(rollcall[j])) {
			console.log(rollcall[j])
			//throw new Error ("--dissapearo found")
		}
	}*/
}

function getPathMax(len,pI) {
	let i, max = 0;
	
	for(i = 0; i < len; i++) {
		max += Math.abs(maps[map]["path"+pI][i+1][0] - maps[map]["path"+pI][i][0]);
		max += Math.abs(maps[map]["path"+pI][i+1][1] - maps[map]["path"+pI][i][1]);
	}
	return max;
}

function mapDistToXy(dist, pI) {
	//xs = direction: left-right or up-down
	let i, xs = !(maps[map]["path"+pI][0][0] - maps[map]["path"+pI][0][1]);
	
	for(i = 0; getPathMax(i,pI) < dist; i++) xs = !xs;
	
	let rev = maps[map]["path"+pI][i][!xs+0] < maps[map]["path"+pI][--i][!xs+0] ? -1 : 1;
	
	return [
		maps[map]["path"+pI][i][0] + (xs ? (dist - getPathMax(i,pI)) * rev : 0), //x
		maps[map]["path"+pI][i][1] + (xs ? 0 : (dist - getPathMax(i,pI)) * rev ) //y
	];
}

function drawGame () {
	//draw menu, map, and background
	main.draw.color = "#000";
	main.draw.rect(0,0,800,400,true);
	main.draw.color = maps[map].background;
	main.draw.rect(0,10,600,390,true);
	main.draw.color = "#3e3f3f";
	main.draw.rect(610,10,200,275,true);
	for (let b of buttons) b.draw();
	//draw the path for the dots
	main.draw.color = maps[map].pathcolor;
	main.draw.size = PSIZE;
	for (let l=0; maps[map]["path"+l]; l++) {
		let p = maps[map]["path"+l]
		for(let i = 0; i < p.length-1; i++) {
			main.draw.rect(
				p[i][0]-PHALF, p[i][1]-PHALF,
				p[i+1][0]-p[i][0] || PSIZE,
				p[i+1][1]-p[i][1] || PSIZE,
			true);
			main.draw.rect(p[i][0]-PHALF, p[i][1]-PHALF, PSIZE, PSIZE, true);
			/*main.pen.save()
			main.draw.size = 1; main.draw.color = "black"
			main.draw.line(p[i][0], p[i][1],p[i+1][0],p[i+1][1],true)
			main.pen.restore();*/
		}
	}
	//draw the dots
	for(var d of dots) {
		d.distance += d.constructor.speed / 1.5;
		if(d.distance > getPathMax(maps[map]["path"+d.pathindex].length-1,d.pathindex)-15) {
			d.delete();
			if(--health <= 0)
				init();

		}
		d.draw();
	}
	//draw bullets
	for(var b of bullets) {
		b.tick();
		b.draw();
	}
	//draw tails
	for(let i in tails) {
		debugger;
		main.draw.alpha(tails[i][0].alpha); //and i OOP
		main.draw.color = tails[i][0].constructor.color;
		tails[i][3] -= tails[i][0].k.size / 10;
		main.draw.ellipse(tails[i][1], tails[i][2], tails[i][3], tails[i][3], true);
		if(tails[i][3] < 0.1)
			tails.splice(i,1);
		main.draw.alpha(1);
	}
	//draw towers
	if(selected >= 0) {
		let v = 0, t = towers[selected], k = t.constructor;

		main.draw.alpha(0.5);
		main.draw.color = "#63666a";
		 main.draw.ellipse(t.x+THALF, t.y+THALF, t.radius, t.radius, true);
		if (t.inner) {
			main.draw.color = "black";
			main.draw.ellipse(t.x+THALF, t.y+THALF, t.inner, t.inner, true);
		}
		main.draw.alpha(1);
		main.draw.color = "#fff";
		main.draw.text(80, 35, 20, "dmg:  "+t.popcount);
		for(let i = 0; i < t.popsec.length; i++)
			v += t.popsec[i];
		main.draw.text(80, 55, 20, "dps:   "+v);
		main.draw.text()
		
		if (t.up[0] >= k.upgrades[0].length) {
			main.draw.color = "#66ff00";
			main.draw.text(620, 330, 15, "Maxed Out");
		} else {
			main.draw.color = "#c2d211";
			main.draw.text(620, 330, 20, "$"+k.upgrades[0][t.up[0]].price);
			main.draw.color = "#fff";
			main.draw.text(620, 365, 15, k.upgrades[0][t.up[0]].tagline);
		}
		if (t.up[1] >= k.upgrades[1].length) {
			main.draw.color = "#66ff00";
			main.draw.text(720, 330, 15, "Maxed Out");
		} else {
			main.draw.color = "#c2d211";
			main.draw.text(720, 330, 20, "$"+k.upgrades[1][t.up[1]].price);
			main.draw.color = "#fff";
			main.draw.text(720, 365, 15, k.upgrades[1][t.up[1]].tagline);
		}
		/*if(!t.up[0]) {
			main.draw.color = "#c2d211";
			main.draw.text(620, 330, 20, upgrades[t.type][0][0]+"$");
		} else {
			main.draw.color = "#66ff00";
			main.draw.text(620, 330, 15, "Purchased");
		}
		if(!t.up[1]) {
			main.draw.color = "#c2d211";
			main.draw.text(720, 330, 20, upgrades[t.type][1][0]+"$");
		} else {
			main.draw.color = "#66ff00";
			main.draw.text(720, 330, 15, "Purchased");
		}
		main.draw.color = "#fff";
		main.draw.text(620, 365, 15, upgrades[t.type][0][2]);
		main.draw.text(720, 365, 15, upgrades[t.type][1][2]);
	*/
	}
	for(let t of towers) {
		t.currdelay--;
		/*if(++t.ticks >= 20) {
			t.popsec.splice(t.popsec.length-1)
			t.popsec.unshift(0);
			t.ticks = 0;
		}*/
		if(t.currdelay == 0) t.targeting();
		
		t.draw();
	}
	//draw info
	main.draw.color = "#fff";
	main.draw.text(5, 45, 40, wave);
	main.draw.color = "#c2d211";
	main.draw.text(5, 75, 25, gold);
	main.draw.color = "#ff0000";
	main.draw.text(5, 100, 25, health);

	for(let d of maps[map].decor) d.draw();
	for(let s of debug) s.draw();
	//debug.length = 0 //temp



	if (command) {
		main.draw.color = "#000"
		main.pen.beginPath();
		main.pen.rect(main.cnv.width-350, main.cnv.height-25, main.cnv.width, main.cnv.height);
		main.pen.fill();
		main.draw.size=25;
		main.pen.beginPath();
		main.pen.moveTo(main.cnv.width-345, main.cnv.height-14);
		main.pen.lineTo(main.cnv.width-395, main.cnv.height+11);
		main.pen.stroke();
	}
}

function spawnDot() {
	//debugger;
	if (wave < 1) return;

	let i = getCurr({
		map: map, index: wavecurr++,
		wave: wave > waves[map].length ?
			waves[map].length-1 : wave-1,
	})
	for (let n in i) if(i[n]) newDot(i[n], n);
}

function getCurr({map, wave, index, path}) {
	if (path) return Number(waves[map][wave][path][index])
	let rt = [];
	for (let k of waves[map][wave]) rt.push(Number(k[index]))
	return rt
}