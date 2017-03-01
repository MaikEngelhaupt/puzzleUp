const
DEBUG = false;
DRAW_ME_LIKE_ONE_OF_YOUR_FRENCH_GIRLS = false; // Yeah, if true the grid will
												// be filled with the puzzles, u
												// know for enhancing snipping
												// algorithms
$.mobile.loading().hide();
window.onload = mainLoad();

var gridX;
var gridY;
var gridWidth;
var gridHeight;
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

var ratioHeighWidthElement;

var slots;
var slotsElementSize;

function part(color, elementList, x, y, partDimensions, slot, offset) {
	this.elementList = elementList;
	this.color = color;
	this.x = x;
	this.y = y;
	this.partDimensions = partDimensions; // [0] width; [1] height
	this.offset = offset;
	this.slot = slot;
	this.zoom;
	this.moving = false;

	this.setPos = function(x, y, zoom) {
		// TODO: Draw not only is slot nul
		this.x = x;
		this.y = y;

		if (zoom != null) {
			this.zoom = zoom;
		}

		update();

	}

	this.addElement = function(ele) {
		this.elementList.push(ele);
	}

}

function clickHandler() {

}

function element(x, y) {
	this.x = x;
	this.y = y;

}

function slot(x, y, sizeX, sizeY, part) {
	this.x = x;
	this.y = y;
	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.part = part;
}


function mouseHandler(event){
//	alert("bla");
	var mouseX = event.pageX;
	var mouseY = event.pageY;
	
	var tempX = mouseX - ((selectedPart.partDimensions[0] * selectedPart.zoom)/2);
	var tempY = mouseY - ((selectedPart.partDimensions[1] * selectedPart.zoom)/2);

	selectedPart.setPos(tempX, tempY, getZoom(mouseX,mouseY));
}

var selectedPart;

function mainLoad() {
	gridX = 7;
	gridY = 7;
	parts = [];
	slots = [];
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

	if (!DRAW_ME_LIKE_ONE_OF_YOUR_FRENCH_GIRLS) {
		createSlots();
		// slots.forEach(function(elem){
		// // alert(elem.x + " "+ elem.y+" "+elem.sizeX);
		// drawSlots(elem.x, elem.y, elem.sizeX);
		// });
		getSlotElementSize();
		alert(slotsElementSize);
	}

	parts.forEach(function(part) {
		drawPart(part);
	});

	can.addEventListener('click', function(event) {
		can.removeEventListener("mousemove", mouseHandler);
		var elemLeft = can.offsetLeft;
		var elemTop = can.offsetTop;
		var x = event.pageX - elemLeft;
		var y = event.pageY - elemTop;

		var found = false;
		// Collision detection between clicked offset and element.
		parts.forEach(function(part) {
//			rotate(part);
			part.moving = false;
			if (found) {
				return;
			}
			var jo = (part.y + part.partDimensions[0] * part.zoom);
			// alert(part.partDimensions[1] + " " + part.partDimensions[0]);
			if (y > part.y && y < part.y + (part.partDimensions[1] * part.zoom)
					&& x > part.x
					&& x < part.x + (part.partDimensions[0] * part.zoom)) {
				part.elementList.forEach(function(element) {
					if (y > slots[part.slot].y + element.y * slotsElementSize
							&& y < slots[part.slot].y + element.y
									* slotsElementSize + slotsElementSize
							&& x > slots[part.slot].x + element.x
									* slotsElementSize
							&& x < slots[part.slot].x + element.x
									* slotsElementSize + slotsElementSize) {

						// add drag'n drop here
						// alert("found! " + part.slot);

						part.moving = true;
						selectedPart = part;
						can.addEventListener('mousemove',mouseHandler);

						// part.setPos(2, 2);

						found = true;
					}
				})
			}
		});
		update();
	}, false);

	// alert(grid[0][0]);
}



function getZoom(x, y){
//	alert(x + " " + y + " "+ gridHeight +" "+gridY);
	if(x >= gapLeft && x <= gapLeft + gridWidth && y >= gapTop && y <= gapTop + gridHeight)
		return fieldHeight;
	else
		return slotsElementSize;
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
	gridWidth = can.width - gapLeft - gapRight;
	gridHeight = can.height - gapTop - gapBottom;
	fieldHeight = gridHeight / gridY;
	fieldWidth = gridWidth / gridX;
	ratioHeighWidthElement = can.height / can.width;

}

