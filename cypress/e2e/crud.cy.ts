import {selector} from "postcss-selector-parser";
import {screen} from "@testing-library/react";
import {be} from "date-fns/locale";
import * as process from "process";
import {not} from "rxjs/internal/util/not";
import {STATUS_COMPLETED, STATUS_OPEN} from "@/utils/CommonVars";

function assertListIsEmpty() {
    cy.get('table tbody tr').should('have.length', 0);
    cy.get(`[data-testid="no-client-msg"]`).should('be.visible');
}

function deleteClient() {
    cy.get('button[aria-label="delete-client"]').click()
    cy.get('button[aria-label="deleteClient-confirm"]').click()
    cy.get('[aria-label="deleteClient-snackbar"]').should('be.visible');
}

function createClient() {
    cy.get('button[aria-label="add-client"]').click({force: true})
    cy.wait(1000)
    cy.get('input[name="nickname"]').type('test nickname')
    cy.get('textarea[name="remarks"]').type('test remarks')
    // cy.get('input[name="id"]').should('have.value', '1')

    cy.get('textarea[name="basePrice"]').should('not.be.empty')
    cy.get('textarea[name="unitPrice"]').should('not.be.empty')
    cy.get('textarea[name="consumptionYearly"]').should('not.be.empty')
    cy.get('textarea[name="productionYearly"]').should('not.be.empty')

    cy.get('[name="basePrice"]').clear().type('20')
    cy.get('[name="unitPrice"]').clear().type('40')
    cy.get('[name="consumptionYearly"]').clear().type('2500')
    cy.get('[name="productionYearly"]').clear().type('5000')

    cy.get('form').submit()
    cy.get(`[aria-label="clientCreate-snackbar"]`).should('be.visible');

    cy.get('[aria-label="modal-close"]').click()

    cy.get('table tbody tr').should('have.length', 1)
    cy.get('table tbody tr td').eq(0).should('contain', '10:00')
    cy.get('table tbody tr td').eq(2).should('contain', 'test nickname')
    cy.get('table tbody tr td').eq(3).should('contain', 'test remarks')
    cy.get('table tbody tr td').eq(4).should('contain', STATUS_OPEN)
    cy.get('[aria-label="present-client"]').should('be.visible');
    cy.get('[aria-label="edit-client"]').should('be.visible');
}

function solarElecChart() {
    cy.url().then((url) => {
        expect(url).to.match(/.*?\/solarElecChart\?pDate=\d{4}-\d{2}-\d{2}&clientId=\d+$/);
    });
    cy.get('[data-testid="solar-elec-chart"]').should('be.visible')
    cy.get('[aria-label="state-stepper"]').should('be.visible')
}

function stats() {
    cy.url().then((url) => {
        expect(url).to.match(/.*?\/stats\?pDate=\d{4}-\d{2}-\d{2}&clientId=\d+$/);
    });
    cy.get('[data-testid="stats"]').should('be.visible')
}

function generationConsumChart() {
    cy.url().then((url) => {
        expect(url).to.match(/.*?\/generationConsumChart\?pDate=\d{4}-\d{2}-\d{2}&clientId=\d+$/);
    });
    cy.get('[data-testid="generationConsum-chart"]').should('be.visible')
}

function goToClientList() {
    cy.get('[data-testid="right-menu"]').click()
    cy.get('[aria-label="clientList-item"]').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')
}

function openGeneralParamsEdit() {
    cy.get('[data-testid="right-menu"]').click()
    cy.get('[aria-label="generalParams-item"]').click()
    cy.get(`[data-testid="modal-editGeneralParams"]`).should('be.visible');
}

function setDate() {
    cy.get('[data-testid="clientList-datePicker"]').type('12.12.2023')
}

