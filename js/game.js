class Game{

  constructor(canvas, width, height, blockSize){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.strokeStyle = '#fff';
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
    this.currBlockPos = null;
    this.delta = 0;
    this.score = 0;
    this.gameOver = false;
    let gameover = document.getElementById('gameover');
    gameover.style.display = 'none';

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
    }
    else{
      this.delta += 1;
      if (!this.currBlock){
        this.currShapeIndex = 0;
        this.currBlock = this.getNextBlock();

        // block starts -4 blocks in y direction
        this.currBlockPos = {
          x: (this.width / 2 - 3) * this.blockSize,
          y: -(this.blockSize * 4)
        };
      }
      else if (this.delta >= 15){
        this.updateBlockGravity();
        this.delta = 0;
      }

      this.ctx.clearRect(0, 0, this.width * this.blockSize, this.height * this.blockSize);
      this.drawBoard()
      if (this.currBlock){
        this.drawCurrentBlock();
      }
      this.drawScore();
    }
  }

  updateBlockGravity(){
    this.currBlockPos.y += this.blockSize;

    // Check if current block needs set
    let shape = this.currBlock.shapes[this.currShapeIndex];
    for (let [x, y] of this.getShapeBlocksCords(shape)){
      let xPos = this.currBlockPos.x + (x * this.blockSize);
      let yPos = this.currBlockPos.y + (y * this.blockSize);

      if (this.isCollision(xPos, yPos + this.blockSize)){
        this.setBlock();
        this.clearRows();
        return true;
      }
    }
  }

  isCollision(xPos, yPos){
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

    while (flag){
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
        this.score += 100;
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
    blockChoice = 'I';
    let nextBlock = this.blocks[blockChoice];
    nextBlock.type = blockChoice;
    return nextBlock;
  }

  drawBoard(){
    for (let x = 0; x < this.board.length; x++){
      for (let tile of this.board[x]){
        this.drawTile(tile);
      }
    }
  }

  drawTile(tile){
    this.ctx.fillStyle = this.blocks[tile.type].color;
    if (tile.type == 'E'){
      // Empty blocks draw a tiny square in center of tile
      let size = 2;
      let x = (tile.x + this.blockSize) - (this.blockSize / 2) - (size / 2);
      let y = (tile.y + this.blockSize) - (this.blockSize / 2) - (size / 2);
      this.ctx.fillRect(x, y, 2, 2);
    }
    else{
      this.ctx.fillRect(tile.x, tile.y, tile.size, tile.size);
      this.ctx.strokeRect(tile.x, tile.y, tile.size, tile.size)
    }
  }

  drawCurrentBlock(){
    // Each block shape is 4x4
    this.ctx.fillStyle = this.currBlock.color;

    let shape = this.currBlock.shapes[this.currShapeIndex];

    for (let [x, y] of this.getShapeBlocksCords(shape)){
      let xPos = this.currBlockPos.x + (x * this.blockSize);
      let yPos = this.currBlockPos.y + (y * this.blockSize);
      this.ctx.fillRect(xPos, yPos, this.blockSize, this.blockSize);
      this.ctx.strokeRect(xPos, yPos, this.blockSize, this.blockSize);
    }
  }

  drawScore(){
    let score = document.getElementById('score');
    score.innerHTML = '<span>Score ' + this.score + '</span>';
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

  move(dir){
    let shape = this.currBlock.shapes[this.currShapeIndex];
    let newX = this.currBlockPos.x + (this.blockSize * dir);

    for (let [x, y] of this.getShapeBlocksCords(shape)){
      let xPos = newX + (x * this.blockSize);
      let yPos = this.currBlockPos.y + (y * this.blockSize);

      if (xPos < 0 || xPos >= (this.width * this.blockSize)){
        // out of bounds
        return;
      }

      // check collision
    }

    this.currBlockPos.x = newX;
  }

  rotate(){
    // currShapeIndexor++ or loop back to 0
    if (this.currShapeIndex != null && this.currBlock){
      this.currShapeIndex++;
      if (this.currShapeIndex > (this.currBlock.shapes.length - 1)){
        this.currShapeIndex = 0;
      }
    }
  }

  drop(){
    // instant drop block
    if (this.currBlock){
      while (!this.updateBlockGravity());
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
