/**
 * Spendora Authentication Validation Schemas & Helpers
 * Derived from rules/auth/rules.md Section 4
 */

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_STRICT_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const authValidation = {
    name: {
        required: "Username is required and must be at least 3 characters",
        minLength: {
            value: 3,
            message: "Username is required and must be at least 3 characters",
        },
        maxLength: {
            value: 100,
            message: "Username cannot exceed 100 characters",
        },
    },

    registerEmail: {
        required: "Please enter a valid email address",
        pattern: {
            value: EMAIL_REGEX,
            message: "Please enter a valid email address",
        },
    },

    loginEmail: {
        required: "Email is required and must be a valid email",
        pattern: {
            value: EMAIL_REGEX,
            message: "Email is required and must be a valid email",
        },
    },

    registerPassword: {
        required: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
        minLength: {
            value: 8,
            message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
        },
        validate: (value) =>
            PASSWORD_STRICT_REGEX.test(value) ||
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    },

    loginPassword: {
        required: "Password is required",
    },
};
