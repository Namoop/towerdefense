const ISIZE	= 44;
const PSIZE	= 50;
const TSIZE	= 40;
const IHALF	= ISIZE/2;
const THALF	= TSIZE/2;
const PHALF	= PSIZE/2;

/*
const upgrades = {
	// bullet local copy editing
	gunner:	[	
			[100, [["burst", 5]], "+3 Burst"],
			[300, [["nshot", 3]], "+2 Bullets"],
		],
	wizard:	[
			[500, [["delay", 25]], "+ Firerate"],
			[1000, [["nshot", 3]], "+2 Missiles"],
		],
	drones: [
			[1000, [["sub", "normalBuffed"]], "+ Damage"],
			[2000, [["nshot", 4]], "+2 Drones"],
		],
	cannon: [
			[500, [["bullet", "cannonBuffed"]], "+ Damage"],
			[500, [["delay", 75]], "+ Firerate"],
		],
	speedy: [
			[2000, [["nshot", 2]], "+1 Bullet"],
			[4000, [["delay", 4]], "+ Firerate"],
		],
};*/

class Gunner extends Tower {
	constructor (x, y) {
		super(x,y)
		this.delay = 50;
		this.radius = 120;
		this.bullet = {
			burst: 3,
			color: "white",
			range:	200,
			speed:	25,
			power:	1,
			piercing: 1,
			size:	2,
			spread:	0.2,
			attributes: [],
		};
	}
	static color = "blue";
	//static src = "images/towers/gunner_00.png";
	//static nshot = 1;
	static price = 300;
	static upgrades = [ //also have option for art to change, and exclusive paths (you can only pick one)
		[ { //LEFT PATH
			tagline: "+3 Burst",
			properties: ["burst",],
			newValues: [5,],
			price: 100,
		}, {
			tagline: "+5 Burst",
			properties: ["burst",],
			newValues: [10,],
			price: 300,
		}, ],
		[ { //RIGHT PATH
			tagline: "+3 Shots",
			properties: ["nshot",],
			newValues: [5,],
			price: 300,
		}, {
			tagline: "+5 Shots",
			properties: ["nshot",],
			newValues: [10,],
			price: 550,
		}, ]
	]
}

class Cannoneer extends Tower {
	constructor (x, y) {
		super(x,y)
		this.delay = 200;
		this.radius = 165;
		this.inner = 75;
		this.bullet = {
			burst: 1,
			color: "black",
			range:	250,
			speed:	40,
			power:	10,
			size:	7,
			spread:	0,
			attributes: ["impact"],
		};
	}
	static color = "red";
	//static src = "images/towers/cannon_00.png";
	//static nshot = 1;
	static price = 750;
	static upgrades = [ //also have option for art to change, and exclusive paths (you can only pick one)
		[ { //LEFT PATH
			tagline: "More Damage",
			properties: ["burst",],
			newValues: [5,],
			price: 100,
		}, {
			tagline: "+5 Burst",
			properties: ["burst",],
			newValues: [10,],
			price: 300,
		}, ],
		[ { //RIGHT PATH
			tagline: "Firerate +++",
			properties: ["nshot",],
			newValues: [5,],
			price: 300,
		}, {
			tagline: "+5 Shots",
			properties: ["nshot",],
			newValues: [10,],
			price: 550,
		}, ]
	]
}

class Wizard extends Tower {
	constructor (x, y) {
		super(x,y)
		this.delay = 40;
		this.radius = 170;
		this.bullet = {
			burst: 1,
			color: "aqua",
			range:	250,
			speed:	15,
			power:	2,
			size:	3,
			spread:	0,
			attributes: ["impact", "plasma", "target"],
		};
	}
	static color = "aqua";
	//static src = "images/towers/wizard_00.png";
	//static nshot = 1;
	static price = 800;
	static upgrades = [ //also have option for art to change, and exclusive paths (you can only pick one)
		[ { //LEFT PATH
			tagline: "More Damage",
			properties: ["burst",],
			newValues: [5,],
			price: 100,
		}, {
			tagline: "+5 Burst",
			properties: ["burst",],
			newValues: [10,],
			price: 300,
		}, ],
		[ { //RIGHT PATH
			tagline: "Firerate +++",
			properties: ["nshot",],
			newValues: [5,],
			price: 300,
		}, {
			tagline: "+5 Shots",
			properties: ["nshot",],
			newValues: [10,],
			price: 550,
		}, ]
	]
}

