;
(function () {
  
  // templating & referencing objects
  var player = $('<video id="video-inread" preload="auto" autoplay class="video-inread"></video>')[0];
  var $container = $('#ad-in-read-holder');  
  $('<div class="video-inread-wrap"></div>').append( player ).append('<img class="poster-button" src="http://www.yasmina.com/assets/images/desktop-video-play-btn.png" alt="" />').appendTo($container);  

  // no inread banner on page
  if($container.length===0) {
    return;
  }

  // dev/production fixes
  window.ox_vars = window.ox_vars || {
    'init': function () {
    },
    'setVars': function () {
      return "";
    }};
  window.ox_vars.init();
  var custVars = ox_vars.setVars();
  var oxParms = (custVars !== '') ? custVars : '';
  //var VASTURL = window.inreadVastVideoVASTURL || '/vast.php?auid=537209182&vars=' + oxParms;   //var VASTURL = 'http://ox-d.clickmena.com/v/1.0/av?auid=537209182';
  var VASTURL =  'http://ox-d.clickmena.com/v/1.0/av?auid=537209182';
  
  
  // pull vast file
  var vast = new dynamicVast(VASTURL);

  // adVideo container is in view for the first time
  $container.one('inview', function (event, isInView) {
    if (isInView) {
      inviewStart();
    }
  });

  // go go go 
  var inviewStart = function () {

    vastReady = function () {
            
      // impresion
      //var impresionImg = new Image();
      //impresionImg.src = vast.impresion;
      $container.append("<img scr='"+vast.impresion+"' style='position:absolute;'>");
      
      // functionalities
      $container.on('click', function () {
        if (player.paused) {
          player.play();
        }
        else {
          window.open(
                  vast.clickTrought,
                  '_blank'
                  );
        }
      });
      $container.addClass('paused');
      $(player).on('play', function () {
        $container.removeClass('paused');
      });
      $(player).on('pause', function () {
        $container.addClass('paused');
      });
      if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
        player.muted = false;
      }
      else {
        player.muted = true;
        $(player).hover(
                function () {
                  player.muted = false;
                },
                function () {
                  player.muted = true;
                }
        );
      }
      $container.on('inview', function (event, isInView) {
        if (isInView) {
          player.play();
        }
        else {
          player.pause();
        }
      });
      $(player).on('ended', function () {
        $container.off('inview');
        $container.removeClass('expanded');
        player.src = "";
      });
      // analytics
      $(player).one('play', function (e) {
        vast.track('start');
        $(player).on('play', function (e) {
          vast.track('resume');
        });
      });
      $(player).on('pause', function (e) {
        if (player.currentTime / player.duration !== 1) {
          vast.track("pause");
        }
      });
      $(player).on('volumechange', function (e) {
        if (!player.paused) {
          if (player.muted) {
            vast.track('mute');
          }
          else {
            vast.track('unmute');
          }
        }
      });
      var pct75 = function () {
        vast.track('thirdQuartile');
        pct75 = function () {
        };
      };
      var pct50 = function () {
        vast.track('midpoint');
        pct50 = function () {
        };
      };
      var pct25 = function () {
        vast.track('firstQuartile');
        pct25 = function () {
        };
      };
      $(player).on('timeupdate', function (e) {
        var pct = Math.round((player.currentTime / player.duration) * 100);
        if (pct > 75) {
          pct75();
        }
        else if (pct > 50) {
          pct50();
        }
        else if (pct > 25) {
          pct25();
        }
      });
      $(player).on('ended', function () {
        vast.track('complete');
      });
      // run handler
      if (vast.mediaFileUrl.toLowerCase().indexOf("kaltura") !== -1) {
        var partnerId = vast.mediaFileUrl.match(/\/p\/([0-9]+)\//)[1];
        var entityId = vast.mediaFileUrl.match(/\/entryId\/([A-Za-z0-9\-\_]+)\//)[1];
        player.poster = "http://cfvod.kaltura.com/p/" + partnerId + "/thumbnail/entry_id/" + entityId + "/width/600";
      }
      player.src = vast.mediaFileUrl;
      $container.addClass('expanded');
      player.play();
    };

    // vast is ready -> play video 
    if (vast.ready) {
      vastReady();
    } else {
      $(vast).on('ready', function (res) {
        vastReady();
      });
    }

  };

})();
