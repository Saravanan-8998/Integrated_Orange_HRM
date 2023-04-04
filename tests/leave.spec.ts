import { expect, test, Page } from "@playwright/test";
import { Leave } from "../pageObjects";
import { LoginPage } from "../pageObjects/login_Page";
import subURL from "../support/subURL.json";
import { myBrowserFixture } from "../support/fixtures";
import { createAdminUser, getAdminFullName } from "../support/createUser";
import { autoDelete } from "../support/deleteOldRecords";

let page: Page;
let loginPage: LoginPage;
let leave: Leave;
let fullNameValue: any;
let USERNAME: any;

async function adminLogin() {
    await createAdminUser();
    fullNameValue = await getAdminFullName();
    USERNAME = fullNameValue.slice(14, 32);
    console.log("value of Username--->", USERNAME);
    await loginPage.enterCredentials(USERNAME, 'Admin@123');
    await leave.navigate();
}

test.beforeAll(async () => {
    page = (await myBrowserFixture()).page;
    await page.goto(subURL.login);
    loginPage = new LoginPage(page);
    leave = new Leave(page);
});

test.describe('Should check all functionality in Leave Module', async () => {
    test('Should add entitlement in add entitlement page', async () => {
        await adminLogin();
        await leave.gotoEntitlement(USERNAME);
        await leave.addEntitlementData(USERNAME);
        await leave.saveEntitlement();
    });

    test('Should test all the functionality my entitlement page', async () => {
        await leave.gotoMyLeaveEntitlement();
        await leave.verifyMyLeaveEntitlement();
    });

    test('Should test all the functionality in employee entitlement page', async () => {
        await leave.gotoMyLeaveEntitlementPage(USERNAME);
        await leave.verifyMyLeaveEntitlementPage(USERNAME);
    });

    test('Should apply a leave', async () => {
        await leave.gotoApplyLeave();
        await leave.fillApplyLeaveData();
        await leave.saveAppliedLeaveData();
    });

    test('Should modify My Leave search', async () => {
        await leave.gotoMyLeaveList();
        await leave.verifyMyleaveList();
    });

    test('Should verify modified search in My leave', async () => {
        await leave.gotoSearchLeaveList();
        await leave.submitAssignLeave(USERNAME);
        await leave.approveLeave();
    });
});

test.afterAll(async () => {
    await page.close();
});