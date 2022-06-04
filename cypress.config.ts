import { defineConfig } from 'cypress'

// Populate process.env with values from .env file
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
  },
  env: {
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    googleClientId: process.env.REACT_APP_GOOGLE_CLIENTID,
    googleClientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
  },
})
