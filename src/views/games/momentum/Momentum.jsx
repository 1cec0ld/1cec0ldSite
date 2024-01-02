import { useCallback, useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import ball from '../../../public/images/Pokemon_Server-ico.png'
import smallBall from '../../../public/images/pokeball2.png'
import fire from '../../../public/images/volcanobadge-t.png'
import heart from '../../../public/images/soulbadge-t.png'
import { angleBetweenVectors, bounceVector, spritesCollide, vectorBetweenSprites, vectorLength } from './utilities';


const  GameBoard = ({lives, setLives, score, setScore}) => {
  const GAME_WIDTH = 700;
  const GAME_HEIGHT = 700;
  const app = new PIXI.Application({background: 0x1099bb, width: GAME_WIDTH, height: GAME_HEIGHT}); 
  const enemyCount = 2;
  const enemyStartSpeed = 2;
  const MAX_LIVES = 5;
  const MAX_POWERUPS_VISIBLE = 3;


  let dragTarget = null;
  
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerup', onDragEnd);
  app.stage.on('pointerupoutside', onDragEnd);
  
  const texture_player = PIXI.Texture.from(ball);
  const texture_player_width = 32;
  texture_player.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  const texture_enemy = PIXI.Texture.from(smallBall);
  const texture_enemy_width = 16;
  texture_enemy.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  const texture_fire = PIXI.Texture.from(fire);
  const texture_fire_width = 16;
  texture_fire.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  const texture_heart = PIXI.Texture.from(heart);
  const texture_heart_width = 16;
  texture_heart.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  
  const stats = {lives: 3, score: 0}


  let player = createPlayer(app.screen.width/2, app.screen.height/2);
  let enemies = [];
  let powerups = [];
  for( let x = 0; x < enemyCount; x++){
    createEnemy(
      Math.floor(Math.random() * app.screen.width),
      Math.floor(Math.random() * app.screen.height)
    );
  }
  const gameLoopFn = (delta) => gameLoop(delta, stats);
  function createPlayer(x, y){
      // create our little friend..
      const player = new PIXI.Sprite(texture_player);
  
      // enable interactive... this will allow it to respond to mouse and touch events
      player.eventMode = 'static';
  
      // this button mode will mean the hand cursor appears
      player.cursor = 'pointer';
  
      // center the anchor point
      player.anchor.set(0.5);
  
  
      // setup events for mouse + touch using
      // the pointer events
      player.on('pointerdown', onDragStart, player);
  
      // move the sprite to its designated position
      player.x = x;
      player.y = y;

      player.lastX = x;
      player.lastY = y;

      player.velocity = {x: 0, y: 0};
  
      // add it to the stage
      app.stage.addChild(player);
      return player;
  }
  function createEnemy(x, y){
      const enemy = new PIXI.Sprite(texture_enemy);
      
      enemy.anchor.set(0.5);
      enemy.interactive = true;
      enemy.x = Math.min(Math.max(x, 16), GAME_WIDTH-16);
      enemy.y = Math.min(Math.max(y, 16), GAME_HEIGHT-16);
      
      //generate randomized vectors, get their magnitude (the hypotenuse) so I can divide by it
      let preNormalize = {
          x: Math.random()*2 - 1,
          y: Math.random()*2 - 1
      }
      let hypotenuse = vectorLength(preNormalize);
      
      //use those vectors but divide by the hypotenuse to make the total magnitude 1 
      //multiply by start speed because 1 is kinda slow
      enemy.direction = {x: (enemyStartSpeed / hypotenuse) * preNormalize.x , y: (enemyStartSpeed / hypotenuse) * preNormalize.y};
      enemy.timeboost = 0;
      
      enemies.push(enemy);

      // add it to the stage
      app.stage.addChild(enemy);
  }
  function createPowerup(x,y, stat, texture){
      const powerup = new PIXI.Sprite(texture);
      powerup.stat = stat;
      powerup.anchor.set(0.5);
      powerup.x = Math.min(Math.max(x, 16), GAME_WIDTH-16);
      powerup.y = Math.min(Math.max(y, 16), GAME_WIDTH-16);
      
      
      
      powerups.push(powerup);
      
      app.stage.addChild(powerup);
  }
  
  function onDragStart(){
      // store a reference to the data
      // the reason for this is because of multitouch
      // we want to track the movement of this particular touch
      // this.data = event.data;
      dragTarget = this;
      app.stage.on('pointermove', onDragMove);
  }
  function onDragMove(event){
    if (!dragTarget)return;
    dragTarget.lastX = dragTarget.x;
    dragTarget.lastY = dragTarget.y;
    dragTarget.parent.toLocal(event.global, null, dragTarget.position);
    containPlayer(dragTarget, {x: 0, y: 0, width: app.screen.width, height: app.screen.height});
  }

  function containPlayer(sprite, container){
    let collision = undefined;

    //Left
    if (sprite.x < container.x+texture_player_width*sprite.anchor._x) {
      sprite.x = container.x+texture_player_width*sprite.anchor._x;
      collision = "left";
    }

    //Top
    if (sprite.y < container.y+texture_player_width*sprite.anchor._y) {
      sprite.y = container.y+texture_player_width*sprite.anchor._y;
      collision = "top";
    }

    //Right
    if (sprite.x > container.width - texture_player_width*sprite.anchor._x) {
      sprite.x = container.width - texture_player_width*sprite.anchor._x;
      collision = "right";
    }

    //Bottom
    if (sprite.y > container.height - texture_player_width*sprite.anchor._y) {
      sprite.y = container.height - texture_player_width*sprite.anchor._y;
      collision = "bottom";
    }

    //Return the `collision` value
    return collision;
  }
  function containEnemy(sprite, container){
    let collision = undefined;
    let tweak = 0.15;

    //Left
    if (sprite.x < container.x + texture_enemy_width*sprite.anchor._x) {
      sprite.x = container.x + texture_enemy.width*sprite.anchor._x;
      sprite.direction.x *= -1;
      sprite.direction.x += tweak*(Math.random()-1);
      collision = "left";
    }

    //Top
    if (sprite.y < container.y + texture_enemy_width*sprite.anchor._y) {
      sprite.y = container.y + texture_enemy.width*sprite.anchor._y;
      sprite.direction.y *= -1;
      sprite.direction.y += tweak*(Math.random()-1);
      collision = "top";
    }

    //Right
    if (sprite.x > container.width - texture_enemy_width*sprite.anchor._x) {
      sprite.x = container.width - texture_enemy.width*sprite.anchor._x;
      sprite.direction.x *= -1;
      sprite.direction.x += tweak*(Math.random()-1);
      collision = "right";
    }

    //Bottom
    if (sprite.y > container.height - texture_enemy_width*sprite.anchor._y) {
      sprite.y = container.height - texture_enemy_width*sprite.anchor._y
      sprite.direction.y *= -1;
      sprite.direction.y += tweak*(Math.random()-1);
      collision = "bottom";
    }

    //Return the `collision` value
    return collision;
}
  function onDragEnd(){
    if (dragTarget){
      app.stage.off('pointermove', onDragMove);
      dragTarget = null;
    }
  }

  function gameLoop(delta, stats){
    player.velocity.x = (player.x-player.lastX) / delta;
    player.velocity.y = (player.y-player.lastY) / delta;
    

    player.lastX = player.x;
    player.lastY = player.y;
    
    enemies.forEach(function(enemy, index, object) {
      enemy.rotation = Math.sign(enemy.direction.y)*angleBetweenVectors(enemy.direction, {x:1,y:0})+Math.PI/2;
      enemy.x = enemy.x + enemy.direction.x;
      enemy.y = enemy.y + enemy.direction.y;
      containEnemy(enemy, {x: 0, y: 0, width: app.screen.width, height: app.screen.height});
      
      if(spritesCollide(enemy,player)){
        //console.log(enemy.direction)
        //console.log(vectorBetweenSprites(enemy,player))
        //console.log(`enemy collision. Lives: ${lives}. angleBetweenVectors: ${angleBetweenVectors(enemy.direction, vectorBetweenSprites(enemy,player))}`)
        if(angleBetweenVectors(enemy.direction, vectorBetweenSprites(enemy,player)) <= Math.PI/2){
          setLives(prev => {
            stats.lives = prev - 1;
            if(stats.lives == 0){
              app.ticker.remove(gameLoopFn);
            }
            return prev - 1;
          });
          
          enemy.direction = bounceVector(enemy.direction, vectorBetweenSprites(enemy, player));
          
        } else {
          setScore(prev => {
            let increase = Math.round(vectorLength(player.velocity))
            stats.score = prev + increase;
            return prev + increase;
          });
          enemy.direction.x += player.velocity.x;
          enemy.direction.y += player.velocity.y;
        }
      }
    });
    console.log('gameloop?', stats.lives, stats.score)
    /*if(stats.lives == 0){
      app.ticker.remove(gameLoopFn);
    }*/
    if(stats.lives > 0){
      powerups.forEach(function(powerup, index, object){
        if(spritesCollide(powerup, player)){
          switch(powerup.stat){
            case 0:
              powerups.splice(index,1);
              app.stage.removeChild(powerup);
              enemies.forEach(function(enemy){
                enemy.direction.x = enemy.direction.x/(Math.abs(.1*enemy.direction.x) + 1);
                enemy.direction.y = enemy.direction.y/(Math.abs(.1*enemy.direction.y) + 1);
              });
              break;
            case 1:
              if(stats.lives < MAX_LIVES){
                app.stage.removeChild(powerup);
                powerups.splice(index,1);
                setLives(prev => {
                  stats.lives = prev + 1;
                  return prev + 1;
                })
              }
              break;
            default:
              alert("Unhandled powerup.stat: " + powerup.stat);
          }
        }
      });
      
      if(powerups.length < MAX_POWERUPS_VISIBLE && Math.random() > 0.95){
        if(((Math.round(Date.now()/100)) % 50) == 0){
          createPowerup(
            Math.floor(Math.random() * app.screen.width),
            Math.floor(Math.random() * app.screen.height),
            0,
            texture_fire
          );
        } else if(((Math.round(Date.now()/100)) % 50) == 1){
          createPowerup(
            Math.floor(Math.random() * app.screen.width),
            Math.floor(Math.random() * app.screen.height),
            1,
            texture_heart
          );
        }
      }
    }
  }

  useEffect(() => {
    document.getElementById('game').innerHTML = '';
    document.getElementById('game').appendChild(app.view);
    app.ticker.add(gameLoopFn);
    return () => {
      app.ticker.remove(gameLoopFn)
    }
  },[])

  return (
    <div id="game"/>
  )
}

const ScoreSheet = ({lives, score}) => {
  return (
    <div>
      <div id="score">Score: {score}</div>
      <div id="lives">Lives: {lives}</div>
      <p>Drag the large player around, aiming to hit the enemies.</p> 
      <p>Hit them in their vulnerable white zone, don't let them hit you with their tough red zone!</p>
      <p>Harder hits give you more points! Powerups give you bonuses!</p>
    </div>
  )
}

export default function Momentum() {
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  return (
    <div>
      <GameBoard score={score} setScore={setScore} lives={lives} setLives={setLives}/>
      <ScoreSheet score={score} lives={lives}/>
    </div>
  )
}