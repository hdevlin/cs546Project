const reqbody1 = require('../data/samples/reqbody_main')
const reqbody2 = require('../data/samples/reqbody_lessons')

const constructorMethod = app => {
    app.get('/', (_, res) => {
      // TODO turn lesson ids into full objects before passing to layout 
      res.render('layouts/main', { layout: false, reqbody: reqbody1 })
    })

    app.get('/lessons', (_, res) => {
      res.render('layouts/lessons', { layout: false, reqbody: reqbody2 })
    })
    
    app.use('*', (_, res) => {
      res.status(404).json({ error: "Not found" })
    })
}

module.exports = constructorMethod
