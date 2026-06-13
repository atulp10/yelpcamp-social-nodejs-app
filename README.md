# YelpCamp

An Express, MongoDB, Mapbox, and Cloudinary campground application.

## Requirements

- Node.js 24
- MongoDB
- Mapbox public token
- Cloudinary account

## Local setup

1. Copy `.env.example` to `.env` and fill in the values.
2. Install dependencies with `npm install`.
3. Start MongoDB and run `npm run dev`.
4. Open `http://localhost:3000`.

## Commands

- `npm start` starts the production server.
- `npm run dev` starts Node in watch mode.
- `npm run check` validates JavaScript syntax.
- `npm test` runs the automated tests.
- `npm run seed` replaces campground data with the ten demo records.

Remote seeding is blocked by default. Set `ALLOW_REMOTE_SEED=true` only for the command that should intentionally replace remote campground data. Set `SEED_AUTHOR_ID` to an existing user when ownership should be deterministic.

## Production

Configure every variable in `.env.example` in the hosting provider. Production startup fails when database, session, Mapbox, or Cloudinary credentials are missing.
