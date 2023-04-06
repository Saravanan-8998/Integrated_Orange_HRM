import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, BuzzPage } from '../pageObjects';
import ENV from '../support/env';
import { Utils } from '../support/utils';

let loginPage: LoginPage, homePage: HomePage, buzzPage: BuzzPage, testData: TestData, page: Page, utils: Utils;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    utils = new Utils(page);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    buzzPage = new BuzzPage(page);
    testData = new TestData(page);
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
    await homePage.clickBuzzMenu();
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Filling Buzz NewsFeed and Posting Update', () => {
    test('Filling Whats on your mind? and sharing photos to post', async () => {
        await buzzPage.click(buzzPage.buzzLocators.buzzTitle);
        await buzzPage.fillTextBoxValues(buzzPage.buzzLocators.postInput, Constants.buzzModule.postInput);
        await buzzPage.click(buzzPage.buzzLocators.sharePhotos);
        await page.locator(buzzPage.buzzLocators.photosContainer).isEnabled();
        await buzzPage.uploadFile(Constants.buzzModule.upload50px);
        await buzzPage.uploadFile(Constants.buzzModule.upload182px);
        await buzzPage.clickSave(buzzPage.buzzLocators.shareButton, 0, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Filling Whats on your mind? and sharing Video URL to post', async () => {
        await buzzPage.click(buzzPage.buzzLocators.buzzTitle);
        await buzzPage.click(buzzPage.buzzLocators.shareVideos);
        await page.locator(buzzPage.buzzLocators.photosContainer).isEnabled();
        await buzzPage.fillTextBoxValues(buzzPage.buzzLocators.postInput, Constants.buzzModule.postInput2);
        await buzzPage.fillTextBoxValues(buzzPage.buzzLocators.videoURLInput, Constants.buzzModule.videoURL);
        await page.waitForTimeout(3000);
        await buzzPage.clickSave(buzzPage.buzzLocators.shareButton, 0, Constants.sucessMsg.sucessfulSavedMsg);
    });
});

test.describe('Click Most Recent/Liked/Commented Posts and verify the Feed is Filtered and Viewed', () => {
    test('Click Most Recent Posts and verify that the posts are filtered', async () => {
        await buzzPage.click(buzzPage.buzzLocators.buzzTitle);
        await buzzPage.click(buzzPage.buzzLocators.mostRecentPosts);
        expect(await buzzPage.getText(buzzPage.buzzLocators.feedUser)).toEqual(Constants.buzzAssertions.feedUser);
        expect(await buzzPage.getText(buzzPage.buzzLocators.feedtext)).toEqual(Constants.buzzAssertions.feedText);
        await buzzPage.click(buzzPage.buzzLocators.mostLikedPosts);
        expect(await buzzPage.getText(buzzPage.buzzLocators.feedUser)).toEqual(Constants.buzzAssertions.feedExistingUser);
        expect(await buzzPage.getText(buzzPage.buzzLocators.feedtext)).toEqual(Constants.buzzAssertions.feedText1);
        await buzzPage.click(buzzPage.buzzLocators.mostCommentedPosts);
        expect(await buzzPage.getText(buzzPage.buzzLocators.feedUser)).toEqual(Constants.buzzAssertions.feedExistingUser);
        expect(await buzzPage.getText(buzzPage.buzzLocators.feedtext)).toEqual(Constants.buzzAssertions.feedText2);
    });
});

test.describe('React to the Created Post in the Feed and Comment', () => {
    test('React to the latest Post in the Feed', async () => {
        await buzzPage.click(buzzPage.buzzLocators.buzzTitle);
        await buzzPage.click(buzzPage.buzzLocators.mostRecentPosts);
        expect(await buzzPage.getText(buzzPage.buzzLocators.feedUser)).toEqual(Constants.buzzAssertions.feedUser);
        await buzzPage.click(buzzPage.buzzLocators.heart);
        expect(await buzzPage.getText(buzzPage.buzzLocators.likeText)).toEqual(Constants.buzzAssertions.like);
    });

    test('Comment to the latest Post in the Feed, Like, Edit and Delete the Comment', async () => {
        await buzzPage.click(buzzPage.buzzLocators.buzzTitle);
        await buzzPage.click(buzzPage.buzzLocators.mostRecentPosts);
        expect(await buzzPage.getText(buzzPage.buzzLocators.feedUser)).toEqual(Constants.buzzAssertions.feedUser);
        await buzzPage.click(buzzPage.buzzLocators.comment);
        await buzzPage.fillTextBoxValues(buzzPage.buzzLocators.commentInput, Constants.buzzModule.commentInput);
        await page.keyboard.press('Enter');
        await buzzPage.click(buzzPage.buzzLocators.likeComment);
        await buzzPage.click(buzzPage.buzzLocators.editComment);
        await buzzPage.fillTextBoxValues(buzzPage.buzzLocators.editCommentInput, Constants.buzzModule.commmentInputEdit);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        expect(await buzzPage.getText(buzzPage.buzzLocators.commentText)).toEqual(Constants.buzzAssertions.comment);
        await buzzPage.deleteComment();
    });
});

test.describe('Deleted the created Post by selecting the post', () => {
    test('Delete the created post by clicking 3 dots and click Delete Post', async () => {
        await buzzPage.click(buzzPage.buzzLocators.buzzTitle);
        await buzzPage.click(buzzPage.buzzLocators.mostRecentPosts);
        await buzzPage.deleteFeed();
        await buzzPage.deleteFeed();
    });
});
