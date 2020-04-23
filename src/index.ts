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
