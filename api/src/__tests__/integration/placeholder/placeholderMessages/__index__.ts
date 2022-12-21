import initializeApp from '../../../../app.js';

import getRouteSpec from './get.route.js';

const app = initializeApp();
const baseEndpoint = "/placeholder/messages";

export default () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("get route", () => {
        getRouteSpec(baseEndpoint, app);
    });
};