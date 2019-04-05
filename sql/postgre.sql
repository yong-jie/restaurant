CREATE OR REPLACE FUNCTION reserves_overlap()
	RETURNS TRIGGER AS
	$$
	DECLARE count NUMERIC;
	BEGIN
		SELECT COUNT (*) into count
		FROM Reserves 
		WHERE NEW.username = username
		and ((NEW.rname = rname and NEW.aname <> aname)
		or (NEW.rname <> rname and NEW.aname <> aname)
		or (NEW.rname <> rname and NEW.aname = aname))
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