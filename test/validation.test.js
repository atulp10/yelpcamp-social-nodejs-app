const test = require('node:test');
const assert = require('node:assert/strict');
const { campSchema, reviewSchema, userSchema } = require('../schemas');
const serialize = require('../utilities/serialize');

test('campground validation accepts a complete campground', () => {
    const { error } = campSchema.validate({
        campground: {
            title: 'Forest Camp',
            location: 'Asheville, North Carolina',
            description: 'A quiet forest campground with nearby hiking trails.',
            price: 35.5,
        },
    });
    assert.equal(error, undefined);
});

test('campground validation rejects HTML and negative prices', () => {
    const { error } = campSchema.validate({
        campground: {
            title: '<script>alert(1)</script>',
            location: 'Somewhere',
            description: 'A sufficiently long campground description for testing.',
            price: -1,
        },
    }, { abortEarly: false });
    assert.match(error.message, /must not include HTML/);
    assert.match(error.message, /greater than or equal to 0/);
});

test('review validation enforces rating range', () => {
    const { error } = reviewSchema.validate({ review: { body: 'Great camp.', rating: 6 } });
    assert.match(error.message, /less than or equal to 5/);
});

test('registration validation enforces credentials', () => {
    const { error } = userSchema.validate({
        email: 'invalid',
        username: 'x!',
        password: 'short',
    }, { abortEarly: false });
    assert.ok(error.details.length >= 3);
});

test('script serializer neutralizes closing script tags', () => {
    const output = serialize({ title: '</script><script>alert(1)</script>' });
    assert.equal(output.includes('</script>'), false);
    assert.equal(output.includes('\\u003c'), true);
});
