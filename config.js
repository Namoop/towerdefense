const ISIZE	= 44;
const IHALF	= 22;
const TSIZE	= 40;
const THALF	= 20;
const PSIZE	= 50;
const PHALF	= 25;

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
};

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
		price:	450,
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
};

const dotTypes = [ , {
		color:	"red",	
		speed:	1,
		health:	1,
		onDeath: [0],
		immune: [],
		value: 1,
	}, {
		color:	"blue",
		speed:	1.4,
		health:	2,
		onDeath: [1],
		immune: [],
		value: 8,
	}, {
		color:	"green",
		speed:	1.8,
		health:	3,
		onDeath: [2],
		immune: [],
		value: 15,
	}, {
		color:	"yellow",
		speed:	3.2,
		health: 4,
		onDeath: [3],
		immune: [],
		value: 27,
	}, {
		color:	"pink",
		speed:	3.5,
		health: 5,
		onDeath: [4],
		immune: [],
		value: 40,
	}, {
		color:	"black",
		speed:	3.5,
		health: 11,
		onDeath: [5, 5],
		immune: ["explosion"],
		value: 60,
	}, {
		color:	"white",
		speed:	3.5,
		health: 11,
		onDeath: [5, 5],
		immune: ["freeze"],
		value: 60,
	},
];

const bulletTypes = {
	fast: {
		color: "white",
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
		range:	150,
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
		spread:	0.5,
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
		spread:	0.5,
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
		range:	100,
		speed:	2,
		power:	5,
		piercing: 1,
		size:	10,
		spread:	1,
		cooldown: 120,
		attributes: [],
	},
};

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