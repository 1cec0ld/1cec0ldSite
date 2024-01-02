export function spritesCollide(sprite, otherSprite){
  let spriteRadius = sprite.width*sprite.anchor._x;
  let otherSpriteRadius = otherSprite.width*otherSprite.anchor._x;
  let minimumDistanceAllowedSquared = Math.pow(spriteRadius+otherSpriteRadius,2);
  return (Math.pow(sprite.x-otherSprite.x,2)+Math.pow(sprite.y-otherSprite.y,2) < minimumDistanceAllowedSquared);
}


export function vectorLength(vec){
  return Math.sqrt(vec.x*vec.x + vec.y*vec.y);
}

export function angleBetweenVectors(one, two){
  let dotProduct = (one.x * two.x) + (one.y * two.y);
  let lengthOne = vectorLength(one);
  let lengthTwo = vectorLength(two);
  let cosine = dotProduct/(lengthOne*lengthTwo);
  return Math.acos(cosine);
}

export function vectorBetweenSprites(one, two){
  return {
    x: two.x-one.x,
    y: two.y-one.y
  };
}

export function bounceVector(velocity, relativePosition){
  let normalizedPosition = normalizeVector(relativePosition);
  let dotProductResult = dotProduct(velocity, normalizedPosition);
  return {
    x: velocity.x - (2 * dotProductResult * normalizedPosition.x),
    y: velocity.y - (2 * dotProductResult * normalizedPosition.y)
  };
}

function dotProduct(vec1,vec2){
  return vec1.x*vec2.x + vec1.y*vec2.y;
}
function normalizeVector(vec){
  let x = vec.x/vectorLength(vec);
  let y = vec.y/vectorLength(vec);
  return {
    x: x,
    y: y
  }
}