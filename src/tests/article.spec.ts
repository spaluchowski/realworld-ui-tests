import {test, expect, getRegisteredAndLoggedUser} from '@/utils/fixtures';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import {EditorPage} from "@/pages/EditorPage";
import {MyProfilePage} from "@/pages/MyProfilePage";
import {MyArticlePage} from "@/pages/MyArticlePage";
import {article, User} from "@/utils/testdata";

test.describe('Article Creation', () => {
  let user: User;

  test.beforeEach(async ( {page}) => {
     user = await getRegisteredAndLoggedUser(page);
  });

  test('logged-in user can create an article and see it in My Articles', async ({ page }) => {
    const articleData = article();

    // Create a new article
    const articlePage = new EditorPage(page);
    await articlePage.goto();
    
    await articlePage.createArticle(articleData);

    // Navigate to profile page and verify article appears in My Articles
    const profilePage = new ProfilePage(page);
    await profilePage.goto(user.username);
    await profilePage.clickMyArticlesTab();
    await profilePage.verifyArticleExists(articleData.title);
    
    // Verify article content by opening it
    await profilePage.openArticle(articleData.title);
    await expect(page.locator('h1')).toHaveText(articleData.title);
    await expect(page.locator('.article-content p')).toHaveText(articleData.body);
  });


  test('author can update article body and tags', async ({ page }) => {
    const articleData = article();
    const articleData2 = article();

    // Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.email, user.password);

    // Create a new article
    const editorPage1 = new EditorPage(page);
    await editorPage1.goto();
    await editorPage1.createArticle(articleData);

    const articleListPage = new MyProfilePage(page);
    await articleListPage.goto();
    await articleListPage.clickOnArticleByTitle(articleData.title);

    // Edit the article
    const articlePage = new MyArticlePage(page);
    await articlePage.clickEdit();

    // Update article content and tags
    const editorPage = new EditorPage(page);
    await editorPage.updateArticle(articleData2.body, ['updated', 'newTag']);

    await articleListPage.goto();
    await articleListPage.clickOnArticleByTitle(articleData.title);

    // Verify changes
    await articlePage.verifyTitle(articleData2.title);
    await articlePage.verifyTags(['updated', 'newTag']);
  });

  test('author can delete the article', async ({ page }) => {
    const articleData = article();

    // Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.email, user.password);

    // Create a new article
    const editorPage1 = new EditorPage(page);
    await editorPage1.goto();
    await editorPage1.createArticle(articleData);

    // Navigate to global feed to find the article
    const articleListPage = new MyProfilePage(page);
    await articleListPage.goto();
    await articleListPage.clickGlobalFeed();
    await articleListPage.clickOnArticleByTitle(articleData.title);

    // Delete the article
    const articlePage = new MyArticlePage(page);
    await articlePage.deleteArticle();

    // Verify we're redirected to home page
    await expect(page).toHaveURL(/^.*\/#\//);

    // Check that article no longer exists in the global feed
    await articleListPage.clickGlobalFeed();
    await articleListPage.checkArticleNotExists(articleData.title);
  });
});
