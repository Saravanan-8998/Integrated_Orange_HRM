import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, MaintenancePage } from '../page_objects';
import { Utils } from '../support/utils';
import ENV from '../support/env';
import { createAdminUser, getAdminFullName } from "../support/createUser";

let loginPage: LoginPage, homePage: HomePage, maintenancePage: MaintenancePage, testData: TestData, page: Page, utils: Utils;


let fullNameValue: any;
let USERNAME: any;

async function adminLogin() {
    await createAdminUser();
    fullNameValue = await getAdminFullName();
    USERNAME = fullNameValue.slice(14, 32);
    await loginPage.enterCredentials(USERNAME, 'Admin@123');
}

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    maintenancePage = new MaintenancePage(page);
    testData = new TestData(page);
    await loginPage.getBaseURL();
    await expect(page).toHaveURL(/.*login/);
    let pass = await testData.encodeDecodePassword();
    await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
    await utils.clickMenu("link", homePage.homePageElements.maintenance, "Maintenance");
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Filling Admin Information and accessing Maintenance', () => {
    test('Login using Admin Information', async () => {
        let pass = await testData.encodeDecodePassword();
        await maintenancePage.fillPwdAndLogin(pass);
    });
});

test.describe('Filling Purge Employee Records Information and Purging', () => {
    test('Searching for Purge Employee Records', async () => {
        await maintenancePage.clickHeaderMenu(maintenancePage.maintenanceHeadersLocators.purgeRecordsMenu);
        await maintenancePage.clickElementWithIndex(maintenancePage.maintenanceHeadersLocators.employeeRecordsDropDownMenu, 0);
        // await maintenancePage.fillTextBoxValues(maintenancePage.purgeRecordsLocators.pastEmployee, Constants.maintenanceModule.pastEmployee);
        // await maintenancePage.selecDropdownOption(maintenancePage.purgeRecordsLocators.pastEmployee, Constants.maintenanceModule.pastEmployee);
        await maintenancePage.clickElementWithIndex(maintenancePage.actionButton, 0);
    });
});

test.describe('Filling Purge Candidate Records Information and Purging', () => {
    test('Searching for Purge Candidate Records and Purge All Candidates', async () => {
        await maintenancePage.clickHeaderMenu(maintenancePage.maintenanceHeadersLocators.purgeRecordsMenu);
        await maintenancePage.clickElementWithIndex(maintenancePage.maintenanceHeadersLocators.candidateRecordsDropDownMenu, 0);
        await maintenancePage.fillTextBoxValues(maintenancePage.purgeRecordsLocators.vacancy, Constants.maintenanceModule.vacancy);
        await maintenancePage.selecDropdownOption(maintenancePage.purgeRecordsLocators.vacancy, Constants.maintenanceModule.vacancy);
        await maintenancePage.clickElementWithIndex(maintenancePage.actionButton, 0);
        await maintenancePage.purgeAllRecords();
    });
});

test.describe('Filling Employee Records Information and Downloading Information', () => {
    test('Searching for Purge Candidate Records and Purge All Candidates', async () => {
        await maintenancePage.click(maintenancePage.maintenanceHeadersLocators.accessRecordsMenu);
        await maintenancePage.fillTextBoxValues(maintenancePage.purgeRecordsLocators.employeeName, Constants.maintenanceModule.employeeName);
        await maintenancePage.selecDropdownOption(maintenancePage.purgeRecordsLocators.employeeName, Constants.maintenanceModule.employeeName);
        await maintenancePage.clickElementWithIndex(maintenancePage.actionButton, 0);
        await maintenancePage.downloadEmployeeInformation();
    });
});