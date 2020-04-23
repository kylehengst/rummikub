# rummikub

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Docker

```
docker build -t kylehengst/rummikub .
```

```
docker run -it -p 8080:8080 --rm --name rummi kylehengst/rummikub
docker run -it -p 8888:8080 --rm --name rummi kylehengst/rummikub
```

```
ngrok http --host-header=rewrite --subdomain=rummi 8080
```