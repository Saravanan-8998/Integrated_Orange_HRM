import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, MyInfoPage, DirectoryPage, PerformancePage, PIMPage } from '../pageObjects';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, myInfoPage: MyInfoPage, pimPage: PIMPage, directoryPage: DirectoryPage, performancePage: PerformancePage, testData: TestData, page: Page, utils: Utils;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    utils = new Utils(page);
    // await utils.launchBrowsers();
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    myInfoPage = new MyInfoPage(page);
    pimPage = new PIMPage(page);
    directoryPage = new DirectoryPage(page);
    performancePage = new PerformancePage(page);
    testData = new TestData(page);
    await loginPage.getBaseURL();
    await expect(page).toHaveURL(/.*login/);
    let pass = await testData.encodeDecodePassword();
    await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
    await utils.deleteUsers();
    await utils.createUsers(Constants.Users.firstNameUser1, Constants.Users.lastNameUser1, Constants.Users.userNameUser1);
    await utils.updatingUserRole(Constants.Users.userNameUser1, Constants.others.reportingMethodAdmin);
    await utils.createUsers(Constants.Users.firstNameUser2, Constants.Users.lastNameUser2, Constants.Users.userNameUser2);
    await utils.updatingUserRole(Constants.Users.userNameUser2, Constants.others.reportingMethodAdmin);
    await utils.createUsers(Constants.Users.firstNameUser3, Constants.Users.lastNameUser3, Constants.Users.userNameUser3);
    await utils.updatingUserRole(Constants.Users.userNameUser3, Constants.others.reportingMethodAdmin);
    await pimPage.assignSupervisor(Constants.Users.employeeNameUser1, Constants.Users.employeeNameUser2);
    await pimPage.assignSupervisor(Constants.Users.employeeNameUser2, Constants.Users.employeeNameUser3);
});

test.afterAll(async () => {
    await page.close();
});


test.describe('Performance Configure', () => {
    test('Filling KPIs details', async () => {
        await utils.logout();
        await loginPage.fillUsrNameAndPwdAndLogin(Constants.Users.userNameUser1, Constants.Users.password);
        await utils.clickMenu(Constants.Roles.link, homePage.homePageElements.performance, Constants.Menu.performance);
        await utils.click(performancePage.keyPerformanceIndicators.configure);
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.kpis, true);
        await utils.click(performancePage.add);
        await utils.fillTextBoxValues(performancePage.keyPerformanceIndicators.keyPerformanceIndicator, Constants.others.kpiName, true);
        await utils.selecDropdownOption(Constants.Roles.option, performancePage.keyPerformanceIndicators.jobTitle, Constants.others.jobTitleSE);
        await utils.clickSave(myInfoPage.save, 0);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(4000);
        await utils.selecDropdownOption(Constants.Roles.option, performancePage.keyPerformanceIndicators.jobTitle, Constants.others.jobTitleSE);
        await utils.click(performancePage.keyPerformanceIndicators.search);
        let row = await performancePage.getARowCheckbox(Constants.others.kpiName);
        await expect(row.nth(0)).toBeVisible();
    });
});

test('Filling Trackers details', async () => {
    await utils.click(performancePage.keyPerformanceIndicators.configure);
    await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.trackers, true);
    await utils.click(performancePage.add);
    await utils.fillTextBoxValues(performancePage.addPerformanceTracker.trackerName, Constants.others.trackerName, true);
    await utils.fillTextBoxValues(performancePage.addPerformanceTracker.employeeName, Constants.Users.employeeNameForSearch, true);
    await utils.clickOption(Constants.Roles.option, Constants.Users.employeeNameUser1);
    await utils.fillTextBoxValues(performancePage.addPerformanceTracker.reviewers, Constants.Users.employeeNameForSearch, true);
    await utils.clickOption(Constants.Roles.option, Constants.Users.employeeNameUser2);
    await utils.clickSave(myInfoPage.save, 0);
    await utils.fillTextBoxValues(performancePage.addPerformanceTracker.employeeName, Constants.Users.employeeNameForSearch, true);
    await utils.clickOption(Constants.Roles.option, Constants.Users.employeeNameUser1);
    await utils.click(performancePage.keyPerformanceIndicators.search);
    let perfTracker = await performancePage.getARow(Constants.others.trackerName);
    let status = await perfTracker.first().isVisible();
    expect(status).toBeTruthy();
});

test.describe('Performance My tracker', () => {
    test('Viewing My Trackers details', async () => {
        await utils.clickByRole(Constants.Roles.link, Constants.Menu.myTrackers, true);
        let tracker = await performancePage.getARow(Constants.others.trackerName);
        expect(tracker).toBeVisible();
        let isMyTrackerOpened = await performancePage.clickViewAndVerify();
        expect(isMyTrackerOpened).toBeTruthy();
    });
});

