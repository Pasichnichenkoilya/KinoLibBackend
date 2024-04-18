import { Injectable, NotFoundException } from '@nestjs/common'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { Tab, Media, MediaResponse, Details, DetailsResponse } from './types'

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


    parseDetails(html: string): Details[] {
        const $ = cheerio.load(html);
        const parent = $('.flex.column.fg1').first().parent()

        const media = parent.get().map((mediaCard) => {
            const film_path = $(mediaCard)
                .find('ol.block__breadcrumbs li span[itemprop="name"]')
                .map((index, element) => $(element).text().trim())
                .get();
            const title_ua = $(mediaCard).find('.title').text()
            const title_original = $(mediaCard).find('.original').text()
            const description = $(mediaCard).find('.text').text().replace(/\s+/g, ' ');
            const image = $(mediaCard).find('img').attr('src')
            const rating = $(mediaCard).find('.selection__badge--imdb div').eq(1).text().trim();
            const country = $(mediaCard).find('.movie-data-item--country .value').text().trim().replace(/\s+/g, ' ');;
            const time = $(mediaCard).find('.movie-data-item .value').text().trim().replace(/\s+/g, ' ');
            const release = $(mediaCard).find('.movie-data-item--date .value').text().trim().replace(/\s+/g, ' ');
            const genres = $(mediaCard)
                .find('.movie__genres__container .selection__badge:not(.selection__badge--imdb)')
                .map((index, element) => $(element).text().trim())
                .get();

            const timeRegex = /(\d+ год \d+ хв)|(\d+ хв)/;
            const match = time.match(timeRegex);
            const extractedTime = match ? match[0] : '';
    

            return {
                film_path: film_path,
                title_ua: title_ua,
                title_original: title_original,
                description: description,
                image: `https://uaserial.club${image}`,
                rating: rating,
                country: country,
                time: extractedTime,
                release: release,
                genres: genres,
            }
        })
        return media
    }


    async fetchDetails(url: string): Promise<DetailsResponse> {
        const html = await this.fetchContent(url)
        const  media = this.parseDetails(html)
        

        return {
            media: media,

        }
    }
}
