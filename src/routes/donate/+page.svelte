<script lang="ts">
	import Container from '#lib/components/Container.svelte';
	import SEO from '#lib/components/SEO.svelte';

    export function sanitizedDisplayName(name: string): string {
        if (!(name.trim())) return '';
        return name.trim().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/gi, '');
    }
</script>

<SEO title="Donate" description="Support the work of Lucian Solutions" />

<section class="content-section">
	<Container>
		<h1>Coming Soon</h1>
	</Container>
</section>

<!--
    amount to donate: number, minimum 20, required
    display name: string, required, sanitized
    message: string, optional, sanitized
-->
