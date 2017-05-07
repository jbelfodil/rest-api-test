import restify from 'restify'
import bluebird from 'bluebird'
import mongoose from 'mongoose'
import {list, insert, show, update, remove} from './api'

// set the Promise library on bluebird
mongoose.Promise = bluebird

const MongoDBUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_PATH}`

const server = restify.createServer({
  name: 'rest-api-test',
  version: '1.0.0'
})

server.pre(restify.pre.sanitizePath())
server.use(restify.bodyParser())

// API routes
server.get('/animals', list)
server.post('/animals', insert)
server.get('/animals/:id', show)
server.put('/animals/:id', update)
server.del('/animals/:id', remove)

// connect to the DB then start the server
mongoose.connect(MongoDBUrl)
  .then(() => {
    console.log('Database connected')
    server.listen(process.env.PORT || 1337, () => {
      console.log(`server started ➜ http://localhost:${process.env.PORT || 1337}`)
    })
  }).catch(console.log)
