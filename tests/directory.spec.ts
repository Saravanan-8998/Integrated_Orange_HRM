import { test, expect, Page } from '@playwright/test';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import Constants from '../support/constants.json';
import { LoginPage, HomePage, DirectoryPage } from '../pageObjects';
import ENV from "../support/env";

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
    await utils.createUsers(Constants.Users.firstNameUser1, Constants.Users.lastNameUser1, Constants.Users.userNameUser1);
    await utils.updatingUserRole(Constants.Users.userNameUser1, Constants.others.reportingMethodAdmin);
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Directory', () => {
    test('Filling Directory details', async () => {
        await utils.clickMenu(Constants.Roles.link, homePage.homePageElements.directory, Constants.Menu.directory);
        await utils.fillTextBoxValues(directoryPage.directory.employeeName, Constants.Users.firstNameUser1, true);
        await utils.clickOption(Constants.Roles.option, Constants.Users.employeeNameUser1);
        await utils.selecDropdownOption(Constants.Roles.option, directoryPage.directory.jobTitle, Constants.others.jobTitleSE);
        await utils.selecDropdownOption(Constants.Roles.option, directoryPage.directory.location, Constants.others.jobLocation);
        await utils.click(directoryPage.directory.search);
        await utils.waitForSpinnerToDisappear();
        let recordCount = await directoryPage.getRecordsCount();
        expect(recordCount?.trim()).toEqual(Constants.recordsCount);
        let employeeName = await directoryPage.getEmployeeName();
        expect(employeeName?.trim()).toEqual(Constants.Users.employeeNameUser1Space);
    });
});