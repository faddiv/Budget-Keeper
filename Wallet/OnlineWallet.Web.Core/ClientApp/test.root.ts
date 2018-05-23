import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import "jest-fetch-mock";

Enzyme.configure({ adapter: new Adapter() });
