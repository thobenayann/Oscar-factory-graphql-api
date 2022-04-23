BEGIN;

DROP TABLE IF EXISTS "user",
"movie",
"category",
"movie_has_category",
"review",
"favorite";

CREATE TABLE "user" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "movie" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "release_year" INT NOT NULL,
    "imdb_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "category" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "label" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "movie_has_category" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "movie_id" INT NOT NULL REFERENCES "movie" ("id") ON DELETE CASCADE,
    "category_id" INT NOT NULL REFERENCES "category" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE("movie_id", "category_id")
);

CREATE TABLE "review" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "movie_id" INT NOT NULL REFERENCES "movie" ("id") ON DELETE CASCADE,
    "rating" INT NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE("user_id", "movie_id")
);

COMMIT;
