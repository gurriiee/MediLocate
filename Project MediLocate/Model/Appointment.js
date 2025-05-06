const mongoose = require('mongoose');

// Define the Appointment schema
const AppointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
    clinicName: { type: String, required: true }, // Clinic name
    date: { type: Date, required: true }, // Appointment date
    time: { type: String, required: true }, // Appointment time
    appointmentId: { type: Number, unique: true, default: () => Math.floor(Math.random() * 1000000000) } // Unique appointment ID
});

module.exports = mongoose.model('Appointment', AppointmentSchema);