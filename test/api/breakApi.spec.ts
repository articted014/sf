import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import log from '../utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

test('Break API by sending network=123', async ({ request }) => {
    const address = process.env.ADDRESS;
    const token = process.env.API_TOKEN;
    // Intentional wrong network parameter in order to get 400 Bad Request
    const network = 123;
    const baseUrl = process.env.API_URL;
    const url = `${baseUrl}/${address}?network=${network}`;

    log.info('Check if all env variables are set');
    if (!address || !token || !baseUrl) {
        log.error('Missing required environment variables!');
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
    expect(response.status()).toBe(400);
    expect(body.message).toBeDefined();
});