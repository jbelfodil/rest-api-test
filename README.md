# rest-api-test
rest-api-test is a Rest Api based on [Restify](https://github.com/restify/node-restify) and [Mongoose](https://github.com/Automattic/mongoose).

## CRUD
Here you will manage a pet shop with some basic requests :

#### LIST
List all animals:

* method: `GET`
* path: `/animals`

#### SHOW
Show one specific animal from his id:

* method: `GET`
* path: `/animals/:id`

#### CREATE
Insert one (or many) animals:

* method: `POST`
* path: `/animals/`
* model: 
```javascript
{
  type:    {type: String, required: true},
  name:    {type: String, required: true},
  age:     {type: Number, required: true},
  picture: {type: String, required: true}
}
```

#### UPDATE
Update an animal:

* method: `PUT`
* path: `/animals/:id`

#### DELETE
delete an animal:

* method: `DELETE`
* path: `/animals/:id`
