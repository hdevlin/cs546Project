const connection = require('../config/mongoConnection')

/* Populate the database with samples */
async function main() {
    const db = await connection()

    // drop exisiting db
    db.dropDatabase()

    // add sample lessons from json
    // add sample questions from json
    // add sample badges from json
    // add sample users from json

	await db.serverConfig.close()
}

main()