<script lang="ts">
    import { resolve } from '$app/paths';

    interface SocialLink {
        title: string;
        path: string;
        icon: string;
    }

    const socials: SocialLink[] = [
        {
            title: 'Twitter',
            path: 'https://x.com/sir_lucian_',
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

    const setExternalHref = (node: HTMLAnchorElement, href: string) => {
        node.href = href;

        return {
            update(nextHref: string) {
                node.href = nextHref;
            }
        };
    };
</script>
<div>
    {#each socials as social (social.title)}
        <a
            use:setExternalHref={social.path}
            class="hover:text-primary mx-2"
            href={resolve('/')}
            title={social.title}
            target="_blank"
            rel="noopener noreferrer"
        >
            <i class={`${social.icon} fa-lg`}></i>
        </a>
    {/each}
</div>