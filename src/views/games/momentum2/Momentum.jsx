import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import loadImage from './ImageLoader.js';
import useBouncingAnimation from './Animation.js';

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
      <Momentum fire={fire} canvasWidth={dimensions.width} canvasHeight={dimensions.height}/>
    </div>
  )
}

function Momentum({fire, canvasWidth, canvasHeight}) {
  const [image, setImage] = useState(null);
  const imageRef = useRef(null);

  // Image loading
  useEffect(() => {
    loadImage(
      fire,
      (loadedImage) => setImage(loadedImage), // Update the state with the loaded image
      e => console.error("Error loading image:", e)
    );
  }, [fire]);

  // Bouncing animation
  useBouncingAnimation(imageRef, canvasWidth, canvasHeight);

  return (
    <Stage width={canvasWidth} height={canvasHeight} style={{backgroundColor: 'lightblue'}}>
      <Layer>
        <Image 
          ref={imageRef}
          image={image} 
          x={50} 
          y={50}
        />
      </Layer>
    </Stage>
  );


};