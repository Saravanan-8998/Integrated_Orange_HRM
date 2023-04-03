import { Page, expect } from "@playwright/test";
import { HomePage } from "./homePage";

let homePage: HomePage;

export class LoginPage {
    readonly page: Page;
    readonly loginElements: any;

    constructor(page: Page) {
        this.page = page;
        homePage = new HomePage(page);
        this.loginElements = {
            userName: '[name="username"]',
            password: '[name="password"]',
            loginButton: "//button[normalize-space()='Login']"
        }
    }

    // This function is used to "launch the application base url"
    async getBaseURL() {
        await this.page.goto('/');
    }

    // This function is used to get the "Username" element
    async getUserNameElement() {
        await this.page.waitForSelector(this.loginElements.userName);
        return this.loginElements.userName;
    };

    // This function is used to get the "Password" element
    async getPasswordElement() {
        await this.page.waitForSelector(this.loginElements.password);
        return this.loginElements.password;
    };

    // This function is used to login into application
    async fillUsrNameAndPwdAndLogin(userName: string, password: string) {
        let getUserNameElem = await this.getUserNameElement();
        await this.page.locator(getUserNameElem).fill(userName);
        await this.page.locator(await this.getPasswordElement()).fill(password);
        await this.clickLogin();
        await expect(this.page).toHaveURL(/.*dashboard/);
        await this.page.waitForSelector(homePage.homePageElements.dashboardGrid);
    }

    // This function is used to click on the "Login" button
    async clickLogin() {
        await (await this.page.waitForSelector(this.loginElements.loginButton)).waitForElementState("stable");
        await this.page.locator(this.loginElements.loginButton).click();
    };
}