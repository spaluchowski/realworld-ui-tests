import { Page, Locator, expect } from '@playwright/test';

export class CommentSection {
  readonly page: Page;
  readonly commentInput: Locator;
  readonly postCommentButton: Locator;
  readonly commentsList: Locator;
  readonly commentDeleteButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.commentInput = page.locator('.card-block textarea');
    this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
    this.commentsList = page.locator('app-article-comments .card-text');
    this.commentDeleteButtons = page.locator('.card .ion-trash-a');
  }

  async addComment(comment: string) {
    await this.commentInput.fill(comment);
    await this.postCommentButton.click();
  }

  async deleteComment(index = 0) {
    const deleteButton = this.commentDeleteButtons.nth(index);
    await deleteButton.click();
  }

  async checkCommentExists(comment: string) {
    await expect(this.commentsList.first()).toContainText(comment);
  }

  async checkCommentNotExists(comment: string) {
    await expect(this.commentsList.first()).not.toContainText(comment);
  }

  async getCommentCount() {
    return await this.commentsList.count();
  }
}
