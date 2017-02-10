const
DEBUG = true;
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
var parts = new Array;

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
	gridX = 7;
	gridY = 7;
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

function drawGrid() {
	cont.clearRect(0, 0, can.width, can.height);

	for (var i = 0; i < gridX; i++) {
		for (var j = 0; j < gridY; j++) {
			if (grid[i][j] == 1) {
				cont.fillStyle = '#009900';
				cont.fillRect(i * fieldWidth + gapLeft, j * fieldHeight
						+ gapTop, 1 * fieldWidth, 1 * fieldHeight);
			}
			cont.strokeRect(i * fieldWidth + gapLeft, j * fieldHeight + gapTop,
					1 * fieldWidth, 1 * fieldHeight);
		}
	}
}

function breakGridDown() {
	var minSize = 2;
	var maxSize = Math.floor((gridX * gridY) * 0.4);

	var tempGrid = grid;

	var size = Math.floor(Math.random() * (maxSize - minSize + 1) + minSize);

	var start = findFirstFree(tempGrid);
	var tempElements = [ start ];
	var curr = start;
	for (var elem = 0; elem < size; elem++) {

		// [left, right, up, down]
		var neighbours = checkNeighbours(curr, tempGrid);

		var next = chooseNext(neighbours, curr);
		alert(next);
		if (next != null) {
			tempElements.push(next);
			alert("norNull");
			tempGrid[next.x][next.y] = 1;
		}
		curr = next;

	}
	alert("end");
	alert(tempElements[0].x);
}

function findFirstFree(grid) {
	for (var x = 0; x < grid.length; x++) {
		for (var y = 0; y < grid[0].length; y++) {
			if (grid[x][y] == 0) {
				return new element(x, y);
			}
		}
	}
}

function checkNeighbours(element, tempGrid) {
	// [left, right, up, down]
	var res = [ true, true, true, true ];
	if (element.x - 1 < 0 || tempGrid[element.x - 1][element.y] == 1)
		res[0] = false;
	if (element.x + 1 > gridX || tempGrid[element.x + 1][element.y] == 1)
		res[1] = false;
	if (element.y - 1 < 0 || tempGrid[element.x][element.y - 1] == 1)
		res[2] = false;
	if (element.y + 1 > gridY || tempGrid[element.x][element.y + 1] == 1)
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
//	alert("rand1");
//	alert(options.length);
//	alert(rand);
//	alert(hmm);
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
