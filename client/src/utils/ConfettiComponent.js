import React, { useRef} from 'react';
import Confetti from 'react-dom-confetti';

const ConfettiComponent = ({ trigger }) => {
  const confettiRef = useRef(null);

  const config = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

  return (
    <div
      ref={confettiRef}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000 
      }}
    >
      <Confetti active={trigger} config={config} />
    </div>
  );
};

export default ConfettiComponent;
