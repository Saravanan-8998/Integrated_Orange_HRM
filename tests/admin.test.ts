import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, AdminPage } from '../pageObjects';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, adminPage: AdminPage, testData: TestData, page: Page;

enum values1 {
    userName = "Admin",
    userRole = "Admin",
    employeeName = "Paul Colling",
    status = "Enabled",
}

let systemUsersLocators = [];
let systemUsersLocatorsValues = [values1.userName, values1.employeeName];

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
    await expect(page).toHaveURL(/.*dashboard/);
    await page.waitForSelector(homePage.dashboardGrid);
    await homePage.clickAdminMenu();
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Filling Admin Information and editing the information', () => {
    test('Searching Admin Information', async () => {
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.userManagementMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.userDropDownMenu, 0);
        await adminPage.fillFieldValues(systemUsersLocators, systemUsersLocatorsValues);
        await adminPage.selecDropdownOption(adminPage.userManagementLocators.employeeName, 'Paul Collings');
        await adminPage.selecDropdownOption(adminPage.userManagementLocators.userRole, values1.userRole);
        await adminPage.selecDropdownOption(adminPage.userManagementLocators.status, values1.status);
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
        await adminPage.fillTextBoxValues(adminPage.userManagementLocators.userName, 'AdminTesting');
        await adminPage.fillTextBoxValues(adminPage.userManagementLocators.employeeName, 'Paul Colling');
        await adminPage.selecDropdownOption(adminPage.userManagementLocators.employeeName, 'Paul Collings');
        await adminPage.selecDropdownOption(adminPage.userManagementLocators.userRole, values1.userRole);
        await adminPage.selecDropdownOption(adminPage.userManagementLocators.status, values1.status);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 1);
    });
});

test.describe('Filling Job Information and editing the information', () => {
    test('Adding Job Titles Information and saving', async () => {
        await page.waitForTimeout(5000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.jobTitlesDropDownMenu, 0);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.jobLocators.jobTitle, 'Automation Engineer');
        await adminPage.fillTextBoxValues(adminPage.jobLocators.jobDescription, 'Testing 123 Sample');
        await adminPage.fillTextBoxValues(adminPage.note, 'Automation Engineer Note Added');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Editing the Existing Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.jobTitlesDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.editRow('Automation Engineer');
        await adminPage.clearTextBoxValues(adminPage.jobLocators.jobTitle);
        await adminPage.fillTextBoxValues(adminPage.jobLocators.jobTitle, ' Edited');
        await adminPage.clearTextBoxValues(adminPage.jobLocators.jobDescription);
        await adminPage.fillTextBoxValues(adminPage.jobLocators.jobDescription, 'Testing 123 Sample Edited');
        await adminPage.clearTextBoxValues(adminPage.note);
        await adminPage.fillTextBoxValues(adminPage.note, 'Automation Engineer Note Added and Edited');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.jobTitlesDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', 'Automation Engineer Edited');
    });
});

test.describe('Filling Pay Grades and editing the information', () => {
    test('Adding Pay Grades Information and saving', async () => {
        await page.waitForTimeout(5000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.payGradesDropDownMenu, 0);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.payGradeLocators.payGradeName, 'Grade 0');
        await adminPage.clickElementWithIndex(adminPage.actionButton, 1);
    });

    test('Editing the Existing Pay Grades Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.payGradesDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.editRow('Grade 0');
        await adminPage.clearTextBoxValues(adminPage.payGradeLocators.payGradeName);
        await adminPage.fillTextBoxValues(adminPage.payGradeLocators.payGradeName, ' Edited');
        await adminPage.clickElementWithIndex(adminPage.actionButton, 1);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 2);
        await page.waitForTimeout(3000);
        await adminPage.selecDropdownOption(adminPage.payGradeLocators.currency, 'INR - Indian Rupee');
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.payGradeLocators.minSalary, '20000');
        await adminPage.fillTextBoxValues(adminPage.payGradeLocators.maxSalary, '25000');
        await adminPage.clickSave(adminPage.actionButton, 3, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Deleting the Existing Pay Grades Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.payGradesDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', 'Grade 0 Edited');
    });
});

test.describe('Filling Employment Status and editing the information', () => {
    test('Adding Employment Status Information and saving', async () => {
        await page.waitForTimeout(5000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.employeeStatusDropDownMenu, 0);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await page.waitForTimeout(5000);
        await adminPage.fillTextBoxValues(adminPage.empStatusLocators.empStatusName, 'Full-Time Automation');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Editing the Existing Employment Status Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.employeeStatusDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.editRow('Full-Time Automation');
        await adminPage.clearTextBoxValues(adminPage.empStatusLocators.empStatusName);
        await adminPage.fillTextBoxValues(adminPage.empStatusLocators.empStatusName, ' Edited');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Employment Status Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.employeeStatusDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', 'Full-Time Automation Edited');
    });
});

