import { useEffect } from 'react';

export const getRandomVelocityNudge = () => Math.random() * 0.4 - 0.2; 
// Generates a small random number between -0.2 and 0.2

const useBouncingAnimation = (ref, canvasWidth, canvasHeight, setDx, setDy, dx, dy) => {
  useEffect(() => {
    if (ref.current) {
      const anim = new Konva.Animation(() => {
        const node = ref.current;

        let newX = node.x() + dx;
        let newY = node.y() + dy;

        // Check for horizontal bounds
        if (newX > canvasWidth - node.width() || newX < 0) {
          setDx(-dx + getRandomVelocityNudge()); // Reverse and slightly randomize horizontal direction
        }

        // Check for vertical bounds
        if (newY > canvasHeight - node.height() || newY < 0) {
          setDy(-dy + getRandomVelocityNudge()); // Reverse and slightly randomize vertical direction
        }

        node.x(newX);
        node.y(newY);

      }, ref.current.getLayer());

      anim.start();
      return () => anim.stop();
    }
  }, [ref, canvasWidth, canvasHeight, setDx, setDy, dx, dy]);
};

export default useBouncingAnimation;
