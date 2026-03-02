// Interfaces
export interface Button {
    htmlContent?: string;
    faIcon?: string;
    url?: string;
    openNewTab?: boolean;
}

export interface HtmlParagraph {
    type: HtmlType;
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
}

export enum MediaType {
    YouTube = 'youtube',
    Image = 'image',
}

// Portfolio items use `HtmlParagraph` and `Media` types directly; removed unused enum
export const DEFAULT_SEO_IMAGE = "/assets/ls-seo.jpg";