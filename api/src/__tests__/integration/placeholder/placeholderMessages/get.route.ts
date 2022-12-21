import supertest from 'supertest';
import { Application } from 'express';

function getRoute(baseEndpoint: string, app: Application) {
    describe("given the index endpoint", () => {
        it("should return a 200 status and the placeholder message", async () => {
            const { body, statusCode } = await supertest(app)
            .get(baseEndpoint)
            .send()

            expect(statusCode).toBe(200);
            expect(body.message).toBe("Placeholder Content");

        });
    });
};

export default getRoute;