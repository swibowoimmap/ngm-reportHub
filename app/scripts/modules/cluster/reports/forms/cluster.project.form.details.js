/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectFormDetailsCtrl
 * @description
 * # ClusterProjectFormDetailsCtrl
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.project.details', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget( 'project.details', {
        title: 'Cluster Project Details Form',
        description: 'Display Project Details Form',
        controller: 'ClusterProjectFormDetailsCtrl',
        templateUrl: '/scripts/modules/cluster/views/forms/details/form.html'
      });
  })
  .controller( 'ClusterProjectFormDetailsCtrl', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    'ngmUser',
    'ngmData',
    'ngmClusterHelper',
    'config',
    function( $scope, $location, $timeout, $filter, $q, $http, ngmUser, ngmData, ngmClusterHelper, config ){

      // project
      $scope.project = {

        // user
        user: ngmUser.get(),

        // app style
        style: config.style,

        // project
        definition: config.project,

        // last update
        updatedAt: moment( config.project.updatedAt ).format('DD MMMM, YYYY @ h:mm:ss a'),

        // default indicators
        indicators: ngmClusterHelper.getProjectTargetIndicators(),

        // holder for UI options
        options: {
          filter: {},
          target_beneficiaries: {},
          location: {},
          list: {
            // currencies
            currencies: ngmClusterHelper.getCurrencies( config.project.admin0pcode ),
            // donors
            donors: ngmClusterHelper.getDonors(),
            // beneficiaries
            beneficiaries: ngmClusterHelper.getBeneficiaries( config.project.target_beneficiaries ),
            // admin1
            admin1: angular.fromJson( localStorage.getItem( 'admin1List' ) ),
            // admin2
            admin2: angular.fromJson( localStorage.getItem( 'admin2List' ) ),
            // facility type
            facility_type: ngmClusterHelper.getFacilityTypes(),
            // activities by cluster
            activities: {
              activity_type: ngmClusterHelper.getActivities( ngmUser.get().cluster_id, true ),
              activity_description: ngmClusterHelper.getActivities( ngmUser.get().cluster_id, false )
            }

            // activities: {
            //   activity_type: [{
            //     activity_type_id: 'health_services',
            //     activity_type_name: 'Health Services'
            //   }],
            //   activity_description: [{
            //     activity_description_id: 'capacity_building',
            //     activity_description_name: 'Capacity Building of Health Staff'
            //   },{
            //     activity_description_id: 'cardio_health',
            //     activity_description_name: 'Cardio Health'
            //   },{
            //     activity_description_id: 'community_health',
            //     activity_description_name: 'Community Health'
            //   },{
            //     activity_description_id: 'donation',
            //     activity_description_name: 'Donation'
            //   },{
            //     activity_description_id: 'health_education',
            //     activity_description_name: 'Health Education'
            //   },{
            //     activity_description_id: 'outbreak_response',
            //     activity_description_name: 'Outbreak Response'
            //   },{
            //     activity_description_id: 'phc',
            //     activity_description_name: 'PHC'
            //   },{
            //     activity_description_id: 'physical_rehabilitation',
            //     activity_description_name: 'Physical Rehabilitation'
            //   },{
            //     activity_description_id: 'psycho_social',
            //     activity_description_name: 'Psycho Social'
            //   },{
            //     activity_description_id: 'trauma_care',
            //     activity_description_name: 'Trauma Care'
            //   },{
            //     activity_description_id: 'project_donor_other',
            //     activity_description_name: 'Other'
            //   }]
            // }
          }
        },

        // templates
        templatesUrl: '/scripts/modules/cluster/views/forms/details/',
        detailsUrl: 'details.html',
        budgetUrl: 'budget.html',
        targetBeneficiariesUrl: 'target-beneficiaries/target-beneficiaries.html',
        targetBeneficiariesDefaultUrl: 'target-beneficiaries/target-beneficiaries-default.html',
        targetBeneficiariesTrainingUrl: 'target-beneficiaries/target-beneficiaries-training.html',
        locationsUrl: 'target-locations/locations-' + ngmUser.get().cluster_id + '.html',

        // datepicker
        datepicker: {
          onClose: function(){
            $scope.project.definition.project_start_date = moment( new Date( $scope.project.definition.project_start_date ) ).format('YYYY-MM-DD');
            $scope.project.definition.project_end_date = moment( new Date( $scope.project.definition.project_end_date ) ).format('YYYY-MM-DD');
          }
        },

        // helpers helper
        updateSelect: function() {
          //
          ngmClusterHelper.updateSelect();
        },


        // THIS MIGHT GO!


        // validate project type
        activity_description_valid: function () {
          
          // valid
          var valid = false;

          // compile activity_description
          angular.forEach( $scope.project.definition.activity_description_check, function( t, i ) {
            // check if selected
            if ( t ){
              valid = true;
            }
          });

          return valid;

        },

        // validate project donor
        project_donor_valid: function () {
          
          // valid
          var valid = false;

          // compile activity_description
          angular.forEach( $scope.project.definition.project_donor_check, function( d, i ){
            // check if selected
            if ( d ){
              valid = true;
            }
          });

          return valid;

        },




        // add target benficiaries
        addTargetBeneficiary: function() {

          // process + clean location 
          var target_beneficiaries = 
              ngmClusterHelper.getCleanTargetBeneficiaries( $scope.project.definition, $scope.project.indicators, $scope.project.options.target_beneficiaries );

          // add target_beneficiaries
          $scope.project.definition.target_beneficiaries.unshift( target_beneficiaries );

          // clear selection
          $scope.project.options.target_beneficiaries = {};

          // filter / sort target_beneficiaries
          $scope.project.options.list.beneficiaries 
              = ngmClusterHelper.getBeneficiaries( $scope.project.definition.target_beneficiaries );

          // update material select
          ngmClusterHelper.updateSelect();

        },

        // remove target beneficiary
        removeTargetBeneficiary: function( $index ) {

          // remove location at i
          $scope.project.definition.target_beneficiaries.splice( $index, 1 );

          // filter / sort
          $scope.project.options.list.beneficiaries 
              = ngmClusterHelper.getBeneficiaries( $scope.project.definition.target_beneficiaries );

          // update material select
          ngmClusterHelper.updateSelect();

        },

        // add location
        addLocation: function(){

          // process + clean location 
          var location = 
              ngmClusterHelper.getCleanTargetLocation( $scope.project.definition, $scope.project.options.location );
  
          // extend targets with project, ngmData details & push
          $scope.project.definition.target_locations.unshift( location );

          // reset
          $scope.project.options.location = {};

          // update material select
          ngmClusterHelper.updateSelect();

        },

        // remove location from location list
        removeLocationModal: function( $index ) {

          // set location index
          $scope.project.locationIndex = $index;

          // open confirmation modal
          $('#location-modal').openModal({ dismissible: false });

        },

        // confirm locaiton remove
        removeLocation: function() {

          // remove location at i
          $scope.project.definition.target_locations.splice( $scope.project.locationIndex, 1 );

        },

        // cofirm exit if changes
        modalConfirm: function( modal ){

          // if not pristine, confirm exit
          $scope.clusterProjectForm.$dirty ? 
              $( '#' + modal ).openModal( { dismissible: false } ) : $scope.project.cancel();

        },

        // save project
        save: function(){

          // reset to cover updates
          $scope.project.definition.activity_description = [];
          $scope.project.definition.project_donor = [];
          $scope.project.definition.admin1pcode = [];
          $scope.project.definition.admin2pcode = [];
          $scope.project.definition.beneficiary_type = [];

          // compile activity_description
          angular.forEach( $scope.project.definition.activity_description_check, function( t, key ){
            // push keys to activity_description
            if ( t ) {
              $scope.project.definition.activity_description.push( key );
            }
          });

          // compile project_donor
          angular.forEach( $scope.project.definition.project_donor_check, function( d, key ){
            // push keys to project_donor
            if ( d ) {
              $scope.project.definition.project_donor.push( key );
            }
          });

          // add target_beneficiaries to projects to ensure simple filters
          angular.forEach( $scope.project.definition.target_beneficiaries, function( b, i ){

            // push location ids to project
            $scope.project.definition.target_beneficiaries[i].activity_type = $scope.project.definition.activity_type;
            $scope.project.definition.target_beneficiaries[i].project_title = $scope.project.definition.project_title;
            $scope.project.definition.target_beneficiaries[i].activity_description = $scope.project.definition.activity_description;
            $scope.project.definition.beneficiary_type.push( b.beneficiary_type );

          });

          // add target_locations to projects to ensure simple filters
          angular.forEach( $scope.project.definition.target_locations, function( l, i ){

            // push location ids to project
            $scope.project.definition.target_locations[i].activity_type = $scope.project.definition.activity_type;
            $scope.project.definition.target_locations[i].project_title = $scope.project.definition.project_title;
            $scope.project.definition.target_locations[i].activity_description = $scope.project.definition.activity_description;
            // add beneficiary_types to locations
            $scope.project.definition.target_locations[i] = $scope.project.definition.beneficiary_type;
            // locations
            $scope.project.definition.admin1pcode.push( l.admin1pcode );
            $scope.project.definition.admin2pcode.push( l.admin2pcode );


          });

          // open success modal if valid form
          if ( $scope.clusterProjectForm.$valid ) {

            // disable btn
            $scope.project.submit = true;

            // inform
            Materialize.toast('Processing...', 3000, 'note');

            // details update
            ngmData.get({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/cluster/project/setProject',
              data: {
                project: $scope.project.definition
              }
            }).then( function( project ){

              // enable
              $scope.project.submit = false;

              // add id to client json
              $scope.project.definition = project;

              // notification modal
              $( '#save-modal' ).openModal({ dismissible: false });
              
            });

          } else {
            
            // form validation takes over
            $scope.clusterProjectForm.$setSubmitted();
            
            // inform
            Materialize.toast( 'Please review the form for errors and try again!', 3000);

          }

        },

        // re-direct on save
        redirect: function(){

          // new becomes active!
          var path = '/cluster/projects/summary/' + $scope.project.definition.id;
          var msg = $scope.project.definition.project_status === 'new' ? 'Project Created!' : 'Project Updated!';

          // update
          $timeout(function(){
            
            // redirect + msg
            $location.path( path );
            Materialize.toast( msg, 3000, 'success' );

          }, 200 );

        },

        // cancel and delete empty project
        cancel: function() {
          
          // update
          $timeout(function() {
            
            // path / msg
            var path = $scope.project.definition.project_status === 'new' ? '/cluster/projects' : '/cluster/projects/summary/' + $scope.project.definition.id;
            var msg = $scope.project.definition.project_status === 'new' ? 'Create Project Cancelled!' : 'Project Update Cancelled!';

            // redirect + msg
            $location.path( path );
            Materialize.toast( msg, 3000, 'note' );

          }, 100 );

        }   

      }

      
      // THIS ALL MIGHT GO


      // on page load
      angular.element( document ).ready(function () {

        // give a few seconds to render
        $timeout(function() {



          // THIS MIGHT GO



          // add activity type check
          if ( $scope.project.definition.activity_description ) {
            // set object
            $scope.project.definition.activity_description_check = {};
            // set checkboxes
            angular.forEach( $scope.project.definition.activity_description, function( d, i ){
              // push keys to activity_description
              if ( d ){
                $scope.project.definition.activity_description_check[ d ] = true;
              }
            });
          }

          // add project donor check
          if ( $scope.project.definition.project_donor ) {
            // set object
            $scope.project.definition.project_donor_check = {};
            // set checkboxes
            angular.forEach( $scope.project.definition.project_donor, function( d, i ){
              // push keys to activity_description
              if ( d ){
                $scope.project.definition.project_donor_check[ d ] = true;
              }
            });
          }


          // THIS MIGHT ALSO GO! IF ACTIVITY TYPE IS STRING!



          // update activity_type select
          // if ( $scope.project.definition.activity_type ) {
          //   // update the selection
          //   $( '#ngm-activity_type' ).val( $scope.project.definition.activity_type[0] );
          // }




        }, 1000);

      });
  }

]);