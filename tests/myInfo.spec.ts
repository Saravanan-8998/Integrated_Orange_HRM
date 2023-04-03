import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { Utils } from '../support/utils';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, MyInfoPage } from '../pageObjects';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, myInfoPage: MyInfoPage, testData: TestData, page: Page, utils: Utils;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  utils = new Utils(page);
  // await utils.launchBrowsers();
  loginPage = new LoginPage(page);
  homePage = new HomePage(page);
  myInfoPage = new MyInfoPage(page);
  testData = new TestData(page);

  await loginPage.getBaseURL();
  await expect(page).toHaveURL(/.*login/);
  let pass = await testData.encodeDecodePassword();
  await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
  await utils.clickMenu("link", homePage.homePageElements.myInfo, "My Info");
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Personal details', () => {
  test('Filling the names section', async () => {
    let section = await myInfoPage.getLocators("names");
    await utils.fillFieldValues(section.locators, section.values);
  });

  test('Filling the Id section', async () => {
    let section = await myInfoPage.getLocators("id");
    await utils.fillFieldValues(section.locators, section.values);
    await utils.fillDateValue(myInfoPage.myInfoPersonalDetails.licenseExpiryDate, '2030-11-25');
  });

  test('Filling the personal details section', async () => {
    await utils.selecDropdownOption("option", myInfoPage.myInfoPersonalDetails.nationality, 'Indian');
    await utils.selecDropdownOption("option", myInfoPage.myInfoPersonalDetails.maritalStatus, 'Single');
    await utils.fillDateValue(myInfoPage.myInfoPersonalDetails.dateofBirth, '2000-12-26');
    await utils.click(myInfoPage.myInfoPersonalDetails.gender);
    await utils.fillTextBoxValues(myInfoPage.myInfoPersonalDetails.militaryService, 'No', true);
    await utils.click(myInfoPage.myInfoPersonalDetails.smoker);
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
    await utils.selecDropdownOption("option", myInfoPage.myInfoPersonalDetails.bloodType, 'A+');
    await utils.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
  });

  test('Filling the personal details and verifying cancel button', async () => {
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', false);
  });

  test('Filling the personal details and verifying save button', async () => {
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
    await utils.waitForElement(myInfoPage.attachments.table);
    let table = await utils.getElement(myInfoPage.attachments.table);
    expect(table).toBeVisible();
  });

  test('Deleting the existing attachments', async () => {
    await utils.click(myInfoPage.attachments.attachmentCheckBox);
    await myInfoPage.deleteExistingFiles();
  });

  test('Uploading a new file and checking the checkbox and performing delete operation', async () => {
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
    await myInfoPage.deleteAttachedFile("cancel");
    await myInfoPage.deleteAttachedFile("save");
  });
});

test.describe('Contact details', () => {
  test('Filling the Contact details section fields', async () => {
    await utils.clickMenu('link', myInfoPage.contactDetailsLocators.contactDetails, 'Contact Details');
    let section = await myInfoPage.getLocators("contactDetails");
    await utils.fillFieldValues(section.locators, section.values);
    await utils.selecDropdownOption("option", myInfoPage.contactDetailsLocators.country, 'India');
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
  });
});

test.describe('Emergency Contacts', () => {
  test('Filling Emergency Contacts details', async () => {
    await utils.clickMenu('link', myInfoPage.emergencyContactDetails.emergencyContactMenuLink, 'Emergency Contacts');
    await myInfoPage.clickAddButton('Assigned Emergency Contacts');
    let section = await myInfoPage.getLocators("emergencyContact");
    await utils.fillFieldValues(section.locators, section.values);
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
  });
});

test.describe('Dependents', () => {
  test('Filling Dependents details', async () => {
    await utils.clickMenu('link', myInfoPage.dependentsDetails.dependentsMenuLink, 'Dependents');
    await myInfoPage.clickAddButton('Assigned Dependents');
    await utils.fillTextBoxValues(myInfoPage.nameInputField, 'Gob', true);
    await utils.selecDropdownOption("option", myInfoPage.dependentsDetails.relationship, 'Child');
    await utils.fillDateValue(myInfoPage.myInfoPersonalDetails.dateofBirth, '2000-12-26');
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
  });
});

