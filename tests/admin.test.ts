import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, AdminPage } from '../pageObjects';
import ENV from '../support/env';
import { Utils } from '../support/utils';
import date from 'date-and-time';

let loginPage: LoginPage, homePage: HomePage, adminPage: AdminPage, testData: TestData, page: Page, utils: Utils;;

const now = new Date();
// const AddDays = date.addDays(now, 1);
const germanDate = date.format(now, 'YYYY-MM-DD');
const usDate = date.format(now, 'DD-MM-YYYY');

let systemUsersLocators = [];
let systemUsersLocatorsValues = [Constants.adminModule.userName, Constants.adminModule.employeeName];

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    adminPage = new AdminPage(page);
    testData = new TestData(page);
    systemUsersLocators = [adminPage.userManagementLocators.userName, adminPage.userManagementLocators.employeeName];
    await loginPage.getBaseURL();
    await expect(page).toHaveURL(/.*login/);
    let pass = await testData.encodeDecodePassword();
    await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
    await utils.clickMenu("link", homePage.homePageElements.admin, "Admin");
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Filling Admin Information and editing the information', () => {
    test('Searching Admin Information', async () => {
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.userManagementMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.userDropDownMenu, 0);
        await adminPage.fillFieldValues(systemUsersLocators, systemUsersLocatorsValues);
        await adminPage.selecDropdownOption(adminPage.userManagementLocators.employeeName, Constants.adminModule.employeeName);
        await adminPage.selecDropdownOption(adminPage.userManagementLocators.userRole, Constants.adminModule.userRole);
        await adminPage.selecDropdownOption(adminPage.userManagementLocators.status, Constants.adminModule.status);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 1);
        let table = await page.locator(adminPage.tableRow).textContent();
        console.log(table);
        // expect(table).toBe(`AdminAdminPaul CollingsEnabled`)
        let record = await page.locator(adminPage.recordsCount).textContent();
        console.log(record);
        expect(record).toBe(`(1) Record Found`);
    });

    test('Filtering Results and Editing the Existing Information', async () => {
        await adminPage.click(adminPage.edit);
        await page.waitForTimeout(2000);
        await adminPage.clearTextBoxValues(adminPage.userManagementLocators.userName);
        await adminPage.clearTextBoxValues(adminPage.userManagementLocators.employeeName);
        await adminPage.fillTextBoxValues(adminPage.userManagementLocators.userName, Constants.adminModule.userManagement.userName);
        await adminPage.fillTextBoxValues(adminPage.userManagementLocators.employeeName, Constants.adminModule.userManagement.employeeName);
        await adminPage.selecDropdownOption(adminPage.userManagementLocators.employeeName, Constants.adminModule.userManagement.employeeName);
        await adminPage.selecDropdownOption(adminPage.userManagementLocators.userRole, Constants.adminModule.userRole);
        await adminPage.selecDropdownOption(adminPage.userManagementLocators.status, Constants.adminModule.status);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 1);
    });
});

test.describe('Filling Job Information and editing the information', () => {
    test('Adding Job Titles Information and saving', async () => {
        await page.waitForTimeout(5000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.jobTitlesDropDownMenu, 0);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.jobLocators.jobTitle, Constants.adminModule.job.jobTitle);
        await adminPage.fillTextBoxValues(adminPage.jobLocators.jobDescription, Constants.adminModule.job.jobDescription);
        await adminPage.fillTextBoxValues(adminPage.note, Constants.adminModule.job.note);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Editing the Existing Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.jobTitlesDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.editRow(Constants.adminModule.job.jobTitle);
        await adminPage.clearTextBoxValues(adminPage.jobLocators.jobTitle);
        await adminPage.fillTextBoxValues(adminPage.jobLocators.jobTitle, Constants.adminModule.edit);
        await adminPage.clearTextBoxValues(adminPage.jobLocators.jobDescription);
        await adminPage.fillTextBoxValues(adminPage.jobLocators.jobDescription, Constants.adminModule.job.jobDescriptionEdited);
        await adminPage.clearTextBoxValues(adminPage.note);
        await adminPage.fillTextBoxValues(adminPage.note, Constants.adminModule.job.noteEdited);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.jobTitlesDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', Constants.adminModule.job.deleteEditedRecord);
    });
});

