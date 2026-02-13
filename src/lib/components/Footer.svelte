<script lang="ts">
    const startYear = 2022;
    const dateNow = new Date();
    const yearNow = dateNow.getFullYear();
</script>   

<div class="w-full p-4 flex justify-center items-center text-sm text-center">
    &copy; {startYear === yearNow ? yearNow : `${startYear} - ${yearNow}`} Lucian Solutions (Karn Lucian Kamolnavin). All rights reserved.
</div>