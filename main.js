let path, healh, gold, wave, selected = -1, ctw = -1, wavetick = 55, wavecurr = 0, map;
const main = new Game(), dots = [], towers = [], bullets = [], debug = [], tails = [];

function init (scale) {
	main.setup(100, scale);
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
	if (main.clickIn(30,170,160,200)) {
		path = [[-20, 150], [150, 150], [150, 300], [300,300], [300,200], [450,200], [450,350], [550,350], [550,50], [225,50], [225,10]];
		health = 50;
		gold= 300;
		wave= -5;
		map= "dotlane";
		let waveInterval = setInterval(()=>{if(++wave == 1) {clearInterval(waveInterval)}},1000);
		
		main.onleftmousedown = function() {
			if(selected != ctw || selected == -1) {
				let isin = 0;

				for(let i in towers)
					if(main.mouseIn(towers[i].x, towers[i].y, towers[i].x+TSIZE, towers[i].y+TSIZE)) {
						selected = (selected == i) ? -1 : i;
						isin = 1;
					}
				if(!isin)			
					selected = -1;
			}
			let i = 0;
			for(let t in towerTypes) {
				if(main.mouseIn(620, 17+i*70, 670, (17+i*70)+TSIZE)) {
					new Tower(t, main.mouse.x-THALF, main.mouse.y-THALF);
					ctw = towers.length-1;
					selected = ctw;
					break;
				}
				i++
			}
		}
		main.onrightmousedown = function() {
			for(let t of towers) {
				if(t.index != ctw && main.mouseIn(t.x, t.y, t.x+TSIZE, t.y+TSIZE)) {
					t.delete();
					selected = -1;
					gold += Math.floor(towerTypes[t.type].price / 1.5);
					break;
				}
			}
		}
		main.run = runLane;
	}
}

function runLane () {
	for(t of towers) {
		if(ctw >= 0) {
			towers[ctw].x = main.mouse.x-THALF;
			towers[ctw].y = main.mouse.y-THALF;

			let inRect = (px, py, rx, ry, w, h) =>
				((px >= rx && px <= rx+w) && (py <= ry && py >= ry-h))
			if(!main.mouseDown[0]) {
				let out = 0;
/*
				for (let i = 0; i < path.length-1; i++) {
					if(inRect(towers[ctw].x, towers[ctw].y,
						path[i][0]-THALF, path[i][1]-THALF,
						path[i+1][0]-path[i][0] || TSIZE,
						path[i+1][1]-path[i][1] || TSIZE)
					|| inRect(towers[ctw].x, towers[ctw].y, path[i][0]-THALF,
						path[i][1]-THALF, TSIZE, TSIZE)) {
							out = 1;
							break;
					}
				}*/
				if(out || towers[ctw].x < 0 || towers[ctw].x > 550 || towers[ctw].y <= 10 || towers[ctw].y > 390)
					towers[ctw].delete();
				else {
					towers[ctw].idle = true;
					gold -= towerTypes[towers[ctw].type].price;
				}
				ctw = selected = -1;
			}
		}
		if(t.idle) {
			t.angle += t.dir / 100;
			if(Math.random() > 0.999) t.dir = (Math.random()*0.2 - 0.1) * 3;
		}
	}
	drawGame();

	if(--wavetick == 0) {
		wavetick = 55;
		spawnDot("dotlane");
	}
}

function getPathMax(len) {
	let i, max = 0;
	
	for(i = 0; i < len; i++) {
		max += Math.abs(path[i+1][0] - path[i][0]);
		max += Math.abs(path[i+1][1] - path[i][1]);
	}
	return max;
}

function mapDistToXy(dist) {
	//xs = direction: left-right or up-down
	let i, xs = !(path[0][0] - path[0][1]);
	
	for(i = 0; getPathMax(i) < dist; i++)
		xs = !xs;
	
	let rev = path[i][!xs+0] < path[--i][!xs+0] ? -1 : 1;
	
	return [
		path[i][0] + (xs ? (dist - getPathMax(i)) * rev : 0), //x
		path[i][1] + (xs ? 0 : (dist - getPathMax(i)) * rev ) //y
	];
}

function drawGame () {
	//draw menu, map, and background
	main.draw.color = "#000";
	main.draw.rect(0,0,800,400,true);
	main.draw.color = "#23802c";
	main.draw.rect(0,10,600,390,true);
	main.draw.color = "#3e3f3f";
	main.draw.rect(610,10,200,275,true);
	main.draw.color = "#5e5e5e";
	main.draw.rect(610,300,90,100,true);
	main.draw.rect(710,300,90,100,true);
	//draw tower icons
	let i = 0;
	for(let t in towerTypes) {
		main.draw.color = towerTypes[t].color;
		main.draw.rect(620, 17+i*70, TSIZE, TSIZE, true);
		i++;
	}
	//draw the path for the dots
	main.draw.color = "#794d01";
	main.draw.size = PSIZE;
	for (let i = 0; i < path.length-1; i++) {
		main.draw.rect(
			path[i][0]-PHALF, path[i][1]-PHALF,
			path[i+1][0]-path[i][0] || PSIZE,
			path[i+1][1]-path[i][1] || PSIZE,
		true);
		main.draw.rect(path[i][0]-PHALF, path[i][1]-PHALF, PSIZE, PSIZE, true);
	}
	//draw the dots
	for (var d of dots) {
		d.distance += d.speed / 1.5;
		if(d.distance > 1630) {
			d.delete();
			health--;
		}
		d.draw();
	}
	//draw bullets
	for (var b of bullets) {
		b.tick();
		b.draw();
	}
	//draw tails
	for (let i in tails) {
		main.draw.alpha(tails[i][0].alpha);
		main.draw.color = "#fff";
		tails[i][3] -= tails[i][0].size / 10;
		main.draw.ellipse(tails[i][1], tails[i][2], tails[i][3], tails[i][3], true);
		if(tails[i][3] < 0.1)
			tails.splice(i,1);
		main.draw.alpha(1);
	}
	//draw towers
	if(selected >= 0) {
		main.draw.alpha(0.5);
		main.draw.color = "#63666a";
		main.draw.ellipse(towers[selected].x+THALF, towers[selected].y+THALF, towers[selected].radius, towers[selected].radius, true);
		main.draw.alpha(1);
	}
	for (let i of towers) {
		i.currdelay--;
		if (i.currdelay == 0)
			i.targeting();
		i.draw();
	}
	//draw info
	main.draw.color = "#fff";
	main.draw.text(5, 45, 40, wave);
	main.draw.color = "#c2d211";
	main.draw.text(5, 75, 25, gold);
	main.draw.color = "#ff0000";
	main.draw.text(5, 100, 25, health);

	for (let i of debug) {
		main.draw.color = i[2];
		main.draw.size = i[3];
		main.draw[i[0]](...i[1]);
	}
}