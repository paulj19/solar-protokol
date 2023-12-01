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

Cypress.Commands.add('createClient', ( nickname = "test nickname", numClients = 1, rowIndex = 0) => {
    cy.get('button[aria-label="add-client"]').click({force: true})
    cy.wait(1000)
    cy.get('input[name="nickname"]').type(nickname)
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

    cy.get('table tbody tr').eq(rowIndex).then(($row) => {
        cy.wrap($row).find('td').eq(0).should('not.be.empty')
        cy.wrap($row).find('td').eq(2).should('contain', nickname)
        cy.wrap($row).find('td').eq(3).should('contain', 'test remarks')
        cy.wrap($row).find('td').eq(4).should('contain', STATUS_OPEN)
    });
    cy.get('table tbody tr').should('have.length', numClients)
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