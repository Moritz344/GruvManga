export interface Manga{
    title: string;
    description: string;
    image: string;
    id: string;
    fileName: string;
    stat: string;
    year: string;
    content: string;
    chapter: string;
    rating: string;
    thumbnail: string;
}

export interface SimilarManga{
    title: string;
    image: string;
}

export interface LanguagesManga{
    desc: string;
    flag: string;
}
