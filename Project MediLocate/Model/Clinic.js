const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
    name: String,
    address: String,
    image: String,
});

module.exports = mongoose.model('Clinic', clinicSchema);
