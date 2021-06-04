/*!
 *
 * Evgeniy Ivanov - 2018
 * busforward@gmail.com
 * Skype: ivanov_ea
 *
 */

var app = {
    pageScroll: '',
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

function isLgWidth() { return $(window).width() >= app.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= app.mdWidth && $(window).width() < app.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= app.smWidth && $(window).width() < app.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < app.smWidth; } // < 768
function isIOS() { return app.iOS(); } // for iPhone iPad iPod
function isTouch() { return app.touchDevice(); } // for touch device


$(document).ready(function() {
    // Хак для клика по ссылке на iOS
    if (isIOS()) {
        $(function(){$(document).on('touchend', 'a', $.noop)});
    }

	// Запрет "отскока" страницы при клике по пустой ссылке с href="#"
	$('[href="#"]').click(function(event) {
		event.preventDefault();
	});

    // Inputmask.js
    // $('[name=tel]').inputmask("+9(999)999 99 99",{ showMaskOnHover: false });
    // formSubmit();

    checkOnResize();

    $('.form__select').select2({
        placeholder: $(this).data('placeholder'),
        // allowClear: true
    });

    $('.lang select').select2();

    let scrollOptions = {
        autohidemode: false,
        background: '#F2F2F2',
        cursorwidth: '4px',
        cursorborder: 'none',
        cursorborderradius: "7px",
        railoffset: "10px",
    };

    $('.form__select').on('select2:open', function() {
        let drop = $('.select2-container--open').last().find('.select2-results__options');
        if ($(this).attr('multiple')) {
            drop.addClass('multiple');
        }
        drop.niceScroll(scrollOptions);
    });
    $('.lang select').on('select2:open', () => {
        $('.select2-container--open').last().addClass('lang__drop');
    });

    $('.tooltip').tooltipster({
        side: ['right', 'bottom', 'left'],
        maxWidth: 331,
        arrow: false,
        contentAsHTML: true,
    });

    $('.scrollbar').niceScroll(scrollOptions);

    if ($('div').is('.chat__body')) {
        $('.chat__body').getNiceScroll(0).doScrollTop($('.chat__body').height());
    }

    $('.form__toggle').on('click', function() {
        $(this).toggleClass('active');
        $(this).closest('.form').find('.form__body').slideToggle();
    });


});

$(window).resize(function(event) {
    var windowWidth = $(window).width();
    // Запрещаем выполнение скриптов при смене только высоты вьюпорта (фикс для скролла в IOS и Android >=v.5)
    if (app.resized == windowWidth) { return; }
    app.resized = windowWidth;

	checkOnResize();
});

function checkOnResize() {
    // fontResize();
    clearAsideAfterResize();
}

// Stiky menu // Липкое меню. При прокрутке к элементу #header добавляется класс .stiky который и стилизуем
function stikyMenu() {
    let HeaderTop = $('header').offset().top + $('.home').innerHeight();
    let currentTop = $(window).scrollTop();

    setNavbarPosition();

    $(window).scroll(function(){
        setNavbarPosition();
    });

    function setNavbarPosition() {
        currentTop = $(window).scrollTop();

        if( currentTop > HeaderTop ) {
            $('header').addClass('stiky');
        } else {
            $('header').removeClass('stiky');
        }

        $('.navbar__link').each(function(index, el) {
            let section = $(this).attr('href');

            if ($('section').is(section)) {
                let offset = $(section).offset().top;

                if (offset <= currentTop && offset + $(section).innerHeight() > currentTop) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            }
        });
    }
}

function openMobileNav() {
    $('.aside__toggle').on('click', function() {
        var wrapp = $('.aside');

        wrapp.toggleClass('aside__open');
    });
}
openMobileNav();

function clearAsideAfterResize() {
    if (isLgWidth()) {
        $('.aside').removeClass('aside__open');
    }
}

// Scroll to ID // Плавный скролл к элементу при нажатии на ссылку. В ссылке указываем ID элемента
function srollToId() {
    $('[data-scroll-to]').click( function(){
        var scroll_el = $(this).attr('href');
        if ($(scroll_el).length != 0) {
            $('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500);
        }
        return false;
    });
}

function fontResize() {
    var windowWidth = $(window).width();
    if (windowWidth >= 1200) {
    	var fontSize = windowWidth/19.05;
    } else if (windowWidth < 1200) {
    	var fontSize = 60;
    }
	$('body').css('fontSize', fontSize + '%');
}

// Проверка направления прокрутки вверх/вниз
function checkDirectionScroll() {
    var tempScrollTop, currentScrollTop = 0;

    $(window).scroll(function(){
        currentScrollTop = $(window).scrollTop();

        if (tempScrollTop < currentScrollTop ) {
            app.pageScroll = "down";
        } else if (tempScrollTop > currentScrollTop ) {
            app.pageScroll = "up";
        }
        tempScrollTop = currentScrollTop;

    });
}
checkDirectionScroll();

// Видео youtube для страницы
function uploadYoutubeVideo() {
    if ($(".js-youtube")) {

        $(".js-youtube").each(function () {
            // Зная идентификатор видео на YouTube, легко можно найти его миниатюру
            $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

            // Добавляем иконку Play поверх миниатюры, чтобы было похоже на видеоплеер
            $(this).append($('<img src="img/play.svg" alt="Play" class="video__play">'));

        });

        $('.video__play, .video__prev').on('click', function () {
            // создаем iframe со включенной опцией autoplay
            let wrapp = $(this).closest('.js-youtube'),
                videoId = wrapp.attr('id'),
                iframe_url = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&autohide=1";

            if ($(this).data('params')) iframe_url += '&' + $(this).data('params');

            // Высота и ширина iframe должны быть такими же, как и у родительского блока
            let iframe = $('<iframe/>', {
                'frameborder': '0',
                'src': iframe_url,
                'allow': "autoplay"
            })

            // Заменяем миниатюру HTML5 плеером с YouTube
            $(this).closest('.video__wrapper').append(iframe);

        });
    }
}

function renderUploadedFile() {
    const form = document.querySelectorAll('.form__file');


    form.forEach(item => {
        const input = item.querySelector('[type="file"]'),
              preview = item.querySelector('.form__field');
        input.addEventListener('input', function() {
            updateImageDisplay(preview, input);
        });

        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('file__del')) {
                e.preventDefault();
                const input = item.querySelector('[type="file"]'),
                      preview = item.querySelector('.form__field'),
                      fileListArr = Array.from(input.files);

                fileListArr.splice(e.target.dataset.index, 1);

                e.target.closest('li').remove();

                if (item.querySelectorAll('li').length < 1) {
                    preview.removeChild(preview.firstChild);
                }
            }
        });
    });


    function updateImageDisplay(preview, input) {
        console.log('change');
        const inpList = preview.closest('.form__file').querySelector('.file__list');
        while(preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }

        const curFiles = input.files;

        if(curFiles.length > 0) {
            const list = document.createElement('ul');
            preview.appendChild(list);
            let i = 0;

            for(const file of curFiles) {
                const listItem = document.createElement('li');
                const para = document.createElement('span');
                const del = document.createElement('span');
                let fileName = file.name;
                if (file.name.length > 9) {
                    fileName = `...${file.name.substr(file.name.length - 6)}`;
                }
                del.classList.add('file__del');
                del.dataset.index = i;
                para.textContent = fileName;
                listItem.appendChild(para);
                listItem.appendChild(del);
                list.appendChild(listItem);
                i++;
            }
        }
    }
}

renderUploadedFile();
