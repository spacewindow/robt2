  var lastScroll = 0;

  var scrollDirection = function(section) {
    if (section.scrollTop > lastScroll) {
      lastScroll = section.scrollTop;
      return 'down';
    } else {
      lastScroll = section.scrollTop;
      return 'up';
    }
  };

  // unless all sections are loaded, which determine the scroll distances, they will be log incorrectly and scrollTriggers will not work
  $(window).on('load', function() {

      pageSections = $('section');
      console.log(pageSections);

      $.each(pageSections, function(index, section) {
        // only add these values for scroller sections

        if(section.classList.value.indexOf('scroller') >= 0){

          section.topSwitchUp = section.offsetTop - 5;
          section.topSwitchDown = section.offsetTop + 5;
          section.bottomSwitchUp = section.offsetTop + $(this).height() - 5;
          section.bottomSwitchDown = section.offsetTop + $(this).height()  + 5;
          section.topSwitchStatus = 'up';
          section.bottomSwitchStatus = 'up';

        }else{
          section.triggerUp = section.offsetTop + 200;
          section.triggerDown = section.offsetTop - 200;
          section.triggerDirection = 'down';
        }
      });

      $('.mainwrapper').scroll(function() {

        var main = this;
        var scrollDir = scrollDirection(this); // putting this in a variable ended up being essential. Having the function result directly in the if statement was too inefficient somehow? The if statement never evaluated.

        var winHeight = $(window).height();

        // console.log('third position', $('.third').offset().top, );

        if (scrollDir === 'down') {

          $.each(pageSections, function(index, section) {

            // console.log(main.scrollTop, (this.bottomSwitchUp - winHeight));

            if(main.scrollTop >= this.topSwitchUp && this.topSwitchStatus === 'up'){
              console.log('fix activated');
              $(this).attr('class', 'scroller scroller--fixed');
              this.topSwitchStatus = 'down';
            }

            if(main.scrollTop >= (this.bottomSwitchUp - winHeight) && this.bottomSwitchStatus === 'up') {
              console.log('fix released');
              $(this).attr('class', 'scroller scroller--bottom');
              this.bottomSwitchStatus = 'down';
            }
          });

        } else if (scrollDir === 'up') {

          $.each(pageSections, function(index, section) {

            // console.log(main.scrollTop, (this.bottomSwitchUp - winHeight));

            if(main.scrollTop <= this.topSwitchDown && this.topSwitchStatus === 'down'){
              console.log('fix released');
              $(this).attr('class', 'scroller scroller--top');
              this.topSwitchStatus = 'up';
            }

            if(main.scrollTop <= (this.bottomSwitchUp - winHeight) && this.bottomSwitchStatus === 'down') {
              console.log('fix activated');
              $(this).attr('class', 'scroller scroller--fixed');
              this.bottomSwitchStatus = 'up';
            }

          });
        } else {
          console.log('error');
        }

      });

  });
