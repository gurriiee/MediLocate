require('dotenv').config(); // Load .env variables
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const app = express();
const userRoutes = require("./Controller/userController"); // Import the routes
const Appointment = require("./Model/Appointment"); // Import Appointment model
const User = require("./Model/userModel"); // Import the User model (adjust the path as needed)
const Clinic = require('./Model/Clinic'); // Import the Clinic model
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());

const mongoose = require( "mongoose" );
// connect to mongoose on port 27017
mongoose.connect( "mongodb://localhost:27017/medilocate", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const PORT = 3000;

// Passport Local Strategy setup
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ username: email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialize and deserialize users
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = User;


// Route for the root path
app.get("/", (req, res) => {
    res.render("Login", { email: '' });
});
 // Route for login page
app.get("/Login", (req, res) => {
    res.render("Login", { email: '' }); // Serve Login page
    console.log("A user requested the Login page");
});

// Route for signup page
app.get("/Signup", (req, res) => {
    res.render("Signup", { name: '', email: '' }); // Serve Signup page
    console.log("A user requested the Signup page");
});

// Route for home page
app.get("/Home", (req, res) => {
    res.render("home"); // Serve home.ejs
    console.log("User authenticated, serving the Home page");
});
app.get("/SignupMedical", (req, res) => {
    res.render("SignupMedical", { name: '', email: '' , medicalId:''}); // Serve Signup Medical page
    console.log("User authenticated, serving the Signup page");
});

app.get("/About", (req, res) => {
    res.render("About"); // Serve About page
    console.log("User authenticated, serving the About page");
});
app.get('/Regina', async (req, res) => {
    try {
        const clinics = await Clinic.find({ address: /Regina/i }); // Fetch Regina clinics
        res.render('Regina', { clinics });
    } catch (error) {
        console.error("Error fetching Regina clinics:", error);
        res.status(500).send("Server error");
    }
});

app.get('/moose-jaw', async (req, res) => {
    try {
        const clinics = await Clinic.find({ address: /Moose Jaw/i }); // Fetch Moose Jaw clinics
        res.render('MJ', { clinics });
    } catch (error) {
        console.error("Error fetching Moose Jaw clinics:", error);
        res.status(500).send("Server error");
    }
});

app.get('/saskatoon', async (req, res) => {
    try {
        const clinics = await Clinic.find({ address: /Saskatoon/i }); // Fetch Saskatoon clinics
        res.render('Saskatoon', { clinics });
    } catch (error) {
        console.error("Error fetching Saskatoon clinics:", error);
        res.status(500).send("Server error");
    }
});

// Regina.ejs clinics
app.get('/Regina', (req, res) => {
    const clinics = [
      {
        name: 'Meadow Primary Health Care Center',
        address: '4006 Dewdney Avenue, Regina, SK',
        image: '/images/Image-OSCS-ReginaMeadowPrimaryHealthCareCentre.jpeg'
      },
      {
        name: 'Victoria East Medical Clinic',
        address: '2068 Prince of Wales Dr, Regina, SK',
        image: '/images/2018-06-17.jpg'
      },
      {
        name: 'Apex-Medical Clinic',
        address: '1511 11th Ave, Regina, SK',
        image: '/images/IMG_1266-preview.jpg'
      },
      {
        name: "Dr Patel's Medical Clinic",
        address: '2625 Dewdney Ave, Regina, SK',
        image: '/images/2018-04-14.jpg'
      }
    ];
    res.render('Regina', { clinics });
  });
// MJ.ejs clinics
app.get('/moose-jaw', (req, res) => {
    const clinics = [
      {
        name: 'Alliance Health Medical Center',
        address: '890-A Lillooet St W, Moose Jaw, SK',
        image: '/images/Alliance.jpg'
      },
      {
        name: 'Medella Medical Clinic',
        address: '58 Highland Rd Unit 5, Moose Jaw, SK',
        image: '/images/medella.webp'
      },
      {
        name: 'Circle Medical Centre',
        address: '1251 Main St N Unit 2B, Moose Jaw, SK',
        image: '/images/Circle med.jpg'
      },
      {
        name: "Prairie Skies Medical Clinic",
        address: '36 Athabasca St W, Moose Jaw, SK',
        image: '/images/P skies.jpg'
      }
    ];
    console.log('Clinics passed to MJ.ejs:', clinics); // Debugging log
    res.render('MJ', { clinics });
  });
// Saskatoon.ejs clinics
app.get('/saskatoon', (req, res) => {
    const clinics = [
      {
        name: 'Lakeside Medical Clinic',
        address: '215 Joseph Okemasis Dr, Saskatoon, SK',
        image: '/images/Lakeside.jpg'
      },
      {
        name: 'Idylwyld Medical Centre',
        address: '502 Idylwyld Dr N #10B, Saskatoon, SK',
        image: '/images/idylwyld.jpg'
      },
      {
        name: 'Kenderline Medical Clinic',
        address: '1804 McOrmond Dr #110, Saskatoon, SK',
        image: '/images/kenderline.jpeg'
      },
      {
        name: ">Cornerstone Medical Clinic",
        address: '415 Wellman Crescent #100, Saskatoon, SK',
        image: '/images/Cornerstone.jpg'
      }
    ];
    res.render('Saskatoon', { clinics });
  });

  app.get('/addAvailability', async (req, res) => {
    try {
        // Fetch the list of clinics to display in the form
        const clinics = await Clinic.find();

        // Render the form for adding availability
        res.render('addAvailability', { clinics });
    } catch (error) {
        console.error("Error rendering addAvailability page:", error);
        res.status(500).send("Server error");
    }
});
  
// Use routes from userController
app.use("/", userRoutes)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
