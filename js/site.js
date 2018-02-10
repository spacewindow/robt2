//  note: body-loading gets removed on window.load
// $('body').addClass('body-loading');

$(window).on('load', function() {
  renderDisplays();
});

function renderDisplays() {
  var chapterVideos = $('.display--chapter');
  if (chapterVideos.length > 0) {
    makeChapterVideo('.display--chapter');
  };
  var sliders = $('.display--slider');
  if (sliders.length > 0) {
    makeSlider('.display--slider');
  };
}


function makeSlider(target) {

  $(target).each(function() {

    var screenDiv = $(this).find('.display__screen').first();
    var captions = $(this).find('.display__captions').first();
    var slider = screenDiv.royalSlider({
      imageScaleMode: 'fit',
      controlNavigation: 'none',
      arrowsNav: true,
      fullscreen: {
        // fullscreen options go here
        enabled: true,
        nativeFS: true,
        buttonFS: true
      }
    }).data('royalSlider');

    // add rsDefault styles

    screenDiv.addClass('royalSlider rsDefault');

    // init styles
    captions.children().first().addClass('current');
    // set Nav state

    // insert navigation elements

    var sliderNav = $('<div class="display__nav"></div>');

    var sliderNavLeft = $('<div class="display__nav__arrow display__nav__arrow--left"></div>');
    var sliderNavRight = $('<div class="display__nav__arrow display__nav__arrow--right"></div>');
    var sliderBullet = '<a class="display__nav__bullet"></a>';

    for (var i = 0; i < slider.numSlides; i++) {
      var newBullet = $(sliderBullet);
      newBullet.data('ref', i);
      sliderNav.append(newBullet);
    }

    var sliderBullets = sliderNav.children('.display__nav__bullet');
    sliderBullets.click(function() {
      var ref = $(this).data('ref');
      slider.goTo(ref);
    });

    sliderNav.prepend(sliderNavLeft);
    sliderNav.append(sliderNavRight);

    // init style
    sliderNav.addClass('start');
    sliderBullets.first().addClass('current');

    sliderNavLeft.click(function() {
      slider.prev();
    });
    sliderNavRight.click(function() {
      slider.next();
    });

    sliderNav.insertBefore(captions);

    var sliderCount = $('.display__count');
    // sliderNav.append(sliderCount);
    //
    var sliderCurrentCount = $('.current-count');
    var sliderFullCount = $('.full-count');

    sliderCurrentCount.html(slider.currSlideId + 1);
    sliderFullCount.html(slider.numSlides);

    // sliderCount.append([sliderCurrentCount, sliderFullCount]);
    //
    // sliderFullscreen = $('<div class="display__fullscreen-button"><svg viewBox="0 0 300 300"  preserveAspectRatio="xMidYMid meet"><use x="0" y="0" href="#zoom"></use></svg><span>Fullscreen</span></div>');
    //
    // sliderNav.append(sliderFullscreen);
    // sliderNav.insertAfter(screenDiv);

    // activate fullscreen button

    // sliderFullscreen.on('click', function(){
    //   console.log(slider);
    //   slider.enterFullscreen();
    // });

    slider.ev.on('rsBeforeAnimStart', function() {
      sliderCurrentCount.html(slider.currSlideId + 1);
      if (slider.currSlideId === 0) {
        sliderNav.attr('class', 'display__nav start');
      } else if (slider.currSlideId === (slider.numSlides - 1)) {
        sliderNav.attr('class', 'display__nav end');
      } else {
        sliderNav.attr('class', 'display__nav middle');
      }
      //remove current class from all captions, then add to current
      captions.children().removeClass('current').eq(slider.currSlideId).addClass('current');
      //remove current class from all bullets, then add to current
      sliderBullets.removeClass('current').eq(slider.currSlideId).addClass('current');

    });

    // play Videos on slide

    var prevSlideVideo;
    var playSlideVideo = function() {
      if (prevSlideVideo) {
        prevSlideVideo.currentTime = 0;
        prevSlideVideo.pause();
      }
      var video = slider.currSlide.content.find('video');
      if (video.length) {
        prevSlideVideo = video[0];
        prevSlideVideo.play();
      } else {
        prevSlideVideo = null;
      }
    };
    slider.ev.on('rsAfterSlideChange', playSlideVideo);
    playSlideVideo();

  });
}

// Chapter videos

// $(window).on('load',


function makeChapterVideo(target) {

  $(target).each(function() {

    var captions = $(this).find('.display__captions').first();
    var video = $(this).find('video')[0];

    if (video !== undefined) {

      var captionsDiv = $(this).find('.display__captions').first();
      var captions;
      var bullets;
      var chapterNav = $('<div class="display__nav"></div>');
      var chapterNavLeft = $('<div class="display__nav__arrow display__nav__arrow--left"></div>');
      var chapterNavRight = $('<div class="display__nav__arrow display__nav__arrow--right"></div>');
      var currentChapter = 0;

      console.log(video);

      if (!video.textTracks) {
        console.log('Chapter Video is missing text track');
        return;
      }

      var track = video.textTracks[0];
      var cues = track.cues;
      // console.log(cues);
      track.mode = 'hidden';

      for (i = 0; i < cues.length; i++) {

        var bullet = $('<a class="display__nav__bullet" data-time = ' + cues[i].startTime + ' id="cue' + cues[i].id + '"></a>');
        chapterNav.append(bullet);


        var caption = $('<div class="caption">' + cues[i].text + '</div>');
        captionsDiv.append(caption);
      }

      // insert and add click to bullets

      chapterNav.insertBefore(captionsDiv);
      bullets = chapterNav.children();
      bullets.click(function() {
        console.log('go to ' + $(this).data('time'));
        video.currentTime = $(this).data('time');
      });

      // insert and add click to arrows

      chapterNavLeft.click(function() {
        if (currentChapter > 0) {
          currentChapter--;
          var targetTime = track.cues[currentChapter].startTime;
          console.log(targetTime);
          video.currentTime = targetTime;
        }
      });
      chapterNavRight.click(function() {
        if (currentChapter < track.cues.length - 1) {
          currentChapter++;
          var targetTime = track.cues[currentChapter].startTime;
          console.log(targetTime);
          video.currentTime = targetTime;
        }
      });

      chapterNav.prepend(chapterNavLeft);
      chapterNav.append(chapterNavRight);

      captions = captionsDiv.children();
      captions.eq(0).addClass('current');


      track.oncuechange = function(e) {
        var cue = this.activeCues[0];
        if (cue !== undefined) {
          currentChapter = cue.id;
          bullets.removeClass('current').eq(cue.id).addClass('current');
          captions.removeClass('current').eq(cue.id).addClass('current');
        }
      };

    }

  });


}


