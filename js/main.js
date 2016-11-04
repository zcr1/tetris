"use_strict";

(function main(){
  let canvas = document.getElementById('canvas');
  let game = new Game(canvas, 12, 20, 30);


  let newGame = document.getElementById('new-game');
  newGame.onclick = function(){
    game.startGame();
  }


})();

