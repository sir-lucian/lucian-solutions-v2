<script lang="ts">
    export const logoPath: string = '/assets/ls-logo.png';
    export let width: string = "w-full justify-center";
</script>

<div
    class="{width} flex gap-3 items-center text-white select-none px-4"
>
    <a href="/" class="flex items-center gap-3 cursor-pointer">
	    <img src={logoPath} alt="Lucian Solutions Logo" class="w-8 h-8 -translate-y-0.5" loading="lazy" />
	    <h1 class="font-black uppercase tracking-tight text-nowrap text-xl w-fit">Lucian Solutions</h1>
    </a>
</div>