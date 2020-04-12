const mongoCollections = require("../config/mongoCollections");
const lessons = mongoCollections.lessons;
const ObjectID = require("mongodb").ObjectID;
const ERRORS = require("./common").ERRORS;

// TODO: all checks must be improved
function checkId(id) {
    if (!id) throw "You must provide an id to search for";
}

function checkTitle(title) {
    if (!title) throw "You must provide an title";
}

function checkEmail(email) {
    if (!email) throw "You must provide an email";
}

function checkPassword(password) {
    if (!password) throw "You must input a password";
    // TODO: Check based on password criteria (min 5 chars, etc.)
}

/**
 * Lesson = {
 *    _id: string
 *    title: string
 *    subject: string
 *    difficulty: string
 *    questions: array
 *    badges: array
 * }
 */
module.exports = {
    /**
     *
     * @param {string} title
     * @param {string} subject
     * @param {number} difficulty
     */
    async addLesson(title, subject, difficulty, questions, badges) {
        checkTitle(title);
        checkEmail(subject);
        checkPassword(difficulty);
        // TODO
        // checkQuestions(questions)
        // checkBadges(badges)
        const lessonCollection = await lessons();

        const newUser = {
            name: title,
            email: subject,
            password: difficulty, // TODO: hash and salt the password
        };

        const insertInfo = await lessonCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw ERRORS.NOMODIFY;

        return insertInfo.insertedId;
    },

    /**
     *
     */
    async getAllUsers() {
        const userCollection = await lessons();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    /**
     *
     * @param {string} id
     */
    async getUser(id) {
        checkId(id);
        const userCollection = await lessons();
        const user = await userCollection.findOne({ _id: new ObjectID(id) });
        if (user === null) throw ERRORS.NOEXIST;

        return user;
    },

    /**
     *
     * @param {string} id
     * @param {{}} options
     */
    async updateUser(id, options = {}) {
        checkId(id);
        // TODO: check the options object

        const userCollection = await lessons();
        let originalUser = await this.getUser(id);

        const updateAlbum = {};

        if (options.name) {
            updateAlbum.name = options.name;
        } else {
            updateAlbum.name = originalUser.name;
        }

        const updatedInfo = await userCollection.updateOne(
            { _id: new ObjectID(id) },
            {
                $set: { name: updateAlbum.name },
                // TODO: update this query
            }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw ERRORS.NOMODIFY;
        }

        return await this.getUser(id);
    },

    async removeUser(id) {
        checkId(id);

        const user = await this.getUser(id);

        const userCollection = await lessons();

        const deletionInfo = await userCollection.deleteOne({
            _id: new ObjectID(id),
        });
        if (deletionInfo.deletedCount === 0) {
            throw ERRORS.NOMODIFY;
        }

        return user;
    },
};
