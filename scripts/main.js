const
DEBUG = false;
$.mobile.loading().hide();
window.onload = mainLoad();

var gridX;
var gridY;
var grid;
var can;
var cont;
var gapTop;
var gapBottom;
var gapLeft;
var gapRight;
var parts;

var fieldHeight;
var fieldWidth;

function part(color, elementList) {
	this.elementList = elementList;
	this.color = color;
}

function element(x, y) {
	this.x = x;
	this.y = y;
}

function mainLoad() {
	gridX = 100;
	gridY = 100;
	parts = [];
	can = $("#main")[0];
	can.width = 500;
	can.height = 500;
	init();
	cont = can.getContext("2d");
	grid = createGrid();

	if (DEBUG) {
		setTestData();
	}
	drawGrid();
	breakGridDown();

	parts.forEach(function(part){
		drawPart(part);
	});
	
	// alert(grid[0][0]);
}

function setTestData() {
	// testData
	grid[1][1] = 1;
}

function init() {
	gapTop = 100;
	gapBottom = 100;
	gapLeft = 100;
	gapRight = 100;
	fieldHeight = (can.height - gapTop - gapBottom) / gridY;
	fieldWidth = (can.width - gapLeft - gapRight) / gridX;

}

function createGrid() {
	var rows = [];

	for (var i = 0; i < gridX; i++) {
		var column = [];
		for (var j = 0; j < gridY; j++) {
			column[j] = 0;
		}
		rows.push(column);
	}

	return rows;
}

function rotate(part) {
	var elements = part.elementList;
	var temp;
	for (var i = 0; i < elements.length; i++) {
		temp = elements[i].x;
		elements[i].x = elements[i].y;
		elements[i].y = temp * (-1);
	}

}

function drawGrid() {
	cont.clearRect(0, 0, can.width, can.height);

	for (var i = 0; i < gridX; i++) {
		for (var j = 0; j < gridY; j++) {
			if (grid[i][j] == 1) {
				draw(i, j, '#009900');
			}
			draw(i, j);
		}
	}
}

function drawPart(part) {
	part.elementList.forEach(function(elem) {
		draw(elem.x, elem.y, part.color)
	});
}

function draw(x, y, fill) {
	if (fill != null) {
		cont.fillStyle = fill;
		cont.fillRect(x * fieldWidth + gapLeft, y * fieldHeight + gapTop,
				1 * fieldWidth, 1 * fieldHeight);
	}
	cont.strokeRect(x * fieldWidth + gapLeft, y * fieldHeight + gapTop,
			1 * fieldWidth, 1 * fieldHeight);
};

function breakGridDown() {
	var minSize = 1;
	var maxSize = Math.floor((gridX * gridY) * 0.4);

	var tempGrid = grid;

	while (findFirstFree(tempGrid) != null) {
		var size = Math
				.floor(Math.random() * (maxSize - minSize + 1) + minSize);
		var start = findFirstFree(tempGrid);
		tempGrid[start.x][start.y] = 1
		var tempElements = [ start ];
		var curr = start;
		for (var elem = 0; elem < size; elem++) {

			// [left, right, up, down]
			var neighbours = checkNeighbours(curr, tempGrid);

			var next = chooseNext(neighbours, curr);

			if (next != null) {
				tempElements.push(next);
				tempGrid[next.x][next.y] = 1;
			} else {
				// tempElements.push(curr);
				tempGrid[curr.x][curr.y] = 1;
				break;
			}
			curr = next;

		}
		var newPart = new part(getRandomColor(), tempElements);
		parts.push(newPart);
	}
	// alert("asy");
	// //alert(parts.toString());
	//
	// var res = "parts: \n";
	// for(var i = 0; i < parts.length; i++){
	// for(var j = 0; j < parts[i].length; j++){
	// res = res +" "+ parts[i][j].x +" "+parts[i][j].y+" |";
	// }
	// res = res +"\n"
	// }
	// alert(res);
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function findFirstFree(tempGrid) {
	for (var x = 0; x < tempGrid.length; x++) {
		for (var y = 0; y < tempGrid.length; y++) {
			if (tempGrid[x][y] == 0) {
				return new element(x, y);
			}
		}
	}
}

function checkNeighbours(elem, tempGrid) {
	// [left, right, up, down]
	var res = [ true, true, true, true ];

	if (elem.x - 1 < 0 || tempGrid[elem.x - 1][elem.y] == 1)
		res[0] = false;
	if (elem.x + 1 >= gridX || tempGrid[elem.x + 1][elem.y] == 1)
		res[1] = false;
	if (elem.y - 1 < 0 || tempGrid[elem.x][elem.y - 1] == 1)
		res[2] = false;
	if (elem.y + 1 >= gridY || tempGrid[elem.x][elem.y + 1] == 1)
		res[3] = false;

	return res;
}

function chooseNext(neighbours, curr) {
	var options = [];
	for (var i = 0; i < neighbours.length; i++) {
		if (neighbours[i])
			options.push(i);
	}

	var res;

	var rand = Math.floor(Math.random() * (options.length));

	var hmm = options[rand];

	switch (hmm) {
	case 0: // left
		res = new element(curr.x - 1, curr.y);
		break;
	case 1: // right
		res = new element(curr.x + 1, curr.y);
		break;
	case 2: // up
		res = new element(curr.x, curr.y - 1);
		break;
	case 3: // down
		res = new element(curr.x, curr.y + 1);
		break;
	}

	return res;
}
