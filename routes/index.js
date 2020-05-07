const reqMain = require('../data/samples/reqbody_main')
const reqLessons = require('../data/samples/reqbody_lessons')
const reqProfile = require('../data/samples/reqbody_profile')
const reqQuestion = require('../data/samples/reqbody_question')

const constructorMethod = app => {
    // TODO pass correctly formatted request body jsons
    app.get('/', (_, res) => {
      // TODO turn lesson ids into full objects before passing to layout 
      res.render('layouts/main', { layout: false, reqbody: reqMain })
    })

    app.get('/lessons', (_, res) => {
      res.render('layouts/lessons', { layout: false, reqbody: reqLessons })
    })

    app.get('/profile', (_, res) => {
      res.render('layouts/profile', { layout: false, reqbody: reqProfile })
    })

    app.get('/login', (_, res) => {
      res.render('login', { layout: false })
    })

    // temporary for debugging
    app.get('/question', (_, res) => {
      res.render('layouts/question', { layout: false, reqbody: JSON.stringify(reqQuestion), helpers: { json: function (context) { return JSON.stringify(context) } }})
    })
    
    app.use('*', (_, res) => {
      res.status(404).json({ error: "Not found" })
    })
}

module.exports = constructorMethod
