/// <reference types="cypress" />

describe('pdp2', () => {
  beforeEach(() => {
    const random = Cypress._.random(0, 5);

    cy.visit('/');
    cy.login();

    cy.get('[data-test="inventory-item-name"]')
      .eq(random)
      .click();

    cy.url().should('contain', 'inventory-item.html');
  });

  it('page contains item elements', () => {
    cy.get('[data-test="inventory-container"]').within(() => {
      cy.get('[data-test="inventory-item-name"]').should('be.visible');
      cy.get('[data-test^="item-"][data-test$="-img"]').should('be.visible');
      cy.get('[data-test="inventory-item-desc"]').should('be.visible');
      cy.get('[data-test="add-to-cart"]').should('be.visible');
      cy.get('[data-test="inventory-item-price"]').should('be.visible');
    });
  });

  it('click on add to cart changes cart items number', () => {
    cy.get('[data-test="add-to-cart"]').click();

    cy.get('[data-test="shopping-cart-badge"]')
      .should('be.visible')
      .and('contain.text', '1');
  });

  it('click on remove changes cart items number to zero', () => {
    cy.get('[data-test="add-to-cart"]').click();

    cy.get('[data-test="shopping-cart-badge"]')
      .should('be.visible')
      .and('contain.text', '1');

    cy.wait(5000);

    cy.get('[data-test="remove"]').click();

    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });
});