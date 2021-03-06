class Game{

  constructor(gameCanvas, nextCanvas, width, height, blockSize){
    this.gameCtx = gameCanvas.getContext('2d');
    this.gameCtx.strokeStyle = '#fff';
    this.nextCtx = nextCanvas.getContext('2d');
    this.nextCtx.strokeStyle = '#fff';
    this.width = width;
    this.height = height;
    this.blockSize = blockSize;
    this.blockChoices = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    this.blocks = BLOCKS;
    this.loopInterval = null;
    this.initialize();
  }

  initialize(){
    // Initialize a new game
    this.board = [];
    this.currBlock = null;
    this.nextBlock = null;
    this.currBlockPos = null;
    this.delta = 0;
    this.score = 0;
    this.gameOver = false;
    this.highScore = localStorage.getItem('high-score') || 0;

    let gameover = document.getElementById('gameover');
    gameover.style.display = 'none';

    this.getNextBlock();

    for (let x = 0; x < this.width; x++){
      let row = [];
      for (let y = 0; y < this.height; y++){
        row.push(new Tile('E', x * this.blockSize, y * this.blockSize, this.blockSize));
      }
      this.board.push(row);
    }
  }

  startGame(){
    this.initialize()
    if (this.loopInterval){
      clearInterval(this.loopInterval);
    }
    this.loopInterval = setInterval(this.update.bind(this), 20);
  }

  update(){
    // Game loop
    if (this.gameOver){
      clearInterval(this.loopInterval);
      this.drawGameOver();
      this.setHighScore();
    }
    else{
      this.delta += 1;
      if (!this.currBlock){
        this.currShapeIndex = 0;
        this.currBlock = this.nextBlock;
        this.getNextBlock();

        // block starts -4 blocks in y direction
        this.currBlockPos = {
          x: (this.width / 2 - 2) * this.blockSize,
          y: -(this.blockSize * 4)
        };
      }
      else if (this.delta >= 15){
        this.updateBlockGravity();
        this.delta = 0;
        this.score+= 2;
      }

      // clear both canvas
      this.gameCtx.clearRect(0, 0, this.width * this.blockSize, this.height * this.blockSize);
      this.nextCtx.clearRect(0, 0, 4 * this.blockSize, 4 * this.blockSize);

      // draw functions
      this.drawBoard()
      this.drawNextBlock();
      this.drawCurrentBlock();
      this.drawScore();
    }
  }

  checkBlockSet(xPos, yPos, shape){
    // Check if current block needs set
    for (let [xCord, yCord] of this.getShapeBlocksCords(shape)){
      let x = this.currBlockPos.x + (xCord * this.blockSize);
      let y = this.currBlockPos.y + (yCord * this.blockSize);

      if (this.shouldSet(x, y + this.blockSize)){
        this.setBlock();
        this.clearRows();
        return true;
      }
    }
  }

  updateBlockGravity(){
    // Check if current block needs set
    let shape = this.currBlock.shapes[this.currShapeIndex];

    if (!this.checkBlockSet(this.currBlockPos.x, this.currBlockPos.y, shape)){
      this.currBlockPos.y += this.blockSize;
      return this.checkBlockSet(this.currBlockPos.x, this.currBlockPos.y, shape);
    }
  }

  shouldSet(xPos, yPos){
    // is yPos touching the bottom?
    if ((yPos) == (this.blockSize * this.height)){
      return true;
    }
    // touching another block?
    let xCord = (xPos / this.blockSize);
    let yCord = (yPos / this.blockSize);

    // still above board
    if (yCord < 0){
      return false;
    }

    return this.board[xCord][yCord].type != 'E';
  }

  clearRows(){
    let flag = true

    while (flag && !this.gameOver){
      flag = false;

      yloop:
      for (let y = 0; y < this.height; y++){
        for (let x = 0; x < this.width; x++){
          if (this.board[x][y].type == 'E'){
            continue yloop;
          }
        }

        // clear row
        for (let x = 0; x < this.width; x++){
          this.board[x][y].type = 'E'
        }

        // drop all blocks above
        for (let y2 = y; y2 > 0; y2--){
          for (let x = 0; x < this.width; x++){
            this.board[x][y2].type = this.board[x][y2 - 1].type;
          }
        }

        flag = true;
        this.score += 1000;
      }
    }
  }

  setBlock(){
    // Set the current block "in stone" and check for game over
    let shape = this.currBlock.shapes[this.currShapeIndex];
    for (let [x, y] of this.getShapeBlocksCords(shape)){
      let xCord = (this.currBlockPos.x / this.blockSize) + x;
      let yCord = (this.currBlockPos.y / this.blockSize) + y;

      if (yCord < 0){
        this.gameOver = true;
        return;
      }

      this.board[xCord][yCord].type = this.currBlock.type;
    }

    this.currBlock = null;
  }

  getNextBlock(){
    // get 1 of the 7 blocks randomly
    let i = Math.floor(Math.random() * (7));
    let blockChoice = this.blockChoices[i];
    let nextBlock = this.blocks[blockChoice];
    nextBlock.type = blockChoice;
    this.nextBlock = nextBlock;
  }

  drawBoard(){
    for (let x = 0; x < this.board.length; x++){
      for (let tile of this.board[x]){
        this.drawTile(tile);
      }
    }
  }

  drawTile(tile){
    this.gameCtx.fillStyle = this.blocks[tile.type].color;
    if (tile.type == 'E'){
      // Empty blocks draw a tiny square in center of tile
      let size = 2;
      let x = (tile.x + this.blockSize) - (this.blockSize / 2) - (size / 2);
      let y = (tile.y + this.blockSize) - (this.blockSize / 2) - (size / 2);
      this.gameCtx.fillRect(x, y, 2, 2);
    }
    else{
      this.gameCtx.fillRect(tile.x, tile.y, tile.size, tile.size);
      this.gameCtx.strokeRect(tile.x, tile.y, tile.size, tile.size)
    }
  }

  drawCurrentBlock(){
    if (!this.currBlock){
      return;
    }

    this.gameCtx.fillStyle = this.currBlock.color;

    let shape = this.currBlock.shapes[this.currShapeIndex];

    for (let [x, y] of this.getShapeBlocksCords(shape)){
      let xPos = this.currBlockPos.x + (x * this.blockSize);
      let yPos = this.currBlockPos.y + (y * this.blockSize);
      this.gameCtx.fillRect(xPos, yPos, this.blockSize, this.blockSize);
      this.gameCtx.strokeRect(xPos, yPos, this.blockSize, this.blockSize);
    }
  }

  drawNextBlock(){
    // Draw the next block preview
    let shape = this.nextBlock.shapes[0];
    for (let [x, y] of this.getShapeBlocksCords(shape)){
      let xPos = x * this.blockSize;
      let yPos = y * this.blockSize;
      this.nextCtx.fillStyle = this.nextBlock.color;
      this.nextCtx.fillRect(xPos, yPos, this.blockSize, this.blockSize);
      this.nextCtx.strokeRect(xPos, yPos, this.blockSize, this.blockSize)
    }
  }

  drawScore(){
    let score = document.getElementById('score');
    score.innerHTML = '<span>Score ' + this.score + '</span>';

    let highScore = document.getElementById('high-score');
    highScore.innerHTML = '<span>High Score ' + this.highScore + '</span>';
  }

  drawGameOver(){
    let gameover = document.getElementById('gameover');
    gameover.style.display = 'block';
  }

  * getShapeBlocksCords(shape){
    // Generator to return cords in shape that are set to 1
    for (let x = 0; x < 4; x++){
      for (let y = 0; y < 4; y++){
        if (shape[y][x] == 1){
          yield [x, y];
        }
      }
    }
  }

  isOutOfBounds(xPos, yPos, shape){
    for (let [xCord, yCord] of this.getShapeBlocksCords(shape)){
      let x = xPos + (xCord * this.blockSize);
      let y = yPos + (yCord * this.blockSize);

      if (x < 0 || x >= (this.width * this.blockSize)){
        return true;
      }
    }
  }

  isCollision(xPos, yPos, shape){
    for (let [xCord, yCord] of this.getShapeBlocksCords(shape)){
      let x = (xPos / this.blockSize) + xCord;
      let y = (yPos / this.blockSize) + yCord;

      if (y >= 0 && x < this.width && this.board[x][y].type != 'E'){
        return true;
      }
    }
    return false;
  }

  move(dir){
    if (!this.currBlock){
      return;
    }
    let shape = this.currBlock.shapes[this.currShapeIndex];
    let newX = this.currBlockPos.x + (this.blockSize * dir);

    // check bounds
    if (this.isOutOfBounds(newX, this.currBlockPos.y, shape)){
      return;
    }

    // check collisions
    if (this.isCollision(newX, this.currBlockPos.y, shape)){
      return;
    }

    // good to move
    this.currBlockPos.x = newX;
  }

  rotate(){
    let nextIndex = this.currShapeIndex;
    if (this.currBlock){
      nextIndex++;
      if (nextIndex > (this.currBlock.shapes.length - 1)){
        nextIndex = 0;
      }
    }

    if (nextIndex == this.currShapeIndex){
      // no rotation done
      return;
    }

    // check if out of bounds
    let shape = this.currBlock.shapes[nextIndex];
    if (this.isOutOfBounds(this.currBlockPos.x, this.currBlockPos.y, shape)){
      return;
    }

    // check collisions
    if (this.isCollision(this.currBlockPos.x, this.currBlockPos.y, shape)){
      return;
    }

    // rotation is good to go
    this.currShapeIndex = nextIndex;
  }

  drop(){
    // instant drop block
    if (this.currBlock){
      while (!this.updateBlockGravity() && !this.gameOver);
    }
  }

  setHighScore(){
    if (this.score > this.highScore){
      this.highScore = this.score;
      localStorage.setItem('high-score', this.score);
    }
  }
}


class Tile{

  constructor(type, x, y, size){
    this.type = type;
    this.x = x;
    this.y = y;
    this.size = size;
  }
}
