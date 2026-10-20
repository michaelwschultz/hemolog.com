import { defineConfig } from 'cypress'

// Populate process.env with values from .env file
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  retries: 3,
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
})