test.describe('Performance Employee Tracker', () => {
    test('Viewing Employee Trackers details', async () => {
        await utils.clickByRole(Constants.Roles.link, Constants.Menu.employeeTrackers), true;
        await utils.fillTextBoxValues(performancePage.addPerformanceTracker.employeeName, Constants.Users.employeeNameForSearch, true);
        await utils.clickOption(Constants.Roles.option, Constants.Users.employeeNameUser2);
        await utils.selecDropdownOption(Constants.Roles.option, performancePage.employeeTrackers.include, Constants.includeEmployee);
        await performancePage.getViewAndClick(Constants.others.trackerName, 0);
        let empPerfTrackerCharlie = await performancePage.isEmployeeTrackerViewVisible();
        expect(empPerfTrackerCharlie).toBeTruthy();
        await utils.click(performancePage.logElements.addLog);
        await performancePage.createLogs();
        expect(page.locator(performancePage.logElements.employeeTrackerLogContainer)).toBeVisible();
        await performancePage.deleteLogs();
        expect(performancePage.page.locator(performancePage.logElements.noRecords)).toBeVisible();
    });
});

test.describe('Performance Manage Reviews', () => {
    test('Deleting the existing Performance Reviews records', async () => {
        await utils.click(performancePage.manageReviews.manageReviewsMenu);
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.manageReviews, true);
        expect(page.locator(performancePage.addReview.tableRow)).not.toBeVisible();
    });

    test('Adding the Manage Performance Review records', async () => {
        await utils.click(performancePage.add);
        await utils.fillTextBoxValues(performancePage.addReview.employeeName, Constants.Users.employeeNameForSearch, true)
        await utils.clickOption(Constants.Roles.option, Constants.Users.employeeNameUser1);
        await utils.fillTextBoxValues(performancePage.addReview.supervisorReviewer, Constants.Users.firstNameUser2, true)
        await utils.clickOption(Constants.Roles.option, Constants.Users.employeeNameUser2);
        await utils.fillDateValue(performancePage.addReview.reviewPeriodStartDate, Constants.Dates.reviewPeriodStartDate);
        await utils.fillDateValue(performancePage.addReview.reviewPeriodEndDate, Constants.Dates.reviewPeriodEndDate);
        await utils.fillDateValue(performancePage.addReview.reviewDueDate, Constants.Dates.reviewDueDate);
        await utils.clickSave(myInfoPage.save, 0);
        let rowCells = await performancePage.getRowDetails();
        expect(rowCells.reviewStatus).toEqual(Constants.status.inactive);
    });

    test('Activating the Manage Performance Review record', async () => {
        await utils.clickElementWithIndex(performancePage.addReview.editIcon, 0);
        await utils.waitForElement(myInfoPage.backgroundContainer);
        await page.waitForTimeout(3000);
        await utils.click(performancePage.addReview.activate);
        let toast = await utils.getToastMessage();
        expect(toast).toEqual(Constants.sucessMsg.sucessfulActivatedMsg);
        await utils.click(myInfoPage.toastElements.closeIcon);
        await utils.waitForSpinnerToDisappear();
        let rowCells = await performancePage.getRowDetails();
        expect(rowCells.reviewStatus).toEqual(Constants.status.activated);
    });
});

test.describe('Performance My Reviews', () => {
    test('Viewing the My Reviews performance', async () => {
        await utils.click(performancePage.manageReviews.manageReviewsMenu);
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.myReviews, true);
        await performancePage.fillMyReviewDetails();
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.myReviews, true);
        let rowCells = await performancePage.getReviewDetails(Constants.Dates.reviewDueDate, true);
        expect(rowCells.selfEvaluationStatus).toEqual(Constants.status.completed);
    });
});

test.describe('Performance Employee Reviews', () => {
    test('Viewing the Employee Reviews performance', async () => {
        await utils.logout();
        await loginPage.fillUsrNameAndPwdAndLogin(Constants.Users.userNameUser2, Constants.Users.password);
        await utils.clickMenu(Constants.Roles.link, homePage.homePageElements.performance, Constants.Menu.performance);
        await utils.click(performancePage.manageReviews.manageReviewsMenu);
        await utils.clickByRole(Constants.Roles.menuItem, Constants.Menu.employeeReviews, true);
        await utils.fillTextBoxValues(performancePage.addReview.employeeName, Constants.Users.employeeNameForSearch, true)
        await utils.clickOption(Constants.Roles.option, Constants.Users.employeeNameUser1);
        await utils.click(directoryPage.directory.search);
        let rowCells = await performancePage.getReviewDetails(Constants.Dates.reviewDueDate);
        expect(rowCells.reviewStatus).toEqual(Constants.status.inProgress);
    });
});