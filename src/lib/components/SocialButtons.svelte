<script lang="ts">
    const socials = [
        {
            title: 'Twitter',
            path: 'https://x.com/sir_lucian',
            icon: 'fa-brands fa-x-twitter'
        },
        {
            title: 'Bluesky',
            path: 'https://bsky.app/profile/lucian.solutions',
            icon: 'fa-brands fa-bluesky'
        },
        {
            title: 'Instagram',
            path: 'https://www.instagram.com/sir_lucian_/',
            icon: 'fa-brands fa-instagram'
        },
        {
            title: 'GitHub',
            path: 'https://github.com/sir-lucian',
            icon: 'fa-brands fa-github'
        }
    ];
</script>
<div>
    {#each socials as social}
        <a class="hover:text-primary mx-2" href={social.path} title={social.title} target="_blank" rel="noopener noreferrer">
            <i class={`${social.icon} fa-lg`}></i>
        </a>
    {/each}
</div>