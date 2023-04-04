import { expect, test, Page } from "@playwright/test";
import { LoginPage } from "../pageObjects/login_Page";
import subURL from "../support/subURL.json";
import { myBrowserFixture } from "../support/fixtures";
import Constants from "../support/constants.json";
import ENV from "../support/env";

let page: Page;
let loginPage: LoginPage;

test.beforeAll(async () => {
    page = (await myBrowserFixture()).page;
    await page.goto(subURL.login);
    loginPage = new LoginPage(page);
});

test.describe('Should check all type of login possibilities', async () => {
    test.beforeEach(async () => {
        page.reload();
    })

    test('Should check all the login components', async () => {
        await loginPage.verifyImgComponent();
        await loginPage.verifyUserNameComponent();
        await loginPage.verifyPasswordComponent();
        await loginPage.verifyLoginBtnComponent();
    });

    test('Should login with empty username and correct password', async () => {
        await loginPage.enterCredentials('', ENV.PASSWORD);
        let errMessage = await loginPage.required();
        expect(errMessage).toBe(Constants.assertion.requiredCredentials);
    });

    test('Should login with empty username and wrong password', async () => {
        await loginPage.enterCredentials('', Constants.credentials.wrongPassword);
        let errMessage = await loginPage.required();
        expect(errMessage).toBe(Constants.assertion.requiredCredentials);
    });

    test('Should login with correct username and empty password', async () => {
        await loginPage.enterCredentials(ENV.USERNAME, '');
        let errMessage = await loginPage.required();
        expect(errMessage).toBe(Constants.assertion.requiredCredentials);
    });

    test('Should login with wrong username and empty password', async () => {
        await loginPage.enterCredentials(Constants.credentials.wrongUsername, '');
        let errMessage = await loginPage.required();
        expect(errMessage).toBe(Constants.assertion.requiredCredentials);
    });

    test('Should login with wrong username and correct password', async () => {
        await loginPage.enterCredentials(Constants.credentials.wrongUsername, ENV.PASSWORD);
        let errMessage = await loginPage.invalid();
        expect(errMessage).toBe(Constants.assertion.invalidCredentials);
    });

    test('Should login with correct username and wrong password', async () => {
        await loginPage.enterCredentials(ENV.USERNAME, Constants.credentials.wrongPassword);
        let errMessage = await loginPage.invalid();
        expect(errMessage).toBe(Constants.assertion.invalidCredentials);
    });

    test('Should login with wrong username and wrong password', async () => {
        await loginPage.enterCredentials(Constants.credentials.wrongUsername, Constants.credentials.wrongPassword);
        let errMessage = await loginPage.invalid();
        expect(errMessage).toBe(Constants.assertion.invalidCredentials);
    });

    test('Should login with correct username and correct passowrd', async () => {
        await loginPage.enterCredentials(ENV.USERNAME, ENV.PASSWORD);
        await page.waitForTimeout(5000);
        await expect(page).toHaveURL(/.*dashboard/);
    });
});

test.afterAll(async () => {
    await page.close();
});