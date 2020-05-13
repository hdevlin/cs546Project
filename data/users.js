const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const lessons = require('./lessons');
const questions = require('./questions');
const { ObjectId } = require('mongodb');
const ERRORS = require("./common").ERRORS;

function checkId(id) {
    if (!id || typeof id != 'string') throw "You must provide an id to search for";
}

function checkName(name) {
    if (!name || typeof name != 'string') throw "You must provide an name";
}

function checkEmail(email) {
    if (!email || typeof email != 'string') throw "You must provide an email";
}

function checkPassword(hashedPassword) {
    if (!hashedPassword || typeof hashedPassword != 'string') throw "You must provide a password hash";
}

/**
 * User = {
 *    _id: string
 *    name: string
 *    email: string
 *    hashedPassword: string
 *    lessons: array
 *    completedLessons: array
 *    completedQuestions: subdocument
 *    badges: array
 * }
 */
module.exports = {
    /**
     * Add a user
     * @param {string} name
     * @param {string} email
     * @param {string[]} hashedPassword
     */
    async addUser(name, email, hashedPassword) {
        checkName(name);
        checkEmail(email);
        checkPassword(hashedPassword);

        const userCollection = await users();

        const newUser = {
            name: name,
            email: email,
            hashedPassword: hashedPassword,
            lessons: [],
            completedLessons: [],
            completedQuestions: {},
            badges: []
        };

        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw ERRORS.NOMODIFY;

        return this.getUser(insertInfo.insertedId.toString());
    },

    /**
     * Get all users as array of objects
     */
    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    /**
     * Get a user by id
     * @param {string} id
     */
    async getUser(id) {
        checkId(id);
        const objId = ObjectId.createFromHexString(id);

        const userCollection = await users();
        const user = await userCollection.findOne({ _id: objId });
        if (user === null) throw ERRORS.NOEXIST;

        return user;
    },

    /* Get a user by email */
    async getUserByEmail(email) {
        checkEmail(email);

        const userCollection = await users();
        const user = await userCollection.findOne({ email: email });
        if (user === null) throw ERRORS.NOEXIST;

        return user;
    },

    /**
     * Update a user by id & options
     * @param {string} id
     * @param {{}} options
     */
    async updateUser(id, options = {}) {
        checkId(id);
        const objId = ObjectId.createFromHexString(id);

        const userCollection = await users();
        let originalUser = await this.getUser(id);

        let updatedUser = {};
        const allOptions = ['name', 'email', 'hashedPassword', 'lessons', 'completedLessons', 'completedQuestions', 'badges']
        for (var i in allOptions) {
            let op = allOptions[i];
            if (options[allOptions[i]]) {
                updatedUser[op] = options[op];
            } else {
                updatedUser[op] = originalUser[op];
            }
        }

        const updatedInfo = await userCollection.updateOne(
            { 
                _id: objId
            },
            {
                $set: updatedUser,
            }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw ERRORS.NOMODIFY;
        }

        return await this.getUser(id);
    },

    /* Update a user with a completed question id */
    async updateCompletedQuestion(id, completedQuestionId) {
        checkId(id);
        checkId(completedQuestionId);
        const objId = ObjectId.createFromHexString(id);

        const userCollection = await users();
        const originalUser = await this.getUser(id);
        const gotQuestion = await questions.getQuestion(completedQuestionId);
        let lessonId = gotQuestion.lesson_id;
        const gotLesson = await lessons.getLesson(lessonId);

        let updatedUser = originalUser;
        updatedUser.completedQuestions[lessonId].push(completedQuestionId);
        if (updatedUser.completedQuestions[lessonId].length == gotLesson.questions.length) {
            // completed lesson
            updatedUser.completedLessons.push(lessonId);
            updatedUser.lessons = updatedUser.lessons.filter((lId) => lId != lessonId);
            delete updatedUser.completedQuestions[lessonId];
        }

        const updatedInfo = await userCollection.updateOne(
            { 
                _id: objId
            },
            {
                $set: updatedUser,
            }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw ERRORS.NOMODIFY;
        }

        return await this.getUser(id);
    },

    /* Remove a user by id */
    async removeUser(id) {
        checkId(id);
        const objId = ObjectId.createFromHexString(id);

        const userCollection = await users();

        const deletionInfo = await userCollection.deleteOne({
            _id: objId
        });
        if (deletionInfo.deletedCount === 0) {
            throw ERRORS.NOMODIFY;
        }

        return true;
    }
};
