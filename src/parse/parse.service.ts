import { Injectable } from '@nestjs/common'
import axios from 'axios'
import * as cheerio from 'cheerio'

@Injectable()
export class ParseService {
    async fetchContent(url: string = 'https://uaserial.club/'): Promise<string> {
        const response = await axios.get(url)
        return response.data
    }

    parseTabs(html: string): string {
        const $ = cheerio.load(html)
        const firstHeadingContent = $('.tabs__sorting').text()
        const trimmedContent = firstHeadingContent.replace(/\n/g, '').trim()
        const wordsArray = trimmedContent.split(/\s+/)
        const jsonData = JSON.stringify(wordsArray)
        return jsonData
    }

    parseMovies(html: string): string {
        const movies = []
        const $ = cheerio.load(html)
        $('#filters-grid-content')
            .find('.item')
            .each((_, movieCard) => {
                const title = $(movieCard).find('.w--100').children().first().text()
                const year = $(movieCard).find('.info').children('.info__item--year').text()
                const image = $(movieCard).find('img').attr('src')
                const genres = $(movieCard)
                    .find('.info')
                    .children('.info__item--genre')
                    .get()
                    .map((genre) => $(genre).text())

                movies.push({
                    title: title,
                    year: year,
                    genres: genres,
                    image: `https://uaserial.club${image}`,
                })
            })

        return JSON.stringify(movies)
    }
}
