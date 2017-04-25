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
var rect;
var offsetX;
var offsetY;
var isMouseClick = false;
var isTouch = false;
var elementWidth;
var elementHeight;

var fieldHeight;
var fieldWidth;

var ratioHeighWidthElement;

var slots;
var slotsElementSize;

function part(color, elementList, x, y, partDimensions, slot, offset) {
	this.elementList = elementList;
	this.color = color;
	this.slot = slot;
	this.x = x
	this.y = y;
	this.partDimensions = partDimensions; // [0] width; [1] height
	this.offset = offset;
	this.zoom;
	this.moving = false;
	this.gridX;
	this.gridY;

	this.setPos = function(x, y, zoom) {
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

function element(x, y) {
	this.x = x;
	this.y = y;
	this.isDragging = false;
}

function gridCell(x, y) {
	this.x = x;
	this.y = y;
	this.val = 0;
}

function slot(x, y, sizeX, sizeY, part) {
	this.x = x;
	this.y = y;
	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.part = part;
}

function mouseHandler(event) {
	// alert("bla");
	var mouseX = event.pageX;
	var mouseY = event.pageY;

	var tempX = mouseX
			- ((selectedPart.partDimensions[0] * selectedPart.zoom) / 2);
	var tempY = mouseY
			- ((selectedPart.partDimensions[1] * selectedPart.zoom) / 2);

	selectedPart.setPos(tempX, tempY, getZoom(mouseX, mouseY));
}

var selectedPart;

function mainLoad() {
	gridX = 15;
	gridY = 15;
	parts = [];
	slots = [];
	can = $("#main")[0];
	can.width = 500;
	can.height = 500;
	rect = can.getBoundingClientRect();
	offsetX = rect.left;
	offsetY = rect.top;
	can.addEventListener('mousedown', mouseDown, false);
	can.addEventListener('mousemove', mouseMove, false);
	can.addEventListener('mouseup', mouseUp, false)
	can.addEventListener("touchstart", touchStart, false);
	can.addEventListener("touchend", touchEnd, false);
	can.addEventListener("touchmove", touchMove, false);
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
		getSlotElementSize();

	}

	setPartsinSlot();
	update();
	// can.addEventListener('click', function(event) {
	// can.removeEventListener("mousemove", mouseHandler);
	// var elemLeft = can.offsetLeft;
	// var elemTop = can.offsetTop;
	// var x = event.pageX - elemLeft;
	// var y = event.pageY - elemTop;
	//
	// var found = false;
	// setPartsinSlot();
	// // Collision detection between clicked offset and element.
	// parts.forEach(function(part) {
	// part.moving = false;
	// if (found) {
	// return;
	// }
	// if (y > part.y && y < part.y + (part.partDimensions[1] * part.zoom)
	// && x > part.x
	// && x < part.x + (part.partDimensions[0] * part.zoom)) {
	// part.elementList.forEach(function(element) {
	// if (y > part.y + element.y * part.zoom
	// && y < part.y + element.y * part.zoom + part.zoom
	// && x > part.x + element.x * part.zoom
	// && x < part.x + element.x * part.zoom + part.zoom) {
	// // add drag'n drop here
	//
	// part.moving = true;
	// selectedPart = part;
	// can.addEventListener('mousemove', mouseHandler);
	//
	// found = true;
	// }
	// })
	// }
	// });
	// update();
	// }, false);

}

function randomizeSlots(count){
	var slotNumbers = Array();
	
	for(var i = 0; i < count; i++){
		slotNumbers.push(i);
	}
	
	parts.forEach(function(part){
		var num = Math.floor((Math.random() * (slotNumbers.length-1)));
		part.slot = slotNumbers[num];
		slotNumbers.splice(num, 1);
		console.log(num);
		console.log(slotNumbers);
	});
}

function setPartInSlot(part) {
	part.setPos((slots[part.slot].x + slots[part.slot].sizeX / 2)
			- ((part.partDimensions[0] / 2)) * slotsElementSize,
			(slots[part.slot].y + slots[part.slot].sizeY / 2)
					- ((part.partDimensions[1] / 2)) * slotsElementSize,
			slotsElementSize);
}

function setPartsinSlot() {
	parts.forEach(function(part) {
		part.setPos((slots[part.slot].x + slots[part.slot].sizeX / 2)
				- ((part.partDimensions[0] / 2)) * slotsElementSize,
				(slots[part.slot].y + slots[part.slot].sizeY / 2)
						- ((part.partDimensions[1] / 2)) * slotsElementSize,
				slotsElementSize);
	});
}

function getZoom(x, y) {
	if (x >= gapLeft && x <= gapLeft + gridWidth && y >= gapTop
			&& y <= gapTop + gridHeight)
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

// function rotate(part) {
// var elements = part.elementList;
// var temp;
// for (var i = 0; i < elements.length; i++) {
// temp = elements[i].x;
// elements[i].x = elements[i].y;
// elements[i].y = temp * (-1);
// }
//
// }

function drawGrid() {
	cont.clearRect(0, 0, can.width, can.height);

	for (var i = 0; i < gridX; i++) {
		for (var j = 0; j < gridY; j++) {
			drawOnFixedSpot(i, j, fieldWidth);
		}
	}
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

	parts.forEach(function(elem) {
		elem.zoom = slotsElementSize;
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
	draw(newX, newY, zoom, fill);
};

function draw(x, y, zoom, fill) {
	// alert see drawinProcess

	if (fill != null) {
		cont.fillStyle = fill;
		cont.fillRect(x, y, zoom, zoom);
	} else {
		cont.strokeRect(x * zoom, ((y * zoom) * ratioHeighWidthElement), zoom,
				zoom * ratioHeighWidthElement);
	}

}

function update() {
	cont.clearRect(0, 0, can.width, can.height);
	drawGrid();

	parts.forEach(function(part) {
		part.elementList.forEach(function(elem) {
			var newX = (part.x + elem.x * part.zoom);
			var newY = (part.y + elem.y * part.zoom);
			draw(newX, newY, part.zoom, part.color);
		});
	});

	// draw selectedPart again, to always draw on top of all elements
	if (selectedPart != null) {
		selectedPart.elementList.forEach(function(elem) {
			var newX = (selectedPart.x + elem.x * selectedPart.zoom);
			var newY = (selectedPart.y + elem.y * selectedPart.zoom);
			draw(newX, newY, selectedPart.zoom, selectedPart.color);
		})
	}

}

function breakGridDown() {
	var minSize = 1;
	var maxSize = Math.floor((gridX * gridY) * 0.7);

	// var [] tempGrid = grid.clone();

	var tempGrid = jQuery.extend(true, [], grid);
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
		if (tempElements != null) {
			tempParts.push(new part(null, tempElements, start.x, start.y));

		}
	}
	tempParts.forEach(function(elem) {
		if (DRAW_ME_LIKE_ONE_OF_YOUR_FRENCH_GIRLS) {
			var newPart = new part(getRandomColor(), elem.elementList, 0, 0,
					getPartDimension(elem.elementList, new element(elem.x,
							elem.y)));
		} else {
			var newPart = new part(getRandomColor(), normalizeParts(
					elem.elementList, new element(elem.x, elem.y)), 0, 0,
					getPartDimension(elem.elementList, new element(elem.x,
							elem.y)), slotNum);
			slotNum++;
		}
		parts.push(newPart);
	});
	randomizeSlots(slotNum);
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

	for (i = 0; i < res.length; i++) {
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

var startContactTime;
var endContactTime;

function startContact(mx, my) {
	isMouseClick = false;
	var found = false;

//	for (var i = 0; i < slots.length; i++) {
//		if (inbetween(mx, slots[i].x, slots[i].x + slots[i].sizeX)
//				&& inbetween(my, slots[i].y, slots[i].y + slots[i].sizeY)) {
//			parts.forEach(function(part) {
//				if (part.slot == i) {
//					selectedPart = part;
//				}
//			});
////			return;
//		}
//	}
	if (selectedPart == null) {
		parts.forEach(function(part) {
			part.moving = false;
			if (found) {
				startContactTime = new Date().getTime();
				return;
			}
			var slotClicked = false;
			if(part.gridX == null && (inbetween(mx, slots[part.slot].x, slots[part.slot].x + slots[part.slot].sizeX)
					&& inbetween(my, slots[part.slot].y, slots[part.slot].y + slots[part.slot].sizeY))){
				slotClicked = true;
			}
			if ((my > part.y
					&& my < part.y + (part.partDimensions[1] * part.zoom)
					&& mx > part.x
					&& mx < part.x + (part.partDimensions[0] * part.zoom))
					||slotClicked) {
				part.elementList
						.forEach(function(element) {
							if (slotClicked || my > part.y + element.y * part.zoom
									&& my < part.y + element.y * part.zoom
											+ part.zoom
									&& mx > part.x + element.x * part.zoom
									&& mx < part.x + element.x * part.zoom
											+ part.zoom) {
								// add drag'n drop here
								// console.log(grid);
								part.moving = true;
								selectedPart = part;

								// can.addEventListener('mousemove',
								// mouseHandler);

								found = true;

							}
						})
			}
		});
	}
	if (selectedPart != null) {
		if (selectedPart.gridX != null) {
			selectedPart.elementList
					.forEach(function(elem) {
						grid[selectedPart.gridX + elem.x][selectedPart.gridY
								+ elem.y] = 0;

					});
			selectedPart.gridX = null;
			selectedPart.gridY = null;
		}
		isMouseClick = true;
	}
	update();
}

function movementAction(mouseX, mouseY) {
	var tempX = mouseX
			- ((selectedPart.partDimensions[0] * selectedPart.zoom) / 2);
	var tempY = mouseY
			- ((selectedPart.partDimensions[1] * selectedPart.zoom) / 2);

	selectedPart.setPos(tempX, tempY, getZoom(mouseX, mouseY));
}

function endContact() {
	// setPartsinSlot();
	endContactTime = new Date().getTime();
	isMouseClick = false;
	parts.forEach(function(part) {
		// part.moving = false;
		part.elementList.forEach(function(elem) {
			elem.isDragging = false;
		});
	});
	if (endContactTime - startContactTime <= 1000) {
		// rotate(selectedPart)
	}
	checkPosition(selectedPart);
	selectedPart = null;
}

function mouseDown(e) {
	// var selectedPart;
	e.preventDefault();
	e.stopPropagation();

	var mx = parseInt(e.clientX - offsetX);
	var my = parseInt(e.clientY - offsetY);

	startContact(mx, my);

	// Funktion die die Elemente wieder normal groß macht

	// parts.forEach(function(part) {
	// part.elementList.forEach(function(elem) {
	// // elem.x und elem.y sollten eigentlich die wirkliche Position der
	// // Elemente sein
	// // elemnetWidth und elementHeight sind die größe der Elemente
	// if (mx > elem.x && mx < elem.x + elementWidth && my > elem.y
	// && my < elem.y + elementHeight) {
	// isMouseClick = true;
	// selectedPart = part;
	// }
	// });
	// });
	// if (selectedPart != undefined) {
	// selectedPart.elementList.forEach(function(elem) {
	// elem.isDragging = true;
	// });
	// }
	//
	// startX = mx;
	// startY = my;

}

function mouseMove(e) {
	if (isMouseClick) {
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		movementAction(mouseX, mouseY);
		// var tempX = mouseX
		// - ((selectedPart.partDimensions[0] * selectedPart.zoom) / 2);
		// var tempY = mouseY
		// - ((selectedPart.partDimensions[1] * selectedPart.zoom) / 2);
		//
		// selectedPart.setPos(tempX, tempY, getZoom(mouseX, mouseY));

		// e.preventDefault();
		// e.stopPropagation();
		//
		// var mx = parseInt(e.clientX - offsetX);
		// var my = parseInt(e.clientY - offsetY);
		//
		// var dx = mx - startX;
		// var dy = my - startY;
		//
		// parts.forEach(function(part) {
		// part.elementList.forEach(function(elem) {
		// if (elem.isDragging) {
		// // auch hier brauch man die wahre Position der Elemente
		// elem.x += dx;
		// elem.y += dy;
		// }
		// });
		// });
		//
		// drawAll();
		//
		// startX = mx;
		// startY = my;
	}
}

function checkPosition(part) {
	if (part == null)
		return;
	if (part.x < gapLeft - part.zoom * 0.4
			|| part.y < gapTop - part.zoom * 0.4
			|| part.x + (part.partDimensions[0] * part.zoom) > (can.width - gapRight)
					+ part.zoom * 0.4
			|| part.y + (part.partDimensions[1] * part.zoom) > (can.height - gapBottom)
					+ part.zoom * 0.4) {
		setPartInSlot(part);
		return;
	}
	var blocked = false;
	for (var i = 0; i < gridX; i++) {
		if (inbetween(part.x, (i * fieldWidth + gapLeft) - fieldWidth * 0.4, (i
				* fieldWidth + gapLeft + fieldWidth)
				- fieldWidth * 0.4)) {
			for (var j = 0; j < gridY; j++) {
				if (inbetween(part.y, (j * fieldHeight + gapTop) - fieldHeight
						* 0.4, (j * fieldHeight + gapTop + fieldHeight)
						- fieldHeight * 0.4)) {
					part.setPos((i * fieldWidth + gapLeft), j * fieldHeight
							+ gapTop);
					part.elementList.forEach(function(elem) {
						if (grid[i + elem.x][j + elem.y] == 1) {
							blocked = true;
							
						}
					});
					if(blocked){
						setPartInSlot(part);
						return;
						}
					part.elementList.forEach(function(elem) {
						grid[i + elem.x][j + elem.y] = 1;
						part.gridX = i;
						part.gridY = j;
					});
					// alert(i + " " + j);
					// return;
				}
			}
		}
	}

	// alert(part.x+" "+part.y+"\n"+gridX*part.zoom+" "+gridY*part.zoom);
}

function inbetween(num, min, max) {
	if (num >= min && num <= max)
		return true;
	else
		return false;
}

function mouseUp(e) {
	e.preventDefault();
	e.stopPropagation();
	endContact();
	// // setPartsinSlot();
	// isMouseClick = false;
	// parts.forEach(function(part) {
	// // part.moving = false;
	// part.elementList.forEach(function(elem) {
	// elem.isDragging = false;
	// });
	// });
	// checkPosition(selectedPart);
	// selectedPart = null;
}

function touchStart(e) {
	var selectedPart;
	e.preventDefault();
	e.stopPropagation();

	var mx = parseInt(e.touches[0].pageX);
	var my = parseInt(e.touches[0].pageY);

	startContact(mx, my)
	// isTouch = false;
	//
	// // Funktion die die Elemente wieder normal groß macht
	//
	// parts.forEach(function(part) {
	// part.elementList.forEach(function(elem) {
	// // elem.x und elem.y sollten eigentlich die wirkliche Position der
	// // Elemente sein
	// // elemnetWidth und elementHeight sind die größe der Elemente
	// if (mx > elem.x && mx < elem.x + elementWidth && my > elem.y
	// && my < elem.y + elementHeight) {
	// isTouch = true;
	// selectedPart = part;
	// }
	// });
	// });
	//
	// if (selectedPart != undefined) {
	// selectedPart.elementList.forEach(function(elem) {
	// elem.isDragging = true;
	// });
	// }
	// startX = mx;
	// startY = my;
}

function touchMove(e) {
	if (isMouseClick) {
		e.preventDefault();
		e.stopPropagation();

		var mx = parseInt(e.touches[0].pageX);
		var my = parseInt(e.touches[0].pageY);

		movementAction(mx, my)

		// var dx = mx - startX;
		// var dy = my - startY;
		//
		// parts.forEach(function(part) {
		// part.elementList.forEach(function(elem) {
		// if (elem.isDragging) {
		// // auch hier brauch man die wahre Position der Elemente
		// elem.x += dx;
		// elem.y += dy;
		// }
		// });
		// });
		//
		// drawAll();
		//
		// startX = mx;
		// startY = my;
	}
}

function touchEnd(e) {
	e.preventDefault();
	e.stopPropagation();
	endContact();
	// isTouch = false;
	// parts.forEach(function(part) {
	// part.elementList.forEach(function(elem) {
	// elem.isDragging = false;
	// });
	// });
}
