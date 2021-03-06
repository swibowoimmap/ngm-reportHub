/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectSummaryCtrl
 * @description
 * # ClusterProjectSummaryCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectSummaryCtrl', ['$scope', '$route', '$http', '$location', 'ngmAuth', 'ngmData', 'ngmUser', function ($scope, $route, $http, $location, ngmAuth, ngmData, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// return project
		ngmData.get({
			method: 'POST',
			url: ngmAuth.LOCATION + '/api/cluster/project/getProject',
			data: {
				id: $route.current.params.project
			}
		}).then(function(data){
			// assign data
			$scope.report.setProjectSummary( data );
		});

		// init empty model
		$scope.model = {
			rows: [{}]
		};

		// report object
		$scope.report = {

			// ngm
			ngm: $scope.$parent.ngm,

			// current user
			user: ngmUser.get(),

			// projects href
			getProjectsHref: function(){
				var href = '#/cluster/projects';
				if ( $scope.report.user.organization !== $scope.report.project.organization 
							&& $scope.report.user.roles.indexOf( 'ADMIN' ) ) {
					href += '/' + $scope.report.project.organization_id;
				}
				return href;
			},

			// set summary
			setProjectSummary: function(data){

				// set project
				$scope.report.project = data;
				
				// add project code to subtitle?
				var text = 'Actual Monthly Beneficiaries Report for ' + $scope.report.project.project_title
				var subtitle = $scope.report.project.project_code ?  $scope.report.project.project_code + ' - ' + $scope.report.project.project_description : $scope.report.project.project_description;
				
				// report dashboard model
				$scope.model = {
					name: 'cluster_project_summary',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m12 l12 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.project.admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.project.cluster.toUpperCase() + ' | ' + $scope.report.project.organization + ' | ' + $scope.report.project.project_title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate hide-on-small-only',
							'title': subtitle
						}
					},
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 20px;',
								config: {
									html: '<a class="btn-flat waves-effect waves-teal left" href="' + $scope.report.getProjectsHref() + '"><i class="material-icons left">keyboard_return</i>Back to Projects</a><span class="right" style="padding-top:8px;">Last Updated: ' + moment( $scope.report.project.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ) + '</span>'
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 0px;',
								config: {
									project: $scope.report.project,
									user: $scope.report.user,
									report_date: moment().subtract( 1, 'M').endOf( 'M' ).format('YYYY-MM-DD'),
									templateUrl: '/scripts/modules/cluster/views/cluster.project.summary.html',

									// mark project active
									markActive: function( project ){

									  // mark project active
									  project.project_status = 'active';       

									  // Submit project for save
									  ngmData.get({
									    method: 'POST',
									    url: ngmAuth.LOCATION + '/api/cluster/project/setProject',
									    data: {
									      project: project
									    }
									  }).then(function(data){
									    // redirect on success
									    $location.path( '/cluster/projects' );
									    Materialize.toast( 'Project moved to Active!', 3000, 'success');
									  });

									},

									// mark poject complete
									markComplete: function( project ){

									  // mark project complete
									  project.project_status = 'complete';       

									  // Submit project for save
									  ngmData.get({
									    method: 'POST',
									    url: ngmAuth.LOCATION + '/api/cluster/project/setProject',
									    data: {
									      project: project
									    }
									  }).then(function(data){
									    // redirect on success
									    $location.path( '/cluster/projects' );
									    Materialize.toast( 'Project marked as Complete, Congratulations!', 3000, 'success');
									  });

									},

									deleteProject: function(project){
									  // Submit project for save
									  $http({
									    method: 'POST',
									    url: ngmAuth.LOCATION + '/api/cluster/project/delete',
									    data: {
									      project_id: project.id
									    }
									  }).success(function(data){
									    // redirect on success
									    if ( data.err ) {
									    	Materialize.toast( 'Project delete error! Please try again', 3000, 'error');
									    }
									    if ( !data.err ){
										    $location.path( '/cluster/projects' );
										    Materialize.toast( 'Project Deleted!', 3000, 'success');
									    }
									  }).error(function(err){
									    // redirect on success
									    Materialize.toast( 'Project delete error! Please try again', 3000, 'error');
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