test.describe('Filling Job Categories and editing the information', () => {
    test('Adding Job Categories Information and saving', async () => {
        await page.waitForTimeout(5000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.jobCategoriesDropDownMenu, 0);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await page.waitForTimeout(5000);
        await adminPage.fillTextBoxValues(adminPage.jobCatLocators.jobCatName, 'On Bench');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Editing the Existing Job Categories Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.jobCategoriesDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.editRow('On Bench');
        await adminPage.clearTextBoxValues(adminPage.jobCatLocators.jobCatName);
        await adminPage.fillTextBoxValues(adminPage.jobCatLocators.jobCatName, ' Edited');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Job Categories Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.jobCategoriesDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', 'On Bench Edited');
    });
});

test.describe('Filling Work Shifts and editing the information', () => {
    test('Adding Work Shifts Information and saving', async () => {
        await page.waitForTimeout(5000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.workShiftsDropDownMenu, 0);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await page.waitForTimeout(5000);
        await adminPage.fillTextBoxValues(adminPage.workShiftsLocators.shiftName, 'Lunch Time');
        await adminPage.fillDateValue(adminPage.workShiftsLocators.fromTime, '01:00 PM');
        await adminPage.fillDateValue(adminPage.workShiftsLocators.toTime, '02:00 PM');
        await adminPage.fillTextBoxValues(adminPage.workShiftsLocators.assignedEmployees, 'Cecil');
        await adminPage.selecDropdownOption(adminPage.workShiftsLocators.assignedEmployees, 'Cecil  Bonaparte');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Editing the Existing Work Shifts Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.workShiftsDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.editRow('Lunch Time');
        await adminPage.clearTextBoxValues(adminPage.workShiftsLocators.shiftName);
        await adminPage.fillTextBoxValues(adminPage.workShiftsLocators.shiftName, ' Edited');
        await adminPage.fillDateValue(adminPage.workShiftsLocators.fromTime, '02:00 PM');
        await adminPage.fillDateValue(adminPage.workShiftsLocators.toTime, '03:00 PM');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Work Shifts Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.jobMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.workShiftsDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', 'Lunch Time Edited');
    });
});

test.describe('Filling Organization General Information and editing the information', () => {
    test('Editing existing General Information and Saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.generalInfoDropDownMenu, 0);
        await adminPage.click(adminPage.organizationLocators.editSwitch);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.orgName, 'OrangeHRM Edited');
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.regNumber, '10101');
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.taxID, 'DGI999');
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.phone, '9999966666');
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.fax, '6666699999');
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.email, 'infoedited@orangehrm.com');
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.adrStreet1, 'PUL');
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.adrStreet2, 'RAM');
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.city, 'CBE');
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.state, 'TN');
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.zipCode, '045');
        await adminPage.selecDropdownOption(adminPage.organizationLocators.country, 'India');
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.notes, 'HRM Software Edited');
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
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.name, 'Atmecs R&D');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.city, 'Texas');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.state, 'TX ');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.zipCode, '045');
        await adminPage.selecDropdownOption(adminPage.locationsLocator.country, 'India');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.phone, '9999966666');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.fax, '6666699999');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.address, 'PUL');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.notes, 'HRM Software');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Locations by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.locationsDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.name, 'Atmecs R&D');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.city, 'Texas');
        await adminPage.selecDropdownOption(adminPage.locationsLocator.country, 'India');
        await adminPage.clickElementWithIndex(adminPage.actionButton, 1);
        let record = await page.locator(adminPage.recordsCount).textContent();
        console.log(record);
        expect(record).toBe(`(1) Record Found`);

        await adminPage.editRow('Atmecs R&D');
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.name, 'Atmecs R&D Edited');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.city, 'Texas Edited');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.state, 'TX Edited');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.zipCode, '045');
        await adminPage.selecDropdownOption(adminPage.locationsLocator.country, 'India');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.phone, '9999966666');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.fax, '6666699999');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.address, 'PUL Edited');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.note, 'HRM Software Edited');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Locations Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.locationsDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.name, 'Atmecs R&D Edited');
        await adminPage.fillTextBoxValues(adminPage.locationsLocator.city, 'Texas');
        await adminPage.selecDropdownOption(adminPage.locationsLocator.country, 'India');
        await adminPage.clickElementWithIndex(adminPage.actionButton, 1);
        let record = await page.locator(adminPage.recordsCount).textContent();
        console.log(record);
        expect(record).toBe(`(1) Record Found`);
        await adminPage.deleteFileRecord('delete', 'Atmecs R&D Edited');
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
        await adminPage.fillTextBoxValues(adminPage.structureLocator.unitID, '007');
        await adminPage.fillTextBoxValues(adminPage.structureLocator.name, 'Playwright Automation');
        await adminPage.fillTextBoxValues(adminPage.structureLocator.description, 'Playwright Engineer 123 Testing');
        await adminPage.clickSave(adminPage.actionButton, 2, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Editing Structure Information to already created Structure', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.structureDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.click(adminPage.organizationLocators.editSwitch);
        await adminPage.editRowStructure('Playwright Automation');
        await page.waitForSelector(`div[role='document']`);
        await adminPage.fillTextBoxValues(adminPage.structureLocator.unitID, '0077');
        await page.waitForTimeout(2000);
        await adminPage.fillTextBoxValues(adminPage.structureLocator.name, 'Quality Engineering Edited');
        await adminPage.fillTextBoxValues(adminPage.structureLocator.description, 'Quality Engineering 123 Testing Edited');
        await adminPage.clickSave(adminPage.actionButton, 2, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Adding Sub Structure Information to already created Structure', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.structureDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.click(adminPage.organizationLocators.editSwitch);
        await adminPage.addSubRowStructure('Quality Engineering Edited');
        await adminPage.fillTextBoxValues(adminPage.structureLocator.unitID, '0077');
        await adminPage.fillTextBoxValues(adminPage.structureLocator.name, 'Quality Playwright Engineering Sub');
        await adminPage.fillTextBoxValues(adminPage.structureLocator.description, 'Quality Playwright Engineering 123 Testing Sub');
        await adminPage.clickSave(adminPage.actionButton, 2, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Deleting Structure Information to already created Structure', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.organizationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.structureDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.click(adminPage.organizationLocators.editSwitch);
await adminPage.deleteFileStructure('structure','Quality Engineering Edited');
    });
});

