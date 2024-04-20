import { Injectable, NotFoundException } from '@nestjs/common'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { Tab, Media, MediaResponse, PlayerDataResponse } from './types'

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
        const parent = $('.col').first().parent()
        const media = parent
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

    getFileSubstring(str: string): string {
        const start = str.indexOf('var player = new Playerjs({')
        const end = str.indexOf('poster:')
        const dirtyFileUrl = str.substring(start, end).split(',')[1] // 1: skipping 'var player = new Playerjs({'
        const cleanFileUrl = dirtyFileUrl.replaceAll('""', '').replaceAll(`\"`, '').replaceAll('file:', '')
        return cleanFileUrl
    }

    async parsePlayerUrl(url: string): Promise<PlayerDataResponse> {
        const html = await this.fetchContent(url)
        let $ = cheerio.load(html)

        const mediaName = url
            .replace('https://uaserial.club/', '')
            .replace('movie-', '')
            .replace('season-1', '')
            .replace('episode-1', '')
            .split('/')[0]
        const embedUrl = `https://uaserial.club/embed/${mediaName}/season-1/episode-1`

        const embedHTML = await this.fetchContent(embedUrl)
        $ = cheerio.load(embedHTML)
        const playerUrl = $('option').attr('value')

        const playerHTML = await this.fetchContent(playerUrl)
        $ = cheerio.load(playerHTML)
        const scriptText = $('script').last().html().trim().replaceAll('\n', '').replaceAll('\t', '')
        const fileUrl = this.getFileSubstring(scriptText)

        return {
            playerUrl: playerUrl,
            fileUrl: fileUrl,
        }
    }
}
