var board = [];
var boardLength = 20;
var boardWidth = 20;

var attemptsLeft = 3;

var bombsTotal = 60;
var bombLocations = [];

function setup() {
  createCanvas(400, 400);

  //bombLocations.push("0-0");
  //bombLocations.push("0-1");
  //bombLocations.push("0-2");
  //bombLocations.push("0-3");
  //bombLocations.push("0-4");
  //bombLocations.push("0-5");
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
  if (bombLocations.includes(tile.id())) {
    console.log(`Bomb hit at ${tile.id()}!`);
    attemptsLeft--;
    console.log(attemptsLeft);
    if (attemptsLeft <= 0) {
      console.log("Game Over!");
    }
  } else {
      console.log( `Tile ID: ${tile.id()} clicked!`);
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
