-- Existing user table
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

-- My List table
CREATE TABLE "my_list" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "user" ("id"),
    "task" VARCHAR (255) NOT NULL,
    "complete" BOOLEAN DEFAULT FALSE
);

-- Group List table
CREATE TABLE "group_list" (
    "id" SERIAL PRIMARY KEY,
    "task" VARCHAR (255) NOT NULL,
    "complete" BOOLEAN DEFAULT FALSE
);

