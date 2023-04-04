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
  await utils.clickMenu(Constants.Roles.link, homePage.homePageElements.myInfo, Constants.Menu.myInfo);
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Personal details', () => {
  test('Filling the names section', async () => {
    let section = await myInfoPage.getLocators(Constants.section.names);
    await utils.fillFieldValues(section.locators, section.values);
  });

  test('Filling the Id section', async () => {
    let section = await myInfoPage.getLocators(Constants.section.id);
    await utils.fillFieldValues(section.locators, section.values);
    await utils.fillDateValue(myInfoPage.myInfoPersonalDetails.licenseExpiryDate, Constants.EmployeeIDs.licenseExpiryDate);
  });

  test('Filling the personal details section', async () => {
    await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.myInfoPersonalDetails.nationality, Constants.PersonalDetails.nationality);
    await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.myInfoPersonalDetails.maritalStatus, Constants.PersonalDetails.maritalStatus);
    await utils.fillDateValue(myInfoPage.myInfoPersonalDetails.dateofBirth, Constants.PersonalDetails.dob);
    await utils.click(myInfoPage.myInfoPersonalDetails.gender);
    await utils.fillTextBoxValues(myInfoPage.myInfoPersonalDetails.militaryService, Constants.PersonalDetails.dob, true);
    await utils.click(myInfoPage.myInfoPersonalDetails.smoker);
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
    await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.myInfoPersonalDetails.bloodType, Constants.PersonalDetails.bloodType);
    await utils.clickSave(myInfoPage.save, 1, Constants.sucessMsg.sucessfulSavedMsg);
  });

  test('Filling the personal details and verifying cancel button', async () => {
    await myInfoPage.uploadFile(Constants.fileName, Constants.section.attachments, false);
  });

  test('Filling the personal details and verifying save button', async () => {
    await myInfoPage.uploadFile(Constants.fileName, Constants.section.attachments, true);
    await utils.waitForElement(myInfoPage.attachments.table);
    let table = await utils.getElement(myInfoPage.attachments.table);
    expect(table).toBeVisible();
  });

  test('Deleting the existing attachments', async () => {
    await utils.click(myInfoPage.attachments.attachmentCheckBox);
    await myInfoPage.deleteExistingFiles();
  });

  test('Uploading a new file and checking the checkbox and performing delete operation', async () => {
    await myInfoPage.uploadFile(Constants.fileName, Constants.section.attachments, true);
    await myInfoPage.deleteAttachedFile(Constants.others.cancel);
    await myInfoPage.deleteAttachedFile(Constants.others.save);
  });
});

test.describe('Contact details', () => {
  test('Filling the Contact details section fields', async () => {
    await utils.clickMenu(Constants.Roles.link, myInfoPage.contactDetailsLocators.contactDetails, Constants.Menu.contactDetails);
    let section = await myInfoPage.getLocators(Constants.section.contactDetails);
    await utils.fillFieldValues(section.locators, section.values);
    await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.contactDetailsLocators.country, Constants.contactDetails.country);
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
  });
});

test.describe('Emergency Contacts', () => {
  test('Filling Emergency Contacts details', async () => {
    await utils.clickMenu(Constants.Roles.link, myInfoPage.emergencyContactDetails.emergencyContactMenuLink, Constants.Menu.emergencyContacts);
    await myInfoPage.clickAddButton(Constants.assignedEmergencyContacts);
    let section = await myInfoPage.getLocators(Constants.section.emergencyContact);
    await utils.fillFieldValues(section.locators, section.values);
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
    await myInfoPage.uploadFile(Constants.fileName, Constants.section.attachments, true);
  });
});

test.describe('Dependents', () => {
  test('Filling Dependents details', async () => {
    await utils.clickMenu(Constants.Roles.link, myInfoPage.dependentsDetails.dependentsMenuLink, Constants.depedendant.dependents);
    await myInfoPage.clickAddButton(Constants.depedendant.assignedDependents);
    await utils.fillTextBoxValues(myInfoPage.nameInputField, Constants.depedendant.name, true);
    await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.dependentsDetails.relationship, Constants.depedendant.relationship);
    await utils.fillDateValue(myInfoPage.myInfoPersonalDetails.dateofBirth, Constants.depedendant.dob);
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
    await myInfoPage.uploadFile(Constants.fileName, Constants.section.attachments, true);
  });
});

