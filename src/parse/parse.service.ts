import { Injectable, NotFoundException } from '@nestjs/common'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { Tab, Media, MediaResponse } from './types'

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
        return wordsArray.map((tab) => ({
            title: tab,
        }))
    }

    parseMediaCards(html: string): Media[] {
        const $ = cheerio.load(html)
        const media = $('.col')
            .find('.item')
            .get()
            .map((mediaCard) => {
                const id = $(mediaCard).children().first().attr('href')
                const title = $(mediaCard).find('.w--100').children().first().text()
                const image = $(mediaCard).find('img').attr('src')
                const year = $(mediaCard).find('.info').children('.info__item--year').text()
                const rating = $(mediaCard).find('.movie-mark').text()
                const lastEpisode = $(mediaCard).find('.img-wrap').has('.last-episode').text().trim()
                const genres = $(mediaCard)
                    .find('.info')
                    .children('.info__item--genre')
                    .get()
                    .map((genre) => $(genre).text())

                return {
                    id: id,
                    title: title,
                    image: `https://uaserial.club${image}`,
                    year: parseInt(year),
                    rating: parseFloat(rating),
                    genres: genres,
                    type: lastEpisode ? 'Series' : 'Movie',
                    lastEpisode: lastEpisode,
                }
            })
        return media
    }

    parseCountOfPages(html: string): number {
        const $ = cheerio.load(html)
        const countOfPages = $('#filters-grid-content').find('.pagination').children('.page').last().text()
        return parseInt(countOfPages)
    }

    async fetchMedia(url: string): Promise<MediaResponse> {
        const html = await this.fetchContent(url)
        const media = this.parseMediaCards(html)
        const countOfPages = this.parseCountOfPages(html)
        return {
            media: media,
            countOfPages: countOfPages,
        }
    }
}
