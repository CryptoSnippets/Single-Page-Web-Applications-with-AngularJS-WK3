(function () {
'use strict';

angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController)
	.service('MenuSearchService', MenuSearchService)
	.directive('foundItems', FoundItemsDirective);

	NarrowItDownController.$inject = ['MenuSearchService'];
	function NarrowItDownController(MenuSearchService) {
		var nidCtrl = this;

		nidCtrl.searchTerm = '';

		nidCtrl.getMatchedMenuItems = function () {
			MenuSearchService.getMatchedMenuItems(nidCtrl.searchTerm)
			.then(function (response) {
				nidCtrl.found = response;
			});
		};

		nidCtrl.removeItem = function (index) {
			nidCtrl.found.splice(index, 1);
		};
	}

	MenuSearchService.$inject = ['$http'];
	function MenuSearchService($http) {
		var service = this;

		service.getMatchedMenuItems = function (searchTerm) {

			return $http({
				method: 'GET',
				url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
			}).then(function (result) {
			    // process result and only keep items that match
			    var data = result.data.menu_items;
			    var foundItems = [];

			    // return processed items
			    for (var i = 0; i < data.length; i++) {
			    	var item = data[i];
			    	if (item.description.includes(searchTerm)) {
			    		foundItems.push(item);
			    	}
			    }
			    return foundItems;
		    });

		};
		return service;
	}

	function FoundItemsDirective() {
		var ddo = {
			templateUrl: 'foundItems.html',
			restrict: 'E',
			scope: {
				foundItems: '<',
				myTitle: '@title',
				onRemove: '&'
			},
		};

		return ddo;
	}

})();