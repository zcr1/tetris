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
    this.blocks = BLOCKS;
    this.initialize();
  }

  initialize(){
    // Initialize a new game
    this.board = [];
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
    setInterval(this.update, 250);
  }

  update(){
    // Game loop
    let nextBlock = this.getNextBlock();


  }

  getNextBlock(){
    // get 1 of 7 blocks randomly
    let i = Math.floor(Math.random() * (7));
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
}


class Tile{

  constructor(type, x, y, size){
    this.type = type;
    this.x = x;
    this.y = y;
    this.size = size;
  }
}
