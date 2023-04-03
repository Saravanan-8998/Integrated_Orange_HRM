import { expect, Locator, Page } from "@playwright/test";
import subURL from "../support/subURL.json";
import testData from "../support/testDate.json";
import constants from "../support/constants.json";

export class Recruitment {
    readonly page: Page; candidates: any; vacancies: any; toastMessage: any; submit: any; shortlistLocators: any; rejectLocators: any; recruitmentNavigation: any;
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
        this.recruitmentNavigation = `//span[text()='Recruitment']`;
        this.toastMessage = 'p.oxd-text--toast-message';
        this.submit = `//button[@type='submit']`;
    }

    async vacancyNameAutoGenerate() {
        if (this.vacancyName === '') {
            let num = Math.floor(Math.random() * 3 + 919);
            this.vacancyName = 'Test Vacancy ' + num.toString();
            return this.vacancyName;
        } else {
            return this.vacancyName;
        }
    }

    async autoGenerateFName() {
        if (this.middleName === '') {
            let num = Math.floor(Math.random() * 3 + 255);
            this.middleName = 'Test' + num.toString();
            return this.middleName;
        } else {
            return this.middleName;
        }
    }

    async autoGenerateMName() {
        if (this.middleName === '') {
            let num = Math.floor(Math.random() * 3 + 435);
            this.middleName = num.toString();
            return this.middleName;
        } else {
            return this.middleName;
        }
    }

    async autoGenerateLName() {
        if (this.middleName === '') {
            let num = Math.floor(Math.random() * 3 + 559);
            this.middleName = 'Last' + num.toString();
            return this.middleName;
        } else {
            return this.middleName;
        }
    }

    async navigate() {
        await this.page.locator(this.recruitmentNavigation).click();
    }

    async clickCandidates() {
        await this.page.locator(this.candidates.candidatesTab).click();
    }

    async clickVacancies() {
        await this.page.locator(this.candidates.vacanciesTab).click();
    }

    async uploadFile() {
        const fileInput: any = await this.page.$(this.candidates.resume);
        const filePath = subURL.filePath;
        await fileInput.setInputFiles(filePath);
    }

    async clickSave(messageToVerify?: string) {
        await this.page.locator(this.submit).click({ force: true });
        if (messageToVerify) {
            expect(await this.getToastMessage()).toEqual(messageToVerify);
        }
    }

    async getToastMessage() {
        return await this.page.locator(this.toastMessage).textContent();
    }

    async addNewVacancie(username: any) {
        await this.page.locator(this.vacancies.vacanciesTab).click();
        await this.page.locator(this.vacancies.addANewVacancie).click();
        await this.page.locator(this.vacancies.vacancieName).fill(await this.vacancyNameAutoGenerate());
        await this.page.locator(this.vacancies.vacancieRole).click();
        await this.page.getByRole('option', { name: testData.vacancy.vacancieRole }).getByText(testData.vacancy.vacancieRole, { exact: true }).click();
        await this.page.locator(this.vacancies.vacancieDescription).type(testData.vacancy.vacancieDescription);
        await this.page.locator(this.vacancies.recruiter).fill(username);
        await this.page.getByRole('option', { name: username }).getByText(username, { exact: true }).click();
        await this.page.locator(this.vacancies.totalOpenings).fill('10');
        await this.page.locator(this.submit).click();
    }

    async searchVacancie() {
        await this.navigate();
        await this.page.goto(subURL.viewJobVacancy);
        await this.page.waitForTimeout(4000);
        await this.page.locator(this.vacancies.filter2).click();
        await this.page.getByRole('option', { name: await this.vacancyNameAutoGenerate() }).getByText(await this.vacancyNameAutoGenerate(), { exact: true }).click();
        await this.page.locator(this.submit).click();
        await this.page.waitForTimeout(3000);
    }

    async verifyVacancieSearch() {
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        expect(totalRecords).toContain(constants.assertion.totalRecords);
    }

    async editAVacancy() {
        await this.searchVacancie();
        await this.page.locator(this.vacancies.editIcon).click();
        await this.page.locator(this.vacancies.editOpenings).fill('5');
        await this.page.locator(this.submit).click();
    }

    async deleteAVacancy() {
        await this.searchVacancie();
        await this.page.locator(this.vacancies.deleteIcon).click();
        await this.page.locator(this.vacancies.confirmDelete).click();
    }

    async addNewCandidate() {
        await this.navigate();
        await this.page.locator(this.candidates.addACandidate).click();
        await this.page.locator(this.candidates.firstName).fill(await this.autoGenerateFName());
        await this.page.locator(this.candidates.middleName).fill(await this.autoGenerateMName());
        await this.page.locator(this.candidates.lastName).fill(await this.autoGenerateLName());
        await this.page.locator(this.candidates.vaccancy).click();
        await this.page.getByRole('option', { name: await this.vacancyNameAutoGenerate() }).getByText(await this.vacancyNameAutoGenerate(), { exact: true }).click();
        await this.page.locator(this.candidates.email).fill(testData.candidate.email);
        await this.page.locator(this.candidates.contactNumber).fill(testData.candidate.number);
        await this.uploadFile();
        await this.page.locator(this.candidates.keywords).fill(testData.candidate.keywords);
        await this.page.locator(this.candidates.notes).fill(testData.candidate.notes);
    }

    async searchCandidate() {
        await this.page.goto(subURL.viewCandidates);
        await this.page.locator(this.candidates.filter1).click();
        await this.page.getByRole('option', { name: await this.vacancyNameAutoGenerate() }).getByText(await this.vacancyNameAutoGenerate(), { exact: true }).click();
        await this.page.locator(this.candidates.search).click();
        await this.page.waitForTimeout(3000);
    }

    async verifyCandidateSearch() {
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        expect(totalRecords).toContain(constants.assertion.totalRecords);
    }

    async shortlist() {
        await this.page.locator(this.shortlistLocators.viewCandidate).click();
        await this.page.locator(this.shortlistLocators.shortListACandidate).click();
        await this.page.locator(this.shortlistLocators.textArea).type(testData.candidate.shortListMsg);
        await this.page.locator(this.submit).click();
        await this.page.waitForTimeout(3000);
        let status = await this.page.locator(this.shortlistLocators.status).textContent();
        expect(status).toContain(constants.assertion.status1);
    }

    async autoGenerateTitle() {
        let num = Math.floor(Math.random() * 2 + 9);
        let interviewTitle = 'Autogenerate Title ' + num.toString();
        return interviewTitle;
    }

    async interviewSchedule(username: any){
        await this.page.locator(this.shortlistLocators.viewCandidate).click();
        await this.page.locator(`//button[text()=' Schedule Interview ']`).click();
        await this.page.locator(`(//label[text()='Interview Title']/following::input)[1]`).fill(await this.autoGenerateTitle());
        await this.page.locator(`//input[@placeholder='Type for hints...']`).fill(username);
        await this.page.getByRole('option', { name: username }).getByText(username, { exact: true }).click();
        await this.page.locator(`(//label[text()='Date']/following::input)[1]`).clear();
        await this.page.locator(`(//label[text()='Date']/following::input)[1]`).type('2023-08-12');
        await this.page.locator(`//label[text()='Time']/following::input`).clear()
        await this.page.locator(`//label[text()='Time']/following::input`).type('09:00 AM')
        await this.page.locator(this.shortlistLocators.textArea).type(testData.candidate.scheduleForInterview);
        await this.page.locator(this.submit).click();
        await this.page.waitForTimeout(3000);
    }

    async scheduleForInterview(username: any) {
        await this.searchCandidate();
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        if (totalRecords == '(1) Record Found') {
            await this.interviewSchedule(username);
        }
    }

    async markInterview() {
        await this.searchCandidate();
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        if (totalRecords == '(1) Record Found') {
            await this.page.locator(this.shortlistLocators.viewCandidate).click();
            await this.page.locator(`//button[text()=' Mark Interview Passed ']`).click();
            await this.page.locator(this.shortlistLocators.textArea).type(testData.candidate.markInterview);
            await this.page.locator(this.submit).click();
            await this.page.waitForTimeout(3000);
        }
    }

    async offerJob() {
        await this.searchCandidate();
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        if (totalRecords == '(1) Record Found') {
            await this.page.locator(this.shortlistLocators.viewCandidate).click();
            await this.page.locator(`//button[text()=' Offer Job ']`).click();
            await this.page.locator(this.shortlistLocators.textArea).type(testData.candidate.offerJob);
            await this.page.locator(this.submit).click();
            await this.page.waitForTimeout(3000);
        }
    }

    async hire() {
        await this.searchCandidate();
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        if (totalRecords == '(1) Record Found') {
            await this.page.locator(this.shortlistLocators.viewCandidate).click();
            await this.page.locator(`//button[text()=' Hire ']`).click();
            await this.page.locator(this.shortlistLocators.textArea).type(testData.candidate.hire);
            await this.page.locator(this.submit).click();
            await this.page.waitForTimeout(3000);
        }
    }

    async verifyUserIsHired() {
        await this.navigate();
        await this.searchCandidate();
        let totalRecords = await this.page.locator(this.candidates.totalRecordsList).textContent();
        expect(totalRecords).toContain(constants.assertion.totalRecords);
    }
}