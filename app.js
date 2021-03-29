
const express = require("express");
const bodyParser = require("body-parser");
const todoDB = require(__dirname + '/dbs/TodoDB');
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));







app.get("/", function (req, res) {

    todoDB.Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            todoDB.Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully savevd default items to DB.");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }
    });

});

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    todoDB.List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                //Create a new list
                todoDB.newList(customListName)
                res.redirect("/" + customListName);
            } else {
                //Show an existing list

                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        }
    });



});

app.post("/", function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    todoDB.newItem(listName, itemName)

    if (listName === "Today")
        res.redirect("/");
    else
        res.redirect("/" + listName);
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    todoDB.deleteItemById(listName, checkedItemId)
    if (listName == "Today") {
        res.redirect("/");
    }
    else {
        res.redirect("/" + listName);
    }

});


app.listen(3000, function () {
    console.log("Server started on port 3000");
});
