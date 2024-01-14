// Animation.js
import { useEffect, useState } from 'react';

const constantVelocity = 10; // Set your desired constant velocity

const getRandomDirection = () => Math.random() * 2 - 1; // Random direction between -1 and 1

const useBouncingAnimation = (ref, canvasWidth, canvasHeight) => {
  const [dx, setDx] = useState(getRandomDirection());
  const [dy, setDy] = useState(getRandomDirection());

  // Adjust the initial velocities to maintain the constant overall velocity
  useEffect(() => {
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    setDx((dx / magnitude) * constantVelocity);
    setDy((dy / magnitude) * constantVelocity);
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (ref.current) {
      const anim = new Konva.Animation((frame) => {
        const node = ref.current;

        let newDx = dx;
        let newDy = dy;

        // Check for horizontal bounds
        if (node.x() + dx > canvasWidth - node.width() || node.x() + dx < 0) {
          newDx = -dx;
        }

        // Check for vertical bounds
        if (node.y() + dy > canvasHeight - node.height() || node.y() + dy < 0) {
          newDy = -dy;
        }

        // Apply the new velocity
        setDx(newDx);
        setDy(newDy);

        // Update position
        node.x(node.x() + newDx);
        node.y(node.y() + newDy);

      }, ref.current.getLayer());

      anim.start();

      return () => anim.stop();
    }
  }, [ref, dx, dy, canvasWidth, canvasHeight]);

  return [dx, dy];
};

export default useBouncingAnimation;
