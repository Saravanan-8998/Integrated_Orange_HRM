import { chromium, firefox, webkit, Page, expect } from '@playwright/test';
import { AdminPage, HomePage } from '../pageObjects';
import { DirectoryPage } from "../pageObjects/directoryPage";
import Constants from "./constants.json";

let directoryPage: DirectoryPage;
let homePage: HomePage;
let adminPage: AdminPage;

export class Utils {

  readonly page: Page;
  readonly backgroundContainer: string;
  readonly toastElements: any;
  readonly save: string;
  readonly tableRow: string;
  readonly attachments: any;
  readonly editIcon: string;
  readonly spinner: string;
  readonly userDropdown: string;
  readonly tableContainer: string;
  readonly employeeListMenu: string;
  readonly trashPath: string;
  readonly addEmployee: string;
  readonly row: (value: any) => string;
  readonly firstName: string;
  readonly lastName: string;
  readonly switch: string;
  readonly userName: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly job: string;
  readonly joinedDate: string;
  readonly jobTitle: string;
  readonly location: string;
  readonly search: string;
  readonly userRole: string;
  readonly terminate: string;
  readonly terminateContainer: string;
  readonly terminationDate: string;
  readonly commentBox: string;
  readonly terminationReason: string;
  readonly usersMenu: string;
  readonly userManagementMenu: string;

  constructor(page: Page) {
    this.page = page;
    homePage = new HomePage(page);
    directoryPage = new DirectoryPage(page);
    adminPage = new AdminPage(page);
    this.backgroundContainer = '.orangehrm-background-container';
    this.save = "//button[normalize-space()='Save']";
    this.search = "//button[normalize-space()='Search']";
    this.toastElements = {
      toastMessage: 'p.oxd-text--toast-message',
      closeIcon: '.oxd-toast-close-container'
    }
    this.attachments = {
      deleteSelectedButton: 'button.orangehrm-horizontal-margin',
      deleteIcon: 'i.oxd-icon.bi-trash',
      confirmationPopup: 'div.orangehrm-dialog-popup',
      popupDeleteButton: '(//div[@class="orangehrm-modal-footer"]//button)[2]'
    }
    this.tableRow = "//div[@class='oxd-table-card']/div[@role='row']";
    this.editIcon = ".oxd-icon.bi-pencil-fill";
    this.spinner = ".oxd-loading-spinner";
    this.userDropdown = ".oxd-userdropdown-tab";
    this.tableContainer = ".orangehrm-paper-container";
    this.employeeListMenu = "//a[text()='Employee List']";
    this.userManagementMenu = "//span[text()='User Management ']",
      this.usersMenu = "//a[text()='Users']";
    this.trashPath = "../..//i[@class='oxd-icon bi-trash']";
    this.addEmployee = "//a[text()='Add Employee']";
    this.firstName = "[name='firstName']";
    this.lastName = "[name='lastName']";
    this.switch = ".oxd-switch-wrapper input";
    this.userName = "//label[text()='Username']/../..//input";
    this.password = "//label[text()='Password']/../..//input";
    this.confirmPassword = "//label[text()='Confirm Password']/../..//input";
    this.job = "//a[text()='Job']";
    this.terminate = "//button[text()=' Terminate Employment ']";
    this.terminateContainer = "//div[contains(@class,'oxd-sheet oxd-sheet--rounded')]";
    this.terminationDate = "//label[text()='Termination Date']/../..//input";
    this.terminationReason = "//label[text()='Termination Reason']/../..//div[contains(@class,'text-input')]";
    this.commentBox = 'textarea.oxd-textarea';
    this.joinedDate = "//label[text()='Joined Date']/../..//input";
    this.jobTitle = "//label[text()='Job Title']/../..//div[contains(@class,'text-input')]";
    this.location = "//label[text()='Location']/../..//div[contains(@class,'text-input')]";
    this.userRole = "//label[text()='User Role']/../..//div[contains(@class,'text-input')]";
    this.row = (value) => {
      return `//div[@class='oxd-table-card']//div[@role='cell']/div[contains(text(),'${value}')]`;
    }
  }

  async launchBrowsers() {
    const browsers = await Promise.all([
      chromium.launch(),
      firefox.launch(),
      webkit.launch(),
    ]);
  }

  // This function is used to wait for the spinner to appear and disappear
  async waitForSpinnerToDisappear() {
    const spinner = await this.page.waitForSelector(this.spinner);
    await spinner.waitForElementState("hidden", { timeout: 6000 });
  }

