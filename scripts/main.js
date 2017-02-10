const DEBUG = true;
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


var fieldHeight;
var fieldWidth;

function gridField(x, y, empty) {
	this.x = x;
	this.y = y;
	this.empty = empty;
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

	if(DEBUG){
		setTestData();
	}
	drawGrid();
	breakGridDown();
	// alert(grid[0][0]);
}

function setTestData(){
	//testData
	grid[1][1] = 1;
}

function init() {
	gapTop = 100;
	gapBottom = 100;
	gapLeft = 100;
	gapRight= 100;
	fieldHeight = (can.height - gapTop -gapBottom) / gridY;
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
				cont.fillRect(i * fieldWidth  + gapLeft, j * fieldHeight  + gapTop,
						1 * fieldWidth, 1 * fieldHeight);
			}
			cont.strokeRect(i * fieldWidth + gapLeft, j * fieldHeight + gapTop ,
					1 * fieldWidth, 1 * fieldHeight);
		}
	}
}

function breakGridDown(){
	var minSize = 2;
	var maxSize = Math.floor((gridX * gridY) * 0.4);
	
	var tempGrid = grid;
	
	var size = Math.floor(Math.random() * (maxSize - minSize + 1 ) + minSize);
	
	for(var elem = 0; elem < size; elem++){
		
	}
}