test.describe('Filling Qualifications Information and editing the information', () => {
    test('Adding Skills Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.skillsDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.skillsLocator.name, 'Playwright');
        await adminPage.fillTextBoxValues(adminPage.skillsLocator.description, 'Automation Software');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Skills by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.skillsDropDownMenu, 0);
        await page.waitForTimeout(3000);

        await adminPage.editRow('Playwright');
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.skillsLocator.name, 'Playwright Framework');
        await adminPage.fillTextBoxValues(adminPage.skillsLocator.description, 'Automation Software Tool');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Skills Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.skillsDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', 'Playwright Framework');
    });
});

test.describe('Filling Qualifications Information and editing the information', () => {
    test('Adding Education Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.educationDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.educationLocator.level, 'Long Distance Degree');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Education by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.educationDropDownMenu, 0);
        await page.waitForTimeout(3000);

        await adminPage.editRow('Long Distance Degree');
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.educationLocator.level, 'Long Distance Degree Edited');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Education Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.educationDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', 'Long Distance Degree Edited');
    });
});

test.describe('Filling Qualifications Information and editing the information', () => {
    test('Adding Licenses Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.licensesDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.licenseLocator.name, 'Sun Certified Java Programmer (SCJP)');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Licenses by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.licensesDropDownMenu, 0);
        await page.waitForTimeout(3000);

        await adminPage.editRow('Sun Certified Java Programmer (SCJP)');
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.licenseLocator.name, 'Oracle Certified Java Programmer(OCJP)');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Licenses Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.licensesDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', 'Oracle Certified Java Programmer(OCJP)');
    });
});

test.describe('Filling Qualifications Information and editing the information', () => {
    test('Adding Languages Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.languagesDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.languageLocator.name, 'Hindi');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Languages by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.languagesDropDownMenu, 0);
        await page.waitForTimeout(3000);

        await adminPage.editRow('Hindi');
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.languageLocator.name, 'Tamil');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Languages Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.languagesDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', 'Tamil');
    });
});

test.describe('Filling Qualifications Information and editing the information', () => {
    test('Adding Membership Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.membershipsDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.membershipLocator.name, 'BCCB');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Membership by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.membershipsDropDownMenu, 0);
        await page.waitForTimeout(3000);

        await adminPage.editRow('BCCB');
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.membershipLocator.name, 'XYYX');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Membership Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.qualificationsMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.membershipsDropDownMenu, 0);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', 'XYYX');
    });
});