test.describe('Filling Pay Grades and editing the information', () => {
    test('Adding Pay Grades Information and saving', async () => {
        await page.waitForTimeout(5000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.payGradesDropDownMenu, 0);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.payGradeLocators.payGradeName, Constants.adminModule.payGradeName);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 1);
    });

    test('Editing the Existing Pay Grades Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.payGradesDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.editRow('Grade 0');
        await adminPage.clearTextBoxValues(adminPage.payGradeLocators.payGradeName);
        await adminPage.fillTextBoxValues(adminPage.payGradeLocators.payGradeName, Constants.adminModule.edit);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 1);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 2);
        await page.waitForTimeout(3000);
        await adminPage.selecDropdownOption(adminPage.payGradeLocators.currency, Constants.adminModule.currency);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.payGradeLocators.minSalary, Constants.adminModule.minSalary);
        await adminPage.fillTextBoxValues(adminPage.payGradeLocators.maxSalary, Constants.adminModule.maxSalary);
        await adminPage.clickSave(adminPage.actionButton, 3, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Deleting the Existing Pay Grades Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.payGradesDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', Constants.adminModule.deletePayGradeRecord);
    });
});

test.describe('Filling Employment Status and editing the information', () => {
    test('Adding Employment Status Information and saving', async () => {
        await page.waitForTimeout(5000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.employeeStatusDropDownMenu, 0);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await page.waitForTimeout(5000);
        await adminPage.fillTextBoxValues(adminPage.empStatusLocators.empStatusName, Constants.adminModule.employeeStatusName);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Editing the Existing Employment Status Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.employeeStatusDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.editRow(Constants.adminModule.employeeStatusName);
        await adminPage.clearTextBoxValues(adminPage.empStatusLocators.empStatusName);
        await adminPage.fillTextBoxValues(adminPage.empStatusLocators.empStatusName, Constants.adminModule.edit);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Employment Status Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.employeeStatusDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', Constants.adminModule.deleteemployeeStatusEditedRecord);
    });
});

test.describe('Filling Job Categories and editing the information', () => {
    test('Adding Job Categories Information and saving', async () => {
        await page.waitForTimeout(5000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.jobCategoriesDropDownMenu, 0);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await page.waitForTimeout(5000);
        await adminPage.fillTextBoxValues(adminPage.jobCatLocators.jobCatName, Constants.adminModule.jobCategory);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Editing the Existing Job Categories Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.jobCategoriesDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.editRow('On Bench');
        await adminPage.clearTextBoxValues(adminPage.jobCatLocators.jobCatName);
        await adminPage.fillTextBoxValues(adminPage.jobCatLocators.jobCatName, Constants.adminModule.edit);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Job Categories Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.jobCategoriesDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', Constants.adminModule.deletejobCategory);
    });
});

test.describe('Filling Work Shifts and editing the information', () => {
    test('Adding Work Shifts Information and saving', async () => {
        await page.waitForTimeout(5000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.workShiftsDropDownMenu, 0);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await page.waitForTimeout(5000);
        await adminPage.fillTextBoxValues(adminPage.workShiftsLocators.shiftName, Constants.adminModule.workShifts.shiftName);
        await adminPage.fillDateValue(adminPage.workShiftsLocators.fromTime, Constants.adminModule.workShifts.fromTime);
        await adminPage.fillDateValue(adminPage.workShiftsLocators.toTime, Constants.adminModule.workShifts.toTime);
        await adminPage.fillTextBoxValues(adminPage.workShiftsLocators.assignedEmployees, Constants.adminModule.workShifts.assignedEmployees);
        await adminPage.selecDropdownOption(adminPage.workShiftsLocators.assignedEmployees, Constants.adminModule.workShifts.assignedEmployees);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Editing the Existing Work Shifts Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.workShiftsDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.editRow(Constants.adminModule.workShifts.shiftName);
        await adminPage.clearTextBoxValues(adminPage.workShiftsLocators.shiftName);
        await adminPage.fillTextBoxValues(adminPage.workShiftsLocators.shiftName, Constants.adminModule.edit);
        await adminPage.fillDateValue(adminPage.workShiftsLocators.fromTime, Constants.adminModule.workShifts.fromTimeEdit);
        await adminPage.fillDateValue(adminPage.workShiftsLocators.toTime, Constants.adminModule.workShifts.toTimeEdit);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Work Shifts Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.workShiftsDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', Constants.adminModule.workShifts.deleteWorkShift);
    });
});

