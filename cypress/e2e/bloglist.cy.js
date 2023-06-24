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

    describe('And a blog exist', function () {
      beforeEach(function () {
        cy.createNote({
          title: 'another note cypress',
          author: 'cypress',
          url: 'https://fullstackopen.com/en/part5',
        });
      });
      it('user can like a bog', function () {
        cy.contains('another note cypress').contains('View').click();
        cy.contains('Like')
          .contains('0')
          .parent()
          .find('button')
          .contains('Like')
          .click();

        cy.contains('Like').contains('1');
      });

      it('only user who created a blog can delete it', function () {
        cy.contains('another note cypress').contains('View').click();
        cy.contains('Delete').click();
        cy.contains('another note cypress').should('not.exist');
      });

      it('only user who created a blog can delete it', function () {
        cy.contains('another note cypress').contains('View').click();
        cy.contains('Delete');
        cy.contains('logout').click();
        cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
        const user = {
          name: 'John',
          username: 'gagan',
          password: 'root',
        };
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user);

        cy.get('#username').type('gagan');
        cy.get('#password').type('root');
        cy.contains('login').click();

        cy.contains('John is logged in');
        cy.contains('another note cypress').contains('View').click();
        cy.contains('Delete').should('not.exist');
      });
    });

    describe('When multiple blogs exits', function () {
      beforeEach(function () {
        cy.createNote({
          title: 'Blog with second most likes',
          author: 'cypress',
          url: 'https://fullstackopen.com/en/part5',
        });
        cy.createNote({
          title: 'Blog with most likes',
          author: 'cypress',
          url: 'https://fullstackopen.com/en/part5',
        });
      });
      it.only('Blogs Are sorted by the most likes', function () {
        cy.contains('Blog with most likes').contains('View').click();

        cy.contains('Blog with most likes')
          .find('button')
          .contains('Like')
          .as('mostlikes');

        cy.contains('Blog with second most likes').contains('View').click();

        cy.contains('Blog with second most likes')
          .find('button')
          .contains('Like')
          .as('secondmostlikes');

        cy.get('@mostlikes').click();

        cy.get('.blog').eq(0).should('contain', 'Blog with most likes');
        cy.get('.blog').eq(1).should('contain', 'Blog with second most likes');

        cy.get('@secondmostlikes').click().wait(500);
        cy.get('@secondmostlikes').click().wait(500);
        cy.get('.blog').eq(1).should('contain', 'Blog with most likes');
        cy.get('.blog').eq(0).should('contain', 'Blog with second most likes');

        cy.get('@mostlikes').click().wait(500);
        cy.get('@mostlikes').click().wait(500);
        cy.get('@mostlikes').click().wait(500);

        cy.get('.blog').eq(0).should('contain', 'Blog with most likes');
        cy.get('.blog').eq(1).should('contain', 'Blog with second most likes');
      });
    });
  });
});
