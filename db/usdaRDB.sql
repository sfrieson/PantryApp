\c sfrieson
DROP DATABASE pantryapp;
CREATE DATABASE pantryapp;
\c pantryapp

CREATE TABLE fd_group(
FdGrp_Cd VARCHAR PRIMARY KEY NOT NULL,
FdGrp_Desc VARCHAR NOT NULL);

COPY fd_group FROM '/Users/sfrieson/code/wdi/PantryApp/db/raw_data/sr28asc/FD_GROUP.txt' DELIMITER '^';



CREATE TABLE food_des(
NDB_No VARCHAR PRIMARY KEY NOT NULL,
FdGrp_Cd VARCHAR NOT NULL REFERENCES fd_group(FdGrp_Cd),
Long_Desc VARCHAR NOT NULL,
Shrt_Desc VARCHAR NOT NULL,
ComName VARCHAR,
ManufacName VARCHAR,
Survey VARCHAR,
Ref_desc VARCHAR,
Refuse INT,
SciName VARCHAR,
N_Factor DECIMAL,
Pro_Factor DECIMAL,
Fat_Factor DECIMAL,
CHO_Factor DECIMAL);

COPY food_des FROM '/Users/sfrieson/code/wdi/PantryApp/db/raw_data/sr28asc/FOOD_DES.txt' DELIMITER '^';



CREATE TABLE nutr_def(
Nutr_No VARCHAR NOT NULL PRIMARY KEY,
Units VARCHAR NOT NULL,
Tagname VARCHAR,
NutrDesc VARCHAR NOT NULL,
Num_Dec VARCHAR NOT NULL,
SR_Order VARCHAR NOT NULL
);

COPY nutr_def FROM '/Users/sfrieson/code/wdi/PantryApp/db/raw_data/sr28asc/NUTR_DEF.txt' DELIMITER '^';



CREATE TABLE nutr_data(
NDB_NO VARCHAR NOT NULL REFERENCES food_des(NDB_No),
Nutr_No VARCHAR NOT NULL REFERENCES nutr_def(Nutr_No),
Nutr_Val DECIMAL NOT NULL,
Num_Data_Pts DECIMAL NOT NULL,
Std_Error DECIMAL,
Src_Cd VARCHAR NOT NULL,
Deriv_Cd VARCHAR,
Ref_NDB_No VARCHAR,
Add_Nutr_Mark VARCHAR,
Num_Studies INTEGER,
Min DECIMAL,
Max DECIMAL,
DF INTEGER,
Low_EB DECIMAL,
Up_EB DECIMAL,
Stat_cmt VARCHAR,
AddMod_Date VARCHAR,
CC VARCHAR
);

COPY nutr_data FROM '/Users/sfrieson/code/wdi/PantryApp/db/raw_data/sr28asc/NUT_DATA.TXT' DELIMITER '^';


CREATE TABLE weight(
NDB_No VARCHAR NOT NULL REFERENCES food_des(NDB_No),
Seq VARCHAR NOT NULL,
Amount DECIMAL NOT NULL,
Msre_Desc VARCHAR NOT NULL,
Gm_Wgt DECIMAL NOT NULL,
Num_Data_Pts INTEGER,
Std_Dev DECIMAL
);

COPY weight FROM '/Users/sfrieson/code/wdi/PantryApp/db/raw_data/sr28asc/WEIGHT.TXT' DELIMITER '^';


CREATE TABLE footnote(
NDB_No VARCHAR NOT NULL REFERENCES food_des(NDB_No),
Footnt_No VARCHAR NOT NULL,
Footnt_Typ VARCHAR NOT NULL,
Nutr_No VARCHAR,
Footnt_Txt VARCHAR NOT NULL
);

COPY footnote FROM '/Users/sfrieson/code/wdi/PantryApp/db/raw_data/sr28asc/FOOTNOTE.TXT' DELIMITER '^';