test.describe('Immigration', () => {
  test('Filling Immigration details', async () => {
    await utils.clickMenu('link', myInfoPage.immigrationDetails.immigrationDetailsMenuLink, 'Immigration');
    await myInfoPage.clickAddButton('Assigned Immigration Records');
    await utils.click(myInfoPage.immigrationDetails.passportOption);
    let section = await myInfoPage.getLocators("immigration");
    await utils.fillFieldValues(section.locators, section.values);
    await utils.selecDropdownOption("option", myInfoPage.immigrationDetails.issuedBy, 'Albania');
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
  });
});

test.describe('Qualifications', () => {
  test('Filling Work Experience details', async () => {
    await utils.clickMenu('link', myInfoPage.qualifications.qualificationsMenuLink, 'Qualifications');
    await myInfoPage.clickAddButton('Work Experience');
    let section = await myInfoPage.getLocators("workExperience");
    await utils.fillFieldValues(section.locators, section.values);
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
  });

  test('Filling Education details', async () => {
    await myInfoPage.clickAddButton('Education');
    await utils.selecDropdownOption("option", myInfoPage.education.level, "Bachelor's Degree");
    let section = await myInfoPage.getLocators("education");
    await utils.fillFieldValues(section.locators, section.values);
    await utils.clickSave(myInfoPage.save, 0);
  });
});

test('Filling Skills details', async () => {
  await myInfoPage.clickAddButton('Skills');
  await utils.selecDropdownOption("option", myInfoPage.skills.skill, "Python");

  let section = await myInfoPage.getLocators("skills");
  await utils.fillFieldValues(section.locators, section.values);

  // await utils.fillTextBoxValues(myInfoPage.skills.yearsOfExperience, '4', true);
  // await utils.fillTextBoxValues(myInfoPage.skills.comment, 'Filled Skills fields', true);
  await utils.clickSave(myInfoPage.save, 0);
});

test('Filling Languages details', async () => {
  await myInfoPage.clickAddButton('Languages');
  await utils.selecDropdownOption("option", myInfoPage.languages.language, "English");
  await utils.selecDropdownOption("option", myInfoPage.languages.fluency, "Writing");
  await utils.selecDropdownOption("option", myInfoPage.languages.competency, "Good");
  await utils.fillTextBoxValues(myInfoPage.languages.comment, 'Filled Languages fields', true);
  await utils.clickSave(myInfoPage.save, 0);
});

test('Filling License Details', async () => {
  await myInfoPage.clickAddButton('License');
  await utils.selecDropdownOption("option", myInfoPage.license.licenseType, "Cisco Certified Network Associate (CCNA)");
  let section = await myInfoPage.getLocators("licenseDetails");
  await utils.fillFieldValues(section.locators, section.values);

  // await utils.fillTextBoxValues(myInfoPage.license.licenseNumber, "123456", true);
  // await utils.fillTextBoxValues(myInfoPage.license.issuedDate, '2015-04-15', true);
  // await utils.fillTextBoxValues(myInfoPage.license.expiryDate, '2015-05-15', true);
  await utils.clickSave(myInfoPage.save, 0);
});

test('Attachment section', async () => {
  await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
});

test.describe('Memberships', () => {
  test('Filling Assigned Memberships details', async () => {
    await utils.clickMenu('link', myInfoPage.memberships.membershipMenuLink, 'Memberships');
    await myInfoPage.clickAddButton('Assigned Memberships');
    await utils.selecDropdownOption("option", myInfoPage.memberships.membership, "ACCA");
    await utils.selecDropdownOption("option", myInfoPage.memberships.subscriptionPaidBy, "Company");

    let section = await myInfoPage.getLocators("AssignedMemberships");

    await utils.fillFieldValues(section.locators, section.values);

    // await utils.fillTextBoxValues(myInfoPage.memberships.subscriptionAmount, "42000", true);
    await utils.selecDropdownOption("option", myInfoPage.memberships.currency, "Indian Rupee");
    // await utils.fillTextBoxValues(myInfoPage.memberships.subscriptionCommenceDate, "2023-03-21", true);
    // await utils.fillTextBoxValues(myInfoPage.memberships.subscriptionRenewalDate, "2023-03-23", true);
    await utils.clickSave(myInfoPage.save, 0);
    await myInfoPage.uploadFile('uploadTextFile.txt', 'Attachments', true);
  });
});