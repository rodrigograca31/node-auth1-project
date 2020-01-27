const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model.js");
const uuid = require("uuid");

const activeSessions = [];

router.post("/register", (req, res) => {
	req.body.password = bcrypt.hashSync(req.body.password, 10);

	Users.add({ username: req.body.username, password: req.body.password })
		.then(saved => {
			res.status(201).json(saved);
		})
		.catch(error => {
			res.status(500).json(error);
		});
});

router.post("/login", (req, res) => {
	Users.findBy({ username: req.body.username })
		.first()
		.then(user => {
			console.log("found", user);
			if (user && bcrypt.compareSync(req.body.password, user.password)) {
				const sessionId = uuid();
				activeSessions.push(sessionId);

				res.cookie("sessionId", sessionId, { maxAge: 900000 });
				res.status(200).json({ message: "Welcome" });
			} else {
				res.status(200).json({
					message: "Username not found or wrong password"
				});
			}
		})
		.catch(error => {
			res.status(500).json({ error: error.message });
		});
});

function protected(req, res, next) {
	if (activeSessions.includes(req.cookies.sessionId)) {
		next();
	} else {
		res.status(401).json({ message: "Not valid" });
	}
}

router.protected = protected;

module.exports = router;
