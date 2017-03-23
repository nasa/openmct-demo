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

            function parseKeyString(keyString) {
                var namespace = '',
                    key = keyString;
                
                for (var i = 0; i < key.length; i++) {
                    if (key[i] === "\\" && key[i + 1] === ":") {
                        i++; // skip escape character.
                    } else if (key[i] === ":") {
                        key = key.slice(i + 1);
                        break;
                    }
                    namespace += key[i];
                }

                if (keyString === namespace) {
                    namespace = '';
                }

                return {
                    namespace: namespace,
                    key: key
                };
            }

            function isRealtimeObject(object) {
                var identifier = parseKeyString(object.getId());
                return identifier.namespace === TUTORIAL_NAMESPACE ||
                       identifier.key === REALTIME_SPACECRAFT_LAYOUT;
            }

            function isHistoricalObject(object) {
                var identifier = parseKeyString(object.getId());
                return identifier.namespace === MSL_NAMESPACE ||
                       identifier.key === MSL_LAYOUT;
            }
       
            function setMode(mode) {
                getLocation().search('tc.mode', mode);
            }
 
            openmct.on('navigation', function (object) {
                if (isRealtimeObject(object)) {
                    console.log('real-time object');
                    setMode('realtime');
                } else if (isHistoricalObject(object)) {
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
