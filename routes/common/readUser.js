const lessons = require("../../data/lessons");
const badges = require("../../data/badges");

async function readUser(user) {
    let userObj = null;
    if (user) {
        userObj = user;
        for (let i in userObj["lessons"]) {
            try {
                const gotLesson = await lessons.getLesson(
                    userObj["lessons"][i]._id.toString()
                );
                userObj["lessons"][i] = gotLesson;
            } catch (e) {
                console.log(`Error Getting Lesson: ${e}`);
            }
        }
        for (let i in userObj["completedLessons"]) {
            try {
                const gotLesson = await lessons.getLesson(
                    userObj["completedLessons"][i]._id.toString()
                );
                userObj["completedLessons"][i] = gotLesson;
            } catch (e) {
                console.log(`Error Getting Completed Lesson: ${e}`);
            }
        }
        for (let i in userObj["badges"]) {
            try {
                const gotBadge = await badges.getBadge(
                    userObj["badges"][i]._id.toString()
                );
                userObj["badges"][i] = gotBadge;
            } catch (e) {
                console.log(`Error Getting Badge: ${e}`);
            }
        }
    }
    return userObj;
}

module.exports = readUser;
