import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image, Circle } from 'react-konva';
import loadImage from './ImageLoader.js';
import useBouncingAnimation, { getRandomVelocityNudge } from './Animation.js';
import useCollisionDetection from './CollisionDetection.js';

import ball from '../../../public/images/Pokemon_Server-ico.png'
import smallBall from '../../../public/images/pokeball2.png'
import fire from '../../../public/images/volcanobadge-t.png'
import heart from '../../../public/images/soulbadge-t.png'


export default function Wrapper () {
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width:0, height:0 })

  useEffect(() => {
    console.count('useEffectWrapper')
    if (divRef.current?.offsetHeight && divRef.current?.offsetWidth) {
      setDimensions({
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight,
      });
    }
  }, [divRef.current?.offsetHeight, divRef.current?.offsetWidth])

  return (
    <div ref={divRef} style={{width: '700px', height: '700px'}}>
      <Momentum smallBall={smallBall} ball={ball} canvasWidth={dimensions.width} canvasHeight={dimensions.height}/>
    </div>
  )
}

const Momentum = ({ smallBall, ball, canvasWidth, canvasHeight }) => {
  // State hooks for the images of the fire and ball sprites
  const [smallBallImage, setFireImage] = useState(null);
  const [ballImage, setBallImage] = useState(null);

  // Refs for the fire and ball sprites to access their properties
  const smallBallRef = useRef(null);
  const ballRef = useRef(null);

  // State hooks for managing the velocity (direction and speed) of the smallBall sprite
  const [dx, setDx] = useState(getRandomVelocityNudge()*5);
  const [dy, setDy] = useState(getRandomVelocityNudge()*5);

  // Effect hook for loading the smallBall image
  useEffect(() => {
    loadImage(
      smallBall,
      (img) => setFireImage(img),
      (e) => console.error("Error loading fire image:", e)
    );
  }, [smallBall]);

  // Effect hook for loading the ball image
  useEffect(() => {
    loadImage(
      ball,
      (img) => setBallImage(img),
      (e) => console.error("Error loading ball image:", e)
    );
  }, [ball]);

  // Hook for animating the smallBall sprite with bouncing logic
  useBouncingAnimation(smallBallRef, canvasWidth, canvasHeight, setDx, setDy, dx, dy);
  // Effect hook for checking collisions between fire and ball sprites
  useCollisionDetection(smallBallRef, ballRef, dx, dy, setDx, setDy)

  // Rendering the Stage and Layer with smallBall and ball Images
  return (
    <Stage width={canvasWidth} height={canvasHeight} style={{backgroundColor: 'lightblue'}}>
      <Layer>
        <Image ref={smallBallRef} image={smallBallImage} x={50} y={50} draggable />
        <Image ref={ballRef} image={ballImage} x={100} y={100} draggable />
      </Layer>
    </Stage>
  );
};