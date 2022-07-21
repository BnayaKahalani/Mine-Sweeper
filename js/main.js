'use strict'

const BOMB_IMG = '💣'
const SCARD_IMG = '😲'
const LOSE_IMG = '😭'
const WIN_IMG = '🤩'
const NORMAL_IMG = '😃'
const HEART_IMG = '🖤'

var gBoard;
var gLevel = {
  SIZE: 4,
  MINES: 3
}

var gGame;

var gTimer = 0

var elSpan = document.querySelector('span')
var elDiv = document.querySelector('.lives')

function initGame() {
  // This is called when page loads
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
  }
  gGame.isOn = false

  renderLives()

  gBoard = buildBoard()
  renderBoard(gBoard)
}

function buildBoard() {
  // Builds the board 
  // Set mines at random locations 
  // Call setMinesNegsCount() 
  // Return the created board

  var board = []

  for (var i = 0; i < gLevel.SIZE; i++) {
    board.push([])
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
      }
    }
  }

  for (var i = 0; i < gLevel.MINES; i++) {
    var bombI = getRandomInt(0, gLevel.SIZE)
    var bombJ = getRandomInt(0, gLevel.SIZE)
    board[bombI][bombJ].isMine = true
  }

  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {

      if (board[i][j].isMine) continue

      var minesNegsCount = setMinesNegsCount(i, j, board)
      board[i][j].minesAroundCount = minesNegsCount
    }
  }
  console.log('board:', board)
  return board
}

function renderBoard(board) {
  // Render the board as a <table> to the page

  var strHTML = ''
  for (var i = 0; i < board.length; i++) {

    strHTML += '<tr>\n'

    for (var j = 0; j < board[i].length; j++) {

      strHTML += `
              \t<td
                  class = "cell-${i}-${j}" 
                  data-i="${i}" data-j="${j}"
                  onclick="cellClicked(this,${i}, ${j})"
                  contextmenu = "cellMarked(this,${i}, ${j})"
                  >`

      // if (currCell.isMine === true) {
      //   strHTML += BOMB_IMG
      // } else {
      //   strHTML += currCell.minesAroundCount
      // }

      strHTML += `</td>\n`
    }
    strHTML += '</tr>\n'
  }

  var elTable = document.querySelector('.board')
  elTable.innerHTML = strHTML
}

function setMinesNegsCount(cellI, cellJ, mat) {

  // Count mines around each cell  
  // set the cell's minesAroundCount.

  var minesNegsCount = 0;

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;

      if (mat[i][j].isMine) minesNegsCount++;
    }
  }
  if (minesNegsCount === 0) return 0
  else return minesNegsCount
}

function cellClicked(elCell, i, j) {

  // start the timer when clicked for the first time

  if (gTimer === 0) {
    gGame.secsPassed = new Date().getTime()
    gTimer = setInterval(timer, 60)
  }

  // When click on num

  if (gGame.isOn === false) {
    gGame.isOn = true
    elSpan.innerText = SCARD_IMG
  }

  while (!gBoard[i][j].isShown) {

    if (gBoard[i][j].minesAroundCount > 0 && !gBoard[i][j].isMine) {

      // Update the model
      gBoard[i][j].isShown = true
      gGame.shownCount++

      // Update the DOM
      elCell.innerText = gBoard[i][j].minesAroundCount
      elCell.classList.add('clicked')

      // When click on a bomb

    } else if (gBoard[i][j].isMine && gBoard[i][j].isMine >= 0) {

      // Update the model
      gBoard[i][j].isShown = true
      gGame.shownCount++
      gGame.lives--
      gGame.isOn = false
      // clearInterval(gGame.secsPassed)

      // Update the DOM
      elCell.innerText = BOMB_IMG
      elCell.classList.add('clicked')


      // When click on an empty cell

    } else {

      // Update the model
      gBoard[i][j].isShown = true
      gGame.shownCount++

      // Update the DOM

      elCell.innerText = " "
      elCell.classList.add('clicked')

      expandShown(gBoard, elCell, i, j)
    }
  }
  checkGameOver()
}

function cellMarked(elCell, i, j) {

  console.log('hi',)

}

function checkGameOver() {
  // Game ends when all mines are marked
  // and all the other cells are shown

  if (gGame.lives === 0) {
    elSpan.innerText = LOSE_IMG
    gameOver()
  }
  renderLives()
}

function expandShown(board, elCell, cellI, cellJ) {

  // When user clicks a cell with no mines around,
  //   we need to open not only that cell,
  //     but also its neighbors.

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === cellI && j === cellJ) continue;

      // Update the model
      board[i][j].isShown = true
      gGame.shownCount++

      // Update the DOM
      renderCell({i,j}, "clicked")
      elCell.innerText = board[i][j].minesAroundCount
      elCell.classList.add('clicked')

    }

  }
  console.log('hi',)
}

function getClassName(location) {
  var cellClass = `cell-${location.i}-${location.j}`
  return cellClass
}

function renderCell(location, value = '') {
  var cellSelector = '.' + getClassName(location)
  var elCell = document.querySelector(cellSelector)
  elCell.classList.add(value)
  elCell.innerText = "00"
}

function chooseLevel(elBtn) {

  if (elBtn.classList.value === 'beginner') {
    // model

    gLevel.SIZE = 4
    gLevel.MINES = 3

    // DOM

    // elBtn.style.backgroundColor = 'lightgrey'

  } else if (elBtn.classList.value === 'medium') {

    // model
    gLevel.SIZE = 8
    gLevel.MINES = 12

    //DOM

    // elBtn.style.backgroundColor = 'lightgrey'

  } else {

    //model

    gLevel.SIZE = 12
    gLevel.MINES = 30

    // DOM

    // elBtn.style.backgroundColor = 'lightgrey'
  }
  elSpan.innerText = NORMAL_IMG
  clearInterval(gTimer)
  gTimer = 0
  initGame()
}

function gameOver() {
  clearInterval(gTimer)
  gTimer = 0
}

function renderLives() {

  //DOM


  elDiv.innerText = HEART_IMG.repeat(gGame.lives)
}

function timer() {

  var currTime = new Date().getTime()
  var timePassed = new Date(currTime - gGame.secsPassed)

  var elTimer = document.querySelector('.timer')

  var mins = timePassed.getMinutes() < 10 ? '0' : ''
  var secs = timePassed.getSeconds() < 10 ? '0' : ''
  var milSecs = timePassed.getMilliseconds() < 100 ? (timePassed.getMilliseconds() < 10 ? '00' : '0') : ''

  elTimer.innerText = `${mins + timePassed.getMinutes()}:${secs + timePassed.getSeconds()}:${timePassed.getMilliseconds() + milSecs}`
}