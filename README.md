# rest-api-test
rest-api-test is a NodeJS Rest Api based on [Restify](https://github.com/restify/node-restify) and [Mongoose](https://github.com/Automattic/mongoose).

## CRUD
Here you will manage a pet shop with some basic requests :

#### MODEL
```javascript
{
  type:    {type: String, required: true},
  name:    {type: String, required: true},
  age:     {type: Number, required: true},
  picture: {type: String, required: true}
}
```
example:
```javascript
{
  type:    'dog',
  name:    'Luffy',
  age:     2,
  picture: 'http://www.picture.com/2'
}
```

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

#### UPDATE
Update an animal:

* method: `PUT`
* path: `/animals/:id`

#### DELETE
delete an animal:

* method: `DELETE`
* path: `/animals/:id`

## Usage
#### Installation

```
npm install
```
#### Configuration
Create a `.env` file at the root and add:
```
DB_PATH=1234.exempleDB.com:port/yourbase
DB_USER=DBuser
DB_PWD=DBpassword
```

#### Start
```
npm start
```

#### Tests
The application is tested with [Jest](https://facebook.github.io/jest/).
To launch the tests:
```
npm run test
```

#### Docker
The application can be build and run with [Docker](https://www.docker.com/):

###### Build

```
docker build -t appName .
```

###### Run

```
docker run -d -p 8080:1337 --name appName -e DBPATH=1234.exempleDB.com:port/yourbase -e DB_USER=user -e DB_PWD=password appName
```
