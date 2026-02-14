import React from 'react';

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
    </>
  );
};

export default Lights;
