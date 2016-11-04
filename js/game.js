
class Game{

  constructor(canvas, width, height, blockSize){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.blockSize = blockSize;
    this.blockColors = {
      EMPTY: '#BDBDBD',
      z: '#FFCDD2' // red
    }


    this.board = [];
    for (let x = 0; x < width; x++){
      let row = [];
      for (let y = 0; y < height; y++){
        row.push(new Tile('EMPTY', x * blockSize, y * blockSize, blockSize));
      }
      this.board.push(row);
    }
  }

  drawBoard(){
    // this.ctx.fillStyle = '#333';
    // this.ctx.lineWidth="1";
    // this.ctx.rect(0, 0, 50, 50);
    // this.ctx.stroke();
    for (let row of this.board){
      for (let tile of row){
        this.drawTile(tile);
      }
    }
  }

  drawTile(tile){
    console.log(tile);
    switch (tile.type){
      case 'EMPTY':
        this.ctx.fillStyle = this.blockColors.empty;
        this.ctx.strokeRect(tile.x, tile.y, tile.size, tile.size);
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
