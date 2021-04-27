/**
 * Class represents Tic Tac Toe game.
 * @author David Omrai
 */
class TicTacToe {
  constructor(boardSize=3){
    if (boardSize < 3) {
      throw 'Unsupported board size.';
    }
    // Board size
    this._boardSize = boardSize;

    // Number of connected symbols to win
    this._symbolsToWin = boardSize;

    // Game board
    this._board = this._createBoard(boardSize);

    // Clean the game board
    this._cleanBoard();

    // Game turns
    this._gameTurns = 0;

    // Set players name
    this._player1 = 'player1';
    this._player2 = 'player2';

    // Symbols 
    this._playersSymbols = new Object();
    this._playersSymbols[this._player1] = 'x';
    this._playersSymbols[this._player2] = 'o';

    // Scores
    this._playersScores = new Object();
    this._playersScores[this._player1] = 0;
    this._playersScores[this._player2] = 0;

    // Current player
    this._currentPlayer = this._player1;
  }

  /**
   * Method creates a new board.
   * @param size Size of the board. 
   */
  _createBoard(size) {
    const newBoard = new Array(size);
    for (let i = 0; i < size; i++) {
      newBoard[i] = new Array(size);
    }
    return newBoard;
  }

  /**
   * Method cleans the board.
   */
  _cleanBoard() {
    for(const row of this._board) {
      for(let i = 0; i < this._boardSize; i++) {
        row[i] = '_';
      }
    }
  }

  /**
   * Method returns board as string.
   * @returns String representation of board.
   */
  _boardToString() {
    let output = "";
    for(const row of this._board) {
      for(let i = 0; i < this._boardSize; i++) {
        output+=row[i] + " ";
      }
      output = output.slice(0, -1);
      output+="\n";
    }
    return output.slice(0, -1);
  }

  /**
   * Method prints the game board.
   */
  _printBoard() {
    console.log(this._boardToString());
    console.log();
  }

  /**
   * Method prints the users scores
   */
  _printScore() {
    console.log('Score');
    console.log(`${this._player1} with ${this._playersSymbols[this._player1]}: ${this._playersScores[this._player1]}`);
    console.log(`${this._player2} with ${this._playersSymbols[this._player2]}: ${this._playersScores[this._player2]}`);
    console.log('');
  }

  /**
   * Method changes the current player.
   * @param currentPlayer Current player.
   */
  _changePlayer(currentPlayer) {
    if (currentPlayer === this._player1) {
      this._currentPlayer = this._player2;
    } else {
      this._currentPlayer = this._player1;
    }
  }

  /**
   * Method counts the number of symbols on given way.
   * @param x Horizontal coordinate of new symbol.
   * @param y Vertical coordinate of new symbol.
   * @param xWay Right = +1, Left = -1.
   * @param yWay Up = -1, Down = +1.
   * @param iterateNum Numver of places to check.
   * @param symbol What symbol to look for.
   * @returns Sum of symbols on given way.
   */
  _countSymbols(x, y, xWay, yWay, iterateNum, symbol) {
    let sum = 0;

    for (let i = 0; i < iterateNum; i++){
      if (this._board[y + yWay*i][x + xWay*i] === symbol){
        sum+=1;
      }
      else {
        break;
      }
    }
    return sum;
  }

