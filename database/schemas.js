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
    pool.query("DROP TABLE Diners", (err, data) => {
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
    pool.query("DROP TABLE Admins", (err, data) => {
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

  // Delete Owners
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Owners", (err, data) => {
      if (err) return resolve(console.log("Owners table does not exist."));
      return resolve(console.log("Deleted Owners table"));
    });
  });

  // Create Owners
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Owners(username VARCHAR(40) primary key references Users(username) on delete CASCADE)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Owners table"));
        return resolve(console.log("Created Owners table"));
      },
    );
  });

  // Delete Restaurants
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Restaurants", (err, data) => {
      if (err) return resolve(console.log("Restaurants table does not exist."));
      return resolve(console.log("Deleted Restaurants table"));
    });
  });

  // Create Restaurants
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Restaurants(rname VARCHAR(40) primary key)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Restaurants table"));
        return resolve(console.log("Created Restaurants table"));
      },
    );
  }); 

  // Delete Food
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Food", (err, data) => {
      if (err) return resolve(console.log("Food table does not exist."));
      return resolve(console.log("Deleted Food table"));
    });
  });

  // Create Food
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Food(fname VARCHAR(40) primary key"
      + ", price NUMERIC(5,2) NOT NULL)",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Food table"));
        return resolve(console.log("Created Food table"));
      },
    );
  });  

  // Delete Cuisines
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Cuisines", (err, data) => {
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

  // Delete RestaurantAreas
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE RestaurantAreas", (err, data) => {
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
      + ", PRIMARY KEY (rname, aname))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating RestaurantAreas table"));
        return resolve(console.log("Created RestaurantAreas table"));
      },
    );
  });

  // Delete Sells
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Sells", (err, data) => {
      if (err) return resolve(console.log("Sells table does not exist."));
      return resolve(console.log("Deleted Sells table"));
    });
  });

  // Create Sells
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Sells(rname VARCHAR(40) references Restaurants(rname) on delete CASCADE"
      + ", fname VARCHAR(40) references Food(fname) on delete CASCADE"
      + ", PRIMARY KEY (rname, fname))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Sells table"));
        return resolve(console.log("Created Sells table"));
      },
    );
  });

  // Delete Serves
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Serves", (err, data) => {
      if (err) return resolve(console.log("Serves table does not exist."));
      return resolve(console.log("Deleted Serves table"));
    });
  });

  // Create Serves
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Serves(rname VARCHAR(40) references Restaurants(rname) on delete CASCADE"
      + ", cname VARCHAR(40) references Cuisines(cname) on delete CASCADE"
      + ", PRIMARY KEY (rname, cname))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Serves table"));
        return resolve(console.log("Created Serves table"));
      },
    );
  });

  // Delete Reserves
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Reserves", (err, data) => {
      if (err) return resolve(console.log("Reserves table does not exist."));
      return resolve(console.log("Deleted Reserves table"));
    });
  });

  // Create Reserves
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Reserves(rname VARCHAR(40)"
      + ", aname VARCHAR(40)"      
      + ", username VARCHAR(40) references Diners(username) on delete CASCADE"
      + ", numPax INTEGER NOT NULL"
      + ", confirmed BOOLEAN NOT NULL"
      + ", amount NUMERIC(5,2)"
      + ", DateTime TIMESTAMP NOT NULL"
      + ", PRIMARY KEY (rname, aname, username)"
      + ", FOREIGN KEY (rname, aname) references RestaurantAreas on delete CASCADE)",    
      (err, data) => {
        if (err) return resolve(console.log("Error creating Reserves table"));
        return resolve(console.log("Created Reserves table"));
      },
    );
  });

  // Delete Rates
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Rates", (err, data) => {
      if (err) return resolve(console.log("Rates table does not exist."));
      return resolve(console.log("Deleted Rates table"));
    });
  });

  // Create Rates
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Rates(rname VARCHAR(40)"
      + ", aname VARCHAR(40)"      
      + ", username VARCHAR(40) references Diners(username) on delete CASCADE"
      + ", comment VARCHAR(40)"
      + ", score REAL NOT NULL"
      + ", PRIMARY KEY (rname, aname, username)"
      + ", FOREIGN KEY (rname, aname) references RestaurantAreas on delete CASCADE)",          
      (err, data) => {
        if (err) return resolve(console.log("Error creating Rates table"));
        return resolve(console.log("Created Rates table"));
      },
    );
  });

  // Delete RestaurantPromos
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE RestaurantPromos", (err, data) => {
      if (err) return resolve(console.log("RestaurantPromos table does not exist."));
      return resolve(console.log("Deleted RestaurantPromos table"));
    });
  });

  // Create RestaurantPromos
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE RestaurantPromos(rname VARCHAR(40) references Restaurants(rname) on delete CASCADE"
      + ", discount INTEGER"    
      + ", startDate DATE NOT NULL"
      + ", endDate DATE NOT NULL"
      + ", PRIMARY KEY (rname, discount))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating RestaurantPromos table"));
        return resolve(console.log("Created RestaurantPromos table"));
      },
    );
  });

  // Delete Owns
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Owns", (err, data) => {
      if (err) return resolve(console.log("Owns table does not exist."));
      return resolve(console.log("Deleted Owns table"));
    });
  });

  // Create Owns
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Owns(rname VARCHAR(40) references Restaurants(rname) on delete CASCADE"
      + ", username VARCHAR(40) references Owners(username) on delete CASCADE"
      + ", PRIMARY KEY (rname, username))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Owns table"));
        return resolve(console.log("Created Owns table"));
      },
    );
  }); 
  
  // Delete Likes
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Likes", (err, data) => {
      if (err) return resolve(console.log("Likes table does not exist."));
      return resolve(console.log("Deleted Likes table"));
    });
  });

  // Create Likes
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Likes(fname VARCHAR(40) references Food(fname) on delete CASCADE"
      + ", username VARCHAR(40) references Diners(username) on delete CASCADE"
      + ", PRIMARY KEY (fname, username))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Likes table"));
        return resolve(console.log("Created Likes table"));
      },
    );
  }); 
  
  // Delete Belongs
  await new Promise((resolve, reject) => {
    pool.query("DROP TABLE Belongs", (err, data) => {
      if (err) return resolve(console.log("Belongs table does not exist."));
      return resolve(console.log("Deleted Belongs table"));
    });
  });

  // Create Belongs
  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TABLE Belongs(fname VARCHAR(40) references Food(fname) on delete CASCADE"
      + ", cname VARCHAR(40) references Cuisines(cname) on delete CASCADE"
      + ", PRIMARY KEY (cname, fname))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating Belongs table"));
        return resolve(console.log("Created Belongs table"));
      },
    );
  }); 

};

buildSchemas();
