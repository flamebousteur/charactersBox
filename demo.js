const charactersBox = require('./charactersBox.js');

let c = new charactersBox(10, 10)
c.createBox("light", 2, 2, 5, 5, "erdefrgvdfrgvsd", "hello world")
c.createBox("bold", 0, 0, 3, 3, 'yo')
c.createBox("double", 6, 6, 3, 3, "test")
console.log(c.getResult())