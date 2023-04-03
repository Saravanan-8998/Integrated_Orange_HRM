import { test, expect, Page } from '@playwright/test';
import Constants from '../support/constants.json';
import { TestData } from '../testData/testData';
import { LoginPage, HomePage, BuzzPage } from '../pageObjects';
import ENV from '../support/env';

let loginPage: LoginPage, homePage: HomePage, buzzPage: BuzzPage, testData: TestData, page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    buzzPage = new BuzzPage(page);
    testData = new TestData(page);
    await loginPage.getBaseURL();
    await expect(page).toHaveURL(/.*login/);
    let pass = await testData.encodeDecodePassword();
    await loginPage.fillUsrNameAndPwdAndLogin(ENV.USERNAME, pass);
    await expect(page).toHaveURL(/.*dashboard/);
    await page.waitForSelector(homePage.dashboardGrid);
    await homePage.clickBuzzMenu();
});

test.afterAll(async () => {
    await page.close();
});

test.describe('Filling Buzz NewsFeed and Posting Update', () => {
    test('Filling Whats on your mind? and sharing photos to post', async () => {
        await buzzPage.click(buzzPage.buzzLocators.buzzTitle);
        await buzzPage.fillTextBoxValues(buzzPage.buzzLocators.postInput, `Hey Everyone, What's up?`);
        await buzzPage.click(buzzPage.buzzLocators.sharePhotos);
        await page.locator(buzzPage.buzzLocators.photosContainer).isEnabled();
        await buzzPage.uploadFile('50px X 50px.png');
        await buzzPage.uploadFile('182px X 50px.jpg');
        await buzzPage.clickSave(buzzPage.buzzLocators.shareButton, 0, Constants.sucessMsg.sucessfulSavedMsg);
    });

    test('Filling Whats on your mind? and sharing Video URL to post', async () => {
        await buzzPage.click(buzzPage.buzzLocators.buzzTitle);
        await buzzPage.click(buzzPage.buzzLocators.shareVideos);
        await page.locator(buzzPage.buzzLocators.photosContainer).isEnabled();
        await buzzPage.fillTextBoxValues(buzzPage.buzzLocators.postInput, `Hey Everyone, What's up?, Check Out this Remix!`);
        await buzzPage.fillTextBoxValues(buzzPage.buzzLocators.videoURLInput, 'https://www.youtube.com/watch?v=kvV_9-H6Ab0');
        await page.waitForTimeout(3000);
        await buzzPage.clickSave(buzzPage.buzzLocators.shareButton, 0, Constants.sucessMsg.sucessfulSavedMsg);
    });
});

test.describe('Click Most Recent/Liked/Commented Posts and verify the Feed is Filtered and Viewed', () => {
    test('Click Most Recent Posts and verify that the posts are filtered', async () => {
        await buzzPage.click(buzzPage.buzzLocators.buzzTitle);
        await buzzPage.click(buzzPage.buzzLocators.mostRecentPosts);
        expect(await buzzPage.getText(buzzPage.buzzLocators.feedtext)).toEqual(`Hey Everyone, What's up?, Check Out this Remix!`);
        await buzzPage.click(buzzPage.buzzLocators.mostLikedPosts);
        expect(await buzzPage.getText(buzzPage.buzzLocators.feedtext)).toEqual(`Happy Birthday to my darling little son!!! Thanks guys for your presence at the party. `);
        await buzzPage.click(buzzPage.buzzLocators.mostCommentedPosts);
        expect(await buzzPage.getText(buzzPage.buzzLocators.feedtext)).toEqual(`Happy Birthday to my darling little son!!! Thanks guys for your presence at the party. `);
    });
});

test.describe('React to the Created Post in the Feed and Comment', () => {
    test('React to the latest Post in the Feed', async () => {
        await buzzPage.click(buzzPage.buzzLocators.buzzTitle);
        await buzzPage.click(buzzPage.buzzLocators.mostRecentPosts);
        await buzzPage.click(buzzPage.buzzLocators.heart);
        expect(await buzzPage.getText(buzzPage.buzzLocators.likeText)).toEqual(`1 Like`);
    });

    test('Comment to the latest Post in the Feed, Like, Edit and Delete the Comment', async () => {
        await buzzPage.click(buzzPage.buzzLocators.buzzTitle);
        await buzzPage.click(buzzPage.buzzLocators.mostRecentPosts);
        await buzzPage.click(buzzPage.buzzLocators.comment);
        await buzzPage.fillTextBoxValues(buzzPage.buzzLocators.commentInput, 'Look I have commented for this Post');
        await page.keyboard.press('Enter');
        await buzzPage.click(buzzPage.buzzLocators.likeComment);
        await buzzPage.click(buzzPage.buzzLocators.editComment);
        await buzzPage.fillTextBoxValues(buzzPage.buzzLocators.editCommentInput, 'Look I have commented for this Post Edited');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        expect(await buzzPage.getText(buzzPage.buzzLocators.commentText)).toEqual(`Look I have commented for this Post Edited`);
        await buzzPage.deleteComment();
    });
});

test.describe('Deleted the created Post by selecting the post', () => {
    test('Delete the created post by clicking 3 dots and click Delete Post', async () => {
        await buzzPage.click(buzzPage.buzzLocators.buzzTitle);
        await buzzPage.click(buzzPage.buzzLocators.mostRecentPosts);
        await buzzPage.deleteFeed();
        await buzzPage.deleteFeed();
        await buzzPage.deleteFeed();
    });
});
