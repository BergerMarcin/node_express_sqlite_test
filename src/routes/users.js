var express = require('express');
var router = express.Router();
const {getAllRows} = require('../db/db_controller')


/**
 * Get and show all users
 */
router.get('/', async function (req, res) {
  console.log(`ROUTER user controller START *************** get all users, path '/users'`)
  await getAllRows('users')
    .then((users) => {
      console.log(users);
      res.render('users', {title: 'Users', users})
      console.log(`ROUTER controller END ***************`)
    })
    .catch((err) => {
        console.log(err);
        res.render('users', {title: 'Users', users: null, err})
      console.log(`ROUTER controller END ***************`)
      }
    )
});

module.exports = router;
