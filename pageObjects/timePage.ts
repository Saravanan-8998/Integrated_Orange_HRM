import { Page, expect } from "@playwright/test";
import Constants from '../support/constants.json';
import { Utils } from "../support/utils";
import { MyInfoPage } from "./myInfoPage";


let utils: Utils, myInfoPage: MyInfoPage;

export class TimePage {
    readonly page: Page;
    readonly timeElements: any;
    readonly cusomterRow: any;
    readonly customerRowCells: any;
    readonly projects: any;
    readonly name: string;
    readonly description: string;
    readonly save: string;
    readonly punchInOut: any;
    readonly timesheets: any;
    readonly reports: any;
    readonly attendance: any;
    readonly trashPath: string;
    readonly add: string;

    constructor(page: Page) {
        this.page = page;
        utils = new Utils(page);
        myInfoPage = new MyInfoPage(page);
        this.name = "//label[text()='Name']/../..//input";
        this.description = "//label[text()='Description']/../..//textarea";
        this.save = "[role='document'] button[type='submit']";
        this.add = "//button[normalize-space()='Add']";
        this.trashPath = "../..//i[@class='oxd-icon bi-trash']";
        this.timeElements = {
            timesheets: "//span[text()='Timesheets ']",
            myTimesheets: "//a[text()='My Timesheets']",
            employeeTimesheets: "//a[text()='Employee Timesheets']",
            attendance: "//span[text()='Attendance ']",
            myRecords: "//a[text()='My Records']",
            punchInOut: "//a[text()='Punch In/Out']",
            employeeRecords: "//a[text()='Employee Records']",
            configuration: "//a[text()='Configuration']",
            reports: "//span[text()='Reports ']",
            projectReports: "//a[text()='Project Reports']",
            employeeReports: "//a[text()='Employee Reports']",
            attendanceSummary: "//a[text()='Attendance Summary']",
            projectInfo: "//span[text()='Project Info ']",
            customers: "//a[text()='Customers']",
            projects: "//a[text()='Projects']",
            employeeName: "//label[text()='Employee Name']/../..//input",
            date: "//label[text()='Date']/../..//input",
            view: "[type='submit']",
            tableContainer: ".oxd-table"
        }
        this.timesheets = {
            editButton: "//button[text()=' Edit ']",
            project: "//label[text()='Project']/../..//input",
            activity: "//div[@class='oxd-select-text-input']",
            timeInputCell: "td input.oxd-input",
            tableView: "//div[@class='oxd-table-cell-actions']/button[text()=' View ']",
            totalhrs: "//span[text()='APlay Test Ltd - Demo Play Project']/../..//td[contains(@class,'--freeze-right')]",
        }
        this.punchInOut = {
            time: "//label[text()='Time']/../..//input",
            note: "//label[text()='Note']/../..//textarea",
            in: "//button[normalize-space()='In']",
            out: "//button[normalize-space()='Out']",
            punchOutContainer: ".orangehrm-card-container"
        }
        this.attendance = {
            tableData: ".oxd-table-card div.oxd-table-row",
            switch: ".orangehrm-attendance-field-row div",
            deleteIcon: ".oxd-icon.bi-trash"
        }
        this.reports = {
            project: "//label[text()='Project Name']/../..//input",
            employeeReportsTable: ".inner-content-table .vertical-inner",
            maximize: ".oxd-icon.bi-arrows-fullscreen",
            minimize: ".oxd-icon.bi-fullscreen-exit",
            totalDurationHours: ".rgRow div.col-alt",
            reportsTableContainer: ".orangehrm-paper-container",
            activityName: ".rgRow .cell-action"
        }
        this.projects = {
            customerName: "//label[text()='Customer Name']/../..//input",
            project: "//label[text()='Project']/../..//input",
            projectAdmin: "//label[text()='Project Admin']/../..//input",
            addCustomer: "//button[text()=' Add Customer ']",
            addCustomerDialog: ".oxd-dialog-sheet",
            addCustomerDialogName: "//div[@role='document']//label[text()='Name']/../..//input",
            addCustomerDialogDescription: "//div[@role='document']//label[text()='Description']/../..//textarea",
            filterArea: ".oxd-table-filter-area",
            search: "//button[normalize-space()='Search']"
        }
        this.customerRowCells = (companyName) => {
            return `//div[@class='oxd-table-card']/div[@role='row']//div[text()='${companyName}']/../..//div[@role="cell"]`;
        }
        this.cusomterRow = (companyName) => {
            return `//div[@class='oxd-table-card']/div[@role='row']//div[text()='${companyName}']`;
        }
    }

