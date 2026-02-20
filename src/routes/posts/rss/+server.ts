import postsData from '$lib/assets/post-items/post-items.json';

const siteUrl = 'https://lucian.solutions';
const siteTitle = 'Lucian Solutions';
const siteDescription = 'Plan the work, work the plan - Karn Lucian Kamolnavin';

export const GET = async () => {
    const posts = postsData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const body = render(posts);
    const headers = {
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Content-Type': 'application/xml'
    };

    return new Response(body, {
        headers
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const render = (posts: any[]) =>
    `<?xml version="1.0" encoding="UTF-8" ?>
<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${siteTitle}</title>
<description>${siteDescription}</description>
<link>${siteUrl}</link>
<atom:link href="${siteUrl}/posts/rss" rel="self" type="application/rss+xml"/>
${posts
        .map(
            (post) => `<item>
<guid isPermaLink="true">${siteUrl}/posts#post-${post.id}</guid>
<title>${post.title}</title>
<link>${siteUrl}/posts#post-${post.id}</link>
<description><![CDATA[${generateHtmlContent(post.htmlItems)}]]></description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`
        )
        .join('')}
</channel>
</rss>
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateHtmlContent(htmlItems: any[]): string {
    if (!htmlItems) return '';

    return htmlItems
        .map((item) => {
            if (item.type === 'paragraph') {
                return `<p>${item.htmlContent}</p>`;
            } else if (item.type === 'list') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return `<ul>${item.htmlContents.map((li: any) => `<li>${li}</li>`).join('')}</ul>`;
            } else if (item.type === 'media' && item.medias) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return item.medias.map((m: any) => {
                    if (!m.alt) return '';

                    if (m.type === 'image') {
                        return '';
                    }
                    if (m.type === 'youtube') {
                        return '';
                    }
                    return '';
                }).join('');
            }
            return '';
        })
        .join('');
}
