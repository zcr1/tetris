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

    for (let y = -3; y < this.height; y++){
      // Store 4 extra rows on top but don't draw them
      let row = [];
      for (let x = 0; x < this.width; x++){
        row.push(new Tile('E', x * this.blockSize, y * this.blockSize, this.blockSize));
      }
      this.board.push(row);
    }
  }

  startGame(){
    this.initialize()
    setInterval(this.update.bind(this), 500);
  }

  update(){
    // Game loop
    if (!this.currBlock){
      this.currBlock = this.getNextBlock();
      this.currShapeIndex = 0;
      this.currBlockPos = {x: (this.width / 2) - 2, y: 0};
    }
    else{
      this.updateBlockPos();
    }

    this.drawBoard()
    this.drawCurrentBlock();
  }

  updateBlockPos(){
    // increment y position
    this.currBlockPos.y += this.blockSize;
  }

  getNextBlock(){
    // get 1 of the 7 blocks randomly
    let i = Math.floor(Math.random() * (7));
    let blockChoice = this.blockChoices[i];
    return this.blocks[blockChoice];
  }

  drawBoard(){
    for (let y = 0; y < this.board.length; y++){
      for (let tile of this.board[y]){
        this.drawTile(tile);
      }
    }
  }

  drawTile(tile){
    switch (tile.type){
      case 'E':
        // Empty blocks draw a tiny square in center of tile
        let size = 2;
        let x = (tile.x + this.blockSize) - (this.blockSize / 2) - (size / 2);
        let y = (tile.y + this.blockSize) - (this.blockSize / 2) - (size / 2);
        this.ctx.fillStyle = this.blocks.E.color;
        this.ctx.fillRect(x, y, 2, 2);
        break;

      default:
        this.ctx.fillStyle = this.blocks[tile.type].color;
        this.ctx.fillRect(tile.x, tile.y, tile.size, tile.size);
        break;
    }
  }

  drawCurrentBlock(){
    // Each block shape is 4x4
    this.ctx.fillStyle = this.currBlock.color;
    let shape = this.currBlock.shapes[this.currShapeIndex];
    for (let y = 0; y < 4; y ++){
      for (let x = 0; x < 4; x++){
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
