import { Page, expect } from "@playwright/test";
import Constants from '../support/constants.json';
import { Utils } from "../support/utils";

let utils: Utils;

export class PerformancePage {
    readonly page: Page;
    readonly keyPerformanceIndicators: any;
    readonly addPerformanceTracker: any;
    readonly myTracker: any;
    readonly employeeTrackers: any;
    readonly logElements: any;
    readonly manageReviews: any;
    readonly save: string;
    readonly add: string;
    readonly cancel: string;
    readonly addReview: any;
    readonly myReview: any;
    readonly attachments: any;
    readonly view: string;
    readonly rowForCheckbox: (value: any) => string;
    readonly row: (value: any) => string;
    readonly getRowCells: (columnValue: any) => string;

    constructor(page: Page) {
        this.page = page;
        utils = new Utils(page);
        this.save = "//button[normalize-space()='Save']";
        this.add = "//button[normalize-space()='Add']";
        this.cancel = "//button[normalize-space()='Cancel']";
        this.keyPerformanceIndicators = {
            search: "//button[normalize-space()='Search']",
            comment: "//p[.='Add Tracker Log']/../..//textarea",
            backgroundContainer: '.orangehrm-background-container',
            logPopup: '.oxd-dialog-sheet',
            configure: "//span[contains(text(),'Configure')]",
            keyPerformanceIndicator: "//label[text()='Key Performance Indicator']/../..//input",
            jobTitle: "//label[text()='Job Title']/../../..//div[contains(@class,'text-input')]"
        }
        this.addPerformanceTracker = {
            trackerName: "//label[text()='Tracker Name']/../..//input",
            employeeName: "//label[text()='Employee Name']/../..//input",
            reviewers: "//label[text()='Reviewers']/../..//input"
        }
        this.myTracker = {
            view: "[name='view']",
            myTrackerView: "//h5[text()='AB Playwright Test']"
        }
        this.employeeTrackers = {
            employeeTrackerView: "//h5[text()='AB Playwright Test']",
            include: "//label[text()='Include']/../..//div[contains(@class,'text-input')]"
        }
        this.logElements = {
            addLog: "//button[text()= ' Add Log ']",
            log: "//label[text()='Log']/../..//input",
            positive: '.orangehrm-add-tracker-log-ratings-container button',
            employeeTrackerLogContainer: '.orangehrm-employee-tracker-log',
            verticalDots: '.bi-three-dots-vertical',
            delete: "//p[.='Delete']",
            noRecords: "//p[.='No Records Found']"
        }
        this.manageReviews = {
            manageReviewsMenu: "//span[text()='Manage Reviews ']",
        }
        this.myReview = {
            complete: '.orangehrm-performance-review-actions button',
            confirmationReviewPopup: '.oxd-dialog-sheet',
            popupButtons: '.oxd-dialog-sheet button',
            dueDate: "//div[text()='2023-04-05']",
            fileIcon: ".bi-file-text-fill",
            ratingField: ".orangehrm-evaluation-grid .oxd-input--active",
            commentsField: ".orangehrm-evaluation-grid .oxd-textarea--active",
            generalComments: "//p[text()='General Comment']/../..//following::textarea",
        }
        this.addReview = {
            employeeName: "//label[text()='Employee Name']/../..//input",
            supervisorReviewer: "//label[text()='Supervisor Reviewer']/../..//input",
            reviewPeriodStartDate: "//label[text()='Review Period Start Date']/../..//input",
            reviewPeriodEndDate: "//label[text()='Review Period End Date']/../..//input",
            reviewDueDate: "//label[text()='Due Date']/../..//input",
            activate: "//button[text()=' Activate ']",
            table: ".oxd-table",
            deleteIcon: ".oxd-icon.bi-trash",
            editIcon: ".oxd-icon.bi-pencil-fill",
            tableRow: "//div[@class='oxd-table-card']/div[@role='row']",
            tableRowCells: "//div[@class='oxd-table-card']/div[@role='row']/div[@role='cell']"
        }
        this.attachments = {
            browseButton: '//div[text()="Browse"]',
            uploadElement: '.oxd-file-input',
            cancel: '.oxd-form-actions button[type="button"]',
            noRecordsText: '.orangehrm-horizontal-padding .oxd-text.oxd-text--span',
            attachmentCheckBox: "(//i[contains(@class,'oxd-icon bi-check')])[2]",
            deleteSelectedButton: 'button.orangehrm-horizontal-margin',
            deleteIcon: 'i.oxd-icon.bi-trash',
            confirmationPopup: 'div.orangehrm-dialog-popup',
            popupText: 'p.oxd-text--card-body',
            attachemtRow: 'div.oxd-table-card',
            table: '.oxd-table-body',
            popupDeleteButton: "//button[normalize-space()='Yes, Delete']"
        }
        this.view = "../..//button";
        this.rowForCheckbox = (value) => {
            return `//div[text()='${value}']/../..//input[@type='checkbox']`;
        }
        this.row = (value) => {
            return `//div[@class='oxd-table-card']//div[@role='cell']/div[contains(text(),'${value}')]`;
        }
        this.getRowCells = (columnValue: any) => {
            return `//div[@class='oxd-table-card']//div[@role='cell']/div[text()='${columnValue}']/../..//div[@role='cell']/div`;
        }
    }

