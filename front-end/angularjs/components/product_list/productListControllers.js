angular.module("productList",[])
.constant("productListActiveClass","btn-primary")
.constant("productListPageCount",3)
.controller("productListCtrl", function ($scope, $filter, productListActiveClass,
	productListPageCount, cart) {
	
	$scope.products = [
	{ name: "Apples", category: "Fruit", price: 1.20, expiry: 10 },
	{ name: "Bananas", category: "Fruit", price: 2.42, expiry: 7 },
	{ name: "Pears", category: "Fruit", price: 2.02, expiry: 6 },
	{ name: "Tuna", category: "Fish", price: 20.45, expiry: 3 },
	{ name: "Salmon", category: "Fish", price: 17.93, expiry: 2 },
	{ name: "Trout", category: "Fish", price: 12.93, expiry: 4 },
	{ name: "Beer", category: "Drinks", price: 2.99, expiry: 365 },
	{ name: "Wine", category: "Drinks", price: 8.99, expiry: 365 },
	{ name: "Whiskey", category: "Drinks", price: 45.99, expiry: 365 }
	];
	selectedCategory = null; 
	$scope.selectedPage = 1;
	$scope.pageSize = productListPageCount;
	$scope.category = null; //test some case when a scope property is required

	$scope.selectCategory = function (newCategory) {
		selectedCategory = newCategory;
		$scope.selectedPage = 1;

		$scope.category = newCategory;
	}

	$scope.selectPage = function (newPage) {
		$scope.selectedPage = newPage;
	}

	$scope.categoryFilterFn = function (product) {
		return selectedCategory == null || product.category == selectedCategory;
	}

	$scope.getCategoryClass = function (category) {
		return selectedCategory == category ? productListActiveClass : "";
	}

	$scope.getPageClass = function (page) {
		return $scope.selectedPage == page ? productListActiveClass : "";
	}

	$scope.addProductToCart = function (product) {
		cart.addProduct(product.objectId, product.name, product.price);
	}

	$scope.getSelectedCategory = function () {
		return selectedCategory;
	}

	$scope.getExpiryDate = function (days) {
		var now = new Date();
		return now.setDate(now.getDate() + days);
	}
});