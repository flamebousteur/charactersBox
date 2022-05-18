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
			"┬",
			"┴",
			"├",
			"┤",
			"╂",
		],
		double:[
			"═",
			"║",
			"╔",
			"╗",
			"╝",
			"╚",
			"╦",
			"╩",
			"╠",
			"╣",
			"╬",
		],
	}
	this.connectionChars = {
		double:{
			orisonal:[
				"╒",
				"╕",
				"╛",
				"╘",
				"╤",
				"╧",
				"╟",
				"╢",
				"╪",
			],
			vertical:[
				"╓",
				"╖",
				"╜",
				"╙",
				"╥",
				"╨",
				"╞",
				"╡",
				"╪",
			]
		},
		/* light:{
		// complete later
			orison:[
				"┑",
			]
		}*/
	}
	this.boxs = {}
	this.text = Array(width * height);
	this.texts = []
}

charactersBox.prototype.createBox = function(type = "light", x, y, width, height, text = "", content = "") {
	if (this.characters[type] == undefined) return false
	this.setline([x,y], [x+width,y], this.characters[type][0])
	this.setline([x,y+height], [x+width,y+height], this.characters[type][0])
	this.setline([x,y], [x,y+height], this.characters[type][1])
	this.setline([x+width,y], [x+width,y+height], this.characters[type][1])

	this.setpoint([x,y], this.characters[type][2])
	this.setpoint([x+width,y], this.characters[type][3])
	this.setpoint([x,y+height], this.characters[type][5])
	this.setpoint([x+width,y+height], this.characters[type][4])

	if (text != "" && width > 2) this.addString([x+1,y], text, null, width-1)
	if (text != "" && width > 2) this.addString([x+1,y+1], content, width-1, ((width-1)*(height-1)))
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

charactersBox.prototype.getCharType = function (char) {
	let result = {}
	if (this.characters.bold.includes(char)) result.type = "bold"
	if (this.characters.light.includes(char)) result.type = "light"
	if (this.characters.double.includes(char)) result.type = "double"
	if (result.type) result.mode = this.characters[result.type].indexOf(char)
	return result
}

charactersBox.prototype.getPointData = function(point = [0,0]) {
	let result = {}
	if (point[0] < 0 || point[0] > this.width || point[1] < 0 || point[1] > this.height) return false
	let x = Math.floor(point[0])
	let y = Math.floor(point[1])

	result.char = this.text[x + (y * this.width)]
	result.this = this.getCharType(result.char)
	result.up = ""
	result.down = ""
	result.left = ""
	result.right = ""
	if (y > 0) result.up = this.text[x + ((y-1) * this.width)]
	if (y < this.height - 1) result.down = this.text[x + ((y+1) * this.width)]
	if (x > 0) result.left = this.text[(x-1) + (y * this.width)]
	if (x < this.width - 1) result.right = this.text[(x+1) + (y * this.width)]
	result.around = [{}, {}, {}, {}]
	result.around[0] = this.getCharType(result.up)
	result.around[1] = this.getCharType(result.down)
	result.around[2] = this.getCharType(result.left)
	result.around[3] = this.getCharType(result.right)
	result.type = this.getCharType(result.char)
	result.connect = [false, false, false, false]
	if (result.around[0].mode != undefined){
		switch (result.around[0].mode) {
			case 0:
				result.connect[0] = false
				break;
			case 1:
				result.connect[0] = true
				break;
			case 2:
				result.connect[0] = true
				break;
			case 3:
				result.connect[0] = true
				break;
			case 4:
				result.connect[0] = false
				break;
			case 5:
				result.connect[0] = false
				break;
			case 6:
				result.connect[0] = true
				break;
			case 7:
				result.connect[0] = false
				break;
			case 8:
				result.connect[0] = true
				break;
			case 9:
				result.connect[0] = true
				break;
			case 10:
				result.connect[0] = true
				break;
			default:
				result.connect[0] = false
				break;
		}
	}
	if (result.around[1].mode != undefined){
		switch (result.around[1].mode) {
			case 0:
				result.connect[1] = false
				break;
			case 1:
				result.connect[1] = true
				break;
			case 2:
				result.connect[1] = false
				break;
			case 3:
				result.connect[1] = false
				break;
			case 4:
				result.connect[1] = true
				break;
			case 5:
				result.connect[1] = true
				break;
			case 6:
				result.connect[1] = false
				break;
			case 7:
				result.connect[1] = true
				break;
			case 8:
				result.connect[1] = true
				break;
			case 9:
				result.connect[1] = true
				break;
			case 10:
				result.connect[1] = true
				break;
			default:
				result.connect[1] = false
				break;
		}
	}
	if (result.around[2].mode != undefined){
		switch (result.around[2].mode) {
			case 0:
				result.connect[2] = true
				break;
			case 1:
				result.connect[2] = false
				break;
			case 2:
				result.connect[2] = true
				break;
			case 3:
				result.connect[2] = false
				break;
			case 4:
				result.connect[2] = false
				break;
			case 5:
				result.connect[2] = true
				break;
			case 6:
				result.connect[2] = true
				break;
			case 7:
				result.connect[2] = true
				break;
			case 8:
				result.connect[2] = true
				break;
			case 9:
				result.connect[2] = false
				break;
			case 10:
				result.connect[2] = true
				break;
			default:
				result.connect[2] = false
				break;
		}
	}
	if (result.around[3].mode != undefined){
		switch (result.around[3].mode) {
			case 0:
				result.connect[3] = true
				break;
			case 1:
				result.connect[3] = false
				break;
			case 2:
				result.connect[3] = false
				break;
			case 3:
				result.connect[3] = true
				break;
			case 4:
				result.connect[3] = true
				break;
			case 5:
				result.connect[3] = false
				break;
			case 6:
				result.connect[3] = true
				break;
			case 7:
				result.connect[3] = true
				break;
			case 8:
				result.connect[3] = false
				break;
			case 9:
				result.connect[3] = true
				break;
			case 10:
				result.connect[3] = true
				break;
			default:
				result.connect[3] = false
				break;
		}
	}
	return result
}

charactersBox.prototype.smooth = function (point = [0,0]) {
	let result = " "
	let x = Math.floor(point[0])
	let y = Math.floor(point[1])
	let data = this.getPointData([x,y])
	let mode = data.this.type
	// connect the textures
	// around = {up, down, left, right}
	/*
0	"━",
1	"┃",
2	"┏",
3	"┓",
4	"┛",
5	"┗",
6	"┳",
7	"┷",
8	"┣",
9	"┫",
10	"╋",
	*/
	if      (data.connect[0] == false && data.connect[1] == false && data.connect[2] == true  && data.connect[3] == true ){
		result = this.characters[mode][0]
	}
	else if (data.connect[0] == true  && data.connect[1] == true  && data.connect[2] == false && data.connect[3] == false){
		result = this.characters[mode][1]
	}
	else if (data.connect[0] == false && data.connect[1] == true  && data.connect[2] == false && data.connect[3] == true ){
		/*if		(data.around[1].type == "double" && (data.around[3].type == "light" || data.around[3].type == "bold")) result = this.connectionChars.double.vertical[0]
		else if (data.around[3].type == "double" && (data.around[1].type == "light" || data.around[1].type == "bold")) result = this.connectionChars.double.orisonal[0]
		else*/	result = this.characters[mode][2]
	}
	else if (data.connect[0] == false && data.connect[1] == true  && data.connect[2] == true  && data.connect[3] == false){
		/*if		(data.around[1].type == "double" && (data.around[2].type == "light" || data.around[2].type == "bold")) result = this.connectionChars.double.vertical[2]
		else if (data.around[2].type == "double" && (data.around[1].type == "light" || data.around[1].type == "bold")) result = this.connectionChars.double.orisonal[2]
		else*/	result = this.characters[mode][3]
	}
	else if (data.connect[0] == true  && data.connect[1] == false && data.connect[2] == true  && data.connect[3] == false){
		/*if		(data.around[0].type == "double" && (data.around[2].type == "light" || data.around[2].type == "bold")) result = this.connectionChars.double.vertical[3]
		else if (data.around[2].type == "double" && (data.around[0].type == "light" || data.around[0].type == "bold")) result = this.connectionChars.double.orisonal[3]
		else*/	result = this.characters[mode][4]
	}
	else if (data.connect[0] == true  && data.connect[1] == false && data.connect[2] == false && data.connect[3] == true ){
		/*if		(data.around[0].type == "double" && (data.around[3].type == "light" || data.around[3].type == "bold")) result = this.connectionChars.double.vertical[4]
		else if (data.around[3].type == "double" && (data.around[0].type == "light" || data.around[0].type == "bold")) result = this.connectionChars.double.orisonal[4]
		else*/	result = this.characters[mode][5]
	}
	else if (data.connect[0] == false && data.connect[1] == true  && data.connect[2] == true  && data.connect[3] == true ){
		/*if		(data.around[1].type == "double" && ((data.around[3].type == "light" || data.around[3].type == "bold") && (data.around[2].type == "light" || data.around[2].type == "bold"))) result = this.connectionChars.double.vertical[5]
		else if ((data.around[3].type == "double" && data.around[2].type == "double") && (data.around[1].type == "light" || data.around[1].type == "bold")) result = this.connectionChars.double.orisonal[5]
		else*/	result = this.characters[mode][6]
	}
	else if (data.connect[0] == true  && data.connect[1] == false && data.connect[2] == true  && data.connect[3] == true ){
		/*if		(data.around[0].type == "double" && ((data.around[3].type == "light" || data.around[3].type == "bold") && (data.around[2].type == "light" || data.around[2].type == "bold"))) result = this.connectionChars.double.vertical[6]
		else if ((data.around[3].type == "double" && data.around[2].type == "double") && (data.around[0].type == "light" || data.around[0].type == "bold")) result = this.connectionChars.double.orisonal[6]
		else*/	result = this.characters[mode][7]
	}
	else if (data.connect[0] == true  && data.connect[1] == true  && data.connect[2] == false && data.connect[3] == true ){
		/*if		(data.around[1].type == "double" && ((data.around[2].type == "light" || data.around[2].type == "bold") && (data.around[3].type == "light" || data.around[3].type == "bold"))) result = this.connectionChars.double.vertical[7]
		else if ((data.around[2].type == "double" && data.around[3].type == "double") && (data.around[1].type == "light" || data.around[1].type == "bold")) result = this.connectionChars.double.orisonal[7]
		else*/	result = this.characters[mode][8]
	}
	else if (data.connect[0] == true  && data.connect[1] == true  && data.connect[2] == true  && data.connect[3] == false){
		/*if		(data.around[0].type == "double" && ((data.around[2].type == "light" || data.around[2].type == "bold") && (data.around[3].type == "light" || data.around[3].type == "bold"))) result = this.connectionChars.double.vertical[8]
		else if ((data.around[2].type == "double" && data.around[3].type == "double") && (data.around[0].type == "light" || data.around[0].type == "bold")) result = this.connectionChars.double.orisonal[8]
		else*/	result = this.characters[mode][9]
	}
	else if (data.connect[0] == true  && data.connect[1] == true  && data.connect[2] == true  && data.connect[3] == true ){
		/*if	((data.around[0].type == "double" && data.around[1].type == "double") && (data.around[2].type == "light" || data.around[2].type == "bold") && (data.around[3].type == "light" || data.around[3].type == "bold")) result = this.connectionChars.double.vertical[9]
		else if ((data.around[2].type == "double" && data.around[3].type == "double") && (data.around[0].type == "light" || data.around[0].type == "bold") && (data.around[1].type == "light" || data.around[1].type == "bold")) result = this.connectionChars.double.orisonal[9]
		else*/	result = this.characters[mode][10]
	}
	else result = data.char
	return result
}

charactersBox.prototype.setChar = function (point = [0,0], char = " ") {
	if (char.length) return false
	let x = Math.floor(point[0])
	let y = Math.floor(point[1])
	this.text[x + y * this.width] = char
}

charactersBox.prototype.setString = function (point = [0,0], string = " ", maxWidth = 1) {
	let x = Math.floor(point[0])
	let y = Math.floor(point[1])
	let w = 0
	for (let i = 0; i < string.length; i++) {
		this.setChar([x + w, y], string[i])
		w++
		if (w >= maxWidth) {
			w = 0
			y++
		}
	}
}

charactersBox.prototype.stringPos = function (point = [0,0], string = " ", maxWidth = 1, maxLength = 0) {
	let result = []
	let x = Math.floor(point[0])
	let y = Math.floor(point[1])
	let w = 0
	maxLength--
	for (let i = 0; i < string.length; i++) {
		result.push([[x + w, y], string[i]])
		w++
		if (w >= maxWidth) {
			w = 0
			y++
		}
		if (i >= maxLength) break;
	}
	return result
}

charactersBox.prototype.addString = function (point = [0,0], string = " ", maxWidth = null, maxLength = null) {
	if (maxWidth == null) maxWidth = string.length
	this.texts.push([point, string, maxWidth, maxLength])
}

charactersBox.prototype.getResult = function() {
	let result = []
	for (let i = 0; i < this.height; i++) {
		for (let j = 0; j < this.width; j++) {
			let char = this.text[j + (i * this.width)]
			if (char) result.push(this.smooth([j,i]))
			else result.push(" ")
		}
		result.push("\n")
	}
	for (let i = 0; i < this.texts.length; i++) {
		let n = 0
		let t = this.stringPos(this.texts[i][0], this.texts[i][1], this.texts[i][2], this.texts[i][3])
		for (let j = 0; j < t.length; j++) {
			if (result[t[j][0][0] + t[j][0][1] * (this.width + 1) + n] == "\n") n++
				result[t[j][0][0] + t[j][0][1] * (this.width + 1) + n] = t[j][1]
		}
	}
	return result.join("")
}

module.exports = charactersBox