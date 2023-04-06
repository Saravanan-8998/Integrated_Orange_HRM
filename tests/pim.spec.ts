import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, PIMPage } from '../pageObjects';
import ENV from '../support/env';
import date from 'date-and-time';

let loginPage: LoginPage, homePage: HomePage, pimPage: PIMPage, testData: TestData, page: Page, utils: Utils;

const now = new Date();
const email1 = date.format(now, 'MMMDDS');
const email2 = date.format(now, 'DDS');

let nameValues = [Constants.Users.firstNameUser2, Constants.employeeDetails.middleName, Constants.Users.lastNameUser2, Constants.employeeDetails.employeeId];
let idValues = [Constants.employeeIDs.otherId, Constants.employeeIDs.driverLicenseNumber, Constants.employeeIDs.ssnNumber, Constants.employeeIDs.sinNumber];
let contactDetailValues = [Constants.EmployeeContactDetails.street1, Constants.EmployeeContactDetails.street2, Constants.EmployeeContactDetails.city, Constants.EmployeeContactDetails.state, Constants.EmployeeContactDetails.zip, Constants.EmployeeContactDetails.home, Constants.EmployeeContactDetails.mobile, Constants.EmployeeContactDetails.work, `${email1}@hrm.com`, `${email2}@hrm.com`];
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
    await utils.deleteUsersName(Constants.Users.testuserDelete1);
    await utils.deleteUsersName(Constants.Users.testuserDelete2);
    await utils.deleteUsers();
    await utils.createUsers(Constants.Users.firstNameUser1, Constants.Users.lastNameUser1, Constants.Users.userNameUser1);
    await utils.updatingUserRole(Constants.Users.userNameUser1, Constants.others.reportingMethodAdmin);
    await utils.logout();
    await loginPage.fillUsrNameAndPwdAndLogin(Constants.Users.userNameUser1, Constants.Users.password);
    await homePage.clickPIMMenu();
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Personal Informations', () => {
    test('Adding Employee section', async () => {
        await pimPage.clickAddEmployeeMenu();
        namesLocators = [pimPage.firstName, pimPage.middleName, pimPage.lastName];
        await utils.fillFieldValues(namesLocators, nameValues);
        await pimPage.clickSave(pimPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test.skip('Filling the Id section', async () => {
        await utils.fillFieldValues(idLocators, idValues);
        await utils.fillDateValue(pimPage.licenseExpiryDate, Constants.pimModule.licenseExpiryDate);
    });

    test('Filling the Personal Informations section', async () => {
        await page.waitForLoadState('networkidle');
        await utils.selecDropdownOption(Constants.Roles.option, pimPage.contactDetailsLocators.nationality, Constants.pimModule.nationality);
        await pimPage.selecDropdownOption(pimPage.maritalStatus, Constants.pimModule.maritalStatus);
        await utils.fillDateValue(pimPage.dateofBirth, Constants.pimModule.dateOfBirth);
        await pimPage.click(pimPage.gender);
        await utils.clickSave(pimPage.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
        await pimPage.selecDropdownOption(pimPage.bloodType, Constants.pimModule.bloodType);
        await utils.clickSave(pimPage.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Filling the Personal informations and verifying cancel button', async () => {
        await pimPage.uploadFile(Constants.fileName, false);
    });

    test('Filling the Personal informations and verifying save button', async () => {
        await pimPage.uploadFile(Constants.fileName, true);
        await utils.waitForElement(pimPage.table);
        let table = page.locator(pimPage.table);
        expect(table).toBeVisible();
    });

    test('Deleting the existing attachments', async () => {
        await pimPage.click(pimPage.attachmentCheckBox);
        await pimPage.deleteExistingFiles();
    });

    test('Uploading a new file and checking the checkbox and performing delete operation', async () => {
        await pimPage.uploadFile(Constants.fileName, true);
        await pimPage.deleteAttachedFile("cancel");
        await pimPage.deleteAttachedFile("save");
    });
});

test.describe('Filling Contact Informations', () => {
    test('Filling the Address section fields', async () => {
        await pimPage.clickMenu(pimPage.contactDetails, Constants.Menu.contactDetails);
        await utils.fillFieldValues(contactDetailsLocators, contactDetailValues);
        await pimPage.selecDropdownOption(pimPage.contactDetailsLocators.country, Constants.pimModule.country);
        await pimPage.clickSave(pimPage.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
    });
});

test.describe('Filling Emergency Contacts informations', () => {
    test('Filling Emergency Contacts informations', async () => {
        await pimPage.clickEmergencyContactsMenu();
        await pimPage.clickMenu(pimPage.emergencyContactDetails.emergencyContactMenuLink, Constants.Menu.emergencyContacts);
        await pimPage.clickElementWithIndex(pimPage.addButton, 0);
        await utils.fillFieldValues(emergencyContactLocators, emergencyContactValues);
        await pimPage.clickSave(pimPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
        await pimPage.clickElementWithIndex(pimPage.addButton, 1);
        await pimPage.uploadFile(Constants.fileName, true);
    });
});

test.describe('Filling Dependents informations', () => {
    test('Filling Dependents informations', async () => {
        await pimPage.clickMenu(pimPage.dependentsDetails.dependentsMenuLink, Constants.depedendant.dependents);
        await pimPage.clickElementWithIndex(pimPage.addButton, 0);
        await pimPage.clearTextBoxValues(pimPage.nameInputField);
        await pimPage.fillTextBoxValues(pimPage.nameInputField, Constants.pimModule.name);
        await pimPage.selecDropdownOption(pimPage.dependentsDetails.relationship, Constants.pimModule.relationship);
        await utils.fillDateValue(pimPage.dateofBirth, Constants.pimModule.depDateofBirth);
        await pimPage.clickSave(pimPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
        await pimPage.clickElementWithIndex(pimPage.addButton, 1);
        await pimPage.uploadFile(Constants.fileName, true);
    });
});

test.describe('Filling Job informations', () => {
    test('Filling Job informations', async () => {
        await pimPage.clickMenu(pimPage.jobDetails.jobMenuLink, Constants.adminModule.job.job);
        // await pimPage.selecDropdownOption(pimPage.jobDetails.jobTitle, Constants.pimModule.jobTitle);
        await pimPage.selecDropdownOption(pimPage.jobDetails.subUnit, Constants.pimModule.subUnit);
        // await pimPage.selecDropdownOption(pimPage.jobDetails.employeeStatus, Constants.pimModule.employeeStatus);
        await pimPage.clickSave(pimPage.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
    });
});

test.describe('Filling Report-To informations', () => {
    test('Filling Report-To informations', async () => {
        await pimPage.clickMenu(pimPage.reportToDetails.reportToMenuLink, Constants.Menu.reportTo);
        await pimPage.clickElementWithIndex(pimPage.addButton, 0);
        await pimPage.fillTextBoxValues(pimPage.reportToDetails.nameTitle, Constants.pimModule.nameTitle);
        await pimPage.selecDropdownOption(pimPage.reportToDetails.nameTitle, Constants.pimModule.nameTitle);
        await pimPage.selecDropdownOption(pimPage.reportToDetails.reportingMethod, Constants.pimModule.reportingMethod);
        await pimPage.clickSave(pimPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
    });
});

test.describe('Search Employee List informations', () => {
    test('Filling Employee informations and searching for the existing Employee', async () => {
        await pimPage.clickEmployeeListMenu();
        await pimPage.fillTextBoxValues(pimPage.employeeSearchInformation.employeeName, Constants.Users.employeeNameUser2);
        await pimPage.selecDropdownOption(pimPage.employeeSearchInformation.employeeName, Constants.Users.employeeNameUser2);
        // await pimPage.fillTextBoxValues(pimPage.employeeSearchInformation.employeeId, Constants.pimModule.employeeId);
        // await pimPage.selecDropdownOption(pimPage.employeeSearchInformation.employmentStatus, Constants.pimModule.employeeStatus);
        await pimPage.fillTextBoxValues(pimPage.employeeSearchInformation.supervisorName, Constants.pimModule.nameTitle);
        await pimPage.selecDropdownOption(pimPage.employeeSearchInformation.supervisorName, Constants.pimModule.nameTitle);
        // await pimPage.selecDropdownOption(pimPage.employeeSearchInformation.jobTitle, Constants.pimModule.jobTitle);
        await pimPage.selecDropdownOption(pimPage.employeeSearchInformation.subUnit, Constants.pimModule.subUnit);
        await pimPage.clickElementWithIndex(pimPage.search, 0);
    });

    test('Checking the checkbox and performing delete operation for the existing Employee Information', async () => {
        await pimPage.click(pimPage.attachmentCheckBox);
        await pimPage.deleteAttachedFile("save");
    });
});

test.describe('Search Employee Reports informations', () => {
    test('Filling Employee Reports and searching for the existing Employee Reports', async () => {
        await pimPage.clickReportsMenu();
        await pimPage.clickElementWithIndex(pimPage.add, 0);
        await pimPage.fillTextBoxValues(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearch);
        await pimPage.selecDropdownOption(pimPage.editEmployeeReports.displayFieldGroup, Constants.pimModule.displayFieldGroup);
        await pimPage.selecDropdownOption(pimPage.editEmployeeReports.displayField, Constants.pimModule.displayField);
        await pimPage.click(pimPage.addDisplayField);
        await pimPage.clickElementWithIndex(pimPage.save, 0);
        await pimPage.clickReportsMenu();
        await pimPage.fillTextBoxValues(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearch);
        await pimPage.selecDropdownOption(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearch);
        await pimPage.clickElementWithIndex(pimPage.search, 0);
    });

    test('Checking the checkbox and performing edit operation for the existing Employee Information', async () => {
        await pimPage.click(pimPage.attachmentCheckBox);
        await pimPage.deleteAttachedFile("cancel");
        await pimPage.deleteAttachedFile("save");
    });

    test('Searching for the existing Employee Reports and editing Report', async () => {
        await pimPage.clickReportsMenu();
        await pimPage.clickElementWithIndex(pimPage.add, 0);
        await pimPage.fillTextBoxValues(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearch);
        await pimPage.selecDropdownOption(pimPage.editEmployeeReports.displayFieldGroup, Constants.pimModule.displayFieldGroup);
        await pimPage.selecDropdownOption(pimPage.editEmployeeReports.displayField, Constants.pimModule.displayField);
        await pimPage.click(pimPage.addDisplayField);
        await pimPage.clickElementWithIndex(pimPage.save, 0);
        await pimPage.clickReportsMenu();
        await pimPage.clearTextBoxValues(pimPage.searchEmployeeReports.reportNameSearch);
        await pimPage.fillTextBoxValues(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearch);
        await pimPage.selecDropdownOption(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearch);
        await pimPage.clickElementWithIndex(pimPage.search, 0);
        await pimPage.click(pimPage.attachmentCheckBox);
        await pimPage.click(pimPage.edit);
    });

    test('Editing the existing Report and Adding an Employee Name and verify the employee is added', async () => {
        await page.waitForLoadState('load');
        await pimPage.fillTextBoxValues(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearchEdit);
        await pimPage.selecDropdownOption(pimPage.editEmployeeReports.criteria, Constants.pimModule.criteria);
        await pimPage.clickElementWithIndex(pimPage.editEmployeeReports.addreport, 0);
        await pimPage.fillTextBoxValues(pimPage.employeeSearchInformation.employeeName, Constants.pimModule.employeeName1);
        await pimPage.selecDropdownOption(pimPage.employeeSearchInformation.employeeName, Constants.pimModule.employeeName1);
        await pimPage.selecDropdownOption(pimPage.editEmployeeReports.displayFieldGroup, Constants.pimModule.displayFieldGroup);
        await pimPage.click(pimPage.editEmployeeReports.editFields);
        await pimPage.selecDropdownOption(pimPage.editEmployeeReports.displayField, Constants.pimModule.displayField);
        await pimPage.clickElementWithIndex(pimPage.editEmployeeReports.addreport, 1);
        await pimPage.clickElementWithIndex(pimPage.save, 0);
        await pimPage.clickReportsMenu();
        await pimPage.fillTextBoxValues(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearchEdit);
        await pimPage.selecDropdownOption(pimPage.searchEmployeeReports.reportNameSearch, Constants.pimModule.reportNameSearchEdit);
        await pimPage.clickElementWithIndex(pimPage.search, 0);
        await pimPage.click(pimPage.attachmentCheckBox);
        await pimPage.deleteAttachedFile("delete");
    })
});