# Sample Digital Scout API Client Usage

Sample/example code for how to access the Digital Scout (formerly HSGC or GameCenter) API and to display the resulting box scores.

## License

This code is released under the [MIT license](http://www.opensource.org/licenses/MIT). But keep in mind, that is for the source code in this repository and its use and distribution. However, this code doesn't do much without access to the Digital Scout API and data. Access to that API falls under separate agreements per the terms of use at www.digitalscout.com and through your written agreements with Digital Sscout, LLC. Contact support@digitalscout.com with questions or for requesting access to the API.

## Usage

### *node.js*
1. Requires: **[nodejs](https://nodejs.org/), npm**
	- An appropriate version of npm comes in the nodejs install
	- On Windows, you may need to re-log or restart after installation for your `PATH` environment variable to be updated for your console sessions
2. Go to the `node` directory in your local copy of the repository 
3. Run `npm install`
4. Edit `app.js` to include your API `username` and `password`
5. `node app.js`

### *C#*
1. Requires: **Visual Studio 2012+**
2. Open `ApiClient.sln`
3. Edit `Username` and `Password` at the top of `program.cs` with the credentials supplied to you for the API
4. Build and Run the application