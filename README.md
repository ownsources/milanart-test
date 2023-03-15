<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

# Separate envrironment for e2e
# File uploader looks bad to me, but not much time to make it better


## Running the app

```bash
# e2e tests
$ docker-compose -f docker-compose.e2e.yml up

# production mode
$ docker build --tag "nestjs-api" .
$ docker-compose up
```

## License

Nest is [MIT licensed](LICENSE).