function createSlots() {
	var slotsSideHeight = can.height - gapTop - gapBottom;
	var slotsSideWidth = gapLeft;
	var slotsBottomWidth = can.width;
	var slotsBottomHeight = gapBottom;
	var slotsLeft;
	var slotsRight;
	var slotsBottom;
	var slotsBottomStart = 0;

	if (parts.length < 12) {
		slotsBottomWidth = can.width - gapLeft - gapRight;
		slotsLeft = slotsRight = 3;

	} else {
		var useableSpace = slotsSideHeight * 2 + slotsBottomWidth;
		var factor = parts.length / useableSpace;
		slotsLeft = slotsRight = Math.floor(factor * slotsSideHeight);
	}
	slotsBottom = parts.length - slotsLeft - slotsRight;

	// alert(slotsLeft + " " +slotsRight + " " +slotsBottom + " "
	// +parts.length);

	var slotSizeLeftHeight = calcSlotSize(slotsSideHeight, slotsLeft);
	var slotSizeLeft = slotSizeLeftHeight > gapLeft ? gapLeft
			: slotSizeLeftHeight;
	setSlots(slotsLeft, gapLeft / 2 - slotSizeLeft / 2, gapTop, 0, 1,
			slotSizeLeft);

	var slotSizeRightHeight = calcSlotSize(slotsSideHeight, slotsRight);
	var slotSizeRight = slotSizeRightHeight > gapRight ? gapRight
			: slotSizeRightHeight;
	setSlots(slotsRight, can.width - slotsSideWidth / 2 - slotSizeRight / 2,
			gapTop, 0, 1, slotSizeRight);

	var slotSizeBottom = slotsBottom <= 3 ? gapBottom : calcSlotSize(
			slotsBottomWidth, slotsBottom);
	var slotsBottomStart = slotsBottom <= 3 ? gapLeft
			+ ((3 - slotsBottom) * slotSizeBottom) / 2
			: parts.length < 12 ? gapLeft : 0;
	setSlots(slotsBottom, slotsBottomStart, can.height - slotsBottomHeight / 2
			- slotSizeBottom / 2, 1, 0, slotSizeBottom);
}

function calcSlotSize(slotsSize, slotCount) {
	// alert(slotsSize+" "+ slotCount);
	return Math.floor(slotsSize / slotCount);

}

function setSlots(slotsCount, x, y, changeX, changeY, size) {
	for (var i = 0; i < slotsCount; i++) {
		var slotX = (x + (i * changeX * size));
		var slotY = (y + (i * changeY * size));
		slots.push(new slot(slotX, slotY, size, size));
	}

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
	temp = part.partDimensions[0];
	part.partDimensions[0] = part.partDimensions[1];
	part.partDimensions[1] = temp;

}

function drawGrid() {
	cont.clearRect(0, 0, can.width, can.height);

	for (var i = 0; i < gridX; i++) {
		for (var j = 0; j < gridY; j++) {
//			if (grid[i][j] == 1) {
//				// drawOnField(i, j, '#009900');
//				drawOnFixedSpot(i, j, fieldWidth, '#009900');
//			}
			drawOnFixedSpot(i, j, fieldWidth);
		}
	}
}

// TODO: Draw not only is slot null
function drawPart(part) {
	if (part.slot == null) {
		part.elementList.forEach(function(elem) {
			// drawOnField(part.x + elem.x, part.y + elem.y, part.color);
			// drawOnFixedSpot(part.x + elem.x, part.y + elem.y, fieldWidth,
			// part.color);
			var newX = (part.x + elem.x);
			var newY = (part.y + elem.y);
			draw(newX, newY, part.zoom, part.color);
		});
	} else {
		drawPartInSlot(slots[part.slot], part);
	}
}

function drawSlots(x, y, size) {
	cont.strokeRect(x, y, size, size);
}

function getSlotElementSize() {
	parts.forEach(function(elem) {

		partWidth = slots[elem.slot].sizeX / (elem.partDimensions[0] + 1);
		partHeight = slots[elem.slot].sizeY / (elem.partDimensions[1] + 1);

		currSmallest = partWidth > partHeight ? partHeight : partWidth;
		slotsElementSize = slotsElementSize == null ? currSmallest
				: slotsElementSize > currSmallest ? currSmallest
						: slotsElementSize;
	});

}

// TODO: clusterfuck beseitigen

function drawPartInSlot(slot, part) {
	// alert(slot.sizeX +" "+ part.partDimensions[0] + " " +
	partWidth = slot.sizeX / (part.partDimensions[0] + 1);
	partHeight = slot.sizeY / (part.partDimensions[1] + 1);

	elemSize = partWidth > partHeight ? partHeight : partWidth;

	// alert("partWidth "+partWidth+" partHeight "+partHeight+" elemSize
	// "+elemSize);

//	var vertDiff = 0;
//	part.elementList.forEach(function(elem) {
//		vertDiff = vertDiff < elem.y ? vertDiff : elem.y;
//	});

	// alert(vertDiff);
	part.zoom = slotsElementSize;
	part.x = slot.x;//
	part.y = slot.y;
	part.elementList.forEach(function(elem) {
		elem.x += ((slot.sizeX)/part.zoom /2) - (part.partDimensions[0]/2);
		elem.y += ((slot.sizeY)/part.zoom /2) - (part.partDimensions[1]/2);
		drawOnFixedSpot(elem.x, elem.y, slotsElementSize,
				part.color, slot);
	});

}

