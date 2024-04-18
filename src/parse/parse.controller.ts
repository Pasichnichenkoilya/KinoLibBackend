import { Controller, Get, Param } from '@nestjs/common'
import { ParseService } from './parse.service'
import { Tab, MediaResponse, DetailsResponse } from './types'

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

    @Get('/details/:name/:season?')
    async fetchDetail(
        @Param('name') name: string = 'movie-asterix-obelix-lempire-du-milieu',
        @Param('season') season?: string
    ): Promise<DetailsResponse> {
        const url = season ? `https://uaserial.club/${name}/${season}` : `https://uaserial.club/${name}`;
        return await this.parseService.fetchDetails(url);
    }
}
