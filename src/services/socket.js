import Emitter from './emitter';
const host = 'ws://localhost:5000';

class Socket extends Emitter {
  constructor(host) {
    super();
    this.id = '';
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
    this.id = id;
    this.message({
      event: 'game',
      id,
      data: { id },
    });
  }
  startGame(id) {
    this.id = id;
    this.message({
      event: 'start_game',
      id,
      data: { id },
    });
  }
  getGame(id) {
    this.id = id;
    this.message({
      event: 'get_game',
      id,
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
  resetGameBoard() {
    this.message({
      id: this.id,
      event: 'reset_game_board',
      data: null,
    });
  }
  skipTurn() {
    this.message({
      event: 'skip_turn',
      id: this.id,
      data: null,
    });
  }
  makeMove(data) {
    this.message({
      event: 'make_move',
      id: this.id,
      data: data,
    });
  }
  message(message) {
    this.ws.send(JSON.stringify(message));
  }
}

export default new Socket(host);
