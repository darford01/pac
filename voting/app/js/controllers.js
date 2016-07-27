appControllers.controller('PostListCtrl', ['$scope', '$sce', 'PostService',
    function PostListCtrl($scope, $sce, PostService) {
        $scope.posts = [];

        PostService.findAllPublished().success(function(data) {
            for (var postKey in data) {
                data[postKey].content = $sce.trustAsHtml(data[postKey].content);
            }

            $scope.posts = data;            
        }).error(function(data, status) {
            console.log(status);
            console.log(data);
        });
    }
]);

appControllers.controller('PostViewCtrl', ['$scope', '$routeParams', '$location', '$sce', 'PostService',
    function PostViewCtrl($scope, $routeParams, $location, $sce, PostService) {

        $scope.post = {};
        var id = $routeParams.id;
        $scope.voteValue = '';
        
        PostService.read(id).success(function(data) {
    		data.content = $sce.trustAsHtml(data.content);
    		$scope.post = data;
    	}).error(function(data, status) {
    		console.log(status);
    		console.log(data);
    	});
        
        // vote the post
        $scope.voteThePost = function voteThePost(){
        	PostService.addvote(id,$scope.voteValue).success(function(data) {
        		$location.path("/post/statistik/"+id);
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });;
        }
    }
]);

appControllers.controller('SatistikCtrl', ['$scope', '$routeParams', '$location', '$sce', 'PostService', '$timeout',  
    function SatistikCtrl($scope, $routeParams, $location, $sce, PostService, $timeout) {

	var id = $routeParams.id;
    $scope.votes = [];
    $scope.labels = [];
    $scope.data = [];
    $scope.post = {};
    $scope.yourVote = '';
	
    PostService.read(id).success(function(data) {
		data.content = $sce.trustAsHtml(data.content);
		$scope.post = data;
	}).error(function(data, status) {
		console.log(status);
		console.log(data);
	})
    
	PostService.getVoteStatistik(id).success(function(data) {
		$scope.votes = data;
		var procent = 0;
		var voteSize = $scope.votes.length - 1;
		var useridIndex = $scope.votes.length;
	    if($scope.votes[0].postid === undefined){
	    	$location.path("/post/"+id);
	    }else{
	    	var result = 0;
	    	var tunables = $scope.post.tunables.toString();
	    	var voteValues = tunables.split(',');
	    	for(var k = 0; k < voteValues.length; k++){
	    		var question = voteValues[k];
	    		for(var i = 0; i < voteSize; i++){
	    			if($scope.votes[i].votevalue == question){
	    				result++;
	    			}
	    			if($scope.votes[i].userid == $scope.votes[voteSize].userid){
	    				$scope.yourVote = $scope.votes[i].votevalue;
	    			}
	    		}
	    		procent = Math.round((result / voteSize) * 100);
	    		$scope.labels.push(question+'('+ procent +'%)');
	    		$scope.data.push(result);
	    		
	        	result = 0;
	    	}
	    	
	    	$location.path("/post/statistik/"+id);
	    }
	}).error(function(data, status) {
	    console.log(status);
	    console.log(data);
	});
	}
]);

appControllers.controller('WSSatistikCtrl', ['$scope', '$routeParams', '$sce', 'PostService', '$timeout',  
    function WSSatistikCtrl($scope, $routeParams, $sce, PostService, $timeout) {
		$scope.labels = [];
		$scope.data = [];
	    
	    PostService.wsStatistik().success(function(rData) {
	    	var wscalls = rData;
	    	var wscallsLength = 0;
	    	var result = 0;
	    	for(var k = 0; k < wscalls.length; k++){
	    		wscallsLength = wscallsLength + wscalls[k].wsRecords;
	    	}
	    	for(var k = 0; k < wscalls.length; k++){
	    		result = Math.round((wscalls[k].wsRecords / wscallsLength) * 100);
	    		$scope.labels.push(wscalls[k].wsName+'('+result+'%)');
	    		$scope.data.push(wscalls[k].wsRecords);
	    		result = 0;
	    	}
	    	
		});
	}
]);


