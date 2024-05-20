// Import required modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const user = require('./routes/user');
const seller = require('./routes/seller');
const buyer = require('./routes/buyer');

require('dotenv').config();
const app = express();

const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
    app.use(cors()); // Enable CORS for development only
} else {
    app.use(cors({
        origin: 'https://rentify-frontend.netlify.app/'
    }));
}
// Create an Express application
app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.use('/user', user);
app.use('/seller', seller);
app.use('/buyer', buyer);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
