// Connect Four

const WIDTH = 7;
const HEIGHT = 6;
let count = 0;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells

function makeBoard() {
  // "board" is set to empty HEIGHT x WIDTH matrix array
  // For every y/row there's a x/column filled with null indicating empty
  // [null, null, null, null, null, null, null] x 6 rows
  
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array(WIDTH).fill(null))
  };
};

//makes HTML table and row of column tops
function makeHtmlBoard() { 
  const htmlBoard = document.querySelector('#board'); //links htmlBoard to id='board' in HTML file

  const top = document.createElement("tr"); //creates a table-row element
  top.setAttribute("id", "column-top"); //assigns an id for the table-row element
  top.addEventListener("click", handleClick); //when column-top is clicked, execute handleClick() which controlls the action of piece

  for (let x = 0; x < WIDTH; x++) { //for every column
    const headCell = document.createElement("td"); //creates table-data
    headCell.setAttribute("id", x); //assigns x as the data, x is looped WIDTH times
    top.append(headCell); //adds data loop to the top row
  }
  htmlBoard.append(top); //adds column-top to the top of the gameboard

  for (let y = 0; y < HEIGHT; y++) { //loops over rows HEIGHT times
    const row = document.createElement("tr"); //creates a table-rows
    for (let x = 0; x < WIDTH; x++) { //creates columns for every table row
      const cell = document.createElement("td"); //creats a cell with data
      cell.setAttribute("id", `${y}-${x}`); //asigns data to cell
      row.append(cell); //adds cell to each y/row
      cell.classList.add('cellDesign');
    }
    htmlBoard.append(row); //adds row to gameboard
  }
};

//given column x, return top empty y (null if filled)
function findSpotForCol(x) { 
  // TODO: write the real version of this, rather than always returning 0
  for (let y = HEIGHT-1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
};

//updates DOM to place piece into HTML table of board
function placeInTable(y, x) {
  const div = document.createElement('div'); //create div element
  div.classList.add('piece'); //assign class name to div
  div.classList.add(`player${currPlayer}`); //assign class name to div

  const spot = document.getElementById(`${y}-${x}`); //create an indication for each cell
  spot.append(div); //add div to spot
};

//executes endgame()
function endGame(msg) {
  setTimeout(() => { alert(msg) }, 900);
}

//handles click of column top to play piece
function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  count++;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // places piece in board and adds it to HTML table
  board[y][x] = currPlayer; //updates board from null to currPlayer 1 or 2
  placeInTable(y, x);


  if (checkForWin()) {
    return endGame(`Player${currPlayer} is the winner winner chicken dinner!`)
  }

  if (checkForTie()) {
    return endGame('Tie game, no chicken dinner!')
  }

  currPlayer = currPlayer === 1 ? 2 : 1;   //switches players
  document.querySelector('h2').innerHTML = `Player: ${currPlayer}`;
};

//checks the board cell-by-cell for a win
function checkForWin() {
  
  // Checks four cells to see if they're all color of current player
  function _win(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //checks if 4 connected pieces are present in any direction
  //returns true if all are legal coordinates & all match currPlayer
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
};

//When clicks = count, game is tied
function checkForTie() {
  const totalBoard = HEIGHT * WIDTH; 
  if (count === totalBoard) {
    return true;
  }
};

makeBoard();
makeHtmlBoard();

//restart button
const button = document.querySelector('.button');
button.addEventListener('click', () => location.reload());