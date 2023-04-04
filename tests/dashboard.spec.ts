import { expect, test, Page } from "@playwright/test";
import { Dashboard } from "../pageObjects/dashboardPage";
import { LoginPage } from "../pageObjects/login_Page";
import subURL from "../support/subURL.json";
import { myBrowserFixture } from "../support/fixtures";
import { createAdminUser, getAdminFullName } from "../support/createUser";
import { AssertionURL } from "../support/url";
import Constants from "../support/constants.json";

let page: Page;
let loginPage: LoginPage;
let dashboard: Dashboard;
let fullNameValue: any;
let USERNAME: any;

async function adminLogin() {
    await createAdminUser();
    fullNameValue = await getAdminFullName();
    USERNAME = fullNameValue.slice(14, 32);
    await loginPage.enterCredentials(USERNAME, Constants.Credentials.newUser);
}

test.beforeAll(async () => {
    page = (await myBrowserFixture()).page;
    await page.goto(subURL.login);
    loginPage = new LoginPage(page);
    dashboard = new Dashboard(page);
});

test.describe('Should check all functionality in Dashboard Module', async () => {
    test('Should check all the components loaded and visible in time at work component', async () => {
        await adminLogin();
        await page.goto(subURL.dashboard);
        await expect(page).toHaveURL(AssertionURL.dashboardURL);
        await dashboard.verifyTimeAtWorkComponents();
    });

    test('Should check the redirect URL from timer', async () => {
        await dashboard.timerClick();
        await page.waitForLoadState();
        await expect(page).toHaveURL(AssertionURL.punchInURL);
    });
});

test.describe('Should check all functionality in my action Module', async () => {
    test('Should check all the components loaded and visible my action component', async () => {
        await page.goto(subURL.dashboard);
        await expect(page).toHaveURL(AssertionURL.dashboardURL);
        await dashboard.verifyMyActionsComponents();
    });

    test('Should check the leave Request redirect URL from My Actions', async () => {
        await dashboard.leaveRequestClick();
        await expect(page).toHaveURL(AssertionURL.viewLeaveListURL);
        await page.goBack();
    });

    test('Should check the time sheet redirect URL from My Actions', async () => {
        await dashboard.timeSheetClick();
        await expect(page).toHaveURL(AssertionURL.viewEmployeeTimesheetURL);
        await page.goBack();
    });

    test('Should check the interview redirect URL from My Actions', async () => {
        await dashboard.interviewClick();
        await expect(page).toHaveURL(AssertionURL.viewCandidatesURL);
    });
});

test.describe('Should check all functionality in quick launches Module', async () => {
    test('Should check all the components loaded and visible in quick launches components', async () => {
        await page.goto(subURL.dashboard);
        await expect(page).toHaveURL(AssertionURL.dashboardURL);
        await dashboard.verifyQuickLaunchesComponents();
    });

    test('Should check the assign leave redirect URL from quick launches', async () => {
        await dashboard.assignLeaveClick();
        await expect(page).toHaveURL(AssertionURL.assignLeaveURL);
        await page.goBack();
    });

    test('Should check the leave list redirect URL from quick launches', async () => {
        await dashboard.leaveListClick();
        await expect(page).toHaveURL(AssertionURL.viewLeaveListURL);
        await page.goBack();
    });

    test('Should check the timesheet redirect URL from quick launches', async () => {
        await dashboard.timesheetClick();
        await expect(page).toHaveURL(AssertionURL.viewEmployeeTimesheetURL);
        await page.goBack();
    });

    test('Should check the apply leave redirect URL from quick launches', async () => {
        await dashboard.applyLeaveClick();
        await expect(page).toHaveURL(AssertionURL.applyLeaveURL);
        await page.goBack();
    });

    test('Should check the my leave redirect URL from quick launches', async () => {
        await dashboard.myLeaveClick();
        await expect(page).toHaveURL(AssertionURL.viewMyLeaveListURL);
        await page.goBack();
    });

    test('Should check the my timesheet redirect URL from quick launches', async () => {
        await dashboard.myTimesheetClick();
        await expect(page).toHaveURL(AssertionURL.viewMyTimesheetURL);
        await page.goBack();
    });
});

test.describe('Should check all functionality in buzz latest posts Module', async () => {
    test('Should check all the components loaded and visible in buzz latest posts', async () => {
        await page.goto(subURL.dashboard);
        await page.waitForURL(subURL.dashboard);
        await expect(page).toHaveURL(AssertionURL.dashboardURL);
        await dashboard.verifyBuzzLatestPostsComponents();
    });

    test('Should check how many posts are available', async () => {
        await expect(page).toHaveURL(AssertionURL.dashboardURL);
        await dashboard.checkSubDiv();
    });
});

test.describe('Should check all functionality in Employees on Leave Today Module', async () => {
    test('should check components in Employees on Leave Today', async () => {
        await page.goto(subURL.dashboard);
        await page.waitForURL(subURL.dashboard);
        await expect(page).toHaveURL(AssertionURL.dashboardURL);
        await dashboard.verifyEmployeeLeaveTodayComponents();
    });

    test('should check settings components visible', async () => {
        await dashboard.verifyEmployeeLeaveTodaySettingsComponents();
    });

    test('should check all functionality in Employee leave settings', async () => {
        await dashboard.toggle();
        await dashboard.cancel();
        await dashboard.save();
        await dashboard.close();
    });
});

test.describe('Should check all functionality in sub unit components Module', async () => {
    test('Should check all the components loaded and visible in sub unit components', async () => {
        await page.goto(subURL.dashboard);
        await page.waitForURL(subURL.dashboard);
        await expect(page).toHaveURL(AssertionURL.dashboardURL);
        await dashboard.verifyEmployeeDistributionBySubUnitComponents();
    });

    test('Should check all the sub units', async () => {
        await expect(page).toHaveURL(AssertionURL.dashboardURL);
        await dashboard.totolList();
    });
});

test.describe('Should check all functionality in distribution by location components Module', async () => {
    test('Should check all the components loaded and visible in distribution by location components', async () => {
        await page.goto(subURL.dashboard);
        await page.waitForURL(subURL.dashboard);
        await expect(page).toHaveURL(AssertionURL.dashboardURL);
        await dashboard.verifyEmployeeDistributionByLocationComponents();
    });

    test('Should check all the sub units by location', async () => {
        await expect(page).toHaveURL(AssertionURL.dashboardURL);
        await dashboard.totolList();
    });
});

test.afterAll(async () => {
    await page.close();
});