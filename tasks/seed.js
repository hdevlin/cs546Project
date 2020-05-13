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
    }

    // add sample users
    console.log(`Adding ${uSample.length} users`)
    for (var i in uSample) {
        let u = uSample[i]
        const newUser = await users.addUser(u.name, u.email, u.hashedPassword)
        .catch((err) => console.log(err))

        // update with lesson ids
        let lessonsIds = []
        let completedLessonsIds = []
        let badgesIds = []
        for (var i in u.lessons) {
            const userLesson = await lessons.getLessonByName(u.lessons[i])
            .catch((err) => console.log(err))
            lessonsIds.push(userLesson._id.toString())
        }
        for (var i in u.completedLessons) {
            const userLesson = await lessons.getLessonByName(u.completedLessons[i])
            .catch((err) => console.log(err))
            completedLessonsIds.push(userLesson._id.toString())
        }
        for (var i in u.badges) {
            const userBadge = await badges.getBadgeByName(u.badges[i])
            .catch((err) => console.log(err))
            badgesIds.push(userBadge._id.toString())
        }
        await users.updateUser(newUser._id.toString(), {
            lessons: lessonsIds,
            completedLessons: completedLessonsIds,
            badges: badgesIds
        })
        .catch((err) => console.log(err))
    }

	await db.serverConfig.close()
}

main()