<script lang="ts">
	import { page } from '$app/state';
	import { DEFAULT_SEO_IMAGE } from "#lib";

	interface Props {
		title: string;
		description?: string;
		image?: string;
		url?: string;
		type?: string;
		siteName?: string;
        siteColor?: string;
		twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
	}

	let {
		title,
		description = "Lucian Solutions",
		image = DEFAULT_SEO_IMAGE, // Default image if not provided
		url,
		type = "website",
		siteName = "Lucian Solutions",
        siteColor = "#D3AF37",
		twitterCard = "summary_large_image"
	}: Props = $props();

	let imageUrl = $derived(new URL(image, page.url.origin).href);
</script>

<svelte:head>
	<title>{title ? (`${title}${siteName ? ' ◆ ' + siteName : ''}`) : (siteName ?? "Lucian Solutions")}</title>
	<meta name="description" content={description} />
    <meta name="theme-color" content={siteColor} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	{#if url}
		<meta property="og:url" content={url} />
	{/if}
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:site_name" content={siteName} />

	<!-- Twitter -->
	<meta property="twitter:card" content={twitterCard} />
	{#if url}
		<meta property="twitter:url" content={url} />
	{/if}
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={imageUrl} />
</svelte:head>
