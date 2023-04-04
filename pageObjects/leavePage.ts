import { expect, Locator, Page } from "@playwright/test";
import subURL from "../support/subURL.json";
import constants from "../support/constants.json";
import { LoginPage } from "./login_Page";

export class Leave {
    readonly page: Page; apply: any; myLeave: any; entitlement: any; leaveList: any; assignLeave: any;

    constructor(page: Page) {
        this.page = page;
        this.apply = {
            mainLeave: `//span[text()='Leave']`,
            apply: `//a[contains(text(),'Apply')]`,
            leaveType: `//div[@class='oxd-select-text oxd-select-text--active']//div[1]`,
            fromDate: `(//label[text()='From Date']/following::input)[1]`,
            toDate: `//label[text()='To Date']/following::input`,
            comments: `//label[text()='Comments']/following::textarea`,
            submit: `//button[@type='submit']`,
            fullDay: `//div[text()='Full Day']`
        }
        this.myLeave = {
            myLeave: `//a[contains(text(),'My Leave')]`,
            leaveType: `(//div[@class='oxd-select-text-input'])[2]`,
            submit: `//button[@type='submit']`,
            totalRecords: `//span[@class='oxd-text oxd-text--span']`
        }
        this.entitlement = {
            entitlement: `//span[text()='Entitlements ']`,
            addEntitlement: `(//a[@role='menuitem'])[1]`,
            myLeaveEntitlement: `(//a[@role='menuitem'])[2]`,
            myEntitlement: `(//a[@role='menuitem'])[3]`,
            empName: `//input[@placeholder='Type for hints...']`,
            leaveType: `(//div[@class='oxd-select-text-input'])[1]`,
            leaveEntitlement: `(//input[@class='oxd-input oxd-input--active'])[2]`,
            submit: `//button[@type='submit']`,
            search: `//button[text()=' Search ']`,
            totolRecords: `(//span[@class='oxd-text oxd-text--span'])[2]`,
            confirmEntitlement: `//button[text()=' Confirm ']`,
        }
        this.leaveList = {
            leaveList: `//a[contains(text(),'Leave List')]`,
            leaveListTotalRecords: `//span[@class='oxd-text oxd-text--span']`,
            threeDots: `//i[@class='oxd-icon bi-three-dots-vertical']`,
            viewLeaveDetails: `(//p[@class='oxd-text oxd-text--p'])[2]`,
            addAComments: `//button[text()=' Comments ']`,
            comments: `//textarea[contains(@class,'oxd-textarea oxd-textarea--active')]`,
            submit: `//button[text()=' Save ']`,
        }
        this.assignLeave = {
            assignLeave: `//a[contains(text(),'Assign Leave')]`,
            assignLeaveEmpName: `//input[@placeholder='Type for hints...']`,
            assignLeaveType: `oxd-select-text-input`,
            assignLeaveFromDate: `(//input[@placeholder='yyyy-mm-dd'])[1]`,
            assignLeaveToDate: `(//input[@placeholder='yyyy-mm-dd'])[2]`,
            assignLeaveComments: `//label[text()='Comments']/following::textarea`,
            assignLeaveSubmit: `//button[@type='submit']`,
            submitAssignLeave: `//input[@placeholder='Type for hints...']`,
            approveLeave: `//button[text()=' Approve ']`
        }
    }

    // A function used to navigate to leave module
    async navigate() {
        await this.page.locator(this.apply.mainLeave).click();
    }

    // A function used to goto entitlement
    async gotoEntitlement(username: any) {
        await this.page.waitForSelector(this.entitlement.entitlement);
        await this.page.locator(this.entitlement.entitlement).click();
        await this.page.waitForSelector(this.entitlement.addEntitlement);
        await this.page.locator(this.entitlement.addEntitlement).click();
        await this.page.waitForSelector(this.entitlement.empName);
        await this.page.locator(this.entitlement.empName).fill(username);
    }

    // A function used to add a entitlement data
    async addEntitlementData(username: any) {
        await this.page.getByRole('option', { name: username }).getByText(username, { exact: true }).click();
        await this.page.locator(this.entitlement.leaveType).click();
        await this.page.getByRole('option', { name: constants.myLeave.leaveType }).getByText(constants.myLeave.leaveType, { exact: true }).click();
        await this.page.locator(this.entitlement.leaveEntitlement).fill(constants.leaveModule.addEntitlement);
    }

    // A function used to save a entitlement
    async saveEntitlement() {
        await this.page.locator(this.entitlement.submit).click();
        await this.page.waitForTimeout(3000);
        await this.page.waitForSelector(this.entitlement.confirmEntitlement);
        await this.page.locator(this.entitlement.confirmEntitlement).click();
        await this.page.waitForTimeout(3000);
    }

    // A function used to goto my leave entitlement
    async gotoMyLeaveEntitlement() {
        await this.page.waitForSelector(this.entitlement.entitlement);
        await this.page.locator(this.entitlement.entitlement).click();
        await this.page.waitForTimeout(3000);
        await this.page.waitForSelector(this.entitlement.myEntitlement);
        await this.page.locator(this.entitlement.myEntitlement).click();
        await this.page.waitForTimeout(3000);
        await this.page.waitForSelector(this.entitlement.leaveType);
        await this.page.locator(this.entitlement.leaveType).click();
        await this.page.getByRole('option', { name: constants.myLeave.leaveType }).getByText(constants.myLeave.leaveType, { exact: true }).click();
    }

    // A function used to verify my leave entitlement
    async verifyMyLeaveEntitlement() {
        await this.page.waitForSelector(this.entitlement.search);
        await this.page.locator(this.entitlement.search).click();
        await this.page.waitForTimeout(3000);
        await this.verifymyLeaveEntitlement();
    }

