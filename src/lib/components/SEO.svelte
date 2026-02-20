<script lang="ts">
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
		image = "/favicon.svg", // Default image if not provided
		url,
		type = "website",
		siteName = "Lucian Solutions",
        siteColor = "#D3AF37",
		twitterCard = "summary_large_image"
	}: Props = $props();

    /* 
       Note: usage of $page.url.href would require importing page from $app/stores
       or passing it in. For simplicity, we make 'url' optional in props or handle it via store if preferred.
       But explicit props are better for "modifiable at each page".
    */
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
	<meta property="og:image" content={image} />
	<meta property="og:site_name" content={siteName} />

	<!-- Twitter -->
	<meta property="twitter:card" content={twitterCard} />
	{#if url}
		<meta property="twitter:url" content={url} />
	{/if}
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />
</svelte:head>