// scrolling animation

var lastScroll = 0;
var scrollDir = 'down';
// var thisBody = $('body')[0];

function deviceType(){
  var deviceOrient = window.orientation;
  var deviceWidth = window.innerWidth;

  if (deviceOrient === 0 && deviceWidth <= 414) {
    return 'mobile';
  }
  else{
    return 'desktop';
  }
}

function remToPx(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// function scrollDirection() {
//   console.log(window.scrollY);
//   if (window.scrollY > lastScroll) {
//     lastScroll = window.scrollY;
//     return 'down';
//   } else {
//     lastScroll = window.scrollY;
//     return 'up';
//   }
// }

var cgu_mod_TL = new TimelineMax({
  paused: true
});



$(window).on('load', function() {

  // stops FOUC

  $('body').removeClass('body-loading');

  // JS version of media query

  var device = deviceType();

  // alert(deviceType);

  // if(deviceOrient === )

  cgu_mod_TL
    .from('[src*="mod-block-1"]', 1, {
      x: '-50%',
      y: '-100%'
    }, 'start+=0.3')
    .from('[src*="mod-block-2"]', 1, {
      x: '20%',
      y: '-20%'
    }, 'start')
    .from('[src*="mod-block-3"]', 1, {
      x: '50%',
      y: '-150%'
    }, 'start+=0.3')
    .from('[src*="mod-block-4"]', 1, {
      x: '50%',
      y: '70%'
    }, 'start+=0.6');

  // set up CGU scrolling anim



  if ($('body').hasClass('e-newsletters')) {

    $(window).on('scroll', function() {

      // modular blocks animation
      var cgu_mod_progress = progress('#email-main', 0);
      cgu_mod_TL.progress(cgu_mod_progress);

      // if(cgu_mod_TL === 0)

      // mobile mail animation
      var cgu_mail_progress = progress('#email-mobile', 100);
      $('#mobile-edm').css('transform', 'translateY(-' + 32 * cgu_mail_progress + '%)');

    });



    if(device === 'desktop'){

      $('#email-main .sticky-element, #email-dynamic .sticky-element').stick_in_parent({offset_top: remToPx(2)});
    }



    // Fixed behaviour

    // if(deviceType() === 'desktop' ){
    //
    //   $(window).on('scroll', function() {
    //
    //     scrollDir = scrollDirection();
    //     var cgu_mod_progress = progress('#email-main', 0);
    //
    //
    //   });
    //
    // }



  }

  // if($('body').hasClass('index')){

  function initClass(ev) {
    if (window.pageYOffset > 100) {
      $('body').removeClass('init');
    }
    if (window.pageYOffset < 100) {
      $('body').addClass('init');
    }
  }

  initClass();
  window.onscroll = initClass
  // }

});


function progress(element, offsetStart) { // element is the selector string

  var scrollElement = $(element);
  var scrollTopStart = scrollElement.offset().top - offsetStart;
  var scrollTopEnd = scrollElement.height() / 2 + scrollTopStart;

  var currentPosition = window.pageYOffset;
  // console.log('IE POSITION', currentPosition);
  var progress;
  if (currentPosition < scrollTopStart) {
    progress = 0;
  } else if (currentPosition > scrollTopEnd) {
    progress = 1;
  } else {
    progress = ((currentPosition - scrollTopStart) / (scrollTopEnd - scrollTopStart));
  }
  return progress;

}

$(document).ready(function() {

  makeSlider("slider-hangtime");
  makeSlider("slider-campaigns");
  makeSlider("slider-vertical-vid");
  makeSlider("slider-wattyl1");
  makeSlider("slider-wattyl2");
  makeSlider("slider-poetry");
  makeSlider("slider-store-locator");

  $('#wattyl-video').on('click', function() {
    $(this).removeClass('placeholder').children('video').get(0).play();
  });

  var redHighlights = $('[src*="email-red"]');
  var redTL = new TimelineMax({
    repeat: -1
  });

  redTL
    .staggerFrom(redHighlights, 0.4, {
      opacity: 0
    }, 1.5, 'start')
    .staggerTo(redHighlights, 0.4, {
      opacity: 0,
      delay: 1.5
    }, 1.5, 'start');

  $('.app__menu__button, .app__menu__close-icon').click(function() {
    // $('.app__menu').toggleClass('show');
    $('.app__body, .app__header').toggleClass('menu');
  });


});
