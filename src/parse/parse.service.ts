import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ParseService {
  async fetchContent(): Promise<string> {
    const url = 'https://uaserial.club/';
    const response = await axios.get(url);
    return response.data;
  }

  parseTabs(html: string): string {
    const $ = cheerio.load(html);
    const firstHeadingContent = $('.tabs__sorting').text();
    const trimmedContent = firstHeadingContent.replace(/\n/g, "").trim();
    const wordsArray = trimmedContent.split(/\s+/);
    const jsonData = JSON.stringify(wordsArray);
    return jsonData;
  }
  
  
  
}
