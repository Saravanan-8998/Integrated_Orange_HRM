import { expect, Locator, Page } from "@playwright/test";
import subURL from "../support/subURL.json";
import constants from "../support/constants.json";

export class Recruitment {
    readonly page: Page; candidates: any; vacancies: any; toastMessage: any; submit: any; shortlistLocators: any; rejectLocators: any; recruitmentNavigation: any; otherLoc: any;
    vacancyName: any = '';
    middleName: any = '';

    constructor(page: Page) {
        this.page = page;
        this.candidates = {
            candidatesTab: `//a[contains(text(),'Candidates')]`,
            addACandidate: `i.oxd-icon.bi-plus`,
            firstName: `input[name='firstName']`,
            middleName: `input[name='middleName']`,
            lastName: `input[name='lastName']`,
            vaccancy: `.oxd-select-text-input`,
            email: `(//input[@placeholder='Type here'])[1]`,
            contactNumber: `(//input[@placeholder='Type here'])[2]`,
            resume: `input[type=file]`,
            keywords: `(//label[text()='Keywords']/following::input)[1]`,
            dateOfApplication: `//input[@placeholder='yyyy-mm-dd']`,
            notes: `textarea[placeholder='Type here']`,
            consentToKeepData: `//input[@type='checkbox']/following-sibling::span[1]`,
            subDiv: `oxd-table-filter`,
            head: `//h5[text()='Candidates']`,
            reset: `//button[text()=' Reset ']`,
            search: `//button[text()=' Search ']`,
            mainDiv: `.orangehrm-container`,
            totalRecordsList: `(//span[@class='oxd-text oxd-text--span'])[1]`,
            filter1: `(//div[@class='oxd-select-text-input'])[2]`,
            filter2: `(//div[@class='oxd-select-text-input'])[4]`,
        };
        this.vacancies = {
            vacanciesTab: `//a[contains(text(),'Vacancies')]`,
            addANewVacancie: `//button[text()=' Add ']`,
            vacancieName: `(//input[@class='oxd-input oxd-input--active'])[2]`,
            vacancieRole: `div.oxd-select-text-input`,
            vacancieDescription: `//textarea[@placeholder='Type description here']`,
            recruiter: `//input[@placeholder='Type for hints...']`,
            totalOpenings: `(//input[@class='oxd-input oxd-input--active'])[3]`,
            filter1: `(//div[@class='oxd-select-text-input'])[1]`,
            filter2: `(//div[@class='oxd-select-text-input'])[2]`,
            editIcon: `i.oxd-icon.bi-pencil-fill`,
            editOpenings: `(//label[text()='Number of Positions']/following::input)[1]`,
            deleteIcon: `//i[@class='oxd-icon bi-trash']`,
            confirmDelete: `//button[text()=' Yes, Delete ']`
        };
        this.shortlistLocators = {
            viewCandidate: `//i[@class='oxd-icon bi-eye-fill']`,
            shortListACandidate: `//button[text()=' Shortlist ']`,
            textArea: `//textarea[@placeholder='Type here']`,
            status: `.orangehrm-recruitment-status`,
        }
        this.otherLoc = {
            scheduleInterview: `//button[text()=' Schedule Interview ']`,
            interviewTitle: `(//label[text()='Interview Title']/following::input)[1]`,
            inputUser: `//input[@placeholder='Type for hints...']`,
            dateFill: `(//label[text()='Date']/following::input)[1]`,
            timeFill: `//label[text()='Time']/following::input`,
            marketInterview: `//button[text()=' Mark Interview Passed ']`,
            offerJobLoc: `//button[text()=' Offer Job ']`,
            hireLoc: `//button[text()=' Hire ']`
        }
        this.recruitmentNavigation = `//span[text()='Recruitment']`;
        this.toastMessage = 'p.oxd-text--toast-message';
        this.submit = `//button[@type='submit']`;

    }

    // A function used to generate auto generate vacancy name
    async vacancyNameAutoGenerate() {
        if (this.vacancyName === '') {
            let num = Math.floor(Math.random() * 3 + 919);
            this.vacancyName = constants.recruitmentPO.vacancyName + num.toString();
            return this.vacancyName;
        } else {
            return this.vacancyName;
        }
    }

    // A function used to generate auto generate first name
    async autoGenerateFName() {
        if (this.middleName === '') {
            let num = Math.floor(Math.random() * 3 + 255);
            this.middleName = constants.recruitmentPO.Test + num.toString();
            return this.middleName;
        } else {
            return this.middleName;
        }
    }

