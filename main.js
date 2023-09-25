document.addEventListener('DOMContentLoaded', () => {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    // contain elements
    const containerElement = $('.music-container');
    const audioElement = $('.audio');
    const headerElement = $('.header');
    const headerImg = $('.header__image');

    // Control Elements 
    const pauseBtn = $('.header__btn--pause');
    const playBtn = $('.header__btn--play');
    const progressEl = $('#progress')
    const nextBtn = $('.header__btn--next');
    const preBtn = $('.header__btn--back');
    const randomBtn = $('.header__btn--random');
    const repeatBtn = $('.header__btn--repeat');
    const rainAudioElement = $('.rain-effect');

    // create rotate event
    const cdThumbAnimate = headerImg.querySelector('.cd-thumb').animate([
        {transform : 'rotate(360deg)'}
    ] , {
        duration: 20000,  //10sec
        iterations: Infinity,
    })

    cdThumbAnimate.pause();

    const app = { 

        currentIndex : 0,

        isRandom: false,

        isRepeat : false,

        songs : [
        {
            id: 1,
            name: "nàng thơ",
            singer: "hoàng dũng"
        },

        {
            id: 2,
            name: "Nếu ngày ấy",
            singer: "Soobin"
        },

        {
            id: 3,
            name: "Chạm khẽ tim anh một chút thôi",
            singer: "Noo Phước Thịnh"
        },

        {
            id: 4,
            name: "Phía sau một cô gái",
            singer: "Soobin"
        },

        {
            id: 5,
            name: "Thằng điên",
            singer: "Phương ly ft Justatee"
        },

        {
            id: 6,
            name: "Lối Nhỏ",
            singer: "Đen"
        },

        {
            id: 7,
            name: "Những kẻ mộng mơ",
            singer: "Noo Phước Thịnh"
        },

        {
            id: 8,
            name: "Có người",
            singer: "Vũ Cát Tường"
        },

        {
            id: 9,
            name: "Yêu thương ngày đó",
            singer: "Soobin"
        },

        {
            id: 10,
            name: "Sao em vô tình",
            singer: "Jack ft Liam"
        },

    ],

        renderMusic : function()
        {
            const _this = this;
            headerElement.offsetWidth = containerElement.offsetWidth
            rainAudioElement.volume = 0.3;
            rainAudioElement.play();
            // lấy ra mã html
            const htmls = this.songs.map((song, index)=> {
                return `<div class="music ${index === this.currentIndex?'playing':""}">
                            <img src="./music_image/${index+1}.png" alt="Music Image" class="music__img">
                            <div class="music__desc">
                                <h3 class="music__name">${song.name}</h3>
                                <h6 class="music__singer">${song.singer}</h6>
                            </div>
                            <i class="fa-solid fa-ellipsis option"></i>
                        </div>`
            })

        // đưa các phần tử này lần lượt vào thẻ chứa nhạc container
            containerElement.innerHTML = htmls.join('');      

            // Click vào phần option thì không chuyển sang bài mới 
            var options = $$('.option');
            options.forEach((option, index) => {
                option.onclick = function(e)
                {
                    // Lúc này khi click vào option thì chặn được hiệu ứng chuyển bài 
                    e.stopPropagation();
                    // show options (remove + ...)
                }
            })
            
            var songList = $$('.music');
            // duyệt qua từng song trong songList rồi lắng nghe sự kiện click vào
            songList.forEach((song, index) => {
                song.onclick = function(e)
                {
                    // Nếu click vào bài hát khác bài hiện tại thì mới chuyển hướng sang bài khác 
                    if(index !== _this.currentIndex)
                    {
                        _this.currentIndex = index;
                        _this.loadCurrentSong();
                        _this.changeStateBtn(pauseBtn , playBtn);
                        _this.changeStateAudio(true);
                        _this.scrollActiveSong();
                        _this.renderMusic();
                    }
                } });
        },   

        changeStateBtn(first , second) {
            first.style.display = 'none';
            second.style.display = 'inline-block';
        },

        changeStateAudio (flag) {
            if(flag)
            {
                audioElement.play();
                cdThumbAnimate.play();
            }
            else {
                audioElement.pause();
                cdThumbAnimate.pause();
            }
        },

        scrollActiveSong : function () {
            setTimeout( () => {
                $('.music.playing').scrollIntoView({
                    behavior : "smooth",
                    block : "nearest",
                    inline : "end"
                })
            }, 200)
        },

        handleEvents : function() {

            // _this : chính là app , đại diện cho cả chương trình 
            const _this = this;        
                
            window.onscroll = function(e)
            {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                
                if(scrollTop === 0)
                {
                    headerImg.style.width = '250px';
                    headerImg.style.height = '250px';
                }
                else if(scrollTop > 140)
                {
                    const newWidth = headerImg.offsetWidth - scrollTop;           
                    headerImg.style.width = newWidth > 0 ? newWidth + 'px' : 0;
                    headerImg.style.height = newWidth > 0 ? newWidth + 'px' : 0;
                    headerImg.style.opacity = newWidth / headerImg.offsetWidth;
                }
                else {
                    
                    const newWidth = headerImg.offsetWidth + scrollTop;           
                    headerImg.style.width = newWidth <= 250 ? newWidth + 'px' : 250 + 'px';
                    headerImg.style.height = newWidth <= 250 ? newWidth + 'px' : 250 + 'px';
                    headerImg.style.opacity = newWidth / headerImg.offsetWidth;
                }           
                
            }
            
            // Bắt sự kiện khi tua thanh nhạc : onchange
            progressEl.onchange = function(e)
            {
                audioElement.currentTime = this.value*audioElement.duration/100;          
            }

            pauseBtn.onclick = function(e)
            {
                _this.changeStateBtn(this, playBtn);
            _this.changeStateAudio(true);
            }

            playBtn.onclick = function(e)
            {
                _this.changeStateBtn(this, pauseBtn);
                _this.changeStateAudio(0);
                
            }

            nextBtn.onclick = function(e)
            {
                if(_this.isRandom)
                {
                    _this.playRandomSong();
                }
                else {                
                    _this.moveNextSong();
                    progressEl.value = 0;
                    if(pauseBtn.style.display === 'none')
                    {
                        audioElement.play();
                    }
                }
            }

            preBtn.onclick = function(e)
            {
                if(_this.isRandom)
                {
                    _this.playRandomSong();
                }
                else{
                    _this.movePreviousSong();
                    progressEl.value = 0;
                    if(pauseBtn.style.display === 'none')
                    {
                        audioElement.play();
                    }
                }
            }

            // Khi tiến độ bài hát thay đổi 
            audioElement.ontimeupdate = function(e)
            {
            
                if(this.duration)
                {
                    if (this.currentTime === this.duration) // hết bài
                    {
                    if(_this.isRepeat)
                    {
                            progressEl.value = 0;
                            this.play();
                    }
                    else {
                            if(_this.isRandom)
                            {
                                _this.playRandomSong()
                            }
                            else {
                                _this.moveNextSong();
                                progressEl.value = 0;
                                this.play();
                                return;
                            }    
                    }

                    }
                    const progressPercent = Math.ceil(this.currentTime/this.duration*100);
                    progressEl.value = progressPercent;                
                }           

            }
                        
            // xử lí bật / tắt random
            randomBtn.onclick = function(e)
            {
                _this.isRandom = !_this.isRandom;
                e.target.classList.toggle('active', _this.isRandom);     
            }

            // xử lí sự kiện repeat trên giao diện
            repeatBtn.onclick = function(e)
            {
                _this.isRepeat = !_this.isRepeat;
                e.target.classList.toggle('active', _this.isRepeat);
            }

            // Khi resize music container thì header phải resize theo luôn bằng
            window.onresize = (event) => {
                headerElement.offsetWidth = containerElement.offsetWidth
            }
                

        },    
        
        getCurrentSong ()
        {
            return this.songs[this.currentIndex];
        },
        
        // Bài nhạc đang phát làm nổi bật ở playlist (chuyển đổi chữ thành màu khác )
        
        loadCurrentSong : function()
        {
            let currentSong = this.getCurrentSong();
            headerElement.querySelector('.header__title-name').innerText = currentSong.name;
            headerElement.querySelector('.header__title-singer').innerText = currentSong.singer;
            headerElement.querySelector('.cd-thumb').style.backgroundImage = `url('./music_image/${currentSong.id}.png')`
            audioElement.src = `./music_list/${currentSong.id}.mp3`;
        },
        
        moveNextSong ()
        {
            // hàm này là hàm để di chuyển đến bài hát tiếp theo
            this.currentIndex += 1;
            if (this.currentIndex >= this.songs.length)
            {
                // nếu index chạm số lượng bài nhạc tối đa thì cho index trở lại 0
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
            this.renderMusic();
            this.scrollActiveSong();
        },

        movePreviousSong ()
        {
            this.currentIndex--;
            if(this.currentIndex < 0)
            {
                this.currentIndex = this.songs.length - 1;
            }
            this.loadCurrentSong();
            this.renderMusic();
            this.scrollActiveSong();
        },

        playRandomSong () {
            // 0 <= current index <= songs.length
            let random;
            do {
                // random ra một index khác với index hiện tại
                random = Math.floor(Math.random()*this.songs.length);     
            } while (random === this.currentIndex);
            this.currentIndex = random;
            this.loadCurrentSong();
            this.renderMusic();
            this.scrollActiveSong();
            this.changeStateBtn(pauseBtn , playBtn);
            this.changeStateAudio(true);
        },

        start ()
        {
            // Tải thông tin bài hát đầu tiên vào UI và thẻ audio
            this.loadCurrentSong();

            // hiển thị danh sách bài hát (show Playlist)
            this.renderMusic();      

            // set up các events có trên web
            this.handleEvents();
        }

    }

    // Bắt đầu web bằng cách gọi hàm start
        app.start();
    
})