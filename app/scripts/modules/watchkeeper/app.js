/**
 * @ngdoc overview
 * @name ngmReportHubApp
 * @description
 * # ngmReportHubApp
 *
 * Main module of the application.
 */
angular
	.module('ngmWatchkeeper', [])
	.config([ '$routeProvider', '$compileProvider', function ( $routeProvider, $compileProvider ) {

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled( false )

		// app routes with access rights
		$routeProvider
			// iMMAP
			.when( '/immap/login', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardLoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.isAnonymous();
					}],
				}
			})
			// DEFAULTS
			.when( '/immap', {
				redirectTo: '/immap/watchkeeper/kenya/2015-11-01/2015-11-30'
			})
			// Watchkeeper
			.when( '/immap/watchkeeper/:country/:start/:end', {
				reloadOnSearch: false,
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardWatchkeeperCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated(); 
					}],
				}
			})
			// FORBIDDEN
			.when( '/immap/forbidden', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return !ngmAuth.isAuthenticated();
					}],
				}
			});
	}]);
