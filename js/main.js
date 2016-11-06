(function main(){
  let gameCanvas = document.getElementById('game-canvas');
  let nextCanvas = document.getElementById('next-canvas');
  let game = new Game(gameCanvas, nextCanvas, 12, 20, 30);
  game.startGame();

  document.addEventListener('keydown', e =>{
    switch (e.which){
      case 37:
        // left
        e.preventDefault();
        game.move(-1);
        break;
      case 38:
        // up
        e.preventDefault();
        game.rotate();
        break;
      case 39:
        // right
        e.preventDefault();
        game.move(1);
        break;
      case 40:
        // down
        e.preventDefault();
        game.drop();
        break;
      case 82:
        // r
        e.preventDefault();
        game.startGame();
    }
  }, false);
})();
