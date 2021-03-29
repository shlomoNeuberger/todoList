const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });
const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const listSchema = {
    name: String,
    items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

exports.Item = Item
exports.List = List
exports.defaultItems = defaultItems
exports.DeleteItemById = (id) => {

}

exports.newList = (customListName) => {
    const list = new List({
        name: customListName,
        items: defaultItems
    });
    list.save();
}

exports.newItem = (listName, itemName) => {
    const item = new Item({
        name: itemName
    });
    if (listName === "Today") {
        item.save();
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
        });
    }
}

exports.deleteItemById = (listName, checkedItemId) => {

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function (err) { });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) { });
    }
}
