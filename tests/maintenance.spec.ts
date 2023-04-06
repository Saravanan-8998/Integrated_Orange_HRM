import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, MaintenancePage } from '../pageObjects';
import { Utils } from '../support/utils';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, maintenancePage: MaintenancePage, testData: TestData, page: Page, utils: Utils;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    utils = new Utils(page);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    maintenancePage = new MaintenancePage(page);
    testData = new TestData(page);
    await loginPage.getBaseURL();
    await expect(page).toHaveURL(/.*login/);
    let pass = await testData.encodeDecodePassword();
    await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
    await utils.deleteUsersName(Constants.Users.testuserDelete1);
    await utils.deleteUsersName(Constants.Users.testuserDelete2);
    await utils.deleteUsers();
    await utils.createUsers(Constants.Users.firstNameUser1, Constants.Users.lastNameUser1, Constants.Users.userNameUser1);
    await utils.updatingUserRole(Constants.Users.userNameUser1, Constants.others.reportingMethodAdmin);
    await utils.createUsers(Constants.Users.firstNameUser2, Constants.Users.lastNameUser2, Constants.Users.userNameUser2);
    await utils.updatingUserRole(Constants.Users.userNameUser2, Constants.others.reportingMethodAdmin);
    await utils.terminateEmployee(Constants.Users.employeeNameUser2);
    await utils.logout();
    await loginPage.fillUsrNameAndPwdAndLogin(Constants.Users.userNameUser1, Constants.Users.password);
    await homePage.clickMaintenanceMenu();
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Filling Admin Information and accessing Maintenance', () => {
    test('Login using Admin Information', async () => {
        await maintenancePage.fillPwdAndLogin(Constants.Users.password);
    });

    test('Searching for Purge Employee Records', async () => {
        await maintenancePage.clickHeaderMenu(maintenancePage.maintenanceHeadersLocators.purgeRecordsMenu);
        await maintenancePage.clickElementWithIndex(maintenancePage.maintenanceHeadersLocators.employeeRecordsDropDownMenu, 0);
        await maintenancePage.fillTextBoxValues(maintenancePage.purgeRecordsLocators.pastEmployee, Constants.maintenanceModule.pastEmployee);
        await maintenancePage.selecDropdownOption(maintenancePage.purgeRecordsLocators.pastEmployee, Constants.maintenanceModule.pastEmployee);
        await maintenancePage.clickElementWithIndex(maintenancePage.actionButton, 0);
        await maintenancePage.purgeAllEmployee();
    });

    test('Searching for Purge Candidate Records and Purge All Candidates', async () => {
        await maintenancePage.clickHeaderMenu(maintenancePage.maintenanceHeadersLocators.purgeRecordsMenu);
        await maintenancePage.clickElementWithIndex(maintenancePage.maintenanceHeadersLocators.candidateRecordsDropDownMenu, 0);
        await maintenancePage.fillTextBoxValues(maintenancePage.purgeRecordsLocators.vacancy, Constants.maintenanceModule.vacancy);
        await maintenancePage.selecDropdownOption(maintenancePage.purgeRecordsLocators.vacancy, Constants.maintenanceModule.vacancy);
        await maintenancePage.clickElementWithIndex(maintenancePage.actionButton, 0);
        await maintenancePage.purgeAllRecords();
    });

    test('Searching for Employee Records Information and Downloading Information', async () => {
        await maintenancePage.click(maintenancePage.maintenanceHeadersLocators.accessRecordsMenu);
        await maintenancePage.fillTextBoxValues(maintenancePage.purgeRecordsLocators.employeeName, Constants.maintenanceModule.employeeName);
        await maintenancePage.selecDropdownOption(maintenancePage.purgeRecordsLocators.employeeName, Constants.maintenanceModule.employeeName);
        await maintenancePage.clickElementWithIndex(maintenancePage.actionButton, 0);
        await maintenancePage.downloadEmployeeInformation();
    });
});