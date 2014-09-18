angular.module("productList")
.directive("productlst", function () {
	return {
		link: function (scope, element, attrs) {
			
			console.log("pageSize:" + scope.pageSize);
			console.log("pageCount:" + scope.pageCount);

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
		restrict: "E",
		scope: {
				data: "=source",
				pageSize:"@pageSize",
				categoryFilterFn:"&FilterFn"
				},
		templateUrl: "components/product_list/productListTemplate.html",
		transclude: true
		}
	});

/*
one-way bindings on isolated scopes are always evaluated to string values. 
You must use a two-way binding if you want to access an array, 
even if you don’t intend to modify it
*/