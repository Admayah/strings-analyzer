import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Res } from '@nestjs/common';
import { StringsService } from './strings.service';
import type { Response } from 'express';

@Controller('strings')
export class StringsController {
    constructor(private readonly stringsService: StringsService) { }
    @Post()
    async create(@Body() body: any, @Res() res: Response) {
        const value = body?.value;
        if (!value) throw new BadRequestException('Missing "value" field');
        const result = await this.stringsService.create(value);
        return res.status(201).json(result);
    }

        @Get('filter-by-natural-language')
    async filterByNaturalLanguage(@Query('query') query: string) {
        if (!query) throw new BadRequestException('Missing "query" parameter');

        const { parsedFilters, error } = this.stringsService.parseNaturalLanguageQuery(query);

        if (error) throw new BadRequestException(error);

        const results = await this.stringsService.findAll(parsedFilters);

        return {
            data: results.data,
            count: results.count,
            interpreted_query: {
                original: query,
                parsed_filters: parsedFilters,
            },
        };
    }

    @Get(':value')
    async getOne(@Param('value') value: string) {
        return this.stringsService.findOne(value)
    }
    @Get()
    async getAll(@Query() query: any) {
        return this.stringsService.findAll(query)
    }

    @Delete(':value')
    async remove(@Param('value') value: string, @Res() res: Response) {
        await this.stringsService.delete(value);
        return res.status(204).send()
    }
}

