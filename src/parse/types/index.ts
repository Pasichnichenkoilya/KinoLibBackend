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
    filmPath: string[]
    titleUa: string
    titleOriginal: string
    description: string
    image: string
    rating: string
    country: string
    time: string
    release: string
    genres: string[]
    seasonsInfo: SeasonInfo[]
}

export type DetailsResponse = {
    media: Details[]
}

export type PlayerDataResponse = {
    playerUrl: string
    fileUrl: string
}

export type SeasonInfo = {
    seasonId: string
    seasonNumber: string
    episodes: string[]
}
