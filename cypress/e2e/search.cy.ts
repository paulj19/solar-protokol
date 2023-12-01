import {body} from "msw";

describe('SEARCH', () => {
    beforeEach(() => {
        cy.request('DELETE', Cypress.env('NEXT_PUBLIC_FIREBASE_URL_TEST') + '/clientList/uid_1.json')
    })

    it('create clients and search', () => {
        const nicknames = ["schütz", "meyer", "fritz", "familie perenecker", "Van Abercron", "schäfer", "willems", "schwarz", "jung", "bieber"]
        cy.loadHomeWithDate()
        cy.createClient(nicknames[0], 1, 0)
        cy.createClient(nicknames[1], 2, 1)
        cy.createClient(nicknames[2], 3, 2)
        cy.createClient(nicknames[3], 4, 3)
        cy.createClient(nicknames[4], 5, 4)
        cy.createClient(nicknames[5], 6, 5)
        cy.createClient(nicknames[6], 7, 6)
        cy.createClient("FAMILIE " + nicknames[7], 8, 7)
        cy.createClient("FAMILIE " + nicknames[8], 9, 8)
        cy.createClient("FAMILIE " + nicknames[9], 10, 9)
        cy.get('[aria-label="search-toggle"]').click()
        cy.get('[data-testid="searchbar"]').type("test")
        nicknames.forEach((v) => {
            cy.get('[data-testid="searchbar"]').clear().type(v)
            cy.get('table tbody tr td').eq(2).contains(new RegExp(v, 'i'))
        });
        cy.get('[data-testid="searchbar"]').clear()
        cy.get('table tbody tr').should('have.length', nicknames.length);
        cy.get('[aria-label="search-toggle"]').click()
        cy.get('button[aria-label="add-client"]').should('exist')
        cy.request('DELETE', Cypress.env('NEXT_PUBLIC_FIREBASE_URL_TEST') + '/clientList/uid_1.json')
    })
    it('display sorted client list', () => {
        const clientList =
            {
                "2023-12-12": {
                    "cid_10": {
                        "basePrice": "20",
                        "consumptionYearly": "2500",
                        "id": 10,
                        "isPurchase": false,
                        "nickname": "schütz",
                        "presentationDate": "Tue Dec 12 2023 10:00:00 GMT+0100 (Central European Standard Time)",
                        "productionYearly": "5000",
                        "remarks": "test remarks",
                        "status": "open",
                        "unitPrice": 0.4
                    },
                    "cid_9": {
                        "basePrice": "20",
                        "consumptionYearly": "2500",
                        "id": 9,
                        "isPurchase": false,
                        "nickname": "fritz",
                        "presentationDate": "Tue Nov 12 2023 10:00:00 GMT+0100 (Central European Standard Time)",
                        "productionYearly": "5000",
                        "remarks": "test remarks",
                        "status": "open",
                        "unitPrice": 0.4
                    },
                    "cid_8": {
                        "basePrice": "20",
                        "consumptionYearly": "2500",
                        "id": 8,
                        "isPurchase": false,
                        "nickname": "meyer",
                        "presentationDate": "Tue Oct 12 2023 10:00:00 GMT+0100 (Central European Standard Time)",
                        "productionYearly": "5000",
                        "remarks": "test remarks",
                        "status": "open",
                        "unitPrice": 0.4
                    },
                    "cid_7": {
                        "basePrice": "20",
                        "consumptionYearly": "2500",
                        "id": 7,
                        "isPurchase": false,
                        "nickname": "familie perenecker",
                        "presentationDate": "Tue Sep 12 2023 10:00:00 GMT+0100 (Central European Standard Time)",
                        "productionYearly": "5000",
                        "remarks": "test remarks",
                        "status": "open",
                        "unitPrice": 0.4
                    },
                    "cid_6": {
                        "basePrice": "20",
                        "consumptionYearly": "2500",
                        "id": 6,
                        "isPurchase": false,
                        "nickname": "Van Abercron",
                        "presentationDate": "Tue Sep 12 2023 09:00:00 GMT+0100 (Central European Standard Time)",
                        "productionYearly": "5000",
                        "remarks": "test remarks",
                        "status": "open",
                        "unitPrice": 0.4
                    },
                    "cid_5": {
                        "basePrice": "20",
                        "consumptionYearly": "2500",
                        "id": 5,
                        "isPurchase": false,
                        "nickname": "HERR SCHÄFER",
                        "presentationDate": "Tue Sep 12 2023 08:00:00 GMT+0100 (Central European Standard Time)",
                        "productionYearly": "5000",
                        "remarks": "test remarks",
                        "status": "open",
                        "unitPrice": 0.4
                    },
                    "cid_4": {
                        "basePrice": "20",
                        "consumptionYearly": "2500",
                        "id": 4,
                        "isPurchase": false,
                        "nickname": "WILLEMS",
                        "presentationDate": "Tue Aug 12 2023 10:00:00 GMT+0100 (Central European Standard Time)",
                        "productionYearly": "5000",
                        "remarks": "test remarks",
                        "status": "open",
                        "unitPrice": 0.4
                    },
                    "cid_3": {
                        "basePrice": "20",
                        "consumptionYearly": "2500",
                        "id": 3,
                        "isPurchase": false,
                        "nickname": "FAMILIE SCHWARZ",
                        "presentationDate": "Tue Jun 12 2023 10:00:00 GMT+0100 (Central European Standard Time)",
                        "productionYearly": "5000",
                        "remarks": "test remarks",
                        "status": "open",
                        "unitPrice": 0.4
                    },
                    "cid_2": {
                        "basePrice": "20",
                        "consumptionYearly": "2500",
                        "id": 2,
                        "isPurchase": false,
                        "nickname": "FAMILIE JUNG",
                        "presentationDate": "Tue Jun 12 2023 08:30:00 GMT+0100 (Central European Standard Time)",
                        "productionYearly": "5000",
                        "remarks": "test remarks",
                        "status": "open",
                        "unitPrice": 0.4
                    },
                    "cid_1": {
                        "basePrice": "20",
                        "consumptionYearly": "2500",
                        "id": 1,
                        "isPurchase": false,
                        "nickname": "FAMILIE BIEBER",
                        "presentationDate": "Tue Jan 12 2023 10:00:00 GMT+0100 (Central European Standard Time)",
                        "productionYearly": "5000",
                        "remarks": "test remarks",
                        "status": "open",
                        "unitPrice": 0.4
                    }
                }
            }
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
