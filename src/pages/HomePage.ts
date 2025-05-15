import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signInLink: Locator;
  readonly signUpLink: Locator;
  readonly profileLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInLink = page.getByRole('link', { name: 'Sign in' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.profileLink = page.locator('a[href="#/my-profile"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async verifyUserIsLoggedIn(username: string) {
    await expect(this.profileLink).toBeVisible();
    await expect(this.page.getByText(username)).toBeVisible();
  }

  async verifyUserIsLoggedOut() {
    await expect(this.signInLink).toBeVisible();
    await expect(this.signUpLink).toBeVisible();
    await expect(this.profileLink).not.toBeVisible();
  }

  async verifyArticleByTitleAndAuthor(title: string, author: string): Promise<boolean> {
    const articles = this.page.locator('.article-preview');
    const count = await articles.count();

    for (let i = 0; i < count; i++) {
      const article = articles.nth(i);
      const articleTitle = await article.locator('h1').textContent();
      const articleAuthor = await article.locator('.author').textContent();

      if (articleTitle?.trim() === title && articleAuthor?.trim() === author) {
        return true;
      }
    }
    return false;
  }

  async openArticleByTitleAndAuthor(title: string, author: string): Promise<string> {
    const articles = this.page.locator('.article-preview');
    const count = await articles.count();

    for (let i = 0; i < count; i++) {
      const article = articles.nth(i);
      const articleTitle = await article.locator('h1').textContent();
      const articleAuthor = await article.locator('.author').textContent();

      if (articleTitle?.trim() === title && articleAuthor?.trim() === author) {
        await article.click(); // Click the article
        await this.page.waitForURL(/\/article\//); // Wait for navigation
        await expect(this.page.locator('h1')).toHaveText(title); // Confirm title on new page
        return this.page.url().split('/').pop() as string; // Return the article slug
      }
    }
    throw new Error(`Article with title "${title}" and author "${author}" not found`);
  }

}
