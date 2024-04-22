import { Controller, Get, Param, Query } from '@nestjs/common'
import { ParseService } from './parse.service'
import { Tab, MediaResponse, PlayerDataResponse } from './types'

@Controller('parse')
export class ParseController {
    constructor(private readonly parseService: ParseService) {}

    @Get('/')
    async fetchTabs(): Promise<Tab[]> {
        const html = await this.parseService.fetchContent()
        const parsedData = this.parseService.parseTabs(html)
        return parsedData
    }

    @Get('/all/:page')
    async fetchAll(@Param('page') page: string = '1'): Promise<MediaResponse> {
        return await this.parseService.fetchMedia(`https://uaserial.club/${page}`)
    }

    @Get('/movies/:page')
    async fetchMovies(@Param('page') page: string = '1'): Promise<MediaResponse> {
        return await this.parseService.fetchMedia(`https://uaserial.club/movie/${page}`)
    }

    @Get('/series/:page')
    async fetchSeries(@Param('page') page: string = '1'): Promise<MediaResponse> {
        return await this.parseService.fetchMedia(`https://uaserial.club/serial/${page}`)
    }

    @Get('/cartoons/:page')
    async fetchCartoons(@Param('page') page: string = '1'): Promise<MediaResponse> {
        return await this.parseService.fetchMedia(`https://uaserial.club/cartoon-movie/${page}`)
    }

    @Get('/cartoon-series/:page')
    async fetchCartoonSeries(@Param('page') page: string = '1'): Promise<MediaResponse> {
        return await this.parseService.fetchMedia(`https://uaserial.club/cartoon-series/${page}`)
    }

    @Get('/anime/:page')
    async fetchAnime(@Param('page') page: string = '1'): Promise<MediaResponse> {
        return await this.parseService.fetchMedia(`https://uaserial.club/anime/${page}`)
    }

    @Get('/search/:name')
    async fetchSearch(@Param('name') name: string = 'panda'): Promise<MediaResponse> {
        return await this.parseService.fetchMedia(`https://uaserial.club/search?query=${name}`)
    }

    @Get('/filter')
    async fetchFiltered(
        @Query('mediaType') mediaType: string,
        @Query('priority') priority: string,
        @Query('rating') rating: string,
        @Query('genre') genre: string,
        @Query('date') date: string
    ): Promise<MediaResponse> {
        return await this.parseService.fetchFilteredMedia(mediaType, priority, rating, genre, date)
    }

    @Get('/player/:mediaId/:season?')
    async fetchPlayerUrl(
        @Param('mediaId') mediaId: string,
        @Param('season') season?: string
    ): Promise<PlayerDataResponse> {
        const playerDataResponse = await this.parseService.parsePlayerUrl(
            `https://uaserial.club/${mediaId}/${season || ''}`,
            mediaId,
            season || ''
        )
        return playerDataResponse
    }
}
