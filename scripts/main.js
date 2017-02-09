const DEBUG = true;
$.mobile.loading().hide();
window.onload = mainLoad();


var gridX;
var gridY;
var grid;
var cont;


var fieldHeight;
var fieldWidth;

function gridField(x, y, empty) {
	this.x = x;
	this.y = y;
	this.empty = empty;
}

function mainLoad() {
	gridX = 5;
	gridY = 5;
	can = $("#main")[0];
	can.width = 500;
	can.height = 500;
	init();
	cont = can.getContext("2d");
	grid = createGrid();

	if(DEBUG){
		setTestData();
	}
	drawGrid();
	// alert(grid[0][0]);
}

function setTestData(){
	//testData
	grid[2][4] = 1;
}

function init() {
	fieldHeight = can.height / gridY;
	fieldWidth = can.width / gridX;
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
				cont.fillRect(i * fieldWidth, j * fieldHeight - 1,
						1 * fieldWidth, 1 * fieldHeight);
			}
			cont.strokeRect(i * fieldWidth, j * fieldHeight - 1,
					1 * fieldWidth, 1 * fieldHeight);
		}
	}
}
