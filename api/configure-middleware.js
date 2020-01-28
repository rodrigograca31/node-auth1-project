const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

module.exports = server => {
	server.use(helmet());
	server.use(express.json()); // "body-parser"
	server.use(cookieParser()); // "cookie-parser"
	server.use(cors());
	server.use(
		session({
			name: "session_cookie",
			secret: "secret key to encrypt",
			cookie: {
				maxAge: 1000 * 60,
				secure: false, // https only?
				httpOnly: false // can we get it from JS?
			},
			resave: false,
			saveUninitialized: true, // gdpr
			store: new KnexSessionStore({
				knex: require("../database/dbConfig.js"), // configured instance of knex
				tablename: "sessions", // table that will store sessions inside the db, name it anything you want
				sidfieldname: "sid", // column that will hold the session id, name it anything you want
				createtable: true, // if the table does not exist, it will create it automatically
				clearInterval: 1000 * 60 // time it takes to check for old sessions and remove them from the database to keep it clean and performant
			})
		})
	);
};
