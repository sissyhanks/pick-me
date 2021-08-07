const router = require('express').Router();
const { User } = require('../../models');
// const session = require('express-session');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

router.post('/', async (req, res) => {
  try {
    const dbUserData = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.loggedIn = true;

      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if(!dbUserData) {
      res
        .status(400)
        .json({message: 'Are you sure you\'ve been picked before?' });
      return;
    }

    req.session.save(() => {
      req.session.loggedIn = true;

      res .status(200)
        .status(200)
        .json({ user: dbUserData, message: 'you\'ve been picked!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
      console.log("you're out");
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
