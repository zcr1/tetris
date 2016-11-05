// move left, right
// rotate up
// fall down


class Game{

  constructor(canvas, width, height, blockSize){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.blockSize = blockSize;
    this.blockChoices = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    this.blocks = BLOCKS;
    this.initialize();
  }

  initialize(){
    // Initialize a new game
    this.board = [];
    this.currBlock = null;
    this.currBlockPos = null;

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
    setInterval(this.update.bind(this), 250);
  }

  update(){
    // Game loop
    if (!this.currBlock){
      this.currShapeIndex = 0;
      this.currBlock = this.getNextBlock();
      this.currBlockPos = {
        x: (this.width / 2 - 2) * this.blockSize,
        y: -(this.blockSize * 4) // top starts 4 blocks negative
      };
    }
    else{
      this.updateBlock();
    }

    this.ctx.clearRect(0, 0, this.width * this.blockSize, this.height * this.blockSize);
    this.drawBoard()
    if (this.currBlock){
      this.drawCurrentBlock();
    }
  }

  updateBlock(){
    this.currBlockPos.y += this.blockSize;

    // Check if current block needs set
    let shape = this.currBlock.shapes[this.currShapeIndex];
    for (let x = 0; x < 4; x++){
      for (let y = 0; y < 4; y++){
        if (shape[x][y] == 1){
          let xPos = this.currBlockPos.x + (x * this.blockSize);
          let yPos = this.currBlockPos.y + (y * this.blockSize);
          if (this.isCollision(xPos, yPos + this.blockSize)){
            this.setBlock();
            return;
          }
        }
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

  setBlock(){
    // Set the current block "in stone"
    let shape = this.currBlock.shapes[this.currShapeIndex];
    for (let x = 0; x < 4; x++){
      for (let y = 0; y < 4; y++){
        if (shape[x][y] == 1){
          let xCord = (this.currBlockPos.x / this.blockSize) + x;
          let yCord = (this.currBlockPos.y / this.blockSize) + y;
          this.board[xCord][yCord].type = this.currBlock.type;
        }
      }
    }

    this.currBlock = null;
  }

  getNextBlock(){
    // get 1 of the 7 blocks randomly
    let i = Math.floor(Math.random() * (7));
    let blockChoice = this.blockChoices[i];
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
    }
  }

  drawCurrentBlock(){
    // Each block shape is 4x4
    this.ctx.fillStyle = this.currBlock.color;
    let shape = this.currBlock.shapes[this.currShapeIndex];

    for (let x = 0; x < 4; x++){
      for (let y = 0; y < 4; y++){
        if (shape[x][y] == 1){
          let xPos = this.currBlockPos.x + (x * this.blockSize);
          let yPos = this.currBlockPos.y + (y * this.blockSize);
          this.ctx.fillRect(xPos, yPos, this.blockSize, this.blockSize);
        }
      }
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
