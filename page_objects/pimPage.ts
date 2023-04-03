import { Page, expect } from "@playwright/test";
import Constants from '../support/constants.json';
import { Utils } from "../support/utils";
import { HomePage } from "./homePage";

let homePage: HomePage, page: Page, utils: Utils;

export class PIMPage {
    readonly page: Page;
    readonly firstName: string;
    readonly middleName: string;
    readonly lastName: string;
    readonly nickName: string;
    readonly employeeId: string;
    readonly otherId: string;
    readonly driverLicenseNumber: string;
    readonly licenseExpiryDate: string;
    readonly ssnNumber: string;
    readonly sinNumber: string;
    readonly nationality: string;
    readonly maritalStatus: string;
    readonly dateofBirth: string;
    readonly gender: string;
    readonly militaryService: string;
    readonly smoker: string;
    readonly save: string;
    readonly toastMessage: string;
    readonly closeIcon: string;
    readonly bloodType: string;
    readonly addButton: string;
    readonly browseButton: string;
    readonly uploadElement: string;
    readonly commentBox: string;
    readonly cancel: string;
    readonly noRecordsText: string;
    readonly attachmentCheckBox: string;
    readonly deleteSelectedButton: string;
    readonly deleteIcon: string;
    readonly confirmationPopup: string;
    readonly popupText: string;
    readonly attachemtRow: string;
    readonly table: string;
    readonly popupDeleteButton: string;
    readonly contactDetailsLocators: any;
    readonly contactDetails: string;
    readonly emergencyContactDetails: any;
    readonly container: string;
    readonly nameInputField: string;
    readonly dependentsDetails: any;

    readonly addEmployee: string;
    readonly jobDetails: any;
    readonly reportToDetails: any;
    readonly employeeSearchInformation: any;
    readonly thrash: string;
    readonly searchEmployeeReports: any;
    readonly employeeList: any;
    readonly edit: any;
    readonly editEmployeeReports: any;
    search: string;
    reportingMethod: string;
    employeeName: string;
    editIcon: string;
    reportTo: string;
    name: string;
    add: string;

