CREATE TABLE Users (
	username VARCHAR(40) PRIMARY KEY,
	password VARCHAR(40) NOT NULL
);

CREATE TABLE Diners (
	username VARCHAR(40) PRIMARY KEY references Users(username) on delete CASCADE
);

CREATE TABLE Cuisines (
	cname VARCHAR(40) PRIMARY KEY
);

CREATE TABLE Restaurants (
	rname VARCHAR(40) PRIMARY KEY, 
	cname VARCHAR(40) NOT NULL references Cuisines(cname) on delete CASCADE
);

CREATE TABLE Owners (
	username VARCHAR(40) PRIMARY KEY references Users(username) on delete CASCADE,
  rname VARCHAR(40) NOT NULL references Restaurants(rname) on delete CASCADE
);

CREATE TABLE Food (
	fname VARCHAR(40) PRIMARY KEY,
  cname VARCHAR(40) NOT NULL references Cuisines(cname) on delete CASCADE
);

CREATE TABLE RestaurantAreas (
	rname VARCHAR(40) references Restaurants(rname) on delete CASCADE,
  aname VARCHAR(40),   
  address VARCHAR(40),
  startTime TIME NOT NULL,
  endTime TIME NOT NULL, 
  PRIMARY KEY (rname, aname, address),
  check (endTime > startTime)
);

CREATE TABLE Sells (
	rname VARCHAR(40) references Restaurants(rname) on delete CASCADE,
  fname VARCHAR(40) references Food(fname) on delete CASCADE,
  price NUMERIC(5,2) NOT NULL,
  PRIMARY KEY (rname, fname)
);

CREATE TABLE Reserves (
	reid INTEGER PRIMARY KEY,
  rname VARCHAR(40) NOT NULL,
  aname VARCHAR(40) NOT NULL,      
  address VARCHAR(40) NOT NULL,
  username VARCHAR(40) NOT NULL references Diners(username) on delete CASCADE,
  numPax INTEGER NOT NULL,
  confirmed BOOLEAN NOT NULL,
  amount NUMERIC(5,2) NOT NULL,
  dateTime TIMESTAMP NOT NULL,
  FOREIGN KEY (rname, aname, address) references RestaurantAreas on delete CASCADE
);

CREATE TABLE Rates (
	raid INTEGER PRIMARY KEY,
  rname VARCHAR(40) NOT NULL,
  aname VARCHAR(40) NOT NULL,
  address VARCHAR(40) NOT NULL,
  username VARCHAR(40) NOT NULL references Diners(username) on delete CASCADE,
  comment VARCHAR(1000),
  score REAL NOT NULL,
  dateTime TIMESTAMP NOT NULL,
  FOREIGN KEY (rname, aname, address) references RestaurantAreas on delete CASCADE,
  check (score >= 0 and score <= 10)
);

CREATE TABLE RestaurantPromos (
  rname VARCHAR(40) references Restaurants(rname) on delete CASCADE,
  discount INTEGER NOT NULL,    
  startDate DATE,
  endDate DATE,
  PRIMARY KEY (rname, startDate, endDate),
  check ((endDate > startDate) and (discount > 0 and discount < 100))
);


-- Only able to sell food of the same cuisine that the restaurant serves
CREATE OR REPLACE FUNCTION same_cuisine()
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELECT COUNT (*) into count
		FROM Food F NATURAL JOIN Restaurants R
		WHERE NEW.fname = F.fname and NEW.rname = R.rname;
		IF count = 0 THEN RETURN NULL;
		ELSE RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;			

CREATE TRIGGER cuisine_same
BEFORE INSERT OR UPDATE ON Sells
FOR EACH ROW
EXECUTE PROCEDURE same_cuisine();

-- No two owners are allowed to own the same restaurant
CREATE OR REPLACE FUNCTION before_owned()
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELECT COUNT (*) into count
		FROM Owners
		WHERE NEW.rname = rname;
		IF count > 0 THEN RETURN NULL;
		ELSE RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER owned_before
BEFORE INSERT OR UPDATE
ON Owners
FOR EACH ROW
EXECUTE PROCEDURE before_owned();