appControllers.controller('AdminPostListCtrl', ['$scope', '$routeParams', '$sce', 'PostService',  
    function AdminPostListCtrl($scope, $routeParams, $sce, PostService) {
		 
        PostService.findAll().success(function(data) {
            $scope.posts = data;
        });
        
        $scope.updatePublishState = function updatePublishState(post, shouldPublish) {
            if (post != undefined && shouldPublish != undefined) {

                PostService.changePublishState(post._id, shouldPublish).success(function(data) {
                    var posts = $scope.posts;
                    for (var postKey in posts) {
                        if (posts[postKey]._id == post._id) {
                        	if(shouldPublish){
                        		$scope.posts[postKey].is_published = shouldPublish;
                        	}
                            break;
                        }
                    }
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }


        $scope.deletePost = function deletePost(id) {
            if (id != undefined) {

                PostService.deletePost(id).success(function(data) {
                    var posts = $scope.posts;
                    for (var postKey in posts) {
                        if (posts[postKey]._id == id) {
                            $scope.posts.splice(postKey, 1);
                            break;
                        }
                    }
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }
    }
]);

appControllers.controller('AdminPostCreateCtrl', ['$scope', '$location', 'PostService',
    function AdminPostCreateCtrl($scope, $location, PostService) {
        $('#textareaContent').wysihtml5({"font-styles": false});
        
        // add posible Question
        $scope.tunables = [];
        var currTunablesIndex = 0;

        $scope.addTunables = function() {
        	$scope.tunables.push('Question '+currTunablesIndex);
        	currTunablesIndex++;
        };
        
        $scope.removeTunableFromArray = function (stringIndex) {
            if (stringIndex >= 0 && stringIndex < $scope.tunables.length){
              $scope.tunables.splice(stringIndex, 1);
            }
        };
        
        // event blur for edite Question 
        $scope.blur = function( $event, stringIndex ){
        	$scope.tunables[ stringIndex ] = $event.currentTarget.value;
        };
        
        $scope.goBack = function goBack() {
        	$location.path('/admin');
        };
        
        $scope.save = function save(post, shouldPublish) {
            if (post != undefined 
                && post.title != undefined) {

            	var tunables = $scope.tunables;
                if(tunables != undefined){
                	post.tunables = $scope.tunables;
                }
            	
                var content = $('#textareaContent').val();
                if (content != undefined) {
                    post.content = content;

                    if (shouldPublish != undefined && shouldPublish == true) {
                        post.is_published = true;
                    } else {
                        post.is_published = false;
                    }

                    PostService.create(post).success(function(data) {
                        $location.path("/admin");
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
            }
        }
    }
]);

appControllers.controller('AdminPostEditCtrl', ['$scope', '$routeParams', '$location', '$sce', 'PostService',
    function AdminPostEditCtrl($scope, $routeParams, $location, $sce, PostService) {    
		$scope.post = {};
        var id = $routeParams.id;
        var currTunablesIndex = 0;

        PostService.read(id).success(function(data) {
            $scope.post = data;
            $('#textareaContent').wysihtml5({"font-styles": false});
            $('#textareaContent').val($sce.trustAsHtml(data.content));
            
            $scope.tunables = data.tunables;
            // edit possible Question
            currTunablesIndex = $scope.tunables.length;
        }).error(function(status, data) {
            $location.path("/admin");
        });
        
        
        $scope.addTunables = function() {
        	$scope.tunables.push('Question '+currTunablesIndex);
        	currTunablesIndex++;
        };
        
        $scope.removeTunableFromArray = function (stringIndex) {
            if (stringIndex >= 0 && stringIndex < $scope.tunables.length){
              $scope.tunables.splice(stringIndex, 1);
            }
        };
        
        // event blur for edite Question 
        $scope.blur = function( $event, stringIndex ){
        	$scope.tunables[ stringIndex ] = $event.currentTarget.value;
        };
        
        $scope.goBack = function goBack() {
        	$location.path('/admin');
        };
        
        $scope.save = function save(post, shouldPublish) {
            if (post !== undefined 
                && post.title !== undefined) {

                var content = $('#textareaContent').val();
                if (content !== undefined && content != "") {
                    post.content = content;

                    if (shouldPublish != undefined && shouldPublish == true) {
                        post.is_published = true;
                    } else {
                        post.is_published = false;
                    }
                    
                    // possible Question
                    var tunables = $scope.tunables;
                    if(tunables != undefined){
                    	post.tunables = $scope.tunables;
                    }

                    // string comma separated to array
                    if (Object.prototype.toString.call(post.tags) !== '[object Array]') {
                        post.tags = post.tags.split(',');
                    }
                    
                    PostService.update(post).success(function(data) {
                        $location.path("/admin");
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
            }
        }
    }
]);

appControllers.controller('AdminUserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',  
    function AdminUserCtrl($scope, $location, $window, UserService, AuthenticationService) {

        //Admin User Controller (signIn, logOut)
        $scope.signIn = function signIn(username, password) {
            if (username != null && password != null) {

                UserService.signIn(username, password).success(function(data) {
                    AuthenticationService.isAuthenticated = true;
                    $window.sessionStorage.token = data.token;
                    $location.path("/admin");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }

        $scope.logOut = function logOut() {
            if (AuthenticationService.isAuthenticated) {
                
                UserService.logOut().success(function(data) {
                    AuthenticationService.isAuthenticated = false;
                    delete $window.sessionStorage.token;
                    $location.path("/");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
            else {
                $location.path("/admin/login");
            }
        }

        $scope.register = function register(username, password, passwordConfirm) {
            if (AuthenticationService.isAuthenticated) {
                $location.path("/admin");
            }
            else {
                UserService.register(username, password, passwordConfirm).success(function(data) {
                    $location.path("/admin/login");
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }
    }
]);


appControllers.controller('PostListTagCtrl', ['$scope', '$routeParams', '$sce', 'PostService',
    function PostListTagCtrl($scope, $routeParams, $sce, PostService) {

        $scope.posts = [];
        var tagName = $routeParams.tagName;

        PostService.findByTag(tagName).success(function(data) {
            for (var postKey in data) {
                data[postKey].content = $sce.trustAsHtml(data[postKey].content);
            }
            $scope.posts = data;
        }).error(function(status, data) {
            console.log(status);
            console.log(data);
        });

    }
]);
