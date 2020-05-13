const mongoCollections = require("../config/mongoCollections");
const questions = mongoCollections.questions;
const lesson = require('./lessons');
const uuid = require('uuid/v4');
const ERRORS = require("./common").ERRORS;

/**
 * questions = {
 *    question: string
 *     _id; string
 *      lesson:{
 *         id:string
 *         name:String
 *          }
 * }
 */
const exportedMethods = {
    async getAllQuestions(){
        const questionCollections = await questions();
        return await questionCollections.find({}).toArray();
    },
    async getQuestionById(id){
        const questionsCollection = await questions();
        const question = await questionsCollection.findOne({_id: id});

        if(!question) throw 'Question not found';
        return question;
    },
    async addQuestions(question, lessonId){
        if(typeof question !== 'string') throw 'No question provided';

        const questionsCollection = await questions();
        const questionLesson = await lesson.getLesson(lessonId);

        const newQuestion = {
            question: question,
            _id: uuid(),
            lesson:{
                id:lessonId,
                name: `${questionLesson.title}`
            }
        };

        const newQuestionInformation = await questionsCollection.insertOne(newQuestion);
        const newId = newQuestionInformation.insertId;

        await lessons.addQuestionToLesson(lessonId, newId, question);

        return await this.getQuestionById(newId);
    },

    async removeQuestion(id){
        const questionsCollection = await questions();
        let question = null;
        try{
            question = await this.getQuestionById(id);
        }catch(e){
            console.log(e);
            return;
        }

        const deletionInfo = await questionsCollection.removeOne({_id: id });
        if(deletionInfo.deletedCount === 0){
            throw 'Could not delete post with id of ${id}';
        }
        await lesson.removeQuestionfromLesson(question.lesson.id, id);
        return true;
    },

    async updateQuestion(id, updatedInfo){
        const questionCollections = await questions();

        const updatedData = {};
        if(updatedInfo.question){
            updatedData.question = updatedInfo.question;
        }

        await questionCollections.updateOne({_id: id}, {$set: updatedData});

        return await this.getQuestionById(id);
    }
};

module.exports = exportedMethods;


