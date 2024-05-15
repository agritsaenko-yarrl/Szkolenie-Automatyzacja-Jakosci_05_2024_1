/// <reference types="cypress" />

describe('plp1', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  it('contains 6 items in list', () => {
    cy.wait(3000);

    cy.get('[data-test="inventory-item"]')
      .should('have.length', 6)
      .each((listItem) => {
        cy.wrap(listItem).within(() => {
          cy.get('[data-test="inventory-item-name"]').should('be.visible');
          cy.get('[data-test^="inventory-item-"][data-test$="-img"]').should('be.visible');
          cy.get('[data-test="inventory-item-desc"]').should('be.visible');
          cy.get('[data-test^="add-to-cart-"]').should('be.visible');
          cy.get('[data-test="inventory-item-price"]').should('be.visible');
        });
      });
  });

  it('click on item leads to the pdp page', () => {
    const random = Cypress._.random(0, 5);
    cy.get('[data-test="inventory-item-name"]')
      .eq(random)
      .as('randomItemName')
      .invoke('prop', 'innerText')
      .then((text) => {
        cy.get('@randomItemName').click();
        cy.url().should('contain', 'inventory-item.html');

        cy.get('[data-test="inventory-item-name"]')
          .invoke('prop', 'innerText')
          .should('eq', text);
      });
  });

  it('click on add to cart changes cart items number', () => {
    const random = Cypress._.random(0, 5);
    cy.get('[data-test^="add-to-cart-"]')
      .eq(random)
      .click();

    cy.get('[data-test="shopping-cart-badge"]')
      .should('be.visible')
      .and('contain.text', '1');
  });
});