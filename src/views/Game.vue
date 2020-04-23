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
            @startdrag="onStartDrag"
            @drag="onDragging"
            @stopdrag="onStopDrag"
          ></Tile>
        </div>
      </div>
    </div>
    <div id="users">
      <div class="user active">Oma</div>
      <div class="user">Dad</div>
      <div class="user">Mum</div>
      <div class="user">{{tileSlot}}</div>
    </div>
    <div id="actions">
      <!-- <div class="button">Skip</div>
      <div class="button">Play</div>
      <div class="button">Quit</div> -->
      <div class="button">Start</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import rummikub from '../assets/js/rummikub';
import shelf from '../assets/shelf.json';
import board from '../assets/board.json';
import Tile from '@/components/Tile.vue';

export default {
  name: 'Game',
  components: {
    Tile,
  },
  data() {
    return {
      board,
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
    };
  },
  beforeMount() {
    this.rummikub = new rummikub.Rummikub();
    this.user = new rummikub.User('kyle');
    this.rummikub.users.push(this.user);
    this.rummikub.initializeGame();
    this.shelf[0].splice(0, this.user.own.length);
    this.shelf[0] = this.user.own.concat(this.shelf[0]);

    for (let row = 0; row < 18; row++) {
      this.grid[row] = [];
      for (let col = 0; col < 32; col++) {
        this.grid[row][col] = {};
      }
    }
    window._game = this;
  },
  mounted() {
    this.boardHeight = this.$refs.board.clientHeight;
  },
  methods: {
    onStartDrag(config, index) {
      console.log(config, index);
      // this.$set(this.tileTouches, index.touchIndex, index);
      // window.addEventListener(this.$store.state.eventTypes.move, this.onDrag);
      // this.resetRowCol();
      // this.dragging = true;
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
            this.$set(this.tileSlot, index.touchIndex, {
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
      let tileSlot = this.tileSlot[index.touchIndex];
      if (tileSlot.shelf) this.updateShelf(config, index, tileSlot);
      else this.updateBoard(config, index, tileSlot);
      // this.dragging = false;
    },
    resetRowCol() {
      this.boardRow = -1;
      this.boardCol = -1;
      this.shelfRow = -1;
      this.shelfCol = -1;
      // this.highlights = [];
    },
    updateBoard(config, index, tileSlot) {
      // if (this.boardRow < 0 || this.boardCol < 0) return;
      if (this.board[tileSlot.row][tileSlot.col]) return;

      this.board[tileSlot.row].splice(tileSlot.col, 1, config);
      // this.board[tileSlot.row][tileSlot.col] = config;

      if (config.board) {
        // this.board[index.row][index.col] = null;
        this.board[index.row].splice(index.col, 1, null);
      } else {
        config.board = true;
        // this.shelf[index.row][index.col] = null;
        this.shelf[index.row].splice(index.col, 1, null);
      }
      // this.tileSlot[index.touchIndex]
      // this.$forceUpdate();
      // setTimeout(() => {
        this.$delete(this.tileSlot, index.touchIndex);
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
      } else {
        // this.shelf[index.row][index.col] = null;
        this.shelf[index.row].splice(index.col, 1, null);
      }
      // this.$forceUpdate();
      // setTimeout(() => {
        this.$delete(this.tileSlot, index.touchIndex);
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
#users .user {
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
  margin-right: 10px;
  box-sizing: border-box;
}
#users .user.active {
  background: rgb(131, 35, 35);
  color: white;
}
#actions {
  position: absolute;
  top: 10px;
  right: 20px;
  display: flex;
  z-index: 10;
}
.button {
  background: #e5dcc7;
  border-radius: 4px;
  box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.2),
    inset -1px -1px 2px rgba(0, 0, 0, 0.2), 0 2px 5px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-bottom-color: rgba(0, 0, 0, 0.5);
  border-right-color: rgba(0, 0, 0, 0.5);

  padding: 8px 16px;
  font-size: 22px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  box-sizing: border-box;
  cursor: pointer;
}
.button.active,
.button:hover {
  background: rgb(131, 35, 35);
  color: white;
}
</style>
