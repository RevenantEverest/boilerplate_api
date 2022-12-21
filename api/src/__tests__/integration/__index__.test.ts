import AppDataSource from '../../db/dataSource.js';
import { connectToTestingDatabase } from '../support/database.support.js';
import { DB_TIMEOUT } from '../support/constants/database.js';

import placeholderTests from './placeholder/__index__.js';

describe("Integration Tests", () => {
    beforeAll(async () => {
        await connectToTestingDatabase();
    }, DB_TIMEOUT);

    afterAll(() => {
        AppDataSource.destroy();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("placeholder routes", placeholderTests);
});