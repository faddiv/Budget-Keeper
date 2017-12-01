// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
//declare const require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// TODO: initialization

// Then we find all the tests.
const context = require.context("./", true, /\.spec\.tsx?$/);
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();