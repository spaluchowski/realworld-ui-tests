import { Page, Locator, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly username: Locator;
  readonly myArticlesTab: Locator;
  readonly favoriteArticlesTab: Locator;
  readonly articlePreviewTitles: Locator;
  readonly articleList: Locator;
  readonly noArticlesMessage: Locator;
  readonly followButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator('.user-info h4');
    this.myArticlesTab = page.locator('.articles-toggle li').nth(0);
    this.favoriteArticlesTab = page.locator('.articles-toggle li').nth(1);
    this.articlePreviewTitles = page.locator('.article-preview h1');
    this.articleList = page.locator('.article-preview');
    this.noArticlesMessage = page.locator('.article-preview', { hasText: 'No articles are here' });
    this.followButton = page.locator('button.action-btn');
  }

  async goto(username: string) {
    await this.page.goto(`/#/profile/${username}`);
    await expect(this.username).toHaveText(username);
  }

  async clickMyArticlesTab() {
    await this.myArticlesTab.click();
  }

  async verifyUsername(username: string) {
    await expect(this.username).toHaveText(username);
  }

  async verifyArticleExists(title: string) {
    // Wait for articles to load
    await expect(this.articleList.first()).toBeVisible();
    
    // Look for an article with the expected title
    const articleTitles = await this.articlePreviewTitles.allTextContents();
    expect(articleTitles.some(articleTitle => articleTitle.includes(title))).toBeTruthy();
  }

  async openArticle(title: string) {
    await this.page.locator('.article-preview', { hasText: title }).click();
  }

  async clickFollowButton() {
    await expect(this.followButton).toBeVisible();
    await this.followButton.click();
  }
}