    // This function is used to get a "Specific Row cell values" by its Column Text
    async getARowByColumnText(companyName: string) {
        await this.page.waitForSelector(await this.cusomterRow(companyName));
        let rowCells = this.page.locator(await this.customerRowCells(companyName));
        let rowcellsText = await rowCells.allTextContents();
        return {
            checkbox: rowcellsText[0],
            companyName: rowcellsText[1],
            description: rowcellsText[2]
        }
    }

      // This function is used to get a "Specific Project Row cell values" by its Column Text
      async getAProjectRowByColumnText(companyName: string) {
        await this.page.waitForSelector(await this.cusomterRow(companyName));
        let rowCells = this.page.locator(await this.customerRowCells(companyName));
        let rowcellsText = await rowCells.allTextContents();
        return {
            checkbox: rowcellsText[0],
            customerName: rowcellsText[1],
            project: rowcellsText[2],
            projectAdmins: rowcellsText[2],
        }
    }

    // This function is used to get a "Specific Row cell values" by its Column Text for Timesheet Action table
    async getTimesheetActionTable(user: string) {
        await this.page.waitForSelector(await this.cusomterRow(user));
        let rowCells = this.page.locator(await this.customerRowCells(user));
        let rowcellsText = await rowCells.allTextContents();
        return {
            actions: rowcellsText[0],
            performedBy: rowcellsText[1],
            date: rowcellsText[2],
            comment: rowcellsText[3],
        }
    }

    // This function is used to get a "Specific Row cell values" by its Column Text for Attendance table
    async getAttendanceRowCells(value: string) {
        await (await this.page.waitForSelector(await this.cusomterRow(value))).waitForElementState("stable");
        let rowCells = await this.page.locator(await this.customerRowCells(value));
        let rowcellsText = await rowCells.allTextContents();
        return {
            checkbox: rowcellsText[0],
            punchIn: rowcellsText[1],
            punchInNote: rowcellsText[2],
            punchOut: rowcellsText[3],
            punchOutNote: rowcellsText[4],
            duration: rowcellsText[5]
        }
    }

    // This function is used to add a new Customer
    async addCustomer() {
        let isCustomerPresent = await utils.isElementVisible(await this.cusomterRow(Constants.customers.customerName));
        if (!isCustomerPresent) {
            await utils.click(this.add);
            await utils.fillTextBoxValues(this.name, Constants.customers.customerName, true);
            await utils.fillTextBoxValues(this.description, Constants.customers.customerDescription, true);
            await utils.clickSave(myInfoPage.save, 0);
            let cellValues = await this.getARowByColumnText(Constants.customers.customerName);
            expect(cellValues.companyName).toEqual(Constants.customers.customerName);
        }
    }

    // This function is used to delete a existing Customers
    async deleteCustomers() {
        let rowLength = await this.page.locator(this.cusomterRow(Constants.customers.customerName)).count();
        for (let i = 0; i < rowLength; i++) {
            let row = await this.cusomterRow(Constants.customers.customerName);
            let isCustomerAlreadyPresent = await this.page.locator(row).isVisible();
            if (isCustomerAlreadyPresent) {
                let matchedRow = await this.cusomterRow(Constants.customers.customerName);
                await this.page.locator(matchedRow).locator(this.trashPath).click({ force: true });
                await myInfoPage.page.waitForSelector(myInfoPage.attachments.confirmationPopup);
                await myInfoPage.page.locator(myInfoPage.attachments.popupDeleteButton).click();
                expect(await utils.getToastMessage()).toEqual(Constants.sucessMsg.successfulDeletedMsg);
            }
        }
    }

