const { Pool } = require("pg");
const config = require("../config.js");

const pool = new Pool(config.pgConfig);

const buildSchemas = async () => {
  // Delete Users
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Users CASCADE", (err, data) => {
      if (err) return resolve(console.log("Users table does not exist."));
      return resolve(console.log("Deleted Users table"));
    });
  });

  // Create Users
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Users(username VARCHAR(40) primary key, password VARCHAR(40) NOT NULL)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Users table"));
        return resolve(console.log("Created Users table"));
      },
    );
  });

  // Delete Diners
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Diners CASCADE", (err, data) => {
      if (err) return resolve(console.log("Diners table does not exist."));
      return resolve(console.log("Deleted Diners table"));
    });
  });

  // Create Diners
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Diners(username VARCHAR(40) primary key references Users(username) on delete CASCADE)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Diners table"));
        return resolve(console.log("Created Diners table"));
      },
    );
  });

  // Delete Admins
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Admins CASCADE", (err, data) => {
      if (err) return resolve(console.log("Admins table does not exist."));
      return resolve(console.log("Deleted Admins table"));
    });
  });

  // Create Admins
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Admins(username VARCHAR(40) primary key references Users(username) on delete CASCADE)",
      (err, data) => {
        if (err) return resolve(console.log(err)); //"Error creating Admins table"));
        return resolve(console.log("Created Admins table"));
      },
    );
  });

  // Delete Cuisines
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Cuisines CASCADE", (err, data) => {
      if (err) return resolve(console.log("Cuisines table does not exist."));
      return resolve(console.log("Deleted Cuisines table"));
    });
  });

  // Create Cuisines
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Cuisines(cname VARCHAR(40) primary key)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Cuisines table"));
        return resolve(console.log("Created Cuisines table"));
      },
    );
  });   

  // Delete Restaurants
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Restaurants CASCADE", (err, data) => {
      if (err) return resolve(console.log("Restaurants table does not exist."));
      return resolve(console.log("Deleted Restaurants table"));
    });
  });

  // Create Restaurants
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Restaurants(rname VARCHAR(40) primary key"
      + ", cname VARCHAR(40) NOT NULL references Cuisines(cname) on delete CASCADE)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Restaurants table"));
        return resolve(console.log("Created Restaurants table"));
      },
    );
  });

  // Delete Owners
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Owners CASCADE", (err, data) => {
      if (err) return resolve(console.log("Owners table does not exist."));
      return resolve(console.log("Deleted Owners table"));
    });
  });

  // Create Owners
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Owners(username VARCHAR(40) primary key references Users(username) on delete CASCADE"
      + ", rname VARCHAR(40) NOT NULL references Restaurants(rname) on delete CASCADE)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Owners table"));
        return resolve(console.log("Created Owners table"));
      },
    );
  }); 

  // Delete Food
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Food CASCADE", (err, data) => {
      if (err) return resolve(console.log("Food table does not exist."));
      return resolve(console.log("Deleted Food table"));
    });
  });

  // Create Food
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Food(fname VARCHAR(40) primary key"
      + ", cname VARCHAR(40) NOT NULL references Cuisines(cname) on delete CASCADE)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Food table"));
        return resolve(console.log("Created Food table"));
      },
    );
  });  

  // Delete RestaurantAreas
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE RestaurantAreas CASCADE", (err, data) => {
      if (err) return resolve(console.log("RestaurantAreas table does not exist."));
      return resolve(console.log("Deleted RestaurantAreas table"));
    });
  });

  // Create RestaurantAreas
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE RestaurantAreas(rname VARCHAR(40) references Restaurants(rname) on delete CASCADE"
      + ", aname VARCHAR(40)"      
      + ", address VARCHAR(40) NOT NULL"  
      + ", startTime TIME NOT NULL"
      + ", endTime TIME NOT NULL"   
      + ", PRIMARY KEY (rname, aname)"
      + ", check (endTime > startTime))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating RestaurantAreas table"));
        return resolve(console.log("Created RestaurantAreas table"));
      },
    );
  });

  // Delete Sells
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Sells CASCADE", (err, data) => {
      if (err) return resolve(console.log("Sells table does not exist."));
      return resolve(console.log("Deleted Sells table"));
    });
  });

  // Create Sells
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Sells(rname VARCHAR(40) references Restaurants(rname) on delete CASCADE"
      + ", fname VARCHAR(40) references Food(fname) on delete CASCADE"
      + ", price NUMERIC(5,2) NOT NULL"
      + ", PRIMARY KEY (rname, fname))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Sells table"));
        return resolve(console.log("Created Sells table"));
      },
    );
  });

  // Delete Reserves
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Reserves CASCADE", (err, data) => {
      if (err) return resolve(console.log("Reserves table does not exist."));
      return resolve(console.log("Deleted Reserves table"));
    });
  });

  // Create Reserves
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Reserves(reid INTEGER primary key"
      + ", rname VARCHAR(40) NOT NULL"
      + ", aname VARCHAR(40) NOT NULL"      
      + ", username VARCHAR(40) NOT NULL references Diners(username) on delete CASCADE"
      + ", numPax INTEGER NOT NULL"
      + ", confirmed BOOLEAN NOT NULL"
      + ", amount NUMERIC(5,2)"
      + ", dateTime TIMESTAMP NOT NULL"
      + ", FOREIGN KEY (rname, aname) references RestaurantAreas on delete CASCADE)",    
      (err, data) => {
        if (err) return resolve(console.log("Error creating Reserves table"));
        return resolve(console.log("Created Reserves table"));
      },
    );
  });

  // Delete Rates
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Rates CASCADE", (err, data) => {
      if (err) return resolve(console.log("Rates table does not exist."));
      return resolve(console.log("Deleted Rates table"));
    });
  });

  // Create Rates
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Rates(raid INTEGER primary key"
      + ", rname VARCHAR(40) NOT NULL"
      + ", aname VARCHAR(40) NOT NULL"      
      + ", username VARCHAR(40) NOT NULL references Diners(username) on delete CASCADE"
      + ", comment VARCHAR(40)"
      + ", score REAL NOT NULL"
      + ", FOREIGN KEY (rname, aname) references RestaurantAreas on delete CASCADE"
      + ", check (score >= 0 and score <= 10))",       
      (err, data) => {
        if (err) return resolve(console.log("Error creating Rates table"));
        return resolve(console.log("Created Rates table"));
      },
    );
  });

  // Delete RestaurantPromos
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE RestaurantPromos CASCADE", (err, data) => {
      if (err) return resolve(console.log("RestaurantPromos table does not exist."));
      return resolve(console.log("Deleted RestaurantPromos table"));
    });
  });

  // Create RestaurantPromos
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE RestaurantPromos(rname VARCHAR(40) references Restaurants(rname) on delete CASCADE"
      + ", discount INTEGER NOT NULL"    
      + ", startDate DATE"
      + ", endDate DATE"
      + ", PRIMARY KEY (rname, startDate, endDate)"
      + ", check ((endDate > startDate) and (discount > 0 and discount < 100)))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating RestaurantPromos table"));
        return resolve(console.log("Created RestaurantPromos table"));
      },
    );
  });

  // Delete Likes
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Likes CASCADE", (err, data) => {
      if (err) return resolve(console.log("Likes table does not exist."));
      return resolve(console.log("Deleted Likes table"));
    });
  });

  // Create Likes
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Likes(fname VARCHAR(40) references Food(fname) on delete CASCADE"
      + ", username VARCHAR(40) references Diners(username) on delete CASCADE"
      + ", score REAL NOT NULL"
      + ", PRIMARY KEY (fname, username)"
      + ", check (score >= 0 and score <= 10))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Likes table"));
        return resolve(console.log("Created Likes table"));
      },
    );
  });

};

buildSchemas();
