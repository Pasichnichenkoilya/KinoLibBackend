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

    async fetchFilteredMedia(
        mediaType: string,
        priority: string,
        rating: string,
        genre: string,
        date: string
    ): Promise<MediaResponse> {
        const priorityParam = priority ? `&priority=${priority}` : ''
        const ratingParam = rating ? `&rating=${rating}` : ''
        const genreParam = genre ? `&genre=${genre}` : ''
        const dateParam = date ? `&date=${date}` : ''
        const mediaTypes = {
            all: '',
            movies: 'movie',
            series: 'serial',
            cartoons: 'cartoon-movie',
            'cartoon-series': 'cartoon-series',
            anime: 'anime',
        }

        const url = `https://uaserial.club/${mediaType ? mediaTypes[mediaType] : ''}?${priorityParam}${ratingParam}${genreParam}${dateParam}`
        return await this.fetchMedia(url.replace('/?&', '/?'))
    }

    async getFileUrlForAshdiPlayer(scriptStr: string): Promise<string> {
        const start = scriptStr.indexOf('var player = new Playerjs({')
        const end = scriptStr.indexOf('poster:')
        const dirtyFileUrl = scriptStr.substring(start, end).split(',')[1] // 1: skipping 'var player = new Playerjs({'
        const cleanFileUrl = dirtyFileUrl.replaceAll('""', '').replaceAll(`\"`, '').replaceAll('file:', '')
        return cleanFileUrl
    }

    async getFileUrlForBoogiemoviePlayer(scriptStr: string): Promise<string> {
        const start = scriptStr.indexOf("manifest: '")
        const end = scriptStr.indexOf("',")
        const cleanFileUrl = scriptStr.substring(start, end).replace("manifest: '", '')
        return cleanFileUrl
    }

    parseEpisode(scriptStr: string): string {
        const start = scriptStr.indexOf(`"episodeNumber":`)
        const end = scriptStr.indexOf(`",`)
        const episode = scriptStr.substring(start).split(',')[0].replace(`"episodeNumber": `, '').replaceAll(`"`, '')
        return `episode-${episode}`
    }

    getEpisode(scriptStr: string): string {
        const defaultEpisode = 'episode-1'
        const isMovie = scriptStr.indexOf(`"@type": "Movie"`) != -1
        return isMovie ? defaultEpisode : this.parseEpisode(scriptStr)
    }

    async parsePlayerUrl(url: string, id: string, season: string): Promise<PlayerDataResponse> {
        try {
            const html = await this.fetchContent(url)
            let $ = cheerio.load(html)

            const idParam = id.replace('movie-', '')
            const seasonParam = season.startsWith('season-')
                ? `${season.split('-')[0]}-${season.split('-')[1]}`
                : 'season-1'
            const episodeParam = this.getEpisode($('script').html().trim().replaceAll('\n', '').replaceAll('\t', ''))
            const embedUrl = `https://uaserial.club/embed/${idParam}/${seasonParam}/${episodeParam}`

            const embedHTML = await this.fetchContent(embedUrl)
            $ = cheerio.load(embedHTML)
            const playerUrl = $('option').attr('value')
            const playerHTML = await this.fetchContent(playerUrl)
            $ = cheerio.load(playerHTML)

            if (playerUrl.startsWith('https://ashdi')) {
                const scriptText = $('script').last().html().trim().replaceAll('\n', '').replaceAll('\t', '')
                const fileUrl = await this.getFileUrlForAshdiPlayer(scriptText)
                return {
                    playerUrl: playerUrl,
                    fileUrl: fileUrl,
                }
            }

            if (playerUrl.startsWith('https://boogiemovie')) {
                const scriptText = $('script').first().html().trim().replaceAll('\n', '').replaceAll('\t', '')
                const fileUrl = await this.getFileUrlForBoogiemoviePlayer(scriptText)
                return {
                    playerUrl: playerUrl,
                    fileUrl: fileUrl,
                }
            }
        } catch (error) {
            return {
                playerUrl: null,
                fileUrl: null,
            }
        }
    }
}
