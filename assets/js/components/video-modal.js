const VideoModal = function() {
    const container = $(".modal-main-wrapper");

    container.find('.modal .close').click(function(){   
        stopVideo($('.video-source'));
    });

    container.find('.modal').on('click', function () {   
        stopVideo($('.video-source'));
    });

    container.find('.modal-content').on('click', function(e) {
        e.stopPropagation();
    })

    var stopVideo = function ( element ) {
        var iframe = element.find('iframe');
        var video = element.find('video');

        iframe.each(function() {
        let iframeSrc = $(this).attr('src');
            $(this).attr('src', iframeSrc);
        });

        video.each(function() {
           videojs.getPlayer($(this).attr('id')).pause();
        });
    };
};

module.exports = VideoModal;
