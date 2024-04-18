const nedb = require("gray-nedb");

class Food {
  constructor(dbFilePath) {
    if (dbFilePath) {
      this.db = new nedb({ filename: dbFilePath, autoload: true });
      console.log("DB connected to " + dbFilePath);
    } else {
      this.db = new nedb();
    }
  }

  init() {
    this.db.insert({
      foodname: "Apples",
      description: "mostly red",
      quantity: "7kg",
      expiry: "20/4/24",
    });
    console.log("apples inserted");

    this.db.insert({
      foodname: "Various carbs",
      description: "mostly bread",
      quantity: "8kg",
      expiry: "25/4/24",
    });
    console.log("carbs inserted");
  }
  getAllfoods() {
    return new Promise((resolve, reject) => {
      this.db.find({}, function (err, foods) {
        if (err) {
          reject(err);
        } else {
          resolve(foods);
          console.log("function all() returns: ", foods);
        }
      });
    });
  }
  getApples() {
    return new Promise((resolve, reject) => {
      this.db.find({ foodname: "Apples" }, function (err, food) {
        if (err) {
          reject(err);
        } else {
          resolve(food);
          console.log("return ", food);
        }
      });
    });
  }

  addFood(foodname, description, quantity, expiry, donatorname) {
    var food = {
      foodname: foodname,
      description: description,
      quantity: quantity,
      expiry: expiry,
      donatorname: donatorname,
    };
    console.log("food added", food);
    this.db.insert(food, function (err, doc) {
      if (err) {
        console.log("Error inserting document", subject); //remove these when finished
      } else {
        console.log("docuemnt inserted into the database"); //remove these when finished
      }
    });
  }

  getFoodsByDonator(donatorname) {
    return new Promise((resolve, reject) => {
      this.db.find({ donatorname: donatorname }, function (err, foods) {
        if (err) {
          reject(err);
        } else {
          resolve(entries);
          console.log("getFoodsByDonator returns: ", foods);
        }
      });
    });
  }
}

module.exports = Food;
