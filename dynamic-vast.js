;
(function ($) {
  window.dynamicVast = function (vastUrl) {

    var _this = this;
    this.vastUrl = vastUrl;
    this.ready = false;

    $.ajax({
      type: "GET",
      url: this.vastUrl,
      //dataType: 'text',
      success: function (result) {
        _this.result = result;
        _this.impresion = $(result).find('Impression').text().trim();
        _this.mediaFileUrl = $(result).find('Linear MediaFiles MediaFile').text().trim();
        _this.clickTrought = $(result).find('Linear VideoClicks ClickThrough').text().trim();
        _this.trackingEventsXML = $(result).find('Linear TrackingEvents Tracking');
        TrackingEventsCreator(_this.trackingEventsXML);
        if (!!_this.mediaFileUrl) {
          _this.ready = true;
          $(_this).trigger('ready', result);
        }
        else {
          $(_this).trigger('empty', result);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $(_this).trigger('error', [jqXHR, textStatus, errorThrown]);
      }
    });
    
    this.impression = function(){
      var impresionImg = new Image();
      impresionImg.src = this.impresion;
    };

    this.trackingEvents = {};
    var TrackingEventsCreator = function (trackingEventsXML) {
      $.each(trackingEventsXML, function (i, o) {
        var name = $(o).attr('event');
        var url = $(o).text().trim();
        _this.trackingEvents[name] = function () {
          /*$.ajax({
           url: url,
           error: function (e) {
           console.log(JSON.stringify(e));
           }
           });
           return;*/
          var img = new Image();
          img.src = url+"&fix="+Math.floor(Date.now() / 1000);
        };
      });
    };
    this.track = function (name) {
      try {
        _this.trackingEvents[name]();
      }
      catch (e) {
        window.console = window.console || {};
        window.console.log = window.console.log || function () {
        };
        console.log('vast tracker error:' + e);
      }
    };

    return this;
  };
})(jQuery);
