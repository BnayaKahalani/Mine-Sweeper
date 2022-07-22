'use strict'

const BOMB_IMG = '💣'
const SCARD_IMG = '😲'
const LOSE_IMG = '😭'
const WIN_IMG = '🤩'
const NORMAL_IMG = '😃'
const HEART_IMG = '🖤'
const FLAG_IMG = '🏴'
const EXPLOSION_IMG = '💥'
const WINNER_IMG = '🏆'

var gBoard;
var gGame;
var gTimer = 0
var gLevel = {
  SIZE: 4,
  MINES: 2
}
var gMineLocs;
var gEndGame;

var elSpan = document.querySelector('span')
var elDiv = document.querySelector('.lives')
var elDivTime = document.querySelector('.timer')

function initGame() {
  // This is called when page loads

  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
  }

  gMineLocs = []
  gGame.isOn = false
  gEndGame = false

  clearInterval(gTimer)
  elDivTime.innerText = "00:00:000"
  elSpan.innerText = NORMAL_IMG
  elDiv.innerText = FLAG_IMG
  renderLives()

  gBoard = buildBoard()
  renderBoard(gBoard)
}

function buildBoard() {
  // Build the board 

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

  // preventing same-place mines

  while (gMineLocs.length < gLevel.MINES) {

    // Set mines at random locations 

    for (var i = 0; i < gLevel.MINES; i++) {
      var bombI = getRandomInt(0, gLevel.SIZE)
      var bombJ = getRandomInt(0, gLevel.SIZE)
      if (gMineLocs.includes({ bombI, bombJ })) continue

      board[bombI][bombJ].isMine = true
      gMineLocs.push({ bombI, bombJ })
    }
  }

  // Call setMinesNegsCount() 

  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {

      if (board[i][j].isMine) continue

      var minesNegsCount = setMinesNegsCount(i, j, board)
      board[i][j].minesAroundCount = minesNegsCount
    }
  }

  // Return the created board

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
                  oncontextmenu = "cellMarked(this,${i}, ${j})"
                  >`

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

  // prevent clicking after game ends

  if (gEndGame) return

  // start the timer when clicked for the first time

  if (gTimer === 0 && gGame.lives === 3) {
    gGame.secsPassed = new Date().getTime()
    gTimer = setInterval(timer, 24)
  }

  // When click on num

  if (gGame.isOn === false) {
    gGame.isOn = true
    elSpan.innerText = SCARD_IMG
  }

  if (gBoard[i][j].isMarked === true) return

  while (!gBoard[i][j].isShown) {

    if (gBoard[i][j].minesAroundCount > 0) {

      // Update the model
      gBoard[i][j].isShown = true
      gGame.shownCount++

      // Update the DOM
      elCell.innerText = gBoard[i][j].minesAroundCount
      elCell.classList.add('clicked')

      // When click on a bomb

    } else if (gBoard[i][j].isMine && gBoard[i][j].minesAroundCount >= 0) {

      if (gGame.lives > 2 && gLevel.SIZE === 4 ||
        gGame.lives > 1 && gLevel.SIZE === 8 ||
        gGame.lives > 1 && gLevel.SIZE === 12) {
        var audio = new Audio('sounds/mine.mp3')
        audio.play();
      }

      // Update the model
      gBoard[i][j].isShown = true
      gGame.shownCount++
      gGame.lives--
      gGame.isOn = false
      

      // Update the DOM
      elCell.innerText = BOMB_IMG
      elCell.classList.add('clicked')


      // When click on an empty cell

    } else if (gBoard[i][j].minesAroundCount === 0) {

      expandShown(gBoard, elCell, i, j)

      // Update the model
      gBoard[i][j].isShown = true
      gGame.shownCount++

      // Update the DOM

      elCell.innerText = " "
      elCell.classList.add('clicked')

    }
  }
  renderLives()
  checkGameOver()
}

// preventing right-click menu

document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
}, false);

function cellMarked(elCell, i, j) {
  if (gEndGame) return

  if (gBoard[i][j].isShown === true) return

  if (gBoard[i][j].isMarked === false) {

    // Update the model

    gBoard[i][j].isMarked = true
    gGame.markedCount++
    

    // Update the DOM

    elCell.innerText = FLAG_IMG
    elCell.classList.toggle('flagged')

  } else {

    // Update the model

    gBoard[i][j].isMarked = false
    gGame.markedCount--

    // Update the DOM

    elCell.innerText = ""
    elCell.classList.toggle('flagged')
  }
  var elDiv = document.querySelector('.flags')
  if (!gGame.markedCount) elDiv.innerText = FLAG_IMG
  else elDiv.innerText = FLAG_IMG + " " + " " + gGame.markedCount

  checkGameOver()
}

function checkGameOver() {

  // Game ends when all mines are marked
  // and all the other cells are shown

  if (gGame.lives === 0) {

    // using gMineLocs, show the rest of the mines

    // Model
    // for (var i = 0; i < gBoard.length; i++) {
    //   for (var j = 0; j < gBoard[i].length; j++) {
    //     console.log('board[i][j]:', gBoard[i][j])
    //     if (gBoard[i][j].isMine === true) {
    //       gBoard[i][j].isShown === true
    //     }
    // DOM

    //   }
    // }

    gameOver()
    console.log('gBoard:', gBoard)
  } else if (gLevel.MINES === 2 && gGame.lives === 1) {

    gameOver()

  } else if (gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2 &&
             gGame.markedCount <= gLevel.MINES) {
    victory()
  }
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

      if(board[i][j].isMarked) continue

      // Update the model

      if (!board[i][j].isShown) {
        board[i][j].isShown = true
        gGame.shownCount++

        // Update the DOM

        renderCell({ i, j }, "clicked")
        elCell.innerText = board[i][j].minesAroundCount
        elCell.classList.add('clicked')
      }

    }
  }
}

function getClassName(location) {
  var cellClass = `cell-${location.i}-${location.j}`
  return cellClass
}

function renderCell(location, value = '') {
  var cellSelector = '.' + getClassName(location)
  var elCell = document.querySelector(cellSelector)
  elCell.classList.add(value)
  if (gBoard[location.i][location.j].minesAroundCount === 0) {
    elCell.innerText = " "
  } else {
    elCell.innerText = gBoard[location.i][location.j].minesAroundCount
  }
}

function chooseLevel(elBtn) {

  if (elBtn.classList.value === 'beginner') {

    gLevel.SIZE = 4
    gLevel.MINES = 2

  } else if (elBtn.classList.value === 'medium') {

    gLevel.SIZE = 8
    gLevel.MINES = 12

  } else {

    gLevel.SIZE = 12
    gLevel.MINES = 30

  }
  elSpan.innerText = NORMAL_IMG
  clearInterval(gTimer)
  gTimer = 0
  initGame()
}

function gameOver() {
  gEndGame = true

  var audio = new Audio('sounds/lose.mp3')
  audio.play();

  // add sound

  if (gGame.lives === 0 || gGame.lives === 1) {
    elSpan.innerText = LOSE_IMG
    elDiv.innerText = EXPLOSION_IMG
  }
  clearInterval(gTimer)
  gTimer = 0
}

function renderLives() {

  // update the DOM

  elDiv.innerText = HEART_IMG.repeat(gGame.lives)
}

function victory() {
  gEndGame = true

  // add sound 

  var audio = new Audio('sounds/win.mp3')
  audio.play();

  console.log('gTimer:', gTimer)

  elSpan.innerText = WIN_IMG
  elDiv.innerText = WINNER_IMG
  clearInterval(gTimer)
  gTimer = 0
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

// Bonuses:

const open = document.getElementById('open')
const modal_container = document.getElementById('modal-container')
const close = document.getElementById('close')

open.addEventListener('click', () => {
  modal_container.classList.add('show')
})

close.addEventListener('click', () => {
  modal_container.classList.remove('show')
})




