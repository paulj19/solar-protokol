/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import {STATUS_OPEN} from "@/utils/CommonVars";
import client from "@/cypress/e2e/singleClient.json";
import {bs} from "date-fns/locale";
import {Client, ClientParams} from "@/types/types";
import base = Mocha.reporters.base;

Cypress.Commands.add('createClient', (client_: Client, numClients = 1, rowIndex = 0) => {
    const {nickname, remarks, basePrice, unitPrice, unitPriceSolar, consumptionYearly, productionYearly, transportCost, heatingCost} = client_
    cy.get('button[aria-label="add-client"]').click({force: true})
    cy.wait(1000)

    cy.get('textarea[name="basePrice"]').should('not.be.empty')
    cy.get('textarea[name="unitPrice"]').should('not.be.empty')
    cy.get('textarea[name="unitPriceSolar"]').should('not.be.empty')
    cy.get('textarea[name="consumptionYearly"]').should('not.be.empty')
    cy.get('textarea[name="productionYearly"]').should('not.be.empty')
    cy.get('textarea[name="transportCost"]').should('not.be.empty')
    cy.get('textarea[name="heatingCost"]').should('not.be.empty')

    cy.get('input[name="nickname"]').type(nickname)
    cy.get('textarea[name="remarks"]').type(remarks)
    cy.get('[name="basePrice"]').clear().type('{rightArrow}' + basePrice)
    cy.get('[name="unitPrice"]').clear().type('{rightArrow}' + unitPrice * 100)
    cy.get('[name="unitPriceSolar"]').clear().type('{rightArrow}' + unitPriceSolar * 100)
    cy.get('[name="consumptionYearly"]').clear().type('{rightArrow}' + consumptionYearly)
    cy.get('[name="productionYearly"]').clear().type('{rightArrow}' + productionYearly)
    cy.get('[name="transportCost"]').clear().type('{rightArrow}' + transportCost)
    cy.get('[name="heatingCost"]').clear().type('{rightArrow}' + heatingCost)

    cy.get('form').submit()
    cy.get(`[aria-label="clientCreate-snackbar"]`).should('be.visible');

    cy.get('[aria-label="modal-close"]').click()

    cy.get('table tbody tr').eq(rowIndex).then(($row) => {
        cy.wrap($row).find('td').eq(0).should('not.be.empty')
        cy.wrap($row).find('td').eq(2).should('contain', nickname)
        cy.wrap($row).find('td').eq(3).should('contain', remarks)
        cy.wrap($row).find('td').eq(4).should('contain', STATUS_OPEN)
    });
    cy.get('table tbody tr').should('have.length', numClients)
    cy.request('GET', Cypress.env('NEXT_PUBLIC_FIREBASE_URL_TEST') + '/highestClientId.json').then((response) => {
        const hightestClientId = response.body.uid_1;
        cy.request('GET', Cypress.env('NEXT_PUBLIC_FIREBASE_URL_TEST') + `/clientList/uid_1/2023-12-12/cid_${hightestClientId}.json`).should((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.id).to.eq(hightestClientId)
            expect(response.body.nickname).to.eq(nickname)
            expect(response.body.remarks).to.eq(remarks)
            expect(response.body.basePrice).to.eq(basePrice)
            expect(response.body.unitPrice).to.eq(unitPrice)
            expect(response.body.unitPriceSolar).to.eq(unitPriceSolar)
            expect(response.body.consumptionYearly).to.eq(consumptionYearly)
            expect(response.body.productionYearly).to.eq(productionYearly)
            expect(response.body.transportCost).to.eq(transportCost)
            expect(response.body.heatingCost).to.eq(heatingCost)
        });
    });
    // cy.get('table tbody tr').eq(rowIndex).get('td').eq(0).should('not.be.empty')
    // cy.get('table tbody tr').eq(rowIndex).get('td').eq(2).should('contain', nickname)
    // cy.get('table tbody tr').eq(rowIndex).get('td').eq(3).should('contain', 'test remarks')
    // cy.get('table tbody tr').eq(rowIndex).get('td').eq(4).should('contain', STATUS_OPEN)
    cy.get('[aria-label="present-client"]').should('be.visible');
    cy.get('[aria-label="edit-client"]').should('be.visible');
})
Cypress.Commands.add('deleteClient', () => {
    cy.get('button[aria-label="delete-client"]').click()
    cy.get('button[aria-label="deleteClient-confirm"]').click()
    cy.get('[aria-label="deleteClient-snackbar"]').should('be.visible');
})
Cypress.Commands.add('assertListIsEmpty', () => {
    cy.get('table tbody tr').should('have.length', 0);
    cy.get(`[data-testid="no-client-msg"]`).should('be.visible');
});
Cypress.Commands.add('setDate', () => {
    cy.get('[data-testid="clientList-datePicker"]').type('12.12.2023')
});
Cypress.Commands.add('loadHomeWithDate', () => {
    cy.visit('/')
    cy.setDate()
    cy.assertListIsEmpty()
});

//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }