describe("My First Test", () => {
  it("nevtreegui hereglegch /login luu shuud oroh ystoi", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Нэвтрэх");
  });
});