class Speedy extends Tower {
	constructor (x, y) {
		super(x,y)
		this.delay = 7;
		this.radius = 75;
		this.bullet = {
			burst: 1,
			color: "orange",
			range:	100,
			speed:	50,
			power:	1,
			piercing: 1,
			size:	1,
			spread:	0.75,
			attributes: [],
		};
	}
	static color = "pink";
	//static src = "images/towers/speedy_00.png";
	//static nshot = 1;
	static price = 3000;
	static upgrades = [ //also have option for art to change, and exclusive paths (you can only pick one)
		[ { //LEFT PATH
			tagline: "+3 Burst",
			properties: ["burst",],
			newValues: [5,],
			price: 100,
		}, {
			tagline: "+5 Burst",
			properties: ["burst",],
			newValues: [10,],
			price: 300,
		}, ],
		[ { //RIGHT PATH
			tagline: "+3 Shots",
			properties: ["nshot",],
			newValues: [5,],
			price: 300,
		}, {
			tagline: "+5 Shots",
			properties: ["nshot",],
			newValues: [10,],
			price: 550,
		}, ]
	]
}

class Gunner extends Tower {
	constructor (x, y) {
		super(x,y)
		this.delay = 350;
		this.radius = 150;
		this.bullet = {
			burst: 1,
			color: "white",
			range:	200,
			speed:	2,
			power:	5,
			piercing: 1,
			size:	10,
			spread:	1,
			attributes: [],
		};
	}
	static color = "yellow";
	//static src = "images/towers/gunner_00.png";
	//static nshot = 1;
	static price = 1000;
	static upgrades = [ //also have option for art to change, and exclusive paths (you can only pick one)
		[ { //LEFT PATH
			tagline: "+3 Burst",
			properties: ["burst",],
			newValues: [5,],
			price: 100,
		}, {
			tagline: "+5 Burst",
			properties: ["burst",],
			newValues: [10,],
			price: 300,
		}, ],
		[ { //RIGHT PATH
			tagline: "+3 Shots",
			properties: ["nshot",],
			newValues: [5,],
			price: 300,
		}, {
			tagline: "+5 Shots",
			properties: ["nshot",],
			newValues: [10,],
			price: 550,
		}, ]
	]
}

/*
const towerTypes = {
	gunner: {
		color:	"blue",
		radius:	150,
		delay:	100,
		bullet:	"normal",
		burst:	3,
		burstd:	0,
		nshot:	1,
		price:	300,
		constant: false,
	},
	cannon: {
		color:	"red",
		radius:	150,
		inner:	75,
		delay:	100,
		bullet:	"cannon",
		burst:	0,
		burstd:	0,
		nshot:	1,
		price:	1000,
		constant: false,
	},
	wizard: {
		color:	"aqua",
		radius:	175,
		delay:	40,
		bullet:	"magic",
		burst:	0,
		burstd:	0,
		nshot:	1,
		price:	800,
		constant: false,
	},
	speedy: {
		color: "pink",
		radius:	75,
		delay:	7,
		bullet:	"fast",
		burst:	0,
		burstd:	0,
		nshot:	1,
		price:	3000,
		constant: false,
	},
	drones: {
		color:	"yellow",
		radius:	50,
		delay:	350,
		bullet:	"drone",
		burst:	0,
		burstd:	0,
		nshot:	2,
		price:	1000,
		constant: true,
	},
};*/


