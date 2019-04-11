# Restaurant Reservation

# Configurations
This README assumes that your postgres db user is `postgres` and the password is blank. If different, modify it in config.js, just remember *NOT* to commit it to the branch.  

# Setup
Clone the repo  
Run npm install  
Run `psql -U postgres -f node_modules/connect-pg-simple/table.sql` to initialize the session table  
Run `npm run initschema` to create the DB schemas 
Run npm start to boot up the server.

# Development
All database initialization goes into the `database` directory. At present, there is only the `schemas.js`, which has the code to create the tables. A separate file will be created shortly to allow for initialization of rows in the tables.

In database initialization code, it is important that we run them in a strict sequential manner. This means we need to use promises, or async/await. If you are lost, just copy what's currently in the `schemas.js` and paste within the same function.  