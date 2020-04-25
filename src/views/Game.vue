<template>
  <div id="game" :class="{ dragging: dragging }">
    <div id="board" ref="board">
      <div id="tiles">
        <div class="tile-row" v-for="(row, rowIndex) in board" :key="rowIndex">
          <div
            :data-row="rowIndex"
            :data-col="colIndex"
            class="tile-slot"
            :class="{
              'tile-slot-highlight': doHighlightTileSlot(
                rowIndex,
                colIndex,
                false
              ),
            }"
            v-for="(col, colIndex) in row"
            :key="colIndex"
          >
            <Tile
              v-if="col"
              :config="col"
              :row="rowIndex"
              :col="colIndex"
              :disabled="!yourTurn"
              @startdrag="onStartDrag"
              @drag="onDragging"
              @stopdrag="onStopDrag"
            ></Tile>
          </div>
        </div>
      </div>
    </div>
    <div id="user" ref="shelf">
      <div class="tile-row" v-for="(tiles, rowIndex) in shelf" :key="rowIndex">
        <div
          class="tile-slot tile-slot-shelf"
          :class="{
            'tile-slot-highlight': doHighlightTileSlot(
              rowIndex,
              colIndex,
              true
            ),
          }"
          v-for="(tile, colIndex) in tiles"
          :key="colIndex"
          :data-row="rowIndex"
          :data-col="colIndex"
        >
          <Tile
            v-if="tile"
            :config="tile"
            :row="rowIndex"
            :col="colIndex"
            :user="true"
            :disabled="!yourTurn"
            @startdrag="onStartDrag"
            @drag="onDragging"
            @stopdrag="onStopDrag"
          ></Tile>
        </div>
      </div>
    </div>
    <div id="users">
      <div
        class="button"
        :class="{ active: currentUser == user.id }"
        v-for="(user, userIndex) in users"
        :key="userIndex"
      >
        {{ user.name }}
      </div>
    </div>
    <div id="actions">
      <!-- <div class="button">Skip</div>
      <div class="button">Play</div>
      <div class="button">Quit</div> -->
      <div class="button" @click="resetBoard()" v-if="yourTurn">Reset</div>
      <div class="button" @click="skipTurn()" v-if="yourTurn">Skip</div>
      <div class="button" @click="makePlay()" v-if="yourTurn">Play</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Socket from '../services/socket';
// import rummikub from '../assets/js/rummikub';
import shelf from '../assets/shelf.json';
// import board from '../assets/board.json';
import Tile from '@/components/Tile.vue';

