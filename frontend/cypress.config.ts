import { defineConfig } from 'cypress';
// import rep from 'cypress-terminal-report/src/installLogsPrinter';

export default defineConfig({
  e2e: {
    video: false,
    setupNodeEvents(on, config) {
      // rep(on, { printLogsToConsole: 'always' });
      on('task', {
        log(message) {
          console.log(message);

          return null;
        },
      });
    },
  },
});
