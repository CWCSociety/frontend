define([
    'bonzo',
    'common/utils/$',
    'common/utils/config',
    'common/utils/fastdom-promise',

    'common/modules/commercial/creatives/commercial-component',
    'common/modules/commercial/creatives/gu-style-comcontent',
    'common/modules/commercial/creatives/expandable',
    'common/modules/commercial/creatives/expandable-v2',
    'common/modules/commercial/creatives/expandable-v3',
    'common/modules/commercial/creatives/expandable-video',
    'common/modules/commercial/creatives/expandable-video-v2',
    'common/modules/commercial/creatives/fluid250',
    'common/modules/commercial/creatives/fluid250GoogleAndroid',
    'common/modules/commercial/creatives/foundation-funded-logo',
    'common/modules/commercial/creatives/scrollable-mpu',
    'common/modules/commercial/creatives/scrollable-mpu-v2',
    'common/modules/commercial/creatives/template'
], function (
    bonzo,
    $,
    config,
    fastdom
) {

    /**
     * Allows ad content to break out of their iframes. The ad's content must have one of the above breakoutClasses.
     * This can be set on the DFP creative.
     */
    function breakoutIFrame(iFrame, $slot) {
        /*eslint-disable no-eval*/
        var $iFrame            = bonzo(iFrame);
        var $iFrameParent      = bonzo(iFrame.parentNode);
        var iFrameBody         = iFrame.contentDocument.body;
        var type               = {};
        var $breakoutEl;

        if (!iFrameBody) {
            return type;
        }

        $breakoutEl = $('.breakout__html, .breakout__script', iFrameBody);
        if ($breakoutEl.hasClass('breakout__html')) {
            fastdom.write(function () {
                $iFrame.hide();
                $breakoutEl.detach();
                $iFrameParent.append($breakoutEl[0].children);
            }).then(function () {
                var $responsiveAds = $('.ad--responsive', $iFrameParent[0]);
                fastdom.write(function () {
                    $responsiveAds.addClass('ad--responsive--open');
                });
            });
        } else if ($breakoutEl.hasClass('breakout__script')) {
            fastdom.write(function () {
                $iFrame.hide();
            }).then(function () {
                var breakoutContent = $breakoutEl.html();
                if ($breakoutEl.attr('type') === 'application/json') {
                    var creativeConfig = JSON.parse(breakoutContent);
                    if (creativeConfig.name === 'fluid250-v4' || creativeConfig.name === 'fluid250-v3') {
                        creativeConfig.name = 'fluid250';
                    }
                    require(['common/modules/commercial/creatives/' + creativeConfig.name], function (Creative) {
                        new Creative($slot, creativeConfig.params, creativeConfig.opts).create();
                    });
                    type = creativeConfig.params.adType || '';
                } else {
                    // evil, but we own the returning js snippet
                    eval(breakoutContent);
                }
            });
        }

        return type;
    }

    return breakoutIFrame;

});