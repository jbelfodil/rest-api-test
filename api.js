import mongoose from 'mongoose'
import Animal from './models/animal'

// Definition of errors handler and API middleware

// unpredictable 500 error handler
const internalErrorHandler = (method, err, res) => {
  console.log(`${method} Error: ${err}`)
  return res.send({status: 'error', code: 500, message: 'an error occured'})
}

// not found and wrong objectId error handler
const notFoundErrorHandler = (res) => {
  return res.send({status: 'error', code: 404, message: 'not found'})
}

// retrieve and list all animals 10 by 10 with pagination
const list = (req, res) => {
  const page = req.query.page && parseInt(req.query.page)
  return Animal.paginate({}, { page: page || 1, limit: 10 })
    .then(results => res.send(results))
    .catch(err => internalErrorHandler('list', err, res))
}

// insert one or many animals
const insert = (req, res) => {
  return Animal.create(req.body)
    .then(results => res.send({status: 'OK', code: 200, message: 'New animal successfully added'}))
    .catch(err => {
      if (err.name && err.name === 'ValidationError') return res.send({status: 'error', code: 400, message: 'wrong data format'})
      return internalErrorHandler('insert', err, res)
    })
}

// retrieve and show an animal by his id
const show = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return notFoundErrorHandler(res)
  return Animal.findById(req.params.id)
    .then(result => {
      if (!result) return notFoundErrorHandler(res)
      return res.send(result)
    })
    .catch(err => internalErrorHandler('show', err, res))
}

// retrieve and update an animal by his id
const update = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return notFoundErrorHandler(res)
  return Animal.findByIdAndUpdate(req.params.id, {$set: req.body})
    .then(result => {
      if (!result) return notFoundErrorHandler(res)
      return res.send({status: 'OK', code: 200, message: 'Animal successfully updated', doc: result})
    })
    .catch(err => {
      if (err.name && err.name === 'CastError') return res.send({status: 'error', code: 400, message: 'wrong data format'})
      return internalErrorHandler('update', err, res)
    })
}

// retrieve and delete an animal by his id
const remove = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return notFoundErrorHandler(res)
  return Animal.findByIdAndRemove({ _id: req.params.id })
    .then(result => {
      if (!result) return notFoundErrorHandler(res)
      return res.send({status: 'OK', code: 200, message: 'Animal successfully removed'})
    })
    .catch(err => internalErrorHandler('remove', err, res))
}

export { list, insert, show, update, remove, internalErrorHandler, notFoundErrorHandler }
