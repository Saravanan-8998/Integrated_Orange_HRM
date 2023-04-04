import { Page } from "@playwright/test";

export class DirectoryPage {
    readonly page: Page;
    readonly directory: any;

    constructor(page: Page) {
        this.page = page;
        this.directory = {
            employeeName: "//label[text()='Employee Name']/../..//input",
            jobTitle: "//label[text()='Job Title']/../../..//div[contains(@class,'text-input')]",
            location: "//label[text()='Location']/../../..//div[contains(@class,'text-input')]",
            search: "//button[normalize-space()='Search']",
            reset: "//button[normalize-space()='Reset']",
            recordsCount: ".orangehrm-horizontal-padding span",
            employeeCardHeader: ".orangehrm-directory-card .orangehrm-directory-card-header"
        }
    }

    // This function is used to retrieve the "Records Count"
    async getRecordsCount() {
        await (await this.page.waitForSelector(this.directory.recordsCount)).waitForElementState("stable");
        return await this.page.locator(this.directory.recordsCount).textContent();
    }

    // This function is used to retrieve the "Employee Name"
    async getEmployeeName() {
        await (await this.page.waitForSelector(this.directory.employeeCardHeader)).waitForElementState("stable");
        return await this.page.locator(this.directory.employeeCardHeader).textContent();
    }
}