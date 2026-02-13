<script lang="ts">
    interface Props {
        visible?: boolean;
        scrollToSectionId?: string;
    }

    let { visible = false, scrollToSectionId = "about" }: Props = $props();
</script>

<div 
	class="absolute bottom-0 left-0 flex h-40 w-full flex-col items-center justify-end bg-linear-to-b from-transparent to-black pb-8 text-base-content transition-opacity duration-500 ease-in-out hover:cursor-pointer cursor-default select-none"
	class:opacity-100={visible}
	class:opacity-0={!visible}
    id="scroll-down-arrow"
    onclick={() => {
        document.getElementById(scrollToSectionId)?.scrollIntoView({ behavior: 'smooth' });
    }}
    role="button"
    tabindex="0"
    aria-label="Scroll Down"
    onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            document.getElementById(scrollToSectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
    }}
>
	<span class="mb-2 text-sm font-bold uppercase tracking-[0.2em] animate-bounce opacity-90">Scroll Down</span>
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
            text-shadow: 0 0 0.75rem var(--color-base-content);
        }
    }
</style>
