import { test, expect, Page } from '@playwright/test';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, DirectoryPage } from '../pageObjects';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, directoryPage: DirectoryPage, testData: TestData, page: Page, utils: Utils;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    utils = new Utils(page);
    // await utils.launchBrowsers();
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    directoryPage = new DirectoryPage(page);
    testData = new TestData(page);
    await loginPage.getBaseURL();
    await expect(page).toHaveURL(/.*login/);
    let pass = await testData.encodeDecodePassword();
    await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
    await utils.deleteUsers();
    await utils.createUsers("Test", "User1", "testuser1");
    await utils.updatingUserRole("testuser1", "Admin");
    await utils.logout();
    await loginPage.fillUsrNameAndPwdAndLogin("testuser1", "Testuser@12");
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Directory', () => {
    test('Filling Directory details', async () => {
        await utils.clickMenu("link", homePage.homePageElements.directory, "Directory");
        await utils.fillTextBoxValues(directoryPage.directory.employeeName, "Test", true);
        await utils.clickOption("option", "Test User1");
        await utils.selecDropdownOption("option", directoryPage.directory.jobTitle, "Software Engineer");
        await utils.selecDropdownOption("option", directoryPage.directory.location, "Texas R&D");
        await utils.click(directoryPage.directory.search);
        await utils.waitForSpinnerToDisappear();
        expect(await (await directoryPage.getRecordsCount()).trim()).toEqual('(1) Record Found');
        expect(await (await directoryPage.getEmployeeName()).trim()).toEqual('Test  User1');
    });
});