-- Only able to like food that is in the menu
CREATE OR REPLACE FUNCTION food_menu()
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELECT COUNT (*) into count
		FROM Sells 
		WHERE NEW.fname = fname;
		IF count = 0 THEN
			RETURN NULL;
		ELSE
			RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;			

CREATE TRIGGER menu_food
BEFORE INSERT OR UPDATE
ON Likes
FOR EACH ROW
EXECUTE PROCEDURE food_menu();

-- Only able to sell food of the same cuisine that the restaurant serves
CREATE OR REPLACE FUNCTION same_cuisine()
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELECT COUNT (*) into count
		FROM Food F NATURAL JOIN Restaurants R
		WHERE NEW.fname = F.fname and NEW.rname = R.rname;
		IF count = 0 THEN
			RETURN NULL;
		ELSE
			RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;			

CREATE TRIGGER cuisine_same
BEFORE INSERT OR UPDATE
ON Sells
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
		IF count > 0 THEN
			RETURN NULL;
		ELSE
			RETURN NEW;
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
		IF count > 0 THEN
			RETURN NEW;
		ELSE
			RETURN NULL;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER rate2
BEFORE INSERT OR UPDATE
ON Rates
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
		IF count > 0 THEN
			RETURN NULL;
		ELSE
			RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER rate1
BEFORE INSERT OR UPDATE
ON Rates
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
		IF count > 0 THEN
			RETURN NULL;
		ELSE 
			RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER overlap_reserves
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
		FROM restaurantareas r1
		WHERE NEW.amount = 0.00 and new.RNAME = r1.rname and new.aname = r1.aname and new.address = r1.address
		and ((NEW.dateTime::time >= r1.endtime) or (NEW.dateTime::time < r1.starttime));
		IF count > 0 then
			RETURN NULL;
		else
			RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER reserves_opening_hours
BEFORE INSERT OR UPDATE
ON Reserves
FOR EACH ROW
EXECUTE PROCEDURE reserves_opening_hours();

-- Does not allow reserve to be before current local timestamp
CREATE OR REPLACE FUNCTION reserves_before_localtime()
	RETURNS TRIGGER AS
	$$
	BEGIN
		IF NEW.dateTime <= LOCALTIMESTAMP THEN
			RETURN NULL;
		ELSE
			RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER reserves_before_localtime
BEFORE INSERT OR UPDATE
ON Reserves
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
		IF count > 0 THEN
			RETURN NULL;
		ELSE
			RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER non_diners
BEFORE INSERT OR UPDATE
ON Owners
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
		IF count > 0 THEN
			RETURN NULL;
		ELSE
			RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER non_owners
BEFORE INSERT OR UPDATE
ON Diners
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
BEFORE INSERT OR UPDATE
ON RestaurantPromos
FOR EACH ROW
EXECUTE PROCEDURE delete_expired_promos();