  /**
   * Method checks all direction to resolve if player with given symbol has won.
   * @param x Horizontal coordinate of new symbol.
   * @param y Vertical coordinate of new symbol.
   * @param symbol Player symbol.
   * @returns True if player has won, false otherwise.
   */
  _isPlayerWinner(x, y, symbol) {
    /**
     * [0,0]                 up                 [0,board-size-1]
     *                       |
     *                       |
     *                       |
     *                       |
     *                       |
     * left-------------------------------------right
     *                       |
     *                       |
     *                       |
     *                       |
     *                       |
     * [board-size-1, 0]     down                 [board-size-1, board-size-1]
     */
    /**
     * Distance from the board border for each way.
     * +1 changes the index to a disntace
     */
    const rightDis = (this._boardSize - x);
    const leftDis = x + 1;
    const upDis = y + 1;
    const downDis = (this._boardSize - y);
    const upLeftDis = Math.min(upDis, leftDis);
    const upRightDis = Math.min(upDis, rightDis);
    const downLeftDis = Math.min(downDis, leftDis);
    const downRightDis = Math.min(downDis, rightDis);

    // Check up-left and down-right way
    let upLeftSum = this._countSymbols(x, y, -1, -1, upLeftDis, symbol) 
    let downRightSum = this._countSymbols(x, y, +1, +1, downRightDis, symbol); 
    // Both sums counts current position, therefore -1
    if ((upLeftSum + downRightSum - 1) === this._symbolsToWin){
      return true;
    }

    // Check up-right and down-left way
    let upRightSum = this._countSymbols(x, y, +1, -1, upRightDis, symbol) 
    let downLeftSum = this._countSymbols(x, y, -1, +1, downLeftDis, symbol); 
    // Both sums counts current position, therefore -1
    if ((upRightSum+downLeftSum - 1) === this._symbolsToWin){
      return true;
    }

    // Check left and right way
    let leftSum = this._countSymbols(x, y, -1, 0, leftDis, symbol) 
    let rightSum = this._countSymbols(x, y, +1, 0, rightDis, symbol); 
    // Both sums counts current position, therefore -1
    if ((leftSum + rightSum - 1) === this._symbolsToWin){
      return true;
    }

    // Check up and down way
    let upSum = this._countSymbols(x, y, 0, -1, upDis, symbol) 
    let downSum = this._countSymbols(x, y, 0, +1, downDis, symbol); 
    // Both sums counts current position, therefore -1
    if ((upSum + downSum - 1) === this._symbolsToWin){
      return true;
    }

    // Player did not win
    return false;
  }

  /**
   * Method prepares everything for a new game.
   */
  _newGame() {
    this._cleanBoard();
    this._gameTurns = 0;
  }

  _isMoveCorrect(x, y) {
    let result = true;

    if (x >= this._boardSize || x < 0) {
      console.log(`Invalid move, ${x} is out of bounds.`);
      result = false;
    }
    if (y >= this._boardSize || y < 0) {
      console.log(`Invalid move, ${y} is out of bounds.`);
      result = false;
    }

    if (result === true && this._board[y][x] !== '_') {
      console.log(`Place ${x}:${y} is occupied.`);
      result = false;
    }

    return result;
  }

  /**
   * Method make move and checks if there is a winner.
   * @param x Horizontal coordinate of new symbol. 
   * @param y Vertical coordinate of new symbol.
   */
  move(x, y) {
    if (!this._isMoveCorrect(x, y)) {
      console.log();
      return;
    }
    // Increase total game turns
    this._gameTurns += 1;
    
    // Set new symbol on place
    this._board[y][x] = this._playersSymbols[this._currentPlayer];

    // Print board
    this._printBoard();

    // Is player the winner
    if (this._isPlayerWinner(x, y, this._playersSymbols[this._currentPlayer])) {
      // Inform players
      console.log(`Player with ${this._playersSymbols[this._currentPlayer]} wins!`);
      this._playersScores[this._currentPlayer] += 1;
      this._printScore();
      this._newGame();
      console.log();
      return;
    } 

    // Is game a tie
    if (this._boardSize*this._boardSize === this._gameTurns) {
      // Inform players
      console.log("Draw");
      this._printScore();
      this._newGame();
      return;
    }

    // Change player
    this._changePlayer(this._currentPlayer);
  }
}



//Tests
const game = new TicTacToe();
game.move(1, 2);
game.move(0, 0);
game.move(2, 2);
game.move(1, 1);
game.move(1, 1);
game.move(0, 2);

game.move(0, 1);
game.move(1, 0);
game.move(2, 1);
game.move(0, 0);
game.move(1, 1);

const game1 = new TicTacToe();
game1.move(0, 0);
game1.move(0, 1);
game1.move(1, 1);
game1.move(1, 0);
game1.move(2, 2);

const game2 = new TicTacToe();
game2.move(2, 0);
game2.move(1, 0);
game2.move(1, 1);
game2.move(0, 1);
game2.move(0, 2);

const game3 = new TicTacToe();
game3.move(2, 0);
game3.move(1, 1);
game3.move(1, 0);
game3.move(0, 1);
game3.move(0, 2);
game3.move(0, 0);
game3.move(1, 2);
game3.move(2, 2);

const game4 = new TicTacToe();
game4.move(1, 1);
game4.move(2, 0);
game4.move(1, 0);
game4.move(0, 1);
game4.move(0, 2);
game4.move(0, 0);
game4.move(2, 2);
game4.move(1, 2);
game4.move(2, 1);

const game5 = new TicTacToe(5);
game5.move(0, 2);
game5.move(0, 1);
game5.move(1, 2);
game5.move(1, 1);
game5.move(2, 2);
game5.move(2, 1);
game5.move(3, 2);
game5.move(3, 1);
game5.move(4, 2);
