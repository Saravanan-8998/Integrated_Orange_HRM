import { Page, expect, Download } from "@playwright/test";
import Constants from '../support/constants.json';

export class BuzzPage {
    readonly page: Page;
    password: string;
    loginButton: string;
    container: string;
    actionButton: string;
    confirmationPopup: string;
    popupText: string;
    popupDeleteButton: string;
    tableRow: string;
    toastMessage: string;
    closeIcon: string;
    buzzLocators: any;

    constructor(page: Page) {
        this.page = page;
        this.password = '[name="password"]';
        this.loginButton = '[type="submit"]';
        this.container = `.orangehrm-background-container`;
        this.actionButton = `button.oxd-button--medium`;
        this.confirmationPopup = 'div.orangehrm-dialog-popup';
        this.popupText = 'p.oxd-text--card-body';
        this.popupDeleteButton = '(//div[@class="orangehrm-modal-footer"]//button)[2]';
        this.tableRow = `div.oxd-table-card`;
        this.toastMessage = 'p.oxd-text--toast-message';
        this.closeIcon = '.oxd-toast-close-container';

        this.buzzLocators = {
            buzzTitle: `//p[text()='Buzz Newsfeed']`,
            postInput: `textarea.oxd-buzz-post-input`,
            sharePhotos: `//button[text()=' Share Photos']`,
            shareVideos: `//button[text()=' Share Video']`,
            photosContainer: `div[role='document']`,
            uploadPhotos: `i.oxd-icon.bi-images`,
            shareButton: `//button[text()=' Share ']`,
            videoURLInput: `textarea[placeholder='Paste Video URL']`,
            mostRecentPosts: `//button[text()=' Most Recent Posts ']`,
            mostLikedPosts: `//button[text()=' Most Liked Posts ']`,
            mostCommentedPosts: `//button[text()=' Most Commented Posts ']`,
            heart: `(//*[@id="heart-svg"])[1]`,
            comment: `(//div[@class='orangehrm-buzz-post-actions']//i[@class="oxd-icon bi-chat-text-fill"])[1]`,
            commentInput: `div.orangehrm-buzz-comment-add > form > div > div:nth-child(2) > input`,
            editCommentInput: `div.orangehrm-post-comment > form > div > div:nth-child(2) > input`,
            likeComment: `//p[text()='Like']`,
            editComment: `//p[text()='Edit']`,
            deleteCommentButton: `//p[text()='Delete']`,
            feedUser: "(//p[contains(@class,'oxd-text oxd-text--p')])[2]",
            feedtext: `(//div[@class='orangehrm-buzz-post-body']//p)[1]`,
            likeText: `(//div[@class='orangehrm-buzz-stats-row']//p)[1]`,
            commentText: `//div[@class='orangehrm-post-comment-area']//span[1]`
        }

    };

    // This function is used to fill the "textbox" values
    async fillTextBoxValues(locatorValue: any, fillValue: any) {
        await this.page.locator(locatorValue).last().clear();
        await (await this.page.waitForSelector(locatorValue)).waitForElementState("stable");
        await this.page.locator(locatorValue).last().type(fillValue);
    };

    // This function is used to "click on the element"
    async click(locator: any) {
        await this.page.locator(locator).click({ force: true });
        await this.page.waitForTimeout(2000);
    };

    // This function is for "uploading the file" 
    async uploadFile(filePath: any) {
        await this.page.setInputFiles(`//input[@class='oxd-file-input']`, filePath);
        await this.page.waitForTimeout(3000);
    };

    // This function returns the "toast message text"
    async getToastMessage() {
        return await this.page.locator(this.toastMessage).textContent();
    };

    // This function is used to click on the "Close" Icon of the toast message
    async clickCloseIcon() {
        await this.page.locator(this.closeIcon).click();
    };

    // This function is used to click on the "Save" button
    async clickSave(locatorValue: string, index: number, messageToVerify?: string) {
        await this.page.locator(locatorValue).nth(index).click();
        expect(await this.getToastMessage()).toEqual(messageToVerify);
        await this.clickCloseIcon();
    }

    // This function is used to Delete the Feeds
    async deleteFeed() {
        await this.page.locator(`(//i[@class='oxd-icon bi-three-dots'])`).first().click();
        await this.page.locator(`i.oxd-icon.bi-trash`).click();
        await this.page.waitForSelector(this.confirmationPopup);
        expect(await this.page.locator(this.popupText).textContent()).toEqual(Constants.popupText.item);
        await this.page.locator(this.popupDeleteButton).click();
        await this.page.waitForTimeout(2000);
    };

    // This function is used to Delete the Comments
    async deleteComment() {
        await this.page.click(this.buzzLocators.deleteCommentButton);
        await this.page.waitForSelector(this.confirmationPopup);
        expect(await this.page.locator(this.popupText).textContent()).toEqual(Constants.popupText.item);
        await this.page.locator(this.popupDeleteButton).click();
    };

    // This function is used to "get the text" of any elements
    async getText(locator) {
        return await this.page.locator(locator).textContent();
    }
};
