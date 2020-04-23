// Класс является сервером обработки запросов.
// в конструкторе передается транспорт, и настройки кластеризации
// сервер может работать как в одном процессе так и порождать для обработки запросов дочерние процессы.
// Задача дописать недостающие части и отрефакторить существующий код
//
// Не важно, http/ws/tcp/ или простой сокет это все изолируется в транспорте.
// Единственное что знает сервис обработки запросов это тип подключения транспорта, постоянный или временный
// и исходя из этого создает нужную конфигурацию. ну и еще от того какой режим кластеризации был выставлен
// Необходимо реализовать ручную кластеризацию (без использования модуля cluster)
// В итоговом варианте ожидаем увидеть код в какой-либо системе контроля версия (github, gitlab) на ваш выбор
// Примеры использования при том или ином транспорте
// Будет плюсом, если задействуете в этом деле typescript и статическую типизацию.

import {
    Server,
    createServer,
    IncomingMessage,
    ServerResponse
} from 'http';
import { ChildProcess, fork } from 'child_process';
import { join } from 'path';

import {
    ICluster, IRandomWorker,
    IServerHandlerOptions,
    ITransport,
    ParsedRequest,
} from "./types";


export class ServerHandler {

    transport: ITransport;
    clusterOptions: ICluster;

    private server: Server;
    private workers: ChildProcess[] = [];

    isClusterMode: boolean;
    isMaster: boolean;

    constructor(options: IServerHandlerOptions) {
        this.transport = options.transport;
        this.isClusterMode = !!options.cluster;

        if (this.isClusterMode) {
            this.clusterOptions = options.cluster;
            this.clusterOptions.replicas = options.cluster.replicas;
            this.isMaster = (process.env.NODE_ENV === 'production');
        }
    }

    async start() {
        // If application is not cluster mode
        if (!this.isClusterMode) {
            await this.startWorker();
            return await this.startTransport();
        }

        // If application is not master
        if (!this.isMaster) {
            await this.startWorker();
            if (!this.transport.isPermanentConnection) {
                await this.startTransport();
            }
        }

        // if application is master and cluster mode enabled
        await this.startCluster();
        if (this.transport.isPermanentConnection) {
            await this.startTransport();
        }
    }

    async startTransport() {
        this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
            res.statusCode = 200;

            const { worker, index }: IRandomWorker = this.getRandomWorker();

            const handlerParams: ParsedRequest = {
                headers: req.headers,
                method: req.method,
                url: req.url
            };

            worker.send(JSON.stringify(handlerParams));

            worker.once('message', (response) => {
                res.end(response);
            });

            worker.once('error', (response) => {
                res.end(response);
            });

            // Disconnecting workers
            worker.once('close', () => this.disconnetWorker({ worker, index }));
            worker.once('exit', () => this.disconnetWorker({ worker, index }));
            worker.once('disconnect', () => this.disconnetWorker({ worker, index }));
        });

        this.server.listen(this.transport.port, () => {
            console.log(`server is run on port ${this.transport.port}`);
        });
    }

    async startWorker() {
        const childProcess = fork(join(__dirname + '/handler.js'));
        this.workers.push(childProcess);
        console.log(`Worker ${childProcess.pid} is online`);

        return childProcess;
    }

    async startCluster() {
        const numWorkers = this.clusterOptions.replicas;
        for (let i = 0; i < numWorkers; i++) {
            await this.startWorker();
        }
    }

    private disconnetWorker(options: IRandomWorker) {
        options.worker.kill();
        this.workers.splice(options.index, 1);
        console.log(`worker ${options.worker.pid} closed`);
    }

    private getRandomWorker(): IRandomWorker {
        const randomIndex = Math.round(Math.random() * (this.workers.length - 1));
        return {worker: this.workers[randomIndex], index: randomIndex};
    }
}


