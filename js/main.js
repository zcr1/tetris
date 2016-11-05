"use_strict";

(function main(){
  let canvas = document.getElementById('canvas');
  let game = new Game(canvas, 12, 20, 30);


  let newGame = document.getElementById('new-game');
  newGame.onclick = function(){
    game.startGame();
  };

  document.addEventListener('keydown', e =>{
    switch (e.which){
      case 37:
        // left
        game.move(-1);
        break;
      case 38:
        // up
        game.rotate();
        break;
      case 39:
        // right
        game.move(1);
        break;
      case 40:
        // down
        game.drop();
        break;
    }
  }, false);


})();

