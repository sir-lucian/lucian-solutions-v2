<script lang="ts">
    export const logoPath: string = '/assets/ls-logo.png';
    export let width: string = "w-full justify-center";
    export let keepNeonGlow: boolean = true;
</script>

<div class="{width} flex gap-2 items-center text-white cursor-default select-none px-4">
	<img src={logoPath} alt="Lucian Solutions Logo" class="w-8 h-8 -translate-y-0.5 {keepNeonGlow ? 'neon-glow' : ''}" loading="lazy" />
	<h1 class="font-bold uppercase tracking-widest {keepNeonGlow ? 'neon-glow' : ''}">Lucian Solutions</h1>
</div>

<style scoped>
    img.neon-glow {
        filter: drop-shadow(0 0 0.75rem var(--color-base-content));
    }

    h1.neon-glow {
        text-shadow: 0 0 0.75rem var(--color-base-content);
    }
</style>