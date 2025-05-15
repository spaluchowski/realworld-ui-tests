import { test, expect } from '@playwright/test';
import { EditorPage } from '@/pages/EditorPage';
import { CommentSection } from '@/pages/CommentSection';
import {MyProfilePage} from "@/pages/MyProfilePage";
import {getRegisteredAndLoggedUser} from "@/utils/fixtures";

test.describe('Article Comments', () => {
  let articleTitle: string;
  let articleDescription: string;
  let articleBody: string;
  let commentText: string;

  test.beforeAll(async () => {
    // Generate article data
    articleTitle = `Test Article for Comments ${Date.now()}`;
    articleDescription = 'This is a test article description for testing comments';
    articleBody = 'This is the content of the article for testing comments.';
    commentText = `This is a test comment ${Date.now()}`;
  });

  test.beforeEach(async ({ page }) => {
    await getRegisteredAndLoggedUser(page);

    // Create a new article
    const editorPage = new EditorPage(page);
    await editorPage.goto();
    await editorPage.createArticle(
      {
        title:articleTitle,
        description:articleDescription,
        body:articleBody,
        tags:['comments', 'test']
      }
    );

    const myProfilePage = new MyProfilePage(page);
    await myProfilePage.goto();

    // Navigate to the article page
    await myProfilePage.clickOnArticleByTitle(articleTitle);
  });

  test('user can add a comment to an article', async ({ page }) => {
    const commentSection = new CommentSection(page);
    await commentSection.addComment(commentText);
    await commentSection.checkCommentExists(commentText);
  });

  //Looks like a bug - no button visible for the user to delete their own comments
  test('user can delete their own comment', async ({ page }) => {
    const commentSection = new CommentSection(page);
    
    await commentSection.addComment(commentText);
    await commentSection.checkCommentExists(commentText);
    const initialCommentCount = await commentSection.getCommentCount();
    await commentSection.deleteComment(0);
    await commentSection.checkCommentNotExists(commentText);
    
    const finalCommentCount = await commentSection.getCommentCount();
    expect(finalCommentCount).toBe(initialCommentCount - 1);
  });

  test('comments should persist after page reload', async ({ page }) => {
    const commentSection = new CommentSection(page);
    const persistentComment = `Persistent comment ${Date.now()}`;
    
    await commentSection.addComment(persistentComment);
    await commentSection.checkCommentExists(persistentComment);
    
    await page.reload();
    await commentSection.checkCommentExists(persistentComment);
  });
});
