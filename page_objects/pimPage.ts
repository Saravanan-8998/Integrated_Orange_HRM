import { Page } from "@playwright/test";
import { Utils } from "../support/utils";
import { HomePage } from "./homePage";
import Constants from '../support/constants.json';

let homePage: HomePage, page: Page, utils: Utils;

export class PIMPage {
    readonly page: Page;
    readonly search: string;
    readonly reportingMethod: string;
    readonly employeeName: string;
    readonly editIcon: string;
    readonly reportTo: string;
    readonly save: string;
    readonly name: string;
    readonly add: string;
    readonly container: string;

    constructor(page: Page) {
        this.page = page;
        this.search = "//button[normalize-space()='Search']";
        this.reportingMethod = "//label[text()='Reporting Method']/../..//div[contains(@class,'text-input')]";
        this.employeeName = "//label[text()='Employee Name']/../..//input";
        this.editIcon = ".oxd-icon.bi-pencil-fill";
        this.reportTo = "//a[text()='Report-to']";
        this.save = "//button[normalize-space()='Save']";
        this.name = "//label[text()='Name']/../..//input";
        this.add = "//button[normalize-space()='Add']";
        this.container = '.orangehrm-edit-employee-content';
        utils = new Utils(page);
        homePage = new HomePage(page);
    }

    // This function is used to "Assign the Supervisor" for the Employee
    async assignSupervisor(employeeToSearch, supervisorEmployee) {
        await utils.clickMenu("link", homePage.homePageElements.pim, "PIM");
        await utils.fillTextBoxValues(this.employeeName, employeeToSearch, true);
        await utils.clickOption('option', employeeToSearch);
        await utils.click(this.search);
        await utils.click(this.editIcon);
        await utils.waitForSpinnerToDisappear();
        await utils.waitForElement(this.container)
        await utils.click(this.reportTo);
        await utils.clickElementWithIndex(this.add, 0);
        await utils.fillTextBoxValues(this.name, supervisorEmployee, true);
        await utils.clickOption('option', supervisorEmployee);
        await utils.click(this.reportingMethod);
        await utils.clickOption('option', "Direct");
        await utils.clickSave(this.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
    }
}