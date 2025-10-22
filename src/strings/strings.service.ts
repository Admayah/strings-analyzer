import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StringEntity } from './entities/string.entities';
import { Repository } from 'typeorm';
import { analyzeString } from './utils/analyzer';

@Injectable()
export class StringsService {
    constructor(
        @InjectRepository(StringEntity)
        private repo: Repository<StringEntity>,
    ) { }

    async create(value: string) {
        if (typeof value !== 'string') {
            throw new BadRequestException('Value must be a string')
        }

        const properties = analyzeString(value)
        const exists = await this.repo.findOne({ where: { id: properties.sha256_hash } })

        if (exists) throw new ConflictException('String already exists')

        const newString = this.repo.create({
            id: properties.sha256_hash,
            value,
            properties
        })

        return await this.repo.save(newString);

    }

    async findOne(value: string) {
        const hash = analyzeString(value).sha256_hash
        const foundValue = await this.repo.findOne({ where: { id: hash } })

        if (!foundValue) throw new NotFoundException('String not found');

        return foundValue;
    }

    // async findAll(filters?: any) {
    //     let query = this.repo.createQueryBuilder('string');

    //     if (filters?.is_palindrome !== undefined) {
    //         query.andWhere(`string.properties ->> 'is_palindrome' = :is_palindrome`, {
    //             is_palindrome: String(filters.is_palindrome),
    //         });
    //     }

    //     if (filters?.min_length) {
    //         query.andWhere(`(string.properties ->> 'length')::int >= :min`, { min: filters.min_length });
    //     }

    //     if (filters?.max_length) {
    //         query.andWhere(`(string.properties ->> 'length')::int <= :max`, { max: filters.max_length });
    //     }

    //     if (filters?.word_count) {
    //         query.andWhere(`(string.properties ->> 'word_count')::int = :wc`, { wc: filters.word_count });
    //     }

    //     if (filters?.contains_character) {
    //         query.andWhere(`string.value ILIKE :char`, { char: `%${filters.contains_character}%` });
    //     }

    //     const data = await query.getMany();
    //     return { data, count: data.length, filters_applied: filters };
    // }

    // strings.service.ts
    async findAll(filters?: Record<string, any>) {
        const qb = this.repo.createQueryBuilder('string');

        if (filters?.min_length) {
            qb.andWhere(`(string.properties->>'length')::int >= :minLength`, {
                minLength: filters.min_length,
            });
        }

        if (filters?.max_length) {
            qb.andWhere(`(string.properties->>'length')::int <= :maxLength`, {
                maxLength: filters.max_length,
            });
        }

        if (filters?.word_count) {
            qb.andWhere(`(string.properties->>'word_count')::int = :wordCount`, {
                wordCount: filters.word_count,
            });
        }

        if (filters?.is_palindrome !== undefined) {
            qb.andWhere(`(string.properties->>'is_palindrome')::boolean = :isPalindrome`, {
                isPalindrome: filters.is_palindrome,
            });
        }

        if (filters?.contains_character) {
            qb.andWhere(`string.value ILIKE :char`, {
                char: `%${filters.contains_character}%`,
            });
        }

        const data = await qb.orderBy('string.created_at', 'DESC').getMany();
        return { data, count: data.length, filters_applied: filters };
    }


    parseNaturalLanguageQuery(query: string) {
        const lower = query.toLowerCase();
        const parsedFilters: Record<string, any> = {};
        let error: string | null = null;

        try {
            if (lower.includes('palindromic')) parsedFilters.is_palindrome = true;

            if (lower.includes('single word')) parsedFilters.word_count = 1;
            else if (lower.includes('multiple words') || lower.includes('multi word'))
                parsedFilters.word_count = 2;

            const lengthMatch = lower.match(/longer than (\d+)/);
            if (lengthMatch) parsedFilters.min_length = parseInt(lengthMatch[1]) + 1;

            const shorterMatch = lower.match(/shorter than (\d+)/);
            if (shorterMatch) parsedFilters.max_length = parseInt(shorterMatch[1]) - 1;

            const containsMatch = lower.match(/containing the letter ([a-z])/);
            if (containsMatch) parsedFilters.contains_character = containsMatch[1];

            if (lower.includes('first vowel')) parsedFilters.contains_character = 'a';

            if (Object.keys(parsedFilters).length === 0) {
                error = 'Unable to parse natural language query';
            }
        } catch (err) {
            error = 'Error parsing query';
        }

        return { parsedFilters, error };
    }


    async delete(value: string) {
        const hash = analyzeString(value).sha256_hash;
        const found = await this.repo.findOne({ where: { id: hash } });
        if (!found) throw new NotFoundException('String not found');
        await this.repo.delete(hash);
        return;
    }
}
