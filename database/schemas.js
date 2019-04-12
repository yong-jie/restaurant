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
      + ", address VARCHAR(40)"  
      + ", startTime TIME NOT NULL"
      + ", endTime TIME NOT NULL"   
      + ", PRIMARY KEY (rname, aname, address)"
      + ", check (endTime > startTime))",
      (err, data) => {
        if (err) return resolve(console.log("Error creating    table"));
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
      + ", address VARCHAR(40) NOT NULL"
      + ", username VARCHAR(40) NOT NULL references Diners(username) on delete CASCADE"
      + ", numPax INTEGER NOT NULL"
      + ", confirmed BOOLEAN NOT NULL"
      + ", amount NUMERIC(5,2) NOT NULL"
      + ", dateTime TIMESTAMP NOT NULL"
      + ", FOREIGN KEY (rname, aname, address) references RestaurantAreas on delete CASCADE)",    
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
      + ", dateTime TIMESTAMP NOT NULL"
      + ", rname VARCHAR(40) NOT NULL" 
      + ", aname VARCHAR(40) NOT NULL"
      + ", address VARCHAR(40) NOT NULL"      
      + ", username VARCHAR(40) NOT NULL references Diners(username) on delete CASCADE"
      + ", comment VARCHAR(1000)"
      + ", score REAL NOT NULL"
      + ", FOREIGN KEY (rname, aname, address) references RestaurantAreas on delete CASCADE"
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

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE OR REPLACE FUNCTION same_cuisine()"
      + " RETURNS TRIGGER AS $$"
      + " DECLARE count NUMERIC;"
      + " BEGIN"
      + "   SELECT COUNT (*) into count"
      + "   FROM Food F NATURAL JOIN Restaurants R"
      + "   WHERE NEW.fname = F.fname and NEW.rname = R.rname;"
      + "     IF count = 0 THEN RETURN NULL;"
      + "     ELSE RETURN NEW;"
      + "   END IF;"
      + " END; $$ LANGUAGE plpgsql;",
      (err, data) => {
        if (err) return resolve(console.log("Error creating same_cuisine function"));
        return resolve(console.log("Created same_cuisine function"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TRIGGER same_cuisine"
      + "   BEFORE INSERT OR UPDATE ON Sells"
      + "   FOR EACH ROW"
      + "   EXECUTE PROCEDURE same_cuisine();",
      (err, data) => {
        if (err) return resolve(console.log("Error creating same_cuisine trigger"));
        return resolve(console.log("Created same_cuisine trigger"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE OR REPLACE FUNCTION owned_before()"
      + "  RETURNS TRIGGER AS"
      + "  $$"
      + "  DECLARE count NUMERIC;"
      + "  BEGIN"
      + "    SELECT COUNT (*) into count"
      + "    FROM Owners"
      + "    WHERE NEW.rname = rname;"
      + "    IF count > 0 THEN RETURN NULL;"
      + "    ELSE RETURN NEW;"
      + "    END IF;"
      + "  END;"
      + "  $$"
      + "  LANGUAGE plpgsql;",
      (err, data) => {
        if (err) return resolve(console.log("Error creating owned_before function"));
        return resolve(console.log("Created owned_before function"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TRIGGER owned_before"
      + "  BEFORE INSERT OR UPDATE ON Owners"
      + "  FOR EACH ROW"
      + "  EXECUTE PROCEDURE owned_before();",
      (err, data) => {
        if (err) return resolve(console.log("Error creating owned_before trigger"));
        return resolve(console.log("Created owned_before trigger"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE OR REPLACE FUNCTION reserve_recently()"
      + "  RETURNS TRIGGER AS"
      + "  $$"
      + "  DECLARE count NUMERIC;"
      + "  BEGIN"
      + "    SELECT COUNT (*) into count"
      + "    FROM Reserves"
      + "    WHERE NEW.username = username and confirmed = TRUE"
      + "    and NEW.rname = rname and NEW.aname = aname"
      + "    and dateTime >= (NEW.dateTime - INTERVAL '1 month');"
      + "    IF count > 0 THEN RETURN NEW;"
      + "    ELSE RETURN NULL;"
      + "    END IF;"
      + "  END;"
      + "  $$"
      + "  LANGUAGE plpgsql;",
      (err, data) => {
        if (err) return resolve(console.log("Error creating reserve_recently function"));
        return resolve(console.log("Created reserve_recently function"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TRIGGER reserve_recently"
      + "  BEFORE INSERT OR UPDATE ON Rates"
      + "  FOR EACH ROW"
      + "  EXECUTE PROCEDURE reserve_recently();",
      (err, data) => {
        if (err) return resolve(console.log("Error creating reserve_recently trigger"));
        return resolve(console.log("Created reserve_recently trigger"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE OR REPLACE FUNCTION rated_recently()"
      + "  RETURNS TRIGGER AS"
      + "  $$"
      + "  DECLARE count NUMERIC;"
      + "  BEGIN"
      + "    SELECT COUNT (*) into count"
      + "    FROM Rates"
      + "    WHERE NEW.username = username"
      + "    and NEW.rname = rname and NEW.aname = aname"
      + "    and dateTime >= (NEW.dateTime - INTERVAL '1 week')"
      + "    and NEW.raid <> raid;"
      + "    IF count > 0 THEN RETURN NULL;"
      + "    ELSE RETURN NEW;"
      + "    END IF;"
      + "  END;"
      + "  $$"
      + "  LANGUAGE plpgsql;",
      (err, data) => {
        if (err) return resolve(console.log("Error creating rated_recently function"));
        return resolve(console.log("Created rated_recently function"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TRIGGER rated_recently"
      + "  BEFORE INSERT OR UPDATE ON Rates"
      + "  FOR EACH ROW"
      + "  EXECUTE PROCEDURE rated_recently();",
      (err, data) => {
        if (err) return resolve(console.log("Error creating rated_recently trigger"));
        return resolve(console.log("Created rated_recently trigger"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE OR REPLACE FUNCTION reserves_overlap()"
       + "  RETURNS TRIGGER AS"
       + "  $$"
       + "  DECLARE count NUMERIC;"
       + "  BEGIN"
       + "    SELECT COUNT (*) into count"
       + "    FROM Reserves "
       + "    WHERE NEW.username = username and NEW.reid <> reid and NEW.amount = 0.00"
       + "    and ((NEW.dateTime >= (dateTime - INTERVAL '1 hour') and NEW.dateTime <= dateTime)"
       + "    or (NEW.dateTime <= (dateTime + INTERVAL '1 hour') and NEW.dateTime >= dateTime));"
       + "    IF count > 0 THEN RETURN NULL;"
       + "    ELSE RETURN NEW;"
       + "    END IF;"
       + "  END;"
       + "  $$"
       + "  LANGUAGE plpgsql;",
      (err, data) => {
        if (err) return resolve(console.log("Error creating reserves_overlap function"));
        return resolve(console.log("Created reserves_overlap function"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TRIGGER reserves_overlap"
       + "  BEFORE INSERT OR UPDATE"
       + "  ON Reserves"
       + "  FOR EACH ROW"
       + "  EXECUTE PROCEDURE reserves_overlap();",
      (err, data) => {
        if (err) return resolve(console.log("Error creating reserves_overlap trigger"));
        return resolve(console.log("Created reserves_overlap trigger"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE OR REPLACE FUNCTION reserves_opening_hours()"
       + "  RETURNS TRIGGER AS"
       + "  $$"
       + "  DECLARE count NUMERIC;"
       + "  BEGIN"
       + "    SELECT COUNT (*) into count"
       + "    FROM restaurantareas r1"
       + "    WHERE NEW.amount = 0.00 and new.RNAME = r1.rname and new.aname = r1.aname and new.address = r1.address"
       + "    and ((NEW.dateTime::time >= r1.endtime) or (NEW.dateTime::time < r1.starttime));"
       + "    IF count > 0 then RETURN NULL;"
       + "    else RETURN NEW;"
       + "    END IF;"
       + "  END;"
       + "  $$"
       + "  LANGUAGE plpgsql;",
      (err, data) => {
        if (err) return resolve(console.log("Error creating reserves_opening_hours function"));
        return resolve(console.log("Created reserves_opening_hours function"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TRIGGER reserves_opening_hours"
       + " BEFORE INSERT OR UPDATE"
       + " ON Reserves FOR EACH ROW"
       + " EXECUTE PROCEDURE reserves_opening_hours();",
      (err, data) => {
        if (err) return resolve(console.log("Error creating reserves_opening_hours trigger"));
        return resolve(console.log("Created reserves_opening_hours trigger"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE OR REPLACE FUNCTION reserves_before_localtime()"
       + "  RETURNS TRIGGER AS"
       + "  $$"
       + "  BEGIN"
       + "    IF NEW.dateTime <= LOCALTIMESTAMP THEN RETURN NULL;"
       + "    ELSE RETURN NEW;"
       + "    END IF;"
       + "  END;"
       + "  $$"
       + "  LANGUAGE plpgsql;",
      (err, data) => {
        if (err) return resolve(console.log("Error creating reserves_before_localtime function"));
        return resolve(console.log("Created reserves_before_localtime function"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TRIGGER reserves_before_localtime"
       + " BEFORE INSERT OR UPDATE ON Reserves"
       + " FOR EACH ROW"
       + " EXECUTE PROCEDURE reserves_before_localtime();",
      (err, data) => {
        if (err) return resolve(console.log("Error creating reserves_before_localtime trigger"));
        return resolve(console.log("Created reserves_before_localtime trigger"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE OR REPLACE FUNCTION not_diners() "
       + "  RETURNS TRIGGER AS"
       + "  $$"
       + "  DECLARE count NUMERIC;"
       + "  BEGIN"
       + "    SELECT COUNT (*) INTO count"
       + "    FROM Diners"
       + "    WHERE NEW.username = username;"
       + "    IF count > 0 THEN RETURN NULL;"
       + "    ELSE RETURN NEW;"
       + "    END IF;"
       + "  END;"
       + "  $$"
       + "  LANGUAGE plpgsql;",
      (err, data) => {
        if (err) return resolve(console.log("Error creating non_diners function"));
        return resolve(console.log("Created non_diners function"));
      },
    );
  });  

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TRIGGER non_diners"
       + " BEFORE INSERT OR UPDATE ON Owners"
       + " FOR EACH ROW"
       + " EXECUTE PROCEDURE not_diners();",
      (err, data) => {
        if (err) return resolve(console.log("Error creating non_diners trigger"));
        return resolve(console.log("Created non_diners trigger"));
      },
    );
  });


  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE OR REPLACE FUNCTION not_owners() "
       + "  RETURNS TRIGGER AS"
       + "  $$"
       + "  DECLARE count NUMERIC;"
       + "  BEGIN"
       + "    SELECT COUNT (*) INTO count"
       + "    FROM Owners"
       + "    WHERE NEW.username = username;"
       + "    IF count > 0 THEN RETURN NULL;"
       + "    ELSE RETURN NEW;"
       + "    END IF;"
       + "  END;"
       + "  $$"
       + "  LANGUAGE plpgsql;",
      (err, data) => {
        if (err) return resolve(console.log("Error creating non_owners function"));
        return resolve(console.log("Created non_owners function"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TRIGGER non_owners"
       + " BEFORE INSERT OR UPDATE ON Diners"
       + " FOR EACH ROW"
       + " EXECUTE PROCEDURE not_owners();",
      (err, data) => {
        if (err) return resolve(console.log("Error creating non_owners trigger"));
        return resolve(console.log("Created non_owners trigger"));
      },
    );
  });


  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE OR REPLACE FUNCTION delete_expired_promos()"
       + "  RETURNS TRIGGER AS"
       + "  $$"
       + "  DECLARE "
       + "    today TIMESTAMP;"
       + "  BEGIN"
       + "    SELECT localtimestamp INTO today;"
       + "    DELETE FROM RestaurantPromos RP WHERE RP.endDate < today;"
       + "    RETURN NEW;"
       + "  END;"
       + "  $$"
       + "  LANGUAGE plpgsql;",
      (err, data) => {
        if (err) return resolve(console.log("Error creating delete_expired_promos function"));
        return resolve(console.log("Created delete_expired_promos function"));
      },
    );
  });

  await new Promise((resolve, reject) => {
    pool.query(
      "CREATE TRIGGER delete_expired_promos"
       + " BEFORE INSERT OR UPDATE ON RestaurantPromos"
       + " FOR EACH ROW"
       + " EXECUTE PROCEDURE delete_expired_promos();",
      (err, data) => {
        if (err) return resolve(console.log("Error creating delete_expired_promos trigger"));
        return resolve(console.log("Created delete_expired_promos trigger"));
      },
    );
  });
}

buildSchemas();
