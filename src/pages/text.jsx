import React, { useEffect, useRef, useState } from "react";

export const ParticleText = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const [text, setText] = useState("");

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const generateParticles = (newText) => {
      particles.current = []; // Clear previous particles

      if (newText) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const fontSize = Math.min(canvas.width / newText.length, 200); // Adjust font size dynamically
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(newText, centerX, centerY);

        const textWidth = ctx.measureText(newText).width;
        const imageData = ctx.getImageData(
          centerX - textWidth / 2,
          centerY - fontSize / 2,
          textWidth,
          fontSize
        );

        for (let y = 0; y < imageData.height; y += 2) {
          for (let x = 0; x < imageData.width; x += 2) {
            const index = (y * imageData.width + x) * 4;
            const alpha = imageData.data[index + 3];
            if (alpha > 128) {
              const particleX = centerX - textWidth / 2 + x;
              const particleY = centerY - fontSize / 2 + y;
              particles.current.push({
                x: particleX,
                y: particleY,
                originX: particleX,
                originY: particleY,
                radius: 1,
                color: "white",
                vx: 0,
                vy: 0,
                mass: 1,
              });
            }
          }
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    generateParticles(text);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle) => {
        const dx = particle.originX - particle.x;
        const dy = particle.originY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          particle.vx += (particle.originX - particle.x) * 0.01;
          particle.vy += (particle.originY - particle.y) * 0.01;
        } else {
          particle.vx += (particle.originX - particle.x) * 0.005;
          particle.vy += (particle.originY - particle.y) * 0.005;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

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

        if (distance < 90) {
          particle.vx += dx * 0.02;
          particle.vy += dy * 0.02;
          particle.color = gradient;
        } else {
          particle.color = "white";
        }
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [text]);

  return (
    <div className="">
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text"
        style={{
          position: "absolute",
          top: "30%",
          left: "10px",
          zIndex: 10,
        }}
      />
      <canvas
        className="App"
        ref={canvasRef}
        style={{ display: "block" }}
      ></canvas>
    </div>
  );
};
