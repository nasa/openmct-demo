define([], 
    function () {
    return function (options){
        return function install (openmct) {
            openmct.types.addType('image-include', {
                name: 'Image include',
                cssClass: 'icon-image',
                description: 'An image include that resizes to fit its container',
                views: [
                    'image-view'
                ],
                form: [
                    {
                        key: 'url',
                        name: 'URL',
                        control: 'textfield',
                        pattern: '^(ftp|https?)\\:\\/\\/\\w+(\\.\\w+)*(\\:\\d+)?(\\/\\S*)*$',
                        required: true,
                        cssClass: 'l-input-lg'
                    }
                ]
            });
            openmct.legacyExtension('views', {
                template: '<div><img style="max-width: 100%; max-height: 100%" ng-src="{{model.url}}"></div>',
                name: 'ImageInclude',
                type: 'image-include',
                key: 'image-view',
                editable: false
            });
        }
    }
});
