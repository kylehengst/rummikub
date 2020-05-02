function playSound(id) {
  var hitSound = new Audio();
  hitSound = document.getElementById(id);
  hitSound.currentTime = 0;
  hitSound.play();
}

export default { playSound };
