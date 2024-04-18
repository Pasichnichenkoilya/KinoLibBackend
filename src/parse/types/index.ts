export type Media = {
    id: string
    title: string
    image: string
    year: number
    rating: number
    genres: string[]
    type: string
    lastEpisode: string
}

export type MediaResponse = {
    media: Media[]
    countOfPages: number
}

export type Tab = {
    title: string
}

export type Details = {
    film_path: string[];
    title_ua: string;
    title_original: string;
    description: string;
    image: string;
    rating: string;
    country: string;
    time: string;
    release: string;
    genres: string[];
}

export type DetailsResponse = {
    media: Details[]
}