function drawOnFixedSpot(x, y, zoom, fill, spot) {

	var gapX = gapLeft;
	var gapY = gapTop;
	if (spot != null) {
		gapX = spot.x;
		gapY = spot.y;
	}
	var newX = (x * zoom + gapX) / zoom;
	var newY = (y * zoom + gapY) / zoom;
	// alert(newY);
	// alert(fieldWidth);
	draw(newX, newY, zoom, fill);
};

function draw(x, y, zoom, fill) {
	// alert see drawinProcess
	// alert( "draw");
	if (fill != null) {
		cont.fillStyle = fill;
		cont.fillRect(x * zoom + 1, ((y * zoom + 1) * ratioHeighWidthElement),
				zoom - 2, (zoom - 2) * ratioHeighWidthElement);
	} else {
		cont.strokeRect(x * zoom, ((y * zoom) * ratioHeighWidthElement), zoom,
				zoom * ratioHeighWidthElement);
	}

}

function update() {
	cont.clearRect(0, 0, can.width, can.height);
	drawGrid();
	parts.forEach(function(part) {
		if (part.moving) {
			part.elementList.forEach(function(elem) {
				// drawOnField(part.x + elem.x, part.y + elem.y, part.color);
				// drawOnFixedSpot(part.x + elem.x, part.y + elem.y, fieldWidth,
				// part.color);
				var newX = (part.x / part.zoom + elem.x);
//				alert(newX);
				var newY = (part.y / part.zoom + elem.y);
				// alert(part.zoom);
				draw(newX, newY, part.zoom, part.color);
			});
		} else {
			drawPartInSlot(slots[part.slot], part);

		}
	});
}

function breakGridDown() {
	var minSize = 1;
	var maxSize = Math.floor((gridX * gridY) * 0.4);

	var tempGrid = grid;
	var slotNum = 0;
	var tempParts = [];

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
				if (tempElements.length == 1) {
					var neighbours = getNeighbours(tempElements[0], tempParts);
					// alert(neighbours);
					var rand = Math.floor(Math.random() * (neighbours.length));
					neighbours[rand].addElement(tempElements[0]);
					tempElements = null;
				}
				break;
			}
			curr = next;

		}
		// normalizeParts(tempElements, start)
		if (tempElements != null) {
			tempParts.push(new part(null, tempElements, start.x, start.y));

		}
	}
	// alert("aye");
	tempParts.forEach(function(elem) {
		if (DRAW_ME_LIKE_ONE_OF_YOUR_FRENCH_GIRLS) {
			var newPart = new part(getRandomColor(), elem.elementList, 0, 0,
					getPartDimension(elem.elementList, new element(elem.x,
							elem.y)));
		} else {
			// alert(elem.x);
			
	

			var newPart = new part(getRandomColor(), normalizeParts(
					elem.elementList, new element(elem.x, elem.y)), 0, 0,
					getPartDimension(elem.elementList, new element(elem.x,
							elem.y)), slotNum);
			slotNum++;
		}
		parts.push(newPart);
	});
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

function normalizeParts(elemList, start) {
	var res = [];
	var north = 0;
	var south = 0;
	var east = 0;
	var west = 0;

	elemList.forEach(function(elem) {
		var x = elem.x - start.x;
		var y = elem.y - start.y;
		north = y < north ? y : north;

		south = y > south ? y : south;

		east = x < east ? x : east;

		west = x > west ? x : west;
		res.push(new element(x, y));
	});
	
	var vertDiff = 0;
	res.forEach(function(elem) {
		vertDiff = vertDiff < elem.y ? vertDiff : elem.y;
	});
	
	for(i = 0; i < res.length; i++ ){
		res[i].y -= vertDiff;
		
	}
	return res;
}

function getPartDimension(elemList, start) {
	var north = 0;
	var south = 0;
	var east = 0;
	var west = 0;
	elemList.forEach(function(elem) {
		var x = elem.x - start.x;
		var y = elem.y - start.y;

		north = y < north ? y : north;
		south = y > south ? y : south;
		east = x < east ? x : east;
		west = x > west ? x : west;
	});
	partHeight = Math.abs(north) + Math.abs(south) + 1;
	partWidth = Math.abs(east) + Math.abs(west) + 1;
	return [ partWidth, partHeight ];
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

function getNeighbours(elem, partList) {
	var res = [];
	partList.forEach(function(part) {
		part.elementList.forEach(function(element) {
			if ((elem.x - 1 == element.x && elem.y == element.y)
					|| (elem.x + 1 == element.x && elem.y == element.y)
					|| (elem.x == element.x && elem.y + 1 == element.y)
					|| (elem.x == element.x && elem.y - 1 == element.y)) {
				res.push(part);
			}
		})
	});
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

	var dir = options[rand];

	switch (dir) {
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
