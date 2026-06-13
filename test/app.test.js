const test = require('node:test');
const assert = require('node:assert/strict');
const session = require('express-session');
const request = require('supertest');
const { createApp } = require('../app');

function makeAgent() {
    const app = createApp({ sessionStore: new session.MemoryStore() });
    return request.agent(app);
}

function extractCsrfToken(html) {
    return html.match(/name="_csrf" value="([^"]+)"/)?.[1];
}

test('unknown routes return a 404 page', async () => {
    const response = await makeAgent().get('/not-a-real-page');
    assert.equal(response.status, 404);
    assert.match(response.text, /Page not found/);
});

test('home page renders with a CSRF-enabled logout/session setup', async () => {
    const response = await makeAgent().get('/');
    assert.equal(response.status, 200);
    assert.match(response.text, /YelpCamp/);
});

test('unsafe requests without a CSRF token are rejected', async () => {
    const response = await makeAgent().post('/users/register').type('form').send({
        email: 'person@example.com',
        username: 'person',
        password: 'password123',
    });
    assert.equal(response.status, 403);
    assert.match(response.text, /Invalid or missing security token/);
});

test('registration input is validated after CSRF verification', async () => {
    const agent = makeAgent();
    const form = await agent.get('/users/register');
    const csrfToken = extractCsrfToken(form.text);
    assert.ok(csrfToken);

    const response = await agent.post('/users/register').type('form').send({
        _csrf: csrfToken,
        email: 'not-an-email',
        username: 'x!',
        password: 'short',
    });
    assert.equal(response.status, 400);
    assert.match(response.text, /valid email/);
});
