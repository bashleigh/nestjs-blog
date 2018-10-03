# NestJS Blog

This is an example of how to use [nestjs](https://github.com/nestjs/nest) with jwt and typeorm to build a basic blog API.

## Use 

- Start the mysql container using docker 

```bash
$ docker-compose up -d 
```
- Start the nestjs process using to following

```bash
$ yarn start
```

### Production 

If you're going to use this example in production (or your own verison of it) it's recommended to run using the 'complied' JS version from dist. You can do this by using the following command

```bash
$ yarn start:prod
```
> This command will also clean and build your dist folder 

## Development 

For development, the best command to use is 

```bash
$ yarn start:dev
```

This will start nodemon to reload our script when there's been any changes in the src directory 

## Testing 

#### Unit testing
Unit tests can be ran by simply using the `test` script 

```bash
$ yarn test
```
This will run jest on all `.spec.ts` files.

#### End to End testing (E2E)

End to end tests can be run by using the following command 

```bash
$ yarn test:e2e
```
this will run jest on all `.e2e-spec.ts` files.

## Build your own NestJS application 

Want to get started on your own NestJS application? Simply install the [nest-cli](https://github.com/nestjs/nest-cli) `npm i -g @nestjs/cli` and use the command `nest new my-application` to create a new directory called `my-application` with nestjs ready to go!