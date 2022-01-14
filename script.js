let path, healh, gold, wave, dots = [];
let towers = [], selected = -1, ctw = -1;

const main = new Game()

main.setup() //create the canvas, start events, etc | required
main.loop() //start the main game loop | required
main.draw.size = 100 //set the draw size
main.clearEveryFrame = false

//draw main menu
main.draw.color = "#5e5e5e"
main.draw.rect(0,0,800,400,true)
main.draw.color = "#ffffff"
main.draw.text(60, 100, 70, "Dots Defense Towers")
main.draw.text(30, 200, 30, "Dot Lane")
main.draw.text(30, 250, 30, "Dot Mines")
main.draw.text(30, 300, 30, "Dot Park")


main.run = function () {
	if (main.clickIn(30,170,160,200)) {
		path = [[-20, 150], [150, 150], [150, 300], [300,300], [300,200], [450,200], [450,350], [550,350], [550,50], [225,50], [225,10]]
		health = 50
		gold=300
		wave=-5
		let waveInterval = setInterval(()=>{if (++wave == 0) {clearInterval(waveInterval);runWave("dotlane")}},1000)
		
		main.onmousedown = function() {
			let isin = 0

			for(let i in towers)
				if(main.clickIn(towers[i].x, towers[i].y, towers[i].x+50, towers[i].y+50)) {
					selected = (selected == i) ? -1 : i
					isin = 1
				}
			if(!isin)			
				selected = -1
			for(let i = 0; i < 4; i++)
				if(main.clickIn(620, 17+i*70, 670, (17+i*70)+50)) {
					new Tower(i, main.mouse.x-25, main.mouse.y-25);
					ctw = towers.length-1
				}
		}


		
			for(t of towers)
				t.tick();
			drawGame();
	}
}

function getPathMax(len) {
	let i, pathMax = 0
	
	for(i = 0; i < len; i++) {
		pathMax += Math.abs(path[i+1][0] - path[i][0])
		pathMax += Math.abs(path[i+1][1] - path[i][1])
	}
	return pathMax
}

function mapDistToXy(dist) {
	//xs = direction: left-right or up-down
	let i, xs = !(path[0][0] - path[0][1])
	
	for(i = 0; getPathMax(i) < dist; i++) xs = !xs
	
	let rev = path[i][!xs+0] < path[--i][!xs+0] ? -1 : 1
	
	return [
		path[i][0] + (xs ? (dist - getPathMax(i)) * rev : 0), //x
		path[i][1] + (xs ? 0 : (dist - getPathMax(i)) * rev ) //y
	]
}

function drawGame () {
	//draw menu, map, and background
	main.draw.color = "#000"
	main.draw.rect(0,0,800,400,true)
	main.draw.color = "#23802c"
	main.draw.rect(0,10,600,390,true)
	main.draw.color = "#3e3f3f"
	main.draw.rect(610,10,200,275,true)
	main.draw.color = "#5e5e5e"
	main.draw.rect(610,300,90,100,true)
	main.draw.rect(710,300,90,100,true)
	//draw tower icons
	for(let i = 0; i < 4; i++) {
		main.draw.color = towerTypes[i]
		main.draw.rect(620, 17+i*70, 50, 50, true)
	}
	//draw the path for the dots
	main.draw.color = "#794d01"
	main.draw.size = 50
	for (let i = 0; i < path.length-1; i++) {
		main.draw.line(...path[i], ...path[i+1])
		main.draw.rect(path[i][0]-25,path[i][1]-25,50,50,true)
	}
	//draw the dots
	for (var d of dots) {
		d.distance+=d.speed/1.5
		if (d.distance > 1630) { d.delete(); health--}
		d.draw()
	}
	//draw towers
	if(selected >= 0) {
		main.draw.alpha(0.5)
		main.draw.color = "#63666a"
		main.draw.ellipse(towers[selected].x+25, towers[selected].y+25, towers[selected].radius, towers[selected].radius, true)
		main.draw.alpha(1)
	}
	for (let i in towers) towers[i].draw();
	//draw info
	main.draw.color = "#fff"
	main.draw.text(5, 45, 40, wave)
	main.draw.color = "#c2d211"
	main.draw.text(5, 75, 25, gold)
	main.draw.color = "#ff0000"
	main.draw.text(5, 100, 25, health)
}