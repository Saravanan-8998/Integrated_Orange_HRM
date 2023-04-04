import { expect, test, Page } from "@playwright/test";
import { LoginPage } from "../pageObjects/login_Page";
import subURL from "./subURL.json";
import { myBrowserFixture } from "./fixtures";
import { PIMPage } from "../pageObjects/main";

let page: Page;
let loginPage: LoginPage;
let main : PIMPage;

async function before() {
    page = (await myBrowserFixture()).page;
    await page.goto(subURL.login);
    loginPage = new LoginPage(page);
    main = new PIMPage(page);
}

async function checkLanguage(username:any) {
    await loginPage.enterCredentials(username, 'Admin@123');
    await page.goto(subURL.language);
    await main.changeToEng();
}

async function after() {
    await page.close();
}

export async function changeLanguage(username: any) {
    await before();
    await checkLanguage(username);
    await after();
}