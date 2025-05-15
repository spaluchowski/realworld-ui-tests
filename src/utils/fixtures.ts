import {test as base, expect, Page} from '@playwright/test';
import { RealWorldApp } from './testcontainers';
import {config} from "@/utils/config";
import {RegisterPage} from "@/pages/RegisterPage";
import {LoginPage} from "@/pages/LoginPage";
import {User, user} from "@/utils/testdata";

type TestOptions = {
  realWorldApp?: RealWorldApp;
};

export const test = base.extend<TestOptions>({
  baseURL: async ({}, use) => {
    let url: string;
    let app: RealWorldApp | undefined;

    if (process.env.USE_TESTCONTAINERS === 'true') {
      app = new RealWorldApp();
      await app.start();
      url = app.getFrontendUrl();
    } else {
      url = process.env.DEFAULT_BASE_URL || config.baseUrl;
    }

    await use(url);

    if (app) {
      await app.stop();
    }
  },
});

export { expect };

export const getRegisteredAndLoggedUser = async (page: Page, userData?: User) => {
  if (!userData) {
    userData = user();
  }
  const registerPage = new RegisterPage(page);

  await registerPage.goto();
  await registerPage.registerAndVerify(userData.username, userData.email, userData.password);

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAndVerify(userData.email, userData.password, userData.username);

  return userData;
}