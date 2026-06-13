const test = require('node:test');
const assert = require('node:assert/strict');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { isAuthor, isReviewAuthor, validateObjectId } = require('../middleware');

function queryResult(value) {
    return { select: async () => value };
}

test('invalid MongoDB identifiers are rejected before querying', () => {
    let receivedError;
    validateObjectId('id')({ params: { id: 'bad-id' } }, {}, error => { receivedError = error; });
    assert.equal(receivedError.statusCode, 400);
});

test('campground ownership middleware returns 404 for missing records', { concurrency: false }, async () => {
    const original = Campground.findById;
    Campground.findById = () => queryResult(null);
    let receivedError;

    try {
        await isAuthor(
            { params: { id: '507f1f77bcf86cd799439011' }, user: { _id: '507f1f77bcf86cd799439012' } },
            {},
            error => { receivedError = error; }
        );
        assert.equal(receivedError.statusCode, 404);
    } finally {
        Campground.findById = original;
    }
});

test('review ownership middleware rejects a different author', { concurrency: false }, async () => {
    const original = Review.findById;
    Review.findById = () => queryResult({
        author: { equals: () => false },
    });
    let redirectUrl;

    try {
        await isReviewAuthor(
            {
                params: { id: '507f1f77bcf86cd799439011', reviewId: '507f1f77bcf86cd799439012' },
                user: { _id: '507f1f77bcf86cd799439013' },
                flash() {},
            },
            { redirect(url) { redirectUrl = url; } },
            () => {}
        );
        assert.equal(redirectUrl, '/campgrounds/507f1f77bcf86cd799439011');
    } finally {
        Review.findById = original;
    }
});
