const bcrypt = require('bcrypt')
const users = require('../data/samples/users')
const lessons = require('../data/samples/lessons')
const questions = require('../data/samples/questions')
const saltRounds = 10

const constructorMethod = app => {
    app.get('/', (req, res) => {
      // TODO turn lesson ids into full objects (using db collection) before passing to layout
      res.render('layouts/main', { layout: false, reqbody: req.session.user })
    })

    app.get('/lessons', (_, res) => {
      // TODO get all lessons from db
      res.render('layouts/lessons', { layout: false, reqbody: lessons })
    })

    app.get('/lesson/:id', (req, res) => {
      // check if logged in
      if (!req.session.user) {
        res.redirect('/login')
        return
      }
      let lessonObj = lessons.find(l => l._id === req.params.id.toLowerCase())
      if (!lessonObj) res.status(404).json({ error: "Not found" })
      res.redirect(`/question/${lessonObj.questions[0]}`)
    })

    app.get('/profile', (req, res) => {
      if (req.session.user) {
        res.render('layouts/profile', { layout: false, reqbody: req.session.user })
      } else {
        res.redirect('/login')
      }
    })

    app.get('/login', (_, res) => {
      res.render('login', { layout: false })
    })

    app.post('/login', async (req, res) => {
      // attempt to login user with provided credentials
      if (!req.body['email'] || !req.body['password'] || req.body['email'].trim() === '' || req.body['password'].trim() === '') {
        res.status(401).render('login', { layout: false, errorMsg: "Invalid login" })
      } else {
        // TODO get users collection from database (maybe make a getUserByEmail function)
        let userObj = users.find(user => user.email.toLowerCase() === req.body['email'].toLowerCase())
        if (userObj) {
          let passMatch = await bcrypt.compare(req.body['password'], userObj.hashedPassword)
          .catch((err) => console.error(err))
          if (passMatch) {
            // create cookie, set expiration, redirect
            let expiresIn = new Date()
            expiresIn.setHours(expiresIn.getHours() + 1)
            req.session.user = userObj
            req.session.cookie.expires = expiresIn
            console.log(`User ${userObj.email} logged in`)
            res.redirect('/')
            return
          }
        }
        // access denied
        res.status(401).render('login', { layout: false, errorMsg: "Invalid login" })
      }
    })

    app.get('/logout', (req, res) => {
      // destroy session & redirect
      let userEmail = req.session.user.email
      req.session.destroy()
      console.log(`User ${userEmail} logged out`)
      res.redirect('/')
    })

    app.post('/signup', (req, res) => {
      // create a new account with provided details
      if (!req.body['name'] || !req.body['email'] || !req.body['password'] || req.body['name'].trim() === '' || req.body['email'].trim() === '' || req.body['password'].trim() === '') {
        res.status(401).render('login', { layout: false, errorMsg: "Could not create your account. Check the entered info and try again." })
      } else {
        // TODO put in db
        const passHash = bcrypt.hashSync(req.body['password'], bcrypt.genSaltSync(saltRounds))
        res.render('login', { layout: false, successMsg: "Account created! Now, log in." })
        console.log(`User ${req.body.email} signed up`)
      }
    })

    app.get('/question/:id', (req, res) => {
      // check if logged in
      if (!req.session.user) {
        res.redirect('/login')
        return
      }
      // TODO retrieve question from db
      let questionObj = questions.find(q => q._id === req.params.id.toLowerCase())
      if (!questionObj) res.status(404).json({ error: "Not found" })
      let lessonObj = lessons.find(l => l._id === questionObj.lesson_id.toLowerCase())
      let qReqBody = {
        lessonTitle: lessonObj.title,
        questions: lessonObj.questions,
        curQuestion: questionObj
      }
      res.render('layouts/question', { layout: false, reqbody: qReqBody })
    })

    app.post('/question', (req, res) => {
      // add completed question id to user object & update db
      console.log(req.body)
      res.redirect('/question')
    })
    
    app.use('*', (_, res) => {
      res.status(404).json({ error: "Not found" })
    })
}

module.exports = constructorMethod
