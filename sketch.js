var board = [];
var boardLength = 20;
var boardWidth = 20;

var attemptsLeft = 3;

var bombsTotal = 60;
var bombLocations = [];
var bombsMarked = 0;

let flagMode = false;

let gameTimer;

let bombTileHit;
let safeTile;
let gameOver;

let bombMarkBttn;

function preload() {
  soundFormats('mp3');
  //bombTileHit = loadSound("sounds/Bomb_Hit");
  //safeTile = loadSound("/sounds/Safe_Tile");
  //gameOver = loadSound("/sounds/Game_Over");
  //gameWin = loadSound("/sounds/Game_Win");
  gameTimer = new Timer(900000);
  gameTimer.start();
}

function setup() {
  setBombLocations();
  //gameTimer.start();
  console.log(bombLocations);

  bombMarkBttn = createDiv();
  bombMarkBttn.parent("flag-marker");
  bombMarkBttn.mouseClicked(bombMarkClick);
  console.log(bombMarkBttn);

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
  console.log(gameTimer.getRemainingTime());
}

function displayTile() {
  let tile = this;
  let xy = tile.id().split("-");
  let x = parseInt(xy[0]);
  let y = parseInt(xy[1]);
  console.log(`Total bombs marked: ${bombsMarked}`);

  if (bombsMarked >= 59) {
    console.log("Game Win!");
    //gameWin.play();
    window.alert("Game Win!");
  } 
  
  if (flagMode) {
    board[x][y].addClass('flag-tile');
    bombsMarked++;
  } else {
  
    if (bombLocations.includes(tile.id())) {
      attemptsLeft--;
      board[x][y].addClass("bomb-clicked");
      //bombTileHit.play();
      
      if (attemptsLeft <= 0) {
        console.log("Game Over!");
        //gameOver.play();
        window.alert("Game Over!");
      }
    } 
    else {
      board[x][y].addClass('tile-clicked')
      //safeTile.play();
      
      let adjTiles = checkTiles(x,y);
      if (adjTiles > 0) {
        board[x][y].addClass("x" + adjTiles.toString());
      } else {
        exposeAdj(x-1,y-1);
        exposeAdj(x,y-1);
        exposeAdj(x+1,y-1);
        
        exposeAdj(x-1,y);
        exposeAdj(x+1,y);
        
        exposeAdj(x-1,y+1);
        exposeAdj(x,y+1);
        exposeAdj(x+1,y+1);
      }
    }
  }
}

function exposeAdj(r,c) {
  // Function only called if the tile that was clicked is an empty tile

  let s = checkTiles(r,c);
  if (s > 0) {
    board[r][c].addClass('tile-clicked');
    board[r][c].addClass("x" + s.toString());
    console.log(`S: ${s}`);
  } else {
    board[r][c].addClass('tile-clicked');
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
  /*if (!board[r][c].hasClass("tile-clicked")) {
    return;
  } */
  
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
  board[r][c].addClass("x" + totalMines.toString());
  return totalMines;

}

function isTileMine(r,c) {
  if (bombLocations.includes(r.toString() + "-" + c.toString())) {
    return 1;
  } else {
    return 0;
  }
}

function bombMarkClick() {
  if (!flagMode) {
    flagMode = true;
    //console.log("flagMode is true!");
    bombMarkBttn.attribute('background-color', red);
  } else {
    flagMode = false;
  }
}
