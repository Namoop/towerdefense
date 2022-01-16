const TSIZE	= 40;
const THALF	= 20;
const PSIZE	= 50;
const PHALF	= 25;

/* maybe some rectangle menu element abstraction stuff */
/*const menu = {

};*/

const towerTypes = {
	gunner: {
		color:	"blue",
		radius:	100,
		delay:	100,
		bullet:	"normal",
		burst:	3,
		burstd:	0,
		nshot:	1,
		price:	300,
	},
	cannon: {
		color:	"red",
		radius:	75,
		delay:	100,
		bullet:	"cannon",
		burst:	2,
		burstd:	0,
		nshot:	2,
		price:	750,
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
		price:	400,
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
		price:	500,
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
	}, {
		color:	"blue",
		link:	1,
		speed:	1,
		health:	2,
	}, {
		color:	"green",
		link:	2,
		speed:	2,
		health:	4,
	}, {
		color:	"yellow",
		link:	3,
		speed:	3,
	},
];

const bulletTypes = {
	fast: {
		range:	100,
		speed:	50,
		power:	1,
		size:	1,
		spread:	0.75,
		cooldown: 0,
	},
	normal: {
		range:	150,
		speed:	20,
		power:	1,
		size:	2,
		spread:	0.2,
		cooldown: 0,
	},
	cannon: {
		range:	100,
		speed:	10,
		power:	2,
		size:	5,
		spread:	0.5,
		cooldown: 0,
	},
	magic: {
		range:	250,
		speed:	15,
		power:	2,
		size:	3,
		spread:	0,
		cooldown: 0,
	},
	drone: {
		range:	100,
		speed:	2,
		power:	5,
		size:	10,
		spread:	1,
		cooldown: 120,
	}
};

const waves = {
	dotlane: [
		"1111111111",
		"1111100222",
		"1111110002222222",
		"11110000111000333002222",
		"33333322200022211003322211123",
		"33333322200022211003322211123",
		"333333333333333333333333333333",
	],
};