const 
    $ = document.querySelector.bind(document),
    $$ = document.querySelectorAll.bind(document);

    const PLAYER_STOREAGE_KEY = 'F8_PLAYER'

    /** Các chức năng:
 * A1 - Render playlist ra màn hình 
 * A2 - CD rotate 
 * A3 - Ấn để ra playlist 
 * A4 - Play,pause,seek + chỉnh âm lượng
 * A5 - Next, previous 
 * A6 - Random song 
 * A7 - Next or Repeat when ended
 * A8 - Active song trong playlist
 * A9 - Scroll active song lên view
 * A10 - Play song khi click
 */

    const cd = $('.cd')
    const heading = $('header h2')
    const cdThumb=$('.cd-thumb')
    const audio = $('#audio')
    const playBtn=$('#btn-toggle-play')
    const player= $('.player')
    const progress = $('#progress')
    const nextBtn = $('.btn-next')
    const prevBtn = $('.btn-prev')
    const randomBtn = $('.btn-random')
    const repeatBtn = $('.btn-repeat')
    const playlist = $('.playlist')
    const volumeBtn = $('.volume')
    const volumeBar = $('.volume-bar')
    const volume = $('.volume-bar__value')

const app={
    currentIndex: 0,
    currentVolume: 1,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isMute: false,
    isHoldVolumeBar: false,
    config: JSON.parse(localStorage.getItem('PLAYER_STOREAGE_KEY')) ||{},
    songs: [

        {
            name: 'SummerTime',
            singer: 'K391',
            path: './assets/mp3/Summertime-K391.mp3',
            image: './assets/png/Summer Time.jpg',
        },
        {
            name: 'Monody',
            singer: 'TheFatRat',
            path: './assets/mp3/Monody-TheFatRatLauraBrehm.mp3',
            image: './assets/png/The Fat Rat.jpg',
        },
        {
            name: 'MyLove',
            singer: 'WestLife',
            path: './assets/mp3/My Love - Westlife.mp3',
            image: './assets/png/My Love.jpg',
        },
        {
            name: 'Heal The World',
            singer: 'Michael Jackson',
            path: './assets/mp3/Heal The World - Michael Jackson.mp3',
            image: './assets/png/HealTheWorld.jpg',
        },
        {
            name: 'Happy New Year',
            singer: 'ABBA',
            path: './assets/mp3/Happy New Year - ABBA.mp3',
            image: './assets/png/HappyNewYear.jpg',
        },
        {
            name: 'Aloha',
            singer: 'Tung Lam',
            path: './assets/mp3/Aloha English Version_ - Various Artists.mp3',
            image: './assets/png/Aloha.jpg',
        },
        {
            name: 'Un-Estate Italiana',
            singer: 'Gianna Nannini',
            path: './assets/mp3/Un_Estate Italiana - Edoardo Bennato_ Gi.mp3',
            image: './assets/png/SummerItaly90.jpg',
        },
        {
            name: 'Tự Sự',
            singer: 'Orange',
            path: './assets/mp3/Tu Su Qua Ben Lam Chi OST_ - Orange.mp3',
            image: './assets/png/TựSự.jpg',
        },
        {
            name: 'Waiting For You',
            singer: 'Mono',
            path: './assets/mp3/WaitingForYou-MONOOnionn-7733882.mp3',
            image: './assets/png/WaitingForYou.jpg',
        },
        {
            name: 'Sài Gòn hôm nay mưa',
            singer: 'JSOL-Hoàng Duyên',
            path: './assets/mp3/Sai Gon Hom Nay Mua - JSOL_ Hoang Duyen.mp3',
            image: './assets/png/Sài Gòn hôm nay mưa.jpg',
        },
        
    ],
    setConfig : function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STOREAGE_KEY,JSON.stringify(this.config));
    },
    //* Render songs
    render: function(){
        const htmls=this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML =htmls.join('');
    },
    // Hàm định nghĩa thuộc tính object
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong',{
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const _this = this;
        const cdWidth=cd.offsetWidth
        
        //Xử lý CD quay
        const cdThumbAnimate= cdThumb.animate([
            { transform:'rotate(360deg)'}
        ], {
              duration: 20000,
              iterations: Infinity
        })
        cdThumbAnimate.pause()

        
        //Xử lý sự kiện phóng to/thu nhỏ CD
        document.onscroll =function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth >0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xử lý khi click play /
        playBtn.onclick = function () {
            if (_this.isPlaying) {
              audio.pause();
            } else {
              audio.play();
            }
          };
        //Khi song đc chạy
        audio.onplay = function(){
            _this.isPlaying=true
            player.classList.add('playing');
            cdThumbAnimate.play()
        }
        //Khi song pause
        audio.onpause = function(){
            _this.isPlaying=false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi thay đổi tiến độ bài hát
        audio.ontimeupdate= function(){
            if(audio.duration){
                const progressPercent =Math.floor(audio.currentTime /audio.duration *100);
                progress.value = progressPercent
            }
        }

        //Xử lý khi tua
        progress.oninput= function(e){
            const seekTime= audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        /*// Xử lí âm lượng 
        volumnBar.oninput = function(e){
            theVolume = e.target.value /100;
            audio.volume = theVolume;
            if(theVolume === 0){
                volumnUp.classList.remove('overBlock');
                volumnMute.classList.add('overBlock');
            }else{
                volumnMute.classList.remove('overBlock');
                volumnUp.classList.add('overBlock');
            }
        }
        volumnMute.onclick = function(){
            volumnUp.classList.remove('overBlock');
            volumnMute.classList.add('overBlock');
            audio.volume = 0;
            volumnBar.value = 0;
        }
        volumnUp.onclick = function(){
            volumnMute.classList.remove('overBlock');
            volumnUp.classList.add('overBlock');
            audio.volume = 1;
            volumnBar.value = 100;
        }*/
        //Khi next bài, khi prev bài
        nextBtn.onclick= function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        prevBtn.onclick= function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        
        //Random bật tắt
        randomBtn.onclick= function(){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
        }
         
        //Xử lý phát lại song
        repeatBtn.onclick= function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        //Xử lý nextSong khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }    
        //Lắng nghe hành vi click vào playlist
        playlist.onclick= function(e){
            const songNode= e.target.closest('.song:not(.active)');
            if(songNode ||e.target.closest('.option')){
                //Xử lý click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if(e.target.closest('.option')){

                }
            }
        }
        //Xử lý âm lượng
        volumeBtn.onclick = function() {
            _this.isMute = !_this.isMute
            this.classList.toggle('active', _this.isMute)
            if(_this.isMute)
                audio.volume = 0
            else 
                audio.volume = _this.currentVolume
        }
        // Xử lý thanh volume
        volumeBar.onmousedown = function(e) {
            if(e.offsetX >= 0 && e.offsetX <= this.offsetWidth){
                _this.currentVolume = (e.offsetX / this.offsetWidth).toFixed(2)
                audio.volume = _this.currentVolume
                volume.style.width = audio.volume * 100 + '%'
                if(audio.volume === 0)  _this.isMute = true
                else _this.isMute = false
                _this.isHoldVolumeBar = true
            }
        }
        volumeBar.onmousemove = function(e) {
            if(_this.isHoldVolumeBar){
                if(e.offsetX >= 0 && e.offsetX <= this.offsetWidth){
                    _this.currentVolume = (e.offsetX / this.offsetWidth).toFixed(2)
                    audio.volume = _this.currentVolume
                    volume.style.width = audio.volume * 100 + '%'
                    if(audio.volume === 0)  _this.isMute = true
                    else _this.isMute = false
                }
            }
        }
        audio.onvolumechange = function() {
            if(_this.isMute){
                volumeBtn.classList.add('active')
                volume.style.width = 0
            }
            else {
                volumeBtn.classList.remove('active')
                volume.style.width = this.volume * 100 + '%'
            }
        }
        window.onmouseup = function() {
           
            _this.isHoldVolumeBar = false
        }
    },
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'center'
            })
        },300)
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src=this.currentSong.path
    },
    loadConfig: function(){
        this.isRandom=this.config.isRandom
        this.isRepeat=this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >=this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex <0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        do {
            newIndex =Math.floor(Math.random() * this.songs.length)
        }while(newIndex=== this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function(){
        //gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        //Định nghĩa các thuộc tính Object
        this.defineProperties(); 
        //Lắng nghe/xử lý các sự kiện(DOM events)
        this.handleEvents();
        //Tải thông tin bài hát đầu tiên vào User Interface(UI)
        this.loadCurrentSong();
        //Render playlist
        this.render();
        //hiển thị trạng thái ban đầu của button repeat, random
        randomBtn.classList.toggle('active',_this.isRandom)
        repeatBtn.classList.toggle('active',_this.isRepeat)
    }
}
 app.start()