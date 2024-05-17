process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app");
let items = require("./fakeDb");

let sampleItem = {name: "strawberry", price: "1.50"};

beforeEach(function() {
    items.push(sampleItem);
});

afterEach(function() {
    items.length = 0;
})

describe("GET and POST /items", function() {
    test("return a list of items", async function() {
        const response = await request(app).get("/items");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({"items": [{"name": "strawberry", "price": "1.50"}]});
    });

    test("add a new item to items", async function() {
        const response = await request(app)
        .post("/items")
        .send({
            name: "watermelon",
            price: "3.00"
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({"added": {"item": {"name": "watermelon", "price": "3.00"}}});

        const newResp = await request(app).get("/items");
        expect(newResp.statusCode).toBe(200);
        expect(newResp.body).toEqual({"items": [{"name": "strawberry", "price": "1.50"}, {"name": "watermelon", "price": "3.00"}]});
    });

    test("find item by name", async function() {
        const resp = await request(app).get("/items/strawberry");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"item": {"name": "strawberry", "price": "1.50"}});
    });
});

describe("patch for /items/strawberry", function() {
    test("changing price for strawberry", async function() {
        const resp = await request(app)
        .patch("/items/strawberry")
        .send({
            name: "strawberry",
            price: "123.00"
        });

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"updated": {"name": "strawberry", "price": "123.00"}})
    });
});

describe("delete for /items/:name", function() {
    test("delete strawberry", async function() {
        const resp = await request(app)
        .delete("/items/strawberry");

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"message": "deleted"});

        const resp2 = await request(app)
        .get("/items");

        expect(resp2.statusCode).toBe(200);
        expect(resp2.body).toEqual({"items": []});
    });
});

