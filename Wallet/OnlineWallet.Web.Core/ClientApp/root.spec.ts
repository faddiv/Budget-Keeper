import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = () => {};

// Then we find all the tests.
const context = require.context("./", true, /\.spec\.tsx?$/);
// And load the modules.
context.keys().map(context);

beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
});

// Finally, start Karma to run the tests.
__karma__.start();
