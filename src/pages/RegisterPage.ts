import { Page, Locator, expect } from '@playwright/test';
import { HomePage } from './HomePage';

export class RegisterPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signUpButton: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.signUpButton = page.getByRole('button', { name: 'Sign up' });
    this.errorMessages = page.locator('.error-messages');
  }

  async goto() {
    await this.page.goto('/#/register');
  }

  private async register(username: string, email: string, password: string) {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signUpButton.click();
  }

  async registerAndVerify(username: string, email: string, password: string): Promise<HomePage> {
    await this.register(username, email, password);
    const homePage = new HomePage(this.page);
    await this.page.waitForURL('**/#/login');
    expect(this.page.url()).toContain('#/login');
    return homePage;
  }
}
