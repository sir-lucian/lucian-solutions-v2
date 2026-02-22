import twemoji from '@twemoji/api';

export function twemojiParse(text: string) {
    return twemoji.parse(text, {
        folder: 'svg',
        ext: '.svg'
    });
}

export function twemojiAction(node: HTMLElement) {
    twemoji.parse(node, {
        folder: 'svg',
        ext: '.svg'
    });

    return {
        update() {
            twemoji.parse(node, {
                folder: 'svg',
                ext: '.svg'
            });
        }
    };
}
