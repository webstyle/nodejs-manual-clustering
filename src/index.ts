import { ServerHandler } from "./service";
import { TransportTypes } from "./types";

process.env.NODE_ENV = 'production';

const app = new ServerHandler({
    transport: {
        isPermanentConnection: true,
        port: 1337,
        type: TransportTypes.http
    },
    cluster: {
        replicas: 6
    }
});

app.start();
