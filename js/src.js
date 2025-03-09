let songs;
let currfolder;
let curridx;
let previdx;
let nextidx;
let currentsong = new Audio();
let folders = [];

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/songs/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    // Clear existing songs array
    songs = [];
    for (let i = 0; i < as.length; i++) {
        let ele = as[i];
        if (ele.href.endsWith(".mp3")) {
            songs.push(ele.href.split(`/${folder}/`)[1]);
        }
    }

    // Show all songs in the playlist
    let songUl = document.querySelector(".songList ul");
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML += `
        <li>
            <img class="invert" src="images/music.svg">
            <div class="info">
                <div>${decodeURIComponent(song)}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="images/play.svg" alt="">
            </div>
        </li>`;
    }

    // Attach event listener to each song
    let songItems = document.querySelectorAll(".songList ul li");
    songItems.forEach((list, index) => {
        list.addEventListener("click", () => {
            playMusic(songs[index]);
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    currentsong.src = `/songs/${currfolder}/` + track;
    if (!pause) {
        currentsong.play();
        play.src = "images/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    let minutes = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    if (minutes < 10) minutes = '0' + minutes;
    if (sec < 10) sec = '0' + sec;
    return `${minutes}:${sec}`;
}

async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");

    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/songs/")[1];
            folders.push(folder);

            // Fetch album metadata
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();

            document.querySelector(".cardContainer").innerHTML += `
            <div data-folder="${folder}" class="card">
                <div class="play">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                        <circle cx="12" cy="12" r="11" fill="#1DB954"/>
                        <path d="M9 7v10l8-5z" fill="#000000"/>
                    </svg>
                </div>
                <img src="/songs/${folder}/cover.png" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`;
        }
    }

    // Attach event listener to each album
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async (item) => {
            let folder = item.currentTarget.dataset.folder;
            songs = await getSongs(`songs/${folder}`);
            playMusic(songs[0]);
        });
    });
}

// ✅ Function to play next song
function playNext() {
    let current = currentsong.src.split(`/${currfolder}/`)[1];
    curridx = songs.indexOf(current);

    if (curridx == songs.length - 1) {
        nextidx = 0;
    } else {
        nextidx = curridx + 1;
    }
    playMusic(songs[nextidx]);
}

// ✅ Function to play previous song
function playPrevious() {
    let current = currentsong.src.split(`/${currfolder}/`)[1];
    curridx = songs.indexOf(current);

    if (curridx == 0) {
        previdx = songs.length - 1;
    } else {
        previdx = curridx - 1;
    }
    playMusic(songs[previdx]);
}

async function main() {
    // Load the first playlist on page load
    await getSongs(`songs/1anuv`);
    playMusic(songs[0], true);

    // Load all the albums
    await displayAlbums();

    // ✅ Event listeners for play/pause, next, and previous
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "images/pause.svg";
        } else {
            currentsong.pause();
            play.src = "images/play.svg";
        }
    });

    next.addEventListener("click", playNext);
    previous.addEventListener("click", playPrevious);

    // ✅ Update the song progress bar
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentsong.currentTime)} / ${secondsToMinutes(currentsong.duration)}`;
        document.querySelector(".circle").style.left = `${(currentsong.currentTime / currentsong.duration) * 100}%`;
    });

    // ✅ Seek song when user clicks on seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.clientWidth) * 100;
        document.querySelector(".circle").style.left = `${percent}%`;
        currentsong.currentTime = (currentsong.duration * percent) / 100;
    });

    // ✅ Hamburger and close button functionality
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // ✅ Volume control functionality
    document.querySelector(".volume input").addEventListener("input", (e) => {
        currentsong.volume = e.target.value / 100;
    });

    // ✅ Automatically play the next song when one ends
    currentsong.addEventListener("ended", playNext);
}
main();