    constructor(page: Page) {
        this.page = page;
        this.firstName = 'input.orangehrm-firstname';
        this.middleName = 'input.orangehrm-middlename';
        this.lastName = 'input.orangehrm-lastname';
        this.nickName = '//label[text()="Nickname"]/../..//div/input';
        this.employeeId = `//label[text()='Employee Id']/../..//div/input`;
        this.otherId = `//label[text()='Other Id']/../..//div/input`;
        this.driverLicenseNumber = `//label[text()="Driver's License Number"]/../..//div/input`;
        this.licenseExpiryDate = `//label[text()='License Expiry Date']/../..//div/input`;
        this.ssnNumber = '//label[text()="SSN Number"]/../..//div/input';
        this.sinNumber = '//label[text()="SIN Number"]/../..//div/input'
        this.nationality = `//label[text()='Nationality']/../../..//div[@class='oxd-select-text--after']`
        this.maritalStatus = `//label[text()='Marital Status']/../../..//div[@class='oxd-select-text--after']`
        this.dateofBirth = `//label[text()='Date of Birth']/../..//div/input`;
        this.gender = '//label[text()="Gender"]/../../..//div[@class="oxd-radio-wrapper"]/label/input[@value="1"]';
        this.militaryService = `//label[text()='Military Service']/../..//div/input`;
        this.smoker = `//label[text()='Smoker']/../../..//div/label/input[@type='checkbox']`;
        this.save = 'button.oxd-button--medium';
        this.toastMessage = 'p.oxd-text--toast-message';
        this.closeIcon = '.oxd-toast-close-container';
        this.bloodType = `//label[text()='Blood Type']/../..//*[@class='oxd-select-wrapper']/div`;
        this.addButton = 'button.oxd-button--text';
        this.browseButton = '//div[text()="Browse"]';
        this.uploadElement = '.oxd-file-input';
        this.commentBox = 'textarea.oxd-textarea';
        this.cancel = '.oxd-form-actions button[type="button"]';
        this.noRecordsText = '.orangehrm-horizontal-padding .oxd-text.oxd-text--span';
        this.attachmentCheckBox = "(//i[contains(@class,'oxd-icon bi-check')])[2]";
        this.deleteSelectedButton = 'button.orangehrm-horizontal-margin';
        this.deleteIcon = 'i.oxd-icon.bi-trash';
        this.confirmationPopup = 'div.orangehrm-dialog-popup';
        this.popupText = 'p.oxd-text--card-body';
        this.attachemtRow = 'div.oxd-table-card';
        this.table = '.oxd-table-body';
        this.popupDeleteButton = '(//div[@class="orangehrm-modal-footer"]//button)[2]';
        this.contactDetails = '//a[text()="Contact Details"]';
        this.container = '.orangehrm-edit-employee-content';
        this.nameInputField = '//label[text()="Name"]/../..//div/input';
        this.contactDetailsLocators = {
            street1: '//label[text()="Street 1"]/../..//div/input',
            street2: '//label[text()="Street 2"]/../..//div/input',
            city: '//label[text()="City"]/../..//div/input',
            state: '//label[text()="State/Province"]/../..//div/input',
            zip: '//label[text()="Zip/Postal Code"]/../..//div/input',
            home: '//label[text()="Home"]/../..//div/input',
            mobile: '//label[text()="Mobile"]/../..//div/input',
            work: '//label[text()="Work"]/../..//div/input',
            workEmail: '//label[text()="Work Email"]/../..//div/input',
            otherEmail: '//label[text()="Other Email"]/../..//div/input',
            country: '//label[text()="Country"]/../../..//div[@class="oxd-select-text--after"]'
        }
        this.emergencyContactDetails = {
            emergencyContactMenuLink: `//a[text()="Emergency Contacts"]`,
            relationship: '//label[text()="Relationship"]/../..//div/input',
            homeTelephone: '//label[text()="Home Telephone"]/../..//div/input',
            mobile: '//label[text()="Mobile"]/../..//div/input',
            workTelephone: '//label[text()="Work Telephone"]/../..//div/input'
        }
        this.dependentsDetails = {
            dependentsMenuLink: `//a[text()="Dependents"]`,
            relationship: '//label[text()="Relationship"]/../../..//div[@class="oxd-select-text--after"]'
        }
        this.jobDetails = {
            jobMenuLink: `//a[text()="Job"]`,
            jobTitle: `//label[text()="Job Title"]/../../..//div[@class="oxd-select-text--after"]`,
            subUnit: `//label[text()="Sub Unit"]/../../..//div[@class="oxd-select-text--after"]`,
            employeeStatus: `//label[text()="Employment Status"]/../../..//div[@class="oxd-select-text--after"]`
        }
        this.reportToDetails = {
            reportToMenuLink: `//a[text()="Report-to"]`,
            nameTitle: `//label[text()="Name"]/../..//div/input`,
            reportingMethod: `//label[text()="Reporting Method"]/../../..//div[@class="oxd-select-text--after"]`,
        }
        this.employeeSearchInformation = {
            employeeName: `//label[text()='Employee Name']/../..//div/input`,
            employeeId: `//label[text()='Employee Id']/../..//div/input`,
            employmentStatus: `//label[text()="Employment Status"]/../../..//div[@class="oxd-select-text--after"]`,
            supervisorName: `//label[text()='Supervisor Name']/../..//div/input`,
            jobTitle: `//label[text()="Job Title"]/../../..//div[@class="oxd-select-text--after"]`,
            subUnit: `//label[text()="Sub Unit"]/../../..//div[@class="oxd-select-text--after"]`
        }
        this.searchEmployeeReports = {
            reportsMenuLink: '//a[contains(text(),"Employee List")]',
            reportNameSearch: `//label[text()='Report Name']/../..//div/input`,
        }
        this.editEmployeeReports = {
            clearBox: `(//span[text()='Configuration ']/following::input)[1]`,
            criteria: `//label[text()="Selection Criteria"]/../../..//div[@class="oxd-select-text--after"]`,
            addreport: `(//i[@class='oxd-icon bi-plus'])`,
            editFields: `//span[text()='Employee Last Name ']//i[@class="oxd-icon bi-x --clear"]`,
            displayFieldGroup: `//label[text()="Select Display Field Group"]/../../..//div[@class="oxd-select-text--after"]`,
            displayField: `//label[text()="Select Display Field"]/../../..//div[@class="oxd-select-text--after"]`,
            reportTable: `div.content-wrapper`,
            recordsCount: `//div[@class='oxd-report-table-header']//span[1]`
        }
        this.employeeList = '//a[contains(text(),"Employee List")]';
        this.addEmployee = '//a[contains(text(),"Add Employee")]';
        this.thrash = `(//i[@class='oxd-icon bi-trash'])`;
        this.edit = `//i[@class='oxd-icon bi-pencil-fill']`;

        this.search = "//button[normalize-space()='Search']";
        this.reportingMethod = "//label[text()='Reporting Method']/../..//div[contains(@class,'text-input')]";
        this.employeeName = "//label[text()='Employee Name']/../..//input";
        this.editIcon = ".oxd-icon.bi-pencil-fill";
        this.reportTo = "//a[text()='Report-to']";
        this.save = "//button[normalize-space()='Save']";
        this.name = "//label[text()='Name']/../..//input";
        this.add = "//button[normalize-space()='Add']";
        utils = new Utils(page);
        homePage = new HomePage(page);
    }

