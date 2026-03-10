<script lang="ts">
	import { HtmlType, type HtmlParagraph, type Media } from '$lib';
	import { twemojiParse } from '$lib/utils/twemoji';
	import YouTubeEmbed from './YouTubeEmbed.svelte';
	import ButtonGlass from './buttons/ButtonGlass.svelte';
	import ContainerGlassBlack from './containers/ContainerGlassBlack.svelte';

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
		{#each media as item, index (index)}
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
			{:else if item.type === 'image'}
				<div class="mb-4 flex h-full flex-col items-center justify-center gap-2">
					<img
						src={item.imgSrc}
						alt={item.altText}
						class="block w-full rounded-lg object-cover"
						loading={item.imgLazyLoad ? 'lazy' : 'eager'}
					/>
				</div>
			{/if}
		{/each}
	</div>

	<div
		class={`flex w-full flex-col justify-center gap-2 lg:w-1/2 ${reverse ? 'items-start text-start lg:items-end lg:text-end' : 'items-start text-start'}`}
	>
		<div class="mx-4 flex w-full flex-col gap-2">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<h3 class="text-xl font-bold text-primary">{@html twemojiParse(title)}</h3>

			{#each htmlParagraphs as paragraph, index (index)}
				{#if paragraph.type === HtmlType.Paragraph}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<p>{@html twemojiParse(paragraph.htmlContent as string)}</p>
				{:else if paragraph.type === HtmlType.Header}
					<h4 class="mt-4 mb-2 text-lg font-bold text-primary">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html twemojiParse(paragraph.htmlContent as string)}
					</h4>
				{:else if paragraph.type === HtmlType.List}
					<!-- Use DaisyUI list component -->
					<ul class="list-inside">
						{#if paragraph.htmlContents}
							{#each paragraph.htmlContents as item, index (index)}
								<li>
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html twemojiParse(item)}
								</li>
							{/each}
						{/if}
					</ul>
				{:else if paragraph.type === HtmlType.ButtonRow}
					<div
						class={`flex flex-wrap gap-2 ${reverse ? 'justify-start lg:justify-end' : 'justify-start'}`}
					>
						{#if paragraph.buttons}
							{#each paragraph.buttons as button, index (index)}
								<ButtonGlass href={button.url} openNewWindow={button.openNewTab} class={listFormat}>
									<i class={`${button.faIcon}`} aria-hidden="true"></i>
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html twemojiParse(button.htmlContent as string)}
								</ButtonGlass>
							{/each}
						{/if}
					</div>
				{:else if paragraph.type === HtmlType.CopyableCodeBlock}
					<div class="flex w-full flex-col gap-2">
						<ContainerGlassBlack class="w-full px-4 py-2 text-sm">
							<div class="flex flex-row items-center justify-between">
								<div class="font-mono font-bold">
									{paragraph.htmlContent?.trim() as string}
								</div>
								<div>
									<ButtonGlass
										class="h-12 w-12 text-xs"
										onclick={() => {
											navigator.clipboard.writeText(paragraph.htmlContent?.trim() as string);
											const copyIcon = document.getElementById(`copy-icon-${index}`);
											const checkIcon = document.getElementById(`check-icon-${index}`);
											if (copyIcon && checkIcon) {
												copyIcon.classList.add('hidden');
												checkIcon.classList.remove('hidden');
												setTimeout(() => {
													copyIcon.classList.remove('hidden');
													checkIcon.classList.add('hidden');
												}, 2000);
											}
										}}
									>
										<span id={`copy-icon-${index}`}
											><i class="fa-solid fa-copy" aria-hidden="true"></i></span
										>
										<span id={`check-icon-${index}`} class="hidden"
											><i class="fa-solid fa-check" aria-hidden="true"></i></span
										>
									</ButtonGlass>
								</div>
							</div>
						</ContainerGlassBlack>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
