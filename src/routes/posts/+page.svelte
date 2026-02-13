<script lang="ts">
    import { page } from '$app/state';
</script>
<div class="w-full h-screen overflow-hidden flex flex-col justify-center items-center">
    <div class="flex flex-col sm:flex-row gap-4 sm:gap-1 items-start sm:items-center">
        <div class="px-4">
            <img src="/assets/ls-logo.png" alt="Lucian Solutions Logo" class="w-32 h-32" id="ls-logo-error" loading="lazy" />
        </div>
        
        <div class="divider divider-horizontal divider-base-content"></div>

        <div class="flex flex-col flex-justify-center items-start px-4 gap-2 cursor-default select-none">
            <div class="text-xl uppercase tracking-widest">Coming Soon</div>
            <div class="flex gap-2 items-center justify-start">
                <button class="btn btn-accent mt-6 gap-2" on:click={() => history.back()}><i class="fa-solid fa-undo"></i>Back</button>
                <button class="btn btn-secondary mt-6 gap-2" on:click={() => window.location.href = '/'}><i class="fa-solid fa-home"></i>Home</button>
            </div>
        </div>
    </div>
</div>
<style scoped>
    #ls-logo-error {
        filter: drop-shadow(0 0 0.75rem var(--color-base-content));
    }
</style>