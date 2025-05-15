import { test, expect } from '@/utils/fixtures';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { config } from '@/utils/config';

test.describe('Authentication', () => {
  test('should register a new user', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const uniqueUsername = `user_${Date.now()}`;
    const uniqueEmail = `user_${Date.now()}@example.com`;
    const password = config.testUser.password;

    await registerPage.goto();
    await registerPage.registerAndVerify(uniqueUsername, uniqueEmail, password);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const uniqueUsername = `login_user_${Date.now()}`;
    const uniqueEmail = `login_user_${Date.now()}@example.com`;
    const password = config.testUser.password;

    await registerPage.goto();
    await registerPage.registerAndVerify(uniqueUsername, uniqueEmail, password);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndVerify(uniqueEmail, password, uniqueUsername);
  });

  test('should show error message with invalid login credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong@example.com', 'wrongpassword');
    
    await loginPage.verifyLoginErrorMessage('Invalid email or password');
    
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.verifyUserIsLoggedOut();
  });
});
