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

Cypress.Commands.add('login', () => {
    cy.get('button:contains("Sign in with Okta")').click({force: true})
    cy.origin(
    'https://dev-49057522.okta.com/',
    () => {
      cy.get('#okta-signin-username').type('test@test.com')
      cy.get('#okta-signin-password').type('Cypresse2e123!');
      cy.get('[type="submit"]').click()
    }
  )
  cy.wait(18000)
})
Cypress.Commands.add('setAuthCookies', () => {
        cy.setCookie('next-auth.session-token', 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..zAR0ChGhN1LS8yEx.PoqtrWo7G4eH482yFPqRbCmGnatXmMH3Md4FFKaEE1pUnwOQZm3qZDe_I2ghSHuN2FKCraufjtrfPjiCPw_4ZYBQpp8PDqAaDqv2s0KppJiJ_6kH06vBQirFrdqhQygECedNVjIoCR2JvX2fDFWpwbKCAt645wLmNRZMfiH-sgXsIALQmbyukihXsi8xNyDIoEAkV8GrejtWllViaXV9UKYUj_1fdcopktaWtYMNqPrF4dGEFP1S2uNgwO3rO1sHiEoNqVZwLNJwT_T2YnsKzCmoTiJfGOBL7rFzN-HgViwoXj5SbVCJjajIJx_w85ozcIIloCuL4DwgcfjYDcQoqrav2u31l9rGWXaer4_jaEneFtFzjDgkQuuG2qqRn3OUzM24Uvl8A0oWpVQdSl01mxdtvO5-NJbhkSjESj1uTOhQ4jdn5F-la3gy0-g9NKVcLZOgbOGvgb9qH1tnR8UvmYYOWgMe2LxCliVzpqnznsaTlVwYGRakLS888H6S8voQgBGQdTxs_QNyVRsY9IvWjs6LcUET6c1PLvFkMxu41fyVe4lv66mTxbixP7TDbfhaGTrs14Ye5_fbBxYm5gF014p9_KKL6EpSe8SjS2zN1Nq9I3yCVu0M_c0CGi7ceBWtJ26YkhB0yO6f7poa3XU7HdhcZ4okmPVYBAnXybiTxtWCRkATKz_PQ-Z1-F3b_R_Xcq98TTbGJ29yqjNID6T6Vw8reLcNQoq6h4E2erXLXJ5C8wJFaONRan0TEmyR2F_pLLkpjiUK0WEx-4c5QinM4JYK6JLkyCAs5ONra8_N-zwg3eyo9zYlAwOH5nocUFMDMJXXJ8EmsgloGHaYdp-st7y-CHwQgUD2IRIdqwswTf-lY31f2Ax4mbj-K-yVbe63J1x92Pd7rQ8IJacHLRAbx4PvE-230k6CoA15Ru7ZS6iPM1hR7OqJE4ThNrClksnUmr-zDhhP4pv4rEIq_h2zJEiO4HqcWJhTvVqkFAWwK7zPCNX7s_itj_2dEQ88-o9Rw92o8nTFguHgC7UjjIuP8yTce3fvF066gwmVbiPrlvbXHVoYMJ09UEwCtoc-MCweZvZkvP6W8dOYE8s-j1YsW9XME0UmvQGEY1P44Md2BoFnU5bjpNncnsQIl8yma0GCd6JEJTRicfo7otaqgjV-soleA9R4MgE_bQpxnXI8nkb61cEXp5irOOqdyUbh64DjFfAaktCi0hEvwn3sTcRBbE3exAkYZbMwsswQ9grUmCO3K76_PRhrVPO7H-_so9Fshqrj4bVrH8JZJfWAKNlrX_ge-pvHu8mSc47OtWHHsw-oFO5z2kTV5djF8-EFy_CnMheW4_Bka66QSkG8xxQpa2b5HJQ0urC5fOBjDDZ0f678Sn6-h-7kxgcTvFl_kL-_b2rX6bjoIIyLVIXD79Z_pi6Av_3pxr-IvQREx5c8KYLTLqXPylLOYFeoBpTtuoNistjCAPEmwlgH90w-02RBOpJlxRhu5gA0I0A8LUZ1pw_0GqkHYfEec4iA3rLXaHLW1-a-Ltz0LRn1ATSm3M62jmI5Hxm7mjoa0DqJ2D9EV2Hk6wi9nucY_RIw_FkAnMa_SRDTmzMW-i7oNS1WvS7xuOE53WSDcULcCL_AT0nvUUdOeQEhpUSW52bVul-ZJmAA-rjEcLX0a9_FBPN8zbSDbK5gVzPyo4fG-Q0FEDaxSU6fFtvfzS7702tZUKA1geudVu0ymuDNZNSrjw1MfKFlHBUbDb5ZNtLFmvrs-J9mIYZc4A3xiMdp0Pi36OsrB_HC3dpdSoRD8Nq2AZBm7uxbLNcUBp8gUI0mWplpzfnJUPyhhh3_djDJolP1K6qvV17UWGQ87BWGScTzERksIUhyLfV4TNL1SY24DPQdJ4dc0WLkzuVPpvurVyioOnb9U69KA1rNPHTpL8aT0NbZQnQON0F74UbSniV2h0NhrEJgZ0NNHObzaYy60tWGOpnV6ObN0HmTsTDniMGPR7uhDFUjlVB-JkjJDmpbU517dcd4vhgj_guDzTBI4mTnEaIpbV7SgwEsc9UChMD9DgaFLwLgZQ1XAkZq8Np5x4OgzTCWZjlXcWVQD-F1s2NhNfo9N1DUtj0DKwJ0t4wWAwd2kWJBoPoYjRzW9UFyfAJS4uVzBLhSHTECoG7P9WQMEmCM4kL7Qn3qm5IqGiEL_mN7mfQWhZzurjlkuT9qfO6j2DCmyLduirLxpnXrc6rsPpqmwZP-s4i5ue_k4pf2YYUYhGRTnKfyLAFv_gxOcuHiYsSSVY9TEsxTww-7CoLq_-xN18JeaInATL8Gqfzqh5TdDolnm9kmcL4uPMaW5Bo-FyQURQnQC9M7HWiYyrmLFjk_d8y4C1bbEuAPGnAVwCRqjRAucYciEzUCrotnqSTpRp62pf75Oi3R_963DDpwIYF1Njs-IapyYm-xftadzb-atG84LCkRuMAdB7awSk38-NumikY_LxhwFL0aeT8hCi5ecpnzK-Z-e78D9Ng5xrNYX5PaD1IApWfah8PLCsTlVnQ3xxXs4-DnH5tB2T68KePVeXUuI6FvEsoANZkfPV_fbcURRhoSjlQFLtVvST7e-keJhPGC-Hhoa3AUeGCB_7ky0jto8helkP8FBT7Gnu002KBqPROf4oAyXAC9OEjU9SbDLMf5PLPTWSnFS_s3elLSvEJ1QdMGVV_yV4MNR1UQnvuyWslXO9kbk65FynBE8la1j0qZb-Qt3p5ocAf_O1qtMvUYg86aJxOjuOjLsve-PuaYLYTl8EdOOnt1ynOa18e1gsbrD1-CCywV_slUc0hbn70UUypjeusM74MEofPQJrRPJuNs3uA0MAx-RywYRAlKK7fs186h3MDaJeEuPrea2x5xb0LlO3l0jzyW2tyxT6xKpkBOQhBG0mCxqTQuXNKrWaiQs9e0PbkLZ0yRAzEwg4HqYbhwsw-Bdp0jBng2a927a3vTp0hx8rjiVrM3oCeHj6M56XKWrUa9S-nXyGhTakTZVG2zPCjS0FjcuoAo3HltTOm3Jp4V0F5fquhSyioN6XLSKjgjIg4SaHR7n04KsOXQ6Z-0v4R39M10FhmTrFLYynZ9xv1Z82t8hOr5OYIRYsfIaykLNGFH-OH5SMN6MLxpNpOL2U5u9gZkphOyB5UuCPvJTgTcP8OMWiV4dbLQdh91KunF2-T18-HsA0Rq8vocF72H_RjlF5S5_5pu-5pBn8OmU6sQxKd2D_dKaMNaKBZmyrjWoBSY-m7-zMDnY6gbQZlCXC1ynepmPi846uG4tCNPTPhC--WJow069eLSndwLl6jyjw.iYytK6VFi2wIZ6Hn2NQpxw')
        cy.setCookie('next-auth.csrf-token', 'cc21922521f5dbd2bacc7566ce163fb317cacd6f8b3d96286a4a374f81abeaf7%7C29539bb6daf9ff3d15a3fb56309908381d26d1818845257f10dd8f7c3239b16c')
})

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
    cy.setAuthCookies()
    cy.visit('/')
    cy.wait(2000)
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
