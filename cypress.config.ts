import { defineConfig } from 'cypress'

// Populate process.env with values from .env file
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  retries: 3,
  e2e: {
    baseUrl: 'http://localhost:3000',
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
  },
})
