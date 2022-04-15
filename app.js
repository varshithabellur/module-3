(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItems);


function FoundItems() {
	var ddo = {
	templateUrl: 'foundList.html',
		scope: {
			found: '<',
			onRemove: '&'
		},
	};

	return ddo;
}




NarrowItDownController.$inject = ['MenuSearchService', '$timeout'];
function NarrowItDownController(MenuSearchService, $timeout) {
	var list = this;

	list.showItems = function () {
		if ( list.searchTerm == '' ) {
			// The search term text box is empty
			console.log('blank search term');
			list.found = [];
		} else {
			console.log('proper search term');
			//console.log('NarrowItDownController.showItems()');
			var promise = MenuSearchService.getMatchedMenuItems( list.searchTerm );
			promise.then( 	function (response) {
								console.log(response);
								list.found = response;
							});
		};
	}

	list.removeItem = function(index) {
		list.found.splice(index, 1);
	}
}


// MenuSearch Service
MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
	var service = this;

	//Service method
	service.getMatchedMenuItems = function(searchTerm) {
		// retrieve the menu items via $http
		return $http({ method: "GET", url: (ApiBasePath + "/menu_items.json")})
			.then (	function( response ) {
				return response.data['menu_items'].filter(
					function (item) {
						return item.description.indexOf(searchTerm) !== -1;
					}
				);
			});
	};
}

})();
