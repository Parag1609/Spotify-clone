let songs;
let currfolder;
let curridx;
let previdx;
let nextidx;
let currentsong = new Audio();
let folders=[];

// Hardcoded song data to ensure it works on GitHub Pages
const hardcodedFolders = [
    { folder: '1anuv', title: 'Anuv Jain', description: 'Top hits by Anuv Jain', cover: 'cover.png' },
    { folder: '2arijit', title: 'Arijit Singh', description: 'Melodious songs by Arijit', cover: 'cover.png' },
    { folder: '3atif', title: 'Atif Aslam', description: 'All-time hits by Atif', cover: 'cover.png' }
];

function getSongs(folder) {
    currfolder = folder;
    if (folder === 'songs/1anuv') {
        songs = ['song1.mp3', 'song2.mp3', 'song3.mp3'];
    } else if (folder === 'songs/2arijit') {
        songs = ['song4.mp3', 'song5.mp3', 'song6.mp3'];
    } else if (folder === 'songs/3atif') {
        songs = ['song7.mp3', 'song8.mp3', 'song9.mp3'];
    }

    // Show all songs in playlist
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML += `<li>
        <img class="invert" src="images/music.svg">
        <div class="info">
            <div>${song.replaceAll('%20', ' ')}</div> 
        </div>
        <div class="playnow">
         <span>Play Now</span>
             <img class="invert" src="images/play.svg" alt="">
        </div>
        </li>`;
    }

    // Attach an event listener to each song
    var s = document.querySelectorAll(".songList ul li");
    s.forEach(list => {
        list.addEventListener("click", function () {
            var music = list.querySelector(".info").firstElementChild.innerHTML.trim();
            playmusic(music);
        });
    });
}

const playmusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentsong.play();
        play.src = "images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

function secondstominuteseconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    var minutes = Math.floor(seconds / 60);
    var seconds = Math.floor(seconds % 60);
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;
    return `${minutes}:${seconds}`;
}

function displayalbums() {
    for (const folder of hardcodedFolders) {
        document.getElementsByClassName("cardContainer")[0].innerHTML += `
        <div data-folder="songs/${folder.folder}" class="card">
                        <div  class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                                <circle cx="12" cy="12" r="11" fill="#1DB954"/>
                                <path d="M9 7v10l8-5z" fill="#000000"/>
                              </svg>
                        </div>
                        <img src="/songs/${folder.folder}/${folder.cover}" alt="">
                        <h2>${folder.title}</h2>
                        <p>${folder.description}</p>
                    </div>`;
    }

    // Load the playlist when the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = getSongs(item.currentTarget.dataset.folder);
            playmusic(songs[0]);
        });
    });
}

async function main() {
    getSongs(`songs/1anuv`);
    playmusic(songs[0], true);

    // Display all albums
    displayalbums();

    // Event listeners for play/pause/next/previous
    play.addEventListener("click", function () {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "images/pause.svg";
        } else {
            currentsong.pause();
            play.src = "images/play.svg";
        }
    });

    next.addEventListener("click", function () {
        let current = currentsong.src.split(`/${currfolder}/`)[1];
        curridx = songs.indexOf(current);
        nextidx = (curridx + 1) % songs.length;
        playmusic(songs[nextidx]);
    });

    previous.addEventListener("click", function () {
        let current = currentsong.src.split(`/${currfolder}/`)[1];
        curridx = songs.indexOf(current);
        previdx = (curridx - 1 + songs.length) % songs.length;
        playmusic(songs[previdx]);
    });
}

main();
