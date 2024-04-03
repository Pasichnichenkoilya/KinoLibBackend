import { Controller, Get } from '@nestjs/common';
import { ParseService } from './parse.service';

@Controller('parse')
export class ParseController {
  constructor(private readonly parseService: ParseService) {}

  @Get()
  async fetchAndParseWikipediaContent(): Promise<string> {
    const html = await this.parseService.fetchContent();
    const parsedData = this.parseService.parseTabs(html);
    return parsedData;
  }
}
