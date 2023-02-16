var board = [];
var boardLength = 20;
var boardWidth = 20;

var attemptsLeft = 3;

var bombsTotal = 60;
var bombLocations = [];

let bombTileHit;
let safeTile;

function preload() {
  soundFormats('mp3');
  bombTileHit = loadSound("sounds/Bomb Hit");
  safeTile = loadSound("/sounds/Safe Tile");
}

function setup() {
  createCanvas(400, 400);

  setBombLocations();
  console.log(bombLocations);

  for (let r = 0; r < boardLength; r++) {
    let row = [];
    for (let c = 0; c < boardWidth; c++) {
      tile = createDiv();
      tile.parent("board");
      tile.id(`${r}-${c}`);
      tile.mouseClicked(displayTile);
      row.push(tile);
    }
    board.push(row);
  }
  console.log(board);
}

function draw() {
  //background(220);
  //board.mouseClicked(displayTile);
}

function displayTile() {
  let tile = this;
  let xy = tile.id().split("-");
  let x = parseInt(xy[0]);
  let y = parseInt(xy[1]);
  
  if (bombLocations.includes(tile.id())) {
    attemptsLeft--;
    board[x][y].addClass("bomb-clicked");
    bombTileHit.play();
    
    if (attemptsLeft <= 0) {
      console.log("Game Over!");
    }
  } 
  else {
    board[x][y].addClass('tile-clicked')
    safeTile.play();
    let bombsFound = checkTiles(x,y);

    if (bombsFound > 0) {
      board[x][y].addClass("x" + bombsFound.toString());
    }

  }

}

function setBombLocations() {
  while (bombsTotal > 0) {
    let x = int(random(0,20));
    let y = int(random(0,20));
    let bombloc = x.toString() + "-" + y.toString();

    if (!bombLocations.includes(bombloc)) {
      bombLocations.push(bombloc);
      bombsTotal--;
    }
  }
}

function checkTiles(r,c) {
  let totalMines = 0;

  totalMines += isTileMine(r - 1, c - 1);
  totalMines += isTileMine(r, c - 1);
  totalMines += isTileMine(r + 1, c - 1);

  totalMines += isTileMine(r - 1, c);
  totalMines += isTileMine(r + 1, c);

  totalMines += isTileMine(r - 1, c + 1);
  totalMines += isTileMine(r, c + 1);
  totalMines += isTileMine(r + 1, c + 1);

  console.log(`Total bombs: ${totalMines}`);

  if (totalMines > 0) {
    return totalMines;
  } else {
    board[r][c].addClass("tile-clicked");
  }

}

function isTileMine(r,c) {
  if (bombLocations.includes(r.toString() + "-" + c.toString())) {
    return 1;
  } else {
    return 0;
  }
}
