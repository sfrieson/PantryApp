CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30),
    passwordhash VARCHAR,
    team_id INTEGER, --If there is an id, it's a user.  If there isn't. it's a team.
    type VARCHAR(12), --Admin, team leader, user, team
    token VARCHAR(256),

    created_at BIGINT,
    updated_at BIGINT
);
ALTER TABLE accounts ADD CONSTRAINT fk_team_account FOREIGN KEY (team_id) REFERENCES accounts(id);


CREATE TABLE lists (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE NOT NULL, --Creator of list
    team_id INTEGER REFERENCES accounts(id), --null if private list. value if team list
    name VARCHAR(30),
    description TEXT,
    type VARCHAR(24), --inventory or list
    -- category VARCHAR(24),

    created_at BIGINT,
    updated_at BIGINT
);

CREATE TABLE list_items (
    id SERIAL PRIMARY KEY,
    list_id INTEGER REFERENCES lists(id) ON DELETE CASCADE,
    name VARCHAR(30), -- may be same as food_des
    notes TEXT, -- notes for user
    food_des VARCHAR REFERENCES food_des(nbd_no),
    status VARCHAR(16), --'still needed', 'in basket', 'not important', 'in inventory'
    qty NUMERIC, --number needed
    category VARCHAR(30), --where in the store: dairy, meat, appliance

    created_at BIGINT,
    updated_at BIGINT
);



-- -------------------------------------------------------------------------------
-- http://stackoverflow.com/questions/9789736/how-to-implement-a-many-to-many-relationship-in-postgresql
-- Detailed comments on the SO post.
--
--
-- pantryapp=# select * from food_des Where long_desc ilike '%$1%' and long_desc ilike '%oil%';
-- CREATE TABLE product (
--   product_id serial PRIMARY KEY  -- implicit primary key constraint
-- , product    text NOT NULL
-- , price      numeric NOT NULL DEFAULT 0
-- );
--
-- CREATE TABLE bill (
--   bill_id  serial PRIMARY KEY
-- , bill     text NOT NULL
-- , billdate date NOT NULL DEFAULT now()::date
-- );
--
-- CREATE TABLE bill_product (
--   bill_id    int REFERENCES bill (bill_id) ON UPDATE CASCADE ON DELETE CASCADE
-- , product_id int REFERENCES product (product_id) ON UPDATE CASCADE
-- , amount     numeric NOT NULL DEFAULT 1
--   -- explicit pk
-- , CONSTRAINT bill_product_pkey PRIMARY KEY (bill_id, product_id)
-- );
--
-- -------------------------------------------------------------------------------


-- -- In-table heirarchy (NOT PSQL)
-- create table Employees (
--  EmployeeID int identity primary key,
--  EmployeeName varchar(50),
--  ManagerID int
-- );
--
-- ALTER TABLE Employees ADD Constraint fk_Manager_Employee Foreign key (managerID) references Employees(EmployeeID);
