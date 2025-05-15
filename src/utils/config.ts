import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface TestUser {
  email: string;
  username: string;
  password: string;
}

interface DockerConfig {
  network: string;
  djangoImage: string;
  angularImage: string;
  djangoPort: number;
  angularPort: number;
}

interface TimeoutConfig {
  navigation: number;
  element: number;
  assertion: number;
}

export interface Config {
  baseUrl: string;
  apiUrl: string;
  testUser: TestUser;
  docker: DockerConfig;
  timeout: TimeoutConfig;
}

export function loadConfig(): Config {
  try {
    const configFile = process.env.CONFIG_FILE || path.join(process.cwd(), 'config', 'default.yml');
    const fileContents = fs.readFileSync(configFile, 'utf8');
    const config = yaml.load(fileContents) as Config;
    
    // Override with environment variables if they exist
    if (process.env.BASE_URL) config.baseUrl = process.env.BASE_URL;
    if (process.env.API_URL) config.apiUrl = process.env.API_URL;
    if (process.env.TEST_USER_EMAIL) config.testUser.email = process.env.TEST_USER_EMAIL;
    if (process.env.TEST_USER_USERNAME) config.testUser.username = process.env.TEST_USER_USERNAME;
    if (process.env.TEST_USER_PASSWORD) config.testUser.password = process.env.TEST_USER_PASSWORD;
    
    return config;
  } catch (error) {
    console.error('Error loading configuration:', error);
    throw error;
  }
}

export const config = loadConfig();
