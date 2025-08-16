import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import log from '../utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

test('Devnet Token Validation', async ({ request }) => {
    const address = process.env.ADDRESS;
    const token = process.env.API_TOKEN;
    const network = process.env.DEV_NETWORK;
    const baseUrl = process.env.API_URL;
    const url = `${baseUrl}/${address}?network=${network}`;

    log.info('Check if all env variables are set');
    if (!address || !token || !baseUrl || !network) {
        throw new Error('Missing required environment variables!');
    }

    log.info(`Sending request to ${url}`);
    const response = await request.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: '*/*',
        },
    });

    // Validate the response status
    expect(response.status()).toBe(200);

    // Parse the response and fetch tokens
    const body = await response.json();
    const tokens = body.tokens;
    log.info(`Response body: ${JSON.stringify(body)}`);
    log.info(`Tokens received: ${JSON.stringify(tokens)}`);
    // Validate that the response includes multiple tokens, not just SOL.
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(1);

    // Confirm that the response contains tokens with a mint address.
    log.info(`Validating tokens...`);
    tokens.forEach((t: any) => {
        expect(t.mint).toBeDefined();
        expect(typeof t.mint).toBe('string');
        expect(t.mint.length).toBeGreaterThan(0);
    });

    // Ensure totalUiAmount for each token has valid values.
    tokens.forEach((t: any) => {
        expect(t.totalUiAmount).not.toBeNull();
        expect(typeof t.totalUiAmount).toBe('number');
    });

    // Validate the type of fields such as price, coingeckoId, and verify if they exist for each token.
    tokens.forEach((t: any) => {
        // price may be missing or null
        if ('price' in t && t.price !== null && t.price !== undefined) {
            expect(typeof t.price).toBe('object');
            if ('price' in t.price && t.price.price !== null && t.price.price !== undefined) {
                expect(typeof t.price.price).toBe('number');
            }
        }
        // coingeckoId may be null
        expect('coingeckoId' in t).toBe(true);
        if (t.coingeckoId !== null && t.coingeckoId !== undefined) {
            expect(typeof t.coingeckoId).toBe('string');
        }
    });

    // Ensure there are tokens in addition to SOL
    const nonSolTokens = tokens.filter((t: any) => t.symbol !== 'SOL');
    expect(nonSolTokens.length).toBeGreaterThan(0);
});