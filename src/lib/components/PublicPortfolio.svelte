<script lang="ts">
	import type { HtmlParagraph, Media } from '$lib';
	import YouTubeEmbed from './YouTubeEmbed.svelte';
	import ButtonGlass from './buttons/ButtonGlass.svelte';

	export let title: string;
	export let htmlParagraphs: HtmlParagraph[] = [];
	export let media: Media[] = [];
	export let reverse: boolean = false;

	const listFormat: string = 'inline-flex gap-2';
</script>

<div
	class={`flex w-full flex-col gap-8 lg:gap-0 ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
>
	<!-- Media Section -->
	<div class="w-full lg:w-1/2">
		{#each media as item}
			{#if item.type === 'youtube'}
				<YouTubeEmbed width="w-full">
					<iframe
						width="100%"
						height="100%"
						src={item.embededUrl}
						title="YouTube Video Player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				</YouTubeEmbed>
			{/if}
		{/each}
	</div>

	<!-- Content Section -->
	<div
		class={`flex w-full flex-col justify-center gap-2 lg:w-1/2 ${reverse ? 'items-end text-end' : 'items-start text-start'}`}
	>
		<div class="mx-4 flex flex-col gap-2">
			<h3 class="text-xl font-bold text-primary">{title}</h3>

			{#each htmlParagraphs as paragraph}
				{#if paragraph.type === 'paragraph'}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<p>{@html paragraph.htmlContent}</p>
				{:else if paragraph.type === 'list'}
					<ul
						class="line-height-loose marker: flex list-outside list-none flex-col gap-2 marker:translate-y-0.5 marker:text-primary marker:content-['▹']"
					>
						{#if paragraph.htmlContents}
							{#each paragraph.htmlContents as item}
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<li class={`${listFormat} ${reverse ? 'flex-row-reverse' : ''}`}>{@html item}</li>
							{/each}
						{/if}
					</ul>
				{:else if paragraph.type === 'button-row'}
					<div class={`flex flex-wrap gap-2 ${reverse ? 'justify-end' : 'justify-start'}`}>
						{#if paragraph.buttons}
							{#each paragraph.buttons as button}
								<ButtonGlass
									href={button.url}
									openNewWindow={button.openNewTab}
									class={listFormat}
								>
									<i class={`${button.faIcon}`} aria-hidden="true"></i>{button.htmlContent}
								</ButtonGlass>
							{/each}
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
