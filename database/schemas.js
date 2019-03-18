const { Pool } = require("pg");
const config = require("../config.js");

const pool = new Pool(config.pgConfig);

const buildSchemas = async () => {
  // Delete User
  await new Promise((resolve, reject) => {
    pool.query("drop table Users CASCADE", (err, data) => {
      if (err) return resolve(console.log("Users table does not exist."));
      return resolve(console.log("Deleted Users table"));
    });
  });

  // Create User
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Users(username VARCHAR(40) primary key, password VARCHAR(40) not null)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Users table"));
        return resolve(console.log("Created Users table"));
      },
    );
  });

  // Delete Diner
  await new Promise((resolve, reject) => {
    pool.query("drop table Diners", (err, data) => {
      if (err) return resolve(console.log("Diners table does not exist."));
      return resolve(console.log("Deleted Diners table"));
    });
  });

  // Create Diner
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Diners(username VARCHAR(40) primary key references Users(username) on delete CASCADE)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Diners table"));
        return resolve(console.log("Created Diners table"));
      },
    );
  });

  // Delete Admin
  await new Promise((resolve, reject) => {
    pool.query("drop table Admins", (err, data) => {
      if (err) return resolve(console.log("Admins table does not exist."));
      return resolve(console.log("Deleted Admins table"));
    });
  });

  // Create Admin
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Admins(username VARCHAR(40) primary key references Users(username) on delete CASCADE)",
      (err, data) => {
        if (err) return resolve(console.log(err)); //"Error creating Admins table"));
        return resolve(console.log("Created Admins table"));
      },
    );
  });

  // Delete Owner
  await new Promise((resolve, reject) => {
    pool.query("drop table Owners", (err, data) => {
      if (err) return resolve(console.log("Owners table does not exist."));
      return resolve(console.log("Deleted Owners table"));
    });
  });

  // Create Owner
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Owners(username VARCHAR(40) primary key references Users(username) on delete CASCADE)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Owners table"));
        return resolve(console.log("Created Owners table"));
      },
    );
  });

  // Delete Restaurant
  await new Promise((resolve, reject) => {
    pool.query("drop table Restaurants", (err, data) => {
      if (err) return resolve(console.log("Restaurants table does not exist."));
      return resolve(console.log("Deleted Restaurants table"));
    });
  });

  // Create Restaurant
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Restaurants(rname VARCHAR(40) primary key)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Restaurants table"));
        return resolve(console.log("Created Restaurants table"));
      },
    );
  });  

  // Delete Area
  await new Promise((resolve, reject) => {
    pool.query("drop table Areas", (err, data) => {
      if (err) return resolve(console.log("Areas table does not exist."));
      return resolve(console.log("Deleted Areas table"));
    });
  });

  // Create Area
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Areas(aname VARCHAR(40) primary key)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Areas table"));
        return resolve(console.log("Created Areas table"));
      },
    );
  });  

  // Delete Located
  await new Promise((resolve, reject) => {
    pool.query("drop table Located", (err, data) => {
      if (err) return resolve(console.log("Located table does not exist."));
      return resolve(console.log("Deleted Located table"));
    });
  });

  // Create Located
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Located(rname VARCHAR(40) references Restaurants(rname) on delete CASCADE"
      + ",aname VARCHAR(40) references Areas(aname) on delete CASCADE"
      + ",address VARCHAR(40)"
      + ",primary key (rname, aname))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Located table"));
        return resolve(console.log("Created Located table"));
      },
    );
  });  
};

buildSchemas();
