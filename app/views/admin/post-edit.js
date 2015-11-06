window.Post = module.exports = {

    data: function () {
        return {
            data: window.$data,
            post: window.$data.post
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

        this.resource = this.$resource('api/blog/post/:id');
    },

    ready: function () {
        this.tab = UIkit.tab(this.$els.tab, {connect: this.$els.content});
    },

    computed: {

        statuses: function () {
            return _.map(this.data.statuses, function (status, id) {
                return {text: status, value: id};
            });
        },

        authors: function () {
            return this.data.authors.map(function (user) {
                return {text: user.username, value: user.id};
            });
        }

    },

    methods: {

        save: function () {
            var data = {post: this.post, id: this.post.id};

            this.$broadcast('save', data);

            this.resource.save({id: this.post.id}, data, function (data) {

                if (!this.post.id) {
                    window.history.replaceState({}, '', this.$url.route('admin/blog/post/edit', {id: data.post.id}))
                }

                this.$set('post', data.post);

                this.$notify('Post saved.');

            }, function (data) {
                this.$notify(data, 'danger');
            });
        }

    },

    components: {

        settings: require('../../components/post-settings.vue')

    }

};

$(function () {

    new Vue(module.exports).$mount('#post');

});
