/**
 * @ngdoc function
 * @name ngmReportHubApp.DashboardEthAssessmentsCtrl
 * @description
 * # DashboardEthAssessmentsCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller( 'DashboardEthAssessmentsCtrl', ['$scope', '$location', '$route', 'ngmAuth', 'ngmData', 'ngmUser', function ( $scope, $location, $route, ngmAuth, ngmData, ngmUser ) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];
		// report object
		$scope.report = {

			// ngm
			ngm: $scope.$parent.ngm,

			// current user
			user: ngmUser.get(),

			// 
			init: function(){

				// report dashboard model
				$scope.model = {
					name: 'who_ethiopia_assessments',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m12 l12 report-title',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: 'WCO Ethiopia | Assessments'
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle hide-on-small-only',
							title: 'Please select an assessments from the options below'
						}
					},
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 0px;',
								config: {
									templateUrl: '/scripts/modules/country/ethiopia/views/ethiopia.assessments.html',
					      }
					    }]
					  }]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'card-panel',
								style: 'padding:0px; height: 90px; padding-top:10px;',
								config: {
									html: $scope.report.ngm.footer
								}
							}]
						}]
					}]
				}

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;				
			}

		}

		// set page
		$scope.report.init();
		
	}]);
