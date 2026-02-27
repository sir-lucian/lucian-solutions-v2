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
    type: PostHtmlItemType;
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

export interface PortfolioItem {
    title: string;
    htmlParagraphs?: PortfolioItemType.HtmlParagraphs[];
    media?: PortfolioItemType.Media[];
}

// Enums
export enum HtmlType {
    Paragraph = 'paragraph',
    List = 'list',
    Media = 'media',
    ButtonRow = 'button-row',
}

export enum MediaType {
    YouTube = 'youtube',
    Image = 'image',
}

export enum PostHtmlItemType {
    Paragraph = "paragraph",
    List = "list",
    ButtonRow = "button-row",
    Media = "media"
}

export enum PortfolioItemType {
    Title = "title",
    HtmlParagraphs = "htmlParagraphs",
    Media = "media"
}