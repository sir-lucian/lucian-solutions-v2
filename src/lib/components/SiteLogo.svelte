<script lang="ts">
    export const logoPath: string = '/assets/ls-logo.png';
    export let width: string = "w-full justify-center";
</script>

<div
    class="{width} flex gap-2 items-center text-white cursor-pointer select-none px-4"
    on:click={() => window.location.href = '/'}
    aria-label="Lucian Solutions Home"
    role="button"
    tabindex="0"
    on:keydown={(e) => {
        //
    }}
>
	<img src={logoPath} alt="Lucian Solutions Logo" class="w-8 h-8 -translate-y-0.5" loading="lazy" />
	<h1 class="font-bold uppercase tracking-widest">Lucian Solutions</h1>
</div>