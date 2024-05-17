const express = require("express");
const Item = require("./item");
const itemRouter = new express.Router();

/* 
    get a list of shopping items from global items
*/
itemRouter.get("/", function(req, res, next) {
    try {
        return res.json({ items: Item.findAll()});
    }
    catch(err) {
        return next(err);
    }
});

itemRouter.post("/", function(req, res, next) {
    try {
        let newItem = new Item(req.body.name, req.body.price);
        return res.json({"added" : {item: newItem} });
    }
    catch(err) {
        return next(err);
    }
});

itemRouter.get("/:name", function(req, res, next) {
    try {
        return res.json({item: Item.find(req.params.name)});
    }
    catch(err) {
        return next(err);
    }
});

itemRouter.patch("/:name", function(req, res, next) {
    try {
        let updatedItem = Item.update(req.params.name, req.body);
        return res.json({"updated": {
            "name": updatedItem.name,
            "price": updatedItem.price,
        }});
    }
    catch(err) {
        return next(err);
    }
});

itemRouter.delete("/:name", function(req, res, next) {
    try {
        Item.delete(req.params.name);
        return res.json({"message": "deleted"})
    }
    catch(err) {
        return next(err);
    }
})

module.exports = itemRouter;