test.describe('Filling Organization General Information and editing the information', () => {
    test('Editing existing General Information and Saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.generalInfoDropDownMenu, 0);
        await adminPage.click(adminPage.organizationLocators.editSwitch);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.orgName, Constants.adminModule.organization.orgName);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.regNumber, Constants.adminModule.organization.regNumber);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.taxID, Constants.adminModule.organization.taxID);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.phone, Constants.adminModule.organization.phone);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.fax, Constants.adminModule.organization.fax);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.email, Constants.adminModule.organization.email);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.adrStreet1, Constants.adminModule.organization.adrStreet1);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.adrStreet2, Constants.adminModule.organization.adrStreet2);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.city, Constants.adminModule.organization.city);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.state, Constants.adminModule.organization.state);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.zipCode, Constants.adminModule.organization.zipCode);
        await adminPage.selecDropdownOption(adminPage.organizationLocators.country, Constants.adminModule.organization.country);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.notes, Constants.adminModule.organization.notes);
        await adminPage.clickSave(adminPage.actionButton, 0, Constants.sucessMsg.successfulUpdatedMsg);
    });
});

test.describe('Filling Organization Locations Information and editing the information', () => {
    test('Adding Locations Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.locationsDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 2);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.name, Constants.adminModule.locations.name);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.city, Constants.adminModule.locations.city);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.state, Constants.adminModule.locations.state);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.zipCode, Constants.adminModule.locations.zipCode);
        await adminPage.selecDropdownOption(adminPage.locationsLocator.country, Constants.adminModule.locations.country);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.phone, Constants.adminModule.locations.phone);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.fax, Constants.adminModule.locations.fax);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.address, Constants.adminModule.locations.address);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.notes, Constants.adminModule.locations.notes);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Locations by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.locationsDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.name, Constants.adminModule.locations.name);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.city, Constants.adminModule.locations.city);
        await adminPage.selecDropdownOption(adminPage.locationsLocator.country, Constants.adminModule.locations.country);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 1);
        let record = await page.locator(adminPage.recordsCount).textContent();
        console.log(record);
        expect(record).toBe(Constants.assertion.totalRecords);

        await adminPage.editRow(Constants.adminModule.locations.name);
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.name, Constants.adminModule.locations.nameEdited);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.city, Constants.adminModule.locations.cityEdited);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.state, Constants.adminModule.locations.stateEdited);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.zipCode, Constants.adminModule.locations.zipCode);
        await adminPage.selecDropdownOption(adminPage.locationsLocator.country, Constants.adminModule.locations.country);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.phone, Constants.adminModule.locations.phone);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.fax, Constants.adminModule.locations.fax);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.address, Constants.adminModule.locations.addressEdited);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.note, Constants.adminModule.locations.notesEdited);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Locations Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.locationsDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.name, Constants.adminModule.locations.nameEdited);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.city, Constants.adminModule.locations.city);
        await adminPage.selecDropdownOption(adminPage.locationsLocator.country, Constants.adminModule.locations.country);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 1);
        let record = await page.locator(adminPage.recordsCount).textContent();
        console.log(record);
        expect(record).toBe(Constants.assertion.totalRecords);
        await adminPage.deleteFileRecord('delete', Constants.adminModule.locations.nameEdited);
    });
});

