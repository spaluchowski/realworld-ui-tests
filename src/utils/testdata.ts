export const article = () => {
  const date = Date.now();
  return {
    title: `Test Article ${date}`,
    description: `This is another test article description ${date}`,
    body: `This is the body of the second test article. It contains some content to test the article creation functionality. ${date}`,
    tags: ['test', 'automation'],
  }
};

export const comment = () => {
  const date = Date.now();
  return {
    body: `This is a test comment ${date}`,
  }
};

export type User = {
  username: string;
  email: string;
  password: string;
};

export const user = (): User => {
  const date = Date.now();
  return {
    username: `user_${date}`,
    email: `email_${date}@email.com`,
    password: `password_${date}`,
  };
};
