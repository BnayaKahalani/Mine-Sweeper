function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min)
}

// function createBoard() {
//   var board = [];
//   for (var i = 0; i < 8; i++) {
//     board.push([])
//     for (var j = 0; j < 8; j++) {
//       board[i][j] = {}
//     }
//   }

//   return board
// }


// function renderBoard(board) {
//   console.table(board)

//   var strHTML = ''
//   for (var i = 0; i < board.length; i++) {

//     strHTML += '<tr>\n'

//     for (var j = 0; j < board[i].length; j++) {
//       var strClass = board[i][j] ? 'occupied' : ''
//       strHTML += `
//               \t<td 
//                   class="${strClass}"
//                   data-i="${i}" data-j="${j}"
//                   onclick="cellClicked(this,${i}, ${j})">
//                       ${board[i][j]}
//               </td>\n
//           `
//     }
//     strHTML += '</tr>\n'
//   }
//   var elTable = document.querySelector('.board')
//   elTable.innerHTML = strHTML
// }

// function countNeighbors(cellI, cellJ, mat) {
//   var neighborsCount = 0;

//   for (var i = cellI - 1; i <= cellI + 1; i++) {
//     if (i < 0 || i >= mat.length) continue;

//     for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//       if (i === cellI && j === cellJ) continue;
//       if (j < 0 || j >= mat[i].length) continue;
//       if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) neighborsCount++;
//     }
//   }
//   return neighborsCount;
// }

// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

// function getEmptyCell() {
//   var randIdx = getRandomInt(1, 100)
//   var drawnNum = gNums.splice(randIdx, 1)[0]
//   // gPrevNums.push(...drawnNum) 
//   console.log('end of drawNum')

//   return drawnNum
// }

// function getEmptyCells(board) {
//   var emptyCells = []

//   for (var i = 0; i < board.length; i++) {
//     for (var j = 0; j < board[0].length; j++) {
//       if (board[i][j].gameElement === null) emptyCells.push({ i, j })
//     }
//   }

//   return emptyCells
// }

// function createMat(ROWS, COLS) {
//   var mat = []
//   for (var i = 0; i < ROWS; i++) {
//     var row = []
//     for (var j = 0; j < COLS; j++) {
//       row.push('')
//     }
//     mat.push(row)
//   }
//   return mat
// }

// function createSound() {
//   var audio = new Audio('examplefolder/examplefile.wav')
//   audio.play();
// }

// function handleKey(event) {

//   var i = gGamerPos.i;
//   var j = gGamerPos.j;


//   switch (event.key) {
//     case 'ArrowLeft':
//       moveTo(i, j - 1);
//       break;
//     case 'ArrowRight':
//       moveTo(i, j + 1);
//       break;
//     case 'ArrowUp':
//       moveTo(i - 1, j);
//       break;
//     case 'ArrowDown':
//       moveTo(i + 1, j);
//       break;

//   }

// }

// function ordinal_suffix_of(i) {
//   var j = i % 10,
//     k = i % 100;
//   if (j == 1 && k != 11) {
//     return i + "st";
//   }
//   if (j == 2 && k != 12) {
//     return i + "nd";
//   }
//   if (j == 3 && k != 13) {
//     return i + "rd";
//   }
//   return i + "th";
// }

// function addGameElement(element, renderEl) {
//   var emptyCells = getEmptyCells()
//   if (emptyCells.length === 0) return

//   var emptyCell = getEmptyCell(emptyCells)
//   var i = emptyCell.i
//   var j = emptyCell.j
//   gBoard[emptyCell[0].i][emptyCell[0].j].gameElement = element
//   renderCell({ i, j }, renderEl)

//   if (element === BALL) gBallsLeft++
//   else if (element === GLUE) {
//     setTimeout(() => {
//       if (gBoard[emptyCell[0].i][emptyCell[0].j].gameElement === GLUE) {
//         gBoard[emptyCell[0].i][emptyCell[0].j].gameElement = null
//         renderCell({ i, j })
//       }
//     }, 3000)
//   }

// }

// Returns the class name for a specific cell
// function getClassName(location) {
//   var cellClass = `cell-${location.i}-${location.j}`
//   return cellClass
// }

// function renderCell(location, value = '') {
//   var cellSelector = '.' + getClassName(location)
//   var elCell = document.querySelector(cellSelector)
//   elCell.innerHTML = value
// }

// printPrimaryDiagonal(gMat)

// function printPrimaryDiagonal(squareMat) {
//   for (var d = 0; d < squareMat.length; d++) {
//     var item = squareMat[d][d]
//     console.log(item)
//   }
// }

// printSecondaryDiagonal(gMat)
// function printSecondaryDiagonal(squareMat) {
//   for (var d = 0; d < squareMat.length; d++) {
//     var item = squareMat[d][squareMat.length - d - 1]
//     console.log(item)
//   }
// }



