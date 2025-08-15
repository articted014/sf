import { defineConfig } from '@playwright/test';

export default defineConfig({
    reporter: [
        ['list'],
        ['allure-playwright']
    ],
    // ...other config
});