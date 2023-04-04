import { Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly homePageElements: any;

    constructor(page: Page) {
        this.page = page;
        this.homePageElements = {
            myInfo: '//span[text()="My Info"]',
            directory: '//span[text()="Directory"]',
            performance: '//span[text()="Performance"]',
            admin: '//span[text()="Admin"]',
            pim: '//span[text()="PIM"]',
            time: '//span[text()="Time"]',
            buzz: '//span[text()="Buzz"]',
            maintenance: '//span[text()="Maintenance"]',
            dashboardGrid: 'div.orangehrm-dashboard-grid'
        }
    }
}