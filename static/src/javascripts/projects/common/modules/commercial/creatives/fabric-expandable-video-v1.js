define([
    'bean',
    'bonzo',
    'common/utils/fastdom-promise',
    'common/utils/$',
    'common/utils/detect',
    'common/utils/mediator',
    'common/utils/storage',
    'common/utils/template',
    'common/views/svgs',
    'text!common/views/commercial/creatives/fabric-expandable-video-v1.html',
    'lodash/objects/merge',
    'common/modules/commercial/creatives/add-tracking-pixel'
], function (
    bean,
    bonzo,
    fastdom,
    $,
    detect,
    mediator,
    storage,
    template,
    svgs,
    fabricExpandableVideoHtml,
    merge,
    addTrackingPixel
) {
    return FabricExpandableVideoV1;

    // Forked from expandable-video-v2.js

    function FabricExpandableVideoV1(adSlot, params) {
        var isClosed     = true;
        var closedHeight = 250;
        var openedHeight = 500;

        var videoHeight = openedHeight;
        var showmoreArrow = {
            showArrow: (params.showMoreType === 'arrow-only' || params.showMoreType === 'plus-and-arrow') ?
                '<button class="ad-exp__open-chevron ad-exp__open">' + svgs('arrowdownicon') + '</button>'
                : ''
        };
        var showmorePlus = {
            showPlus: (params.showMoreType === 'plus-only' || params.showMoreType === 'plus-and-arrow') ?
                '<button class="ad-exp__close-button ad-exp__open">' + svgs('closeCentralIcon') + '</button>'
                : ''
        };
        var videoSource = {
            videoEmbed: (params.YoutubeVideoURL !== '') ?
                '<iframe id="YTPlayer" width="100%" height="' + videoHeight + '" src="' + params.YoutubeVideoURL + '?showinfo=0&amp;rel=0&amp;controls=0&amp;fs=0&amp;title=0&amp;byline=0&amp;portrait=0" frameborder="0" class="expandable-video"></iframe>'
                : ''
        };
        var $fabricExpandableVideo = $.create(template(fabricExpandableVideoHtml, { data: merge(params, showmoreArrow, showmorePlus, videoSource) }));
        var $ad = $('.ad-exp--expand', $fabricExpandableVideo);

        bean.on(adSlot, 'click', '.ad-exp__open', function () {
            fastdom.write(function () {
                var videoSrc = $('#YTPlayer').attr('src');
                var videoSrcAutoplay = videoSrc;

                if (videoSrc.indexOf('autoplay') === -1) {
                    videoSrcAutoplay = videoSrc + '&amp;autoplay=1';
                } else {
                    videoSrcAutoplay = videoSrcAutoplay.replace(
                        isClosed ? 'autoplay=0' : 'autoplay=1',
                        isClosed ? 'autoplay=1' : 'autoplay=0'
                    );
                }

                $('.ad-exp__close-button').toggleClass('button-spin');
                $('.ad-exp__open-chevron').removeClass('chevron-up').toggleClass('chevron-down');
                $ad.css(
                    'height',
                    isClosed ? openedHeight : closedHeight
                );
                $('.slide-video, .slide-video .ad-exp__layer', adSlot)
                    .css('height', isClosed ? openedHeight : closedHeight)
                    .toggleClass('slide-video__expand');

                isClosed = !isClosed;

                setTimeout(function () {
                    $('#YTPlayer').attr('src', videoSrcAutoplay);
                }, 1000);

            });
        });

        return fastdom.write(function () {
            $ad.css('height', closedHeight);
            $('.ad-exp-collapse__slide', $fabricExpandableVideo).css('height', closedHeight);
            if (params.trackingPixel) {
                addTrackingPixel(adSlot, params.trackingPixel + params.cacheBuster);
            }
            $fabricExpandableVideo.appendTo(adSlot);
            return true;
        });
    }
});
