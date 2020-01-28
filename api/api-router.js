const router = require("express").Router();

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");

router.use("/auth", authRouter);
router.use("/users", usersRouter);

router.get("/", (req, res) => {
	res.json({ api: "It's alive" });
});

router.get("/logout", (req, res) => {
	req.session.destroy();
	res.status(200).json({ message: "bye bye" });
});

module.exports = router;
