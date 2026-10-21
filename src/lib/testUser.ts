// Credentials for the emulator "Continue with Test User" button.
// Used by sign-in and the seed script so they stay in sync.

export const TEST_USER = {
  email: 'michael+test@hemolog.com',
  password: 'test123',
  name: 'Test User',
  photoUrl: '/images/test-avatar.jpg',
  alertId: 'testuser',
  apiKey: 'test-api-key-local-dev',
  hemophiliaType: 'A',
  severity: 'Severe',
  medication: 'Eloctate',
  monoclonalAntibody: 'Hemlibra',
  injectionFrequency: 'Every 3 days',
  factor: 8,
} as const
