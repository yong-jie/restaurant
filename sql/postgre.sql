/*CREATE OR REPLACE FUNCTION book_crash()
RETURNS TRIGGER AS
$$
	begin
		if ((EXTRACT(EPOCH FROM new.datetime) - EXTRACT(EPOCH FROM timestamptz '2019-08-23 8:00:00.000 -08:00')) <= 3600) then
			RAISE NOTICE 'There is another booking that is already made within 1 hour ';
			RETURN Null;
		else
			RAISE NOTICE 'test';
			RETURN Null;
			RETURN NEW;
		end if;
	END;
$$
LANGUAGE PLPGSQL;

CREATE TRIGGER booking_crash
BEFORE insert or update
ON reserves
FOR EACH ROW
EXECUTE PROCEDURE book_crash();*/