// Models/Availability.js
const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
    date: { type: Date, required: true },
    timeSlots: [
        {
            time: String,
            isBooked: { type: Boolean, default: false }
        }
    ]
});

module.exports = mongoose.model('Availability', availabilitySchema);