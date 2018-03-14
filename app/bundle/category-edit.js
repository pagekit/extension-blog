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
/***/ (function(module, exports, __webpack_require__) {

	window.Category = {

	    el: '#category',

	    data: function () {
	        return {
	            data: window.$data,
	            category: window.$data.category,
	            sections: []
	        }
	    },

	    created: function () {

	        var sections = [];

	        _.forIn(this.$options.components, function (component, name) {

	            var options = component.options || {};

	            if (options.section) {
	                sections.push(_.extend({name: name, priority: 0}, options.section));
	            }

	        });

	        this.$set('sections', _.sortBy(sections, 'priority'));

	        this.resource = this.$resource('api/blog/category{/id}');
	    },

	    ready: function () {
	        this.tab = UIkit.tab(this.$els.tab, {connect: this.$els.content});
	    },

	    methods: {

	        save: function () {
	            var data = {category: this.category, id: this.category.id};

	            this.$broadcast('save', data);

	            this.resource.save({id: this.category.id}, data).then(function (res) {

	                var data = res.data;

	                if (!this.category.id) {
	                    window.history.replaceState({}, '', this.$url.route('admin/blog/category/edit', {id: data.category.id}))
	                }

	                this.$set('category', data.category);

	                this.$notify('Category saved.');

	            }, function (res) {
	                this.$notify(res.data, 'danger');
	            });
	        }

	    },

	    components: {

	        settings: __webpack_require__(1)

	    }

	};

	Vue.ready(window.Category);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(2)
	if (Object.keys(__vue_script__).some(function (key) { return key !== "default" && key !== "__esModule" })) {
	  console.warn("[vue-loader] app/components/category-settings.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(3)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-425cee52/category-settings.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = {

	    props: ['category', 'data', 'form'],

	    section: {
	        label: 'Category'
	    }

	};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = "\n\n<div class=\"uk-grid pk-grid-large pk-width-sidebar-large uk-form-stacked\" data-uk-grid-margin>\n    <div class=\"pk-width-content\">\n        <div class=\"uk-form-row\">\n            <input class=\"uk-width-1-1 uk-form-large\" type=\"text\" name=\"title\"\n                   :placeholder=\"'Category Title' | trans\" v-model=\"category.title\" v-validate:required>\n            <p class=\"uk-form-help-block uk-text-danger\" v-show=\"form.title.invalid\">\n                {{ 'Title cannot be blank.' | trans }}</p>\n        </div>\n        <div class=\"uk-form-row\">\n            <input class=\"uk-width-1-1 uk-form-large\" type=\"text\" name=\"slug\" :placeholder=\"'Category Slug' | trans\"\n                   v-model=\"category.slug\" v-validate:required>\n            <p class=\"uk-form-help-block uk-text-danger\" v-show=\"form.slug.invalid\">\n                {{ 'Slug cannot be blank.' | trans }}</p>\n        </div>\n    </div>\n</div>\n\n";

/***/ })
/******/ ]);