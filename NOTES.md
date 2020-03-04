# Table Associations with Sequelize

Our app.js file has to do several things.
- Import a Sequelize instance and our models from db/index.js. 
- Get references to the individual models we'll use. In this case that's Movie and Person.
- In this example, we declare several movie and person variables that we'll use later to demonstrate how to associate records. I'm not sure how this works in a real database with thousands of records.
- Define and call an async function. An IIFE is used here.
    - This function will contain a try catch block
    - Within the try block we need to:
        - Test the connection to the database
        - Sync the models to the database
        - Add people to the database
        - Update the global variables for the people instances
        - Add movies to the database
        - Retrieve movies
        - Retrieve people