class Red extends Dot {
	constructor (path, distance)
	{super(path,distance, /*health*/ 1)}
	static value = 3;
	static immune = [];
	static onDeath = undefined;
	static speed = 1;
	static color = "red";
}
class Blue extends Dot {
	constructor (path, distance)
	{super(path,distance, /*health*/ 2)}
	static value = 8;
	static immune = [];
	static onDeath = [1];
	static speed = 1.4;
	static color = "blue";
}
class Green extends Dot {
	constructor (path, distance)
	{super(path,distance, /*health*/ 3)}
	static value = 15;
	static immune = [];
	static onDeath = [2];
	static speed = 1.8;
	static color = "green";
}
class Yellow extends Dot {
	constructor (path, distance)
	{super(path,distance, /*health*/ 4)}
	static value = 27;
	static immune = [];
	static onDeath = [3];
	static speed = 3.2;
	static color = "yellow";
}
class Pink extends Dot {
	constructor (path, distance)
	{super(path,distance, /*health*/ 5)}
	static value = 40;
	static immune = [];
	static onDeath = [4];
	static speed = 3.5;
	static color = "pink";
}
class Black extends Dot {
	constructor (path, distance)
	{super(path,distance, /*health*/ 11)}
	static value = 70;
	static immune = ["explosion"];
	static onDeath = [5,5];
	static speed = 3.5;
	static color = "black";
}
class White extends Dot {
	constructor (path, distance)
	{super(path,distance, /*health*/ 11)}
	static value = 70;
	static immune = ["freeze"];
	static onDeath = [5,5];
	static speed = 3.5;
	static color = "white";
}

//have towers own bullet property when classifying them
/*
const bulletTypes = {
	fast: {
		color: "orange",
		bclass:	"normal",
		range:	100,
		speed:	50,
		power:	1,
		piercing: 1,
		size:	1,
		spread:	0.75,
		cooldown: 0,
		attributes: [],
	},
	normal: {
		color: "white",
		bclass:	"normal",
		range:	350,
		speed:	20,
		power:	0.5,
		piercing: 1,
		size:	2,
		spread:	0.2,
		cooldown: 0,
		attributes: [],
	},
	normalBuffed: {
		color: "white",
		bclass:	"normal",
		range:	150,
		speed:	20,
		power:	1.2,
		piercing: 1,
		size:	2,
		spread:	0.2,
		cooldown: 0,
		attributes: [],
	},
	cannon: {
		color: "black",
		bclass:	"normal",
		range:	200,
		speed:	90,
		power:	10,
		size:	7,
		spread:	0,
		cooldown: 0,
		attributes: ["impact"],
	},
	cannonBuffed: {
		color: "black",
		bclass:	"normal",
		range:	200,
		speed:	90,
		power:	15,
		size:	7,
		spread:	0,
		cooldown: 0,
		attributes: ["impact"],
	},
	magic: {
		color: "aqua",
		bclass:	"magic",
		range:	250,
		speed:	15,
		power:	2,
		size:	3,
		spread:	0,
		cooldown: 0,
		attributes: ["plasma", "impact"],
	},
	drone: {
		color: "white",
		bclass:	"drone",
		range:	200,
		speed:	2,
		power:	5,
		piercing: 1,
		size:	10,
		spread:	1,
		cooldown: 120,
		attributes: [],
	},
};*/

const newDot = (type, path, distance) => new [,Red, Blue, Green, Yellow, Pink, Black, White][type](path, distance)
let activeTowers = {"gunner":Gunner,"cannon":Cannoneer,"wizard":Wizard,"speedy":Speedy,}
const newTower = (type, x, y) => new activeTowers[type](x, y)


const maps = {
	dotlane: {
		background: "darkgreen",
		pathcolor: "#664228",
		path0: [[-20, 150], [150, 150], [150, 300], [300,300], [300,200], [450,200], [450,350], [550,350], [550,50], [225,50], [225,10]],
		decor: [],
	},
	dotmines: {
		background: "#54452e",
		pathcolor: "#898b89",
		path0: [[-20, 100], [150, 100], [150, 200], [550,200], [550,75], [350,75], [350,425]],
		path1: [[-20, 100], [150, 100], [150, 200], [50,200], [50,350], [250,350], [250, 200], [50, 200], [50,350], [250,350], [250, 10]],
		decor: [
			new Shape({x: 110,y: 160, shape: "rect", param: [80, 80, true], color: "#535453"}),
			new Shape({x: 110,y: 310, shape: "rect", param: [80, 80, true], color: "#535453"}),
			new Shape({x: 410,y: 160, shape: "rect", param: [80, 80, true], color: "#535453"}),
		],
	}
}

const waves = {
	dotlane: [
		["1111111111"],
		["1111100222"],
		["1111110002222222"],
		["11110000111000333002222"],
		["33333322200022211003322211123"],
		["33333322200022211003322211123"],
		["333333333333333333333333333333"],
		["012340000012340000444433344444"],
		["222233344444444444433333333300033334444444"],
	],
	dotmines: [
		["330033", "00330033"],
	],
};