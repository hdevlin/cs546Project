const constructorMethod = app => {
    app.get('/', (_, res) => {
      res.render('layouts/main')
    })
    
    app.use('*', (_, res) => {
      res.status(404).json({ error: "Not found" })
    })
}

module.exports = constructorMethod
