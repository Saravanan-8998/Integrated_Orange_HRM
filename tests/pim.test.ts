import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, PIMPage } from '../page_objects';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, pimPage: PIMPage, testData: TestData, page: Page, utils: Utils;;

let nameValues = [Constants.employeeDetails.firstName, Constants.employeeDetails.middleName, Constants.employeeDetails.lastName, Constants.employeeDetails.employeeId];
let idValues = [Constants.employeeIDs.otherId, Constants.employeeIDs.driverLicenseNumber, Constants.employeeIDs.ssnNumber, Constants.employeeIDs.sinNumber];
let contactDetailValues = [Constants.EmployeeContactDetails.street1, Constants.EmployeeContactDetails.street2, Constants.EmployeeContactDetails.city, Constants.EmployeeContactDetails.state, Constants.EmployeeContactDetails.zip, Constants.EmployeeContactDetails.home, Constants.EmployeeContactDetails.mobile, Constants.EmployeeContactDetails.work, Constants.EmployeeContactDetails.workEmail, Constants.EmployeeContactDetails.otherEmail];
let emergencyContactValues = [Constants.EmergencyContacts.name, Constants.EmergencyContacts.relationship, Constants.EmergencyContacts.homeTelephone, Constants.EmergencyContacts.mobile, Constants.EmergencyContacts.workTelephone];

