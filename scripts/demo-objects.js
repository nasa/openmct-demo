define(
    [
        'text!../data/demo-models.json'
    ], function (
        demoModels
    ) {
        demoModels = JSON.parse(demoModels);
        return function () {
            return function install(openmct){
                
                function serializeId(id) {
                    return id.namespace + ':' + id.key;
                }

                function deserializeId(serializedId) {
                    var tokens = serializedId.split(':');
                    return {
                        namespace: tokens[0],
                        key: tokens[1]
                    }; 
                }

                function addIdentifier(object, identifier) {
                    object.identifier = identifier;
                    return object;
                }

                //1. Add new root for demo objects
                openmct.objects.addRoot({
                    namespace: 'demo',
                    key: 'demo-objects'
                });
                //2. Add composition provider for demo objects
                openmct.composition.addProvider({
                    appliesTo: function (object) {
                        return object.identifier.namespace === 'demo' && 
                            object.composition !== undefined &&
                            (object.identifier.key === 'demo-objects' || 
                            demoModels[serializeId(object.identifier)] !== undefined);
                    },
                    load: function (model) {
                        var id = model.identifier;
                        if (id.key === 'demo-objects') {
                            return Promise.resolve(Object.keys(demoModels).filter(function (key) {
                                return demoModels[key].location === 'demo:demo-objects';
                            }).map(function (key) {
                                var childId = deserializeId(key); 
                                return {
                                    namespace: childId.namespace,
                                    key: childId.key 
                                };
                            }));
                        } else {
                            return Promise.resolve(
                                demoModels[serializeId(id)].composition.map(function (key) {
                                   var childId = deserializeId(key);
                                   return {
                                        namespace: childId.namespace,
                                        key: childId.key 
                                   }
                                })
                            );
                        }
                    }
                }); 

                //3. Add object provider
                openmct.objects.addProvider('demo', {
                    get: function (id) {
                        if (id.key === 'demo-objects') {
                            return Promise.resolve({
                                identifier: {
                                    key: 'demo-objects',
                                    namespace: 'demo'
                                },
                                type: 'folder',
                                location: 'ROOT',
                                name: 'Demo Objects',
                                composition: []
                           });
                        } else {
                            return Promise.resolve(addIdentifier(demoModels[serializeId(id)], id));
                        }
                    }
                });
            }
        }
    }
);
