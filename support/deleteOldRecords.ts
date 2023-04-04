import { expect, test, Page } from "@playwright/test";
import { LoginPage } from "../pageObjects/login_Page";
import subURL from "./subURL.json";
import { myBrowserFixture } from "./fixtures";
import { Dashboard } from "../pageObjects/dashboardPage";
import ENV from "./env";
import { PIMPage } from "../pageObjects/main";

let page: Page;
let dashboard: Dashboard;
let loginPage: LoginPage;
let pimPage: PIMPage;

async function before() {
    page = (await myBrowserFixture()).page;
    await page.goto(subURL.login);
    dashboard = new Dashboard(page);
    loginPage = new LoginPage(page);
    pimPage = new PIMPage(page);
    await loginPage.enterCredentials(ENV.USERNAME, ENV.PASSWORD);
}

async function deleteAllUser() {
    await before();
    await page.goto(subURL.pim);
    await page.waitForTimeout(3000);
    await page.close();
}

async function deleteAllVacancy() {
    await before();
    await page.goto(subURL.viewJobVacancy);
    await page.waitForTimeout(5000);
    await page.close();
}

async function deleteAllCandidates() {
    await before();
    await page.goto(subURL.viewCandidates);
    await page.waitForTimeout(5000);
    await page.close();
}

export async function autoDelete() {
    await deleteAllUser();
    await deleteAllVacancy();
    await deleteAllCandidates();
}