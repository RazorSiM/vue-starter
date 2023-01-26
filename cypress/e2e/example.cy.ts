// https://docs.cypress.io/api/introduction/api.html

describe("Example Test", () => {
  it("visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Vite Starter for vue");
  });
});
