SELECT * FROM food_des WHERE ndb_no like '~16114~';

-- FIND LIST ITEM AND food_des INFO BASED ON ndb_no
SELECT * FROM list_items INNER JOIN food_des USING (ndb_no) WHERE ndb_no LIKE '~16114~';

-- FIND LIST ITEM AND NUT_DATA BASED ON ndb_no
SELECT * FROM list_items INNER JOIN food_des USING (ndb_no) INNER JOIN nutr_data USING (ndb_no) WHERE ndb_no LIKE '~16114~';


-- FIND LIST ITEM AND NUT_DATA WITH INFORMATION on nbd_no AND Nutr_No
SELECT * FROM list_items INNER JOIN food_des USING (ndb_no) INNER JOIN nutr_data USING (ndb_no) INNER JOIN nutr_def USING (nutr_no) WHERE ndb_no LIKE '~16114~';
-- can be more specific about what columns i want
