const reqbody1 = require('../data/sampleReqBody')

const constructorMethod = app => {
    app.get('/', (_, res) => {
      res.render('layouts/main')
    })

    app.get('/lessons', (_, res) => {
      res.render('layouts/lessons', { layout: false, reqbody: reqbody1 })
    })
    
    app.use('*', (_, res) => {
      res.status(404).json({ error: "Not found" })
    })
}

module.exports = constructorMethod
