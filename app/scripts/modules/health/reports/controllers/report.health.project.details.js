/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectsCtrl
 * @description
 * # ReportHealthProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportHealthProjectDetailsCtrl', ['$scope', '$route', '$location', 'ngmData', 'ngmUser', function ($scope, $route, $location, ngmData, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// init empty model
		$scope.model = {
			rows: [{}]
		}

		// empty Project
		$scope.report = {
			
			// parent
			ngm: $scope.$parent.ngm

		}		

		// if 'new' create empty project
		if($route.current.params.project === 'new') {
			
			// create and return empty project
			ngmData.get({
				method: 'POST',
				url: 'http://' + $location.host() + '/api/health/project/create',
				data: {
					project: {
						organization_id: ngmUser.get().organization_id,
						organization: ngmUser.get().organization,
						username: ngmUser.get().username,
						email: ngmUser.get().email
					}
				}
			}).then(function(data){
				// assign data
				$scope.report.setProjectDetails(data);
			});

		} else {

			// return project
			ngmData.get({
				method: 'POST',
				url: 'http://' + $location.host() + '/api/health/project/getProjectDetails',
				data: {
					id: $route.current.params.project
				}
			}).then(function(data){
				// assign data
				$scope.report.setProjectDetails(data);
			});

		}

		// set project details form
		$scope.report.setProjectDetails = function(data){

			// assign data
			$scope.report.project = data;

			// report dashboard model
			$scope.model = {
				name: 'report_health_details',
				header: {
					div: {
						'class': 'col s12 m12 l12 report-header',
						style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
					},
					title: {
						'class': 'col s12 m9 l9 report-title',
						style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
						title: ngmUser.get().organization + ' | ' + $scope.report.project.details.project_title
					},
					subtitle: {
						'class': 'col s12 m12 l12 report-subtitle',
						'title': $scope.report.project.details.project_description
					},
					download: {
						'class': 'col s12 m3 l3 hide-on-small-only',
						downloads: [{
							type: 'pdf',
							color: 'blue lighten-1',
							icon: 'picture_as_pdf',
							hover: 'Download Project Details Form as PDF',
							url: 'http://' + $location.host() + '/report/health_project_details.pdf'
						}]
					}					
				},
				menu: [{
					'icon': 'location_on',
					'title': 'Projects',
					'class': 'teal-text',
					rows: [{
						'title': 'Project List',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'param': 'project',
						'active': 'active',
						'href': '#/health/projects'
					}]
				}],
				rows: [{				
					columns: [{
						styleClass: 's12 m12 l12',
						widgets: [{
							type: 'project.details',
							config: {
								style: $scope.report.ngm.style,
								project: $scope.report.project
							}
						}]
					}]
				}]
			}

			// set model to null
			if($route.current.params.project === 'new'){
				$scope.report.project.details.project_title = '';
				$scope.report.project.details.project_description = '';
			} 

			// assign to ngm app scope
			$scope.report.ngm.dashboard.model = $scope.model;

		};
		
	}]);