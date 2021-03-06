angular.module("productList",[])
.constant("productListActiveClass","btn-primary")
.constant("productListPageCount",9)
.controller("productListCtrl", function ($scope, $filter, productListActiveClass,
	productListPageCount, cart) {
	
	$scope.products = [
	{ name: "Barbie 1", category: "Barbie", price: 1.20, expiry: 1000, image:"/images/products/barbie_1.jpg" , description:"Product description goes here. Aliquam tincidunt diam varius ultricies auctor. Vivamus faucibus risus tempus, adipiscing justo"},
	{ name: "Barbie 2", category: "Barbie", price: 1.20, expiry: 1000, image:"/images/products/barbie_2.jpg" , description:"Product description goes here. Aliquam tincidunt diam varius ultricies auctor. Vivamus faucibus risus tempus, adipiscing justo"},
	{ name: "Barbie 3", category: "Barbie", price: 1.20, expiry: 1000, image:"/images/products/barbie_3.jpg" , description:"Product description goes here. Aliquam tincidunt diam varius ultricies auctor. Vivamus faucibus risus tempus, adipiscing justo"},
	{ name: "Barbie 4", category: "Barbie", price: 1.20, expiry: 1000, image:"/images/products/barbie_4.jpg" , description:"Product description goes here. Aliquam tincidunt diam varius ultricies auctor. Vivamus faucibus risus tempus, adipiscing justo"},
	{ name: "Barbie 5", category: "Barbie", price: 1.20, expiry: 1000, image:"/images/products/barbie_5.jpg" , description:"Product description goes here. Aliquam tincidunt diam varius ultricies auctor. Vivamus faucibus risus tempus, adipiscing justo"},
	{ name: "Barbie 6", category: "Barbie", price: 1.20, expiry: 1000, image:"/images/products/barbie_6.jpg" , description:"Product description goes here. Aliquam tincidunt diam varius ultricies auctor. Vivamus faucibus risus tempus, adipiscing justo"},
	{ name: "Barbie 7", category: "Barbie", price: 1.20, expiry: 1000, image:"/images/products/barbie_7.jpg" , description:"Product description goes here. Aliquam tincidunt diam varius ultricies auctor. Vivamus faucibus risus tempus, adipiscing justo"},
	{ name: "Barbie 8", category: "Barbie", price: 1.20, expiry: 1000, image:"/images/products/barbie_8.jpg" , description:"Product description goes here. Aliquam tincidunt diam varius ultricies auctor. Vivamus faucibus risus tempus, adipiscing justo"},



	{ name: "Apples", category: "Fruit", price: 1.20, expiry: 10 },
	{ name: "Bananas", category: "Fruit", price: 2.42, expiry: 7 },
	{ name: "Pears", category: "Fruit", price: 2.02, expiry: 6 },
	{ name: "Tuna", category: "Fish", price: 20.45, expiry: 3 },
	{ name: "Salmon", category: "Fish", price: 17.93, expiry: 2 },
	{ name: "Trout", category: "Fish", price: 12.93, expiry: 4 },
	{ name: "Beer", category: "Drinks", price: 2.99, expiry: 365 },
	{ name: "Wine", category: "Drinks", price: 8.99, expiry: 365 },
	{ name: "Whiskey", category: "Drinks", price: 45.99, expiry: 365 },

	{ name: "Coconut", category: "Fruit", price: 1.20, expiry: 10 },
	{ name: "Serry", category: "Fruit", price: 2.42, expiry: 7 },
	{ name: "Gouva", category: "Fruit", price: 2.02, expiry: 6 },
	{ name: "GLobber", category: "Fish", price: 20.45, expiry: 3 },
	{ name: "Sharp", category: "Fish", price: 17.93, expiry: 2 },
	{ name: "Mackerel", category: "Fish", price: 12.93, expiry: 4 },
	{ name: "Larue", category: "Drinks", price: 2.99, expiry: 365 },
	{ name: "Heneken", category: "Drinks", price: 8.99, expiry: 365 },
	{ name: "Halida", category: "Drinks", price: 45.99, expiry: 365 }

	];

	$scope.infor = {
		selectedCategory : null
	};

	$scope.pageSize = productListPageCount;

	$scope.selectCategory = function (newCategory) {
		$scope.infor.selectedCategory = newCategory;
		//console.log("In productListCtrl, newCategory:" + newCategory);
	}

	$scope.getSelectedCategory = function () {
		return $scope.infor.selectedCategory;
	}

	$scope.selectPage = function (newPage) {
		$scope.selectedPage = newPage;
	}

	$scope.categoryFilterFn = function (product) {
		return $scope.infor.selectedCategory == null || product.category == $scope.infor.selectedCategory;
	}

	$scope.getCategoryClass = function (category) {
		//console.log("category:" + category + ", selectedCategory: " + $scope.infor.selectedCategory);
		return $scope.infor.selectedCategory == category ? productListActiveClass : "";
	}

	$scope.getSelectedPageClass = function () {
		return productListActiveClass;
	}

	$scope.addProductToCart = function (product) {
		cart.addProduct(product.objectId, product.name, product.price);
	}

	$scope.getExpiryDate = function (days) {
		var now = new Date();
		return now.setDate(now.getDate() + days);
	}
});