import type { HtmlType, Media } from "$lib";

export interface PostItem {
    id: string;
    title: string;
    slug: string;
    tags: string[];
    htmlItems: HtmlItem[];
}

export interface HtmlItem {
    type: HtmlType; // 'paragraph' | 'list' | 'button-row'
    htmlContent: string;
    htmlContents?: string[];
    medias?: Media[];
}