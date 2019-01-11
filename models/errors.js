class EmailNotFoundError extends Error {
    constructor(...args) {
        super(...args)
        this.code = "USR003"
        this.message = "Email not found in the system"
        this.details = "You need to provide a registered user's email address"
        Error.captureStackTrace(this, EmailNotFoundError)
    }
}

class UserNotFoundError extends Error {
    constructor(...args) {
        super(...args);
        this.code = "USR009"
        this.message = "User not found"
        this.details = "User not found"
        Error.captureStackTrace(this, UserNotFoundError)
    }
}

class UserAlreadyRegisteredError extends Error {
    constructor(...args) {
        super(...args)
        this.code = "USR006"
        this.message = "Error signing up the user"
        this.details = "Email already used"
        Error.captureStackTrace(this, UserAlreadyRegisteredError)
    }
}

class UnauthorizedUserError extends Error {
    constructor(...args) {
        super(...args)
        this.code = "USR007"
        this.message = "Unauthorized"
        this.details = "User does not have the permission to make this action"
        Error.captureStackTrace(this, UnauthorizedUserError)
    }
}


class AccountNotFoundError extends Error {
    constructor(...args) {
        super(...args)
        this.code = "PGM006"
        this.message = "Account not found"
        this.details = "Requested account was not found"
        Error.captureStackTrace(this, AccountNotFoundError)
    }
}

class ExpiredTokenError extends Error {
    constructor(...args) {
        super(...args)
        this.code = "USR014"
        this.message = "Expired token"
        this.details = "Get a new token by logging in again or by using a refresh token"
        Error.captureStackTrace(this, ExpiredTokenError)
    }
}
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${msg}`;
};
module.exports = {
    EmailNotFoundError,
    UserNotFoundError,
    UserAlreadyRegisteredError,
    UnauthorizedUserError,
    errorFormatter,
    AccountNotFoundError,
    ExpiredTokenError
} 