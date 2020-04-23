<template>
  <div class="tile" ref="tile" :class="{ dragging: dragging }" :style="style">
    <div :class="config.color">
      <span v-if="config.isJoker">
        <img src="img/joker.png" alt="" />
      </span>
      <span v-else>{{ config.score }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['config', 'row', 'col', 'user'],
  data() {
    return {
      touchIndex: 0,
      dragging: false,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
      left: 0,
      top: 0,
      eventTypes: {
        down: 'mousedown',
        move: 'mousemove',
        up: 'mouseup',
      },
    };
  },
  computed: {
    style() {
      if (!this.dragging) return {};
      return {
        left: this.left + this.offsetX + 'px',
        top: this.top + this.offsetY + 'px',
      };
    },
  },
  beforeMount() {
    if (this.$store.state.touch) {
      this.eventTypes.down = 'touchstart';
      this.eventTypes.move = 'touchmove';
      this.eventTypes.up = 'touchend';
    }
  },
  destroyed() {
    if (this.$refs.tile)
      this.$refs.tile.removeEventListener(
        this.eventTypes.down,
        this.onMouseDown
      );
  },
  mounted() {
    this.$refs.tile.addEventListener(this.eventTypes.down, this.onMouseDown);
  },
  methods: {
    getTouchIndex(evt) {
      let touchIndex = -1;
      if (this.$store.state.touch) {
        evt.touches.forEach((t, i) => {
          if (t.target != this.$refs.tile) return;
          touchIndex = i;
        });
      }
      return touchIndex;
    },
    onMouseDown(evt) {
      console.log(evt);
      this.touchIndex = this.getTouchIndex(evt);
      this.offsetX = 0;
      this.offsetY = 0;
      let x = this.$store.state.touch ? evt.touches[this.touchIndex].clientX : evt.x;
      let y = this.$store.state.touch ? evt.touches[this.touchIndex].clientY : evt.y;
      this.startX = x;
      this.startY = y;
      const rect = evt.target.getBoundingClientRect();
      this.left = rect.left;
      this.top = rect.top;
      window.addEventListener(this.eventTypes.up, this.onMouseUp);
      window.addEventListener(this.eventTypes.move, this.onMouseMove);
      this.$emit('startdrag', this.config, {
        row: this.row,
        col: this.col,
        touchIndex: this.touchIndex,
      });
      this.dragging = true;
      evt.stopPropagation();
      evt.preventDefault();
    },
    onMouseMove(evt) {
      this.touchIndex = this.getTouchIndex(evt);
      if (this.$store.state.touch && this.touchIndex < 0) return;
      let x = this.$store.state.touch ? evt.touches[this.touchIndex].clientX : evt.x;
      let y = this.$store.state.touch ? evt.touches[this.touchIndex].clientY : evt.y;
      this.offsetX = x - this.startX;
      this.offsetY = y - this.startY;
      //   evt.stopPropagation();
      //   evt.preventDefault();
      //   console.log(this.offsetX, this.offsetY);
      this.$emit('drag', this.config, {
        row: this.row,
        col: this.col,
        touchIndex: this.touchIndex,
        x,
        y
      });
    },
    onMouseUp(evt) {
      if (evt.target != this.$refs.tile) return;
      if (!this.dragging) return;
      // this.touchIndex = this.getTouchIndex(evt);
      // if (this.$store.state.touch && this.touchIndex < 0) return;
      this.dragging = false;
      window.removeEventListener(this.eventTypes.up, this.onMouseUp);
      window.removeEventListener(this.eventTypes.move, this.onMouseMove);
      this.$emit('stopdrag', this.config, {
        row: this.row,
        col: this.col,
        touchIndex: this.touchIndex,
      });
    },
  },
};
</script>

<style scoped>
.tile {
  user-select: none;
  width: 50px;
  height: 80px;
  display: flex;
  justify-content: center;
  background: #e5dcc7;
  border-radius: 4px;
  box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.2),
    inset -1px -1px 2px rgba(0, 0, 0, 0.2), 0 2px 5px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-bottom-color: rgba(0, 0, 0, 0.5);
  border-right-color: rgba(0, 0, 0, 0.5);
}
.tile * {
  touch-action: none;
  pointer-events: none;
}
.tile.dragging {
  pointer-events: none;
  touch-action: none;
  position: fixed;
  z-index: 1000;
  transform: scale(1.2);
  box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.2),
    inset -1px -1px 2px rgba(0, 0, 0, 0.2), 0 5px 20px rgba(0, 0, 0, 0.5);
}
.tile:hover {
  cursor: pointer;
}
.tile > div {
  user-select: none;
  margin-top: 10px;
  font-size: 25px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  font-weight: bold;
  border: 2px solid transparent;
  display: flex;
  line-height: 1;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  box-shadow: inset -2px -2px 4px rgba(255, 255, 255, 0.5),
    inset 2px 2px 4px rgba(0, 0, 0, 0.2);
}
.tile > div > span {
  display: flex;
}
.tile > div > span img {
  width: 40px;
  height: 40px;
}
.tile > div.red {
  border-color: #dc143c;
  color: #dc143c;
}
.tile > div.blue {
  border-color: #0000cd;
  color: #0000cd;
}
.tile > div.yellow {
  border-color: #eead0e;
  color: #eead0e;
}
.tile > div.black {
  border-color: black;
  color: black;
}
</style>
