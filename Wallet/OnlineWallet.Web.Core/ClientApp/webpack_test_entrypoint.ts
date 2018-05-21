// This file is required by karma.conf.js and loads recursively all the .spec and framework files
declare var __karma__;
// Prevent Karma from running prematurely.
__karma__.loaded = () => {};

// Then we find all the tests.
const context = require.context("./", true, /\.spec\.tsx?$/);
// And load the modules.
context.keys().map(context);

// Finally, start Karma to run the tests.
__karma__.start();
