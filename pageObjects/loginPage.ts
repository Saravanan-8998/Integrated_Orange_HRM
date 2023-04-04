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
            // userName: '[name="username"]',
            // password: '[name="password"]',
            loginButton: "//button[normalize-space()='Login']",
            logoImg : `img[alt='company-branding']`,
            userName : `//p[text()='Username : Admin']`,
            password : `//p[text()='Password : admin123']`,
            inputUserName : `input[name='username']`,
            inputPassword : `input[name='password']`,
            loginBtn : `button[type='submit']`,
            inValidMsg : `//p[text()='Invalid credentials']`,
            alertDiv : `//div[@role='alert']//div[1]`,
            requiredMsg : `(//span[contains(@class,'oxd-text oxd-text--span')])`
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
    async fillUsrNameAndPwdAndLogin(userName: any, password: string, ishomePageDasbboard?:boolean) {
        let getUserNameElem = await this.getUserNameElement();
        await this.page.locator(getUserNameElem).fill(userName);
        await this.page.locator(await this.getPasswordElement()).fill(password);
        await this.clickLogin();
        if(ishomePageDasbboard){
        await expect(this.page).toHaveURL(/.*dashboard/);
        }
        await this.page.waitForSelector(homePage.homePageElements.dashboardGrid);
    }

    // This function is used to click on the "Login" button
    async clickLogin() {
        await (await this.page.waitForSelector(this.loginElements.loginButton)).waitForElementState("stable");
        await this.page.locator(this.loginElements.loginButton).click();
    };

    async componentsVisibility() {
        await (await this.page.waitForSelector(this.loginElements.logoImg)).isVisible();
        await (await this.page.waitForSelector(this.loginElements.userName)).isVisible();
        await (await this.page.waitForSelector(this.loginElements.password)).isVisible();
        await (await this.page.waitForSelector(this.loginElements.inputUserName)).isVisible();
        await (await this.page.waitForSelector(this.loginElements.inputPassword)).isVisible();
        await (await this.page.waitForSelector(this.loginElements.loginBtn)).isVisible();
    }

    async enterCredentials(username: any, password: any) {
        await this.page.locator(this.loginElements.inputUserName).fill(username);
        await this.page.locator(this.loginElements.inputPassword).fill(password);
        await this.page.locator(this.loginElements.loginBtn).click();
    }

    async invalid() {
        await this.page.waitForTimeout(5000);
        return await this.page.locator(this.loginElements.inValidMsg).textContent();
    }

    async required() {
        return await this.page.locator(this.loginElements.requiredMsg).textContent();
    }
}