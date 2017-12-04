import { validate, required, fieldEquals, ValidationConfig, ValidationState } from 'walletCommon/validation';

describe("validator", () => {
    let state: {
        invalid: string;
        valid: string;
    };

    let props = {};

    let config:ValidationConfig<typeof state, typeof props>;

    beforeEach(() => {
        state = {
            invalid: "",
            valid: "asdf"
        };

        config = {
            invalid: {
                validators: [{
                    validator: required,
                    message: "it is invalid"
                }]
            },
            valid: {
                validators: [{
                    validator: required,
                    message: "it is invalid"
                }]
            }
        };
        props = {};
    });

    it("should create initial validation", () => {
        var valStat: ValidationState = {}
        var result = validate(config, valStat, state, props);

        expect(result).toBeDefined();
        expect(result.changed).toBe(true, "because result is changed");
        expect(result.isValid).toBe(false, "because result is not valid");
        expect(result.validationState).toBeDefined("because validationState should be created");
    });
    
    it("should set invalid field initial validation state", () => {
        var valStat: ValidationState = {}
        var result = validate(config, valStat, state, props);

        var invalidField = result.validationState.invalid;
        expect(invalidField).toBeDefined();
        expect(invalidField.isValid).toBe(false,"because result is not valid");
        expect(invalidField.isDirty).toBe(false, "because result is not dirty");
        expect(invalidField.showError).toBe(false,"because don't need to show message");
        expect(invalidField.message).not.toBeDefined("because message won't show up");
    });
    
    it("should set invalid field state correctly", () => {
        var valStat: ValidationState = {
            invalid: {
                isDirty: false,
                isValid: true,
                showError: false,
                value: "asdf"
            }
        };
        var result = validate(config, valStat, state, props);

        var invalidField = result.validationState.invalid;
        expect(invalidField).toBeDefined();
        expect(invalidField).not.toBe(valStat.invalid, "because it should be uppdated");
        expect(invalidField.isValid).toBe(false,"because result is not valid");
        expect(invalidField.isDirty).toBe(true, "because result changed");
        expect(invalidField.showError).toBe(true,"because dirty invalid field should show");
        expect(invalidField.message).toBeDefined("because message should visible");
    });
    
    it("should set valid field initial validation state", () => {
        var valStat: ValidationState = {}
        var result = validate(config, valStat, state, props);

        var validField = result.validationState.valid;
        expect(validField).toBeDefined();
        expect(validField.isValid).toBe(true,"because result is valid");
        expect(validField.isDirty).toBe(false, "because result is not dirty");
        expect(validField.showError).toBe(false,"because don't need to show message");
        expect(validField.message).not.toBeDefined("because message won't show up");
    });
    
    it("should set valid field state correctly", () => {
        var valStat: ValidationState = {
            valid: {
                isDirty: false,
                isValid: false,
                showError: true,
                value: ""
            }
        };
        var result = validate(config, valStat, state, props);

        var validField = result.validationState.valid;
        expect(validField).toBeDefined();
        expect(validField.isValid).toBe(true,"because result is valid");
        expect(validField.isDirty).toBe(true, "because result changed");
        expect(validField.showError).toBe(false,"because don't need to show message");
        expect(validField.message).not.toBeDefined("because message won't show up");
    });
    
    it("showError parameter should set showError on on invalid", () => {
        var valStat: ValidationState = {};
        var result = validate(config, valStat, state, props, true);

        var invalidField = result.validationState.invalid;
        expect(invalidField).toBeDefined();
        expect(invalidField.isValid).toBe(false,"because result is not valid");
        expect(invalidField.isDirty).toBe(false, "because result changed");
        expect(invalidField.showError).toBe(true,"because showError parameter");
        expect(invalidField.message).toBeDefined("because message should visible");
    });
    
    it("if nothing changes it returns the same object", () => {
        var valStat: ValidationState = {};
        var result1 = validate(config, valStat, state, props);
        var result2 = validate(config, result1.validationState, state, props);
        
        expect(result1.validationState).toBe(result2.validationState,"because nothing changed");
        expect(result2.changed).toBe(false, "because should report nothing changed");
    });
    
    it("if everything is valid then it reported", () => {
        var valStat: ValidationState = {};
        var result1 = validate(config, valStat, state, props);
        state.invalid = "asdf";
        var result2 = validate(config, result1.validationState, state, props);
        
        expect(result1.validationState).not.toBe(result2.validationState,"because changes");
        expect(result2.changed).toBe(true, "because should report changes");
        expect(result2.isValid).toBe(true, "because should report valid state");
    });
    
    it("if showError enabled then validationState should change", () => {
        var valStat: ValidationState = {};
        var result1 = validate(config, valStat, state, props);
        var result2 = validate(config, result1.validationState, state, props, true);
        
        expect(result1.validationState).not.toBe(result2.validationState,"because showError changes state");
        expect(result2.changed).toBe(true, "because should report changes");
    });
    
    it("in case state undefined then getter don't called and value is undefined", () => {
        var valStat: ValidationState = {};
        config.valid.valueGetter = state => state.valid.length < 5;
        var result = validate(config, valStat, undefined, props);
        
        expect(result.validationState).toBeDefined("because validation state initialized");
        expect(result.changed).toBe(true, "because validation state changed");
        expect(result.validationState.valid.showError).toBe(false, "because dont show error in initial state");
        expect(result.validationState.invalid.showError).toBe(false, "because dont show error in initial state");
    });
    
    
    it("in case state undefined then the additional getters don't called and value is undefined", () => {
        var valStat: ValidationState = {};
        var errMsg = "Fields not equal";
        config.valid.valueGetter = state => state.valid.length < 5;
        config.valid.validators = [
            {
                extraParams: [
                    (state) => state.invalid.length
                ],
                validator: fieldEquals,
                message: errMsg
            }
        ];
        var result = validate(config, valStat, undefined, props);
        
        expect(result.validationState).toBeDefined("because validation state initialized");
        expect(result.changed).toBe(true, "because validation state changed");
    });
    
    it("the additional getters called when necessary", () => {
        var valStat: ValidationState = {};
        var errMsg = "Fields not equal";
        config.valid.validators = [
            {
                extraParams: [
                    (state) => state.invalid
                ],
                validator: fieldEquals,
                message: errMsg
            }
        ];
        var result = validate(config, valStat, state, props, true);
        
        expect(result.validationState).toBeDefined("because validation state initialized");
        expect(result.validationState.valid.isValid).toBe(false, "because two field different");
        expect(result.validationState.valid.message).toBe(errMsg, "because it should be showed");
    });
});