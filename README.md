# The League Sample App

#### Set Up
`$ npm install`

The following environment variables need to be set:
`POSTGRES_USER`
`POSTGRES_PW`

To run the application: `gulp`.
It will be available at `localhost:3000`

#### Routes

##### POST /users
Create users. AKA signup.

##### POST /users/login
Login.

##### GET /users/:userId
Get a specific user, along with their associated preferences.

##### GET /users/my-matches
Get users who the active user has NOT rejected, who also match the criteria of their preferences.

##### PUT /ratings/users/:userId
Upsert a rating.

##### PUT /preferences
Set the active user's preferences.

