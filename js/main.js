'use strict'


var gBoard;

var gLevel = {
  SIZE: 4,
  MINES: 2
}

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0
}

initGame()

function initGame() {
  // This is called when page loads
  buildBoard(gBoard)
  console.log('buildBoard:', gBoard)


}

function buildBoard(board) {
  // Builds the board 
  // Set mines at random locations 
  // Call setMinesNegsCount() 
  // Return the created board

  var board = [];

  for (var i = 0; i < gLevel.SIZE.length; i++) {
    board.push([])
    for (var j = 0; j < gLevel.SIZE.length; j++) {
      board[i][j] = {
        minesAroundCount: null, 
        isShown: false, 
        isMine: false, 
        isMarked: false
      }
    }
  }
  return board
}

function renderBoard(board) {
  // Render the board as a <table> to the page

}

function setMinesNegsCount(board) {
  // Count mines around each cell  
  // set the cell's minesAroundCount.

}


function cellClicked(elCell, i, j) {
  // Called when a cell (td) is clicked

}

function cellMarked(elCell) {
  // Called on right click to mark a cell 
  // (suspected to be a mine)

}

function checkGameOver() {
  // Game ends when all mines are marked
  // and all the other cells are shown
}

function expandShown(board, elCell, i, j) {
  // When user clicks a cell with no mines around, 
  // we need to open not only that cell, 
  // but also its neighbors.

}