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
let result: string = '';
let fullNameValue: string;
let nameValues1 = ['Saravanan', autoGenerate(99), 'Test', autoGenerate(9999)];
let nameValues2 = ['Saravanan', autoGenerate(99), 'Test', autoGenerate(9999)];

function autoGenerate(max: number) {
    let num = Math.floor(Math.random() * max  + 22) + 99;
    return num.toString();
}

export async function getAdminFullName() {
    for (let i = 0; i < 2; i++) {
        result += nameValues1[i] + " ";
    }
    return fullNameValue = result + 'Test';
}

export async function getITManagerFullName() {
    for (let i = 0; i < 2; i++) {
        result += nameValues1[i] + " ";
    }
    return fullNameValue = result + 'Test';
}

async function before() {
    page = (await myBrowserFixture()).page;
    await page.goto(subURL.login);
    dashboard = new Dashboard(page);
    loginPage = new LoginPage(page);
    pimPage = new PIMPage(page);
    await loginPage.enterCredentials(ENV.USERNAME, ENV.PASSWORD);
}

async function createAdmin() {
    await page.goto(subURL.pim);
    await pimPage.clickAddEmployeeMenu();
    let namesLocators = [pimPage.firstName, pimPage.middleName, pimPage.lastName, pimPage.employeeId];
    await pimPage.fillFieldValues(namesLocators, nameValues1);
    await pimPage.clickSave(pimPage.save, 1, 'Successfully Saved');
    await page.waitForTimeout(5000);
}

async function createItManager() {
    await page.goto(subURL.pim);
    await pimPage.clickAddEmployeeMenu();
    let namesLocators = [pimPage.firstName, pimPage.middleName, pimPage.lastName, pimPage.employeeId];
    await pimPage.fillFieldValues(namesLocators, nameValues2);
    await pimPage.clickSave(pimPage.save, 1, 'Successfully Saved');
    await page.waitForTimeout(5000);
}

async function updateUserToAdmin() {
    await page.goto(subURL.admin);
    let fullName = await getAdminFullName();
    await pimPage.addEmpToAdmin(fullName);
}

async function updateUserToITManager() {
    await page.goto(subURL.pim);
    let fullName = await getITManagerFullName();
    await pimPage.addEmpToITManager(fullName);
}

async function after() {
    await page.close();
}

export async function createAdminUser() {
    await before();
    await createAdmin();
    await updateUserToAdmin();
    await after();
}

export async function createITManager() {
    await before();
    await createItManager();
    await updateUserToITManager();
    await after();
}