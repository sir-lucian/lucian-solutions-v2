<script lang="ts">
    const startYear = 2022;
    const dateNow = new Date();
    const yearNow = dateNow.getFullYear();
</script>   

<div class="w-full py-2 px-4 flex flex-wrap gap-2 justify-center items-center text-sm text-center text-white">
    <div class="font-medium text-nowrap">&copy; {startYear === yearNow ? yearNow : `${startYear} - ${yearNow}`}</div>
    <div class="font-black uppercase text-nowrap">Lucian Solutions</div>
    <div class="font-light text-xs text-nowrap">(Karn Lucian Kamolnavin)</div>
</div>