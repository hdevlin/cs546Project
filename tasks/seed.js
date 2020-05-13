const connection = require('../config/mongoConnection')
const questions = require('../data/questions')
const lessons = require('../data/lessons')
const badges = require('../data/badges')
const users = require('../data/users')
const qSample = require('../data/samples/questions')
const lSample = require('../data/samples/lessons')
const bSample = require('../data/samples/badges')
const uSample = require('../data/samples/users')

/* Populate the database with samples */
async function main() {
    const db = await connection()

    // drop existing db
    db.dropDatabase()

    // add sample lessons
    console.log(`Adding ${lSample.length} lessons`)
    for (var i in lSample) {
        let l = lSample[i]
        await lessons.addLesson(l.title, l.subject, l.difficulty)
        .catch((err) => console.log(err))
    }

    // add sample questions
    console.log(`Adding ${qSample.length} questions`)
    for (var i in qSample) {
        let q = qSample[i]
        const newQuestion = await questions.addQuestion(q.question, q.choices, q.answer, q.lesson_name)
        .catch((err) => console.log(err))

        // get corresponding lesson & update it
        const questionLesson = await lessons.getLessonByName(q.lesson_name)
        .catch((err) => console.log(err))
        await lessons.addQuestionToLesson(questionLesson._id.toString(), newQuestion._id.toString())
        .catch((err) => console.log(err))
    }

    // add sample badges
    console.log(`Adding ${bSample.length} badges`)
    for (var i in bSample) {
        let b = bSample[i]
        await badges.addBadge(b.name, b.requirements, b.description, b.file)
        .catch((err) => console.log(err))

        // // get corresponding lessons & update them
        // for (var i in b.requirements) {
        //     let lessonName = b.requirements[i]
        //     await lessons.updateLesson()
        // }
        // const badgeLesson
    }

    // add sample users

	await db.serverConfig.close()
}

main()