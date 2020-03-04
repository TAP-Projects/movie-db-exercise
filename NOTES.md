# Learning Table Associations with Sequelize

## What will happen when we run this app with `npm start`?

- The Sequelize instance is instantiated and configured.
- The Movie and Person Sequelize models are imported into the Sequelize instance.
- The model relationships or associations (if defined) are configured.
- The database connection is tested.
- The models are synchronized with the database.
- The People and Movie database tables are populated with seed data.
- The data from the Movie and People database tables are queried and written to the console

## What files do need to make this work?

For this example, we only need 4 files!

- app.js
- db/index.js - to export all of our models
- db/models/person.js and db/models/movie.js - our models

## What's the file structure?

- app.js
- db
    - index.js
    - models
        - person.js
        - movies.js


## What do we need to do in app.js?

Our app.js file has to do several things.
- Import a Sequelize instance and a models object containing our models. Both of these are imported from db/index.js. 
- Get references to the individual models we'll use. In this case that's Movie and Person. We get these from `models`.
- In this example, we declare several movie and person variables that we'll use later to demonstrate how to associate records. I'm not sure how this works in a real database with thousands of records.
- Define and call an async function. An IIFE is used here.
    - This function will contain a try catch block
    - Within the try block we need to:
        - Test the connection to the database
        - Sync the models to the database
        - Add people to the database
        - Update the global variables for the people instances
        - Add movies to the database
        - Do we need to update the global variables for the movies?
        - Retrieve movies
        - Retrieve people
    - In the catch statement, if we see a SequelizeValidationError, log any of those, else just throw the error

## What about the models?

The `index.js` file in db/index.js is a bit out of scope of this example, but its purpose is to export any and all models defined in db/models. 

Each model exports a function that takes our Sequelize instance as its only parameter. 

The function defines a class that extends Sequelize.Model. This is where we can pass in any methods for this model.

After the class is created, we need to initialize it with, e.g. `Person.init(options,sequelizeInstance)`, passing in both a configuration object and also the instance that was passed into the function. 

Next, we define a new method called `associate` with `Person.associate = aFunction`. The function that we're binding takes the `models` object as its only parameter. In the function's body we call a method on our model and pass in a target model. The target model is the only required parameter, but we can also pass in a foreign key object. This example uses two such methods - the `hasMany()` method is used in `person.js` and the `belongsTo()` method is used in `movies.js`.

```js
// In person.js
Person.hasMany(models.Movie, foreignKeyObj)
// In movies.js
Movie.belongsTo(models.Person, foreignKeyObj)
```

The target model is accessed via the models object that we passed into the function, e.g. `models.Movie`.

The foreign key object allows us to customize the foreign key. It contains the `foreignKey` property. Its value can be either a string or an object. The object version allows us to define some additional options. The `fieldName` property gives the string name of the key, then we can also do things like `allowNull: false`.

When we're defining this foreign key object, we have to use the same properties and values on both sides of the relationship. The foreign key configuration must be kept in sync across the Movie and Person models or Sequelize will not be able to understand that the associations are describing the same data relationship! Not keeping the options in sync will (typically) result in a duplicate foreign key column being added

When we're setting up these relationships we need to set them up from within each model that's involved in the relationship. In this case the Person model has a one-to-many relationship with the Movies model, because a director can direct many movies, and the Movies model has a one-to-one relationship with the Person model, because in our example, each movie can have only one director.

The associate() method that we just defined is called in the db/index.js file after each model is imported into the Sequelize instance. This allows code within the associate() method to access any of the available models.

The last thing that any model function needs to do is return the model, e.g. Person, or Movie.
