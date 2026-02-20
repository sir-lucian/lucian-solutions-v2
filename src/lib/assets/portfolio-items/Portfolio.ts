import type { HtmlParagraph, Media } from "$lib";

export interface PortfolioItem {
    title: string;
    htmlParagraphs?: HtmlParagraph[];
    media?: Media[];
}