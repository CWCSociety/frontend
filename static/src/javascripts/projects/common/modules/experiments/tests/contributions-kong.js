define([
    'bean',
    'qwery',
    'common/utils/$',
    'common/utils/template',
    'common/views/svg',
    'common/utils/fastdom-promise',
    'common/utils/mediator',
    'text!common/views/contributions-epic.html',
    'common/utils/robust',
    'inlineSvg!svgs/icon/arrow-right',
    'common/utils/config',
    'common/modules/commercial/commercial-features',
    'common/utils/cookies'

], function (bean,
             qwery,
             $,
             template,
             svg,
             fastdom,
             mediator,
             contributionsEpic,
             robust,
             arrowRight,
             config,
             commercialFeatures,
             cookies

) {


    return function () {

        this.id = 'ContributionsKong20160919';
        this.start = '2016-09-19';
        this.expiry = '2016-09-29';
        this.author = 'Jonathan Rankin';
        this.description = 'Test whether telling the story of the guardian through staggered messages over time results in more contributions than always showing the epic message.';

            this.showForSensitive = false;
        this.audience = 0.05;
        this.audienceOffset = 0.33;
        this.successMeasure = 'Impressions to number of contributions';
        this.audienceCriteria = 'All users';
        this.dataLinkNames = '';
        this.idealOutcome = 'The embed performs at least as good as our previous in-article component tests';
        this.canRun = function () {
            var worksWellWithPageTemplate = (config.page.contentType === 'Article'); // may render badly on other types
            return commercialFeatures.canAskForAContribution && worksWellWithPageTemplate && !obWidgetIsShown();
        };

        var messages = [
            {
                title: 'Since you\'re here ...',
                p1: '... we have a small favour to ask. More people are reading the Guardian than ever. But far fewer are paying for it. And advertising revenues are falling\
                        fast. So you can see why we need to ask for your help. The Guardian\'s independent, investigative journalism takes a lot of time, money and hard work to produce. But we do it because we\
                        believe our perspective matters - because it might well be your perspective, too.',
                p2: '... we have a small favour to ask. More people are reading the Guardian than ever. But far fewer are paying for it. And advertising revenues are falling\
                        fast. So you can see why we need to ask for your help. The Guardian\'s independent, investigative journalism takes a lot of time, money and hard work to produce. But we do it because we\
                        believe our perspective matters - because it might well be your perspective, too.'
            },
            {
                title: 'Since you\'re here ...',
                p1: '... we have a small favour to ask. More people are reading the Guardian than ever. But far fewer are paying for it. And advertising revenues are falling\
                        fast. So you can see why we need to ask for your help. The Guardian\'s independent, investigative journalism takes a lot of time, money and hard work to produce. But we do it because we\
                        believe our perspective matters - because it might well be your perspective, too.',
                p2: '... we have a small favour to ask. More people are reading the Guardian than ever. But far fewer are paying for it. And advertising revenues are falling\
                        fast. So you can see why we need to ask for your help. The Guardian\'s independent, investigative journalism takes a lot of time, money and hard work to produce. But we do it because we\
                        believe our perspective matters - because it might well be your perspective, too.'
            },
            {
                title: 'Since you\'re here ...',
                p1: '... we have a small favour to ask. More people are reading the Guardian than ever. But far fewer are paying for it. And advertising revenues are falling\
                        fast. So you can see why we need to ask for your help. The Guardian\'s independent, investigative journalism takes a lot of time, money and hard work to produce. But we do it because we\
                        believe our perspective matters - because it might well be your perspective, too.',
                p2: '... we have a small favour to ask. More people are reading the Guardian than ever. But far fewer are paying for it. And advertising revenues are falling\
                        fast. So you can see why we need to ask for your help. The Guardian\'s independent, investigative journalism takes a lot of time, money and hard work to produce. But we do it because we\
                        believe our perspective matters - because it might well be your perspective, too.'
            }
        ];

        function obWidgetIsShown() {
            var $outbrain = $('.js-outbrain-container');
            return $outbrain && $outbrain.length > 0;
        }

        var bottomWriter = function (component) {

            return fastdom.write(function () {
                var a = $('.submeta');
                component.insertBefore(a);
                mediator.emit('contributions-embed:insert', component);
            });

        };


        var completer = function (complete) {
            mediator.on('contributions-embed:insert', function () {
                bean.on(qwery('.js-submit-input')[0], 'click', function (){
                    complete();
                });
            });
        };

        function getComponent(message, kongVariant) {
            return $.create(template(contributionsEpic, {
                position: 'bottom',
                title: message.title,
                p1: message.p1,
                p2: message.p2,
                linkUrl : 'https://contribute.theguardian.com?INTCMP=co_uk_kong_' + kongVariant,
                kongVariant: kongVariant
            }));
        }

        function getValue(name){
            return parseInt(cookies.get(name));
        }

        function setValue(name, value){
            cookies.add(name, value, 14);
        }

        this.variants = [

            {
                id: 'control',
                test: function () {
                    var component = getComponent(messages[0], 'control');
                    bottomWriter(component);
                },
                success: completer
            },

            {
                id: 'kong',
                test: function () {
                    var currentTime = Math.floor(Date.now() / 1000);
                    var messageDuration = 0; //21600 for 6 hours
                    var kongMessageIterationCount = getValue('gu.kongMessageIterationCount') || 0;
                    var kongTimeStamp = getValue('gu.kongTimeStamp') || 0 ;
                    var elapsedSoakTime = currentTime - kongTimeStamp;
                    var proposedAdvance = elapsedSoakTime > messageDuration;
                    var kongMessageIterationForDisplay = kongMessageIterationCount + (proposedAdvance)?1:0;
                    bottomWriter(getComponent(messages[kongMessageIterationForDisplay%3], kongMessageIterationForDisplay));
                    if (proposedAdvance) {
                        $('.contributions__epic').setVisibilityViewer(function () {
                            setValue('gu.kongTimeStamp', currentTime);
                            setValue('gu.kongMessageIterationCount', kongMessageIterationForDisplay);
                     });
                    }
                },
                success: completer
            }
        ];
    };
});
