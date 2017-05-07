
// tests for all api.js functions
// the mongoose connection is mocked by mockgoose
// all the documents are managed in memory

import bluebird from 'bluebird'
import mongoose from 'mongoose'
import Animal from './../models/animal'
import {Mockgoose} from 'mockgoose'
import data from './fakeData'
import {list, insert, show, update, remove, internalErrorHandler, notFoundErrorHandler} from './../api'

mongoose.Promise = bluebird
const mockgoose = new Mockgoose(mongoose)

beforeAll(() => {
  return mockgoose.prepareStorage()
    .then(() => mongoose.connect('mongodb://example.com/TestingDB'))
    .then(() => Animal.create(data))
})
afterAll(() => {
  return mockgoose.helper.reset()
    .then(mongoose.disconnect)
})

describe('errorHandler', () => {
  const res = {
    send: (error) => error
  }

  test('internalErrorHandler', () => {
    const spy = jest.spyOn(console, 'log')
    expect(internalErrorHandler('method', 'error', res)).toEqual({status: 'error', code: 500, message: 'an error occured'})
    expect(spy).toHaveBeenCalledWith('method Error: error')
    spy.mockRestore()
  })
  test('notFoundErrorHandler', () => {
    expect(notFoundErrorHandler(res)).toEqual({status: 'error', code: 404, message: 'not found'})
  })
})

describe('list api', () => {
  test('list documents and paginate', () => {
    const res = { send: (result) => result }

    return list(null, res).then(result => {
      expect(result.docs).toHaveLength(2)
      expect(result.total).toBe(2)
      expect(result.limit).toBe(10)
      expect(result.page).toBe(1)
    })
  })
})

describe('insert api', () => {
  test('insert document', () => {
    const newDoc = {
      'type': 'dog',
      'name': 'murphy',
      'picture': 'http://picture.com/3',
      'age': 1
    }
    const res = { send: (result) => result }
    const req = { body: newDoc }

    return insert(req, res).then(result => {
      expect(result).toEqual({ status: 'OK', code: 200, message: 'New animal successfully added' })
    })
  })

  test('insert wrong document', () => {
    const wrongDoc = {
      'type': 'dog',
      'name': 'murphy'
    }
    const res = { send: (result) => result }
    const req = { body: wrongDoc }

    return insert(req, res).then(result => {
      expect(result).toEqual({status: 'error', code: 400, message: 'wrong data format'})
    })
  })
})

describe('show api', () => {
  test('request a document with bad id', () => {
    const res = { send: (result) => result }
    const req = { params: { id: 'wrong id' } }
    expect(show(req, res)).toEqual({status: 'error', code: 404, message: 'not found'})
  })

  test('request a document with good id but not in DB', () => {
    const res = { send: (result) => result }
    const req = { params: { id: '590e5544b13867eaba35f39c' } }
    return show(req, res).then(result => {
      expect(result).toEqual({status: 'error', code: 404, message: 'not found'})
    })
  })

  test('show a document with good id', () => {
    const res = { send: (result) => result }

    return list(null, res).then(result => {
      const id = result.docs[0]._id
      const req = { params: { id } }
      return show(req, res).then(result => {
        expect(result._id).toEqual(id)
      })
    })
  })
})

describe('update api', () => {
  test('request a document with bad id', () => {
    const res = { send: (result) => result }
    const req = { params: { id: 'wrong id' } }
    expect(update(req, res)).toEqual({status: 'error', code: 404, message: 'not found'})
  })

  test('request a document with good id but not in DB', () => {
    const res = { send: (result) => result }
    const req = { params: { id: '590e5544b13867eaba35f39c' }, body: {} }
    return update(req, res).then(result => {
      expect(result).toEqual({status: 'error', code: 404, message: 'not found'})
    })
  })

  test('update a document with good id and wrong format', () => {
    const res = { send: (result) => result }

    return list(null, res).then(result => {
      const id = result.docs[0]._id
      const req = { params: { id }, body: {age: 'wrong age'} }
      return update(req, res).then(result => {
        expect(result).toEqual({status: 'error', code: 400, message: 'wrong data format'})
      })
    })
  })

  test('update a document with good id and good format', () => {
    const res = { send: (result) => result }

    return list(null, res).then(result => {
      const id = result.docs[0]._id
      const req = { params: { id }, body: {age: 5} }
      return update(req, res).then(result => {
        expect(result.status).toBe('OK')
        expect(result.code).toBe(200)
        expect(result.message).toBe('Animal successfully updated')
      })
    })
  })
})

describe('remove api', () => {
  test('request a document with bad id', () => {
    const res = { send: (result) => result }
    const req = { params: { id: 'wrong id' } }
    expect(remove(req, res)).toEqual({status: 'error', code: 404, message: 'not found'})
  })

  test('request a document with good id but not in DB', () => {
    const res = { send: (result) => result }
    const req = { params: { id: '590e5544b13867eaba35f39c' } }
    return remove(req, res).then(result => {
      expect(result).toEqual({status: 'error', code: 404, message: 'not found'})
    })
  })

  test('remove a document with good id', () => {
    const res = { send: (result) => result }

    return list(null, res).then(result => {
      const id = result.docs[0]._id
      const req = { params: { id } }
      return remove(req, res).then(result => {
        expect(result).toEqual({status: 'OK', code: 200, message: 'Animal successfully removed'})
      })
    })
  })
})
