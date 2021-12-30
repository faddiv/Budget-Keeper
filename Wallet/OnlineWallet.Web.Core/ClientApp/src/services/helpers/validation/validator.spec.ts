import { validate } from "./validator";
import { validators } from "./commonValidators";
import { ValidationConfig, ValidationState, ValidationResult, ValidationStateElement } from "./interfaces";

describe("validator", () => {
    let state: {
        invalid: string;
        valid: string;
    };

    let props = {};

    let config: ValidationConfig<typeof state, typeof props>;

    beforeEach(() => {
        state = {
            invalid: "",
            valid: "asdf"
        };

        config = {
            invalid: {
                validators: [{
                    validator: validators.required,
                    message: "it is invalid"
                }]
            },
            valid: {
                validators: [{
                    validator: validators.required,
                    message: "it is invalid"
                }]
            }
        };
        props = {};
    });

    describe("initial validation", () => {
        let result: ValidationResult;
        let validField: ValidationStateElement;

        beforeEach(() => {
            const valStat: ValidationState = {};
            result = validate(config, valStat, state, props);
            validField = result.validationState.valid;
        });
        it("should be created", () => {
            expect(result).toBeDefined();
        });

        it("should be in changed state", () => {
            expect(result.changed).toBe(true);
        });

        it("should be in invalid state", () => {
            expect(result.isValid).toBe(false);
        });

        it("should have validation state", () => {
            expect(result.validationState).toBeDefined();
        });

        it("should create field 'valid' on 'validationState'", () => {
            expect(validField).toBeDefined();
        });

        it("should set field 'valid' to valid", () => {
            expect(validField.isValid).toBe(true);
        });

        it("should set field 'valid' to pristine", () => {
            expect(validField.isDirty).toBe(false);
        });

        it("should set field 'valid' not to show error", () => {
            expect(validField.showError).toBe(false);
        });

        it("should field 'valid' not to have message", () => {
            expect(validField.message).not.toBeDefined();
        });

    });

    describe("state update", () => {
        const valStat: ValidationState = {
            invalid: {
                isDirty: false,
                isValid: true,
                showError: false,
                value: "asdf"
            }
        };
        let invalidField: ValidationStateElement;

        beforeEach(() => {
            const result = validate(config, valStat, state, props);
            invalidField = result.validationState.invalid;
        });

        it("should be created", () => {
            expect(invalidField).toBeDefined();
        });

        it("should update state", () => {
            expect(invalidField).not.toBe(valStat.invalid);
        });

        it("should be in invalid state", () => {
            expect(invalidField.isValid).toBe(false);
        });

        it("should be in dirty state", () => {
            expect(invalidField.isDirty).toBe(true);
        });

        it("should show the error", () => {
            expect(invalidField.showError).toBe(true);
        });

        it("should have error message", () => {
            expect(invalidField.message).toBeDefined();
        });
    });

    it("should set valid field state correctly", () => {
        const valStat: ValidationState = {
            valid: {
                isDirty: false,
                isValid: false,
                showError: true,
                value: ""
            }
        };
        const result = validate(config, valStat, state, props);

        const validField = result.validationState.valid;
        expect(validField).toBeDefined();
        expect(validField.isValid).toBe(true); // "because result is valid"
        expect(validField.isDirty).toBe(true); // "because result changed"
        expect(validField.showError).toBe(false); // "because don't need to show message"
        expect(validField.message).not.toBeDefined(); // "because message won't show up"
    });

    it("showError parameter should set showError on on invalid", () => {
        const valStat: ValidationState = {};
        const result = validate(config, valStat, state, props, true);

        const invalidField = result.validationState.invalid;
        expect(invalidField).toBeDefined();
        expect(invalidField.isValid).toBe(false); // "because result is not valid"
        expect(invalidField.isDirty).toBe(false); // "because result changed"
        expect(invalidField.showError).toBe(true); // "because showError parameter"
        expect(invalidField.message).toBeDefined(); // "because message should visible"
    });

    it("if nothing changes it returns the same object", () => {
        const valStat: ValidationState = {};
        const result1 = validate(config, valStat, state, props);
        const result2 = validate(config, result1.validationState, state, props);

        expect(result1.validationState).toBe(result2.validationState); // "because nothing changed"
        expect(result2.changed).toBe(false); // "because should report nothing changed"
    });

    it("if everything is valid then it reported", () => {
        const valStat: ValidationState = {};
        const result1 = validate(config, valStat, state, props);
        state.invalid = "asdf";
        const result2 = validate(config, result1.validationState, state, props);

        expect(result1.validationState).not.toBe(result2.validationState); // "because changes"
        expect(result2.changed).toBe(true); // "because should report changes"
        expect(result2.isValid).toBe(true); // "because should report valid state"
    });

    it("if showError enabled then validationState should change", () => {
        const valStat: ValidationState = {};
        const result1 = validate(config, valStat, state, props);
        const result2 = validate(config, result1.validationState, state, props, true);

        expect(result1.validationState).not.toBe(result2.validationState); // "because showError changes state"
        expect(result2.changed).toBe(true); // "because should report changes"
    });

    it("in case state undefined then getter don't called and value is undefined", () => {
        const valStat: ValidationState = {};
        config.valid.valueGetter = _state => _state.valid.length < 5;
        const result = validate(config, valStat, undefined, props);

        expect(result.validationState).toBeDefined(); // "because validation state initialized"
        expect(result.changed).toBe(true); // "because validation state changed"
        expect(result.validationState.valid.showError).toBe(false); // "because dont show error in initial state"
        expect(result.validationState.invalid.showError).toBe(false); // "because dont show error in initial state"
    });

    it("in case state undefined then the additional getters don't called and value is undefined", () => {
        const valStat: ValidationState = {};
        const errMsg = "Fields not equal";
        config.valid.valueGetter = _state => _state.valid.length < 5;
        config.valid.validators = [
            {
                extraParams: [
                    (_state) => _state.invalid.length
                ],
                validator: validators.fieldEquals,
                message: errMsg
            }
        ];
        const result = validate(config, valStat, undefined, props);

        expect(result.validationState).toBeDefined(); // "because validation state initialized"
        expect(result.changed).toBe(true); // "because validation state changed"
    });

    it("the additional getters called when necessary", () => {
        const valStat: ValidationState = {};
        const errMsg = "Fields not equal";
        config.valid.validators = [
            {
                extraParams: [
                    (_state) => _state.invalid
                ],
                validator: validators.fieldEquals,
                message: errMsg
            }
        ];
        const result = validate(config, valStat, state, props, true);

        expect(result.validationState).toBeDefined(); // "because validation state initialized"
        expect(result.validationState.valid.isValid).toBe(false); // "because two field different"
        expect(result.validationState.valid.message).toBe(errMsg); // "because it should be showed"
    });
});
