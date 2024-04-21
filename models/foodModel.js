const nedb = require("gray-nedb");
let today = new Date().toISOString().split("T")[0];
today = today.replace(/-/g, "");
parseInt(today);

function formatDate(inputDate) {
  const year = inputDate.substring(0, 4);
  const month = inputDate.substring(4, 6);
  const day = inputDate.substring(6, 8);
  console.log("here is the thing " + `${day}/${month}/${year}`);
  return `${day}/${month}/${year}`;
}

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
      expiry: "1415299200000",
    });
    console.log("apples inserted");

    this.db.insert({
      foodname: "Various carbs",
      description: "mostly bread",
      quantity: "8kg",
      expiry: "1715299206000",
    });

    this.db.insert({
      foodname: "Various carbs4",
      description: "mostly bread",
      quantity: "8kg",
      expiry: "1715299200000",
    });

    console.log("carbs inserted");
    console.log(today);
  }
  getAllfoods() {
    return new Promise((resolve, reject) => {
      this.db.find({ expiry: { $gte: today } }, function (err, foods) {
        if (err) {
          reject(err);
        }
        if (!foods) {
          resolve(foods);
        } else {
          for (let i = 0; i < foods.length; i++) {
            foods[i].expiry = formatDate(foods[i].expiry);
          }
          resolve(foods);
          console.log("function all() returns: ", foods);
        }
      });
    });
  }

  addFood(foodname, description, quantity, expiry, donatorname) {
    var newExpiry = expiry.replace(/-/g, "");
    parseInt(newExpiry);
    var id = "id" + new Date().getTime();
    var food = {
      id: id,
      foodname: foodname,
      description: description,
      quantity: quantity,
      expiry: newExpiry,
      donatorname: donatorname,
    };
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
          resolve(foods);
          console.log("getFoodsByDonator returns: ", foods);
        }
      });
    });
  }

  getFoodsById(id) {
    return new Promise((resolve, reject) => {
      this.db.find({ id: id }, function (err, foods) {
        if (err) {
          reject(err);
        }
        resolve(foods);
        console.log("function all() returns: ", foods);
      });
    });
  }

  DeleteFoodById(id) {
    return new Promise((resolve, reject) => {
      this.db.remove({ id: id }, function (err, foods) {
        if (err) {
          reject(err);
        }
        resolve(foods);
        console.log("function all() returns: ", foods);
      });
    });
  }
}

module.exports = Food;
