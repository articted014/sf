import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

test('Switching from mainnet to devnet and back restores original response', async ({ request }) => {
    const address = process.env.ADDRESS;
    const token = process.env.API_TOKEN;
    const baseUrl = process.env.API_URL;
    const url = `${baseUrl}/${address}`;

    const devNetwork = process.env.DEV_NETWORK;
    const mainNetwork = process.env.MAIN_NETWORK;

    // First Request (Main network)
    const mainnetResponse1 = await request.get(`${url}?network=${mainNetwork}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    expect(mainnetResponse1.status()).toBe(200);
    const mainnetBody1 = await mainnetResponse1.json();
    const mainnetTokens1 = mainnetBody1.tokens;
    expect(Array.isArray(mainnetTokens1)).toBe(true);

    // Second Request (Dev network)
    const devnetResponse = await request.get(`${url}?network=${devNetwork}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    expect(devnetResponse.status()).toBe(200);
    const devnetBody = await devnetResponse.json();
    const devnetTokens = devnetBody.tokens;
    expect(Array.isArray(devnetTokens)).toBe(true);

    // Validate that additional tokens appear in Dev network response
    expect(devnetTokens.length).toBeGreaterThan(mainnetTokens1.length);

    // Third Request (Back to Main network)
    const mainnetResponse2 = await request.get(`${url}?network=${mainNetwork}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    expect(mainnetResponse2.status()).toBe(200);
    const mainnetBody2 = await mainnetResponse2.json();
    const mainnetTokens2 = mainnetBody2.tokens;
    expect(Array.isArray(mainnetTokens2)).toBe(true);

    // Ensure all token balances and details match the original mainnet response (except price)
    function stripPriceFields(token: any) {
        const { price, solPrice, ...rest } = token;
        return rest;
    }
    const strippedMainnet1 = mainnetTokens1.map(stripPriceFields);
    const strippedMainnet2 = mainnetTokens2.map(stripPriceFields);

    expect(strippedMainnet2).toEqual(strippedMainnet1);

    // Ensure there are no API errors in any response
    expect(mainnetBody1.errors).toEqual([]);
    expect(devnetBody.errors).toEqual([]);
    expect(mainnetBody2.errors).toEqual([]);
});