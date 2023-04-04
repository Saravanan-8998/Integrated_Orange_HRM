import { Page, expect } from "@playwright/test";
import constants from "../support/constants.json";

export class PIMPage {
    readonly page: Page; firstName: string; middleName: string; lastName: string; nickName: string; employeeId: string; toastMessage: string; addEmployee: string; closeIcon: string; save: string; addAdmin: any; empName: any; userRole: any; userStatus: any; userName: any; password: any; confirmPassword: any; saveAdmin: any; pageLoc: any; itManagerLoc: any;

    constructor(page: Page) {
        this.page = page;
        this.firstName = 'input.orangehrm-firstname';
        this.middleName = 'input.orangehrm-middlename';
        this.lastName = 'input.orangehrm-lastname';
        this.nickName = '//label[text()="Nickname"]/../..//div/input';
        this.employeeId = `//label[text()='Employee Id']/../..//div/input`;
        this.toastMessage = 'p.oxd-text--toast-message';
        this.closeIcon = '.oxd-toast-close-container';
        this.addEmployee = '//a[contains(text(),"Add Employee")]';
        this.save = 'button.oxd-button--medium';
        this.addAdmin = `//button[text()=' Add ']`;
        this.empName = `//input[@placeholder='Type for hints...']`;
        this.userRole = `(//div[@class='oxd-select-text-input'])[1]`;
        this.userStatus = `(//div[@class='oxd-select-text-input'])[2]`;
        this.userName = `(//label[text()='Username']/following::input)[1]`;
        this.password = `(//input[@type='password'])[1]`;
        this.confirmPassword = `(//input[@type='password'])[2]`;
        this.saveAdmin = `//button[@type='submit']`;
        this.pageLoc = {
            addEmp: `(//input[@placeholder='Type for hints...'])[1]`,
            searchBtn: `//button[text()=' Search ']`,
            recordList: `(//span[@class='oxd-text oxd-text--span'])[1]`,
        }
        this.itManagerLoc = {
            pencilFill: `//i[@class='oxd-icon bi-pencil-fill']`,
            jobSearch: `//a[contains(text(),'Job')]`,
            input1: `(//div[@class='oxd-select-text-input'])[1]`,
            input2: `(//div[@class='oxd-select-text-input'])[2]`,
            input3: `(//div[@class='oxd-select-text-input'])[3]`,
            submit: `//button[@type='submit']`,
            clickAdd : `.orangehrm-background-container`,
            logoutLoc : `oxd-userdropdown-name`
        }
    }

    async addEmpToAdmin(fullName: any) {
        await this.page.locator(this.addAdmin).click();
        await this.page.locator(this.userRole).click();
        await this.page.getByRole('option', { name: constants.mainPO.Admin }).getByText(constants.mainPO.Admin, { exact: true }).click();
        await this.page.locator(this.empName).fill(fullName);
        await this.page.getByRole('option', { name: fullName }).getByText(fullName, { exact: true }).click();
        await this.page.locator(this.userStatus).click();
        await this.page.getByRole('option', { name: constants.mainPO.Enabled }).getByText(constants.mainPO.Enabled, { exact: true }).click();
        await this.page.locator(this.userName).clear();
        await this.page.locator(this.userName).fill(fullName);
        await this.page.locator(this.password).fill(constants.Credentials.newUser);
        await this.page.locator(this.confirmPassword).fill(constants.Credentials.newUser);
        await this.page.waitForTimeout(5000);
        await this.page.locator(this.saveAdmin).click();
        await this.page.waitForTimeout(5000);
    }

    async addEmpToITManager(username: any) {
        await this.page.locator(this.pageLoc.addEmp).fill(username)
        await this.page.getByRole('option', { name: username }).getByText(username, { exact: true }).click();
        await this.page.locator(this.pageLoc.searchBtn).click();
        let records = await this.page.locator(this.pageLoc.recordList).textContent();
        await this.page.waitForTimeout(3000);
        if (records == constants.leaveModule.verifyMyTitleEntitlement) {
            await this.itManager();
        }
    }

    async itManager() {
        await this.page.locator(this.itManagerLoc.pencilFill).click();
        await this.page.locator(this.itManagerLoc.jobSearch).click();
        await this.page.locator(this.itManagerLoc.input1).click();
        await this.page.getByRole('option', { name: constants.mainPO.ITManager }).getByText(constants.mainPO.ITManager, { exact: true }).click();
        await this.page.locator(this.itManagerLoc.input2).click();
        await this.page.getByRole('option', { name: constants.mainPO.OfficialsAndManagers }).getByText(constants.mainPO.OfficialsAndManagers, { exact: true }).click();
        await this.page.locator(this.itManagerLoc.input3).click();
        await this.page.getByRole('option', { name: constants.mainPO.Development }).getByText(constants.mainPO.Development, { exact: true }).click();
        await this.page.locator(this.itManagerLoc.submit).click();
        await this.page.waitForTimeout(3000);
    }

    async logout() {
        await this.page.locator(this.itManagerLoc.logoutLoc).click();
        await this.page.getByRole('option', { name: constants.mainPO.Logout }).getByText(constants.mainPO.Logout, { exact: true }).click();
        await this.page.waitForTimeout(5000);
    }

    async clearTextBoxValues(locatorValue: any) {
        await this.page.locator(locatorValue).fill('');
        await this.page.waitForTimeout(1000);
    };

    async fillTextBoxValues(locatorValue: any, fillValue: any) {
        await (await this.page.waitForSelector(locatorValue)).waitForElementState("stable");
        await this.page.locator(locatorValue).type(fillValue);
    };

    async clickSave(locatorValue: string, index: number, messageToVerify?: string) {
        await this.page.locator(locatorValue).nth(index).click();
        expect(await this.getToastMessage()).toEqual(messageToVerify);
        await this.clickCloseIcon();
    }

    async getToastMessage() {
        return await this.page.locator(this.toastMessage).textContent();
    }

    async clickCloseIcon() {
        await this.page.locator(this.closeIcon).click();
    }

    async clickAddEmployeeMenu() {
        await this.page.waitForSelector(this.addEmployee);
        await this.page.getByRole('link', { name: constants.mainPO.AddEmployee }).click();
        await this.page.waitForSelector(this.itManagerLoc.clickAdd);
        await this.page.waitForTimeout(5000);
    };

    async fillFieldValues(namesLocators: any, values: any) {
        for (const locator of namesLocators) {
            await this.clearTextBoxValues(locator);
            const index = namesLocators.indexOf(locator);
            await this.fillTextBoxValues(locator, values[index]);
            await this.page.waitForTimeout(3000);
        };
    }
}