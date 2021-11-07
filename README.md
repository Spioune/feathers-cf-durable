>❗  This adapter is very experimental. Use with caution.

>❗  [Cloudflare Durable Objects](https://developers.cloudflare.com/workers/learning/using-durable-objects) are still in Beta

# feathers-cf-durable

[![Download Status](https://img.shields.io/npm/dm/feathers-cf-durable.svg?style=flat-square)](https://www.npmjs.com/package/feathers-cf-durable)

[feathers-cf-durable](https://github.com/Spioune/feathers-cf-durable/) is a database service adapter for [Cloudflare Durable Objects](https://developers.cloudflare.com/workers/learning/using-durable-objects/), a consistent low-latency storage for Cloudflare Workers. [Durable Objects](https://blog.cloudflare.com/durable-objects-easy-fast-correct-choose-three/) stores data on the edge which makes it useful as a persistent storage without the need of a separate database.

```bash
$ npm i feathers-cf-durable
```

> __Important:__ `feathers-cf-durable` implements the [Feathers Common database adapter API](https://docs.feathersjs.com/api/databases/common.html) and [querying syntax](https://docs.feathersjs.com/api/databases/querying.html).


## Example

Here is an example of a Feathers application running on Cloudflare Workers with a `messages` service persisted on Durable Objects:

```
$ npm i @feathersjs/feathers@pre feathers-cf-durable feathers-cf-rest itty-router 
```
> __Important:__ In this example we will be using the prereleased version of [Feathers Dove](https://dove.docs.feathersjs.com/)


In `wrangler.toml`

```toml
[durable_objects]
bindings = [
  { name = "SERVICE", class_name = "Service" }
]
```


In `index.mjs`:

```js
import { Router } from 'itty-router'
export { DurableObject as Service } from 'feathers-cf-durable'

import app from './feathers.mjs'

const router = Router()

router.all('*', app.handle)

router.all('*', (request, env) => {
  return new Response('Not found', { status: 404 })
})

export default {
  fetch: router.handle,
}
```


In `feathers.mjs`:

```js
import feathers from '@feathersjs/feathers'
import rest from 'feathers-cf-rest'
import { Adapter } from 'feathers-cf-durable'

const app = feathers()

app.configure(rest)

app.use('messages', new Adapter())

export default app

```

To test your app in development, I recommend using [Miniflare](https://miniflare.dev/) since [Wrangler CLI](https://developers.cloudflare.com/workers/cli-wrangler/) does not yet support Durable Objects.

```bash
$ miniflare --watch --debug
```

You should now be able to navigate to [http://localhost:8787/messages](http://localhost:8787/messages) to see the messages list.  
To create a new message, simply make a HTTP POST request to [http://localhost:8787/messages](http://localhost:8787/messages)


You can publish your app to Cloudflare Workers. If this is the first time publishing your app, don't forget to instantiate the DO with the `--new-class` argument

```bash
$ wrangler publish --new-class Service
```


## License

Copyright (c) 2021

Licensed under the [MIT license](LICENSE).
