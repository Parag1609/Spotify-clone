let songs;
let currfolder;
let curridx;
let previdx;
let nextidx;
let currentsong = new Audio();
let folders=[];
async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let i = 0; i < as.length; i++) {
        let ele = as[i];
        if (ele.href.endsWith(".mp3")) {
            songs.push(ele.href.split(`/${folder}/`)[1]);
        }
    }


    //show all songs in playlist
     
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
    //attach an eventlistener to each song
    var s = document.querySelectorAll(".songList ul li");
    s.forEach(list => {
        list.addEventListener("click", function () {
            var music = list.querySelector(".info").firstElementChild.innerHTML.trim();
            playmusic(music);
        });
    });
    return songs;
}

const playmusic = (track, pause = false) => {
    //var audio=new Audio("/songs/"+track);
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

async function displayalbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");

    let array=Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/songs/")[1];
            folders.push(folder);
            console.log(folders[0]);
            //console.log(folders);
            //get the metadata of folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();
            //console.log(response);
            document.getElementsByClassName("cardContainer")[0].innerHTML += `
            <div data-folder="${folder}" class="card">
                            <div  class="play">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                                    <!-- Circular green background -->
                                    <circle cx="12" cy="12" r="11" fill="#1DB954"/>
                                    
                                    <!-- Smaller play button centered -->
                                    <path d="M9 7v10l8-5z" fill="#000000"/>
                                  </svg>
                            </div>
                            <img src="/songs/${folder}/cover.png" alt="">
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                        </div>`;
        }
    }

     //load the playlist when the card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset.folder);
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0]);
        });
        
    });
   
}


async function main() {
    //get the list of songs
   
    await getSongs(`songs/1anuv`);
    playmusic(songs[0],true);

    // display all the albums on the page
    await displayalbums();
    
    //attach eventlistener to play,next and previous
    play.addEventListener("click", function () {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "images/pause.svg";
        }
        else {
            currentsong.pause();
            play.src = "images/play.svg";
        }
    });

    next.addEventListener("click", function () {
        let current = currentsong.src.split(`/${currfolder}/`)[1];
        curridx = songs.indexOf(current);
        /* curridx=songs.findIndex(index);
        function index(s){
           return s==current;
       } */
        if (curridx == songs.length - 1) {
            nextidx = 0;
        }
        else {
            nextidx = curridx + 1;
        }
        playmusic(songs[nextidx]);
    });

    previous.addEventListener("click", function () {
        let current = currentsong.src.split(`/${currfolder}/`)[1];
        curridx = songs.indexOf(current);

        if (curridx == 0) {
            previdx = songs.length - 1;
        }
        else {
            previdx = curridx - 1;
        }
        playmusic(songs[previdx]);
    });
    //listen for timeupdate event
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondstominuteseconds(currentsong.currentTime)}/${secondstominuteseconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left = `${(currentsong.currentTime / currentsong.duration) * 100}%`;
    });
    //add an eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", function (e) {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + '%';
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;

    });
    //add an eventlistener to hamburger
    document.querySelector(".hamburger").addEventListener("click", function () {
        document.querySelector(".left").style.left = 0;
    });
    //add an eventlistener to close button
    document.querySelector(".close").addEventListener("click", function () {
        document.querySelector(".left").style.left = "-120%";
    });

    //add eventlistener to volume
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", function (e) {
        currentsong.volume = parseFloat((e.target.value) / 100);
        if(currentsong.volume>0){
            document.querySelector(".volume img").src="images/volume.svg"; 
        }
    });
   //add eventlistener to mute track
   
    document.querySelector(".volume img").addEventListener("click",e=>{
      
        if(e.target.src.includes("volume.svg")){
            e.target.src="images/mute.svg";
            currentsong.volume=0;
            document.querySelector(".volume").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src="images/volume.svg";
            currentsong.volume=0.1;
            document.querySelector(".volume").getElementsByTagName("input")[0].value=10;
        }
    });
    //add eventlistener to check if currentsong has ended
    currentsong.addEventListener("ended",function(){
        if(currentsong.currentTime==currentsong.duration){
            let current = currentsong.src.split(`/${currfolder}/`)[1];
            curridx = songs.indexOf(current);
            /* curridx=songs.findIndex(index);
            function index(s){
               return s==current;
           } */
            if (curridx == songs.length - 1) {
                nextidx = 0;
            }
            else {
                nextidx = curridx + 1;
            }
            playmusic(songs[nextidx]);
        }
    });

}
main();
