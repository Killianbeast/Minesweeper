var board = [];
var boardLength = 20;
var boardWidth = 20;

var attemptsLeft = 3;

var bombsTotal = 60;
var bombLocations = [];
var bombsMarked = 0;
var bombMarkedLocations = [];

let flagMode = false;
let gameStateOver = false;

let gameTimer;
let timerImg;

let bombTileHit = new Audio('https://github.com/Killianbeast/Minesweeper/blob/master/sounds/Bomb_Hit.mp3?raw=true');
let safeTile = new Audio('https://github.com/Killianbeast/Minesweeper/blob/master/sounds/Safe_Tile.mp3?raw=true');
let gameOver = new Audio('https://github.com/Killianbeast/Minesweeper/blob/master/sounds/Game_Over.mp3?raw=true');
let gameWin = new Audio('https://github.com/Killianbeast/Minesweeper/blob/master/sounds/Game_Win.mp3?raw=true');

let bombMarkBttn;
let bombsLeft;

function preload() {
  timerImg = loadImage('images/timer-window.png');
  gameTimer = new Timer(1200000);
  gameTimer.start();
}

function setup() {
  let canv = createCanvas(600, 600);
  canv.position(windowWidth - 1000 , 50);

  setBombLocations();
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
  let currentTime = int(gameTimer.getRemainingTime() / 1000);
  let currTimeHour = int(currentTime / 60);
  let currTimeSec = currentTime % 60;
  if (currTimeSec < 10) {
    currTimeSec = "0" + currTimeSec;
  }
  let currTimeMS = gameTimer.getRemainingTime() % 1000
  if (currTimeMS < 100) {
    currTimeMS = "0" + currTimeMS;
  }

  bombsLeft = 60 - bombsMarked;
  
  //background(220);
  image(timerImg, 0 ,0);
  textAlign(CENTER,CENTER);
  textSize(50);
  fill(255, 0, 0);
  text(currTimeHour + ":" + currTimeSec + ":" + currTimeMS, 275,200);
  text(bombsLeft, 275, 300);

  if (gameTimer.expired()) {
    window.alert("Game Over!");
    gameOver.play();
    noLoop();
  }
}

function displayTile() {
  let tile = this;
  let xy = tile.id().split("-");
  let x = parseInt(xy[0]);
  let y = parseInt(xy[1]);
  console.log(`Total bombs marked: ${bombsMarked}`);

  if (bombsMarked >= 59) {
    console.log("Game Win!");
    gameWin.play();
    window.alert("Game Win!");
    noLoop();
  } 
  
  if (flagMode) {
    if (!bombMarkedLocations.includes(x.toString() + "-" + y.toString())){
      board[x][y].addClass('flag-tile');
      bombMarkedLocations.push(x.toString() + "-" + y.toString());
      bombsMarked++;
    } else {
      board[x][y].removeClass('flag-tile');
      bombMarkedLocations.pop(x.toString() + "-" + y.toString());
      bombsMarked--;
    }
  } else {
  
    if (bombLocations.includes(tile.id())) {
      attemptsLeft--;
      board[x][y].addClass("bomb-clicked");
      bombTileHit.play();
      
      if (attemptsLeft <= 0) {
        console.log("Game Over!");
        gameOver.play();
        window.alert("Game Over!");
        noLoop();
      }
    } 
    else {
      board[x][y].addClass('tile-clicked')
      safeTile.play();
      
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
    ////bombMarkBttn.removeAttribute('background-color');
    bombMarkBttn.addClass("flag-tile-clicked");
  } else {
    flagMode = false;
    bombMarkBttn.removeClass("flag-tile-clicked");
  }
}
