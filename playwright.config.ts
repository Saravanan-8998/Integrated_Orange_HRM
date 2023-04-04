import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '..', 'env.ts') });

const RPconfig = {
  token: '8be9d121-af6a-44da-be10-61cb0e73fe10',
  endpoint: 'https://demo.reportportal.io/api/v1',
  project: 'ponbala_personal',
  launch: 'Playwright test',
  attributes: [
    {
      key: 'key',
      value: 'value',
    },
    {
      value: 'value',
    },
  ],
  description: 'Playwright Sample',
};

export default defineConfig({
  testDir: './tests',
  testMatch: ["tests/*.test.ts"],
  timeout: 60 * 60 * 1000,
  expect: {
    timeout: 10000
  },
  // fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: [["html", { open: 'always' }]],
  // reporter: process.env.CI ? 'github' : 'list',
  // reporter: [['@reportportal/agent-js-playwright', RPconfig]],
  use: {
    actionTimeout: 30000,
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    headless: false,
    trace: 'on',
    video: "on",
    screenshot: "on"
  },

  /* Configure projects for major browsers */

  projects: [
    {
      name: "Chromium",
      // fullyParallel: true,
      use: {
        browserName: "chromium",
        viewport: null,
        launchOptions: {
          args: ["--start-maximized"]
          // slowMo: 100
        }
      },
    },
    // {
    //   name: "Firefox",
    //   fullyParallel: true,
    //   use: {
    //     browserName: "firefox",
    //     viewport: { width: 1366, height: 667 }
    //   }
    // },
    // {
    //   name: "Webkit",
    //   fullyParallel: true,
    //   use: {
    //     browserName: "webkit",
    //     viewport: { width: 1366, height: 667 }
    //   }
    // },
  ]
  // outputDir: 'test-results/',
});
