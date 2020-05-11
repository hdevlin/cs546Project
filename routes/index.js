const bcrypt = require('bcrypt')
const reqMain = require('../data/samples/reqbody_main')
const reqLessons = require('../data/samples/reqbody_lessons')
const reqProfile = require('../data/samples/reqbody_profile')
const reqQuestion = require('../data/samples/reqbody_question')
const users = require('../data/samples/users.json')

const constructorMethod = app => {
    // TODO pass correctly formatted request body jsons
    app.get('/', (req, res) => {
      // TODO turn lesson ids into full objects before passing to layout 
      res.render('layouts/main', { layout: false, reqbody: reqMain, authinfo: req.session.user })
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

    app.post('/login', async (req, res) => {
      // attempt to login user with provided credentials
      if (!req.body['email'] || !req.body['password'] || req.body['email'].trim() === '' || req.body['password'].trim() === '') {
        res.status(401).redirect('/login?err=ya')
      } else {
        // get users collection from database (maybe make a getUserByEmail function)
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
        res.status(401).redirect('login?err=ya')
      }
    })

    app.get('/logout', (req, res) => {
      // destroy session & redirect
      req.session.destroy()
      res.redirect('/')
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
