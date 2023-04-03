import { Page } from '@playwright/test';
import ENV from '../support/env';

export class TestData {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async encodeDecodePassword() {
        const encodedPassword = Buffer.from(ENV.PASSWORD, 'utf-8').toString('base64');
        const decodedPassword = Buffer.from(encodedPassword, 'base64').toString('utf-8');
        return decodedPassword;
    }
}