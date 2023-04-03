import { expect, Locator, Page } from "@playwright/test";

export class Dashboard {
    readonly page: Page;
    readonly timeAtWorkLoc: any;
    readonly myActions: any;
    readonly quickLaunches: any;
    readonly buzzLatestPosts: any;
    readonly employeeDistributionBySubUnit: any;
    readonly employeeDistributionByLocation: any;
    readonly employeeOnLeaveToday: any;

    constructor(page: Page) {
        this.page = page;
        this.timeAtWorkLoc = {
            timeAtWorkTitle: `//p[text()='Time at Work']`,
            punchedOut: `//p[text()='Punched Out']`,
            timeFormat: `.orangehrm-attendance-card-bar`,
            timeBtn: `//i[@class='oxd-icon bi-stopwatch']`,
            currentWeek: `(//p[@class='oxd-text oxd-text--p'])[3]`,
            totalHours: `.orangehrm-attendance-card-summary-total`,
            empTimeChart: `//div[@class='emp-attendance-chart']//canvas[1]`,
        }
        this.myActions = {
            myActionsTitle: `//p[text()='My Actions']`,
            leaveRequestIcon: `button.oxd-icon-button.oxd-icon-button--success`,
            timeSheetIcon: `button.oxd-icon-button.oxd-icon-button--warn`,
            selfReviewIcon: `button.oxd-icon-button.oxd-icon-button--danger`,
            interviewIcon: `button.oxd-icon-button.oxd-icon-button--info`,
            leaveRequest: `(//div[@class='orangehrm-todo-list-item']//p)[1]`,
            timeSheet: `(//div[@class='orangehrm-todo-list-item']//p)[2]`,
            selfReview: `(//div[@class='orangehrm-todo-list-item']//p)[3]`,
            interview: `(//div[@class='orangehrm-todo-list-item']//p)[4]`,
        }
        this.quickLaunches = {
            quickLaunchesTitle: `//p[text()='Quick Launch']`,
            assignLeave: `button[title='Assign Leave']`,
            leaveList: `button[title='Leave List']`,
            timesheet: `button[title='Timesheets']`,
            applyLeave: `button[title='Apply Leave']`,
            myLeave: `button[title='My Leave']`,
            myTimesheet: `button[title='My Timesheet']`,
        }
        this.buzzLatestPosts = {
            buzzLatestPostsTitle: `//p[text()='Buzz Latest Posts']`,
            mainDiv : `(//div[@class='orangehrm-dashboard-widget-body --scroll-visible'])[1]`,
            subDiv : `oxd-text oxd-text--p orangehrm-buzz-widget-body`,
        }
        this.employeeDistributionByLocation = {
            employeeDistributionByLocationTitle : `//p[text()='Employee Distribution by Location']`,
            chart : `//canvas[@id='Itq3jVei']`,
            allList : `oxd-chart-legend-key`,
        }
        this.employeeDistributionBySubUnit = {
            employeeDistributionBySubUnitTitle : `//p[text()='Employee Distribution by Sub Unit']`,
            chart : `//canvas[@id='XOD4lcKN']`,
            allList : `oxd-chart-legend-key`,
        }
        this.employeeOnLeaveToday = {
            employeeOnLeaveTodayTitle : `//p[text()='Employees on Leave Today']`,
            settingIcon : `i.oxd-icon.bi-gear-fill`,
            noLeaveMsg : `//img[@alt='No Content']/following-sibling::p[1]`,
            noLeaveMsgIcon : `//img[@alt='No Content']`,
            popupBody : `//div[@role='document']`,
            toggleBtn : `//button[text()=' Cancel ']`,
            saveBtn :  `//button[@type='submit']`,
            closeBtn : `//button[text()='×']`,
            cancelBtn : `//button[text()=' Cancel ']`,
            txtHeader : `//div[@class='orangehrm-config-title']//p[1]`,
            innertxt : `label.oxd-label`,
        }
    }

