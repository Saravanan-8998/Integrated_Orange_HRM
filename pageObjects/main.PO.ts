import { Page, expect } from "@playwright/test";

export class PIMPage {
    readonly page: Page;
    readonly firstName: string;
    readonly middleName: string;
    readonly lastName: string;
    readonly nickName: string;
    readonly employeeId: string;
    readonly toastMessage: string;
    readonly addEmployee: string;
    readonly closeIcon: string;
    readonly save: string;

    readonly addAdmin: any;
    readonly empName: any;
    readonly userRole: any;
    readonly userStatus: any;
    readonly userName: any;
    readonly password: any;
    readonly confirmPassword: any;
    readonly saveAdmin: any;

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
    }

    async addEmpToAdmin(fullName : any) {
        await this.page.locator(this.addAdmin).click();
        await this.page.locator(this.userRole).click();
        await this.page.getByRole('option', { name: 'Admin' }).getByText('Admin', { exact: true }).click();
        await this.page.locator(this.empName).fill(fullName);
        await this.page.getByRole('option', { name: fullName }).getByText(fullName, { exact: true }).click();
        await this.page.locator(this.userStatus).click();
        await this.page.getByRole('option', { name: 'Enabled' }).getByText('Enabled', { exact: true }).click();
        await this.page.locator(this.userName).clear();
        await this.page.locator(this.userName).fill(fullName);
        await this.page.locator(this.password).fill('Admin@123');
        await this.page.locator(this.confirmPassword).fill('Admin@123');
        await this.page.waitForTimeout(5000);
        await this.page.locator(this.saveAdmin).click();
        await this.page.waitForTimeout(5000);
    }

    async addEmpToITManager(username : any){
        await this.page.locator(`(//input[@placeholder='Type for hints...'])[1]`).fill(username)
        await this.page.getByRole('option', { name: username }).getByText(username, { exact: true }).click();
        await this.page.locator(`//button[text()=' Search ']`).click();
        let records = await this.page.locator(`(//span[@class='oxd-text oxd-text--span'])[1]`).textContent();
        await this.page.waitForTimeout(3000);
        if(records == '(1) Record Found'){
            await this.itManager();
        }
    }

    async itManager(){
        await this.page.locator(`//i[@class='oxd-icon bi-pencil-fill']`).click();
        await this.page.locator(`//a[contains(text(),'Job')]`).click();
        await this.page.locator(`(//div[@class='oxd-select-text-input'])[1]`).click();
        await this.page.getByRole('option', { name: 'IT Manager' }).getByText('IT Manager', { exact: true }).click();
        await this.page.locator(`(//div[@class='oxd-select-text-input'])[2]`).click();
        await this.page.getByRole('option', { name: 'Officials and Managers' }).getByText('Officials and Managers', { exact: true }).click();
        await this.page.locator(`(//div[@class='oxd-select-text-input'])[3]`).click();
        await this.page.getByRole('option', { name: 'Development' }).getByText('Development', { exact: true }).click();
        await this.page.locator(`//button[@type='submit']`).click();
        await this.page.waitForTimeout(3000);
    }

    async logout(){
        await this.page.locator(`oxd-userdropdown-name`).click();
        await this.page.getByRole('option', { name: 'Logout' }).getByText('Logout', { exact: true }).click();
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
        await this.page.getByRole('link', { name: 'Add Employee' }).click();
        await this.page.waitForSelector(`.orangehrm-background-container`);
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

    async delete(){
        await this.page.locator(`(//i[contains(@class,'oxd-icon bi-check')])[1]`).click();
        await this.page.waitForTimeout(2000);
        await this.page.locator(`//button[text()=' Delete Selected ']`).click();
        await this.page.waitForTimeout(2000);
        await this.page.locator(`//button[text()=' Yes, Delete ']`).click();
        await this.page.waitForTimeout(3000);
    }
}