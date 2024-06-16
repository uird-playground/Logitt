# Logitt

> Logitt is a powerful NodeJS library for efficient log management. It seamlessly saves logs and offers an intuitive interface for exploring and analyzing them, enhancing your application's monitoring and debugging capabilities.

---

## Why Choose Logitt?

- **Easy to Integrate:** Simple to add to your projects.
- **Lightweight:** Minimal package size for optimal performance.
- **User-Friendly Interface:** Includes an intuitive UI for viewing logs.
- **Framework-Independent:** Works with any NodeJS application

## Install

Using NPM:

```
$ npm install logitt
```

Using YARN:

```
$ yarn add logitt
```

## Usage

Logitt provides a straightforward logger and an easy-to-use interface for viewing logs. Here's how to get started:

- **Configuration:** Set up your environment variables before using the library.

- **Development Mode:** By default, Logitt operates in "development" mode, displaying all logs in the console using [Consola](https://www.npmjs.com/package/consola)

- **Production Mode:** To save logs to files (stored in the "/logs" folder), update your environment variables as follows:

```env
NODE_ENV="production"
```

### 1. Instantiate

Logitt employs the Singleton design pattern. You can configure the logger by changing the URL of the UI Explorer or by enabling/disabling tracing.

```js
const { Logitt } = require("logitt");

// Default configuration options
const options = {
  // Enable tracing to identify the source of the log
  trace: true,
  // Set the URL path for the UI Explorer
  route: "/logs",
};

// Create a new instance with custom options, if not already created
const loggy = Logitt.getLogger(options);

// Create a new instance with default options
const loggy = Logitt.getLogger();
```

### 2. Logging

Logitt provides 4 logging levels: SUCCESS, DEBUG, WARNING, and ERROR.

- **SUCCESS:** Always logs to the console, regardless of the environment.
- **DEBUG:** For detailed debugging information.
- **WARNING:** For warning messages.
- **ERROR:** For error messages.

Here's how to use them:

```js
loggy.warn("Warning occured here");
loggy.error("Error occured here");
loggy.debug("Debug occured here");
loggy.success("Success occured here");

// You can also log directly using the singleton instance
// Logitt.getLogger().warn("Warning occured here")
```

To include additional context or metadata with your logs:

```js
loggy.error("Unable to create a new user", {
  name: "John Doe",
  email: "user@exmaple.com",
  phone: null,
});
```

### 3. UI Explorer

To access the UI Explorer and view your logs, you need to set your credentials as environment variables:

```env
LOGITT_USERNAME=your_username
LOGITT_PASSWORD=your_password
```

#### 3.1. No Framework

```js
const { Logitt } = require("logitt");
const http = require("http");

const loggy = Logitt.getLogger();

http.createServer(loggy.render).listen(PORT, () => {
  consola.start(`Server is running on port ${PORT} ...\n`);
});
```

#### 3.2. ExpressJS

```js
const { Logitt } = require("logitt");
const express = require("express");

const app = express();

app.get("/logs", Logitt.getLogger().render);

// Custom URL
app.get("/my-logs", Logitt.getLogger({ route: "/my-logs" }).render);
```

#### 3.3. NestJS

```ts
import { Controller, Get, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { Logitt } from "logitt";

@Controller()
export class AppController {
  constructor() {}

  @Get("/logs")
  getLogs(@Req() req: Request, @Res() res: Response) {
    let logitt = Logitt.getLogger();
    logitt.render(req, res);
  }

  // Custom URL
  @Get("/my-logs")
  getLogs(@Req() req: Request, @Res() res: Response) {
    let logitt = Logitt.getLogger({ route: "/my-logs" });
    logitt.render(req, res);
  }
}
```

## ISC License

Copyright 2024

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
