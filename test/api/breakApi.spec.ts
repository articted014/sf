import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

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

    if (!address || !token || !baseUrl) {
        throw new Error('Missing required environment variables!');
    }

    const response = await request.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: '*/*',
        },
    });

    const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.message).toBeDefined();
});