    // This function is used to "clear" the "textbox" values
    async clearTextBoxValues(locatorValue: any) {
        await this.page.locator(locatorValue).fill('');
        await this.page.waitForTimeout(1000);
    };

    // This function is used to verify the presence of "Delete" button and return the boolean value
    async isDeleteButtonPresent() {
        return await this.page.locator(this.deleteSelectedButton).isVisible();
    }

    // This function is used to fill the "textbox" values
    async fillTextBoxValues(locatorValue: any, fillValue: any) {
        await (await this.page.waitForSelector(locatorValue)).waitForElementState("stable");
        await this.page.locator(locatorValue).type(fillValue);
        await this.page.waitForTimeout(2000);
    };

    // This function is used to fill the "Date" textbox values
    async fillDateValue(locatorValue: any, fillValue: any) {
        await this.page.locator(locatorValue).fill(fillValue);
    };

    // This function is used to click the dropdown and "select the passed value"
    async selecDropdownOption(locator: any, optionValue: any) {
        await this.click(locator);
        await this.page.getByRole('option', { name: optionValue }).getByText(optionValue, { exact: true }).click();
    };

    // This function is used to click on the "Save" button
    async clickSave(locatorValue: string, index: number, messageToVerify?: string) {
        await this.page.locator(locatorValue).nth(index).click();
        expect(await this.getToastMessage()).toEqual(messageToVerify);
        await this.clickCloseIcon();
    }

    // This function returns the "toast message text"
    async getToastMessage() {
        return await this.page.locator(this.toastMessage).textContent();
    }

    // This function is used to click on the "Close" Icon of the toast message
    async clickCloseIcon() {
        await this.page.locator(this.closeIcon).click();
    }

    // This function is used to "click on the element"
    async click(locator: any) {
        await this.page.locator(locator).click({ force: true });
    }

    // This function is used to "click on the element with index"
    async clickElementWithIndex(locatorValue: string, index: number) {
        await this.page.locator(locatorValue).nth(index).click();
        await this.page.waitForTimeout(3000);
    }

    // This function is for "uploading the file" and clicking on Save and verifying cancel button functionality
    async uploadFile(filePath: any, value: boolean) {
        await this.click(this.addButton);
        await this.page.waitForSelector(this.browseButton);
        await this.page.setInputFiles(this.uploadElement, filePath);
        await this.fillTextBoxValues(this.commentBox, Constants.fillText.comment);
        await this.page.waitForTimeout(3000);
        if (value) {
            await this.page.locator(this.save).last().click();
            expect(await this.getToastMessage()).toEqual(Constants.sucessMsg.sucessfulSavedMsg);
            await this.clickCloseIcon();
        }
        else {
            await this.click(this.cancel);
            await this.page.waitForSelector(this.noRecordsText);
        }
    }