test.describe('Immigration', () => {
  test('Filling Immigration details', async () => {
    await utils.clickMenu(Constants.Roles.link, myInfoPage.immigrationDetails.immigrationDetailsMenuLink, Constants.Menu.immigration);
    await myInfoPage.clickAddButton(Constants.immigration.assignedImmigrationRecords);
    await utils.click(myInfoPage.immigrationDetails.passportOption);
    let section = await myInfoPage.getLocators(Constants.section.immigration);
    await utils.fillFieldValues(section.locators, section.values);
    await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.immigrationDetails.issuedBy, Constants.immigration.issuedBy);
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
    await myInfoPage.uploadFile(Constants.fileName, Constants.section.attachments, true);
  });
});

test.describe('Qualifications', () => {
  test('Filling Work Experience details', async () => {
    await utils.clickMenu(Constants.Roles.link, myInfoPage.qualifications.qualificationsMenuLink, Constants.Menu.qualifications);
    await myInfoPage.clickAddButton(Constants.workExperience);
    let section = await myInfoPage.getLocators(Constants.section.workExperience);
    await utils.fillFieldValues(section.locators, section.values);
    await utils.clickSave(myInfoPage.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
  });

  test('Filling Education details', async () => {
    await myInfoPage.clickAddButton(Constants.education);
    await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.education.level, Constants.level);
    let section = await myInfoPage.getLocators(Constants.section.education);
    await utils.fillFieldValues(section.locators, section.values);
    await utils.clickSave(myInfoPage.save, 0);
  });
});

test('Filling Skills details', async () => {
  await myInfoPage.clickAddButton(Constants.skills);
  await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.skills.skill, Constants.skillsPython);
  let section = await myInfoPage.getLocators(Constants.section.skills);
  await utils.fillFieldValues(section.locators, section.values);
  await utils.clickSave(myInfoPage.save, 0);
});

test('Filling Languages details', async () => {
  await myInfoPage.clickAddButton(Constants.languages);
  await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.languages.language, Constants.language.languageEnglish);
  await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.languages.fluency, Constants.language.fluencyWriting);
  await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.languages.competency, Constants.language.competencyGood);
  await utils.fillTextBoxValues(myInfoPage.languages.comment, Constants.language.comment, true);
  await utils.clickSave(myInfoPage.save, 0);
});

test('Filling License Details', async () => {
  await myInfoPage.clickAddButton(Constants.license);
  await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.license.licenseType, Constants.licenseType);
  let section = await myInfoPage.getLocators(Constants.section.licenseDetails);
  await utils.fillFieldValues(section.locators, section.values);
  await utils.clickSave(myInfoPage.save, 0);
});

test('Attachment section', async () => {
  await myInfoPage.uploadFile(Constants.fileName, Constants.section.attachments, true);
});

test.describe('Memberships', () => {
  test('Filling Assigned Memberships details', async () => {
    await utils.clickMenu(Constants.Roles.link, myInfoPage.memberships.membershipMenuLink, Constants.Menu.memberships);
    await myInfoPage.clickAddButton(Constants.assignedMemberships.assignedMemberships);
    await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.memberships.membership, Constants.assignedMemberships.membership);
    await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.memberships.subscriptionPaidBy, Constants.assignedMemberships.subscriptionPaidBy);
    let section = await myInfoPage.getLocators(Constants.section.assignedMemberships);
    await utils.fillFieldValues(section.locators, section.values);
    await utils.selecDropdownOption(Constants.Roles.option, myInfoPage.memberships.currency, Constants.assignedMemberships.indianRupee);
    await utils.clickSave(myInfoPage.save, 0);
    await myInfoPage.uploadFile(Constants.fileName, Constants.section.attachments, true);
  });
});