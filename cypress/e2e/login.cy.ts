import { first } from "lodash";

describe("My First Test", () => {
  console.log(
    "checking env",
    process.env.DATABASE_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL
  );
  it("nevtreegui hereglegch /login luu shuud oroh ystoi", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Нэвтрэх");
  });
  it("nevreh shalgalt", () => {
    cy.visit("/login");
    cy.contains("Нэвтрэх");
    cy.get('input[id="username"]').type("glpzghoo");
    cy.get('input[id="password"]').type("passwordmagic");
    cy.get('button[type="submit"]').click();
    cy.contains("Түр хүлээнэ үү!");
    cy.contains("Түр хүлээнэ үү!");
    cy.contains("Тавтай морил");
  });
  it("zochnoor orj todo nemj, zasah, tolov oorchloh", () => {
    cy.visit("/");
    cy.contains("Нэвтрэх");
    cy.get('a[id="login-guest"]').click();
    cy.contains("Таны даалгаварууд");
    cy.get('button[id="add-guest-todo"]').click();
    let taksName = `cypress testing name ${Math.floor(Math.random() * 50000)}`;
    cy.get('input[id="taskName"]').type(taksName);
    let desc = `cypress testing on desc ${Math.floor(Math.random() * 50000)}`;
    cy.get('textarea[id="description"]').type(desc);
    cy.get(`input[id="${Math.floor(Math.random() * 5)}"]`).click();
    cy.get(`[data-cy="tag-trigger"]`).click();
    cy.get(`[data-cy="tag-option"]`).first().click();
    cy.get(`[data-cy="add-guest-todo-submit"]`).click();
    cy.contains("Түр хүлээнэ үү!");
    cy.contains(taksName);
    cy.get(`[data-cy="todo-zasah-tocch"]`).first().click();
    taksName = `cypress testing name edit ${Math.floor(Math.random() * 50000)}`;
    desc = `cypress testing on desc edit ${Math.floor(Math.random() * 50000)}`;
    cy.get(`[data-cy="zochnii-todo-ner-zasah"]`).type(taksName);
    cy.get(`[data-cy="zochnii-todo-desc-zasah"]`).type(desc);
    cy.get(`[data-cy="zohcnii-todo-tag-solih-trigger"]`).click({ force: true });
    cy.get(`[data-cy="zochnii-todo-tag-solih"]`).first().click();
    cy.get(`[data-cy="zochnii-todo-solih-tovch"]`).click();
    cy.contains(`Түр хүлээнэ үү!`);
    cy.get(`[data-cy="done-guest-todo-button"]`).first().click();
    cy.contains(`Түр хүлээнэ үү!`);
    cy.get(`[data-cy="whole-div"]`).should("not.contain", taksName);
  });
});
