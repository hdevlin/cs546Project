const mongoCollections = require("../config/mongoCollections");
const lessons = mongoCollections.lessons;
// const ObjectID = require("mongodb").ObjectID;
// const uuid = require('uuid/v4');
const ERRORS = require("./common").ERRORS;

// TODO: all checks must be improved
function checkId(id) {
    if (!id) throw "You must provide an id to search for";
}

function checkTitle(title) {
    if (!title) throw "You must provide an title";
}

function checkSubject(email) {
    if (!email) throw "You must provide an email";
}

function checkDifficulty(password) {
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
        checkSubject(subject);
        checkDifficulty(difficulty);
        // TODO
        // checkQuestions(questions)
        // checkBadges(badges)
        const lessonCollection = await lessons();

        const newLesson = {
            title: title,
            subject: subject,
            difficulty: difficulty, // TODO: hash and salt the password
            questions: [],
            badges: [],
        };

        const insertInfo = await lessonCollection.insertOne(newLesson);
        if (insertInfo.insertedCount === 0) throw ERRORS.NOMODIFY;

        return insertInfo.insertedId;
    },

    /**
     *
     */
    async getAllLessons() {
        const lessonCollection = await lessons();
        const lessonList = await lessonCollection.find({}).toArray();
        return lessonList;
    },

    /**
     *
     * @param {string} id
     */
    async getLesson(id) {
        checkId(id);
        const lessonCollection = await lessons();
        const lesson = await lessonCollection.findOne({
            // _id: new ObjectID(id),
            _id:id
        });
        if (lesson === null) throw ERRORS.NOEXIST;

        return lesson;
    },

    /**
     *
     * @param {string} id
     * @param {{}} options
     */
    async updateLesson(id, options = {}) {
        checkId(id);
        // TODO: check the options object

        const lessonCollection = await lessons();
        let originalLesson = await this.getLesson(id);

        const updateAlbum = {};

        if (options.name) {
            updateAlbum.name = options.name;
        } else {
            updateAlbum.name = originalLesson.name;
        }

        const updatedInfo = await lessonCollection.updateOne(
            { 
                // _id: new ObjectID(id) 
                _id:id
            },
            {
                $set: { name: updateAlbum.name },
                // TODO: update this query
            }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw ERRORS.NOMODIFY;
        }

        return await this.getLesson(id);
    },

    async addQuestionToLesson(lessonId, questionId, question){
        let currentLesson = await this.getLesson(lessonId);

        const lessonCollection = await lessons();
        const updateInfo = await lessonCollection.updateOne(
            {_id: lessonId},
            { $addToSet: {question: { id: questionId, question: question}}}
        );

        if(!updateInfo.matchedCount && !updateInfo.modifiedCount){
            throw 'Add Question failed';
        }

        return await this.getLesson(lessonId);
    },

    async removeQuestionfromLesson(lessonId, questionId){

    },

    async removeLesson(id) {
        checkId(id);

        const lesson = await this.getLesson(id);

        const lessonCollection = await lessons();

        const deletionInfo = await lessonCollection.deleteOne({
            // _id: new ObjectID(id),
            _id:id
        });
        if (deletionInfo.deletedCount === 0) {
            throw ERRORS.NOMODIFY;
        }

        return lesson;
    },
};