    // This function is used to "delete the existing files" and asserting
    async deleteExistingFiles() {
        if (await this.isDeleteButtonPresent()) {
            await (await this.page.waitForSelector(this.deleteSelectedButton)).waitForElementState("stable");
            expect(this.page.locator(this.deleteSelectedButton)).toBeVisible();
            await this.click(this.deleteSelectedButton);
            await this.page.waitForSelector(this.confirmationPopup);
            await this.page.locator(this.popupDeleteButton).click();
            expect(await this.getToastMessage()).toEqual(Constants.sucessMsg.successfulDeletedMsg);
            await this.page.waitForTimeout(3000);
            const record = await this.page.locator(this.noRecordsText).textContent();
            expect(record).toContain(Constants.noRecordsText);
        }
    }

    // This function is used to select AddEmployeeMenu
    async clickAddEmployeeMenu() {
        await this.page.waitForSelector(this.addEmployee);
        await this.page.getByRole('link', { name: 'Add Employee' }).click();
        await this.page.waitForSelector(`.orangehrm-background-container`);
        await this.page.waitForTimeout(5000);
    };

    // This function is used to select EmployeeListMenu
    async clickEmployeeListMenu() {
        await this.page.waitForSelector(this.employeeList);
        await this.page.getByRole('link', { name: 'Employee List' }).click();
        await this.page.waitForSelector(`.orangehrm-background-container`);
        await this.page.waitForTimeout(5000);
    };

    // This function is used to select ContactDetailsMenu
    async clickContactDetailsMenu() {
        await this.page.waitForSelector(this.contactDetails);
        await this.page.getByRole('link', { name: 'Contact Details' }).click();
        await this.page.waitForSelector(this.container);
        await this.page.waitForTimeout(5000);
    };

    // This function is used to select EmergencyContactsMenu
    async clickEmergencyContactsMenu() {
        await this.page.waitForSelector(this.emergencyContactDetails.emergencyContactMenuLink);
        await this.page.getByRole('link', { name: 'Emergency Contacts' }).click();
        await this.page.waitForSelector(this.container);
        await this.page.waitForTimeout(5000);
    };

    // This function is used to select DependentsMenu
    async clickDependentsMenu() {
        await this.page.waitForSelector(this.dependentsDetails.dependentsMenuLink);
        await this.page.getByRole('link', { name: 'Dependents' }).click();
        await this.page.waitForSelector(this.container);
        await this.page.waitForTimeout(5000);
    };

    // This function is used to select EReportsMenu
    async clickReportsMenu() {
        await this.page.waitForSelector(this.searchEmployeeReports.reportsMenuLink);
        await this.page.getByRole('link', { name: 'Reports' }).click();
        await this.page.waitForSelector(`.orangehrm-background-container`);
        await this.page.waitForTimeout(5000);
    };

    // This function is used to select Menu
    async clickMenu(locator, menuLink) {
        await this.page.waitForSelector(locator);
        await this.page.getByRole('link', { name: menuLink }).click();
        await (await this.page.waitForSelector(this.container)).waitForElementState("stable");
        await this.page.waitForLoadState("networkidle", { timeout: 10000 });
        await this.page.waitForTimeout(5000);
    }

    // This function is used to delete the existing files and verifying confirmation of "Yes" and "No" button
    async deleteAttachedFile(confirmation: string) {
        if (confirmation == "cancel") {
            await this.page.locator(this.deleteIcon).first().click();
            await this.page.waitForSelector(this.confirmationPopup);
            expect(await this.page.locator(this.popupText).textContent()).toEqual(Constants.popupText.text);
            await this.page.getByRole('button', { name: /^\s*No, Cancel\s*$/i }).click();
            expect(this.page.locator(this.attachemtRow).first()).toBeVisible();
        }
        else {
            await this.page.locator(this.deleteIcon).first().click();
            await this.page.waitForSelector(this.confirmationPopup);
            expect(await this.page.locator(this.popupText).textContent()).toEqual(Constants.popupText.text);
            await this.page.locator(this.popupDeleteButton).click();
            expect(this.page.locator(this.attachemtRow).first()).not.toBeVisible();
        }
    };

    // This function is used to filling the multiple textbox values using "for of" loop
    async fillFieldValues(namesLocators: any, values: any) {
        for (const locator of namesLocators) {
            await this.clearTextBoxValues(locator);
            const index = namesLocators.indexOf(locator);
            await this.fillTextBoxValues(locator, values[index]);
            await this.page.waitForTimeout(3000);
        };
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