# 🚀 Node.js HTTP server manually clustering.

## 📌 Requirements:
* Node.js v12.x;
* Docker v19.x (optional);

### Installation
```bash
$ git clone https://github.com/webstyle/nodejs-manual-clustering.git
$ cd nodejs-manual-clustering
$ npm install
```

### Run
```bash
$ npm start
```
Goto: http://localhost:1337


### Run with Docker
```bash
$ docker-compose up -d
```

### Sample with Cluster mode 6 workers
```javascript
import { ServerHandler } from "./service";

process.env.NODE_ENV = 'production';
const HTTP_PORT = Number(process.env.HTTP_PORT) || 1337;

const app = new ServerHandler({
    transport: {
        isPermanentConnection: true,
        port: HTTP_PORT,
    },
    cluster: {
        replicas: 6
    }
});

app.start();
```

### Sample without clustering and single worker
```javascript
import { ServerHandler } from "./service";

process.env.NODE_ENV = 'production';
const HTTP_PORT = Number(process.env.HTTP_PORT) || 1337;

const app = new ServerHandler({
    transport: {
        isPermanentConnection: true,
        port: HTTP_PORT,
    },
});

app.start();
```
