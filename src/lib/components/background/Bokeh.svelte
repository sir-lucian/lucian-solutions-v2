<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let animationFrame: number;
	
	interface Particle {
		x: number;
		y: number;
		radius: number;
		color: string;
		speedX: number;
		speedY: number;
		pulseOffset: number;
	}

	let particles: Particle[] = [];

	const colors = [
		'rgba(255, 165, 0, 0.3)',   // Orange
		'rgba(255, 215, 0, 0.25)',  // Gold
		'rgba(255, 69, 0, 0.25)',   // Red-Orange
		'rgba(255, 250, 205, 0.15)' // Warm White
	];

	function createParticle(width: number, height: number): Particle {
		return {
			x: Math.random() * width,
			y: Math.random() * height,
			radius: Math.random() * 60 + 20, // 20px - 80px radius
			color: colors[Math.floor(Math.random() * colors.length)],
			speedX: (Math.random() - 0.5) * 0.2, // Slow drift
			speedY: (Math.random() - 0.5) * 0.2,
			pulseOffset: Math.random() * Math.PI * 2
		};
	}

	function resize() {
		if (canvas) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			initParticles();
		}
	}

	function initParticles() {
		particles = [];
		const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000); 
		for (let i = 0; i < particleCount; i++) {
			particles.push(createParticle(canvas.width, canvas.height));
		}
	}

	function animate() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Time factor for pulsing
		const time = Date.now() * 0.001;

		particles.forEach((p) => {
			// Update position
			p.x += p.speedX;
			p.y += p.speedY;

			// Wrap around edges with buffer matched to max radius
			const buffer = p.radius + 20;
			if (p.x < -buffer) p.x = canvas.width + buffer;
			if (p.x > canvas.width + buffer) p.x = -buffer;
			if (p.y < -buffer) p.y = canvas.height + buffer;
			if (p.y > canvas.height + buffer) p.y = -buffer;

			// Draw
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
			ctx.fillStyle = p.color;
			
			// Pulse opacity slightly for "twinkle"
			// Base opacity is handled by the color alpha
			// We modify globalAlpha to pulse it
			const pulse = 0.8 + Math.sin(time + p.pulseOffset) * 0.2; // roughly 0.6 to 1.0 multiplier
			ctx.globalAlpha = pulse;
			
			ctx.fill();
			ctx.globalAlpha = 1.0; // Reset
		});

		animationFrame = requestAnimationFrame(animate);
	}

	onMount(() => {
		resize();
		window.addEventListener('resize', resize);
		animate();

		return () => {
			window.removeEventListener('resize', resize);
			cancelAnimationFrame(animationFrame);
		};
	});
</script>

<div class="bokeh-background">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.bokeh-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1; /* Behind all content */
		background: radial-gradient(circle at center, #1a1510 0%, #0a0500 100%); /* Deep warm night sky */
		overflow: hidden;
		pointer-events: none;
	}

	canvas {
		display: block;
		filter: blur(20px); /* Enhance bokeh softness via CSS blur */
	}
</style>
