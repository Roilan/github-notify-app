## Github Notify App
### Get repo notifications that matter to you
- Why? Email notifications suck.
- It's cluttered and you might not want notifications from certain repos.
- You might miss notifications for repos that do matter to you.

### Developing
 - Create a local `dev.config.js` with your Github username / personal token (see dev.config.template.js and below for reference)
 - npm start (you'll see a cat icon in your menubar)
### Developing tips
- `cmd + r` refreshes the window / app
- `cmd + shift + i` opens dev tools
- If you get a node mismatch error, `npm run rebuild`
- Requires a Github personal token with notification permissions
-- Go [here](https://github.com/settings/tokens)
-- Click on `Generate new token`
-- Tick `notifications`
-- Save and copy into your `dev.config.js`
