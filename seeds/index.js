// This file is for seeding (adding) data randomly to database,
// outside of web application.

const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log("Database connected.")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

async function seedDB() {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '649c3ed3ca1460deb5072761',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price, // This is shorthand for price : price
            geometry:
            {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dqlnftw5r/image/upload/v1688283857/YelpCamp/v7xstdhevxnsvtvkufws.jpg',
                    filename: 'YelpCamp/s5nojlunjb8mwsuxobng',

                },
                {
                    url: 'https://res.cloudinary.com/dqlnftw5r/image/upload/v1688202970/YelpCamp/g3ckyfxam77hchpzwbh3.jpg',
                    filename: 'YelpCamp/yazyvse7ca19cafomrsr',

                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, quod possimus beatae tempore vero quibusdam natus fugiat facilis maiores vel sequi voluptatibus iste molestias, placeat ullam rem. Cumque, illum in.'
        });
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})