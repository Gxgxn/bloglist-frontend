describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    const user = {
      name: 'Gagan',
      username: 'gxgxn',
      password: 'root',
    };

    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user);
    cy.visit('');
  });

  it('Login form is shown', function () {
    cy.contains('Log into the application');
    cy.contains('username');
    cy.contains('password');
  });
  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      it('user can login', function () {
        cy.get('#username').type('gxgxn');
        cy.get('#password').type('root');
        cy.contains('login').click();

        cy.contains('Gagan is logged in');
      });
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('gxgxn');
      cy.get('#password').type('wrong');
      cy.contains('login').click();
      cy.contains('Gagan is logged in').should('not.exist');
    });
  });
  describe('When logged in', function () {
    beforeEach(function () {
      const user = {
        username: 'gxgxn',
        password: 'root',
      };

      cy.request('POST', `${Cypress.env('BACKEND')}/login`, user).then(
        ({ body }) => {
          localStorage.setItem('loggedBlogUser', JSON.stringify(body));
          cy.visit('http://localhost:3000');
        }
      );
    });

    it('A blog can be created', function () {
      cy.contains('Create new blog!').click();
      cy.contains('Author').find('input').type('John Doe');
      cy.contains('Title').find('input').type('Test blog');
      cy.contains('URL')
        .find('input')
        .type('https://docs.cypress.io/api/commands/each');
      cy.get('#create-blog').click();
      cy.get('.blog').contains('Test blog');
    });
  });
});
