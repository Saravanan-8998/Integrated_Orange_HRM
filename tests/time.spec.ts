import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, TimePage, MyInfoPage } from '../pageObjects/index';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, myInfoPage: MyInfoPage, timePage: TimePage, testData: TestData, page: Page, utils: Utils;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    utils = new Utils(page);
    // await utils.launchBrowsers();
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    myInfoPage = new MyInfoPage(page);
    timePage = new TimePage(page);
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
    await utils.clickMenu("link", homePage.homePageElements.time, "Time");
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Time Project Info', () => {
    test('Add Customer details', async () => {
        await utils.click(timePage.timeElements.projectInfo);
        await utils.clickByRole("menuitem", 'Customers', true);
        await timePage.addCustomer();
    });

    test('Add Project details', async () => {
        await utils.click(timePage.timeElements.projectInfo);
        await utils.clickByRole("menuitem", 'Projects', true);
        await timePage.addProjects();
        let cellValues = await timePage.getARowByColumnText('APlay Test Ltd');
        expect(cellValues.companyName).toEqual('APlay Test Ltd');
    });
});

test.describe('Time Timesheets', () => {
    test('Add My Timesheets details', async () => {
        await utils.click(timePage.timeElements.timesheets);
        await utils.clickByRole("menuitem", 'My Timesheets', true);
        await utils.click(timePage.timesheets.editButton);
        await utils.fillTextBoxValues(timePage.timesheets.project, "APlay", true);
        await utils.clickOption('option', "APlay Test Ltd - Demo Play Project");
        await utils.selecDropdownOption("option", timePage.timesheets.activity, "Aplay");
        await timePage.fillTimesheetHours();
        let actionsTableCells = await timePage.getTimesheetActionTable("Test User1");
        expect(await actionsTableCells.actions).toEqual("Submitted");
    });

    test('Retrieve Employee Timesheets', async () => {
        await utils.click(timePage.timeElements.timesheets);
        await utils.clickByRole("menuitem", 'Employee Timesheets', true);
        await utils.fillTextBoxValues(timePage.timeElements.employeeName, "Test", true);
        await utils.clickOption('option', "Test User1");
        await utils.click(timePage.timeElements.view);
        await utils.waitForElement(timePage.timeElements.tableContainer);
        let actionsTableCells = await timePage.getTimesheetActionTable("Test User1");
        expect(await actionsTableCells.actions).toEqual("Submitted");
    });
});

test.describe('Time Attendance', () => {
    test('Add Punch In/Out details', async () => {
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole("menuitem", 'Punch In/Out', true);
        await timePage.addPunchInPunchOut();
    });

    test('View My Records', async () => {
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole("menuitem", 'My Records', false);
        await utils.fillDateValue(timePage.timeElements.date, "2023-03-28");
        await utils.click(timePage.timeElements.view);
        await utils.waitForElement(timePage.timeElements.tableContainer);
        let tableCells = await timePage.getAttendanceRowCells("Logged out");
        expect(tableCells.duration).toEqual("9.00");
    });

    test('View Employee Records', async () => {
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole("menuitem", 'Employee Records', false);
        await utils.fillDateValue(timePage.timeElements.employeeName, "Test");
        await utils.clickOption('option', "Test User1");
        await utils.fillDateValue(timePage.timeElements.date, "2023-03-28");
        await utils.click(timePage.timeElements.view);
        await utils.waitForElement(timePage.reports.reportsTableContainer);
        let tableCells = await timePage.getAttendanceRowCells("Logged out");
        expect(tableCells.duration).toEqual("9.00");
    });

    test('Enable/Disable access from Configuration sub menu', async () => {
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole("menuitem", 'Configuration', true);
        await utils.clickElementWithIndex(timePage.attendance.switch, 1);
        await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole("menuitem", 'My Records', false);
        let tableRow = await utils.isElementVisible(timePage.attendance.deleteIcon);
        expect(tableRow).toBeFalsy();
    });
});

test.describe('Time Reports', () => {
    test('Search and View project Reports', async () => {
        await timePage.searchAndViewReports("Project Reports", timePage.reports.project, "APlay", "APlay Test Ltd - Demo Play Project");
        await utils.waitForElement(timePage.reports.reportsTableContainer);
        expect(await utils.getText(timePage.reports.activityName)).toEqual("Aplay");
    });

    test('Search and View Employee Reports', async () => {
        await timePage.searchAndViewReports("Employee Reports", timePage.timeElements.employeeName, "Test", "Test User1");
        await utils.waitForElement(timePage.reports.reportsTableContainer);
        await utils.isElementVisible(timePage.reports.employeeReportsTable);
        let minimizeIcon = await timePage.maximizeMinimizeReports(timePage.reports.maximize, timePage.reports.minimize);
        expect(minimizeIcon.includes(Constants.others.minimizeIconClass)).toBeTruthy();
        let maximizeIcon = await timePage.maximizeMinimizeReports(timePage.reports.minimize, timePage.reports.maximize);
        expect(maximizeIcon.includes(Constants.others.maximizeIconClass)).toBeTruthy();
    });

    test('Search and View Employee Attendance Summary', async () => {
        await timePage.searchAndViewReports("Attendance Summary", timePage.timeElements.employeeName, "Test", "Test User1");
        await utils.waitForElement(timePage.reports.reportsTableContainer);
        let employeeReportTable = await utils.isElementVisible(timePage.reports.employeeReportsTable);
        expect(employeeReportTable).toBeTruthy();
        let hours = await utils.getText(timePage.reports.totalDurationHours);
        expect(hours).toEqual("9.00");
    });
});