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

        // Seed the database with some people
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

        // Seed the database with some movies
        console.log('Adding movies to the database...');
        // The process is similar to the one used for peopleInstances above, but when creating a movie, we're also setting our foreign key value - directorPersonId. (We are able to access bradBird.id b/c it's in the global scope.) This foreign key was not one of the properties we defined when we were creating the Movie model. Sequelize adds this property b/c of the relationship we defined.
        const movieInstances = await Promise.all([
            Movie.create({
                title: 'The Iron Giant',
                releaseYear: 1999,
                directorPersonId: bradBird.id
            }),
            Movie.create({
                title: 'The Incredibles',
                releaseYear: 2004,
                directorPersonId: bradBird.id
            }),
        ]);
        // Log the resolved movieInstances array
        console.log(JSON.stringify(movieInstances, null, 2));

        // Retrieve all of our movies with the findAll method
        const movies = await Movie.findAll({
            include: [
                {
                    model: Person,
                    as: 'director',
                }
            ]
        });
        console.log(movies.map(movie => movie.get({plain: true})));

        // Retrieve all of our people with the findAll method
        const people = await Person.findAll({
            include: [
                {
                    model: Movie,
                    as: 'director',
                }
            ]
        });
        console.log(people.map(person => person.get({plain: true})));

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

// running npm start should produce an array of objects like this one:

// {
//     id: 2,
//     title: 'The Incredibles',
//     releaseYear: 2004,
//     createdAt: 2020-03-04T19:43:21.040Z,
//     updatedAt: 2020-03-04T19:43:21.040Z,
//     directorPersonId: 1,
//     director: {
//       id: 1,
//       firstName: 'Brad',
//       lastName: 'Bird',
//       createdAt: 2020-03-04T19:43:20.960Z,
//       updatedAt: 2020-03-04T19:43:20.960Z
//     }
//   }
