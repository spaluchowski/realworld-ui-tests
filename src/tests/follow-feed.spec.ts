import { test, expect } from '@/utils/fixtures';
import { RegisterPage } from '@/pages/RegisterPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ArticlePage } from '@/pages/ArticlePage';
import { config } from '@/utils/config';
import {EditorPage} from "@/pages/EditorPage";
import {HomePage} from "@/pages/HomePage";
import {LoginPage} from "@/pages/LoginPage";

test.describe('Follow Feed', () => {

  test('User A follows User B, User B publishes article, article shows in User A feed', async ({ browser }) => {
    const userAUsername = `user_a_${Date.now()}`;
    const userAEmail = `${userAUsername}@example.com`;
    const userAPassword = config.testUser.password;

    const userBUsername = `user_b_${Date.now()}`;
    const userBEmail = `${userBUsername}@example.com`;
    const userBPassword = config.testUser.password;

    // Step 1: Register User A
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();

    // Step 2: Register User B in a separate context
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();

    const registerPageA = new RegisterPage(pageA);
    await registerPageA.goto();
    await registerPageA.registerAndVerify(userAUsername, userAEmail, userAPassword);

    const loginPageA = new LoginPage(pageA);
    await loginPageA.goto();
    await loginPageA.loginAndVerify(userAEmail, userAPassword, userAUsername);

    const registerPageB = new RegisterPage(pageB);
    await registerPageB.goto();
    await registerPageB.registerAndVerify(userBUsername, userBEmail, userBPassword);

    const loginPageB = new LoginPage(pageB);
    await loginPageB.goto();
    await loginPageB.loginAndVerify(userBEmail, userBPassword, userBUsername);

    const articleTitle = `Test Article ${Date.now()}`;
    const articleDescription = 'This is a test article description';
    const articleBody = 'This is the body of the test article with some content.';
    const articleTags = ['test', 'automation'];

    // Step 3: User A follows User B
    const profilePageA = new ProfilePage(pageA);
    await profilePageA.goto(userBUsername);
    await profilePageA.verifyUsername(userBUsername);
    await profilePageA.clickFollowButton();
    
    // Step 4: User B creates a new article
    const editorPageB = new EditorPage(pageB);
    await editorPageB.goto();
    await editorPageB.createArticle({
      title: articleTitle,
      description: articleDescription,
      body: articleBody,
      tags: articleTags
    });

    // Step 5: User A checks their feed and verifies the article appears
    const feedPageA = new HomePage(pageA);
    await feedPageA.goto();
    // await feedPageA.switchToYourFeed();
    
    // Verify that User B's article appears in User A's feed
    await feedPageA.verifyArticleByTitleAndAuthor(articleTitle, userBUsername);
    
    // Click on the article to verify it's the correct one
    const slug = await feedPageA.openArticleByTitleAndAuthor(articleTitle, userBUsername);
    
    const articlePageA = new ArticlePage(pageA);
    await articlePageA.verifyTitle(articleTitle);
    await articlePageA.verifyBody(articleBody);
    await articlePageA.verifyAuthor(userBUsername);
    
    // Cleanup - close contexts
    await contextA.close();
    await contextB.close();
  });
});
