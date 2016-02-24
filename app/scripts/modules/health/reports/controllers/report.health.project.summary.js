/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectsCtrl
 * @description
 * # ReportHealthProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportHealthProjectSummaryCtrl', ['$scope', '$route', '$location', 'ngmData', 'ngmUser', function ($scope, $route, $location, ngmData, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// return project
		ngmData.get({
			method: 'POST',
			url: 'http://' + $location.host() + '/api/health/project/getProjectDetails',
			data: {
				id: $route.current.params.project
			}
		}).then(function(data){
			// assign data
			$scope.report.setProjectSummary(data);
		});

		// init empty model
		$scope.model = {
			rows: [{}]
		};

		// report object
		$scope.report = {

			// ngm
			ngm: $scope.$parent.ngm,

			// form to add new project
			newProjectUrl: '#/health/projects/details/new',

			// set summary
			setProjectSummary: function(data){

				// set project
				$scope.report.project = data;
				
				// report dashboard model
				$scope.model = {
					name: 'report_health_summary',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m12 l12 report-title',
							style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: ngmUser.get().organization + ' | ' + $scope.report.project.details.project_name
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle',
							'title': $scope.report.project.details.project_description
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
						},{
							'title': 'Create New Project',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'param': 'project',
							'active': 'active',
							'href': $scope.report.newProjectUrl
						}]
					}],
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'card-panel white grey-text text-darken-2',
								config: {
									html: '<a class="waves-effect waves-light btn" href="#/health/projects"><i class="material-icons left">keyboard_return</i>Back to Projects</a>'
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'card-panel white grey-text text-darken-2',
								style: 'padding-bottom: 50px;',
								config: {
									project: $scope.report.project,
									templateUrl: '/views/modules/health/views/health.project.summary.html',									
									forms:[{
										icon: 'edit',
										location: 'details',
										title: 'Project Details',
										subtitle: 'Project Details, Location and Beneficiaries',
										description: 'Define the project details, locations and beneficiaries for '
									},{
										icon: 'attach_money',
										location: 'financials',
										title: 'Project Financials',
										subtitle: 'Project Financial Line Items',
										description: 'Track the project spending against financial line items for ',
									},{
										icon: 'done_all',
										location: 'objectives',
										title: 'Project Health Objectives',
										subtitle: 'Project Strategic Objective Indicators',
										description: 'Update the strategic health objective indicators for ',
									}],
					        // run submit
					        saveComplete: function(project){

					          // mark project complete
					          project.details.project_status = 'complete';       

					          // Submit project for save
					          ngmData.get({
					            method: 'POST',
					            url: 'http://' + $location.host() + '/api/health/project/setProjectDetails',
					            data: {
					              project: project
					            }
					          }).then(function(data){
					            // redirect on success
					            $location.path( '/health/projects' );
					            Materialize.toast( 'Project "' + project.details.project_name + '" completed, congratulations!', 3000, 'success');
					          });

					        }
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
				};

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;

			}

		}
		
	}]);