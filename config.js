const towerTypes = ["blue", "cyan", "red", "pink"];

const bulletTypes = {
		fast: {
			range: 3,
			speed: 2,
			power: 1,
		},
		normal: {
			range: 200,
			speed: 35,
			power: 2,
		}
	}

//[ [amount, type], waittime, [amount, type]]
//001111110002200055300600333
const waves = {
	dotlane: [
		"1111111111", //wave1
		"1111100222", //wave2
		"1111110002222222",
		"11110000111000333002222"
	]
}