    // This function is used to add a new Project
    async addProjects() {
        let isProjectPresent = await utils.isElementVisible(await this.cusomterRow(Constants.projects.projectName));
        if (!isProjectPresent) {
            await utils.click(this.add);
            await utils.fillTextBoxValues(this.name, Constants.projects.projectName, true);
            await utils.fillTextBoxValues(this.projects.customerName, Constants.customers.customerNameForSearch, true);
            await utils.clickOption(Constants.Roles.option, Constants.customers.customerName);
            await utils.fillTextBoxValues(this.description, Constants.projects.projectDescription, true);
            await utils.clickSave(myInfoPage.save, 0);
            await utils.click(this.add);
            await utils.waitForElement(this.projects.addCustomerDialog);
            await utils.fillTextBoxValues(this.projects.addCustomerDialogName, Constants.customers.customerDialogName, true);
            await utils.clickSave(myInfoPage.save, 1);
            await utils.clickSave(myInfoPage.save, 0);
            await utils.clickCloseIcon();
            await utils.waitForSpinnerToDisappear();
            await utils.waitForElement(this.projects.filterArea);
            await utils.fillTextBoxValues(this.projects.customerName, Constants.customers.customerName, true);
            await utils.clickOption(Constants.Roles.option, Constants.customers.customerName);
            await utils.fillTextBoxValues(this.projects.project, Constants.projects.projectName, true);
            await utils.clickOption(Constants.Roles.option, Constants.projects.projectName);
            await utils.click(this.projects.search);
        }
    }

    // This function is used to fill the Timesheet Hours
    async fillTimesheetHours() {
        for (let i = 0; i < 5; i++) {
            await this.page.locator(this.timesheets.timeInputCell).nth(i).fill(Constants.others.timesheetNineHrs);
        }
        await utils.clickSave(myInfoPage.save, 0);
        await this.page.waitForSelector(this.timesheets.totalhrs);
        let total = await utils.getText(this.timesheets.totalhrs);
        expect(total).toEqual(Constants.others.totalhrs);
        await utils.clickSave(myInfoPage.submit, 0);
    }

    // This function is used to fill the Punch In and Punch Out time
    async addPunchInPunchOut() {
        await utils.fillDateValue(this.timeElements.date, Constants.Dates.punchInDate);
        await utils.fillTextBoxValues(this.punchInOut.time, Constants.others.punchInTime, true);
        await utils.click(this.punchInOut.note);
        await utils.fillTextBoxValues(this.punchInOut.note, Constants.others.punchInComment, true);
        await utils.clickSave(this.punchInOut.in, 0);
        await utils.clickCloseIcon();
        await utils.waitForElement(this.punchInOut.punchOutContainer);
        await this.page.waitForTimeout(6000);
        await utils.fillDateValue(this.timeElements.date, Constants.Dates.punchOutDate);
        await utils.fillTextBoxValues(this.punchInOut.time, Constants.others.punchOutTime, true);
        await utils.click(this.punchInOut.note);
        await utils.fillTextBoxValues(this.punchInOut.note, Constants.others.loggedOut, true);
        await utils.clickSave(this.punchInOut.out, 0);
    }

    // This function is used to search and view the reports
    async searchAndViewReports(menuItemValue, locator, textboxValue, projectValue) {
        await utils.click(this.timeElements.reports);
        await utils.clickByRole(Constants.Roles.menuItem, menuItemValue, true);
        await utils.waitForElement(myInfoPage.backgroundContainer);
        await utils.fillTextBoxValues(locator, textboxValue, true);
        await utils.clickOption(Constants.Roles.option, projectValue);
        await utils.click(this.timeElements.view);
    }

    // This function is used to Maximize and Minimize Reports table
    async maximizeMinimizeReports(iconToClick, getAttributeFor) {
        await utils.click(iconToClick);
        return await this.page.locator(getAttributeFor).getAttribute(Constants.attributeClass);
    }
}