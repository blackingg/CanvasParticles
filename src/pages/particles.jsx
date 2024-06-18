import React, { useEffect, useRef } from "react";

const numParticles = 1800;

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const radius = 200;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

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
        setTimeout(() => {}, 20);
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
  }, []);

  return (
    <canvas
      className="App"
      ref={canvasRef}
    ></canvas>
  );
};