    // This function is used to get the "specific row checkbox"
    async getARowCheckbox(value) {
        return this.page.locator(this.rowForCheckbox(value));
    }

    // This function is used to get the "specific row"
    async getARow(value) {
        await this.page.waitForSelector(this.row(value));
        return this.page.locator(this.row(value));
    }

    // This function is used to click on "View" and return the tracker visibility status
    async clickViewAndVerify() {
        await this.page.locator(this.myTracker.view).click();
        await this.page.waitForSelector(this.keyPerformanceIndicators.backgroundContainer);
        await (await this.page.waitForSelector(this.myTracker.myTrackerView)).waitForElementState("stable");
        let myTracker = await this.page.locator(this.myTracker.myTrackerView).isVisible();
        return myTracker;
    }

    // This function is used to click on "View" of the specific row
    async getViewAndClick(cellText, index) {
        let empPerfTracker = await this.getARow(cellText);
        let empPerfTrackerView = empPerfTracker.locator(this.view);
        await empPerfTrackerView.nth(index).click();
        await utils.waitForElement(this.employeeTrackers.employeeTrackerView);
    }

    // This function is used to get "Employee Tracker" View visible status
    async isEmployeeTrackerViewVisible() {
        return await this.page.locator(this.employeeTrackers.employeeTrackerView).isVisible();
    }

    //This function is used to "Create Logs" in Employee Tracker page
    async createLogs() {
        await this.page.waitForSelector(this.keyPerformanceIndicators.logPopup);
        await utils.fillTextBoxValues(this.logElements.log, Constants.others.logName, true);
        await utils.clickElementWithIndex(this.logElements.positive, 0);
        await utils.fillTextBoxValues(this.keyPerformanceIndicators.comment, Constants.others.logComment, true);
        await utils.clickSave(this.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
        await this.page.waitForSelector(this.logElements.employeeTrackerLogContainer);
    }

    //This function is used to "Delete Logs" in Employee Tracker page
    async deleteLogs() {
        await utils.click(this.logElements.verticalDots);
        await utils.click(this.logElements.delete);
        await this.page.waitForSelector(this.attachments.confirmationPopup);
        await this.page.locator(this.attachments.popupDeleteButton).click();
        let toastMsg = await utils.getToastMessage();
        expect(toastMsg).toEqual(Constants.sucessMsg.successfulDeletedMsg);
        await this.page.waitForSelector(this.logElements.noRecords);
    }

    //This function is used to get a Add review Row Details
    async getRowDetails() {
        await this.page.waitForSelector(this.addReview.tableRow);
        let cells = await this.page.locator(this.addReview.tableRowCells).allTextContents();
        return {
            employee: cells[1],
            jobTitle: cells[2],
            reviewPeriod: cells[3],
            reviewDueDate: cells[4],
            reviewer: cells[5],
            reviewStatus: cells[6]
        }
    }

    //This function is used to get a My Review Row Details
    async getMyReviewDetails(columnValue) {
        await this.page.waitForSelector(this.addReview.tableRow);
        let rowCellValues = await this.page.locator(this.getRowCells(columnValue)).allTextContents();
        return {
            jobTitle: rowCellValues[0],
            subUnit: rowCellValues[1],
            reviewPeriod: rowCellValues[2],
            reviewDueDate: rowCellValues[3],
            selfEvaluationStatus: rowCellValues[4],
            reviewStatus: rowCellValues[5]
        }
    }

    //This function is used to get a fill the My Review Details
    async fillMyReviewDetails() {
        await utils.waitForElement(this.attachments.attachemtRow);
        let dueDate = await utils.isElementVisible(this.myReview.dueDate);
        expect(dueDate).toBeTruthy();
        await utils.clickElementWithIndex(this.myReview.fileIcon, 0);
        for (let i = 0; i < 5; i++) {
            await this.page.locator(this.myReview.ratingField).nth(i).fill(Constants.others.ratingValue);
            await this.page.locator(this.myReview.commentsField).nth(i).fill(Constants.others.ratingComment);
        }
        await this.page.locator(this.myReview.generalComments).type(Constants.others.generalComment);
        await utils.clickElementWithIndex(this.myReview.complete, 2);
        await utils.clickElementWithIndex(this.myReview.popupButtons, 2);
        expect(await utils.getToastMessage()).toEqual(Constants.sucessMsg.sucessfulSavedMsg);
        await utils.click(this.manageReviews.manageReviewsMenu);
    }
}