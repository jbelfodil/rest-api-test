import mongoose from 'mongoose'
import Animal from './models/animal'

const internalErrorHandler = (method, err, res) => {
  console.log(`${method} Error: ${err}`)
  return res.send({status: 'error', code: 500, message: 'an error occured'})
}

const notFoundErrorHandler = (res) => {
  return res.send({status: 'error', code: 404, message: 'not found'})
}

const list = (req, res) => {
  return Animal.paginate({}, { limit: 10 })
    .then(results => res.send(results))
    .catch(err => internalErrorHandler('list', err, res))
}

const insert = (req, res) => {
  return Animal.create(req.body)
    .then(results => res.send({status: 'OK', code: 200, message: 'New animal successfully added'}))
    .catch(err => {
      if (err.name && err.name === 'ValidationError') return res.send({status: 'error', code: 400, message: 'wrong data format'})
      return internalErrorHandler('insert', err, res)
    })
}

const show = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return notFoundErrorHandler(res)
  return Animal.findById(req.params.id)
    .then(result => {
      if (!result) return notFoundErrorHandler(res)
      return res.send(result)
    })
    .catch(err => internalErrorHandler('show', err, res))
}

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
