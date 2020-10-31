// We create an instance of the Engine class. Looking at our index.html,
// we see that it has a div with an id of `"app"`
const gameEngine = new Engine(document.getElementById('app'));
const startButton = document.querySelector('.startGame');
const restartButton = document.querySelector('.restartGame');
const background = document.querySelector('.background');
const titleDiv = document.querySelector('.titleDiv');
background.src = 'images/office.png'; //BACKGROUND
const cloudDrunk = document.querySelector('.cloud');
const app = document.querySelector('#app');

//Drunkness stages
const tipsyText = document.querySelector('.tipsyText');
const reverseMoveText = document.querySelector('.reverseMoveText');
const cloudText = document.querySelector('.cloudText');
const reverseScreenText = document.querySelector('.reverseScreenText');
const sleepyText = document.querySelector('.sleepyText');
const lid = document.querySelector('.lid');

const audio = new Audio('./audio/lofi.mp3');
audio.volume = 0.2;

// keydownHandler is a variable that refers to a function. The function has one parameter
// (does the parameter name matter?) which is called event. As we will see below, this function
// will be called every time the user presses a key. The argument of the function call will be an object.
// The object will contain information about the key press, such as which key was pressed.
const keydownHandler = (event) => {
  // event.code contains a string. The string represents which key was press. If the
  // key is left, then we call the moveLeft method of gameEngine.player (where is this method defined?)
  if (event.code === 'ArrowLeft') {
    gameEngine.player.moveLeft();
    gameEngine.player.domElement.className = 'turnLeft';
  }

  // If `event.code` is the string that represents a right arrow keypress,
  // then move our hamburger to the right
  if (event.code === 'ArrowRight') {
    gameEngine.player.moveRight();
    gameEngine.player.domElement.className = 'turnRight';
  }
};

const keydownHandlerReverse = (event) => {
  if (event.code === 'ArrowRight') {
    gameEngine.player.moveLeft();
    gameEngine.player.domElement.className = 'turnLeft';
  }
  if (event.code === 'ArrowLeft') {
    gameEngine.player.moveRight();
    gameEngine.player.domElement.className = 'TurnRight';
  }
}

// We add an event listener to document. document the ancestor of all DOM nodes in the DOM.
document.addEventListener('keydown', keydownHandler);

// We call the gameLoop method to start the game
// gameEngine.gameLoop();
startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  titleDiv.style.display = 'none';
  gameEngine.player.domElement.style.display = 'block';
  gameEngine.score.domElement.style.display = 'block';
  gameEngine.live.domElement.style.display = 'block';
  gameEngine.gameLoop();
  background.src = 'images/background.jpg'; //BACKGROUND
  audio.play()
});

restartButton.addEventListener('click', () => {
  gameEngine.restart()
  gameEngine.gameLoop();
  restartButton.style.display = 'none';
  gameEngine.gameOver.style.display = 'none';
  gameEngine.player.domElement.src = 'images/male_char_1.png';
  gameEngine.player.domElement.className = 'playerChar';
  document.addEventListener('keydown', keydownHandler);
});

// const audio = document.querySelector('.backgroundSound');
// console.log(audio);

// window.addEventListener("DOMContentLoaded", () => {
//   audio.volume = 0.2;
//   setTimeout(() => {
//     audio.play()}, 1000);
// })
