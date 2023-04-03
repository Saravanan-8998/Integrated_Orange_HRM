import { expect, test, Page } from "@playwright/test";
import { Recruitment } from "../pageObjects/recruitment.PO";
import { LoginPage } from "../pageObjects/login_page.PO";
import subURL from "../support/subURL.json";
import { myBrowserFixture } from "../support/fixtures";
import { createITManager, getITManagerFullName } from "../support/createUser";
import Constants from "../support/constants.json";

let page: Page;
let loginPage: LoginPage;
let recruitment: Recruitment;
let fullNameValue: any;
let USERNAME: any;

async function adminUserLogin() {
    await createITManager();
    fullNameValue = await getITManagerFullName();
    USERNAME = fullNameValue.slice(14, 32);
    await page.goto(subURL.login);
    await loginPage.enterCredentials('Admin', 'admin123');
    await recruitment.navigate();
}

test.beforeAll(async () => {
    page = (await myBrowserFixture()).page;
    loginPage = new LoginPage(page);
    recruitment = new Recruitment(page);
});

test.describe('Should check all functionality in Recruitment Module', async () => {
    test('Should add a New Vacancy', async () => {
        await adminUserLogin();
        await recruitment.addNewVacancie(USERNAME);
    });

    test('Should search and verify a vacancy', async () => {
        await recruitment.searchVacancie();
        await recruitment.verifyVacancieSearch();
    });

    test('Should edit a vacancy', async () => {
        await recruitment.editAVacancy();
    });

    test('Should add a New Candidate', async () => {
        await recruitment.addNewCandidate();
        await recruitment.clickSave(Constants.assertion.success);
    });

    test('Should search and verify a candidate', async () => {
        await recruitment.searchCandidate();
        await recruitment.verifyCandidateSearch();
    });

    test('Should shortlist the created candidate', async () => {
        await recruitment.shortlist();
    });

    test('Should Shedule for an interview the created candidate', async () => {
        await recruitment.scheduleForInterview(USERNAME);
    });

    test('Should Mark Interview pass the created candidate', async () => {
        await recruitment.markInterview();
    });

    test('Should Offer a Job for the created candidate', async () => {
        await recruitment.offerJob();
    });

    test('Should Hire the created candidate', async () => {
        await recruitment.hire();
    });

    test('Should verify the created candidate is hired', async () => {
        await recruitment.verifyUserIsHired();
    });

    test('Should close all page', async () => {
        await page.close();
    });
});