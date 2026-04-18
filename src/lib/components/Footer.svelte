<script lang="ts">
    const startYear = 2022;
    const dateNow = new Date();
    const yearNow = dateNow.getFullYear();
</script>   

<div class="w-full py-2 px-4 inline-flex gap-2 justify-center items-center text-sm text-center text-white">
    <span class="font-medium">&copy; {startYear === yearNow ? yearNow : `${startYear} - ${yearNow}`}</span>
    <span class="font-black uppercase">Lucian Solutions</span>
    <span class="font-light text-xs">(Karn Lucian Kamolnavin)</span>
</div>