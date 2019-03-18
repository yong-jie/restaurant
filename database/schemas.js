const { Pool } = require("pg");
const config = require("../config.js");

const pool = new Pool(config.pgConfig);

const buildSchemas = async () => {
  // Delete Users
  await new Promise((resolve, reject) => {
    pool.query("drop table Users CASCADE", (err, data) => {
      if (err) return resolve(console.log("Users table does not exist."));
      return resolve(console.log("Deleted Users table"));
    });
  });

  // Create Users
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Users(username VARCHAR(40) primary key, password VARCHAR(40) not null)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Users table"));
        return resolve(console.log("Created Users table"));
      },
    );
  });

  // Delete Diners
  await new Promise((resolve, reject) => {
    pool.query("drop table Diners", (err, data) => {
      if (err) return resolve(console.log("Diners table does not exist."));
      return resolve(console.log("Deleted Diners table"));
    });
  });

  // Create Diners
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Diners(username VARCHAR(40) primary key references Users(username) on delete CASCADE)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Diners table"));
        return resolve(console.log("Created Diners table"));
      },
    );
  });

  // Delete Admins
  await new Promise((resolve, reject) => {
    pool.query("drop table Admins", (err, data) => {
      if (err) return resolve(console.log("Admins table does not exist."));
      return resolve(console.log("Deleted Admins table"));
    });
  });

  // Create Admins
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Admins(username VARCHAR(40) primary key references Users(username) on delete CASCADE)",
      (err, data) => {
        if (err) return resolve(console.log(err)); //"Error creating Admins table"));
        return resolve(console.log("Created Admins table"));
      },
    );
  });

  // Delete Owners
  await new Promise((resolve, reject) => {
    pool.query("drop table Owners", (err, data) => {
      if (err) return resolve(console.log("Owners table does not exist."));
      return resolve(console.log("Deleted Owners table"));
    });
  });

  // Create Owners
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Owners(username VARCHAR(40) primary key references Users(username) on delete CASCADE)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Owners table"));
        return resolve(console.log("Created Owners table"));
      },
    );
  });

  // Delete Restaurants
  await new Promise((resolve, reject) => {
    pool.query("drop table Restaurants", (err, data) => {
      if (err) return resolve(console.log("Restaurants table does not exist."));
      return resolve(console.log("Deleted Restaurants table"));
    });
  });

  // Create Restaurants
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Restaurants(rname VARCHAR(40) primary key)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Restaurants table"));
        return resolve(console.log("Created Restaurants table"));
      },
    );
  });

  // Delete Areas
  await new Promise((resolve, reject) => {
    pool.query("drop table Areas", (err, data) => {
      if (err) return resolve(console.log("Areas table does not exist."));
      return resolve(console.log("Deleted Areas table"));
    });
  });

  // Create Areas
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

  // Delete Food
  await new Promise((resolve, reject) => {
    pool.query("drop table Food", (err, data) => {
      if (err) return resolve(console.log("Food table does not exist."));
      return resolve(console.log("Deleted Food table"));
    });
  });

  // Create Food
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Food(fname VARCHAR(40) primary key)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Food table"));
        return resolve(console.log("Created Food table"));
      },
    );
  });

  // Delete Sells
  await new Promise((resolve, reject) => {
    pool.query("drop table Sells", (err, data) => {
      if (err) return resolve(console.log("Sells table does not exist."));
      return resolve(console.log("Deleted Sells table"));
    });
  });

  // Create Sells
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Sells(rname VARCHAR(40) references Restaurants(rname) on delete CASCADE"
      + ",fname VARCHAR(40) references Food(fname) on delete CASCADE"
      + ",primary key (rname, fname))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Sells table"));
        return resolve(console.log("Created Sells table"));
      },
    );
  });

  // Delete Cuisines
  await new Promise((resolve, reject) => {
    pool.query("drop table Cuisines", (err, data) => {
      if (err) return resolve(console.log("Cuisines table does not exist."));
      return resolve(console.log("Deleted Cuisines table"));
    });
  });

  // Create Cuisines
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Cuisines(cname VARCHAR(40) primary key)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Cuisines table"));
        return resolve(console.log("Created Cuisines table"));
      },
    );
  });

  // Delete Serves
  await new Promise((resolve, reject) => {
    pool.query("drop table Serves", (err, data) => {
      if (err) return resolve(console.log("Serves table does not exist."));
      return resolve(console.log("Deleted Serves table"));
    });
  });

  // Create Serves
  await new Promise((resolve, reject) => {
    pool.query(
      "create table Serves(rname VARCHAR(40) references Restaurants(rname) on delete CASCADE"
      + ",cname VARCHAR(40) references Cuisines(cname) on delete CASCADE"
      + ",primary key (rname, cname))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Serves table"));
        return resolve(console.log("Created Serves table"));
      },
    );
  });

};

buildSchemas();
