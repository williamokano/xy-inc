# XY-INC Backend as a Service
Zup developer test

# Install
You need yarn!  
`npm instal -g yarn`

Then clone this project:  
`git clone git@github.com:williamokano/xy-inc.git`

and then just run  
`yarn install`

# Running
You can choose to have either docker-compose to install all the needed containers or nodejs 6+ and mongodb to run on your localhost.  
You can choose the app with one of the following:

## With docker-compose and docker
Just type `docker-compose up` and open browser at `http://localhost:3000`

## Manually
You need
- nodejs 6+
- mongodb
- yarn

Fix the envs files inside `src/envs` with the needed configuration then run `yarn start`

# Tests
To execute the tests just run  
`yarn test`

If you want to check the code coverage, run  
`yarn test:coverage`
