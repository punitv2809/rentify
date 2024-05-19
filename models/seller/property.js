const mongoose = require('mongoose');
const mongoosePaginateV2 = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    place: {
        type: String,
        required: true,
    },
    area: {
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    bathrooms: {
        type: Number,
        required: true,
    },
    hospitalsNearby: {
        type: [String], // Array of hospital names
    },
    collegesNearby: {
        type: [String], // Array of college names
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
});
PropertySchema.plugin(mongoosePaginateV2);

module.exports = mongoose.model('Property', PropertySchema);
