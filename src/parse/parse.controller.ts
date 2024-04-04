import { Controller, Get } from '@nestjs/common'
import { ParseService } from './parse.service'
import { Movie, Tab } from './types'

@Controller('parse')
export class ParseController {
    constructor(private readonly parseService: ParseService) {}

    @Get('/')
    async fetchTabs(): Promise<Tab[]> {
        const html = await this.parseService.fetchContent()
        const parsedData = this.parseService.parseTabs(html)
        return parsedData
    }

    @Get('/movies')
    async fetchMovies(): Promise<Movie[]> {
        const html = await this.parseService.fetchContent('https://uaserial.club/movie')
        const moviesJSON = this.parseService.parseMovies(html)
        return moviesJSON
    }
}
