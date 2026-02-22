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
		'rgba(100, 0, 20, 0.4)',   // Deep Burgundy
		'rgba(160, 0, 30, 0.3)',   // Dark Red
		'rgba(220, 20, 60, 0.25)', // Vivid Crimson
		'rgba(255, 120, 30, 0.3)', // Burnt Orange
		'rgba(255, 215, 0, 0.25)', // Gold
		'rgba(245, 245, 220, 0.2)', // Beige
		'rgba(255, 255, 255, 0.1)' // Soft Highlight
	];

	function createParticle(width: number, height: number): Particle {
		const r = Math.random();
		let color;
		// Weighted color distribution
		if (r < 0.15) color = colors[0];      // 15% Deep Burgundy
		else if (r < 0.30) color = colors[1]; // 15% Dark Red
		else if (r < 0.45) color = colors[2]; // 15% Vivid Crimson
		else if (r < 0.75) color = colors[3]; // 30% Burnt Orange
		else if (r < 0.85) color = colors[4]; // 10% Gold
		else if (r < 0.95) color = colors[5]; // 10% Beige
		else color = colors[6];               // 5% Highlight

		return {
			x: Math.random() * width,
			y: Math.random() * height,
			radius: Math.random() * 80 + 30, // 30px - 110px radius (Larger for soft bokeh)
			color: color,
			speedX: (Math.random() - 0.5) * 0.15, // Slower drift
			speedY: (Math.random() - 0.5) * 0.15,
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
			// Dimmed further (0.15 to 0.25 multiplier)
			const pulse = (0.8 + Math.sin(time + p.pulseOffset) * 0.2); 
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
	<div class="bokeh-overlay"></div>
</div>

<style>
	.bokeh-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1; /* Behind all content */
		background: radial-gradient(circle at center, #2a0505 0%, #000000 100%); /* Deep dark red to black */
		overflow: hidden;
		pointer-events: none;
        opacity: 0.5; /* Overall opacity for the bokeh effect */
	}

	.bokeh-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%); /* Vignette */
		opacity: 0.8;
	}

	canvas {
		display: block;
		filter: blur(20px); /* Enhance bokeh softness via CSS blur */
	}
</style>
