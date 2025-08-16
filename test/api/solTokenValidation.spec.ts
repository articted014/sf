import { test, expect } from '@playwright/test';

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import log from '../utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

test('GET portfolio tokens', async ({ request }) => {
    const address = process.env.ADDRESS;
    const token = process.env.API_TOKEN;
    const baseUrl = process.env.API_URL;
    const url = `${baseUrl}/${address}`;

    log.info('Check if all env variables are set');
    if (!address || !token || !baseUrl) {
        throw new Error('Missing required environment variables!');
    }

    log.info(`Sending request to ${url}`);
    const response = await request.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: '*/*',
        },
    });


    const body = await response.json();
    log.info(`Response status: ${response.status()}`);
    log.info(`Response body: ${JSON.stringify(body)}`);
    expect(response.status()).toBe(200);

    const tokens = body.tokens;

    log.info(`Validating Sol token...`);
    // Checking SOL token properties values: name, mint, totalUiAmount
    const solToken = tokens.find((t: any) => t.symbol === 'SOL');
    expect(solToken).toBeDefined();
    expect(solToken.name).toBe('Solana');
    expect(solToken.mint).toBe('11111111111111111111111111111111');
    expect(solToken.totalUiAmount).toBeGreaterThan(0);
});