-- Does not allow rate to occur if its been more than 30 days or a month for the most recent reserve
CREATE OR REPLACE FUNCTION reserve_recently()
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELECT COUNT (*) into count
		FROM Reserves
		WHERE NEW.username = username and confirmed = TRUE
		and NEW.rname = rname and NEW.aname = aname
		and dateTime >= (NEW.dateTime - INTERVAL '1 month');
		IF count > 0 THEN RETURN NEW;
		ELSE RETURN NULL;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER rate2
BEFORE INSERT OR UPDATE ON Rates
FOR EACH ROW
EXECUTE PROCEDURE reserve_recently();

-- Does not allow rate to occur if already rated within 7 days or a week
CREATE OR REPLACE FUNCTION rated_recently()
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELECT COUNT (*) into count
		FROM Rates
		WHERE NEW.username = username
		and NEW.rname = rname and NEW.aname = aname
		and dateTime >= (NEW.dateTime - INTERVAL '1 week')
		and NEW.raid <> raid;
		IF count > 0 THEN RETURN NULL;
		ELSE RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER rated_recently
BEFORE INSERT OR UPDATE ON Rates
FOR EACH ROW
EXECUTE PROCEDURE rated_recently();

-- Does not allow any reserve to overlap with another reserve within an hour
CREATE OR REPLACE FUNCTION reserves_overlap()
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELECT COUNT (*) into count
		FROM Reserves 
		WHERE NEW.username = username and NEW.reid <> reid and NEW.amount = 0.00
		and ((NEW.dateTime >= (dateTime - INTERVAL '1 hour') and NEW.dateTime <= dateTime)
		or (NEW.dateTime <= (dateTime + INTERVAL '1 hour') and NEW.dateTime >= dateTime));
		IF count > 0 THEN RETURN NULL;
		ELSE RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER reserves_overlap
BEFORE INSERT OR UPDATE
ON Reserves
FOR EACH ROW
EXECUTE PROCEDURE reserves_overlap();

-- Does not allow any reserve to be outside the restaurant's opening hours
CREATE OR REPLACE FUNCTION reserves_opening_hours()
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELECT COUNT (*) into count
		FROM RestaurantAreas 
		WHERE NEW.amount = 0.00 and NEW.rname = rname and NEW.aname = aname and NEW.address = address
		and ((NEW.dateTime::TIME >= endTime) or (NEW.dateTime::TIME < startTime));
		IF count > 0 then RETURN NULL;
		else RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER reserves_opening_hours
BEFORE INSERT OR UPDATE
ON Reserves FOR EACH ROW
EXECUTE PROCEDURE reserves_opening_hours();

-- Does not allow reserve to be before current local timestamp
CREATE OR REPLACE FUNCTION reserves_before_localtime()
	RETURNS TRIGGER AS
	$$
	BEGIN
		IF NEW.dateTime <= LOCALTIMESTAMP THEN RETURN NULL;
		ELSE RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER reserves_before_localtime
BEFORE INSERT OR UPDATE ON Reserves
FOR EACH ROW
EXECUTE PROCEDURE reserves_before_localtime();

CREATE OR REPLACE FUNCTION not_diners() 
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELECT COUNT (*) INTO count
		FROM Diners
		WHERE NEW.username = username;
		IF count > 0 THEN RETURN NULL;
		ELSE RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER non_diners
BEFORE INSERT OR UPDATE ON Owners
FOR EACH ROW
EXECUTE PROCEDURE not_diners();

CREATE OR REPLACE FUNCTION not_owners() 
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELECT COUNT (*) INTO count
		FROM Owners
		WHERE NEW.username = username;
		IF count > 0 THEN RETURN NULL;
		ELSE RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER non_owners
BEFORE INSERT OR UPDATE ON Diners
FOR EACH ROW
EXECUTE PROCEDURE not_owners();

CREATE OR REPLACE FUNCTION delete_expired_promos()
	RETURNS TRIGGER AS
	$$
	DECLARE 
		today TIMESTAMP;
	BEGIN
		SELECT localtimestamp INTO today;
		DELETE FROM RestaurantPromos RP WHERE RP.endDate < today;

		RETURN NEW;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER delete_expired_promos
BEFORE INSERT OR UPDATE ON RestaurantPromos
FOR EACH ROW
EXECUTE PROCEDURE delete_expired_promos();

