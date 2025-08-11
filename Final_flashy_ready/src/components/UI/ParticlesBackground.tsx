
import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ParticlesBackground: React.FC = () => {
  const particlesInit = async (engine: any) => {
    await loadFull(engine);
  };
  return (
    <div className="absolute inset-0 -z-10">
      <Particles
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'repulse' },
              onClick: { enable: true, mode: 'push' },
              resize: true
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 100, duration: 0.4 }
            }
          },
          particles: {
            color: { value: ['#ff7eb3', '#7afcff', '#9d7aff'] },
            links: { enable: true, distance: 120, color: '#ffffff22', opacity: 0.2, width: 1 },
            collisions: { enable: false },
            move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, random: false, speed: 0.6, straight: false },
            number: { density: { enable: true, area: 800 }, value: 35 },
            opacity: { value: 0.6 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 4 } }
          },
          detectRetina: true
        }}
      />
    </div>
  );
};

export default ParticlesBackground;
