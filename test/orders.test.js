const express = require("express");
const request = require("supertest");
const routes = require("../src/routes/index.js");

const app = express();
app.use(express.json());
app.use("/", routes());

describe("Testeo de endpoints de Ordenes", () => {
    let token;

    beforeAll(async () => {
        // Iniciar sesión para obtener el token
        const loginResponse = await request(app).post("/iniciar_sesion").send({
            email: "usuario1@usuario1.com",
            password: "123456",
        });
        token = loginResponse.body.token;
    });

    it("Debería obtener todas las órdenes de un usuario", async () => {
        const userId = 1;
        const res = await request(app)
            .get(`/orders/${userId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it("Debería volver a ordenar un pedido existente", async () => {
        const orderId = 2;
        const res = await request(app)
            .post(`/orders/reorder/${orderId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Orden creada nuevamente");
        expect(res.body).toHaveProperty("order_id");
    });

    it("Debería devolver error si la orden no existe", async () => {
        const orderId = 9999;
        const res = await request(app)
            .post(`/orders/reorder/${orderId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message", "Error al volver a ordenar");
    });

    afterAll(() => {
        console.log(" Pruebas de órdenes completadas.");
    });
});
//orders.test.js