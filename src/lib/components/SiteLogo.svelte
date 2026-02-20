<script lang="ts">
    export const logoPath: string = '/assets/ls-logo.png';
    export let width: string = "w-full justify-center";
</script>

<a
    class="{width} flex gap-3 items-center text-white cursor-pointer select-none px-4"
    href="/"
>
	<img src={logoPath} alt="Lucian Solutions Logo" class="w-8 h-8 -translate-y-0.5" loading="lazy" />
	<h1 class="font-black uppercase tracking-tight text-nowrap text-xl">Lucian Solutions</h1>
</a>