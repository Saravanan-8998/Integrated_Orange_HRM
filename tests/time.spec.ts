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
    await utils.createUsers(Constants.Users.firstNameUser1, Constants.Users.lastNameUser1, Constants.Users.userNameUser1);
    await utils.updatingUserRole(Constants.Users.userNameUser1, Constants.others.reportingMethodAdmin);
    await utils.logout();
    await loginPage.fillUsrNameAndPwdAndLogin(Constants.Users.userNameUser1, Constants.Users.password, false);
    await utils.clickMenu(Constants.Roles.link, homePage.homePageElements.time, Constants.Menu.time);
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Time Project Info', () => {
    test('Add Customer details', async () => {
        await utils.click(timePage.timeElements.projectInfo);
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.customers, true);
        await timePage.addCustomer();
    });

    test('Add Project details', async () => {
        await utils.click(timePage.timeElements.projectInfo);
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.projects, true);
        await timePage.addProjects();
        let cellValues = await timePage.getAProjectRowByColumnText(Constants.projects.projectName);
        expect(cellValues.project).toEqual(Constants.projects.projectName);
    });
});

test.describe('Time Timesheets', () => {
    test('Add My Timesheets details', async () => {
        await utils.click(timePage.timeElements.timesheets);
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.myTimesheets, true);
        await utils.click(timePage.timesheets.editButton);
        await utils.fillTextBoxValues(timePage.timesheets.project, Constants.projects.projectShortName, true);
        await utils.clickOption(Constants.Roles.option, Constants.projects.projectCustomerName);
        await utils.selecDropdownOption(Constants.Roles.option, timePage.timesheets.activity, Constants.projects.projectShortName);
        await timePage.fillTimesheetHours();
        let actionsTableCells = await timePage.getTimesheetActionTable(Constants.Users.employeeNameUser1);
        expect(await actionsTableCells.actions).toEqual(Constants.status.submitted);
    });

    test('Retrieve Employee Timesheets', async () => {
        await utils.click(timePage.timeElements.timesheets);
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.employeeTimesheets, true);
        await utils.fillTextBoxValues(timePage.timeElements.employeeName, Constants.Users.firstNameUser1, true);
        await utils.clickOption(Constants.Roles.option, Constants.Users.employeeNameUser1);
        await utils.click(timePage.timeElements.view);
        await utils.waitForElement(timePage.timeElements.tableContainer);
        let actionsTableCells = await timePage.getTimesheetActionTable(Constants.Users.employeeNameUser1);
        expect(await actionsTableCells.actions).toEqual(Constants.status.submitted);
    });
});

test.describe('Time Attendance', () => {
    test('Add Punch In/Out details', async () => {
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.punchInOut, true);
        await timePage.addPunchInPunchOut();
    });

    test('View My Records', async () => {
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.myRecords, false);
        await utils.waitForElement(timePage.timeElements.tableContainer);
        await utils.fillDateValue(timePage.timeElements.date, Constants.Dates.attendanceDate);
        await utils.click(timePage.timeElements.view);
        await utils.waitForElement(timePage.timeElements.tableContainer);
        let tableCells = await timePage.getAttendanceRowCells(Constants.others.loggedOut);
        expect(tableCells.duration).toEqual(Constants.others.nineHrs);
    });

    test('View Employee Records', async () => {
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.employeeRecords, false);
        await utils.fillDateValue(timePage.timeElements.employeeName, Constants.Users.firstNameUser1);
        await utils.clickOption(Constants.Roles.option, Constants.Users.employeeNameUser1);
        await utils.fillDateValue(timePage.timeElements.date, Constants.Dates.attendanceDate);
        await utils.click(timePage.timeElements.view);
        await utils.waitForElement(timePage.reports.reportsTableContainer);
        let tableCells = await timePage.getAttendanceRowCells(Constants.others.loggedOut);
        expect(tableCells.duration).toEqual(Constants.others.nineHrs);
    });

    test('Enable/Disable access from Configuration sub menu', async () => {
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.configuration, true);
        await utils.clickElementWithIndex(timePage.attendance.switch, 1);
        await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
        await utils.click(timePage.timeElements.attendance);
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.myRecords, false);
        let tableRow = await utils.isElementVisible(timePage.attendance.deleteIcon);
        expect(tableRow).toBeFalsy();
    });
});

test.describe('Time Reports', () => {
    test('Search and View project Reports', async () => {
        await timePage.searchAndViewReports(Constants.Menu.projectReports, timePage.reports.project, Constants.projects.projectShortName, Constants.projects.projectCustomerName);
        await utils.waitForElement(timePage.reports.reportsTableContainer);
        expect(await utils.getText(timePage.reports.activityName)).toEqual(Constants.projects.projectShortName);
    });

    test('Search and View Employee Reports', async () => {
        await timePage.searchAndViewReports(Constants.Menu.employeeReports, timePage.timeElements.employeeName, Constants.Users.firstNameUser1, Constants.Users.employeeNameUser1);
        await utils.waitForElement(timePage.reports.reportsTableContainer);
        await utils.isElementVisible(timePage.reports.employeeReportsTable);
        let minimizeIcon:any = await timePage.maximizeMinimizeReports(timePage.reports.maximize, timePage.reports.minimize);
        expect(minimizeIcon.includes(Constants.others.minimizeIconClass)).toBeTruthy();
        let maximizeIcon:any = await timePage.maximizeMinimizeReports(timePage.reports.minimize, timePage.reports.maximize);
        expect(maximizeIcon.includes(Constants.others.maximizeIconClass)).toBeTruthy();
    });

    test('Search and View Employee Attendance Summary', async () => {
        await timePage.searchAndViewReports(Constants.Menu.attendanceSummary, timePage.timeElements.employeeName, Constants.Users.firstNameUser1, Constants.Users.employeeNameUser1);
        await utils.waitForElement(timePage.reports.reportsTableContainer);
        let employeeReportTable = await utils.isElementVisible(timePage.reports.employeeReportsTable);
        expect(employeeReportTable).toBeTruthy();
        let hours = await utils.getText(timePage.reports.totalDurationHours);
        expect(hours).toEqual(Constants.others.nineHrs);
    });
});