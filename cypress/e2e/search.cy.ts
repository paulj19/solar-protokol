import clientList from "./clientList.json";

describe('SEARCH', () => {
    before(() => {
        cy.viewport(1920, 1080)
    })
    beforeEach(() => {
        cy.request('DELETE', Cypress.env('NEXT_PUBLIC_FIREBASE_URL_TEST') + '/clientList/uid_1.json')
    })

    it('create clients and search', () => {
        const clientList_ = clientList["2023-12-12"]
        cy.loadHomeWithDate()
        cy.createClient(clientList_.cid_1, 1, 0)
        cy.createClient(clientList_.cid_2, 2, 1)
        cy.createClient(clientList_.cid_3, 3, 2)
        cy.createClient(clientList_.cid_4, 4, 3)
        cy.createClient(clientList_.cid_5, 5, 4)
        cy.createClient(clientList_.cid_6, 6, 5)
        cy.createClient(clientList_.cid_7, 7, 6)
        cy.createClient("FAMILIE " + clientList_.cid_8, 8, 7)
        cy.createClient("FAMILIE " + clientList_.cid_9, 9, 8)
        cy.createClient("FAMILIE " + clientList_.cid_10, 10, 9)
        // cy.request('PATCH', Cypress.env('NEXT_PUBLIC_FIREBASE_URL_TEST') + '/clientList/uid_1.json', clientList)
        cy.get('[aria-label="search-toggle"]').click()
        cy.get('[data-testid="searchbar"]').type("test")
        Object.values(clientList_).forEach((client) => {
            cy.get('[data-testid="searchbar"]').clear().type(client.nickname)
            cy.get('table tbody tr td').eq(2).contains(new RegExp(client.nickname, 'i'))
        });
        cy.get('[data-testid="searchbar"]').clear()
        cy.get('table tbody tr').should('have.length', Object.keys(clientList_).length);
        cy.get('[aria-label="search-toggle"]').click()
        cy.get('button[aria-label="add-client"]').should('exist')
        cy.request('DELETE', Cypress.env('NEXT_PUBLIC_FIREBASE_URL_TEST') + '/clientList/uid_1.json')
    })
    it('display sorted client list', () => {
        cy.request('PATCH', Cypress.env('NEXT_PUBLIC_FIREBASE_URL_TEST') + '/clientList/uid_1.json', clientList)
        cy.loadHomeWithDate()
        cy.get('[aria-label="search-toggle"]').click()
        for (let i = 1; i <= 10; i++) {
            cy.get('table tbody tr').eq(i - 1).then(($row) => {
                cy.wrap($row).find('td').eq(1).should('contain.text', i)
            });
        }
        cy.get('[aria-label="search-toggle"]').click()
        cy.get('button[aria-label="add-client"]').should('exist')
        cy.request('DELETE', Cypress.env('NEXT_PUBLIC_FIREBASE_URL_TEST') + '/clientList/uid_1.json')
    })
});
