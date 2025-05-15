import { Page, Locator, expect } from '@playwright/test';

export class ArticlePage {
  readonly page: Page;
  readonly title: Locator;
  readonly author: Locator;
  readonly body: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1');

    this.body = this.page.locator('.article-content');
    this.author = this.page.locator('.article-actions .article-meta .info .author');
  }

  async verifyTitle(expectedTitle: string): Promise<void> {
    await expect(this.title).toHaveText(expectedTitle);
  }

  async verifyBody(expectedBody: string): Promise<void> {
    await expect(this.body).toContainText(expectedBody);
  }

  async verifyAuthor(expectedAuthor: string): Promise<void> {
    await expect(this.author).toHaveText(expectedAuthor);
  }

  async verifyTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      const tagLocator = this.page.locator('.tag-list', { hasText: tag });
      await expect(tagLocator).toBeVisible();
    }
  }
}
