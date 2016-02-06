CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30),
    passwordhash VARCHAR,
    type VARCHAR(16), --maybe PK referencing a table for each. user, team
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
    --priviledge --Admin, team leader, user
);

CREATE TABLE lists (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    type VARCHAR(24), --maybe PK referencing a table for each. Inventory, grocery list
    name VARCHAR(24),
    description TEXT,
    category VARCHAR(24),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE list_items (
    id SERIAL PRIMARY KEY,
    list_id REFERENCES lists(id) ON DELETE CASCADE,
    food_des REFERENCES food_des(nbd_no),
    status VARCHAR(10),
    qty NUMERIC,
    category VARCHAR(24),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);



-- -------------------------------------------------------------------------------
-- http://stackoverflow.com/questions/9789736/how-to-implement-a-many-to-many-relationship-in-postgresql
-- Detailed comments on the SO post.
--
--
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
