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

	window.Post = {

	    el: '#post',

	    data: function () {
	        return {
	            data: window.$data,
	            post: window.$data.post,
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

	        this.resource = this.$resource('api/blog/post{/id}');
	    },

	    ready: function () {
	        this.tab = UIkit.tab(this.$els.tab, {connect: this.$els.content});
	    },

	    methods: {

	        save: function () {
	            var data = {post: this.post, id: this.post.id};

	            this.$broadcast('save', data);

	            this.resource.save({id: this.post.id}, data).then(function (res) {

	                var data = res.data;

	                if (!this.post.id) {
	                    window.history.replaceState({}, '', this.$url.route('admin/blog/post/edit', {id: data.post.id}))
	                }

	                this.$set('post', data.post);

	                this.$notify('Post saved.');

	            }, function (res) {
	                this.$notify(res.data, 'danger');
	            });
	        }

	    },

	    components: {

	        settings: __webpack_require__(6)

	    }

	};

	Vue.ready(window.Post);


/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(7)
	if (Object.keys(__vue_script__).some(function (key) { return key !== "default" && key !== "__esModule" })) {
	  console.warn("[vue-loader] app/components/post-settings.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(8)
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
	  var id = "_v-26c47a16/post-settings.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = {

	    props: ['post', 'data', 'form'],

	    section: {
	        label: 'Post'
	    }

	};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = "\n\n<div class=\"uk-grid pk-grid-large pk-width-sidebar-large uk-form-stacked\" data-uk-grid-margin>\n    <div class=\"pk-width-content\">\n\n        <div class=\"uk-form-row\">\n            <input class=\"uk-width-1-1 uk-form-large\" type=\"text\" name=\"title\" :placeholder=\"'Enter Title' | trans\" v-model=\"post.title\" v-validate:required>\n            <p class=\"uk-form-help-block uk-text-danger\" v-show=\"form.title.invalid\">{{ 'Title cannot be blank.' | trans }}</p>\n        </div>\n        <div class=\"uk-form-row\">\n            <v-editor id=\"post-content\" :value.sync=\"post.content\" :options=\"{markdown : post.data.markdown}\"></v-editor>\n        </div>\n        <div class=\"uk-form-row\">\n            <label for=\"form-post-excerpt\" class=\"uk-form-label\">{{ 'Excerpt' | trans }}</label>\n            <div class=\"uk-form-controls\">\n                <v-editor id=\"post-excerpt\" :value.sync=\"post.excerpt\" :options=\"{markdown : post.data.markdown, height: 250}\"></v-editor>\n            </div>\n        </div>\n\n    </div>\n    <div class=\"pk-width-sidebar\">\n\n        <div class=\"uk-panel\">\n\n            <div class=\"uk-form-row\">\n                <label for=\"form-image\" class=\"uk-form-label\">{{ 'Image' | trans }}</label>\n                <div class=\"uk-form-controls\">\n                    <input-image-meta :image.sync=\"post.data.image\" class=\"pk-image-max-height\"></input-image-meta>\n                </div>\n            </div>\n\n            <div class=\"uk-form-row\">\n                <label for=\"form-slug\" class=\"uk-form-label\">{{ 'Slug' | trans }}</label>\n                <div class=\"uk-form-controls\">\n                    <input id=\"form-slug\" class=\"uk-width-1-1\" type=\"text\" v-model=\"post.slug\">\n                </div>\n            </div>\n            <div class=\"uk-form-row\">\n                <label for=\"form-category\" class=\"uk-form-label\">{{ 'Category' | trans }}</label>\n                <div class=\"uk-form-controls\">\n                    <select id=\"form-category\" class=\"uk-width-1-1\" v-model=\"post.category_id\">\n                        <option v-for=\"category in data.categories\" :value=\"category.id\">{{category.title}}</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"uk-form-row\">\n                <label for=\"form-tags\" class=\"uk-form-label\">{{ 'Tags' | trans }}</label>\n                <div class=\"uk-form-controls\">\n                    <input id=\"form-tags\" class=\"uk-width-1-1\" type=\"text\" v-model=\"post.tags\">\n                    <small>Separeted by semicolon ';'</small>\n                </div>\n            </div>\n            <div class=\"uk-form-row\">\n                <label for=\"form-status\" class=\"uk-form-label\">{{ 'Status' | trans }}</label>\n                <div class=\"uk-form-controls\">\n                    <select id=\"form-status\" class=\"uk-width-1-1\" v-model=\"post.status\">\n                        <option v-for=\"(id, status) in data.statuses\" :value=\"id\">{{status}}</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"uk-form-row\" v-if=\"data.canEditAll\">\n                <label for=\"form-author\" class=\"uk-form-label\">{{ 'Author' | trans }}</label>\n                <div class=\"uk-form-controls\">\n                    <select id=\"form-author\" class=\"uk-width-1-1\" v-model=\"post.user_id\">\n                        <option v-for=\"author in data.authors\" :value=\"author.id\">{{author.username}}</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"uk-form-row\">\n                <span class=\"uk-form-label\">{{ 'Publish on' | trans }}</span>\n                <div class=\"uk-form-controls\">\n                    <input-date :datetime.sync=\"post.date\"></input-date>\n                </div>\n            </div>\n\n            <div class=\"uk-form-row\">\n                <span class=\"uk-form-label\">{{ 'Restrict Access' | trans }}</span>\n                <div class=\"uk-form-controls uk-form-controls-text\">\n                    <p v-for=\"role in data.roles\" class=\"uk-form-controls-condensed\">\n                        <label><input type=\"checkbox\" :value=\"role.id\" v-model=\"post.roles\" number> {{ role.name }}</label>\n                    </p>\n                </div>\n            </div>\n            <div class=\"uk-form-row\">\n                <span class=\"uk-form-label\">{{ 'Options' | trans }}</span>\n                <div class=\"uk-form-controls\">\n                    <label><input type=\"checkbox\" v-model=\"post.data.markdown\" value=\"1\"> {{ 'Enable Markdown' | trans }}</label>\n                </div>\n                <div class=\"uk-form-controls\">\n                    <label><input type=\"checkbox\" v-model=\"post.comment_status\" value=\"1\"> {{ 'Enable Comments' | trans }}</label>\n                </div>\n            </div>\n\n        </div>\n\n    </div>\n</div>\n\n";

/***/ })
/******/ ]);