    // A function used to generate auto generate Middle name
    async autoGenerateMName() {
        if (this.middleName === '') {
            let num = Math.floor(Math.random() * 3 + 435);
            this.middleName = num.toString();
            return this.middleName;
        } else {
            return this.middleName;
        }
    }

    // A function used to generate auto generate last name
    async autoGenerateLName() {
        if (this.middleName === '') {
            let num = Math.floor(Math.random() * 3 + 559);
            this.middleName = constants.recruitmentPO.Last + num.toString();
            return this.middleName;
        } else {
            return this.middleName;
        }
    }

    // A function used to navigate to recruitment page
    async navigate() {
        await this.page.locator(this.recruitmentNavigation).click();
    }

    // A function used to click candidates
    async clickCandidates() {
        await this.page.locator(this.candidates.candidatesTab).click();
    }

    // A function used to click vacancies
    async clickVacancies() {
        await this.page.locator(this.candidates.vacanciesTab).click();
    }

    // A function used to upload a file
    async uploadFile() {
        const fileInput: any = await this.page.$(this.candidates.resume);
        const filePath = subURL.filePath;
        await fileInput.setInputFiles(filePath);
    }

    // A function used to save the records
    async clickSave(messageToVerify?: string) {
        await this.page.locator(this.submit).click({ force: true });
        if (messageToVerify) {
            expect(await this.getToastMessage()).toEqual(messageToVerify);
        }
    }

    // A function used to get the toast message
    async getToastMessage() {
        return await this.page.locator(this.toastMessage).textContent();
    }

    // A function used to add a new vacancy
    async addNewVacancie(username: any) {
        await this.page.locator(this.vacancies.vacanciesTab).click();
        await this.page.locator(this.vacancies.addANewVacancie).click();
        await this.page.locator(this.vacancies.vacancieName).fill(await this.vacancyNameAutoGenerate());
        await this.page.locator(this.vacancies.vacancieRole).click();
        await this.page.getByRole('option', { name: constants.vacancy.vacancieRole }).getByText(constants.vacancy.vacancieRole, { exact: true }).click();
        await this.page.locator(this.vacancies.vacancieDescription).type(constants.vacancy.vacancieDescription);
        await this.page.locator(this.vacancies.recruiter).fill(username);
        await this.page.getByRole('option', { name: username }).getByText(username, { exact: true }).click();
        await this.page.locator(this.vacancies.totalOpenings).fill(constants.recruitmentPO.addVacancy);
        await this.page.locator(this.submit).click();
    }

    // A function used to search a vacancy
    async searchVacancie() {
        await this.navigate();
        await this.page.goto(subURL.viewJobVacancy);
        await this.page.waitForTimeout(4000);
        await this.page.locator(this.vacancies.filter2).click();
        await this.page.getByRole('option', { name: await this.vacancyNameAutoGenerate() }).getByText(await this.vacancyNameAutoGenerate(), { exact: true }).click();
        await this.page.locator(this.submit).click();
        await this.page.waitForTimeout(3000);
    }

    // A function used to verify search vacancy
    async verifyVacancieSearch() {
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        expect(totalRecords).toContain(constants.assertion.totalRecords);
    }

    // A function used to edit a vacancy
    async editAVacancy() {
        await this.searchVacancie();
        await this.page.locator(this.vacancies.editIcon).click();
        await this.page.locator(this.vacancies.editOpenings).fill(constants.recruitmentPO.changeVacancy);
        await this.page.locator(this.submit).click();
    }

    // A function used to delete a vacancy
    async deleteAVacancy() {
        await this.searchVacancie();
        await this.page.locator(this.vacancies.deleteIcon).click();
        await this.page.locator(this.vacancies.confirmDelete).click();
    }

    // A function used to add a new candidate
    async addNewCandidate() {
        await this.navigate();
        await this.page.locator(this.candidates.addACandidate).click();
        await this.page.locator(this.candidates.firstName).fill(await this.autoGenerateFName());
        await this.page.locator(this.candidates.middleName).fill(await this.autoGenerateMName());
        await this.page.locator(this.candidates.lastName).fill(await this.autoGenerateLName());
        await this.page.locator(this.candidates.vaccancy).click();
        await this.page.getByRole('option', { name: await this.vacancyNameAutoGenerate() }).getByText(await this.vacancyNameAutoGenerate(), { exact: true }).click();
        await this.page.locator(this.candidates.email).fill(constants.candidate.email);
        await this.page.locator(this.candidates.contactNumber).fill(constants.candidate.number);
        await this.uploadFile();
        await this.page.locator(this.candidates.keywords).fill(constants.candidate.keywords);
        await this.page.locator(this.candidates.notes).fill(constants.candidate.notes);
    }

