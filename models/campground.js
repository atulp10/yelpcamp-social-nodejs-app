const mongoose = require('mongoose')
const { campSchema } = require('../schemas')
const Schema = mongoose.Schema
const Review = require('./review');
const { func } = require('joi');

const imageSchema = new mongoose.Schema({
    url:String,
    filename:String,
})

// This imageSchema is defined for only one purpose.
// When we render edit form for a campground, we need to see
// thumbnails of the images, not the full sized images.
// Hence, we define here a virtual property for imageSchema
// which replaces the image url according to the pattern for 
// thumbnail images as specified on 'cloudinary'.
// w_200 means width 200 pixels.
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})
// added in edit.ejs: <%=img.thumbnail%> in forEach loop to render thumbnails.


// Mongoose Virtuals in JSON
// By default, Mongoose does not include virtuals when you convert a document
// to JSON. For example, if you pass a document to Express' res.json()
// function, virtuals will not be included by default. To include 
// virtuals in res.json(), you need to set the toJSON schema option
// to { virtuals: true }.
const opts = { toJSON: { virtuals: true } };
// This is required to show camp's data in pop-up on the cluster map 
// when a point is clicked.

const campgroundSchema=new Schema({
    title:String,
    price:Number,
    images:[imageSchema],
    description:String,
    location:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type : mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
},opts);

// This is a nested virtual property defined here where 'properties'
// property has 'popupMarkup' property nested in it. It is done this 
// way because mapbox looks for 'properties' to access data of the 
// campground which is clicked on map.  
campgroundSchema.virtual('properties.popupMarkup').get(function(){
    return `<strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>
    <p>${this.description.substring(0,25)}...</p>`;
})



//This is a mongoose middleware. It is created here so that 
// whenever a campground is deleted, all its associated reviews
//get deleted too.
campgroundSchema.post('findOneAndDelete',async function(camp){
    await Review.deleteMany({_id:{$in:camp.reviews}});
})

module.exports=mongoose.model('Campground',campgroundSchema)