const Datastore = require("gray-nedb");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserDAO {
  constructor(dbFilePath) {
    if (dbFilePath) {
      this.db = new Datastore({
        filename: dbFilePath,
        autoload: true,
      });
    } else {
      this.db = new Datastore();
    }
  }

  init() {
    this.db.insert({
      user: "Admin",
      password: "$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C", //Peter
      role: "admin",
    });
    this.db.insert({
      user: "Pantry",
      password: "$2b$10$bnEYkqZM.MhEF/LycycymOeVwkQONq8kuAUGx6G5tF9UtUcaYDs3S", //Ann
      role: "pantry",
    });

    return this;
  }

  create(username, password, role) {
    const that = this;
    bcrypt.hash(password, saltRounds).then(function (hash) {
      var entry = {
        user: username,
        password: hash,
        role: role,
      };
      that.db.insert(entry, function (err) {
        if (err) {
          console.log("Can't insert user: ", username);
        }
      });
    });
  }
  lookup(user, cb) {
    this.db.find({ user: user }, function (err, entries) {
      if (err) {
        return cb(null, null);
      } else {
        if (entries.length == 0) {
          return cb(null, null);
        }
        return cb(null, entries[0]);
      }
    });
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
      this.db.find({}, function (err, users) {
        if (err) {
          reject(err);
        } else {
          resolve(users);
          console.log("funciton getAllUsers() returns: ", users); //get rid of all console.log when done.
        }
      });
    });
  }

  getUserByName(user) {
    return new Promise((resolve, reject) => {
      this.db.find({ user: user }, function (err, users) {
        if (err) {
          reject(err);
        }
        resolve(users);
        console.log("function all() returns: ", users);
      });
    });
  }

  DeleteUserByName(user) {
    return new Promise((resolve, reject) => {
      this.db.remove({ user: user }, function (err, foods) {
        if (err) {
          reject(err);
        }
        resolve(foods);
        console.log("function all() returns: ", foods);
      });
    });
  }
}

const dao = new UserDAO();
dao.init();
module.exports = dao;
