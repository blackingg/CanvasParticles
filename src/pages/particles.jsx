import React, { useEffect, useRef, useState } from "react";

const MIN_PARTICLES = 0;

function getRandomPositionInCircle(radius) {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.sqrt(Math.random()) * radius;
  const x = distance * Math.cos(angle);
  const y = distance * Math.sin(angle);
  return { x, y };
}

export const ParticleCircle = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const [numParticles, setNumParticles] = useState(MIN_PARTICLES);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const radius = 200;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    particles.current = [];
    for (let i = 0; i < numParticles; i++) {
      const { x, y } = getRandomPositionInCircle(radius);
      particles.current.push({
        x: centerX + x,
        y: centerY + y,
        originX: centerX + x,
        originY: centerY + y,
        radius: 1,
        color: "white",
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.closePath();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const gradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        100
      );
      gradient.addColorStop(0, "red");
      gradient.addColorStop(1, "white");

      particles.current.forEach((particle) => {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        particle.vx += dx * 0.01;
        particle.vy += dy * 0.01;

        particle.vx *= 0.95; // Damping effect
        particle.vy *= 0.95; // Damping effect

        if (distance < 90) {
          particle.x += (dx / distance) * 6;
          particle.y += (dy / distance) * 6;
          particle.color = gradient;
        } else {
          particle.x += (particle.originX - particle.x) * 0.05;
          particle.y += (particle.originY - particle.y) * 0.05;
          particle.color = "white";
        }
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [numParticles]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSetParticles = () => {
    const newNumParticles = parseInt(inputValue, 10);
    if (isNaN(newNumParticles) || newNumParticles < MIN_PARTICLES) {
      alert(`Number of particles cannot be less than ${MIN_PARTICLES}.`);
    } else {
      setNumParticles(newNumParticles);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute right-4 top-4 z-50 flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={`Enter number of particles (min ${MIN_PARTICLES})`}
          className="border border-gray-300 rounded-md py-2 px-4 outline-none shadow-inner"
        />
        <button
          onClick={handleSetParticles}
          className="ml-2 bg-[#e23131] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#981919] transition duration-300"
        >
          Set Particles
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      ></canvas>
    </div>
  );
};
