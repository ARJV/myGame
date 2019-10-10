var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var blockSize = 20;
var widthInBlock = width / blockSize;
var heightInBlock = height / blockSize;
var directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};
var direction = "";
var player;
var box = new Box();;

$("body").keydown(function (event) {
    direction = directions[event.keyCode];
    player.move();
    console.log(direction);
});

function Block(row, col) {
    this.row = row;
    this.col = col;
}
Block.prototype.drawSquare = function (color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
    ctx.strokeRect(x, y, blockSize, blockSize);
}
Block.prototype.drawCircle = function (color) {
    var centerX = this.col * blockSize + blockSize / 2;
    var centerY = this.row * blockSize + blockSize / 2;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(centerX, centerY, blockSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
}

function Level() {
    this.levelMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 3, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]; // 1 - стена, 2 - игрок, 3 - ящик
    this.segments = [];
}
Level.prototype.createLevel = function () {
    for (var i = 0; i < this.levelMap.length; i++) {
        for (var j = 0; j < this.levelMap[i].length; j++) {
            if (this.levelMap[i][j] === 1) {
                this.segments.unshift(new Block(i, j));
            } else if (this.levelMap[i][j] === 2) {
                player = new Player(i, j);
                player.draw();
            } else if (this.levelMap[i][j] === 3) {
                box.segments.unshift(new Block(i, j));
                box.draw();
            }
        }
    }
}
Level.prototype.draw = function () {
    for (var i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare("brown");
    }
}

function Player(row, col) {
    this.position = new Block(col, row);
}
Player.prototype.draw = function () {
    this.position.drawCircle("red");
}
Player.prototype.move = function () {
    if (direction === "right" && !this.checkCollision(this.position.col + 1, this.position.row, level)) {
        this.position.col += 1;
    } else if (direction === "down" && !this.checkCollision(this.position.col, this.position.row + 1, level)) {
        this.position.row += 1;
        console.log(this.position.equal(box.segments[2]));
    } else if (direction === "left" && !this.checkCollision(this.position.col - 1, this.position.row, level)) {
        this.position.col -= 1;
    } else if (direction === "up" && !this.checkCollision(this.position.col, this.position.row - 1, level)) {
        this.position.row -= 1;
    }

    
    ctx.clearRect(this.position.col, this.position.row, width, height);
    level.draw()
    player.draw();
    box.draw();
}
Player.prototype.checkCollision = function (nextCol, nextRow, collObj) {
    for (var i = 0; i < collObj.segments.length; i++) {
        if (nextCol === collObj.segments[i].col && nextRow === collObj.segments[i].row) {
            return i;
        }
    }
    return false;
}

function Box() {
    this.segments = [];
}
Box.prototype.draw = function () {
    for (var i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare("yellow");
    }
}

var level = new Level();
level.createLevel();
level.draw();
