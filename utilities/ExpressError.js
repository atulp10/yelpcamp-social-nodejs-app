class ExpressError extends Error{
    constructor(message,statusCode){
        super(message);
        this.name='ExpressError';
        this.statusCode=statusCode;
    }
}

module.exports = ExpressError;
