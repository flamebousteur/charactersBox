var charactersBox = function(width = 10, height = 10) {
	this.width = width
	this.height = height
	this.characters = {
		bold:[
			"━",
			"┃",
			"┏",
			"┓",
			"┛",
			"┗",
			"┳",
			"┷",
			"┣",
			"┫",
			"╋",
		],
		light:[
			"─",
			"│",
			"┌",
			"┐",
			"┘",
			"└",
			"├",
			"┤",
			"┬",
			"┴",
			"╂",
		],
		double:[
			"═",
			"║",
			"╔",
			"╗",
			"╝",
			"╚",
			"╠",
			"╣",
			"╦",
			"╩",
			"╬",
		],
	}
	this.boxs = {}
	this.text = Array(width * height);
}

charactersBox.prototype.setpoint = function (point = [0,0], char = "X") {
	let x = Math.floor(point[0])
	let y = Math.floor(point[1])
	if (x < 0 || x > this.width || y < 0 || y > this.height) return false
	if (x + (y * this.width) <= this.text.length && x + (y * this.width) >= 0) this.text[x + (y * this.width)] = char
}

charactersBox.prototype.setline = function(point1 = [0,0], point2 = [1,1], char = "X") {
	// set point between the two points in the 2d canvas
	let x1 = Math.floor(point1[0])
	let y1 = Math.floor(point1[1])
	let x2 = Math.floor(point2[0])
	let y2 = Math.floor(point2[1])
	this.setpoint([x1,y1], char)
	this.setpoint([x2,y2], char)
	let dx = Math.abs(x2 - x1)
	let dy = Math.abs(y2 - y1)
	let sx = (x2 - x1) / dx
	let sy = (y2 - y1) / dy
	let err = dx - dy
	let e2 = 0
	let x = x1
	let y = y1
	while (true) {
		this.setpoint([x, y], char)
		e2 = 2 * err
		if (e2 > -dy) {
			err -= dy
			x += sx
		}
		if (e2 < dx) {
			err += dx
			y += sy
		}
		if (x == x2 && y == y2) break
	}
}

charactersBox.prototype.createBox = function(type = "light", x, y, width, height) {
	if (this.characters[type] == undefined) return false
	this.setline([x,y], [x+width,y], this.characters[type][0])
	this.setline([x,y+height], [x+width,y+height], this.characters[type][0])
	this.setline([x,y], [x,y+height], this.characters[type][1])
	this.setline([x+width,y], [x+width,y+height], this.characters[type][1])

	this.setpoint([x,y], this.characters[type][2])
	this.setpoint([x+width,y], this.characters[type][3])
	this.setpoint([x,y+height], this.characters[type][5])
	this.setpoint([x+width,y+height], this.characters[type][4])
}

charactersBox.prototype.getResult = function() {
	let result = ""
	for (let i = 0; i < c.height; i++) {
		for (let j = 0; j < c.width; j++) {
			let char = c.text[j + (i * c.width)]
			if (char) result += c.text[j + (i * c.width)]
			else result += " "
			let up = ""
			let down = ""
			let left = ""
			let right = ""
			if (i > 0) up = c.text[j + ((i-1) * c.width)]
			if (i < c.height - 1) down = c.text[j + ((i+1) * c.width)]
			if (j > 0) left = c.text[(j-1) + (i * c.width)]
			if (j < c.width - 1) right = c.text[(j+1) + (i * c.width)]
			let a = ["", "", "", ""]
		}
		result += "\n"
	}
	return result
}

export { charactersBox }

/* demo
let c = new charactersBox(15, 15)
c.createBox("light", 2, 2, 5, 5)
c.createBox("bold", 0, 0, 3, 3)
c.createBox("double", 6, 6, 3, 3)
console.log(c.getResult())
*/