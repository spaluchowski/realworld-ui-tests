import { Page, Locator, expect } from '@playwright/test';
import { HomePage } from './HomePage';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Sign in' });
    this.loginErrorMessage = page.locator('app-error-message li')
  }

  async goto() {
    await this.page.goto('/#/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLoginErrorMessage(errorText: string) {
    await expect(this.loginErrorMessage).toHaveText(errorText);
  }

  async loginAndVerify(email: string, password: string, username: string): Promise<HomePage> {
    await this.login(email, password);
    const homePage = new HomePage(this.page);
    await homePage.verifyUserIsLoggedIn(username);
    return homePage;
  }
}
