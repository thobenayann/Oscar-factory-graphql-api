/**
 * Ce fichier à pour but d'insérer en BDD des données de films, d'utilisateurs, de catégories de
 * film et de critiques. Les données de films sont récupérées de l'API omdb si aucun fichier
 * seeding.json n'est présent dans le même répertoire. Pensez à indiquer votre clé d'API dans le
 * .env avant d'exécuter ce fichier s'il n'y a pas de fichier seeding.json.
 *
 * L'exécution de ce script est présente dans le script resetDB et initDB
 */
 const fs = require('fs').promises;
 const path = require('path');
 
 require('dotenv').config();
 const faker = require('faker');
 const axios = require('axios');
 const debug = require('debug')('seeding');
 
 const db = require('../app/db/pg');
 
 const OMDB_ENDPOINT = 'https://www.omdbapi.com';
 const SEARCH_TERM = 'blade runner';
 const NB_USERS = 100;
 
 faker.locale = 'fr';
 
 async function exists(filepath) {
     try {
         await fs.access(filepath);
         return true;
     } catch {
         return false;
     }
 }
 
 async function generateMovies(filename) {
     const searchPromises = [];
     const detailsPromises = [];
     const firstUrl = `${OMDB_ENDPOINT}/?s=${SEARCH_TERM}&apikey=${process.env.OMDB_API_KEY}`;
     const response = await axios.get(firstUrl);
     debug(firstUrl);
 
     for (let page = 1; page < response.data.totalResults / 10; page += 1) {
         const url = `${OMDB_ENDPOINT}/?s=${SEARCH_TERM}&page=${page}&apikey=${process.env.OMDB_API_KEY}`;
         debug(url);
         const promise = axios.get(url);
         searchPromises.push(promise);
     }
 
     const imdbSearchResponses = await Promise.all(searchPromises);
 
     const imdbSearchMovies = imdbSearchResponses.reduce(
         (movies, res) => [...movies, ...res.data.Search],
         [],
     );
 
     imdbSearchMovies.forEach((movie) => {
         const url = `${OMDB_ENDPOINT}/?i=${movie.imdbID}&apikey=${process.env.OMDB_API_KEY}`;
         debug(url);
         const promise = axios.get(url);
         detailsPromises.push(promise);
     });
 
     const imdbDetailsResponses = await Promise.all(detailsPromises);
 
     const imdbMovies = imdbDetailsResponses.map((res) => res.data);
 
     await fs.writeFile(filename, JSON.stringify(imdbMovies));
 }
 
 async function insertMovies(movies) {
     await db.query('TRUNCATE TABLE "movie" RESTART IDENTITY CASCADE');
     const movieValues = movies.map((movie) => `(
                 '${movie.Poster.replaceAll("'", "''")}',
                 '${movie.Title.replaceAll("'", "''")}',
                 '${movie.Plot.replaceAll("'", "''")}',
                 ${parseInt(movie.Year, 10)},
                 '${movie.imdbID}'
             )`);
 
     const queryStr = `
             INSERT INTO "movie"
             (
                 "image",
                 "title",
                 "description",
                 "release_year",
                 "imdb_id"
             )
             VALUES
             ${movieValues}
             RETURNING id
     `;
     const result = await db.query(queryStr);
     return result.rows;
 }
 
 function generateUsers(nbUsers) {
     const users = [];
     for (let iUser = 0; iUser < nbUsers; iUser += 1) {
         const user = {
             username: faker.internet.userName(),
             email: faker.internet.email(),
             password: faker.internet.password(),
         };
         users.push(user);
     }
     return users;
 }
 
 async function insertUsers(users) {
     await db.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');
     const userValues = users.map((user) => `(
                 '${user.username}',
                 '${user.email}',
                 '${user.password}'
             )`);
 
     const queryStr = `
             INSERT INTO "user"
             (
                 "username",
                 "email",
                 "password"
             )
             VALUES
             (
                 'Yann',
                 'yann@oclock.io',
                 '$2b$10$h4Dh2fRGAf4YdC.Cqg1yleq41QHmG61B76THHCp03SgMEizvZlscy'
             ),-- superpass
             (
                 'Noé',
                 'noe@oclock.io',
                 '$2b$10$h4Dh2fRGAf4YdC.Cqg1yleq41QHmG61B76THHCp03SgMEizvZlscy'
             ), -- superpass
             (
                 'Quentin',
                 'quentin@oclock.io',
                 '$2b$10$h4Dh2fRGAf4YdC.Cqg1yleq41QHmG61B76THHCp03SgMEizvZlscy'
             ), -- superpass
             ${userValues}
             RETURNING id
     `;
     const result = await db.query(queryStr);
     return result.rows;
 }
 
 async function getCategories() {
     const categories = await db.query('SELECT * FROM "category"');
     return categories.rows;
 }
 
 function generateMovieCategories(movieIds, categoryIds) {
     const moviesCategories = movieIds.map((movieId) => {
         const categoryIdsFree = [...categoryIds];
         const movieCategories = [];
         const nbCategories = faker.datatype.number(4) + 1;
         for (let i = 0; i < nbCategories; i += 1) {
             const randomCategoryIndex = faker.datatype.number(categoryIdsFree.length - 1);
             const categoryId = categoryIdsFree.splice(randomCategoryIndex, 1)[0];
             movieCategories.push({
                 movieId,
                 categoryId,
             });
         }
         return movieCategories;
     }).flat();
     return moviesCategories;
 }
 
 async function insertMovieCategories(movieCategories) {
     await db.query('TRUNCATE TABLE "movie_has_category" RESTART IDENTITY CASCADE');
     const categoryValues = movieCategories.map((movieCategory) => (`(
             ${movieCategory.movieId},
             ${movieCategory.categoryId}
         )`));
 
     const queryStr = `
         INSERT INTO "movie_has_category"
         (
             "movie_id",
             "category_id"
         )
         VALUES
         ${categoryValues}
         RETURNING id
     `;
     const result = await db.query(queryStr);
     return result.rows;
 }
 
 function generateReviews(movieIds, userIds) {
     const reviews = movieIds.map((movieId) => {
         const userIdsFree = [...userIds];
         const movieReviews = [];
         const nbReviewers = Math.min(faker.datatype.number(10), userIds.length) + 1;
         for (let i = 0; i < nbReviewers; i += 1) {
             const randomUserIndex = faker.datatype.number(userIdsFree.length - 1);
             const userId = userIdsFree.splice(randomUserIndex, 1)[0];
 
             const rating = faker.datatype.number(4) + 1;
             const content = faker.lorem.paragraph();
             movieReviews.push({
                 userId,
                 movieId,
                 rating,
                 content,
             });
         }
         return movieReviews;
     }).flat();
     return reviews;
 }
 
 async function insertReviews(reviews) {
     await db.query('TRUNCATE TABLE "review" RESTART IDENTITY CASCADE');
     const reviewValues = reviews.map((review) => (`(
             ${review.userId},
             ${review.movieId},
             ${review.rating},
             '${review.content}'
         )`));
 
     const queryStr = `
         INSERT INTO "review"
         (
             "user_id",
             "movie_id",
             "rating",
             "content"
         )
         VALUES
         ${reviewValues}
         RETURNING id
     `;
     const result = await db.query(queryStr);
     return result.rows;
 }
 
 (async () => {
     /**
      * Récupération des films sur OMDB ou le JSON
      */
     const filename = path.resolve(__dirname, './seeding.json');
     const isExists = await exists(filename);
     if (!isExists) {
         debug(`generateMovies file : ${filename}`);
         await generateMovies(filename);
     }
     const movies = JSON.parse(await fs.readFile(filename));
 
     /**
      * Ajout des films dans la BDD
      */
     const insertedMovies = await insertMovies(movies);
     debug(`${insertedMovies.length} movies inserted`);
     const movieIds = insertedMovies.map((movie) => movie.id);
 
     /**
      * Générations d'utilisateurs fake
      * Ajout de ces utilisateurs en BDD
      */
     const users = generateUsers(NB_USERS);
     const insertedUsers = await insertUsers(users);
     debug(`${insertedMovies.length} users inserted`);
     const userIds = insertedUsers.map((user) => user.id);
 
     /**
     * Génération des catégories fake
     * Ajout de ces catégories en BDD
     */
     const categories = await getCategories();
     const categoryIds = categories.map((category) => category.id);
     const movieCategories = generateMovieCategories(movieIds, categoryIds);
     const insertedMovieCategories = await insertMovieCategories(movieCategories);
     debug(`${insertedMovieCategories.length} movies categories inserted`);
 
     /**
      * Génération des critiques fake
      * Ajout de ces critiques en BDD
      */
     const reviews = generateReviews(movieIds, userIds);
     const insertedReviews = await insertReviews(reviews);
     debug(`${insertedReviews.length} reviews inserted`);
 
     db.originalClient.end();
 })();
 