// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    this.root = theRoot;
    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];
    this.startTime = null;
    this.score = new Text(this.root, 10, 10);
    this.live = new Text(this.root, 810, 10);
    this.numberOfLives = NUMBER_OF_LIFES;
    this.invincible = false;
    // this.highscore = 0;
    this.score.update(0);
    // We add the background image to the game
    addBackground(this.root);
    cloud1(this.root);
  }

  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array
  gameLoop = () => {
    // SCORE COUNTER
    this.live.update(`Drinks until blackout: \n ${this.numberOfLives}`);
    if (!this.startTime) {
      this.startTime = new Date().getTime();
    }

    this.currentTime = new Date().getTime();
    let scoreCounter = Math.floor((this.currentTime - this.startTime) * 0.02);
    this.score.update(`Soberity level: \n ${scoreCounter}`);
    
    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;
    this.lastFrame = new Date().getTime();

    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    let speedCounter = timeDiff + scoreCounter + 2000; //Default +1000

    this.enemies.forEach((enemy) => {
      if (scoreCounter < 100){
        enemy.update((speedCounter) / 100);
      } else if (scoreCounter < 200) {
        enemy.update((speedCounter) / 90);
      } else if (scoreCounter < 300){
        enemy.update((speedCounter) / 70)
      } else if (scoreCounter < 500){
        enemy.update((speedCounter) / 60)
      } else if (scoreCounter < 1000) {
        enemy.update((speedCounter)/ 50);
      } else if (scoreCounter < 2000) {
        enemy.update((speedCounter)/ 45);
      } else {
        enemy.update((speedCounter)/ 40);
      }
    })

    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.destroyed;
    });

    // We need to perform the addition of enemies until we have enough enemies.
    while (this.enemies.length < MAX_ENEMIES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);
      this.enemies.push(new Enemy(this.root, spot));
    }

    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)

    if (this.isPlayerDead() && !this.invincible) {
      // if (this.enemies.forEach((enemy) => {
      //   if (enemy.domElement.src === './images/water.png'){
      //     return true;
      //   }
      // })){
      //   this.numberOfLives += 1;
      //   this.live.update(`Drinks until drunk: ${this.numberOfLives}`);
      // }
      if (this.numberOfLives > 1) {
        this.numberOfLives -= 1;
        this.live.update(`Drinks until drunk: ${this.numberOfLives}`);
        this.invincible = true;
        setTimeout(() => {
          this.invincible = false;
          console.log('No longer invincible');
        }, 2000)
      } else {
        this.gameOver = document.createElement('p');
        this.gameOver.innerText = `WASTED`;
        this.gameOver.className = 'gameOver';
        this.root.appendChild(this.gameOver);
        restartButton.style.display = 'block';
        this.player.domElement.src = 'images/cat1.png';
        this.player.domElement.className = 'catChar';
        app.style.removeProperty('transform');
        lid.style.removeProperty('animation');
        document.removeEventListener('keydown', keydownHandlerReverse);
        this.live.update(`Drinks until blackout: \n Where am I?`);
        this.invincible = true
        return
      };
    }

    if (this.invincible) {
      this.player.domElement.style.animation = 'invincibility 0.5s ease-in-out alternate infinite';
    } else {
      this.player.domElement.style.removeProperty('animation');
    }

    //Drunkness disbilities
    if (this.numberOfLives <= 5) {
      app.style.animation = 'tipsyApp 1s ease-in-out alternate infinite'; //Transform
      tipsyText.style.display = 'block';
    } else {
      app.style.removeProperty('animation');
      tipsyText.style.display = 'none';

    }

    if (this.numberOfLives <= 4){
      document.removeEventListener('keydown', keydownHandler);
      document.addEventListener('keydown', keydownHandlerReverse);
      reverseMoveText.style.display = 'block';
    } else {
      document.removeEventListener('keydown', keydownHandlerReverse);
      document.addEventListener('keydown', keydownHandler);
      reverseMoveText.style.display = 'none';
    }

    if (this.numberOfLives <= 3){
      cloudDrunk.style.display = 'block';
      cloudText.style.display = 'block';
    } else {
      cloudDrunk.style.display = 'none';
      cloudText.style.display = 'none';
    }

    if (this.numberOfLives <= 2){
      reverseScreenText.style.display = 'block';
      app.style.removeProperty('animation');
      app.style.transform = "rotate(180deg)";
      document.removeEventListener('keydown', keydownHandlerReverse);
      document.addEventListener('keydown', keydownHandler);
    } else {
      reverseScreenText.style.display = 'none';
      app.style.removeProperty('transform');
    }

    if (this.numberOfLives <= 1){
      sleepyText.style.display = 'block';
      lid.style.display = 'block';
      lid.style.animation = 'closingUp 0.7s ease-in-out alternate infinite';
    } else {
      sleepyText.style.display = 'none';
      lid.style.display = 'none';
      lid.style.removeProperty('animation');
    }



    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    setTimeout(this.gameLoop, 20);
  };

  // This method is not implemented correctly, which is why
  // the burger never dies. In your exercises you will fix this method.
  isPlayerDead = () => {
    let isCollision = false;
    
    this.enemies.forEach((enemy) => {
      // if (enemy.x === this.player.x && enemy.y >= (GAME_HEIGHT - PLAYER_HEIGHT - ENEMY_HEIGHT) && enemy.domElement.src === WATER) {
      if (enemy.x === this.player.x && enemy.y >= (GAME_HEIGHT - PLAYER_HEIGHT - ENEMY_HEIGHT) && enemy.hasAlreadyHit === false) {
        enemy.hasAlreadyHit = true;
        if(enemy.bottleType === WATER){
          if(this.numberOfLives <= 5){
            this.numberOfLives += 1;
          } else {
            this.numberOfLives += 0;
          }
        } else {
          isCollision = true;
        }
      }
    })
    return isCollision;
  };
  restart = () => {
    this.startTime = null;
    this.score.update(0);
    this.numberOfLives = NUMBER_OF_LIFES;
    // cloudDrunk.style.display = 'none';
    this.invincible = true;
    setTimeout(() => {
      this.invincible = false;
      console.log('No longer invincible');
    }, 2000)
  }
}
