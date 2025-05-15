import { Page, Locator, expect } from '@playwright/test';

export class EditorPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly bodyInput: Locator;
  readonly tagsInput: Locator;
  readonly publishButton: Locator;
  readonly errorMessages: Locator;
  readonly successMessages: Locator;

  readonly SUCCESS_MESSAGE: string = 'Published successfully!';

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByPlaceholder('Article Title');
    this.descriptionInput = page.getByPlaceholder("What's this article about?");
    this.bodyInput = page.getByPlaceholder('Write your article (in markdown)');
    this.tagsInput = page.getByPlaceholder('Enter tags');
    this.publishButton = page.getByRole('button', { name: 'Publish Article' });
    this.errorMessages = page.locator('.error-messages li');
    this.successMessages = page.locator('.success-messages li');

  }

  async goto() {
    await this.page.goto('/#/editor');
    await expect(this.titleInput).toBeVisible();
  }

  async gotoWithSlug(slug: string) {
    await this.page.goto(`/editor/${slug}`);
  }

  async fillArticleForm({ title, description, body, tags = [] }: { 
    title: string, 
    description: string, 
    body: string, 
    tags?: string[] 
  }) {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.bodyInput.fill(body);
    
    for (const tag of tags) {
      await this.tagsInput.fill(tag);
      await this.page.keyboard.press('Enter');
    }
  }

  async publishArticle() {
    await this.publishButton.click();
  }

  async createArticle({ title, description, body, tags = [] }: { 
    title: string, 
    description: string, 
    body: string, 
    tags?: string[] 
  }) {
    await this.fillArticleForm({ title, description, body, tags });
    await this.publishArticle();

    await this.verifySuccessMessagePresent();
    await this.verifyNoErrorMessages();
  }

  async updateArticle(body: string, newTags: string[] = []) {
    await this.bodyInput.clear();
    await this.bodyInput.fill(body);

    for (const tag of newTags) {
      await this.tagsInput.fill(tag);
      await this.page.keyboard.press('Enter');
    }

    await this.publishButton.click();
  }

  async verifyNoErrorMessages() {
    expect(await this.errorMessages.count()).toBe(0);
  }

  async verifySuccessMessagePresent() {
    const message = await this.successMessages.first().textContent();
    expect(message).toContain(this.SUCCESS_MESSAGE);
  }
}
