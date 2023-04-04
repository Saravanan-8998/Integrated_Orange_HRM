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
            dashboardGrid: 'div.orangehrm-dashboard-grid',
            menuHeader: `ul.oxd-main-menu`,
            buzzContainer: 'div.orangehrm-buzz-newsfeed',
            cardContainer: 'div.orangehrm-card-container'
        }
    }

    // This function is used to select Buzz Menu
    async clickBuzzMenu() {
        await (await this.page.waitForSelector(this.homePageElements.menuHeader)).waitForElementState('stable');
        await this.page.getByRole('link', { name: 'Buzz' }).click();
        await this.page.waitForSelector(this.homePageElements.buzzContainer);
        await this.page.waitForTimeout(2000);
    };

    // This function is used to select Maintenance Menu
    async clickMaintenanceMenu() {
        await (await this.page.waitForSelector(this.homePageElements.menuHeader)).waitForElementState('stable');
        await this.page.getByRole('link', { name: 'Maintenance' }).click();
        await this.page.waitForSelector(this.homePageElements.cardContainer);
        await this.page.waitForTimeout(2000);
    };
}