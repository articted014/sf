import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

test('Devnet Token Validation', async ({ request }) => {
    const address = process.env.ADDRESS;
    const token = process.env.API_TOKEN;
    const network = process.env.DEV_NETWORK;
    const baseUrl = process.env.API_URL;
    const url = `${baseUrl}/${address}?network=${network}`;

    if (!address || !token || !baseUrl || !network) {
        throw new Error('Missing required environment variables!');
    }

    const response = await request.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: '*/*',
        },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    const tokens = body.tokens;

    // 2. Validate that the response includes multiple tokens, not just SOL.
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(1);

    // 3. Confirm that the response contains tokens with a mint address.
    tokens.forEach((t: any) => {
        expect(t.mint).toBeDefined();
        expect(typeof t.mint).toBe('string');
        expect(t.mint.length).toBeGreaterThan(0);
    });

    // 4. Ensure totalUiAmount for each token has valid values.
    tokens.forEach((t: any) => {
        expect(t.totalUiAmount).not.toBeNull();
        expect(typeof t.totalUiAmount).toBe('number');
    });

    // 5. Validate the type of fields such as price, coingeckoId, and verify if they exist for each token.
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

    // 2. (again) Ensure there are tokens in addition to SOL
    const nonSolTokens = tokens.filter((t: any) => t.symbol !== 'SOL');
    expect(nonSolTokens.length).toBeGreaterThan(0);
});