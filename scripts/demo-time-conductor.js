define([], function () {
    return function (options) {
        var REALTIME_SPACECRAFT_LAYOUT = '96592bba-a9f4-46d9-8d9f-a4efb45bcfc1';
        var DEMO_NAMESPACE = 'demo';
        var TUTORIAL_NAMESPACE = 'example.taxonomy';
        var DEMO_ROOT = 'demo-objects';
        var MSL_NAMESPACE = 'msl_tlm';
        var MSL_LAYOUT = 'f3744144-8842-4b7a-bddc-4abbf21315d9';
        var MSL_BOUNDS = {
            start: Date.parse('2012-08-06'),
            end: Date.now()
        };
        
        return function install(openmct) {
            var $location; 
            
            function getLocation() {
                if ($location === undefined) {
                    $location = openmct.$injector.get('$location');
                }
                return $location;
            }

            function isRealtimeObject(object) {
                var identifier = object.identifier;
                return identifier.namespace === TUTORIAL_NAMESPACE ||
                       identifier.key === REALTIME_SPACECRAFT_LAYOUT;
            }

            function isHistoricalObject(object) {
                var identifier = object.identifier;
                return identifier.namespace === MSL_NAMESPACE ||
                       identifier.key === MSL_LAYOUT;
            }
       
            function setMode(mode) {
                getLocation().search('tc.mode', mode);
            }
 
            openmct.on('navigation', function (object) {
                var o = object.useCapability('adapter');

                if (isRealtimeObject(o)) {
                    console.log('real-time object');
                    setMode('realtime');
                } else if (isHistoricalObject(o)) {
                    console.log('historical object');
                    setMode('fixed');
                    setTimeout(function () {
                        openmct.conductor.bounds(MSL_BOUNDS); 
                    });
                }
            });
            
            openmct.legacyExtension('runs', {
                depends: [
                    '$location' 
                ],
                implementation: function ($location) {
                    //For default route, redirect user to layout
                    if ($location.path().length == 0 || $location.path() === "/") {
                        $location.url("browse/" + DEMO_NAMESPACE + ":" + DEMO_ROOT  + "/" + DEMO_NAMESPACE + ":" + REALTIME_SPACECRAFT_LAYOUT  + "?view=layout");
                    }
                }
            });
        }
    }
});
