import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page; logoImg: string; userName: string; password: string; inputUserName: string; inputPassword: string; loginBtn: string; inValidMsg: string; alertDiv: string; requiredMsg: string;

    constructor(page: Page) {
        this.page = page;
        this.logoImg = `img[alt='company-branding']`;
        this.userName = `//p[text()='Username : Admin']`;
        this.password = `//p[text()='Password : admin123']`;
        this.inputUserName = `input[name='username']`;
        this.inputPassword = `input[name='password']`;
        this.loginBtn = `button[type='submit']`;
        this.inValidMsg = `//p[text()='Invalid credentials']`;
        this.alertDiv = `//div[@role='alert']//div[1]`;
        this.requiredMsg = `(//span[contains(@class,'oxd-text oxd-text--span')])`;
    }

    async componentsVisibility() {
        await (await this.page.waitForSelector(this.logoImg)).isVisible();
        await (await this.page.waitForSelector(this.userName)).isVisible();
        await (await this.page.waitForSelector(this.password)).isVisible();
        await (await this.page.waitForSelector(this.inputUserName)).isVisible();
        await (await this.page.waitForSelector(this.inputPassword)).isVisible();
        await (await this.page.waitForSelector(this.loginBtn)).isVisible();
    }

    async enterCredentials(username: any, password: any) {
        await this.page.locator(this.inputUserName).fill(username);
        await this.page.locator(this.inputPassword).fill(password);
        await this.page.locator(this.loginBtn).click();
    }

    async invalid() {
        await this.page.waitForTimeout(5000);
        return await this.page.locator(this.inValidMsg).textContent();
    }

    async required() {
        return await this.page.locator(this.requiredMsg).textContent();
    }
}