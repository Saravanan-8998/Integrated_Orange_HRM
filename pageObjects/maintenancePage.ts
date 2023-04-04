import { Page, expect, Download } from "@playwright/test";
import Constants from '../support/constants.json';

export class MaintenancePage {
    readonly page: Page;
    container: string;
    maintenanceHeadersLocators: any;
    purgeRecordsLocators: any;
    actionButton: string;
    confirmationPopup: string;
    popupText: string;
    popupDeleteButton: string;
    tableRow: string;
    password: string;
    loginButton: string;

    constructor(page: Page) {
        this.page = page;
        this.password = '[name="password"]';
        this.loginButton = '[type="submit"]';
        this.container = `.orangehrm-background-container`;
        this.actionButton = `button.oxd-button--medium`;
        this.confirmationPopup = 'div.orangehrm-dialog-popup';
        this.popupText = 'p.oxd-text--card-body';
        this.popupDeleteButton = '(//div[@class="orangehrm-modal-footer"]//button)[2]';
        this.tableRow = `div.oxd-table-card`;

        this.maintenanceHeadersLocators = {
            purgeRecordsMenu: `//span[text()='Purge Records ']`,
            accessRecordsMenu: `//a[text()='Access Records']`,
            employeeRecordsDropDownMenu: '//span[text()="Purge Records "]/..//ul[@class="oxd-dropdown-menu"]/..//a[text()="Employee Records"]',
            candidateRecordsDropDownMenu: '//span[text()="Purge Records "]/..//ul[@class="oxd-dropdown-menu"]/..//a[text()="Candidate Records"]'
        }
        this.purgeRecordsLocators = {
            pastEmployee: `//label[text()="Past Employee"]/../..//div/input`,
            vacancy: `//label[text()="Vacancy"]/../..//div/input`,
            employeeName: `//label[text()="Employee Name"]/../..//div/input`
        }
    };

    // This function is used to "click on the Header sub menus"
    async clickHeaderMenu(locator: string) {
        await this.page.waitForSelector(locator);
        await this.page.locator(locator).click();
        await this.page.waitForSelector(this.container);
        await this.page.waitForTimeout(5000);
    };

    // This function is used to "click on the element with index"
    async clickElementWithIndex(locatorValue: string, index: number) {
        await this.page.locator(locatorValue).nth(index).click();
        await this.page.waitForTimeout(2000);
    };

    // This function is used to fill the "textbox" values
    async fillTextBoxValues(locatorValue: any, fillValue: any) {
        await this.page.locator(locatorValue).clear();
        await (await this.page.waitForSelector(locatorValue)).waitForElementState("stable");
        await this.page.locator(locatorValue).type(fillValue);
    };

    // This function is used to "click on the element"
    async click(locator: any) {
        await this.page.locator(locator).click({ force: true });
    };

    // This function is used to click the dropdown and "select the passed value"
    async selecDropdownOption(locator: any, optionValue: any) {
        await this.click(locator);
        await this.page.getByRole('option', { name: optionValue }).getByText(optionValue, { exact: true }).first().click();
    };

    // This function is used to Purge the Records
    async purgeAllRecords() {
        this.page.locator(`//button[text()=' Purge All ']`).first().click();
        await this.page.waitForSelector(this.confirmationPopup);
        expect(await this.page.locator(this.popupText).textContent()).toEqual(Constants.popupText.purge);
        await this.page.locator(this.popupDeleteButton).click();
        expect(this.page.locator(this.tableRow).first()).not.toBeVisible();
    };

    // This function is used to get the "Password" element
    async getPasswordElement() {
        await this.page.waitForSelector(this.password);
        return this.password;
    };

    // This function is used to login into application
    async fillPwdAndLogin(password: string) {
        await this.page.locator(await this.getPasswordElement()).fill(password);
        await this.clickLogin();
    };

    // This function is used to click on the "Login" button
    async clickLogin() {
        await this.page.waitForSelector(this.loginButton);
        await this.page.locator(this.loginButton).click();
    };

    // This function is used to Download Employee Information
    async downloadEmployeeInformation() {
        this.page.locator(`button.oxd-button--medium`).last().click({ force: true });
        // Wait for the download to finish
        const download: Download = await this.page.waitForEvent('download');
        // Check if the download is complete
        const path: string = await download.path();
        console.log(`File downloaded to ${path}`);
        await download.delete();
    }
};
