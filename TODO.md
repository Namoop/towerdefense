# Bugs
- cannon targets inside of "inner" zone


# Future Features
- reimplement "types" as classes (use extends, statics, etc)
- prevent placing of towers on the path
- add other maps
- add more towers
- fix touching as dragging

```js
class Gunner extends Tower {
	constructor (x, y) {
		super(x,y)
		this.delay = 50;
		this.radius = 150;
		this.bullet = {
			burst: 3,
			color: "white",
			bclass:	"normal",
			range:	250,
			speed:	25,
			power:	1,
			piercing: 1,
			size:	2,
			spread:	0.2,
			cooldown: 0,
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
			property: "burst",
			newValue: 5,
			price: 100,
		}, {
			tagline: "+5 Burst",
			property: "burst",
			newValue: 10,
			price: 300,
		}, ],
		[ { //RIGHT PATH
			tagline: "+3 Shots",
			property: "nshot",
			newValue: 5,
			price: 300,
		}, {
			tagline: "+5 Shots",
			property: "nshot",
			newValue: 10,
			price: 550,
		}, ]
	]
}
```

end of code