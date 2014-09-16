angular.module("sportsStore",["customFilters", "cart", "ngRoute"])
.config(function ($routeProvider) {

	$routeProvider.when("/complete", {
		templateUrl: "/views/thankYou.html"
	});

	$routeProvider.when("/placeorder", {
		templateUrl: "views/placeOrder.html"
	})

	$routeProvider.when("/checkout", {
		templateUrl: "/views/checkoutSummary.html"
	});

	$routeProvider.when("/products", {
		templateUrl: "views/productList.html"
	});

	$routeProvider.otherwise({
		templateUrl: "/views/productListGrid.html"
	});
})
.constant("dataUrl", "https://api.parse.com/1/classes/Products")
.constant("orderUrl", "https://api.parse.com/1/classes/Orders")
.run(function ($http) {
	$http.defaults.headers.common["X-Parse-Application-Id"]
	="ifQ3RujVGJW2Vl44XvxTBaQ70NkoOgCqeEi7upcC";
	$http.defaults.headers.common["X-Parse-REST-API-Key"]
	="42U9chS1rmQYx8ldfaD4jgWOg1yFrLkWaMrHo3La";
})
.controller("sportsStoreCtrl", function ($scope,$http,$location,dataUrl,orderUrl,cart){
	$scope.data = {};

	$http.get(dataUrl)
	.success(function (data) {
		$scope.data.products = data.results;
	})
	.error(function (response) {
		$scope.data.error = response.error || response;
	});

	$scope.sendOrder = function (shippingDetails) {
		var order = angular.copy(shippingDetails);
		order.products = cart.getProducts();
		$http.post(orderUrl, order)
		.success(function(data) {
			$scope.data.orderId = data.objectId;
					cart.getProducts().length = 0; //???
				})
		.error(function(error) {
			$scope.data.orderError = error;
		}).finally(function() {
			$location.path("/complete");
		});
	}
});
