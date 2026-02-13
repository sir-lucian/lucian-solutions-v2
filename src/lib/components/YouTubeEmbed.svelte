<script lang="ts">
	export let width: string = 'w-full';
    export let videoFooter: string = '';
</script>

<div class={width}>
	<div
		class="relative w-full min-w-full overflow-hidden rounded-lg shadow-lg"
		style="padding-top: 56.25%;"
	>
		<div class="absolute top-0 left-0 h-full w-full">
			<slot></slot>
		</div>
	</div>
    {#if videoFooter}
        <p class="mt-2 italic text-center text-sm text-base-content/80">{videoFooter}</p>
    {/if}
</div>
