(function () {
    'use strict';

    angular.module('iguazio.dashboard-controls')
        .component('nclBreadcrumbsDropdown', {
            bindings: {
                state: '<',
                title: '<',
                project: '<',
                type: '@',
                getFunctions: '&',
                getProjects: '&'
            },
            templateUrl: 'nuclio/common/components/breadcrumbs-dropdown/breadcrumbs-dropdown.tpl.html',
            controller: NclBreadcrumbsDropdown
        });

    function NclBreadcrumbsDropdown($document, $element, $scope, $state, $i18next, i18next, lodash, DialogsService) {
        var ctrl = this;
        var lng = i18next.language;

        ctrl.itemsList = [];
        ctrl.showDropdownList = false;
        ctrl.placeholder = $i18next.t('common:PLACEHOLDER.SEARCH', {lng: lng});

        ctrl.$onInit = onInit;

        ctrl.showDropdown = showDropdown;
        ctrl.showDetails = showDetails;

        //
        // Hook methods
        //

        /**
         * Initialization method
         */
        function onInit() {
            if (ctrl.type === 'projects') {
                ctrl.getProjects()
                    .then(setNuclioItemsList)
                    .catch(function () {
                        DialogsService.alert($i18next.t('functions:ERROR_MSG.GET_PROJECTS', {lng: lng}));
                    });
            } else if (ctrl.type === 'functions') {
                ctrl.getFunctions({id: ctrl.project.metadata.name})
                    .then(setNuclioItemsList)
                    .catch(function () {
                        DialogsService.alert($i18next.t('functions:ERROR_MSG.GET_FUNCTIONS', {lng: lng}));
                    });
            }

            $document.on('click', unselectDropdown);
        }

        //
        // Public method
        //

        /**
         * Opens/closes dropdown
         */
        function showDropdown() {
            $document.on('click', unselectDropdown);

            if (!ctrl.showDropdownList) {
                $element.find('.breadcrumb-arrow').css('background-color', '#c9c9cd');
            }

            ctrl.showDropdownList = !ctrl.showDropdownList;

            if (!ctrl.showDropdownList) {
                ctrl.searchText = '';

                $element.find('.breadcrumb-arrow').css('background-color', '');

                $document.off('click', unselectDropdown);
            }
        }

        /**
         * Handles mouse click on a item's name
         * Navigates to selected page
         * @param {Event} event
         * @param {Object} item
         */
        function showDetails(event, item) {
            var params = {};

            ctrl.showDropdownList = !ctrl.showDropdownList;
            ctrl.searchText = '';

            $document.off('click', unselectDropdown);

            $element.find('.breadcrumb-arrow').css('background-color', '');

            if (ctrl.type === 'projects') {
                lodash.set(params, 'projectId', item.id);

                $state.go('app.project.functions', params);
            } else if (ctrl.type === 'functions') {
                params = {
                    isNewFunction: false,
                    id: ctrl.project.metadata.name,
                    functionId: item.id,
                    projectNamespace: ctrl.project.metadata.namespace
                };

                $state.go('app.project.function.edit.code', params);
            }
        }

        //
        // Private method
        //

        /**
         * Handles promise
         * Sets projects list for dropdown in Nuclio breadcrumbs
         * @param {Object} data
         */
        function setProjectsItemList(data) {
            ctrl.itemsList = lodash.map(data, function (item) {
                return {
                    id: item.metadata.name,
                    name: item.spec.displayName,
                    isNuclioState: true
                };
            });
        }

        /**
         * Handles promise
         * Sets functions list for dropdown in Nuclio breadcrumbs
         * @param {Object} data
         */
        function setFunctionsItemList(data) {
            ctrl.itemsList = lodash.map(data, function (item) {
                return {
                    id: item.metadata.name,
                    name: item.metadata.name,
                    isNuclioState: true
                };
            });
        }

        /**
         * Checks what item list need to set for dropdown in Nuclio breadcrumbs
         * @param {Object} data
         */
        function setNuclioItemsList(data) {
            if (ctrl.type === 'projects') {
                setProjectsItemList(data);
            } else if (ctrl.type === 'functions') {
                setFunctionsItemList(lodash.defaultTo(data.data, data));
            }
        }

        /**
         * Handle click on the document and not on the dropdown field and close the dropdown
         * @param {Object} e - event
         */
        function unselectDropdown(e) {
            if ($element.find(e.target).length === 0) {
                $scope.$evalAsync(function () {
                    ctrl.showDropdownList = false;
                    ctrl.searchText = '';

                    $document.off('click', unselectDropdown);

                    $element.find('.breadcrumb-arrow').css('background-color', '');
                });
            }
        }
    }
}());
