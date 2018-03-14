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

	    name: 'category',

	    el: '#categories',

	    data: function() {
	        return _.merge({
	            categories: false,
	            config: {
	                filter: this.$session.get('categories.filter', {order: 'date desc', limit:25})
	            },
	            pages: 0,
	            count: '',
	            selected: [],
	            canEditAll: false
	        }, window.$data);
	    },

	    ready: function () {
	        this.resource = this.$resource('api/blog/category{/id}');
	        this.$watch('config.page', this.load, {immediate: true});
	    },

	    watch: {

	        'config.filter': {
	            handler: function (filter) {
	                if (this.config.page) {
	                    this.config.page = 0;
	                } else {
	                    this.load();
	                }

	                this.$session.set('categories.filter', filter);
	            },
	            deep: true
	        }

	    },

	    computed: {

	        statusOptions: function () {

	            var options = _.map(this.$data.statuses, function (status, id) {
	                return { text: status, value: id };
	            });

	            return [{ label: this.$trans('Filter by'), options: options }];
	        },

	        authors: function() {

	            var options = _.map(this.$data.authors, function (author) {
	                return { text: author.username, value: author.user_id };
	            });

	            return [{ label: this.$trans('Filter by'), options: options }];
	        }
	    },

	    methods: {

	        active: function (category) {
	            return this.selected.indexOf(category.id) != -1;
	        },

	        save: function (category) {
	            this.resource.save({ id: category.id }, { category: category }).then(function () {
	                this.load();
	                this.$notify('Category saved.');
	            });
	        },

	        status: function(status) {

	            var categories = this.getSelected();

	            categories.forEach(function(category) {
	                category.status = status;
	            });

	            this.resource.save({ id: 'bulk' }, { categories: categories }).then(function () {
	                this.load();
	                this.$notify('Categories saved.');
	            });
	        },

	        remove: function() {

	            this.resource.delete({ id: 'bulk' }, { ids: this.selected }).then(function () {
	                this.load();
	                this.$notify('Categories deleted.');
	            });
	        },

	        load: function () {
	            this.resource.query({ filter: this.config.filter, page: this.config.page }).then(function (res) {

	                var data = res.data;

	                this.$set('categories', data.categories);
	                this.$set('pages', data.pages);
	                this.$set('count', data.count);
	                this.$set('selected', []);
	            });
	        },

	        getSelected: function() {
	            return this.categories.filter(function(category) { return this.selected.indexOf(category.id) !== -1; }, this);
	        }
	    }
	};

	Vue.ready(module.exports);


/***/ })
/******/ ]);