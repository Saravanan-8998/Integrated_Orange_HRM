import { Page, expect } from "@playwright/test";
import { Utils } from "../support/utils";
import Constants from '../support/constants.json';

let utils: Utils;

export class MyInfoPage {
    readonly page: Page;
    readonly save: string;
    readonly container: string;
    readonly backgroundContainer: string;
    readonly nameInputField: string;
    readonly myInfoPersonalDetails: any;
    readonly toastElements: any;
    readonly attachments: any;
    readonly contactDetailsLocators: any;
    readonly myInfoContactDetails: any;
    readonly emergencyContactDetails: any;
    readonly dependentsDetails: any;
    readonly immigrationDetails: any;
    readonly workExperience: any;
    readonly education: any;
    readonly skills: any;
    readonly languages: any;
    readonly license: any;
    readonly qualifications: any;
    readonly addBtn: any;
    readonly memberships: any;
    readonly reportTo: string;
    readonly submit: string;

    constructor(page: Page) {
        this.page = page;
        utils = new Utils(page);
        this.save = "//button[normalize-space()='Save']";
        this.submit = "//button[normalize-space()='Submit']";
        this.container = '.orangehrm-edit-employee-content';
        this.backgroundContainer = '.orangehrm-background-container';
        this.nameInputField = '//label[text()="Name"]/../..//div/input';
        this.reportTo = "//a[text()='Report-to']";
        this.myInfoPersonalDetails = {
            firstName: 'input.orangehrm-firstname',
            middleName: 'input.orangehrm-middlename',
            lastName: 'input.orangehrm-lastname',
            nickName: '//label[text()="Nickname"]/../..//div/input',
            employeeId: `//label[text()='Employee Id']/../..//div/input`,
            otherId: `//label[text()='Other Id']/../..//div/input`,
            driverLicenseNumber: `//label[text()="Driver's License Number"]/../..//div/input`,
            licenseExpiryDate: `//label[text()='License Expiry Date']/../..//div/input`,
            ssnNumber: '//label[text()="SSN Number"]/../..//div/input',
            sinNumber: '//label[text()="SIN Number"]/../..//div/input',
            nationality: `//label[text()='Nationality']/../../..//div[contains(@class,'text-input')]`,
            maritalStatus: `//label[text()='Marital Status']/../../..//div[contains(@class,'text-input')]`,
            dateofBirth: `//label[text()='Date of Birth']/../..//div/input`,
            gender: '//label[text()="Gender"]/../../..//div[@class="oxd-radio-wrapper"]/label/input[@value="1"]',
            militaryService: `//label[text()='Military Service']/../..//div/input`,
            smoker: `//label[text()='Smoker']/../../..//div/label/input[@type='checkbox']`,
            bloodType: `//label[text()='Blood Type']/../..//*[@class='oxd-select-wrapper']/div`
        }
        this.toastElements = {
            toastMessage: 'p.oxd-text--toast-message',
            closeIcon: '.oxd-toast-close-container'
        }
        this.attachments = {
            browseButton: '//div[text()="Browse"]',
            uploadElement: '.oxd-file-input',
            cancel: "//button[normalize-space()='Cancel']",
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
        this.contactDetailsLocators = {
            contactDetails: '//a[text()="Contact Details"]',
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
            country: "//label[text()='Country']/../../..//div[contains(@class,'text-input')]"
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
            relationship: "//label[text()='Relationship']/../../..//div[contains(@class,'text-input')]"
        }
        this.immigrationDetails = {
            immigrationDetailsMenuLink: '//a[text()="Immigration"]',
            passportOption: '//div[@class="oxd-radio-wrapper"]//input[@value="1"]',
            number: '//label[text()="Number"]/../..//input[contains(@class,"oxd-input")]',
            issuedDate: '//label[text()="Issued Date"]/../..//input[contains(@class,"oxd-input")]',
            expiryDate: '//label[text()="Expiry Date"]/../..//input[contains(@class,"oxd-input")]',
            eligibleStatus: '//label[text()="Eligible Status"]/../..//input[contains(@class,"oxd-input")]',
            issuedBy: "//label[text()='Issued By']/../../..//div[contains(@class,'text-input')]",
            eligibleReviewDate: '//label[text()="Eligible Review Date"]/../../..//input[contains(@class,"oxd-input")]',
            comments: '[placeholder="Type Comments here"]',
            comment: '[placeholder="Type comment here"]',
        }
        this.workExperience = {
            company: '//label[text()="Company"]/../..//div/input',
            jobTitle: '//label[text()="Job Title"]/../..//div/input',
            fromDate: '//label[text()="From"]/../..//input',
            toDate: '//label[text()="To"]/../..//input',
            comment: '//h6[.="Add Work Experience"]/..//textarea'
        }
        this.qualifications = {
            qualificationsMenuLink: '//a[text()="Qualifications"]',
            qualificationComment: '.oxd-input-group .oxd-textarea'
        }
        this.education = {
            level: "//label[text()='Level']/../../..//div[contains(@class,'text-input')]",
            institute: "//label[text()='Institute']/../..//input",
            majorOrSpecialization: "//label[text()='Major/Specialization']/../..//input",
            year: "//label[text()='Year']/../..//input",
            gpaScore: "//label[text()='GPA/Score']/../..//input",
            startDate: "//label[text()='Start Date']/../..//input",
            endDate: "//label[text()='End Date']/../..//input"
        }
        this.skills = {
            skill: "//label[text()='Skill']/../../..//div[contains(@class,'text-input')]",
            yearsOfExperience: "//label[text()='Years of Experience']/../..//input",
            comment: '//h6[.="Add Skill"]/..//textarea'
        }
        this.languages = {
            language: "//label[text()='Language']/../../..//div[contains(@class,'text-input')]",
            fluency: "//label[text()='Fluency']/../../..//div[contains(@class,'text-input')]",
            competency: "//label[text()='Competency']/../../..//div[contains(@class,'text-input')]",
            comment: '//h6[.="Add Language"]/..//textarea'
        }
        this.license = {
            licenseType: "//label[text()='License Type']/../../..//div[contains(@class,'text-input')]",
            licenseNumber: "//label[text()='License Number']/../..//input",
            issuedDate: "//label[text()='Issued Date']/../..//input",
            expiryDate: "//label[text()='Expiry Date']/../..//input"
        }
        this.memberships = {
            membershipMenuLink: "//a[text()='Memberships']",
            membership: "//label[text()='Membership']/../../..//div[contains(@class,'text-input')]",
            subscriptionPaidBy: "//label[text()='Subscription Paid By']/../../..//div[contains(@class,'text-input')]",
            currency: "//label[text()='Currency']/../../..//div[contains(@class,'text-input')]",
            subscriptionAmount: "//label[text()='Subscription Amount']/../..//input",
            subscriptionCommenceDate: "//label[text()='Subscription Commence Date']/../..//input",
            subscriptionRenewalDate: "//label[text()='Subscription Renewal Date']/../..//input"
        }
        this.addBtn = (section: any) => {
            return `//h6[text()='${section}']/following-sibling::button`;
        }
    }

    // This function is used to "click on Add button"
    async clickAddButton(section: string) {
        await (await this.page.waitForSelector(await this.addBtn(section))).waitForElementState("stable");
        let addButton = this.page.locator(await this.addBtn(section));
        await addButton.click();
        if (await this.page.locator(utils.spinner).first().isVisible()) {
            await utils.waitForSpinnerToDisappear();
        }
        await (await this.page.waitForSelector(this.container)).waitForElementState("stable");
    }

    // This function is used to verify the presence of "Delete" button and return the boolean value
    async isDeleteButtonPresent() {
        return await this.page.locator(this.attachments.deleteSelectedButton).isVisible();
    }

    // This function is used to "delete the existing files" and asserting
    async deleteExistingFiles() {
        let deleteButton = await this.isDeleteButtonPresent();
        if (deleteButton) {
            await (await this.page.waitForSelector(this.attachments.deleteSelectedButton)).waitForElementState("stable");
            expect(this.page.locator(this.attachments.deleteSelectedButton)).toBeVisible();
            await utils.click(this.attachments.deleteSelectedButton);
            await this.page.waitForSelector(this.attachments.confirmationPopup);
            await this.page.locator(this.attachments.popupDeleteButton).click();
            expect(await utils.getToastMessage()).toEqual(Constants.sucessMsg.successfulDeletedMsg);
            await (await this.page.waitForSelector(this.attachments.noRecordsText)).waitForElementState("stable");
            const record = await this.page.locator(this.attachments.noRecordsText).textContent();
            expect(record).toContain(Constants.noRecordsText);
        }
    }

    // This function is for "uploading the file" and clicking on Save and verifying cancel button functionality
    async uploadFile(filePath: any, section: string, save: boolean) {
        await this.clickAddButton(section);
        await this.page.waitForSelector(this.attachments.browseButton);
        // this.page.on("filechooser", async (filechooser) => {
        //     await filechooser.setFiles('uploadTextFile.txt')
        //   });
        await this.page.setInputFiles(this.attachments.uploadElement, filePath);
        await utils.fillTextBoxValues(this.immigrationDetails.comment, Constants.fillText.comment, true);
        if (save) {
            await (await this.page.waitForSelector(this.save)).waitForElementState("stable");
            await this.page.locator(this.save).last().click();
            expect(await utils.getToastMessage()).toEqual(Constants.sucessMsg.sucessfulSavedMsg);
            await utils.clickCloseIcon();
        }
        else {
            await utils.click(this.attachments.cancel);
            await this.page.waitForSelector(this.attachments.noRecordsText);
        }
    }

    // This function is used to delete the existing files and verifying confirmation of "Yes" and "No" button
    async deleteAttachedFile(confirmation: string) {
        if (confirmation == "cancel") {
            await this.page.locator(this.attachments.deleteIcon).first().click();
            await this.page.waitForSelector(this.attachments.confirmationPopup);
            expect(await this.page.locator(this.attachments.popupText).textContent()).toEqual(Constants.popupText.text);
            await this.page.getByRole('button', { name: /^\s*No, Cancel\s*$/i }).click();
            expect(this.page.locator(this.attachments.attachemtRow).first()).toBeVisible();
        }
        else {
            await this.page.locator(this.attachments.deleteIcon).first().click();
            await this.page.waitForSelector(this.attachments.confirmationPopup);
            expect(await this.page.locator(this.attachments.popupText).textContent()).toEqual(Constants.popupText.text);
            await this.page.locator(this.attachments.popupDeleteButton).click();
            expect(this.page.locator(this.attachments.attachemtRow).first()).not.toBeVisible();
        }
    };

    // This function is used to get the Arrays of Locators and its values
    async getLocators(locatorsSection: string) {
        let locators: string[] = [];
        let values: string[] = [];
        switch (locatorsSection) {
            case "names":
                locators = [this.myInfoPersonalDetails.firstName, this.myInfoPersonalDetails.middleName, this.myInfoPersonalDetails.lastName, this.myInfoPersonalDetails.nickName];
                values = [Constants.EmployeeName.firstName, Constants.EmployeeName.middleName, Constants.EmployeeName.lastName, Constants.EmployeeName.nickName];
                break;
            case "id":
                locators = [this.myInfoPersonalDetails.employeeId, this.myInfoPersonalDetails.otherId, this.myInfoPersonalDetails.driverLicenseNumber, this.myInfoPersonalDetails.licenseExpiryDate];
                values = [Constants.EmployeeIDs.employeeId, Constants.EmployeeIDs.otherId, Constants.EmployeeIDs.driverLicenseNumber, Constants.EmployeeIDs.licenseExpiryDate];
                break;
            case "contactDetails":
                locators = [this.contactDetailsLocators.street1, this.contactDetailsLocators.street2, this.contactDetailsLocators.city, this.contactDetailsLocators.state, this.contactDetailsLocators.zip, this.contactDetailsLocators.home, this.contactDetailsLocators.mobile, this.contactDetailsLocators.work, this.contactDetailsLocators.workEmail, this.contactDetailsLocators.otherEmail];
                values = [Constants.EmployeeContactDetails.street1, Constants.EmployeeContactDetails.street2, Constants.EmployeeContactDetails.city, Constants.EmployeeContactDetails.state, Constants.EmployeeContactDetails.zip, Constants.EmployeeContactDetails.home, Constants.EmployeeContactDetails.mobile, Constants.EmployeeContactDetails.work, Constants.EmployeeContactDetails.workEmail, Constants.EmployeeContactDetails.otherEmail];
                break;
            case "emergencyContact":
                locators = [this.nameInputField, this.emergencyContactDetails.relationship, this.emergencyContactDetails.homeTelephone, this.emergencyContactDetails.mobile, this.emergencyContactDetails.workTelephone];
                values = [Constants.EmergencyContacts.name, Constants.EmergencyContacts.relationship, Constants.EmergencyContacts.homeTelephone, Constants.EmergencyContacts.mobile, Constants.EmergencyContacts.workTelephone];
                break;
            case "immigration":
                locators = [this.immigrationDetails.issuedDate, this.immigrationDetails.expiryDate, this.immigrationDetails.eligibleStatus, this.immigrationDetails.eligibleReviewDate, this.immigrationDetails.comments, this.immigrationDetails.number];
                values = [Constants.ImmigrationDetails.issuedDate, Constants.ImmigrationDetails.expiryDate, Constants.ImmigrationDetails.eligibleStatus, Constants.ImmigrationDetails.eligibleReviewDate, Constants.ImmigrationDetails.comments, Constants.ImmigrationDetails.number];
                break;
            case "workExperience":
                locators = [this.workExperience.company, this.workExperience.jobTitle, this.workExperience.fromDate, this.workExperience.toDate, this.workExperience.comment];
                values = [Constants.WorkExperience.company, Constants.WorkExperience.jobTitle, Constants.WorkExperience.fromDate, Constants.WorkExperience.toDate, Constants.WorkExperience.comment];
                break;
            case "education":
                locators = [this.education.institute, this.education.majorOrSpecialization, this.education.year, this.education.gpaScore, this.education.startDate, this.education.endDate];
                values = [Constants.Education.institute, Constants.Education.majorOrSpecialization, Constants.Education.year, Constants.Education.gpaScore, Constants.Education.startDate, Constants.Education.endDate];
                break;
            case "skills":
                locators = [this.skills.yearsOfExperience, this.skills.comment];
                values = [Constants.Skills.yearsOfExperience, Constants.Skills.comment];
                break;
            case "licenseDetails":
                locators = [this.license.licenseNumber, this.license.issuedDate, this.license.expiryDate];
                values = [Constants.License.licenseNumber, Constants.License.issuedDate, Constants.License.expiryDate];
                break;
            case "AssigenedMemberships":
                locators = [this.memberships.subscriptionAmount, this.memberships.subscriptionCommenceDate, this.memberships.subscriptionRenewalDate];
                values = [Constants.AssignedMemberships.subscriptionAmount, Constants.AssignedMemberships.subscriptionCommenceDate, Constants.AssignedMemberships.subscriptionRenewalDate];
                break;
        }
        return { locators, values };
    }
}