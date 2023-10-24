CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR,
    "password" VARCHAR,
    "approved" BOOLEAN
);

CREATE TABLE "groups" (
    "id" SERIAL PRIMARY KEY,
    "group_name" VARCHAR (100),
    "creator_id" INTEGER REFERENCES "user"("id")
);

CREATE TABLE "group_list" (
    "id" SERIAL PRIMARY KEY,
    "group_id" INTEGER REFERENCES "groups"("id"),
    "user_id" INTEGER REFERENCES "user"("id"),
    "task" VARCHAR,
    "complete" BOOLEAN DEFAULT false
);

CREATE TABLE "my_list" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "user"("id"),
    "task" VARCHAR (2000) ,
    "complete" BOOLEAN DEFAULT false
);

CREATE TABLE "user_groups" (
  "id" SERIAL PRIMARY KEY,
  "group_id" INTEGER REFERENCES "groups"("id"),
  "user_id" INTEGER REFERENCES "user"("id"),
  "admin" BOOLEAN DEFAULT FALSE
);

