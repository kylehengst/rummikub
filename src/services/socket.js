import Emitter from './emitter';
const host = 'ws://localhost:5000';

class Socket extends Emitter {
  constructor(host) {
    super();
    this.host = host;
    this.connect();
  }
  connect() {
    this.ws = new WebSocket(this.host);
    this.ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      this.emit(message.event, message.data);
    };
    this.ws.onclose = () => {
      setTimeout(() => {
        this.connect(this.host);
      }, 1000);
    };
    this.ws.onerror = (err) => {
      console.error(err);
      this.ws.close();
      this.emit('close');
    };
  }
  initGame(id) {
    this.message({
      event: 'game',
      data: { id },
    });
  }
  startGame(id) {
    this.message({
      event: 'start_game',
      data: { id },
    });
  }
  getGame(id) {
    this.message({
      event: 'get_game',
      data: { id },
    });
  }
  initUser(id) {
    this.message({
      event: 'user',
      data: { id },
    });
  }
  updateUser(data) {
    this.message({
      event: 'update_user',
      data,
    });
  }
  updateGameBoard(data) {
    this.message({
      event: 'update_game_board',
      data,
    });    
  }
  message(message) {
    this.ws.send(JSON.stringify(message));
  }
}

export default new Socket(host);
