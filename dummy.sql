-- Users
INSERT INTO Users (username, password)
VALUES ('ShouTeckDiner', '123');

INSERT INTO Users (username, password)
VALUES ('ShouTeckOwner', '123');

INSERT INTO Users (username, password)
VALUES ('NianFeiOwner', '456');

INSERT INTO Users (username, password)
VALUES ('ShouTeckAdmin', '123');

-- Users: should fail, duplicate username
INSERT INTO Users (username, password)
VALUES ('ShouTeckDiner', '456');


-- Diners
INSERT INTO Diners (username)
VALUES ('ShouTeckDiner');

-- Diners: should fail, does not exist in Users
INSERT INTO Diners (username)
VALUES ('abcd');

-- Diners: should fail, duplicate username
INSERT INTO Diners (username)
VALUES ('ShouTeckDiner');


-- Admins
INSERT INTO Admins (username)
VALUES ('ShouTeckAdmin');

-- Admins: should fail, does not exist in Users
INSERT INTO Admins (username)
VALUES ('abcd');

-- Admins: should fail, duplicate username
INSERT INTO Admins (username)
VALUES ('ShouTeckAdmin');


-- Cuisines
INSERT INTO Cuisines (cname)
VALUES ('Western');

INSERT INTO Cuisines (cname)
VALUES ('Chinese');

-- Cuisines: should fail, duplicate cuisine
INSERT INTO Cuisines (cname)
VALUES ('Western');


-- Restaurants
INSERT INTO Restaurants (rname, cname)
VALUES ('KFC', 'Western');

INSERT INTO Restaurants (rname, cname)
VALUES ('MacDonalds', 'Western');

-- Restaurants: should fail, duplicate rname
INSERT INTO Restaurants (rname, cname)
VALUES ('KFC', 'Chinese');

-- Restaurants: should fail, cname does not exist
INSERT INTO Restaurants (rname, cname)
VALUES ('efgh', 'abcd');


-- Owners
INSERT INTO Owners (username, rname)
VALUES ('ShouTeckOwner', 'KFC');

-- Owners: should fail, does not exist in Users
INSERT INTO Owners (username, rname)
VALUES ('abcd', 'KFC');

-- Owners: should fail, does not exist in Restaurants
INSERT INTO Owners (username, rname)
VALUES ('NianFeiOwner', 'abcd');

-- Owners: should fail, duplicate rname, trigger
INSERT INTO Owners (username, rname)
VALUES ('NianFeiOwner', 'KFC');

-- Owners: should fail, non-overlap with diners, trigger
INSERT INTO Owners (username, rname)
VALUES ('ShouTeckDiner', 'MacDonalds');


-- Food
INSERT INTO Food (fname, cname)
VALUES ('Zinger', 'Western');

INSERT INTO Food (fname, cname)
VALUES ('Big Mac', 'Western');

INSERT INTO Food (fname, cname)
VALUES ('Noodles', 'Chinese');

-- Food: should fail, duplicate fname
INSERT INTO Food (fname, cname)
VALUES ('Noodles', 'Western');

-- Food: should fail, does not exist in Cuisines
INSERT INTO Food (fname, cname)
VALUES ('efgh', 'abcd');


-- RestaurantAreas
INSERT INTO RestaurantAreas (rname, aname, address, startTime, endTime)
VALUES ('MacDonalds', 'Orchard', '1 Scotts Road Singapore 228208', '09:00', '21:00');

INSERT INTO RestaurantAreas (rname, aname, address, startTime, endTime)
VALUES ('KFC', 'Orchard', '2 Scotts Road Singapore 228208', '09:00', '20:00');

INSERT INTO RestaurantAreas (rname, aname, address, startTime, endTime)
VALUES ('KFC', 'Raffles Place', '1 Travis Road Singapore 229209', '08:00', '21:00');

-- RestaurantAreas: should fail, does not exist in Restaurants
INSERT INTO RestaurantAreas (rname, aname, address, startTime, endTime)
VALUES ('abcd', 'Raffles Place', '1 Travis Road Singapore 229209', '09:00', '21:00');

-- RestaurantAreas: should fail, duplicate (rname, aname)
INSERT INTO RestaurantAreas (rname, aname, address, startTime, endTime)
VALUES ('KFC', 'Raffles Place', '3 Travis Road Singapore 229209', '09:00', '21:00');

