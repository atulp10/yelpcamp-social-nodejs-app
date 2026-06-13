module.exports = value => JSON.stringify(value).replace(/</g, '\\u003c');
