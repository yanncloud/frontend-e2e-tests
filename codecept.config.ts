import config from './config'

const { adminUser, frontendUrl, isCI } = config

exports.config = {
  tests: 'tests/**.ts',
  output: './output', // we are not using any artifacts right now, but still need an output directory
  helpers: {
    Playwright: {
      url: frontendUrl,
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
      saveToFile: false,
      inject: 'login',
      users: {
        admin: {
          login: (I) => {
            I.amOnPage('/')
            I.see('Anmelden')
            I.click('Anmelden')
            I.waitForText('Benutzername oder E-Mailadresse', 10)
            I.fillField('Benutzername oder E-Mailadresse', adminUser)
            I.fillField('Passwort', '123456')
            I.click('Anmelden', "button[value='password']")
            I.waitForText(`Willkommen ${adminUser}!`, 30)
          },
          check: (I) => {
            I.amOnPage('/')
            I.waitForElement(
              `header nav img[title='Benutzer*in ${adminUser}']`,
              15
            )
          },
          // see https://github.com/codeceptjs/CodeceptJS/issues/1591#issuecomment-480800333
          fetch: () => 'whatever',
          restore: () => {},
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
