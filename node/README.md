# ds-api-sample-js

Sample node (JavaScript) code to access the Digital Scout API

## Install

Standard node install. `npm` for package management.

- `node install`
- `npm update`

## Run

- Add your credentials to the top of `app.js` (:warning: Do not commit these back to the repository!)
- Run `node app.js`

Some other things you might want to change/test:

- Read the top of `app.js` and comment/uncomment some of the functions at the top, or change it to call some of the others there
- If you want to see the latest season instead of the current hard-coded one, update `currentUniversalSeasonId` at the top of `apiClient.js` with the latest ID obtained from the API call listed there