test.describe('Filling Organization Structure Information and editing the information', () => {
    test('Adding Structure Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.structureDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.click(adminPage.organizationLocators.editSwitch);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await page.waitForSelector(`div[role='document']`);
        await adminPage.fillTextBoxValues(adminPage.structureLocator.unitID, Constants.adminModule.structure.unitID);
        await adminPage.fillTextBoxValues(adminPage.structureLocator.name, Constants.adminModule.structure.name);
        await adminPage.fillTextBoxValues(adminPage.structureLocator.description, Constants.adminModule.structure.description);
        await adminPage.clickSave(adminPage.actionButton, 2, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Editing Structure Information to already created Structure', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.structureDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.click(adminPage.organizationLocators.editSwitch);
        await adminPage.editRowStructure(Constants.adminModule.structure.name);
        await page.waitForSelector(`div[role='document']`);
        await adminPage.fillTextBoxValues(adminPage.structureLocator.unitID, Constants.adminModule.structure.unitID1);
        await page.waitForTimeout(2000);
        await adminPage.fillTextBoxValues(adminPage.structureLocator.name, Constants.adminModule.structure.nameEdited);
        await adminPage.fillTextBoxValues(adminPage.structureLocator.description, Constants.adminModule.structure.descriptionEdited);
        await adminPage.clickSave(adminPage.actionButton, 2, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Adding Sub Structure Information to already created Structure', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.structureDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.click(adminPage.organizationLocators.editSwitch);
        await adminPage.addSubRowStructure(Constants.adminModule.structure.nameEdited);
        await adminPage.fillTextBoxValues(adminPage.structureLocator.unitID, Constants.adminModule.structure.unitID1);
        await adminPage.fillTextBoxValues(adminPage.structureLocator.name, Constants.adminModule.structure.nameAdd);
        await adminPage.fillTextBoxValues(adminPage.structureLocator.description, Constants.adminModule.structure.descriptionAdd);
        await adminPage.clickSave(adminPage.actionButton, 2, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Deleting Structure Information to already created Structure', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.structureDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.click(adminPage.organizationLocators.editSwitch);
        await adminPage.deleteFileStructure('structure', Constants.adminModule.structure.deleteStructure);
    });
});

test.describe('Filling Qualifications Information and editing the information', () => {
    test('Adding Skills Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.skillsDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.skillsLocator.name, Constants.adminModule.skills.name);
        await adminPage.fillTextBoxValues(adminPage.skillsLocator.description, Constants.adminModule.skills.description);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Skills by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.skillsDropDownMenu, 0);
        await page.waitForTimeout(3000);

        await adminPage.editRow(Constants.adminModule.skills.name);
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.skillsLocator.name, Constants.adminModule.skills.nameEdited);
        await adminPage.fillTextBoxValues(adminPage.skillsLocator.description, Constants.adminModule.skills.descriptionEdited);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Skills Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.skillsDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', Constants.adminModule.skills.nameEdited);
    });
});

test.describe('Filling Qualifications Information and editing the information', () => {
    test('Adding Education Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.educationDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.educationLocator.level, Constants.adminModule.level);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Education by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.educationDropDownMenu, 0);
        await page.waitForTimeout(3000);

        await adminPage.editRow(Constants.adminModule.level);
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.educationLocator.level, Constants.adminModule.level1);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Education Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.educationDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', Constants.adminModule.level1);
    });
});

test.describe('Filling Qualifications Information and editing the information', () => {
    test('Adding Licenses Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.licensesDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.licenseLocator.name, Constants.adminModule.license);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Licenses by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.licensesDropDownMenu, 0);
        await page.waitForTimeout(3000);

        await adminPage.editRow(Constants.adminModule.license);
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.licenseLocator.name, Constants.adminModule.license1);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Licenses Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.licensesDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', Constants.adminModule.license1);
    });
});

test.describe('Filling Qualifications Information and editing the information', () => {
    test('Adding Languages Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.languagesDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.languageLocator.name, Constants.adminModule.langName);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Languages by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.languagesDropDownMenu, 0);
        await page.waitForTimeout(3000);

        await adminPage.editRow(Constants.adminModule.langName);
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.languageLocator.name, Constants.adminModule.langName1);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Languages Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.languagesDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', Constants.adminModule.langName1);
    });
});

test.describe('Filling Qualifications Information and editing the information', () => {
    test('Adding Membership Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.membershipsDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.membershipLocator.name, Constants.adminModule.membershipName);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Membership by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.membershipsDropDownMenu, 0);
        await page.waitForTimeout(3000);

        await adminPage.editRow(Constants.adminModule.membershipName);
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.membershipLocator.name, Constants.adminModule.membershipName1);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Membership Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.membershipsDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', Constants.adminModule.membershipName1);
    });
});

test.describe('Filling Nationalities Information and editing the information', () => {
    test('Adding Nationalities Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.nationalitiesMenu);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.membershipLocator.name, Constants.adminModule.membershipName2);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Nationalities by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.nationalitiesMenu);
        await page.waitForTimeout(3000);

        await adminPage.editRow(Constants.adminModule.membershipName2);
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.membershipLocator.name, Constants.adminModule.membershipName3);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Nationalities Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.nationalitiesMenu);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', Constants.adminModule.membershipName3);
    });
});

