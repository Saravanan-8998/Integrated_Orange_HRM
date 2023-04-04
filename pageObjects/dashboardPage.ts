import { expect, Locator, Page } from "@playwright/test";

export class Dashboard {
    readonly page: Page; timeAtWorkLoc: any; myActions: any; quickLaunches: any; buzzLatestPosts: any; employeeDistributionBySubUnit: any; employeeDistributionByLocation: any; employeeOnLeaveToday: any;

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
            leaveRequest: `(//div[@class='orangehrm-todo-list-item']//p)[1]`,
            timeSheet: `(//div[@class='orangehrm-todo-list-item']//p)[2]`,
            interview: `(//div[@class='orangehrm-todo-list-item']//p)[3]`,
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
            mainDiv: `(//div[@class='orangehrm-dashboard-widget-body --scroll-visible'])[1]`,
            subDiv: `oxd-text oxd-text--p orangehrm-buzz-widget-body`,
        }
        this.employeeDistributionByLocation = {
            employeeDistributionByLocationTitle: `//p[text()='Employee Distribution by Location']`,
            chart: `//canvas[@id='Itq3jVei']`,
            allList: `oxd-chart-legend-key`,
        }
        this.employeeDistributionBySubUnit = {
            employeeDistributionBySubUnitTitle: `//p[text()='Employee Distribution by Sub Unit']`,
            chart: `//canvas[@id='XOD4lcKN']`,
            allList: `oxd-chart-legend-key`,
        }
        this.employeeOnLeaveToday = {
            employeeOnLeaveTodayTitle: `//p[text()='Employees on Leave Today']`,
            settingIcon: `i.oxd-icon.bi-gear-fill`,
            noLeaveMsg: `//img[@alt='No Content']/following-sibling::p[1]`,
            noLeaveMsgIcon: `//img[@alt='No Content']`,
            popupBody: `//div[@role='document']`,
            toggleBtn: `//button[text()=' Cancel ']`,
            saveBtn: `//button[@type='submit']`,
            closeBtn: `//button[text()='×']`,
            cancelBtn: `//button[text()=' Cancel ']`,
            txtHeader: `//div[@class='orangehrm-config-title']//p[1]`,
            innertxt: `label.oxd-label`,
        }
    }

    // A function used to verify all the components in employee leave today
    async verifyEmployeeLeaveTodayComponents() {
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.employeeOnLeaveTodayTitle)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.settingIcon)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.noLeaveMsg)).isVisible();
    }

    // A function used to verify all the components in the leave today settings
    async verifyEmployeeLeaveTodaySettingsComponents() {
        await this.leaveSettings();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.popupBody)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.txtHeader)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.innertxt)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.toggleBtn)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.cancelBtn)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.saveBtn)).isVisible();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.closeBtn)).isVisible();
    }

    // A function used to add a leave settings
    async leaveSettings() {
        await this.page.reload();
        await (await this.page.waitForSelector(this.employeeOnLeaveToday.settingIcon)).click();
    }

    // A function used to toggle
    async toggle() {
        await this.leaveSettings();
        await this.page.locator(this.employeeOnLeaveToday.toggleBtn).click();
    }

    // A function used to cancel
    async cancel() {
        await this.leaveSettings();
        await this.page.locator(this.employeeOnLeaveToday.cancelBtn).click();
    }

    // A function used to save
    async save() {
        await this.leaveSettings();
        await this.page.locator(this.employeeOnLeaveToday.saveBtn).click();
    }

    // A function used to close
    async close() {
        await this.leaveSettings();
        await this.page.locator(this.employeeOnLeaveToday.closeBtn).click();
    }

    // A function used to verify the components in verify time at work components
    async verifyTimeAtWorkComponents() {
        await (await this.page.waitForSelector(this.timeAtWorkLoc.timeAtWorkTitle)).isVisible();
        await (await this.page.waitForSelector(this.timeAtWorkLoc.timeFormat)).isVisible();
        await (await this.page.waitForSelector(this.timeAtWorkLoc.timeBtn)).isVisible();
        await (await this.page.waitForSelector(this.timeAtWorkLoc.currentWeek)).isVisible();
        await (await this.page.waitForSelector(this.timeAtWorkLoc.totalHours)).isVisible();
        await (await this.page.waitForSelector(this.timeAtWorkLoc.empTimeChart)).isVisible();
    }

    // A function used to timer click
    async timerClick() {
        await this.page.locator(this.timeAtWorkLoc.timeBtn).click();
    }

    // A function used to verify the my actions components
    async verifyMyActionsComponents() {
        await (await this.page.waitForSelector(this.myActions.myActionsTitle)).isVisible();
        await (await this.page.waitForSelector(this.myActions.leaveRequest)).isVisible();
        await (await this.page.waitForSelector(this.myActions.timeSheet)).isVisible();
    }

    // A function used to leave a request
    async leaveRequestClick() {
        await this.page.locator(this.myActions.leaveRequest).click();
        await this.page.waitForTimeout(5000);
    }

    // A function used to click a time sheet
    async timeSheetClick() {
        await this.page.waitForTimeout(4000);
        await this.page.locator(this.myActions.timeSheet).click();
    }

    // A function used to click a interview
    async interviewClick() {
        await this.page.waitForTimeout(4000);
        await this.page.locator(this.myActions.interview).click();
    }

    // A function used to verify components in the quick launches
    async verifyQuickLaunchesComponents() {
        await (await this.page.waitForSelector(this.quickLaunches.quickLaunchesTitle)).isVisible();
        await (await this.page.waitForSelector(this.quickLaunches.assignLeave)).isVisible();
        await (await this.page.waitForSelector(this.quickLaunches.leaveList)).isVisible();
        await (await this.page.waitForSelector(this.quickLaunches.timesheet)).isVisible();
        await (await this.page.waitForSelector(this.quickLaunches.applyLeave)).isVisible();
        await (await this.page.waitForSelector(this.quickLaunches.myLeave)).isVisible();
        await (await this.page.waitForSelector(this.quickLaunches.myTimesheet)).isVisible();
    }

    // A function used to click assign leave
    async assignLeaveClick() {
        await this.page.locator(this.quickLaunches.assignLeave).click();
    }

    // A function used to click list
    async leaveListClick() {
        await this.page.locator(this.quickLaunches.leaveList).click();
    }

    // A function used to click timesheet
    async timesheetClick() {
        await this.page.locator(this.quickLaunches.timesheet).click();
    }

    // A function used to click apply leave
    async applyLeaveClick() {
        await this.page.locator(this.quickLaunches.applyLeave).click();
    }

    // A function used to click my leave
    async myLeaveClick() {
        await this.page.locator(this.quickLaunches.myLeave).click();
    }

    // A function used to click my timesheet
    async myTimesheetClick() {
        await this.page.locator(this.quickLaunches.myTimesheet).click();
    }

    // A function used to verify buzz latest post components
    async verifyBuzzLatestPostsComponents() {
        await (await this.page.waitForSelector(this.buzzLatestPosts.buzzLatestPostsTitle)).isVisible();
        await (await this.page.waitForSelector(this.buzzLatestPosts.mainDiv)).isVisible();
    }

    // A function used to click check sub div
    async checkSubDiv() {
        await this.page.locator(this.buzzLatestPosts.subDiv).count();
    }

    // A function used to verify verify components employee distribution by location
    async verifyEmployeeDistributionByLocationComponents() {
        await (await this.page.waitForSelector(this.employeeDistributionByLocation.employeeDistributionByLocationTitle)).isVisible();
    }

    // A function used to verify components employee distribution by sub unit
    async verifyEmployeeDistributionBySubUnitComponents() {
        await (await this.page.waitForSelector(this.employeeDistributionBySubUnit.employeeDistributionBySubUnitTitle)).isVisible();
    }

    // A function used to count the total list
    async totolList() {
        await this.page.locator(this.employeeDistributionByLocation.allList).count();
    }
}