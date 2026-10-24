// ---------- 1. Your song list ----------
// Change the titles and artists to match your real songs.
// The file names must match the files in your "songs" folder.
const songs = [
  { title: 'Song One',   artist: 'Artist One',   file: 'songs/song1.mp3' },
  { title: 'Song Two',   artist: 'Artist Two',   file: 'songs/song2.mp3' },
  { title: 'Song Three', artist: 'Artist Three', file: 'songs/song3.mp3' }
];

// ---------- 2. Get the elements from the page ----------
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressEl = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeEl = document.getElementById('volume');
const playlistEl = document.getElementById('playlist');

// ---------- 3. The audio player (invisible, does the real playing) ----------
const audio = new Audio();

let currentSong = 0;
let isPlaying = false;

// ---------- 4. Helper: turn seconds into m:ss (for example 75 becomes 1:15) ----------
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return minutes + ':' + (secs < 10 ? '0' : '') + secs;
}

// ---------- 5. Load a song ----------
function loadSong(index) {
  currentSong = index;
  titleEl.textContent = songs[index].title;
  artistEl.textContent = songs[index].artist;
  audio.src = songs[index].file;

  // Reset the progress bar and times
  progressEl.value = 0;
  currentTimeEl.textContent = '0:00';
  durationEl.textContent = '0:00';

  highlightPlaylist();
}

// ---------- 6. Play and pause ----------
function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = '&#10074;&#10074;';
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = '&#9654;';
}

playBtn.addEventListener('click', function () {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// ---------- 7. Next and previous ----------
function nextSong() {
  loadSong((currentSong + 1) % songs.length);
  playSong();
}

function prevSong() {
  loadSong((currentSong - 1 + songs.length) % songs.length);
  playSong();
}

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// ---------- 8. Progress bar and time ----------

// When the song's details are ready, show its total length
audio.addEventListener('loadedmetadata', function () {
  progressEl.max = audio.duration;
  durationEl.textContent = formatTime(audio.duration);
});

// While the song plays, move the bar and update the current time
audio.addEventListener('timeupdate', function () {
  progressEl.value = audio.currentTime;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// When the user drags the bar, jump to that point in the song
progressEl.addEventListener('input', function () {
  audio.currentTime = progressEl.value;
});

// ---------- 9. Autoplay: when a song ends, play the next one ----------
audio.addEventListener('ended', nextSong);

// ---------- 10. Volume ----------
// The slider gives 0 to 100, but the audio needs 0 to 1
audio.volume = volumeEl.value / 100;

volumeEl.addEventListener('input', function () {
  audio.volume = volumeEl.value / 100;
});

// ---------- 11. Playlist ----------
function buildPlaylist() {
  playlistEl.innerHTML = '';

  songs.forEach(function (song, index) {
    const li = document.createElement('li');
    li.textContent = song.title + ' - ' + song.artist;

    // Clicking a song in the list plays it
    li.addEventListener('click', function () {
      loadSong(index);
      playSong();
    });

    playlistEl.appendChild(li);
  });
}

// Highlight the song that is currently loaded
function highlightPlaylist() {
  const items = playlistEl.querySelectorAll('li');
  items.forEach(function (item, index) {
    item.classList.toggle('active', index === currentSong);
  });
}

// ---------- 12. Start ----------
buildPlaylist();
loadSong(0);