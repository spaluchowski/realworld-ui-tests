import { Page, Locator, expect } from '@playwright/test';

export class MyProfilePage {
  readonly page: Page;
  readonly myArticlesTab: Locator;
  readonly favoriteArticlesTab: Locator;
  readonly articlePreviewTitles: Locator;
  readonly articleList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myArticlesTab = page.locator('.articles-toggle li').nth(0);
    this.favoriteArticlesTab = page.locator('.articles-toggle li').nth(1);
    this.articlePreviewTitles = page.locator('.article-preview h1');
    this.articleList = page.locator('.article-preview');
  }

  async goto() {
    await this.page.goto(`/#/my-profile`);
  }

  async clickGlobalFeed() {
    await this.page.locator('a.nav-link').nth(0).click();
  }

  async clickOnArticleByTitle(articleTitle: string) {
    const article = this.page.locator('.article-preview', { hasText: articleTitle });
    await article.click();
  }

  async checkArticleNotExists(articleTitle: string) {
    const article = this.page.locator('.article-preview', { hasText: articleTitle });
    await expect(article).not.toBeVisible();
  }
}
