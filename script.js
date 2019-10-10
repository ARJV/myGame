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
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 0, 3, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
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
    this.position = new Block(row, col);
}
Player.prototype.draw = function () {
    this.position.drawCircle("red");
}
Player.prototype.move = function () {
    var newPosition = this.calcNewPosition();
    var collWall = this.checkCollision(newPosition, level);
    var collBox = this.checkCollision(newPosition, box);
    if (collBox || collWall) {
        if (collBox && box.move(collBox)) {
            this.position.row = newPosition.row;
            this.position.col = newPosition.col;
        }
    } else {
        this.position.row = newPosition.row;
        this.position.col = newPosition.col;
    }

    ctx.clearRect(this.position.col, this.position.row, width, height);
    level.draw()
    player.draw();
    box.draw();
}
Player.prototype.checkCollision = function (newPos, collObj) {
    for (var i = 0; i < collObj.segments.length; i++) {
        if (newPos.col === collObj.segments[i].col && newPos.row === collObj.segments[i].row) {
            return collObj.segments[i];
        }
    }
    return false;
}
Player.prototype.calcNewPosition = function () {
    if (direction === "right") {
        return {
            row: this.position.row,
            col: this.position.col + 1
        };
    } else if (direction === "down") {
        return {
            row: this.position.row + 1,
            col: this.position.col
        };
    } else if (direction === "left") {
        return {
            row: this.position.row,
            col: this.position.col - 1
        };
    } else if (direction === "up") {
        return {
            row: this.position.row - 1,
            col: this.position.col
        };
    }
}

function Box() {
    this.segments = [];
}
Box.prototype.draw = function () {
    for (var i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare("yellow");
    }
}
Box.prototype.move = function (collBox, newPosition) {
    var newPosBox = this.calcNewPosition(collBox);
    if (!this.checkCollisionWall(newPosBox) && !this.checkCollisionBox(newPosBox)) {
        collBox.row = newPosBox.row;
        collBox.col = newPosBox.col;
        return true;
    }
    return false;
}
Box.prototype.calcNewPosition = function (collBox) {
    if (direction === "right") {
        return {
            row: collBox.row,
            col: collBox.col + 1
        };
    } else if (direction === "down") {
        return {
            row: collBox.row + 1,
            col: collBox.col
        };
    } else if (direction === "left") {
        return {
            row: collBox.row,
            col: collBox.col - 1
        };
    } else if (direction === "up") {
        return {
            row: collBox.row - 1,
            col: collBox.col
        };
    }
}
Box.prototype.checkCollisionWall = function (newPos) {
    for (var i = 0; i < level.segments.length; i++) {
        if (newPos.col === level.segments[i].col && newPos.row === level.segments[i].row) {
            return true;
        }
    }
    return false;
}
Box.prototype.checkCollisionBox = function (newPos) {
    for (var i = 0; i < box.segments.length; i++) {
        if (newPos.col === box.segments[i].col && newPos.row === box.segments[i].row) {
            return true;
        }
    }
    return false;
}

var level = new Level();
level.createLevel();
level.draw();