let namesLocators = [];
let idLocators = [];
let contactDetailsLocators = [];
let emergencyContactLocators = [];

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    utils = new Utils(page);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    pimPage = new PIMPage(page);
    testData = new TestData(page);
    idLocators = [pimPage.otherId, pimPage.driverLicenseNumber, pimPage.ssnNumber, pimPage.sinNumber];
    contactDetailsLocators = [pimPage.contactDetailsLocators.street1, pimPage.contactDetailsLocators.street2, pimPage.contactDetailsLocators.city, pimPage.contactDetailsLocators.state, pimPage.contactDetailsLocators.zip, pimPage.contactDetailsLocators.home, pimPage.contactDetailsLocators.mobile, pimPage.contactDetailsLocators.work, pimPage.contactDetailsLocators.workEmail, pimPage.contactDetailsLocators.otherEmail];
    emergencyContactLocators = [pimPage.nameInputField, pimPage.emergencyContactDetails.relationship, pimPage.emergencyContactDetails.homeTelephone, pimPage.emergencyContactDetails.mobile, pimPage.emergencyContactDetails.workTelephone];
    await loginPage.getBaseURL();
    await expect(page).toHaveURL(/.*login/);
    let pass = await testData.encodeDecodePassword();
    await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
    await utils.clickMenu("link", homePage.homePageElements.pim, "PIM");
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Personal Informations', () => {
    test('Adding Employee section', async () => {
        await pimPage.clickAddEmployeeMenu();
        namesLocators = [pimPage.firstName, pimPage.middleName, pimPage.lastName, pimPage.employeeId];
        await pimPage.fillFieldValues(namesLocators, nameValues);
        await pimPage.clickSave(pimPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
        await page.waitForTimeout(5000);
    });

    test.skip('Filling the Id section', async () => {
        await pimPage.fillFieldValues(idLocators, idValues);
        await pimPage.fillDateValue(pimPage.licenseExpiryDate, Constants.pimModule.licenseExpiryDate);
    });

    test('Filling the Personal Informations section', async () => {
        await pimPage.selecDropdownOption(pimPage.nationality, Constants.pimModule.nationality);
        await pimPage.selecDropdownOption(pimPage.maritalStatus, Constants.pimModule.maritalStatus);
        await pimPage.fillDateValue(pimPage.dateofBirth, Constants.pimModule.dateOfBirth);
        await pimPage.click(pimPage.gender);
        await pimPage.clickSave(pimPage.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
        await pimPage.selecDropdownOption(pimPage.bloodType, Constants.pimModule.bloodType);
        await pimPage.clickSave(pimPage.save, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Filling the Personal informations and verifying cancel button', async () => {
        await pimPage.uploadFile('uploadTextFile.txt', false);
    });

    test('Filling the Personal informations and verifying save button', async () => {
        await pimPage.uploadFile('uploadTextFile.txt', true);
        await utils.waitForElement(pimPage.table);
        let table = page.locator(pimPage.table);
        expect(table).toBeVisible();
    });

    test('Deleting the existing attachments', async () => {
        await pimPage.click(pimPage.attachmentCheckBox);
        await pimPage.deleteExistingFiles();
    });

    test('Uploading a new file and checking the checkbox and performing delete operation', async () => {
        await pimPage.uploadFile('uploadTextFile.txt', true);
        await pimPage.deleteAttachedFile("cancel");
        await pimPage.deleteAttachedFile("save");
    });
});

test.describe('Filling Contact Informations', () => {
    test('Filling the Address section fields', async () => {
        await pimPage.clickMenu(pimPage.contactDetails, 'Contact Details');
        await pimPage.fillFieldValues(contactDetailsLocators, contactDetailValues);
        await pimPage.selecDropdownOption(pimPage.contactDetailsLocators.country, Constants.pimModule.country);
        await pimPage.clickSave(pimPage.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
    });
});

test.describe('Filling Emergency Contacts informations', () => {
    test('Filling Emergency Contacts informations', async () => {
        await pimPage.clickEmergencyContactsMenu();
        await pimPage.clickMenu(pimPage.emergencyContactDetails.emergencyContactMenuLink, 'Emergency Contacts');
        await pimPage.clickElementWithIndex(pimPage.addButton, 0);
        await pimPage.fillFieldValues(emergencyContactLocators, emergencyContactValues);
        await pimPage.clickSave(pimPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
        await pimPage.clickElementWithIndex(pimPage.addButton, 1);
        await pimPage.uploadFile('uploadTextFile.txt', true);
    });
});

test.describe('Filling Dependents informations', () => {
    test('Filling Dependents informations', async () => {
        await pimPage.clickMenu(pimPage.dependentsDetails.dependentsMenuLink, 'Dependents');
        await pimPage.clickElementWithIndex(pimPage.addButton, 0);
        await pimPage.clearTextBoxValues(pimPage.nameInputField);
        await pimPage.fillTextBoxValues(pimPage.nameInputField, Constants.pimModule.name);
        await pimPage.selecDropdownOption(pimPage.dependentsDetails.relationship, Constants.pimModule.relationship);
        await pimPage.fillDateValue(pimPage.dateofBirth, Constants.pimModule.depDateofBirth);
        await pimPage.clickSave(pimPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
        await pimPage.clickElementWithIndex(pimPage.addButton, 1);
        await pimPage.uploadFile('uploadTextFile.txt', true);
    });
});

test.describe('Filling Job informations', () => {
    test('Filling Job informations', async () => {
        await pimPage.clickMenu(pimPage.jobDetails.jobMenuLink, 'Job');
        await pimPage.selecDropdownOption(pimPage.jobDetails.jobTitle, Constants.pimModule.jobTitle);
        await pimPage.selecDropdownOption(pimPage.jobDetails.subUnit, Constants.pimModule.subUnit);
        await pimPage.selecDropdownOption(pimPage.jobDetails.employeeStatus, Constants.pimModule.employeeStatus);
        await pimPage.clickSave(pimPage.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
    });
});

test.describe('Filling Report-To informations', () => {
    test('Filling Report-To informations', async () => {
        await pimPage.clickMenu(pimPage.reportToDetails.reportToMenuLink, 'Report-to');
        await pimPage.clickElementWithIndex(pimPage.addButton, 0);
        await pimPage.fillTextBoxValues(pimPage.reportToDetails.nameTitle, Constants.pimModule.nameTitle);
        await pimPage.selecDropdownOption(pimPage.reportToDetails.nameTitle, Constants.pimModule.nameTitle);
        await pimPage.selecDropdownOption(pimPage.reportToDetails.reportingMethod, Constants.pimModule.reportingMethod);
        await pimPage.clickSave(pimPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });
});

test.describe('Search Employee List informations', () => {
    test('Filling Employee informations and searching for the existing Employee', async () => {
        await pimPage.clickEmployeeListMenu();
        await pimPage.fillTextBoxValues(pimPage.employeeSearchInformation.employeeName, Constants.pimModule.employeeName);
        await pimPage.selecDropdownOption(pimPage.employeeSearchInformation.employeeName, Constants.pimModule.employeeName);
        await pimPage.fillTextBoxValues(pimPage.employeeSearchInformation.employeeId, Constants.pimModule.employeeId);
        await pimPage.selecDropdownOption(pimPage.employeeSearchInformation.employmentStatus, Constants.pimModule.employeeStatus);
        await pimPage.fillTextBoxValues(pimPage.employeeSearchInformation.supervisorName, Constants.pimModule.nameTitle);
        await pimPage.selecDropdownOption(pimPage.employeeSearchInformation.supervisorName, Constants.pimModule.nameTitle);
        await pimPage.selecDropdownOption(pimPage.employeeSearchInformation.jobTitle, Constants.pimModule.jobTitle);
        await pimPage.selecDropdownOption(pimPage.employeeSearchInformation.subUnit, Constants.pimModule.subUnit);
        await pimPage.clickElementWithIndex(pimPage.save, 1);
    });

    test('Checking the checkbox and performing delete operation for the existing Employee Information', async () => {
        await pimPage.click(pimPage.attachmentCheckBox);
        await pimPage.deleteAttachedFile("save");
    });
});

test.describe('Search Employee Reports informations', () => {
    test('Filling Employee Reports and searching for the existing Employee Reports', async () => {
        await pimPage.clickReportsMenu();
        await pimPage.clickElementWithIndex(pimPage.save, 2);
        await pimPage.fillTextBoxValues(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearch);
        await pimPage.selecDropdownOption(pimPage.editEmployeeReports.displayFieldGroup, Constants.pimModule.displayFieldGroup);
        await pimPage.selecDropdownOption(pimPage.editEmployeeReports.displayField, Constants.pimModule.displayField);
        await pimPage.clickElementWithIndex(pimPage.save, 1);
        await pimPage.fillTextBoxValues(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearch);
        await pimPage.selecDropdownOption(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearch);
        await pimPage.clickElementWithIndex(pimPage.save, 1);
    });

    test('Checking the checkbox and performing edit operation for the existing Employee Information', async () => {
        await pimPage.click(pimPage.attachmentCheckBox);
        await pimPage.deleteAttachedFile("cancel");
        await pimPage.deleteAttachedFile("save");
    });

    test('Searching for the existing Employee Reports and editing Report', async () => {
        await pimPage.clearTextBoxValues(pimPage.searchEmployeeReports.reportNameSearch);
        await pimPage.fillTextBoxValues(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearch1);
        await pimPage.selecDropdownOption(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearch1);
        await pimPage.clickElementWithIndex(pimPage.save, 1);
        await pimPage.click(pimPage.attachmentCheckBox);
        await pimPage.click(pimPage.edit);
    });

    test('Editing the existing Report and Adding an Employee Name and verify the employee is added', async () => {
        await pimPage.clearTextBoxValues(pimPage.searchEmployeeReports.reportNameSearch);
        await pimPage.fillTextBoxValues(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearchEdit);
        await pimPage.selecDropdownOption(pimPage.editEmployeeReports.criteria, Constants.pimModule.criteria);
        await pimPage.clickElementWithIndex(pimPage.editEmployeeReports.addreport, 0);
        await pimPage.fillTextBoxValues(pimPage.employeeSearchInformation.employeeName, Constants.pimModule.employeeName1);
        await pimPage.selecDropdownOption(pimPage.employeeSearchInformation.employeeName, Constants.pimModule.employeeName1);
        await pimPage.selecDropdownOption(pimPage.editEmployeeReports.displayFieldGroup, Constants.pimModule.displayFieldGroup);
        await pimPage.click(pimPage.editEmployeeReports.editFields);
        await pimPage.selecDropdownOption(pimPage.editEmployeeReports.displayField, Constants.pimModule.displayField);
        await pimPage.clickElementWithIndex(pimPage.editEmployeeReports.addreport, 1);
        await pimPage.clickElementWithIndex(pimPage.save, 1);
    })
});