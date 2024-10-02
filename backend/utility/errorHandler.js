class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        
        // Set the prototype explicitly for custom errors
        Object.setPrototypeOf(this, ErrorHandler.prototype);

        this.statusCode = statusCode;

        // Capture stack trace if available
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error()).stack;
        }
    }
}

export default ErrorHandler;
