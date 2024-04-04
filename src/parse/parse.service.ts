import { Injectable, NotFoundException } from '@nestjs/common'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { Movie, Tab } from './types'

@Injectable()
export class ParseService {
    async fetchContent(url: string = 'https://uaserial.club/'): Promise<string> {
        try {
            const response = await axios.get(url)
            return response.data
        } catch (error) {
            throw new NotFoundException(`resource ${url} is unavailable`)
        }
    }

    parseTabs(html: string): Tab[] {
        const $ = cheerio.load(html)
        const firstHeadingContent = $('.tabs__sorting').text()
        const trimmedContent = firstHeadingContent.replace(/\n/g, '').trim()
        const wordsArray = trimmedContent.split(/\s+/)

        return wordsArray.map((tabName) => ({
            title: tabName,
        }))
    }

    parseMovies(html: string): Movie[] {
        const $ = cheerio.load(html)
        const movies = $('#filters-grid-content')
            .find('.item')
            .get()
            .map((movieCard) => {
                const title = $(movieCard).find('.w--100').children().first().text()
                const year = $(movieCard).find('.info').children('.info__item--year').text()
                const image = $(movieCard).find('img').attr('src')
                const genres = $(movieCard)
                    .find('.info')
                    .children('.info__item--genre')
                    .get()
                    .map((genre) => $(genre).text())

                return {
                    title: title,
                    year: year,
                    genres: genres,
                    image: `https://uaserial.club${image}`,
                }
            })
        return movies
    }
}
