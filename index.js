const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");
const Contact = require('./models/Contact');
const nodemailer = require('nodemailer');
require('dotenv').config();
const DB_URL = process.env.atlas_URL;

mongoose.connect(DB_URL);
const connect = mongoose.connection;
connect.once('open', () =>{
    console.log("Successfully connected to databse");
})

const path  = require('path');

app.set('view engine','ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/',(req,res) =>{
    res.render('index');
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.post('/contact', async (req, res) => {
    try{
        const { first_name, last_name, phone, email,  rental_date, reference, message } = req.body;
        if(!first_name || !last_name || !phone || !email || !rental_date){
            return res.status(400).send('All fields are required');
        }

        const newContact = new Contact({ first_name, last_name, phone, email, rental_date, reference, message });
        await newContact.save();
        console.log('New Message Saved: ', newContact);
        res.status(201).send('Message received!');

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS 
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New Contact Form Message',
            text:  `                    First name: ${first_name}\n 
                    Last name: ${last_name}\n
                    Phone Number: ${phone}\n
                    Email: ${email}\n
                    Rental Date: ${rental_date}\n
                    Referral: ${reference}\n
                    Additional Information: ${message}`
        });

    } catch(error){
        console.error('Error saving message: ', error);
        res.status(500).send('Server Error');
    }
});

app.listen(5000,() => {
    console.log("App is listening on port 5000");
})