    async verifyEmployeeLeaveTodayComponents() {
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.employeeOnLeaveTodayTitle)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.settingIcon)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.noLeaveMsg)).isVisible();
    }

    async verifyEmployeeLeaveTodaySettingsComponents(){
        await this.leaveSettings();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.popupBody)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.txtHeader)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.innertxt)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.toggleBtn)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.cancelBtn)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.saveBtn)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.closeBtn)).isVisible();
    }

    async leaveSettings(){
        await this.page.reload();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.settingIcon)).click();
    }

    async toggle(){
        await this.leaveSettings();
        await this.page.locator(this.employeeOnLeaveToday.toggleBtn).click();
    }

    async cancel(){
        await this.leaveSettings();
        await this.page.locator(this.employeeOnLeaveToday.cancelBtn).click();
    }

    async save(){
        await this.leaveSettings();
        await this.page.locator(this.employeeOnLeaveToday.saveBtn).click();
    }

    async close(){
        await this.leaveSettings();
        await this.page.locator(this.employeeOnLeaveToday.closeBtn).click();
    }

    async verifyTimeAtWorkComponents() {
        await (await this.page.waitForSelector(this.timeAtWorkLoc.timeAtWorkTitle)).isVisible();
        await (await this.page.waitForSelector(this.timeAtWorkLoc.timeFormat)).isVisible();
        await (await this.page.waitForSelector(this.timeAtWorkLoc.timeBtn)).isVisible();
        await (await this.page.waitForSelector(this.timeAtWorkLoc.currentWeek)).isVisible();
        await (await this.page.waitForSelector(this.timeAtWorkLoc.totalHours)).isVisible();
        await (await this.page.waitForSelector(this.timeAtWorkLoc.empTimeChart)).isVisible();
    }

    async timerClick() {
        await this.page.locator(this.timeAtWorkLoc.timeBtn).click();
    }

    async verifyMyActionsComponents() {
        await (await this.page.waitForSelector(this.myActions.myActionsTitle)).isVisible();
        await (await this.page.waitForSelector(this.myActions.leaveRequestIcon)).isVisible();
        await (await this.page.waitForSelector(this.myActions.timeSheetIcon)).isVisible();
        await (await this.page.waitForSelector(this.myActions.selfReviewIcon)).isVisible();
        await (await this.page.waitForSelector(this.myActions.interviewIcon)).isVisible();
        await (await this.page.waitForSelector(this.myActions.leaveRequest)).isVisible();
        await (await this.page.waitForSelector(this.myActions.timeSheet)).isVisible();
        await (await this.page.waitForSelector(this.myActions.selfReview)).isVisible();
        await (await this.page.waitForSelector(this.myActions.interview)).isVisible();
    }

    async leaveRequestClick() {
        await this.page.locator(this.myActions.leaveRequest).click();
    }

    async timeSheetClick() {
        await this.page.locator(this.myActions.timeSheet).click();
    }

    async selfReviewClick() {
        await this.page.locator(this.myActions.selfReview).click();
    }

    async interviewClick() {
        await this.page.locator(this.myActions.interview).click();
    }

    async verifyQuickLaunchesComponents() {
        await (await this.page.waitForSelector(this.quickLaunches.quickLaunchesTitle)).isVisible();
        await (await this.page.waitForSelector(this.quickLaunches.assignLeave)).isVisible();
        await (await this.page.waitForSelector(this.quickLaunches.leaveList)).isVisible();
        await (await this.page.waitForSelector(this.quickLaunches.timesheet)).isVisible();
        await (await this.page.waitForSelector(this.quickLaunches.applyLeave)).isVisible();
        await (await this.page.waitForSelector(this.quickLaunches.myLeave)).isVisible();
        await (await this.page.waitForSelector(this.quickLaunches.myTimesheet)).isVisible();
    }

    async assignLeaveClick() {
        await this.page.locator(this.quickLaunches.assignLeave).click();
    }

    async leaveListClick() {
        await this.page.locator(this.quickLaunches.leaveList).click();
    }

    async timesheetClick() {
        await this.page.locator(this.quickLaunches.timesheet).click();
    }

    async applyLeaveClick() {
        await this.page.locator(this.quickLaunches.applyLeave).click();
    }

    async myLeaveClick() {
        await this.page.locator(this.quickLaunches.myLeave).click();
    }

    async myTimesheetClick() {
        await this.page.locator(this.quickLaunches.myTimesheet).click();
    }

    async verifyBuzzLatestPostsComponents(){
        await (await this.page.waitForSelector(this.buzzLatestPosts.buzzLatestPostsTitle)).isVisible();
        await (await this.page.waitForSelector(this.buzzLatestPosts.mainDiv)).isVisible();
    }

    async checkSubDiv(){
        let totalSubDiv = await this.page.locator(this.buzzLatestPosts.subDiv).count();
        if(totalSubDiv >= 1) {
            console.log("Total buzz latets posts are,",totalSubDiv);
        }
    }

    async verifyEmployeeDistributionByLocationComponents() {
        await (await this.page.waitForSelector(this.employeeDistributionByLocation.employeeDistributionByLocationTitle)).isVisible();
    }

    async verifyEmployeeDistributionBySubUnitComponents() {
        await (await this.page.waitForSelector(this.employeeDistributionBySubUnit.employeeDistributionBySubUnitTitle)).isVisible();
    }

    async totolList(){
        let list = await this.page.locator(this.employeeDistributionByLocation.allList).count();
        if(list >= 1){
            console.log("Sub list is available");
        }
    }
}