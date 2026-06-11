// This file is for seeding (adding) data randomly to database,
// outside of web application.

require('dotenv').config();
const Campground = require('../models/campground');
const User = require('../models/user');

const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

mongoose.connect(dbUrl); //'mongodb://127.0.0.1:27017/yelp-camp'
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log("Database connected.")
});

const campgrounds = [
    {
        title: 'Yosemite Valley Pines',
        location: 'Yosemite National Park, California',
        price: 42,
        geometry: {
            type: 'Point',
            coordinates: [-119.5383, 37.8651]
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/yosemite-valley-pines-1'
            },
            {
                url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/yosemite-valley-pines-2'
            }
        ],
        description: 'Camp beneath towering granite walls and old-growth pines with quick access to valley trails, waterfalls, and evening views of Half Dome. This site is best for campers who want classic national park scenery with a peaceful forest basecamp.'
    },
    {
        title: 'Glacier Creek Basecamp',
        location: 'West Glacier, Montana',
        price: 38,
        geometry: {
            type: 'Point',
            coordinates: [-113.9853, 48.4958]
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/glacier-creek-basecamp-1'
            },
            {
                url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/glacier-creek-basecamp-2'
            }
        ],
        description: 'A crisp mountain retreat near glacier-fed streams, alpine meadows, and scenic drives. Spend the day hiking ridge trails, then return to a quiet campsite surrounded by spruce, cedar, and big Montana sky.'
    },
    {
        title: 'Acadia Harbor Woods',
        location: 'Bar Harbor, Maine',
        price: 34,
        geometry: {
            type: 'Point',
            coordinates: [-68.2039, 44.3876]
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/acadia-harbor-woods-1'
            },
            {
                url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/acadia-harbor-woods-2'
            }
        ],
        description: 'A coastal woodland campground close to rocky beaches, carriage roads, and sunrise viewpoints. It offers a comfortable mix of ocean air, shaded tent pads, and easy access to Acadia adventures.'
    },
    {
        title: 'Zion Canyon Watch',
        location: 'Springdale, Utah',
        price: 46,
        geometry: {
            type: 'Point',
            coordinates: [-112.9986, 37.1889]
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/zion-canyon-watch-1'
            },
            {
                url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/zion-canyon-watch-2'
            }
        ],
        description: 'Set near dramatic sandstone cliffs, this campground is made for early starts on canyon hikes and relaxed evenings under desert stars. Expect warm colors, open skies, and unforgettable red-rock views.'
    },
    {
        title: 'Smoky Mountain Hollow',
        location: 'Gatlinburg, Tennessee',
        price: 29,
        geometry: {
            type: 'Point',
            coordinates: [-83.5082, 35.7143]
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/smoky-mountain-hollow-1'
            },
            {
                url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/smoky-mountain-hollow-2'
            }
        ],
        description: 'A quiet wooded hollow tucked near misty ridgelines, wildflower trails, and scenic overlooks. This is a welcoming place for family camping, campfire cooking, and slow mornings in the mountains.'
    },
    {
        title: 'Lake Tahoe Timber Camp',
        location: 'South Lake Tahoe, California',
        price: 44,
        geometry: {
            type: 'Point',
            coordinates: [-119.9772, 38.9399]
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/lake-tahoe-timber-camp-1'
            },
            {
                url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/lake-tahoe-timber-camp-2'
            }
        ],
        description: 'A pine-covered campground close to clear blue water, mountain bike routes, and lakefront picnic spots. It balances easy access to town with the fresh, outdoorsy feel of a Sierra Nevada escape.'
    },
    {
        title: 'Olympic Rainforest Retreat',
        location: 'Forks, Washington',
        price: 31,
        geometry: {
            type: 'Point',
            coordinates: [-124.3855, 47.9504]
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/olympic-rainforest-retreat-1'
            },
            {
                url: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/olympic-rainforest-retreat-2'
            }
        ],
        description: 'Pitch your tent among mossy trees, fern-lined paths, and the sound of steady forest rainfall. This campground is perfect for hikers, photographers, and anyone who loves deep green rainforest landscapes.'
    },
    {
        title: 'Grand Teton Meadow Camp',
        location: 'Jackson, Wyoming',
        price: 40,
        geometry: {
            type: 'Point',
            coordinates: [-110.7624, 43.4799]
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/grand-teton-meadow-camp-1'
            },
            {
                url: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/grand-teton-meadow-camp-2'
            }
        ],
        description: 'Open meadows, crisp mornings, and sweeping views of the Tetons make this a memorable mountain basecamp. It is a strong choice for wildlife watching, lake paddling, and full-day hikes.'
    },
    {
        title: 'Sedona Red Rock Camp',
        location: 'Sedona, Arizona',
        price: 36,
        geometry: {
            type: 'Point',
            coordinates: [-111.7610, 34.8697]
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/sedona-red-rock-camp-1'
            },
            {
                url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/sedona-red-rock-camp-2'
            }
        ],
        description: 'A bright desert campground surrounded by sculpted red rock formations and wide-open trail networks. Evenings are especially beautiful here, with sunset colors stretching across the cliffs.'
    },
    {
        title: 'Blue Ridge River Camp',
        location: 'Asheville, North Carolina',
        price: 27,
        geometry: {
            type: 'Point',
            coordinates: [-82.5515, 35.5951]
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/blue-ridge-river-camp-1'
            },
            {
                url: 'https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=1200&h=800&q=80',
                filename: 'YelpCamp/blue-ridge-river-camp-2'
            }
        ],
        description: 'A relaxed riverside campground near Blue Ridge Parkway overlooks, waterfall hikes, and Asheville day trips. It is ideal for campers who want mountain scenery, cool water, and an easygoing pace.'
    }
];

async function seedDB() {
    const seedUsername = process.env.SEED_USERNAME || 'yelpcamp-seeder';
    let author = process.env.SEED_AUTHOR_ID ? await User.findById(process.env.SEED_AUTHOR_ID) : null;

    author = author || await User.findOne({ username: seedUsername }) || await User.findOne({});

    if (!author) {
        author = await User.register(
            new User({ username: seedUsername, email: process.env.SEED_EMAIL || 'seed@yelp-camp.demo' }),
            process.env.SEED_PASSWORD || 'seedpassword'
        );
    }

    await Campground.deleteMany({});
    for (let campground of campgrounds) {
        const camp = new Campground({
            author: author._id,
            ...campground
        });
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})
