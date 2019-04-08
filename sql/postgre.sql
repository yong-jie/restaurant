-- Only able to sell food of the same cuisine that the restaurant serves
CREATE OR REPLACE FUNCTION same_cuisine()
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELCT COUNT (*) into count
		FROM Food F NATURAL JOIN Restaurant R
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

-- Forces every owner to own exactly one restaurant
-- If owner wants to update to a different restaurant, it is not allowed as well	 
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

-- Does not allow rate to occur if haven't reserved at that outlet before
CREATE OR REPLACE FUNCTION reserve_before()
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELECT COUNT (*) into count
		FROM Reserves 
		WHERE NEW.username = username and confirmed = TRUE 
		and NEW.rname = rname and NEW.aname = aname;
		IF count = 0 THEN
			RETURN NULL;
		ELSE
			RETURN NEW;
		END IF;
	END;
	$$
	LANGUAGE plpgsql;

CREATE TRIGGER rate0
BEFORE INSERT OR UPDATE
ON Rates
FOR EACH ROW
EXECUTE PROCEDURE reserve_before();

-- Does not allow any reserve to overlap with another reserve within an hour
CREATE OR REPLACE FUNCTION reserves_overlap()
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELECT COUNT (*) into count
		FROM Reserves 
		WHERE NEW.username = username and NEW.reid <> reid
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