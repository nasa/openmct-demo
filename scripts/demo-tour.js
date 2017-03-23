define([
        'hopscotch',
        'text!./tour.json'
        ], function (hopscotch, tourConfig) {
    return function () {
        tourConfig = JSON.parse(tourConfig);
        return function (openmct) {
            openmct.legacyExtension('runs', {
                depends: ['agentService'],
                implementation: function (agentService) {
                    if (!agentService.isMobile() &&
                        !window.opener) {
                        setTimeout(function () {
                            hopscotch.endTour(true);
                            hopscotch.startTour(tourConfig);
                        }, 3000);
                    }
                }
            });
            
        }
    } 
});
