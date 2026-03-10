export const appVersion = "1.0.1";

// Interfaces
export interface Button {
    htmlContent?: string;
    faIcon?: string;
    url?: string;
    openNewTab?: boolean;
}

export interface HtmlParagraph {
    type: HtmlType;
    language?: string;
    htmlContent?: string;
    htmlContents?: string[];
    buttons?: Button[];
}

export interface Media {
    type: MediaType;
    embededUrl?: string;
    altText?: string;
    imgSrc?: string;
    imgLazyLoad?: boolean;
}

export interface MediaItem {
    type: string;
    imgSrc?: string;
    altText?: string;
    embededUrl?: string;
    imgLazyLoad: boolean;
}

export interface HtmlItem {
    type: HtmlType;
    htmlContent: string;
    htmlContents?: string[];
    medias?: Media[];
}

export interface PostItem {
    date: string;
    id: string;
    title: string;
    slug: string;
    tags: string[];
    htmlItems: HtmlItem[];
}

export interface FanartItem {
    artist: string,
    slug?: string | null,
    slug_language?: string | null,
    art: Art[]
}

export interface Art {
    filePath: string,
    children?: Art[]
}

export interface PortfolioItem {
    id: string;
    title: string;
    htmlParagraphs?: HtmlParagraph[];
    media?: Media[];
}

// Enums
export enum HtmlType {
    Paragraph = 'paragraph',
    Header = 'header',
    List = 'list',
    Media = 'media',
    ButtonRow = 'button-row',
    CopyableCodeBlock = 'copyable-code-block',
}

export enum MediaType {
    YouTube = 'youtube',
    Image = 'image',
}

// Portfolio items use `HtmlParagraph` and `Media` types directly; removed unused enum
export const DEFAULT_SEO_IMAGE = "./assets/ls-seo.jpg";
export const DEFAULT_FAVICON = "./assets/ls-logo.jpg";

export function isTheSamePath(path1: string, path2: string): boolean {

    // slice after #, if exists
    const hashIndex1 = path1.indexOf('#');
    if (hashIndex1 !== -1) {
        path1 = path1.slice(0, hashIndex1);
    }
    const hashIndex2 = path2.indexOf('#');
    if (hashIndex2 !== -1) {
        path2 = path2.slice(0, hashIndex2);
    }

    // slice after ?, if exists
    const queryIndex1 = path1.indexOf('?');
    if (queryIndex1 !== -1) {
        path1 = path1.slice(0, queryIndex1);
    }
    const queryIndex2 = path2.indexOf('?');
    if (queryIndex2 !== -1) {
        path2 = path2.slice(0, queryIndex2);
    }

    // trim . at the start
    if (path1.startsWith('.')) {
        path1 = path1.slice(1);
    }
    if (path2.startsWith('.')) {
        path2 = path2.slice(1);
    }

    // if path is empty, set to /
    if (path1.length < 1) {
        path1 = '/';
    }
    if (path2.length < 1) {
        path2 = '/';
    }

    return path1 === path2;
}