export default {
  name: 'Game',
  components: {
    Tile,
  },
  data() {
    return {
      board: [],
      shelf,
      user: null,
      grid: [],
      dragging: false,
      boardRow: -1,
      boardCol: -1,
      shelfRow: -1,
      shelfCol: -1,
      boardHeight: 0,
      tileSlot: [],
      users: [],
      gameId: '',
      currentUser: '',
    };
  },
  beforeMount() {
    if (!this.$store.state.userId) {
      this.$router.push({
        name: 'Home',
      });
      return;
    }
    console.log('beforeMount');
    this.gameId = this.$route.params.id;
    Socket.on('game', this.onGame);
    Socket.on('game_board_updated', this.onGameBoard);
    Socket.getGame(this.gameId);
    // this.rummikub = new rummikub.Rummikub();
    // this.user = new rummikub.User('kyle');
    // this.rummikub.users.push(this.user);
    // this.rummikub.initializeGame();
    // this.shelf[0].splice(0, this.user.own.length);
    // this.shelf[0] = this.user.own.concat(this.shelf[0]);
    // window._game = this;
  },
  mounted() {
    this.boardHeight = this.$refs.board.clientHeight;
  },
  computed: {
    yourTurn() {
      return this.currentUser == this.$store.state.userId;
    }
  },
  methods: {
    onGame(data) {
      console.log(data);
      if (!data.game || data.users.length < 2) {
        this.$router.push({ name: 'Lobby', params: { id: this.gameId } });
        return;
      }
      this.board = data.game.board;
      this.users = data.users;
      this.currentUser = data.game.currentUser;
      let userTiles = data.game.users[this.$store.state.userId].tiles;

      this.shelf[0].splice(0, userTiles.length);
      this.shelf[0] = userTiles.concat(this.shelf[0]);
    },
    onGameBoard(data) {
      console.log('onGameBoard', data);

      if (data.update)
        this.board[data.update.row].splice(
          data.update.col,
          1,
          data.update.tile
        );
      if (data.remove) {
        this.board[data.remove.row].splice(data.remove.col, 1, null);
      }
      // this.board = data.game.board;
    },
    startGame() {
      Socket.startGame(this.gameId);
    },
    onStartGame() {},
    resetBoard() {},
    skipTurn() {},
    makePlay() {},

    // tile moves
    onStartDrag(config, index) {
      console.log(config, index);
    },
    onDragging(config, index) {
      let clientX = index.x;
      let clientY = index.y;
      let x = clientX + this.$refs.board.scrollLeft;
      let y = clientY + this.$refs.board.scrollTop;
      let offsetX = 0;
      let offsetY = 0;
      let found = false;
      let shelf = false;
      let tiles = this.board;
      if (clientY > this.boardHeight) {
        shelf = true;
        tiles = this.shelf;
        x = clientX + this.$refs.shelf.scrollLeft;
        y = clientY + this.$refs.shelf.scrollTop;
        offsetY = this.boardHeight;
      }

      tiles.forEach((row, rowIndex) => {
        if (found) return;
        offsetX = 0;
        row.forEach((col, colIndex) => {
          if (found) return;
          if (
            x >= offsetX &&
            x <= offsetX + 52 &&
            y >= offsetY &&
            y <= offsetY + 82
          ) {
            this.$set(this.tileSlot, index.id, {
              row: rowIndex,
              col: colIndex,
              shelf,
            });
            found = true;
            return;
          }
          offsetX += 52;
        });
        offsetY += 82;
      });
    },
    onStopDrag(config, index) {
      console.log(config);
      let tileSlot = this.tileSlot[index.id];
      if (tileSlot.shelf) this.updateShelf(config, index, tileSlot);
      else this.updateBoard(config, index, tileSlot);
      this.$set(this.tileSlot, index.id, null);
      // this.dragging = false;
    },
    updateBoard(config, index, tileSlot) {
      // if (this.boardRow < 0 || this.boardCol < 0) return;
      if (this.board[tileSlot.row][tileSlot.col]) return;

      this.board[tileSlot.row].splice(tileSlot.col, 1, config);

      let remove;
      // this.board[tileSlot.row][tileSlot.col] = config;

      if (config.board) {
        // this.board[index.row][index.col] = null;
        this.board[index.row].splice(index.col, 1, null);
        remove = {
          row: index.row,
          col: index.col,
        };
      } else {
        config.board = true;
        // this.shelf[index.row][index.col] = null;
        this.shelf[index.row].splice(index.col, 1, null);
      }

      Socket.updateGameBoard({
        id: this.gameId,
        update: {
          row: tileSlot.row,
          col: tileSlot.col,
          tile: config,
        },
        remove,
      });

      // this.tileSlot[index.touchIndex]
      // this.$forceUpdate();
      // setTimeout(() => {
      // this.$delete(this.tileSlot, index.id);
      // }, 1000);
      // this.$nextTick(() => {
      // });
    },
    updateShelf(config, index, tileSlot) {
      // if (this.shelfRow < 0 || this.shelfCol < 0) return;
      if (config.board && !config.isOwn) return;
      if (this.shelf[tileSlot.row][tileSlot.col]) return;

      // this.shelf[tileSlot.row][tileSlot.col] = config;
      this.shelf[tileSlot.row].splice(tileSlot.col, 1, config);
      if (config.board) {
        // this.board[index.row][index.col] = null;
        this.board[index.row].splice(index.col, 1, null);
        config.board = false;

        Socket.updateGameBoard({
          id: this.gameId,
          remove: {
            row: index.row,
            col: index.col,
            tile: config,
          },
          update: null,
        });
      } else {
        // this.shelf[index.row][index.col] = null;
        this.shelf[index.row].splice(index.col, 1, null);
      }
      // this.$forceUpdate();
      // setTimeout(() => {
      // this.$delete(this.tileSlot, index.touchIndex);
      // }, 1000);
      // this.$nextTick(() => {
      // this.$delete(this.tileSlot, index.touchIndex);
      // });
    },
    getTouchIndex(evt) {
      let touchIndex = -1;
      evt.touches.forEach((t, i) => {
        if (t.target != evt.target) return;
        touchIndex = i;
      });
      return touchIndex;
    },
    doHighlightTileSlot(row, col, shelf) {
      return this.tileSlot.find((slot) => {
        if (!slot) return;
        return slot.row == row && slot.col == col && slot.shelf == shelf;
      })
        ? true
        : false;
    },
  },
};
</script>

<style scoped>
#game {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
#board {
  flex: 1;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
#tiles {
  /* transform: scale(2); */
  transform-origin: 0 0;
}
#user {
  border-top: 5px solid black;
  background: rgb(131, 35, 35);
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.tile-row {
  display: flex;
}
.tile-shelf {
  border-bottom: 5px solid rgb(80, 16, 16);
  box-shadow: inset 0 -10px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  white-space: nowrap;
  flex-shrink: 0;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

.tile-slot {
  height: 80px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  margin: 1px;
}
.tile-slot-highlight {
  background: rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}
#users {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  z-index: 10;
}
#actions {
  position: absolute;
  top: 10px;
  right: 20px;
  display: flex;
  z-index: 10;
}
.button {
  color: black;
  background: #e5dcc7;
  border-radius: 4px;
  box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.2),
    inset -1px -1px 2px rgba(0, 0, 0, 0.2), 0 2px 5px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-bottom-color: rgba(0, 0, 0, 0.5);
  border-right-color: rgba(0, 0, 0, 0.5);

  padding: 4px 8px;
  font-size: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin-right: 10px; */
  box-sizing: border-box;
  cursor: pointer;
}
.button.active,
.button:hover {
  background: rgb(131, 35, 35);
  color: white;
}
</style>
