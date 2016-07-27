appServices.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false,
        isAdmin: false
    }

    return auth;
});

appServices.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/admin/login");
            }

            return $q.reject(rejection);
        }
    };
});

appServices.factory('PostService', function($http) {
    return {
        findAllPublished: function() {
            return $http.get(options.api.base_url + '/api/post');
        },

        findByTag: function(tag) {
            return $http.get(options.api.base_url + '/api/tag/' + tag);
        },

        read: function(id) {
            return $http.get(options.api.base_url + '/api/post/' + id);
        },
        
        findAll: function() {
            return $http.get(options.api.base_url + '/api/post/all');
        },

        changePublishState: function(id, newPublishState) {
            return $http.put(options.api.base_url + '/api/post', {'post': {_id: id, is_published: newPublishState}});
        },

        deletePost: function(id) {
            return $http.delete(options.api.base_url + '/api/post/' + id);
        },

        create: function(post) {
            return $http.post(options.api.base_url + '/api/post', {'post': post});
        },

        update: function(post) {
            return $http.put(options.api.base_url + '/api/post', {'post': post});
        },
        
        addvote: function(id, voteValue) {
            return $http.post(options.api.base_url  + '/api/post/addvote', {'vote': {_id: id, votevalue: voteValue}}); 
        },
        
        getVoteStatistik: function(id) {
            return $http.get(options.api.base_url  + '/api/post/statistik/'+ id); 
        },
        
        wsStatistik: function() {
            return $http.get(options.api.base_url  + '/api/wsstatistik/all'); 
        }
    };
});

appServices.factory('UserService', function ($http) {
    return {
        signIn: function(username, password) {
            return $http.post(options.api.base_url + '/api/user/signin', {username: username, password: password});
        },

        logOut: function() {
            return $http.get(options.api.base_url + '/api/user/logout');
        },

        register: function(username, password, passwordConfirmation) {
            return $http.post(options.api.base_url + '/api/user/register', {username: username, password: password, passwordConfirmation: passwordConfirmation });
        }
    }
});