test.describe('Filling Nationalities Information and editing the information', () => {
    test('Adding Nationalities Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.nationalitiesMenu);
        await page.waitForTimeout(3000);
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.membershipLocator.name, 'AmericanBuzz');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Search existing Nationalities by filtering and Edit', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.nationalitiesMenu);
        await page.waitForTimeout(3000);

        await adminPage.editRow('AmericanBuzz');
        await page.waitForSelector(`div.orangehrm-card-container`);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.membershipLocator.name, 'AmericanAldrin');
        await adminPage.clickSave(adminPage.actionButton, 1, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Deleting the Existing Nationalities Information by filtering', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.nationalitiesMenu);
        await page.waitForTimeout(5000);
        await adminPage.deleteFileRecord('delete', 'AmericanAldrin');
    });
});

test.describe('Modifying Corporate Branding Information and saving the information', () => {
    test('Editing Corporate Branding Color Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.corpBrandingMenu);
        await page.waitForTimeout(3000);
        await adminPage.click(adminPage.corpBrandingLocator.primaryColor);
        await adminPage.fillTextBoxValues(adminPage.corpBrandingLocator.hex, '#1dd6ff');
        await adminPage.click(adminPage.corpBrandingLocator.secondaryColor);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.corpBrandingLocator.hex, '#e92188');
        await adminPage.click(adminPage.corpBrandingLocator.primaryFontColor);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.corpBrandingLocator.hex, '#1239c7');
        await adminPage.click(adminPage.corpBrandingLocator.secondaryFontColor);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.corpBrandingLocator.hex, '#a84646');
        await adminPage.click(adminPage.corpBrandingLocator.primaryGradientColor1);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.corpBrandingLocator.hex, '#247d5e');
        await adminPage.click(adminPage.corpBrandingLocator.primaryGradientColor2);
        await page.waitForTimeout(3000);
        await adminPage.fillTextBoxValues(adminPage.corpBrandingLocator.hex, '#17f3ce');
        await adminPage.clickElementWithIndex(adminPage.actionButton, 1);
        await page.waitForTimeout(5000);
        await adminPage.clickSave(adminPage.actionButton, 2, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Editing Corporate Branding CLient Logo and Banner Information and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.corpBrandingMenu);
        await page.waitForTimeout(3000);
        await page.waitForSelector(`div.orangehrm-card-container`);
        await adminPage.bannerUploadFile('Client Logo', '50px X 50px.png');
        await adminPage.bannerUploadFile('Client Banner', '182px X 50px.jpg');
        await adminPage.bannerUploadFile('Login Banner', '340px X 65px.jpg');
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
        await adminPage.fillTextBoxValues(adminPage.configurationLocators.mailSentAs, 'infotest@orangehrm.com');
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
        await adminPage.fillTextBoxValues(adminPage.configurationLocators.mailSentAs, 'info@orangehrm.com');
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
        await adminPage.addPerson('Leave Applications');
        await adminPage.clickElementWithIndex(adminPage.actionButton, 0);
        await adminPage.fillTextBoxValues(adminPage.name, 'Aldrin Kardoze');
        await adminPage.fillTextBoxValues(adminPage.organizationLocators.email, 'afktest@orangehrm.com');
        await adminPage.clickElementWithIndex(adminPage.actionButton, 2);
    });

    test('Deleting Existing Email Subscriptions and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.configurationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.emailSubscriptionsDropDownMenu, 0);
        await page.waitForTimeout(3000);
        await adminPage.clickSave(adminPage.configurationLocators.leaveApplications, 0, Constants.sucessMsg.successfulUpdatedMsg);
        await adminPage.addPerson('Leave Applications');
        await adminPage.deleteFileRecord('delete', 'Aldrin Kardoze');
    });
});

test.describe('Modifying Localization and saving the changes', () => {
    test('Configuring Localization and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.configurationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.localizationDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.selecDropdownOption(adminPage.configurationLocators.language, 'German - Deutsch');
        await adminPage.selecDropdownOption(adminPage.configurationLocators.dateFormat, 'dd-mm-yyyy ( 27-03-2023 )');
        await adminPage.clickSave(adminPage.actionButton, 0, Constants.sucessMsg.successfulUpdatedMsg);
    });

    test('Resetting Existing Localization and saving', async () => {
        await page.waitForTimeout(2000);
        await adminPage.clickHeaderMenu(adminPage.adminHeadersLocators.germanconfigurationMenu);
        await adminPage.clickElementWithIndex(adminPage.adminHeadersLocators.germanLocalizationDropDownMenu, 0);
        await page.waitForTimeout(2000);
        await adminPage.selecDropdownOption(adminPage.configurationLocators.germanlanguage, 'English (United States)');
        await adminPage.selecDropdownOption(adminPage.configurationLocators.germandateFormat, 'yyyy-mm-dd ( 2023-03-27 )');
        await adminPage.clickSave(adminPage.actionButton, 0, Constants.sucessMsg.germansuccessfulUpdatedMsg);
    });
});