  // This function is used to wait for the logout
  async logout() {
    await this.click(this.userDropdown);
    await this.page.getByRole("menuitem", { name: "Logout", exact: true }).click();
  }

  // This function is used to get the element
  async getElement(locator: string) {
    return this.page.locator(locator);
  }

  // This function is used to "clear" the "textbox" values
  async clearTextBoxValues(locatorValue: any) {
    await (await this.page.waitForSelector(locatorValue)).waitForElementState('editable');
    await this.page.locator(locatorValue).clear();
  };


  // This function is used to fill the "textbox" values
  async fillTextBoxValues(locatorValue: any, fillValue: any, clearTextbox?: boolean) {
    await (await this.page.waitForSelector(locatorValue)).waitForElementState("editable");
    if (clearTextbox) {
      await this.clearTextBoxValues(locatorValue);
    }
    await this.page.locator(locatorValue).type(fillValue);
  };

  // This function is used to fill the "Date" textbox values
  async fillDateValue(locatorValue: any, fillValue: any) {
    await this.page.locator(locatorValue).fill(fillValue);
  };

  // This function is used to click the dropdown and "select the passed value"
  async selecDropdownOption(role: any, locator: any, optionValue: any) {
    await this.click(locator);
    await this.page.getByRole(role, { name: optionValue }).getByText(optionValue, { exact: true }).click();
  };

  // This function is used to click on the "Save" button
  async clickSave(locatorValue: string, index: number, messageToVerify?: string) {
    await this.page.locator(locatorValue).nth(index).click({ delay: 2000 });
    if (messageToVerify) {
      let toastMsg = await this.getToastMessage();
      expect(toastMsg).toEqual(messageToVerify);
      await this.clickCloseIcon();
      let spinner = await this.page.locator(this.spinner).isVisible();
      if (spinner) {
        await this.waitForSpinnerToDisappear();
      }
    }
  }

  // This function is used to "click on the element"
  async click(locator: any) {
    await (await this.page.waitForSelector(locator)).waitForElementState("stable");
    await this.page.locator(locator).click({ force: true });
  }

  // This function is used to "click on the element with index"
  async clickElementWithIndex(locatorValue: string, index: number) {
    await this.page.locator(locatorValue).nth(index).click();
  }

  // This function is used to filling the multiple textbox values using "for of" loop
  async fillFieldValues(locators: any, values: any) {
    for (const locator of locators) {
      const index = locators.indexOf(locator);
      await this.fillTextBoxValues(locator, values[index], true);
      await this.page.waitForTimeout(1000);
    };
  }

  // This function is used to click on the "Close" Icon of the toast message
  async clickCloseIcon() {
    await (await this.page.waitForSelector(this.toastElements.closeIcon)).waitForElementState("stable");
    await this.page.locator(this.toastElements.closeIcon).click();
  }

  // This function returns the "toast message text"
  async getToastMessage() {
    return await this.page.locator(this.toastElements.toastMessage).textContent();
  }

  // This function is used to "copy and paste" the values from the any textbox elements
  async copyPaste(sourceLocator: string, destinationLocator: string) {
    await this.page.locator(sourceLocator).dblclick();
    await this.page.locator(sourceLocator).press(Constants.ctrlC);
    await this.page.locator(destinationLocator).press(Constants.ctrlV);
  }

  // This function is used to "get the text" of any elements
  async getText(locator: string) {
    return await this.page.locator(locator).textContent();
  }

  //This function is used to check the element is visible or not
  async isElementVisible(locator: string) {
    return await this.page.locator(locator).isVisible();
  }

