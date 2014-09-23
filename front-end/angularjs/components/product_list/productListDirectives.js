angular.module("productList")
.directive("categorynode", function () {
	return {
		require: "^categorylst",
		link: function (scope, element, attrs, ctl) {
			
			scope.handleEvent = function (e) {
				ctl.selectCategory(element.attr("id"));
			}
		}
	}
})
.directive("productlst",["$filter" ,function () {
	return {
		require: "^categorylst",
		link: function (scope, element, attrs, ctl) {
			
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
			scope.$watch(ctl.getSelectedCategory(), function (newValue, oldValue) {
				scope.selectedCategory = newValue;
				console.log("in side watch: newValue=" + newValue);
			});
			// scope.$watch(function () {
			// 	scope.selectedCategory = ctl.getSelectedCategory();
			// 	console.log("in side watch: selectedCategory=" + scope.selectedCategory);
			// })
		},
		restrict: "AE",
		scope: {
				data: "=source",
				pageSize: "@pageSize",
				categoryFilterFn: "&filterFn",
				selectedCategoryFn: "&selectedCategoryFn",
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
		},
		controller: function ($scope, $element, $attrs) {
			this.selectCategory = function (cat) {
				// $scope.$apply(function (cat) {
				// 	$scope.selectedCategory = cat;	
				// })				
				$scope.selectedCategory = cat;
				console.log("$scope.selectedCategory = " + cat);
				$scope.selectCategoryFn({category:cat});
				//console.log($scope.selectCategoryFn);
				console.log("getSelectedCategory=" + $scope.getSelectedCategoryFn());
			};
			this.getSelectedCategory = function () {
				return $scope.selectedCategory;
			}
		},
		restrict: "E",
		scope: {
			data:"=source",
			getSelectedCategoryFn:"&",
			selectCategoryFn:"&selectCategoryFn"
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