-- RestaurantAreas: should fail, invalid time
INSERT INTO RestaurantAreas (rname, aname, address, startTime, endTime)
VALUES ('KFC', 'Raffles Place', '3 Travis Road Singapore 229209', '21:00', '09:00');

-- Sells
INSERT INTO Sells (rname, fname, price)
VALUES ('MacDonalds', 'Big Mac', 10);

INSERT INTO Sells (rname, fname, price)
VALUES ('KFC', 'Zinger', 5);

INSERT INTO Sells (rname, fname, price)
VALUES ('MacDonalds', 'Zinger', 6);

-- Sells: should fail, does not exist in Restaurants
INSERT INTO Sells (rname, fname, price)
VALUES ('abcd', 'Noodles', 6);

-- Sells: should fail, does not exist in Food
INSERT INTO Sells (rname, fname, price)
VALUES ('KFC', 'abcd', 6);

-- Sells: should fail, mismatch in restaurant and food cuisine, trigger
INSERT INTO Sells (rname, fname, price)
VALUES ('MacDonalds', 'Noodles', 8);


-- Reserves
INSERT INTO Reserves (reid, rname, aname, username, numPax, confirmed, amount, dateTime) 
VALUES (101, 'MacDonalds', 'Orchard', 'ShouTeckDiner', 10, false, 0.00, '2019-04-07 13:10:11');

-- Reserves: should fail, does not exist in Restaurants
INSERT INTO Reserves (reid, rname, aname, username, numPax, confirmed, amount, dateTime) 
VALUES (102, 'abcd', 'Orchard', 'ShouTeckDiner', 10, false, 0.00, '2019-04-07 13:10:11');

-- Reserves: should fail, does not exist in RestaurantAreas
INSERT INTO Reserves (reid, rname, aname, username, numPax, confirmed, amount, dateTime) 
VALUES (102, 'MacDonalds', 'Raffles Place', 'ShouTeckDiner', 10, false, 0.00, '2019-04-07 13:10:11');

-- Reserves: should fail, does not exist in Diners
INSERT INTO Reserves (reid, rname, aname, username, numPax, confirmed, amount, dateTime) 
VALUES (102, 'MacDonalds', 'Orchard', 'ShouTeckOwner', 10, false, 0.00, '2019-04-07 13:10:11');

-- Reserves: should fail, times too close, trigger
INSERT INTO Reserves (reid, rname, aname, username, numPax, confirmed, amount, dateTime) 
VALUES (102, 'KFC', 'Orchard', 'ShouTeckDiner', 10, false, 0.00, '2019-04-07 13:10:11');


-- Rates 
INSERT INTO Rates (raid, rname, aname, username, comment, score)
VALUES (101, 'KFC', 'Orchard', 'ShouTeckDiner', '10/10', 10);

-- Rates: should fail, does not exist in Restaurants
INSERT INTO Rates (raid, rname, aname, username, comment, score)
VALUES (102, 'abcd', 'Orchard', 'ShouTeckDiner', '5/10', 5);

-- Rates: should fail, does not exist in RestaurantAreas
INSERT INTO Rates (raid, rname, aname, username, comment, score)
VALUES (102, 'MacDonalds', 'Raffles Place', 'ShouTeckDiner', '5/10', 5);

-- Rates: should fail, does not exist in Diners
INSERT INTO Rates (raid, rname, aname, username, comment, score)
VALUES (102, 'KFC', 'Orchard', 'ShouTeckOwner', '5/10', 5);

-- Rates: should fail, score not in range
INSERT INTO Rates (raid, rname, aname, username, comment, score)
VALUES (102, 'MacDonalds', 'Orchard', 'ShouTeckDiner', '11/10', 11);


-- RestaurantPromos
INSERT INTO RestaurantPromos (rname, discount, startDate, endDate)
VALUES ('KFC', 10, '2019-04-05', '2019-05-05');

-- RestaurantPromos: should fail, does not exist in Restaurants
INSERT INTO RestaurantPromos (rname, discount, startDate, endDate)
VALUES ('abcd', 10, '2019-04-05', '2019-05-05');

-- RestaurantPromos: should fail, discount out of range
INSERT INTO RestaurantPromos (rname, discount, startDate, endDate)
VALUES ('MacDonalds', 101, '2019-04-05', '2019-05-05');

-- RestaurantPromos: should fail, invalid start and end dates
INSERT INTO RestaurantPromos (rname, discount, startDate, endDate)
VALUES ('MacDonalds', 10, '2019-05-05', '2019-04-05');