  // This function is used to "click the element/link"
  async clickByRole(role: any, value: any, shouldWaitForContainer?: boolean) {
    await this.page.getByRole(role, { name: value, exact: true }).click();
    if (shouldWaitForContainer) {
      await this.page.waitForSelector(this.backgroundContainer);
    }
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });
  }

  // This function is used to "select the option" from "Auto suggestion"
  async clickOption(role: any, value: string | RegExp) {
    await this.page.getByRole(role, { name: value }).getByText(value, { exact: true }).click();
  }

  // This function is used to "click on the My info sub menus"
  async clickMenu(role: any, locator: any, menuLinkText: string) {
    await this.page.waitForSelector(locator);
    await this.page.getByRole(role, { name: menuLinkText }).click();
    await (await this.page.waitForSelector(this.backgroundContainer)).waitForElementState("stable");
    await this.page.waitForLoadState("domcontentloaded", { timeout: 12000 });
    await this.page.waitForLoadState("networkidle", { timeout: 10000 });
  }

  async waitForElement(locator: string) {
    await (await this.page.waitForSelector(locator)).waitForElementState("stable");
  }

  async deleteUsers() {
    await this.clickMenu(Constants.Roles.link, homePage.homePageElements.pim, Constants.Menu.pim);
    await this.click(this.employeeListMenu);
    await this.fillTextBoxValues(directoryPage.directory.employeeName, Constants.Users.employeeToSearch, true);
    await this.page.locator(directoryPage.directory.search).click();
    let noRecordsCloseIcon = await this.page.locator(this.toastElements.closeIcon).isVisible();
    if (noRecordsCloseIcon) {
      await this.clickCloseIcon();
    }
    await this.waitForElement(this.tableContainer);
    await this.page.waitForTimeout(3000);
    let tableRow = await (this.page.locator(this.row(Constants.Users.firstNameUser1))).first().isVisible();
    if (tableRow) {
      await this.deleteRecords(Constants.Users.firstNameUser1);
    }
  }

  async deleteUsersName(userName) {
    await this.clickMenu(Constants.Roles.link, homePage.homePageElements.admin, Constants.Menu.admin);
    await this.click(this.userManagementMenu);
    await this.click(this.usersMenu);
    await this.fillTextBoxValues(adminPage.userManagementLocators.userName, userName, true);
    await this.page.locator(directoryPage.directory.search).click();
    await this.waitForElement(this.tableContainer);
    await this.page.waitForTimeout(5000);
    let tableRow = await (this.page.locator(this.row(userName))).first().isVisible();
    if (tableRow) {
      await this.deleteRecords(userName);
    }
  }

  async deleteRecords(value: string) {
    let rowVisibility = await this.page.locator(this.tableRow).first().isVisible();
    let rows = await this.getARow(Constants.Users.firstNameUser1);
    let rowsCount = await rows.count();
    if (rowVisibility) {
      for (let i = 0; i < rowsCount; i++) {
        let get = await this.getARow(value);
        await get.locator(this.trashPath).first().click();
        await this.waitForElement(this.attachments.confirmationPopup);
        await this.click(this.attachments.popupDeleteButton);
        let toastMsg = await this.getToastMessage();
        expect(toastMsg).toEqual(Constants.sucessMsg.successfulDeletedMsg);
        await this.clickCloseIcon();
        await this.waitForSpinnerToDisappear();
      }
    }
  }

  // This function is used to get the "specific row"
  async getARow(value: string) {
    await this.page.waitForSelector(this.row(value));
    return this.page.locator(this.row(value));
  }

  // This function is used for Create user
  async createUsers(firstName, lastName, userName) {
    await this.clickMenu(Constants.Roles.link, homePage.homePageElements.pim, Constants.Menu.pim);
    await this.click(this.addEmployee);
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });
    await this.page.waitForTimeout(2000);
    await this.fillTextBoxValues(this.firstName, firstName, true);
    await this.fillTextBoxValues(this.lastName, lastName, true);
    await this.click(this.switch);
    await this.fillTextBoxValues(this.userName, userName, true);
    await this.fillTextBoxValues(this.password, Constants.Users.password, true);
    await this.fillTextBoxValues(this.confirmPassword, Constants.Users.password, true);
    await this.clickSave(this.save, 0);
    await this.clickCloseIcon();
    await this.waitForElement(this.backgroundContainer);
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });
    await this.click(this.job);
    await this.waitForSpinnerToDisappear();
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });
    await this.fillDateValue(this.joinedDate, Constants.Dates.joinedDate);
    // await this.selecDropdownOption(Constants.Roles.option, this.jobTitle, Constants.others.jobTitleSE);
    await this.selecDropdownOption(Constants.Roles.option, this.location, Constants.others.jobLocation);
    await this.clickSave(this.save, 0);
  }

  // This function is used for updating the role
  async updatingUserRole(userName, userRole) {
    await this.clickMenu(Constants.Roles.link, homePage.homePageElements.admin, userRole);
    await this.fillTextBoxValues(this.userName, userName, true);
    await this.click(this.search);
    await this.waitForElement(this.row(userName));
    await this.click(this.editIcon);
    await this.page.waitForLoadState("domcontentloaded", { timeout: 12000 });
    await this.page.waitForLoadState("networkidle", { timeout: 12000 });
    await this.waitForElement(this.backgroundContainer);
    await this.selecDropdownOption(Constants.Roles.option, this.userRole, Constants.others.reportingMethodAdmin);
    await this.clickSave(this.save, 0);
    await this.clickCloseIcon();
  }

  async terminateEmployee(userName) {
    await this.clickMenu("link", homePage.homePageElements.pim, "PIM");
    await this.click(this.employeeListMenu);
    await this.fillTextBoxValues(directoryPage.directory.employeeName, userName, true);
    await this.page.waitForTimeout(1000);
    await this.click(directoryPage.directory.search);
    await this.waitForElement(this.tableContainer);
    await this.click(this.editIcon);
    await this.page.waitForLoadState("networkidle", { timeout: 10000 });
    await this.waitForElement(this.backgroundContainer);
    await this.click(this.job);
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });
    await this.click(this.terminate);
    await this.waitForElement(this.terminateContainer);
    await this.fillDateValue(this.terminationDate, Constants.Dates.terminationDate);
    await this.selecDropdownOption(Constants.Roles.option, this.terminationReason, Constants.others.terminationReason);
    await this.fillTextBoxValues(this.commentBox, Constants.others.terminationReason, true);
    await this.clickSave(this.save, 1);
    await this.clickMenu("link", homePage.homePageElements.pim, "PIM");
  }

  async deleteUsersDuplicate() {
    await this.clickMenu("link", homePage.homePageElements.pim, "PIM");
    await this.click(this.employeeListMenu);
    await this.fillTextBoxValues(directoryPage.directory.employeeName, "Test User", true);
    await this.click(directoryPage.directory.search);
    await this.waitForElement(this.tableContainer);
    await this.page.waitForTimeout(5000);
    let tableRow = await (await this.getARow('Test')).first().isVisible();
    if (tableRow) {
      await this.deleteRecords("User1");
    }
  }

  async deleteRecordsDuplicate(value: any) {
    let rowVisibility = await this.page.locator(this.tableRow).first().isVisible();
    if (rowVisibility) {
      let rows = await this.getARow('User1');
      let rowsCount = await rows.count();
      for (let i = 0; i < rowsCount; i++) {
        let get = await this.getARow(value);
        await get.locator(this.trashPath).first().click();
        await this.waitForElement(this.attachments.confirmationPopup);
        await this.click(this.attachments.popupDeleteButton);
        let toastMsg = await this.getToastMessage();
        expect(toastMsg).toEqual(Constants.sucessMsg.successfulDeletedMsg);
        await this.clickCloseIcon();
        await this.waitForSpinnerToDisappear();
      }
    }
  }

  async createUsersDuplicate(firstName: any, lastName: any, userName: any) {
    await this.clickMenu("link", homePage.homePageElements.pim, "PIM");
    await this.click(this.addEmployee);
    await this.page.waitForLoadState("networkidle", { timeout: 10000 });
    // await this.page.waitForTimeout(4000);
    await this.fillTextBoxValues(this.firstName, firstName, true);
    await this.fillTextBoxValues(this.lastName, lastName, true);
    await this.click(this.switch);
    await this.fillTextBoxValues(this.userName, userName, true);
    await this.fillTextBoxValues(this.password, "Testuser@12", true);
    await this.fillTextBoxValues(this.confirmPassword, "Testuser@12", true);
    // await myInfoPage.click("[type='submit]");
    await this.clickSave(this.save, 0, Constants.sucessMsg.sucessfulSavedMsg);
    await this.click(this.job);
    await this.page.waitForLoadState("networkidle", { timeout: 10000 });
    // await this.page.waitForTimeout(4000);
    await this.fillDateValue(this.joinedDate, "2023-03-10");
    await this.selecDropdownOption("option", this.jobTitle, "Software Engineer");
    await this.selecDropdownOption("option", this.location, "Texas R&D");
    await this.clickSave(this.save, 0);
  }

  async updatingUserRoleDuplicate(userName: any, userRole: any) {
    await this.clickMenu("link", homePage.homePageElements.admin, userRole);
    await this.fillTextBoxValues(this.userName, userName, true);
    await this.click(this.search);
    await this.page.waitForTimeout(2000);
    await this.click(this.editIcon);
    await this.page.waitForLoadState("networkidle", { timeout: 10000 });
    await this.waitForElement(this.backgroundContainer);
    await this.selecDropdownOption("option", this.userRole, "Admin");
    await this.clickSave(this.save, 0, Constants.sucessMsg.successfulUpdatedMsg);
  }
}