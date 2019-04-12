# Restaurant Reservation

# Configurations
This README assumes that your postgres db user is `postgres` and the password is blank. If different, modify it in config.js, just remember *NOT* to commit it to the branch.  

# Setup
Clone the repo  
Run npm install  
Run `psql -U postgres -f node_modules/connect-pg-simple/table.sql` to initialize the session table  
Run `npm run initschema` to create the DB schemas 
Run npm start to boot up the server.

# Dummy data
Two dummy data files are provided.
dummy.sql - Small set of values to ensure constraints are functional
dummy_big.sql - Large set of values for testing