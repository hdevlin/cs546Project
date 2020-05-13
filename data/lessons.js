const mongoCollections = require("../config/mongoCollections");
const lessons = mongoCollections.lessons;
const { ObjectId } = require('mongodb');
const ERRORS = require("./common").ERRORS;

function checkId(id) {
    if (!id || typeof id != 'string') throw "You must provide an id to search for";
}

function checkTitle(title) {
    if (!title || typeof title != 'string') throw "You must provide an title";
}

function checkSubject(subject) {
    if (!subject || typeof subject != 'string') throw "You must provide a subject";
}

function checkDifficulty(difficulty) {
    if (!difficulty) throw "You must input a difficulty";
    if (typeof difficulty != 'number' || difficulty < 1 || difficulty > 3) {
        throw "Difficulty should be a number in range 1-3";
    }
}

/**
 * lessons = {
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
     * Add a lesson
     * @param {string} title
     * @param {string} subject
     * @param {number} difficulty
     */
    async addLesson(title, subject, difficulty) {
        checkTitle(title);
        checkSubject(subject);
        checkDifficulty(difficulty);

        const lessonCollection = await lessons();

        const newLesson = {
            title: title,
            subject: subject,
            difficulty: difficulty,
            questions: [],
            badges: [],
        };

        const insertInfo = await lessonCollection.insertOne(newLesson);
        if (insertInfo.insertedCount === 0) throw ERRORS.NOMODIFY;

        return this.getLesson(insertInfo.insertedId.toString());
    },

    /**
     * Get all lessons as array of objects
     */
    async getAllLessons() {
        const lessonCollection = await lessons();
        const lessonList = await lessonCollection.find({}).toArray();
        return lessonList;
    },

    /**
     * Get lesson by id
     * @param {string} id
     */
    async getLesson(id) {
        checkId(id);
        const objId = ObjectId.createFromHexString(id);

        const lessonCollection = await lessons();
        const lesson = await lessonCollection.findOne({
            _id: objId
        });
        if (lesson === null) throw ERRORS.NOEXIST;

        return lesson;
    },

    async getLessonByName(name) {
        if (!name || typeof name != 'string') {
            throw "You must provide a valid lesson name to look for";
        }

        const lessonCollection = await lessons();
        const lesson = await lessonCollection.findOne({
            title: name
        });
        if (lesson === null) throw ERRORS.NOEXIST;

        return lesson;
    },

    /**
     * Update lesson by id & options
     * @param {string} id
     * @param {{}} options
     */
    async updateLesson(id, options) {
        checkId(id);
        if (!options) throw "Options must be provided to update";
        const objId = ObjectId.createFromHexString(id);

        const lessonCollection = await lessons();
        let originalLesson = await this.getLesson(id);

        const updatedLesson = {};
        const allOptions = ['title', 'subject', 'difficulty', 'questions', 'badges']
        for (var i in allOptions) {
            let op = allOptions[i];
            if (options[allOptions[i]]) {
                updatedLesson[op] = options[op];
            } else {
                updatedLesson[op] = originalLesson[op];
            }
        }

        const updatedInfo = await lessonCollection.updateOne(
            { 
                _id: objId
            },
            {
                $set: updatedLesson,
            }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw ERRORS.NOMODIFY;
        }

        return await this.getLesson(id);
    },

    /*
     * Add a question to the lesson by id
     */
    async addQuestionToLesson(lessonId, questionId) {
        checkId(lessonId);
        checkId(questionId);
        const lessonObjId = ObjectId.createFromHexString(lessonId);

        const lessonCollection = await lessons();
        const updateInfo = await lessonCollection.updateOne(
            { _id: lessonObjId },
            { $addToSet: { questions: questionId }}
        );

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw "Add Question failed";
        }

        return await this.getLesson(lessonId);
    },

    /*
     * Remove a question from a lesson by id
     */
    async removeQuestionfromLesson(lessonId, questionId) {
        checkId(lessonId);
        checkId(questionId);
        const lessonObjId = ObjectId.createFromHexString(lessonId);

        const lessonCollection = await lesson();
        const updateInfo = await lessonCollection.updateOne(
            { _id: lessonObjId },
            { $pull: { questions: questionId }}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw "Update failed";
        }

        return await this.getLesson(lessonId);
    },

    /*
     * Remove a lesson by id
     */
    async removeLesson(id) {
        checkId(id);
        const objId = ObjectId.createFromHexString(id);

        const lessonCollection = await lessons();
        const deletionInfo = await lessonCollection.deleteOne({
            _id: objId
        });
        if (deletionInfo.deletedCount === 0) {
            throw ERRORS.NOMODIFY;
        }

        return true;
    }
};
