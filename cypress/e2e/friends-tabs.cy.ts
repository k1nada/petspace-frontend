const LOCALES = ["en", "pl"];
const PHONE_WIDTHS = [360, 390, 430];
const PHONE_HEIGHT = 740;
const HYDRATION_ERROR =
  "Hydration failed because the server rendered HTML didn't match the client";

Cypress.on("uncaught:exception", (error) => {
  return !error.message.includes(HYDRATION_ERROR);
});

describe("Friends tabs on phone", () => {
  let apiUrl = "";
  let token = "";
  let username = "";
  let followUsername = "";
  let followedByTest = false;

  before(() => {
    cy.env(["apiUrl", "email", "password", "username", "followUsername"]).then(
      (env) => {
        apiUrl = env.apiUrl;
        username = env.username;
        followUsername = env.followUsername;

        cy.request("POST", `${apiUrl}/signin`, {
          email: env.email,
          password: env.password,
        }).then((response) => {
          token = response.body.token;

          cy.request({
            method: "POST",
            url: `${apiUrl}/following/${username}/${followUsername}`,
            headers: { Authorization: `Bearer ${token}` },
            failOnStatusCode: false,
          }).then((followResponse) => {
            expect(followResponse.status).to.be.oneOf([200, 409]);
            followedByTest = followResponse.status === 200;
          });
        });
      },
    );
  });

  after(() => {
    if (!followedByTest) {
      return;
    }

    cy.request({
      method: "DELETE",
      url: `${apiUrl}/following/${username}/${followUsername}`,
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  LOCALES.forEach((locale) => {
    PHONE_WIDTHS.forEach((width) => {
      it(`keeps tabs inside the card at ${width}px in ${locale}`, () => {
        cy.viewport(width, PHONE_HEIGHT);
        cy.visit(`/${locale}/${username}/friends`, {
          onBeforeLoad(window) {
            window.localStorage.setItem("token", token);
          },
        });

        cy.get('[data-cy="friends-tab-following"]').click();
        cy.location("search").should("eq", "?tab=following");

        cy.document().should((document) => {
          expect(document.documentElement.scrollWidth).to.be.at.most(width);
        });

        cy.get('[data-cy="friends-card"]').should(($card) => {
          const tabs = $card[0].querySelector('[data-cy="friends-tabs"]')!;
          const cardRect = $card[0].getBoundingClientRect();
          const tabsRect = tabs.getBoundingClientRect();
          expect(tabsRect.right).to.be.at.most(cardRect.right);
          expect(tabsRect.width).to.be.closeTo(cardRect.width, 1);
        });

        cy.get('[data-cy="friends-tabs"]').should(($tabs) => {
          const tab = $tabs[0].querySelector(
            '[data-cy="friends-tab-following"]',
          )!;
          const tabsRect = $tabs[0].getBoundingClientRect();
          const tabRect = tab.getBoundingClientRect();
          expect(tabRect.left).to.be.at.least(tabsRect.left);
          expect(tabRect.right).to.be.at.most(tabsRect.right);
        });
      });
    });
  });
});