describe('CLIENT CRUD', () => {
    before(() => {
        cy.request('GET', Cypress.env('NEXT_PUBLIC_FIREBASE_URL') + '/generalParams.json').should((response) => {
            expect(response.status).to.eq(200)
            const generalParams = response.body
            expect(generalParams.feedInPrice).not.to.be.null
            expect(generalParams.rent).not.to.be.null
            expect(generalParams.inflationRate).not.to.be.null
            expect(generalParams.electricityIncreaseRate).not.to.be.null
            expect(generalParams.rentDiscountAmount).not.to.be.null
            expect(generalParams.rentDiscountPeriod).not.to.be.null
            expect(generalParams.yearLimit).not.to.be.null
        });
        cy.request('GET', Cypress.env('NEXT_PUBLIC_FIREBASE_URL') + '/highestClientId.json').should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.uid_1).not.to.be.null
        });
    })
    beforeEach(() => {
        cy.request('DELETE', Cypress.env('NEXT_PUBLIC_FIREBASE_URL_TEST') + '/clientList/uid_1.json')
    })
    it('create client', () => {
        cy.visit('/')
        setDate()
        assertListIsEmpty()
        createClient()
        deleteClient()
    })
    it('edit client', () => {
        cy.visit('/')
        setDate()
        assertListIsEmpty()
        createClient()
        cy.get('[aria-label="edit-client"]').click()
        cy.get('input[name="nickname"]').clear().type('test nickname edited')
        cy.get('textarea[name="remarks"]').clear().type('test remarks edited')

        cy.get('[name="basePrice"]').clear().type('25')
        cy.get('[name="unitPrice"]').clear().type('50')
        cy.get('[name="consumptionYearly"]').clear().type('3500')
        cy.get('[name="productionYearly"]').clear().type('6000')

        cy.get('form').submit()
        cy.get(`[aria-label="clientCreate-snackbar"]`).should('be.visible');

        cy.get('[aria-label="modal-close"]').click()
        cy.reload()
        setDate()

        cy.get('[aria-label="edit-client"]').click()
        cy.get('input[name="nickname"]').should('have.value', 'test nickname edited')
        cy.get('textarea[name="remarks"]').should('have.value', 'test remarks edited')

        cy.get('[name="basePrice"]').should('have.value', 25);
        cy.get('[name="unitPrice"]').should('have.value', 50);
        cy.get('[name="consumptionYearly"]').should('have.value', 3500);
        cy.get('[name="productionYearly"]').should('have.value', 6000);

        cy.get('form').submit()
        cy.get(`[aria-label="clientCreate-snackbar"]`).should('be.visible');

        cy.get('[aria-label="modal-close"]').click()

        deleteClient()
    })

    it('present client', () => {
        cy.visit('/')
        setDate()
        assertListIsEmpty()
        createClient()
        cy.get('[aria-label="present-client"]').click()
        solarElecChart()
        cy.get('[data-testid="forward-fab"]').click()
        stats()
        cy.get('[data-testid="forward-fab"]').click()
        generationConsumChart()
        cy.get('[data-testid="end-fab"]').click()
        cy.url().should('eq', Cypress.config().baseUrl + '/')
        setDate()
        cy.get('table tbody tr td').eq(4).should('contain', STATUS_COMPLETED)
        deleteClient()
    })

    it('traverse back and forth', () => {
        cy.visit('/')
        setDate()
        assertListIsEmpty()
        createClient()

        cy.get('[aria-label="present-client"]').click()
        solarElecChart()
        cy.get('[data-testid="forward-fab"]').click()
        stats()
        cy.get('[data-testid="forward-fab"]').click()
        generationConsumChart()
        cy.get('[data-testid="backward-fab"]').click()
        stats()
        cy.get('[data-testid="backward-fab"]').click()
        solarElecChart()

        goToClientList()
        setDate()
        deleteClient()
    })
    it.only('edit generalParams', () => {
        cy.visit('/')
        setDate()
        assertListIsEmpty()
        createClient()

        cy.get('[aria-label="present-client"]').click()
        solarElecChart()
        cy.get('[data-testid="forward-fab"]').click()
        stats()

        openGeneralParamsEdit()

        cy.get('textarea[name="feedInPrice"]').should('not.be.empty')
        cy.get('textarea[name="rent"]').should('not.be.empty')
        cy.get('textarea[name="inflationRate"]').should('not.be.empty')
        cy.get('textarea[name="electricityIncreaseRate"]').should('not.be.empty')
        cy.get('textarea[name="rentDiscountAmount"]').should('not.be.empty')
        cy.get('textarea[name="rentDiscountPeriod"]').should('not.be.empty')
        cy.get('textarea[name="yearLimit"]').should('not.be.empty')

        cy.get('[name="feedInPrice"]').clear().type('9')
        cy.get('[name="rent"]').clear().type('140')
        cy.get('[name="inflationRate"]').clear().type('4')
        cy.get('[name="electricityIncreaseRate"]').clear().type('2')
        cy.get('[name="rentDiscountAmount"]').clear().type('12')
        cy.get('[name="rentDiscountPeriod"]').clear().type('3')
        cy.get('[name="yearLimit"]').clear().type('25')

        cy.get('form').submit()
        cy.get('[aria-label="modalClose-generalParamsEdit"]').click()

        openGeneralParamsEdit()

        cy.get('[name="feedInPrice"]').should('have.value', 9)
        cy.get('[name="rent"]').should('have.value', 140)
        cy.get('[name="inflationRate"]').should('have.value', 4)
        cy.get('[name="electricityIncreaseRate"]').should('have.value', 2)
        cy.get('[name="rentDiscountAmount"]').should('have.value', 12)
        cy.get('[name="rentDiscountPeriod"]').should('have.value', 3)
        cy.get('[name="yearLimit"]').should('have.value', 25)

        cy.get('[aria-label="modalClose-generalParamsEdit"]').click()
        goToClientList()
        setDate()
        deleteClient()
    })

    // afterEach(() => {
    // request to set url to null

    // cy.get('delete-client').should('exist').then(() => {
    //     cy.get('button[aria-label="delete-client"]').click()
    //     cy.get('button[aria-label="deleteClient-confirm"]').click()
    //     cy.get('[aria-label="deleteClient-snackbar"]').should('be.visible');
    // });
    // })
})