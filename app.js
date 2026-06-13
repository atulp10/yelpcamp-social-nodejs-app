const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const { rateLimit } = require('express-rate-limit');
const multer = require('multer');

const { config } = require('./config/env');
const ExpressError = require('./utilities/ExpressError');
const { createToken } = require('./utilities/csrf');
const User = require('./models/user');
const campgroundsRoutes = require('./routes/CampgroundRoutes');
const reviewsRoutes = require('./routes/ReviewsRoutes');
const userRoutes = require('./routes/UserRoutes');

function createApp(options = {}) {
    const app = express();
    const sessionStore = options.sessionStore || MongoStore.create({
        mongoUrl: config.dbUrl,
        touchAfter: 24 * 60 * 60,
        crypto: { secret: config.secret },
    });

    if (config.isProduction) app.set('trust proxy', 1);

    app.engine('ejs', ejsMate);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    app.use(express.urlencoded({ extended: true, limit: '100kb' }));
    app.use(methodOverride('_method'));
    app.use(mongoSanitize());
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: [
                "'self'",
                'https://api.mapbox.com/',
                'https://a.tiles.mapbox.com/',
                'https://b.tiles.mapbox.com/',
                'https://events.mapbox.com/',
            ],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://api.mapbox.com/', 'https://cdn.jsdelivr.net/'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://api.mapbox.com/', 'https://cdn.jsdelivr.net/'],
            workerSrc: ["'self'", 'blob:'],
            objectSrc: ["'none'"],
            imgSrc: ["'self'", 'blob:', 'data:', 'https://res.cloudinary.com/', 'https://images.unsplash.com/'],
            fontSrc: ["'self'", 'data:'],
        },
    }));
    app.use(express.static(path.join(__dirname, 'public'), { maxAge: config.isProduction ? '7d' : 0 }));

    app.use(session({
        store: sessionStore,
        name: 'yelpcamp.sid',
        secret: config.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: config.isProduction,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    }));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use(createToken);
    app.use((req, res, next) => {
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        res.locals.currentUser = req.user;
        res.locals.mapboxToken = config.mapboxToken;
        res.locals.usesMap = false;
        next();
    });

    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 500,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
    }));

    app.get('/', (req, res) => res.render('home'));
    app.use('/campgrounds', campgroundsRoutes);
    app.use('/campgrounds/:id/reviews', reviewsRoutes);
    app.use('/users', userRoutes);

    app.all('*', (req, res, next) => next(new ExpressError('Page not found.', 404)));

    app.use((error, req, res, next) => {
        if (res.headersSent) return next(error);

        if (error instanceof multer.MulterError) {
            const message = error.code === 'LIMIT_FILE_SIZE'
                ? 'Each image must be 5 MB or smaller.'
                : error.code === 'LIMIT_FILE_COUNT'
                    ? 'You can upload at most 6 images.'
                    : error.message;
            error = new ExpressError(message, 400);
        }

        const statusCode = error.statusCode || 500;
        if (statusCode >= 500) console.error(error);
        res.status(statusCode).render('error', {
            err: {
                message: statusCode >= 500 && config.isProduction ? 'Something went wrong.' : error.message,
                stack: config.isProduction ? '' : error.stack,
            },
        });
    });

    return app;
}

module.exports = { createApp };

// Render may still be configured with `node app.js` as its start command.
if (require.main === module) {
    require('./server');
}
