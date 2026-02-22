<script lang="ts">
    interface Props {
        visible?: boolean;
        scrollToSectionId?: string;
    }

    let { visible = false, scrollToSectionId = "about" }: Props = $props();
</script>

<div 
	class="absolute bottom-0 left-0 flex h-40 w-full flex-col items-center justify-end pb-8 text-base-content transition-opacity duration-500 ease-in-out cursor-default select-none pointer-events-none"
	class:opacity-100={visible}
	class:opacity-0={!visible}
    id="scroll-down-arrow"
>
	<span class="mb-2 text-xs md:text-sm font-bold uppercase tracking-[0.2em] animate-bounce opacity-90">Scroll Down</span>
	<i class="fa-solid fa-chevron-down animate-bounce text-xl"></i>
</div>

<style scoped>
    #scroll-down-arrow {
        transition: 0.3s ease-in-out;

        span, i {
            transition: 0.3s ease-in-out;
        }
    }

    #scroll-down-arrow:hover {
        span, i {
            color: var(--color-primary);
        }
    }
</style>
