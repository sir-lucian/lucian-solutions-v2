<script lang="ts">
	// This is a simple loading badge component that can be used to indicate loading states in the UI.
	// It uses Tailwind CSS for styling and Font Awesome for the spinner icon.
	// No props or state are needed for this component, as it's purely presentational.
	export let isLoading: boolean = false; // You can control the visibility of the badge with this prop if needed
</script>

<div class="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 transition-opacity duration-300 {isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}" id="loading-badge-container">
	<div class="flex items-center justify-start gap-4 rounded-lg">
		<div class="my-4 flex flex-col gap-3">
			<img
				src="/assets/ls-lucia-lurk.png"
				alt="Loading..."
				class="h-auto w-[4rem] md:w-[6rem]"
				id="loading-badge-image"
			/>
			<div
				class="flex items-center gap-2 bg-white px-5 py-3 text-center text-xs font-bold text-black uppercase backdrop-blur"
				id="loading-badge"
			>
				<span>Loading</span>
				<div class="loading loading-sm loading-spinner"></div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Add a nudge animation for the loading badge looping every 1.2 seconds */
	#loading-badge-image {
		animation: nudge 1.2s ease infinite;
	}

	#loading-badge {
		animation: nudge 1.2s ease infinite;
		animation-delay: -0.3s;
	}

	@keyframes nudge {
		0%,
		38%,
		62%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}
</style>
