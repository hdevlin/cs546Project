const mongoCollections = require("../config/mongoCollections");
const questions = mongoCollections.questions;
const lesson = require('./lessons');
const { ObjectId } = require('mongodb');
const ERRORS = require("./common").ERRORS;

function checkId(id) {
    if (!id || typeof id != 'string') throw "You must provide an id to search for";
}

function checkQuestion(question) {
    if (!question || typeof question != 'string') throw "You must provide a question";
}

function checkChoices(choices) {
    if (!choices || typeof choices != 'object') throw "You must provide an array of choices";
}

function checkAnswer(answer, choices) {
    if (!answer || typeof answer != 'string' || choices.indexOf(answer) == -1) {
        throw "You must provide a valid answer";
    }
}

/**
 * questions = {
 *    _id: string
 *    question: string
 *    choices: array
 *    answer: string
 *    lesson_id: string
 * }
 */
module.exports = {

    /* Get all questions as array of objects */
    async getAllQuestions() {
        const questionCollections = await questions();
        return await questionCollections.find({}).toArray();
    },

    /* Get a question by id */
    async getQuestion(id) {
        checkId(id);
        const objId = ObjectId.createFromHexString(id);

        const questionsCollection = await questions();
        const question = await questionsCollection.findOne({ _id: objId });

        if (!question) throw "Question not found";
        return question;
    },

    /* Add a question */
    async addQuestion(question, choices, answer, lessonName) {
        checkQuestion(question);
        checkChoices(choices);
        checkAnswer(answer, choices);
        if (!lessonName || typeof lessonName != 'string') throw "No lesson name provided";

        const questionsCollection = await questions();
        const questionLesson = await lesson.getLessonByName(lessonName);
        if (!questionLesson) throw "Lesson for question does not exist";

        const newQuestion = {
            question: question,
            choices: choices,
            answer: answer,
            lesson_id: questionLesson._id.toString()
        };

        const newQuestionInformation = await questionsCollection.insertOne(newQuestion);
        if (newQuestionInformation.insertedCount === 0) throw ERRORS.NOMODIFY;

        return this.getQuestion(newQuestionInformation.insertedId.toString());
    },

    /* Update a question by id & options */
    async updateQuestion(id, options) {
        checkId(id);
        if (!options) throw "Options must be provided to update";
        const objId = ObjectId.createFromHexString(id);

        const questionCollection = await questions();
        let originalQuestion = await this.getQuestion(id);

        const updatedQuestion = {};
        const allOptions = ['question', 'choices', 'answer', 'lesson_id']
        for (var i in allOptions) {
            let op = allOptions[i];
            if (options[allOptions[i]]) {
                updatedQuestion[op] = options[op];
            } else {
                updatedQuestion[op] = originalQuestion[op];
            }
        }

        const updatedInfo = await questionCollection.updateOne(
            { 
                _id: objId
            },
            {
                $set: updatedQuestion,
            }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw ERRORS.NOMODIFY;
        }

        return await this.getQuestion(id);
    },

    /* Remove a question & update its lesson */
    async removeQuestion(id) {
        checkId(id);
        const objId = ObjectId.createFromHexString(id);

        const questionsCollection = await questions();
        let question = null;
        try {
            question = await this.getQuestion(id);
        } catch(e) {
            console.log(e);
            return;
        }

        const deletionInfo = await questionsCollection.deleteOne({ _id: objId });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete question with id of ${id}`;
        }
        await lesson.removeQuestionfromLesson(question.lesson_id, id);

        return true;
    }
};
