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