    // A function used to goto my leave entitlement page
    async gotoMyLeaveEntitlementPage(username: any) {
        await this.page.waitForSelector(this.entitlement.entitlement);
        await this.page.locator(this.entitlement.entitlement).click();
        await this.page.waitForTimeout(2000);
        await this.page.waitForSelector(this.entitlement.myLeaveEntitlement);
        await this.page.locator(this.entitlement.myLeaveEntitlement).click();
        await this.page.waitForTimeout(2000);
        await this.page.locator(this.entitlement.empName).fill(username);
    }

    // A function used to verify my leave entitlement page
    async verifyMyLeaveEntitlementPage(username: any) {
        await this.page.getByRole('option', { name: username }).getByText(username, { exact: true }).click();
        await this.page.waitForSelector(this.entitlement.search);
        await this.page.locator(this.entitlement.search).click();
        await this.verifymyLeaveEntitlement();
    }

    // A function used to verify my leave entitlement
    async verifymyLeaveEntitlement() {
        let records = await this.page.locator(this.entitlement.totolRecords).textContent();
        expect(records).toBe(constants.leaveModule.verifyMyTitleEntitlement);
    }

    // A function used to goto apply leave module
    async gotoApplyLeave() {
        await this.page.waitForTimeout(2000);
        await this.page.waitForSelector(this.apply.apply);
        await this.page.locator(this.apply.apply).click();
        await this.page.waitForTimeout(2000);
        await this.page.locator(this.apply.leaveType).click();
    }

    // A function used to fill apply leave data
    async fillApplyLeaveData() {
        await this.page.getByRole('option', { name: constants.myLeave.leaveType }).getByText(constants.myLeave.leaveType, { exact: true }).click();
        await this.page.locator(this.apply.fromDate).clear();
        await this.page.locator(this.apply.fromDate).fill('2023-08-09');
        await this.page.locator(this.apply.toDate).clear();
        await this.page.locator(this.apply.toDate).fill('2023-08-09');
        await this.page.locator(this.apply.fullDay).click();
        await this.page.getByRole('option', { name: constants.myLeave.leaveDay }).getByText(constants.myLeave.leaveDay, { exact: true }).click();
        await this.page.locator(this.apply.comments).fill(constants.leaveModule.comments);
    }

    // A function used to save applied leave data
    async saveAppliedLeaveData() {
        await this.page.waitForTimeout(5000);
        await this.page.waitForSelector(this.apply.submit);
        await this.page.locator(this.apply.submit).click();
    }

    // A function used to goto my leave list
    async gotoMyLeaveList() {
        await this.page.waitForTimeout(5000);
        await this.page.goto(subURL.leave);
        await this.page.waitForTimeout(5000);
        await this.page.locator(this.myLeave.leaveType).click();
        await this.page.getByRole('option', { name: constants.myLeave.leaveType }).getByText(constants.myLeave.leaveType, { exact: true }).click();
    }

    // A function used to verify my leave list
    async verifyMyleaveList() {
        await this.page.waitForTimeout(4000);
        await this.page.locator(this.myLeave.submit).click();
        await this.page.waitForTimeout(4000);
        let records = await this.page.locator(this.myLeave.totalRecords).textContent();
        expect(records).toBe(constants.leaveModule.verifyMyTitleEntitlement);
    }

    // A function used to goto search leave list page
    async gotoSearchLeaveList() {
        let loginPage: LoginPage;
        loginPage = new LoginPage(this.page);
        await this.page.goto(subURL.logout);
        await this.page.waitForTimeout(4000);
        await loginPage.enterCredentials(constants.Credentials.stdUser, constants.Credentials.password);
        await this.navigate();
    }

    // A function used to submit assignment
    async submitAssignLeave(username: any) {
        await this.page.waitForTimeout(2000);
        await this.page.waitForSelector(this.leaveList.leaveList);
        await this.page.locator(this.leaveList.leaveList).click();
        await this.page.waitForTimeout(3000);
        await this.page.waitForSelector(this.assignLeave.submitAssignLeave);
        await this.page.locator(this.assignLeave.submitAssignLeave).type(username);
        await this.page.getByRole('option', { name: username }).getByText(username, { exact: true }).click();
        await this.page.waitForTimeout(4000);
        await this.page.locator(this.assignLeave.assignLeaveSubmit).click();
        await this.page.waitForTimeout(4000);
    }

    // A function used to approve a leave
    async approveLeave() {
        await this.page.waitForTimeout(2000);
        let records = await this.page.locator(this.leaveList.leaveListTotalRecords).textContent();
        expect(records).toBe(constants.leaveModule.verifyMyTitleEntitlement);
        await this.addLeaveComments();
        await this.page.waitForTimeout(4000);
        await this.page.locator(this.assignLeave.approveLeave).click();
    }

    // A function used to add a leave comments
    async addLeaveComments() {
        await this.page.waitForSelector(this.leaveList.threeDots);
        await this.page.locator(this.leaveList.threeDots).click();
        await this.page.waitForSelector(this.leaveList.viewLeaveDetails);
        await this.page.locator(this.leaveList.viewLeaveDetails).click();
        await this.page.waitForTimeout(3000);
        await this.page.waitForSelector(this.leaveList.addAComments);
        await this.page.locator(this.leaveList.addAComments).click();
        await this.page.locator(this.leaveList.comments).fill(constants.leaveModule.addLeaveComments);
        await this.page.locator(this.leaveList.submit).click();
    }
}