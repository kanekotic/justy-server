import sqlDatabase from '../../src/dataSources/SqlDatabase'
import * as faker from "faker"

describe('sqlDatabase', () => {
    const config = {
        client: "sqlite3",
        connection: {
            filename: ":memory:"
        }
    }
    let subject = new sqlDatabase(config)
    beforeAll(async () => {
        await subject.db.schema.createTable('BUYERS', (table) => {
            table.string("id", 36).notNullable().primary()
            table.string("email", 256).notNullable().unique()
            table.string("password", 60).notNullable()
          })
    })

    afterAll(() => {
        subject.db.destroy()
    })

    describe('generates buyer correctly', () => {
        let buyerPassword: string = faker.internet.password()
        let buyerEmail: string = faker.internet.email()
        test('should create a user correctly', async () => {
            await subject.createBuyer(buyerEmail, buyerPassword)
            const result = await getBuyerbyEmail(buyerEmail)
            expect(result).not.toBeUndefined()
            expect(result.email).toEqual(buyerEmail)
            expect(result.password).toEqual(buyerPassword)
        });
    })

    const getBuyerbyEmail = async (email: String): Promise<any> => {
        const queryResult = (await subject.db
            .select('*')
            .from('BUYERS')
            .where({ email }))[0]
        return queryResult
    }

})