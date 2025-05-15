import { Page, Locator, expect } from '@playwright/test';
import {ArticlePage} from "@/pages/ArticlePage";

export class MyArticlePage extends ArticlePage {

  constructor(page: Page) {
    super(page);
  }

  async deleteArticle() {
    await this.page.getByRole('button', { name: 'Delete Article' }).first().click();
  }

  async clickEdit() {
    const editButton = this.page.getByRole('button', { name: 'Edit Article' }).first();
    await editButton.click();
  }
}
