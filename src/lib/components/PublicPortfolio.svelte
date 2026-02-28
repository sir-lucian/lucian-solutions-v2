<script lang="ts">
	import { HtmlType, type HtmlParagraph, type Media } from '$lib';
	import { twemojiParse } from '$lib/utils/twemoji';
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

	<div
		class={`flex w-full flex-col justify-center gap-2 lg:w-1/2 ${reverse ? 'items-start text-start lg:items-end lg:text-end' : 'items-start text-start'}`}
	>
		<div class="mx-4 flex flex-col gap-2">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<h3 class="text-xl font-bold text-primary">{@html twemojiParse(title)}</h3>

			{#each htmlParagraphs as paragraph}
				{#if paragraph.type === HtmlType.Paragraph}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<p>{@html twemojiParse(paragraph.htmlContent as string)}</p>
				{:else if paragraph.type === HtmlType.Header}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<h4 class="text-lg font-bold mt-4 mb-2 text-primary">{@html twemojiParse(paragraph.htmlContent as string)}</h4>
				{:else if paragraph.type === HtmlType.List}
					<ul
						class="line-height-loose marker: flex list-outside list-none flex-col gap-2 marker:translate-y-0.5 marker:text-primary marker:content-['▹']"
					>
						{#if paragraph.htmlContents}
							{#each paragraph.htmlContents as item}
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<li class={`${listFormat} ${reverse ? 'lg:flex-row-reverse' : ''}`}>{@html twemojiParse(item)}</li>
							{/each}
						{/if}
					</ul>
				{:else if paragraph.type === HtmlType.ButtonRow}
					<div class={`flex flex-wrap gap-2 ${reverse ? 'justify-start lg:justify-end' : 'justify-start'}`}>
						{#if paragraph.buttons}
							{#each paragraph.buttons as button}
								<ButtonGlass
									href={button.url}
									openNewWindow={button.openNewTab}
									class={listFormat}
								>
									<i class={`${button.faIcon}`} aria-hidden="true"></i>
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html twemojiParse(button.htmlContent as string)}
								</ButtonGlass>
							{/each}
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
