angular.module("productList")
.directive("categorynode", function () {
	return {
		require: "^categorylst",
		link: function (scope, element, attrs, ctl) {
			
			scope.handleEvent = function (e) {
				var cat = element.attr("id") == "SelectAll" ? null:element.attr("id");
				ctl.resetCategoryClass();
				ctl.selectCategory(cat);
				element.addClass(ctl.getCategoryClass(cat));
			}
		}
	}
})
.directive("productlst",["$filter" ,function () {
	return {
		require: "^categorylst",
		replace: true,
		link: function (scope, element, attrs, ctl) {
			
			scope.gridactive= "";
			scope.listactive = "active";
			scope.selectedPage = 1;

			console.log("Link - selectedPage:" + scope.selectedPage);

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
			// scope.$watch(ctl.getSelectedCategory(), function (newValue, oldValue) {
			// 	scope.selectedCategory = newValue;
			// 	console.log("in side watch: newValue=" + newValue);
			// });
			scope.selectPage = function (page) {
				scope.selectedPage = page;
				//console.log("selectPage:" + scope.selectedPage)
			};
		},
		restrict: "AE",
		scope: {
				data: "=source",
				pageSize: "=pageSize",
				categoryFilterFn: "&filterFn",
				selectedCategoryFn: "&",
				addProductToCartFn: "&",
				getExpiryDateFn: "&"
				},
		templateUrl: "components/product_list/productListTemplate.html"
		}
	}])
.directive("categorylst",["$filter" ,function () {
	return {
		transclude:true,
		replace: true,
		link: function (scope, element, attrs) {
		},
		controller: function ($scope, $element, $attrs) {
			this.selectCategory = function (cat) {
				// $scope.$apply(function (cat) {
				// 	$scope.selectedCategory = cat;	
				// })				
				$scope.selectedCategory = cat;//(cat=="SelectAll"? null:cat);
				$scope.selectCategoryFn({category:cat}); 
				//Notes: this is one of ways (not elegant) to pass parameter from ctroller to directives, the key name must be matched through
				//It’s important that the parameter name match with the property name defined in the object literal
				//http://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-3-isolate-scope-and-function-parameters
			};
			this.getCategoryClass = function (category) {
				return $scope.categoryClassFn({category: category});
			};
			this.resetCategoryClass = function () {
				$element.find("a").removeClass("btn-primary");
			};
		},
		restrict: "E",
		scope: {
			data:"=source",
			categoryClassFn:"&",
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