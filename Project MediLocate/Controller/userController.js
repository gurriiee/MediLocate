const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const passport = require("passport");
const mongoose = require ("mongoose");
const Appointment = require("../Model/Appointment"); // Import Appointment model
const User = require("../Model/userModel"); // Import the User model (adjust the path accordingly)
const Availability = require('../Model/Availability');
const Clinic = require('../Model/Clinic'); // Import the Clinic model

// POST route to handle login
router.post("/Login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: false // Add flash messages if you want to show error messages
    }));


router.post("/Signup", async(req, res) => {
    try {
    console.log(req.body); // Debugging: Log request body

    const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ username: email });
        if (userExists) {
            return res.status(400).send("User already exists. Please log in.");
        }

        // Create new user
        const newUser = new User({
            name: name,
            username: email,
            password: password
        });

        await newUser.save();

        // Log the user in automatically
        req.login(newUser, (err) => {
            if (err) return res.status(500).send("Server error");
            return res.redirect("/home");
        });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).send("Server error");
    }
    });


router.post("/SignupMedical", async (req, res) => {
    try {
    console.log(req.body); // Debugging: Log request body
    const newMedicalUser = new User({
        name: req.body["name"],
        username: req.body["email"],
        password: req.body["password"],
        medicalid: req.body["medicalId"]
    });
            const userExists =await User.findOne({ username: newMedicalUser.username });

            if (userExists) {
                console.log("Medical user already exists:", newMedicalUser.username);
                return res.redirect("/Login");
            }
        // Save the new medical user to MongoDB
        await newMedicalUser.save();         
                console.log("New medical user added successfully:", newMedicalUser);
                    res.redirect("/Home"); // Redirect to the home page

        } catch (error) {
            console.error("Error parsing users.json:", error);
            res.status(500).send("Server error");
        }
    });
    // Protect /home route
router.get("/home", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("home"); // Render home.ejs if user is authenticated
    } else {
        res.redirect("/login");
    }
});

// Route for /getAvailability
router.get('/getAvailability', async (req, res) => {
    try {
        const clinicName = req.query.clinicName;

        console.log('Clinic name received for availability:', clinicName);

        const clinic = await Clinic.findOne({ name: clinicName.trim() }); // Trim any extra spaces
        if (!clinic) {
            console.error('Clinic not found:', clinicName);
            return res.status(404).send({ success: false, message: 'Clinic not found' });
        }

        const availability = await Availability.find({ clinicId: clinic._id });
        if (!availability || availability.length === 0) {
            console.log('No availability found for clinic:', clinicName);
            return res.status(200).send({ success: true, dates: [], timeSlots: [] });
        }

        const dates = availability.map(avail => avail.date.toISOString().split('T')[0]); // Ensure date is formatted correctly
        const timeSlots = availability.flatMap(avail =>
            avail.timeSlots.map(slot => ({
                date: avail.date.toISOString().split('T')[0], // Match frontend format
                time: slot.time,
                isBooked: slot.isBooked
            }))
        );

        res.status(200).send({ success: true, dates, timeSlots });
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).send({ success: false, message: 'Error fetching availability' });
    }
});

  
  

//Route for book appointment 
router.post('/bookAppointment', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send({ success: false, message: 'You must be logged in to book an appointment.' });
    }

    try {
        const { clinicName, date, time } = req.body;
        const userId = req.user._id;

        // Check if the appointment already exists
        const existingAppointment = await Appointment.findOne({ clinicName, date, time });
        if (existingAppointment) {
            console.log('Time slot already booked by someone else:', existingAppointment);
            return res.status(400).send({ 
                success: false, 
                message: 'This time slot is already booked. Please choose a different time.' 
            });
        }

        // Find the clinic
        const clinic = await Clinic.findOne({ name: clinicName });
        if (!clinic) {
            return res.status(404).send({ success: false, message: 'Clinic not found' });
        }

        // Update the availability and mark the time slot as booked
        await Availability.updateOne(
            { clinicId: clinic._id, date, 'timeSlots.time': time },
            { $set: { 'timeSlots.$.isBooked': true } }
        );

        // Create new appointment
        const newAppointment = new Appointment({
            userId,
            clinicName,
            date,
            time,
        });

        await newAppointment.save();

        console.log('Appointment booked successfully:', newAppointment);

        // Redirect to the MyAppointments page after booking
        res.redirect('/MyAppointments');
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).send({ success: false, message: 'Error booking appointment' });
    }
});


  

// Protect /myAppointments route

router.get('/MyAppointments', async (req, res) => {
    console.log('MyAppointments route was called');
    if (!req.isAuthenticated()) {
        console.log('User is not authenticated. Redirecting to /Login');
        return res.redirect('/Login');
    }

    try {
        const userId = req.user._id; // Ensure req.user exists
        console.log('Logged-in user ID:', userId);
        const appointments = await Appointment.find({ userId }) || []; // Default to empty array if no results

        console.log('Appointments sent to EJS:', appointments);
        res.render('MyAppointments', { appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('An error occurred while fetching appointments.');
    }
});

router.post('/addAvailability', async (req, res) => {
    try {
      const { clinicName, date, timeSlots } = req.body;
  
      // Validate input
      if (!clinicName || !date || !timeSlots || !Array.isArray(timeSlots)) {
        return res.status(400).send({ success: false, message: 'Invalid input data.' });
      }
  
      // Find the clinic by name
      const clinic = await Clinic.findOne({ name: clinicName });
      if (!clinic) {
        return res.status(404).send({ success: false, message: 'Clinic not found.' });
      }
  
      // Check if availability already exists for the date
      let availability = await Availability.findOne({ clinicId: clinic._id, date: new Date(date) });
  
      if (availability) {
        // Add new time slots to the existing availability
        timeSlots.forEach(slot => {
          if (!availability.timeSlots.some(existingSlot => existingSlot.time === slot)) {
            availability.timeSlots.push({ time: slot, isBooked: false });
          }
        });
      } else {
        // Create new availability entry
        availability = new Availability({
          clinicId: clinic._id, // Use the unique clinic ID
          date: new Date(date),
          timeSlots: timeSlots.map(slot => ({ time: slot, isBooked: false })),
        });
      }
  
      // Save the availability
      await availability.save();
      res.status(200).send({ success: true, message: 'Availability added successfully.' });
    } catch (error) {
      console.error('Error adding availability:', error);
      res.status(500).send({ success: false, message: 'Server error while adding availability.' });
    }
  });
  

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send("Server error");
        }
        res.redirect("/login");
    });
});


module.exports = router;