test.describe('Modifying Corporate Branding Information and saving the information', () => {
    test('Editing Corporate Branding Color Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.corpBrandingMenu);
        await page.waitForTimeout(3000);
        await adminPage.click(adminPage.corpBrandingLocator.primaryColor);
        await adminPage.fillTextBoxValues(adminPage.corpBrandingLocator.hex, Constants.adminModule.hex.primaryColor);
        await adminPage.click(adminPage.corpBrandingLocator.secondaryColor);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.corpBrandingLocator.hex, Constants.adminModule.hex.secondaryColor);
        await adminPage.click(adminPage.corpBrandingLocator.primaryFontColor);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.corpBrandingLocator.hex, Constants.adminModule.hex.primaryFontColor);
        await adminPage.click(adminPage.corpBrandingLocator.secondaryFontColor);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.corpBrandingLocator.hex, Constants.adminModule.hex.secondaryFontColor);
        await adminPage.click(adminPage.corpBrandingLocator.primaryGradientColor1);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.corpBrandingLocator.hex, Constants.adminModule.hex.primaryGradientColor1);
        await adminPage.click(adminPage.corpBrandingLocator.primaryGradientColor2);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.corpBrandingLocator.hex, Constants.adminModule.hex.primaryGradientColor2);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 1);
        await page.waitForTimeout(5000);
        await adminPage.clickSave(adminPage.actionButton, 2, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Editing Corporate Branding CLient Logo and Banner Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.corpBrandingMenu);
        await page.waitForTimeout(3000);
        await page.waitForSelector(`div.orangehrm-card-container`);
        await adminPage.bannerUploadFile(Constants.adminModule.upload.fileName.name1, Constants.adminModule.upload.clientLogo);
        await adminPage.bannerUploadFile(Constants.adminModule.upload.fileName.name2, Constants.adminModule.upload.clientBanner);
        await adminPage.bannerUploadFile(Constants.adminModule.upload.fileName.name3, Constants.adminModule.upload.loginBanner);
        await adminPage.clickSave(adminPage.actionButton, 2, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Resetting to Default Corporate Branding Information and publishing', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.corpBrandingMenu);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
    });
});

test.describe('Modifying Configuration Information and saving the changes', () => {
    test('Configuring Email Configuration and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.configurationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.emailConfigurationDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.fillTextBoxValues(adminPage.configurationLocators.mailSentAs, Constants.adminModule.mailSentAs);
        await adminPage.click(adminPage.configurationLocators.secureSMTP);
        await adminPage.click(adminPage.configurationLocators.sMTP);
        await adminPage.click(adminPage.configurationLocators.sendMail);
        await adminPage.click(adminPage.configurationLocators.sendTestMail);
        await adminPage.click(adminPage.configurationLocators.sendTestMail);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Resetting Email Configuration and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.configurationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.emailConfigurationDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.configurationLocators.mailSentAs, Constants.adminModule.mailSentAs1);
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });
});

test.describe('Modifying Email Subscriptions and saving the changes', () => {
    test('Configuring Email Subscriptions and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.configurationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.emailSubscriptionsDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.clickSave(adminPage.configurationLocators.leaveApplications, 0, Constants.sucessMsg.successfulUpdatedMsg);
        await adminPage.addPerson(Constants.adminModule.emailSub);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.name, Constants.adminModule.nameSub);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.email, Constants.adminModule.testEmailSub);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 2);
    });

    test('Deleting Existing Email Subscriptions and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.configurationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.emailSubscriptionsDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickSave(adminPage.configurationLocators.leaveApplications, 0, Constants.sucessMsg.successfulUpdatedMsg);
        await adminPage.addPerson(Constants.adminModule.emailSub);
        await adminPage.deleteFileRecord('delete', Constants.adminModule.nameSub);
    });
});

test.describe('Modifying Localization and saving the changes', () => {
    test('Configuring Localization and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.configurationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.localizationDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.selecDropdownOption(adminPage.configurationLocators.language, Constants.adminModule.localization.language);
        await adminPage.selecDropdownOption(adminPage.configurationLocators.dateFormat, `dd-mm-yyyy ( ${usDate} )`);
        await adminPage.clickSave(adminPage.actionButton, 0, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Resetting Existing Localization and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.germanconfigurationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.germanLocalizationDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.selecDropdownOption(adminPage.configurationLocators.germanlanguage, Constants.adminModule.localization.germanlanguage);
        await adminPage.selecDropdownOption(adminPage.configurationLocators.germandateFormat, `yyyy-mm-dd ( ${germanDate} )`);
        await adminPage.clickSave(adminPage.actionButton, 0, Constants.sucessMsg.germansuccessfulUpdatedMsg);
    });
});