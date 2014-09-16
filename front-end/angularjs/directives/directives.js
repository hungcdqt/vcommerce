angular.module("itemsView",[])
.directive("switchItemsView", function (itemsView) {
	return {
		scope: true,
		restrict: "AE",
		transclude: true,
		templateUrl: "switcher.html",
		link: function (scope, element, attrs) {
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
		}
	}
});