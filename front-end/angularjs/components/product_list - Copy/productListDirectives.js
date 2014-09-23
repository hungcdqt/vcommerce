angular.module("productList")
.directive("categorynode", function () {
	return {
		require: ["^categorylst","^productlst"],
		link: function (scope, element, attrs, ctls) {
			var catlstctl = ctls[0], productlstctl = ctls[1];
			scope.handleEvent = function (e) {
				//console.log("Event: " + e);
				console.log("elementid:" + element.attr("id"));
				//ctl.selectCategoryctl(element.attr("id"));
				productlstctl.selectCategory(element.attr("id"));
			}
		}
	}
})
.directive("productlst",["$filter" ,function () {
	return {
		transclude: true,
		link: function (scope, element, attrs) {
			
			console.log("pageSize:" + scope.pageSize);

			scope.gridactive= "";
			scope.listactive = "active";
			scope.switchView = function () {
				if (scope.gridactive != "active") {
					scope.gridactive= "active";
					scope.listactive = "";
				} else {
					scope.gridactive = "";
					scope.listactive = "active";
				}

				var theproducts = element.find("ul");
				var gridthumb = "/images/products/grid-default-thumb.png";
				var listthumb = "/images/products/list-default-thumb.png";

				if (scope.gridactive != "active") {
					// remove the grid view and change to list
					theproducts.removeClass("grid")
					theproducts.addClass("list");
					// update all thumbnails to smaller size
					element.find("img").attr("src",listthumb);
				} else {
					// remove the list class and change to grid
					theproducts.removeClass("list");
					theproducts.addClass("grid");

					// update all thumbnails to larger size
					element.find("img").attr("src",gridthumb);
				}	
			};
		},
		controller: function ($scope, $element, $attrs) {
			this.selectCategory = function (category) {
				scope.selectedCategory = category;
				console.log("ready to use category = " + category);
			}
		},
		restrict: "E",
		scope: {
				data: "=source",
				pageSize: "@pageSize",
				categoryFilterFn: "&filterFn",
				SelectedCategoryFn: "&selectedCategoryFn",
				category:"=",
				selectCategoryFn:"&selectCategoryFn"
				},
		templateUrl: "components/product_list/productListTemplate.html"
		}
	}])
.directive("categorylst",["$filter" ,function () {
	return {
		transclude:true,
		link: function (scope, element, attrs) {
			scope.selectCategorydrt = function () {
			// find('#id')
			//angular.element(document.querySelector('#id'))
			//find('.classname'), assumes you already have the starting elem to search from
			//angular.element(elem.querySelector('.classname'))


				console.log("i am in directive"+ element.text());
			}
		},
		controller: function ($scope, $element, $attrs) {
			this.selectCategoryctl = function (cat) {
				console.log("cat:" + cat);
				$scope.selectCategory(cat);
				console.log("selectedCategory: " + $scope.selectedCategoryFn());
			}
		},
		restrict: "E",
		scope: {
			data:"=source",
			getCategoryClassFn:"&",
			selectedCategoryFn: "&",
			category:"@",
			selectCategory:"&"
		},
		templateUrl: "components/product_list/categoryListTemplate.html"
	}
}]);

/*
one-way bindings on isolated scopes are always evaluated to string values. 
You must use a two-way binding if you want to access an array, 
even if you don’t intend to modify it

when use $scope, when not need $
*/