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
