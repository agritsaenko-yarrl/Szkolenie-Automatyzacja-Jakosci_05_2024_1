describe('login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('valid user log in', () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');

    cy.get('[data-test="login-button"]').click();

    cy.url().should('eq', 'https://www.saucedemo.com/inventory.html');
  });

  it.only('locked user is trying to login', () => {
    cy.get('[data-test="username"]').type('locked_out_user');
    cy.get('[data-test="password"]').type('secret_sauce');

    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="error"]').should('have.text', 'Epic sadface: Sorry, this user has been locked out.');
  });

  it('wrong credentials', () => {
    cy.get('[data-test="username"]').type('standard_user123');
    cy.get('[data-test="password"]').type('secret_sauce');

    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="error"]').should('have.text', 'Epic sadface: Username and password do not match any user in this service');
  });
});