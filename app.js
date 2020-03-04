'use strict';

const {sequelize, models} = require('./db');

// Get references to our models.
const {Person, Movie} = models;

// Define variables for the people and movies. NOTE: We'll use these variables to assist with the creation of our related data after we've defined the relationships (or associations) between our models.
let bradBird;
let vinDiesel;
let eliMarienthal;
let craigTNelson;
let hollyHunter;
let theIronGiant;
let theIncredibles;

console.log('Testing the connection to the database...');

(async () => {
    try {
        // Test the connection to the database
        console.log('Connection to the database successful!');
        await sequelize.authenticate();

        // Sync the models
        console.log('Synchronizing the models with the database...');
        await sequelize.sync({force: true});

        // Add People to the Database
        console.log('Adding people to the database...');
        // Store the people array in a variable. We await the resolution of all of the calls to Person.create().
        const peopleInstances = await Promise.all([
            // The create method will create a single record
            Person.create({
                firstName: 'Brad',
                lastName: 'Bird',
            }),
            Person.create({
                firstName: 'Vin',
                lastName: 'Diesel',
            }),
            Person.create({
                firstName: 'Eli',
                lastName: 'Marienthal',
            }),
            Person.create({
                firstName: 'Craig T.',
                lastName: 'Nelson',
            }),
            Person.create({
                firstName: 'Holly',
                lastName: 'Hunter',
            }),
        ]);
        // Log the resolved peopleInstances array
        console.log(JSON.stringify(peopleInstances, null, 2));

        // Update the global variables for the people instances.
        [bradBird, vinDiesel, eliMarienthal, craigTNelson, hollyHunter] = peopleInstances;

        // Add Movies to the Database
        console.log('Adding movies to the database...');
        // The process is similar to the one used for peopleInstances above.
        const movieInstances = await Promise.all([
            Movie.create({
                title: 'The Iron Giant',
                releaseYear: 1999,
            }),
            Movie.create({
                title: 'The Incredibles',
                releaseYear: 2004,
            }),
        ]);

        // Retrieve movies

        // Retrieve people

        // Tell Node to immediately terminate the process.
        process.exit();
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            console.error('Validation errors: ', errors);
        } else {
            throw error;
        }
    }
})();
