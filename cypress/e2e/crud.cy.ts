import {STATUS_COMPLETED} from "@/utils/CommonVars";
import client from "./singleClient.json";

function solarElecChart() {
    cy.url().then((url) => {
        expect(url).to.match(/.*?\/solarElecChart\?pDate=\d{4}-\d{2}-\d{2}&clientId=\d+$/);
    });
    cy.get('[data-testid="solar-elec-chart"]').should('be.visible')
    cy.get('[aria-label="state-stepper"]').should('be.visible')
    cy.get('[aria-label="bar-transportCost"]').should('exist')
    cy.get('[aria-label="bar-heatingCost"]').should('exist')
    cy.get('[aria-label="bar-electricityCost"]').should('exist')
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

function openOrCloseGeneralParamsEdit() {
    cy.get('[data-testid="right-menu"]').click()
    cy.get('[aria-label="generalParams-item"]').click()
    cy.get(`[data-testid="modal-editGeneralParams"]`).should('be.visible');
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
    before(() => {
        cy.viewport(1920, 1080)
    })
    beforeEach(() => {
        cy.request('DELETE', Cypress.env('NEXT_PUBLIC_FIREBASE_URL_TEST') + '/clientList/uid_1.json')
    })
    it('create client', () => {
        cy.visit('/')
        cy.setDate()
        cy.assertListIsEmpty()
        cy.createClient(client["2023-12-12"].cid_1)
        cy.deleteClient()
    })
    it('edit client', () => {
        cy.visit('/')
        cy.setDate()
        cy.assertListIsEmpty()
        cy.createClient(client["2023-12-12"].cid_1)
        cy.get('[aria-label="edit-client"]').click()
        cy.get('input[name="nickname"]').clear().type('test nickname edited')
        cy.get('textarea[name="remarks"]').clear().type('test remarks edited')

        cy.get('[name="basePrice"]').clear().type('{rightArrow}25')
        cy.get('[name="unitPrice"]').clear().type('{rightArrow}50')
        cy.get('[name="consumptionYearly"]').clear().type('{rightArrow}3500')
        cy.get('[name="productionYearly"]').clear().type('{rightArrow}6000')

        cy.get('form').submit()
        cy.get(`[aria-label="clientCreate-snackbar"]`).should('be.visible');

        cy.get('[aria-label="modal-close"]').click()
        cy.reload()
        cy.setDate()

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

        cy.deleteClient()
    })

    it('present client', () => {
        cy.visit('/')
        cy.setDate()
        cy.assertListIsEmpty()
        cy.createClient(client["2023-12-12"].cid_1)
        cy.get('[aria-label="present-client"]').click()
        solarElecChart()
        cy.get('[data-testid="forward-fab"]').click()
        stats()
        cy.get('[data-testid="forward-fab"]').click()
        generationConsumChart()
        cy.get('[data-testid="end-fab"]').click()
        cy.url().should('eq', Cypress.config().baseUrl + '/')
        cy.setDate()
        cy.get('table tbody tr td').eq(4).should('contain', STATUS_COMPLETED)
        cy.deleteClient()
    })

    it('traverse back and forth', () => {
        cy.visit('/')
        cy.setDate()
        cy.assertListIsEmpty()
        cy.createClient(client["2023-12-12"].cid_1)

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
        cy.setDate()
        cy.deleteClient()
    })

    it('edit generalParams', () => {
        cy.visit('/')
        cy.setDate()
        cy.assertListIsEmpty()
        cy.createClient(client["2023-12-12"].cid_1)

        cy.get('[aria-label="present-client"]').click()
        solarElecChart()
        cy.get('[data-testid="forward-fab"]').click()
        stats()

        openOrCloseGeneralParamsEdit()

        cy.get('textarea[name="feedInPrice"]').should('not.be.empty')
        cy.get('textarea[name="rent"]').should('not.be.empty')
        cy.get('textarea[name="inflationRate"]').should('not.be.empty')
        cy.get('textarea[name="electricityIncreaseRate"]').should('not.be.empty')
        cy.get('textarea[name="rentDiscountAmount"]').should('not.be.empty')
        cy.get('textarea[name="rentDiscountPeriod"]').should('not.be.empty')
        cy.get('textarea[name="yearLimitRent"]').should('not.be.empty')
        cy.get('textarea[name="yearLimitPrediction"]').should('not.be.empty')

        cy.get('[name="feedInPrice"]').clear().type('{rightArrow}9')
        cy.get('[name="rent"]').clear().type('{rightArrow}140')
        cy.get('[name="inflationRate"]').clear().type('{rightArrow}4')
        cy.get('[name="electricityIncreaseRate"]').clear().type('{rightArrow}2')
        cy.get('[name="rentDiscountAmount"]').clear().type('{rightArrow}12')
        cy.get('[name="rentDiscountPeriod"]').clear().type('{rightArrow}3')
        cy.get('[name="yearLimitRent"]').clear().type('{rightArrow}25')
        cy.get('[name="yearLimitPrediction"]').clear().type('{rightArrow}30')

        cy.get('form').submit()
        cy.get('[aria-label="modalClose-generalParamsEdit"]').click()

        openOrCloseGeneralParamsEdit()

        cy.get('[name="feedInPrice"]').should('have.value', 9)
        cy.get('[name="rent"]').should('have.value', 140)
        cy.get('[name="inflationRate"]').should('have.value', 4)
        cy.get('[name="electricityIncreaseRate"]').should('have.value', 2)
        cy.get('[name="rentDiscountAmount"]').should('have.value', 12)
        cy.get('[name="rentDiscountPeriod"]').should('have.value', 3)
        cy.get('[name="yearLimitRent"]').should('have.value', 25)
        cy.get('[name="yearLimitPrediction"]').should('have.value', 30)

        goToClientList()
        cy.setDate()
        cy.deleteClient()
    })
    it('should show correct yearLimitPrediction', () => {
        cy.visit('/')
        cy.setDate()
        cy.assertListIsEmpty()
        cy.request('PATCH', Cypress.env('NEXT_PUBLIC_FIREBASE_URL_TEST') + '/clientList/uid_1.json', client)
        cy.wait(1000)
        cy.reload()
        cy.setDate()
        cy.get('table tbody tr').should('have.length', 1)
        cy.get('[aria-label="present-client"]').click()
        solarElecChart()

        //set yearLimitPrediction to 30
        openOrCloseGeneralParamsEdit()
        cy.get('textarea[name="yearLimitPrediction"]').should('not.be.empty')
        cy.get('[name="yearLimitPrediction"]').clear().type('{rightArrow}30')
        cy.get('form').submit()
        cy.get('[aria-label="modalClose-generalParamsEdit"]').click()
        //check if yearLimitPrediction is 30
        openOrCloseGeneralParamsEdit()
        cy.get('[name="yearLimitPrediction"]').should('have.value', 30)
        openOrCloseGeneralParamsEdit()

        // cy.get('[aria-label="x-axis"]').find('2053').should('contain.text')
        Array.of(2023, 2028, 2033, 2038, 2043, 2048, 2053).forEach(value => {
            cy.contains(value).should('be.visible');
        })

        openOrCloseGeneralParamsEdit()
        cy.get('textarea[name="yearLimitPrediction"]').should('not.be.empty')
        cy.get('[name="yearLimitPrediction"]').clear().type('{rightArrow}60')
        cy.get('form').submit()
        cy.get('[aria-label="modalClose-generalParamsEdit"]').click()
        //check if yearLimitPrediction is 30
        openOrCloseGeneralParamsEdit()
        cy.get('[name="yearLimitPrediction"]').should('have.value', 60)
        openOrCloseGeneralParamsEdit()

        Array.of(2023, 2028, 2033, 2038, 2043, 2048, 2053, 2058, 2063, 2068, 2073, 2078, 2083).forEach(value => {
            cy.contains(value).should('be.visible');
        })
        goToClientList()
        cy.setDate()
        cy.deleteClient()
    });

    // afterEach(() => {
    // request to set url to null

    // cy.get('delete-client').should('exist').then(() => {
    //     cy.get('button[aria-label="delete-client"]').click()
    //     cy.get('button[aria-label="deleteClient-confirm"]').click()
    //     cy.get('[aria-label="deleteClient-snackbar"]').should('be.visible');
    // });
    // })
})