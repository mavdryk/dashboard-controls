(function () {
    'use strict';

    angular.module('iguazio.dashboard-controls')
        .component('nclVersionConfigurationLogging', {
            bindings: {
                version: '<',
                onChangeCallback: '<'
            },
            templateUrl: 'nuclio/projects/project/functions/version/version-configuration/tabs/version-configuration-logging/version-configuration-logging.tpl.html',
            controller: NclVersionConfigurationLoggingController
        });

    function NclVersionConfigurationLoggingController(lodash) {
        var ctrl = this;

        ctrl.$onInit = onInit;

        ctrl.inputValueCallback = inputValueCallback;

        //
        // Hook methods
        //

        function onInit() {}

        //
        // Public methods
        //

        /**
         * Update data callback
         * @param {string} newData
         * @param {string} field
         */
        function inputValueCallback(newData, field) {
            lodash.set(ctrl.version, field, newData);
            ctrl.onChangeCallback();
        }
    }
}());
