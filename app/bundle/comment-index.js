/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	module.exports = {

	    name: 'comment',

	    el: '#comments',

	    data: function () {
	        return _.merge({
	            posts: [],
	            config: {
	                filter: this.$session.get('comments.filter', {})
	            },
	            comments: false,
	            pages: 0,
	            count: '',
	            selected: [],
	            user: window.$pagekit.user,
	            replyComment: {},
	            editComment: {}
	        }, window.$data);
	    },

	    ready: function () {

	        this.Comments = this.$resource('api/blog/comment{/id}');
	        this.$watch('config.page', this.load, {immediate: true});

	        UIkit.init(this.$el);
	    },

	    watch: {

	        'config.filter': {
	            handler: function (filter) {
	                if (this.config.page) {
	                    this.config.page = 0;
	                } else {
	                    this.load();
	                }

	                this.$session.set('comments.filter', filter);
	            },
	            deep: true
	        }

	    },

	    computed: {

	        statusOptions: function () {

	            var options = _.map(this.$data.statuses, function (status, id) {
	                return {text: status, value: id};
	            });

	            return [{label: this.$trans('Filter by'), options: options}];
	        }

	    },

	    methods: {

	        active: function (comment) {
	            return this.selected.indexOf(comment.id) != -1;
	        },

	        submit: function () {
	            this.save(this.editComment.id ? this.editComment : this.replyComment);
	        },

	        save: function (comment) {
	            return this.Comments.save({id: comment.id}, {comment: comment}).then(function () {
	                this.load();
	                this.$notify('Comment saved.');
	            }, function (res) {
	                this.$notify(res.data, 'danger');
	            });
	        },

	        status: function (status) {

	            var comments = this.getSelected();

	            comments.forEach(function (comment) {
	                comment.status = status;
	            });

	            this.Comments.save({id: 'bulk'}, {comments: comments}).then(function () {
	                this.load();
	                this.$notify('Comments saved.');
	            });
	        },

	        remove: function () {
	            this.Comments.delete({id: 'bulk'}, {ids: this.selected}).then(function () {
	                this.load();
	                this.$notify('Comments deleted.');
	            });
	        },

	        load: function () {

	            this.cancel();

	            this.Comments.query({filter: this.config.filter, post: this.config.post && this.config.post.id || 0, page: this.config.page, limit: this.config.limit}).then(function (res) {

	                var data = res.data;

	                this.$set('posts', data.posts);
	                this.$set('comments', data.comments);
	                this.$set('pages', data.pages);
	                this.$set('count', data.count);
	                this.$set('selected', []);
	            });
	        },

	        getSelected: function () {
	            var vm = this;
	            return this.comments.filter(function (comment) {
	                return vm.selected.indexOf(comment.id) !== -1;
	            });
	        },

	        getStatusText: function (comment) {
	            return this.statuses[comment.status];
	        },

	        cancel: function () {
	            this.$set('replyComment', {});
	            this.$set('editComment', {});
	        },

	        reply: function (comment) {
	            this.cancel();
	            this.$set('replyComment', {parent_id: comment.id, post_id: comment.post_id, author: this.user.name, email: this.user.email});
	        },

	        edit: function (comment) {
	            this.cancel();
	            this.$set('editComment', _.merge({}, comment));
	        },

	        toggleStatus: function (comment) {
	            comment.status = comment.status === 1 ? 0 : 1;
	            this.save(comment);
	        }

	    },

	    partials: {
	        'default-row': '#default-row',
	        'edit-row': '#edit-row'
	    }

	};

	Vue.ready(module.exports);


/***/ })
/******/ ]);