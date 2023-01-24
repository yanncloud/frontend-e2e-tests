const isCI = !!process.env.CI

exports.config = {
  tests: 'tests/**.ts',
  output: './output', // we are not using any artifacts right now, but still need an output directory
  helpers: {
    Playwright: {
      url: 'https://de.serlo-staging.dev',
      restart: 'keep',
      keepBrowserState: true,
      keepCookies: true,
      show: isCI ? false : true,
      ...(isCI
        ? {
            chromium: {
              args: ['--no-sandbox'], // this is needed for github CI to work
            },
          }
        : { browser: 'chromium' }),
    },
  },
  name: 'frontend-e2e-tests',
  plugins: {
    autoLogin: {
      enabled: true,
      saveToFile: true,
      inject: 'login',
      users: {
        admin: {
          login: (I) => {
            I.amOnPage('/')
            I.see('Anmelden')
            I.click('Anmelden')
            I.waitForText('Benutzername oder E-Mailadresse', 10)
            I.fillField('Benutzername oder E-Mailadresse', 'kulla')
            I.fillField('Passwort', '123456')
            I.pressKey('Enter')
            I.waitForText('Willkommen Kulla!', 10)
          },
          check: (I) => {
            I.amOnPage('/')
            I.waitForElement("header nav img[title='Benutzer*in Kulla']", 5)
          },
        },
      },
    },
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true,
    },
    tryTo: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: false,
    },
  },
}
