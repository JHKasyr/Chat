import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

class App {
    private app;
    private http: http.Server;
    private io: Server;

    constructor() {
        this.app = express();
        this.http = http.createServer(this.app);
        this.io = new Server(this.http);
        this.useStatic(); // Configura o servidor para servir arquivos estáticos
        this.setupRoutes(); // Configura as rotas
        this.listenSocket(); // Configura o WebSocket
    }

    listenServer() {
        this.http.listen(3000, () => {
            try {
                console.log("Server is running on port 3000");
            } catch (error) {
                console.error(error);
            }
        });
    }

    listenSocket() {
        this.io.on("connection", (socket) => {
            try {
                console.log("Socket connected:", socket.id);
    
                socket.on('message', (msg) => {
                    console.log(msg);
                    socket.broadcast.emit('message', msg);
                });
            } catch (error) {
                console.log(error);
            }
        });
    }
    

    setupRoutes() {
        console.log("Setting up routes");
        this.app.get('/', (req, res) => {
            console.log("Serving index.html");
            res.sendFile(path.join(__dirname, 'index.html'));
        });
    }

    useStatic() {
        console.log("Serving static files");
        // Serve a pasta src como diretório de arquivos estáticos
        this.app.use(express.static(path.join(__dirname)));
    }
}

const app = new App();
app.listenServer();
