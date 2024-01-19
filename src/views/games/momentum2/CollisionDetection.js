import { useEffect } from 'react';
export const checkCircleCollision = (circle1, circle2) => {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const radiusSum = circle1.radius + circle2.radius;
  return distance < radiusSum;
};

export const reflect = (velocity, normal) => {

  // Normalize the normal vector
  const normMagnitude = Math.sqrt(normal.dx * normal.dx + normal.dy * normal.dy);

  // Check for zero magnitude to avoid division by zero
  if (normMagnitude === 0) {
    return { dx: 0, dy: 0 };
  }

  const norm = {
    dx: normal.dx / normMagnitude,
    dy: normal.dy / normMagnitude,
  };

  // Calculate the dot product of V and N
  const dotProduct = velocity.dx * norm.dx + velocity.dy * norm.dy;

  // Reflect the velocity across the normal vector
  const reflectedVelocity = {
    dx: velocity.dx - 2 * dotProduct * norm.dx,
    dy: velocity.dy - 2 * dotProduct * norm.dy,
  };

  return reflectedVelocity;
};

// useCollisionDetection
const useCollisionDetection = (fireRef, ballRef, dx, dy, setDx, setDy) => {
  useEffect(() => {
    const checkCollision = () => {
      const fire = fireRef.current;
      const ball = ballRef.current;
      if (fire && ball) {
        // Define the center points of the fire and ball images
        const fireCenter = { 
          x: fire.x() + fire.width() / 2, 
          y: fire.y() + fire.height() / 2 
        };
        const ballCenter = { 
          x: ball.x() + ball.width() / 2, 
          y: ball.y() + ball.height() / 2 
        };

        // Representing the sprites as circles for collision detection
        const fireCircle = { x: fireCenter.x, y: fireCenter.y, radius: fire.width() / 2 };
        const ballCircle = { x: ballCenter.x, y: ballCenter.y, radius: ball.width() / 2 };

        if (checkCircleCollision(fireCircle, ballCircle)) {

          // Calculate the normal at the collision point
          const normal = { dx: fireCenter.x - ballCenter.x, dy: fireCenter.y - ballCenter.y };
          const incomingVelocity = { dx, dy };
          const newVelocity = reflect(incomingVelocity, normal);

          setDx(newVelocity.dx);
          setDy(newVelocity.dy);
        }
      }
    };

    const anim = new Konva.Animation(() => {
      checkCollision();
    }, fireRef.current.getLayer());

    anim.start();
    return () => anim.stop();
  }, [fireRef, ballRef, dx, dy, setDx, setDy]);
};

export default useCollisionDetection;