    // A function used to search a candidate
    async searchCandidate() {
        await this.page.goto(subURL.viewCandidates);
        await this.page.locator(this.candidates.filter1).click();
        await this.page.getByRole('option', { name: await this.vacancyNameAutoGenerate() }).getByText(await this.vacancyNameAutoGenerate(), { exact: true }).click();
        await this.page.locator(this.candidates.search).click();
        await this.page.waitForTimeout(3000);
    }

    // A function used to verify a candidate search
    async verifyCandidateSearch() {
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        expect(totalRecords).toContain(constants.assertion.totalRecords);
    }

    // A function used to shortlist a candidate
    async shortlist() {
        await this.page.locator(this.shortlistLocators.viewCandidate).click();
        await this.page.locator(this.shortlistLocators.shortListACandidate).click();
        await this.page.locator(this.shortlistLocators.textArea).type(constants.candidate.shortListMsg);
        await this.page.locator(this.submit).click();
        await this.page.waitForTimeout(3000);
        let status = await this.page.locator(this.shortlistLocators.status).textContent();
        expect(status).toContain(constants.assertion.status1);
    }

    // A function used to autogenerate a title
    async autoGenerateTitle() {
        let num = Math.floor(Math.random() * 2 + 9);
        let interviewTitle = constants.recruitmentPO.autogenerateTitle + num.toString();
        return interviewTitle;
    }

    // A function used to schedule a interview
    async interviewSchedule(username: any) {
        await this.page.locator(this.shortlistLocators.viewCandidate).click();
        await this.page.locator(this.otherLoc.scheduleInterview).click();
        await this.page.locator(this.otherLoc.interviewTitle).fill(await this.autoGenerateTitle());
        await this.page.locator(this.otherLoc.inputUser).fill(username);
        await this.page.getByRole('option', { name: username }).getByText(username, { exact: true }).click();
        await this.page.locator(this.otherLoc.dateFill).clear();
        await this.page.locator(this.otherLoc.dateFill).type(constants.recruitmentPO.date);
        await this.page.locator(this.otherLoc.timeFill).clear()
        await this.page.locator(this.otherLoc.timeFill).type(constants.recruitmentPO.time)
        await this.page.locator(this.shortlistLocators.textArea).type(constants.candidate.scheduleForInterview);
        await this.page.locator(this.submit).click();
        await this.page.waitForTimeout(3000);
    }

    // A function used to schedule for a interview
    async scheduleForInterview(username: any) {
        await this.searchCandidate();
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        if (totalRecords == constants.recruitmentPO.totalRecords) {
            await this.interviewSchedule(username);
        }
    }

    // A function used to mark a interview
    async markInterview() {
        await this.searchCandidate();
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        if (totalRecords == constants.recruitmentPO.totalRecords) {
            await this.page.locator(this.shortlistLocators.viewCandidate).click();
            await this.page.locator(this.otherLoc.marketInterview).click();
            await this.page.locator(this.shortlistLocators.textArea).type(constants.candidate.markInterview);
            await this.page.locator(this.submit).click();
            await this.page.waitForTimeout(3000);
        }
    }

    // A function used to offer a job
    async offerJob() {
        await this.searchCandidate();
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        if (totalRecords == constants.recruitmentPO.totalRecords) {
            await this.page.locator(this.shortlistLocators.viewCandidate).click();
            await this.page.locator(this.otherLoc.offerJobLoc).click();
            await this.page.locator(this.shortlistLocators.textArea).type(constants.candidate.offerJob);
            await this.page.locator(this.submit).click();
            await this.page.waitForTimeout(3000);
        }
    }

    // A function used to hire
    async hire() {
        await this.searchCandidate();
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        if (totalRecords == constants.recruitmentPO.totalRecords) {
            await this.page.locator(this.shortlistLocators.viewCandidate).click();
            await this.page.locator(this.otherLoc.hireLoc).click();
            await this.page.locator(this.shortlistLocators.textArea).type(constants.candidate.hire);
            await this.page.locator(this.submit).click();
            await this.page.waitForTimeout(3000);
        }
    }

    // A function used to verify whether the user id hired
    async verifyUserIsHired() {
        await this.navigate();
        await this.searchCandidate();
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        expect(totalRecords).toContain(constants.assertion.totalRecords);
    }
}