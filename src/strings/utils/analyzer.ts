import * as crypto from 'crypto';


export function analyzeString(value: string) {
    const length = value.length;
    const lowerCase = value.toLowerCase();
    const reverseValue = lowerCase.split('').reverse().join('')
    const isPalindrome = lowerCase === reverseValue
    const uniqueCharacter =new Set(lowerCase.replace(/\s+/g, '')).size;
    const wordCount = value.trim().split(/\s+/).length
    const sha256Hash = crypto.createHash('sha256').update(value).digest('hex')

    const characterFrequencyMap: Record<string, number> = {}

    for (const char of value) {
        characterFrequencyMap[char] = (characterFrequencyMap[char] || 0) + 1;
    }

    return {
        sha256_hash: sha256Hash,
        length,
        is_palindrome: isPalindrome,
        unique_characters: uniqueCharacter,
        word_count: wordCount,
        character_frequency_map: characterFrequencyMap
    }
}