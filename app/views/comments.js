var reply = {
    components: {

        'comments-reply': {

            props: ['comment', 'reply'],
            template: '#comments-reply',

            data: function () {
                return _.extend({
                    author: '',
                    email: '',
                    content: ''
                }, window.$comments);
            },

            methods: {

                save: function () {

                    var comment = {
                        parent_id: this.comment ? this.comment.id : 0,
                        post_id: this.config.post,
                        content: this.content
                    };

                    if (!this.user.isAuthenticated) {
                        comment.author = this.author;
                        comment.email = this.email;
                    }

                    this.$set('error', false);

                    this.$resource('api/blog/comment/:id').save({id: 0}, {comment: comment}, function (data) {

                        this.$set('reply', 0);
                        this.$set('author', '');
                        this.$set('email', '');
                        this.$set('content', '');
                        this.$set('replyForm', {});

                        if (!this.user.skipApproval) {

                            var message = this.$trans('Thank you! Your comment needs approval before showing up.');

                            this.messages.push(message);
                        }

                        if (this.user.skipApproval) {

                            this.$root.load().success(function () {
                                window.location.hash = 'comment-' + data.comment.id;
                            });
                        }

                    }, function () {

                        // TODO better error messages
                        this.$set('error', this.$trans('Unable to comment. Please try again later.'));
                    });
                },

                cancel: function () {
                    this.$set('reply', 0);
                }

            }

        }
    }
};

module.exports = {

    data: function () {
        return _.extend({
            post: {},
            tree: {},
            comments: [],
            messages: [],
            count: 0,
            reply: 0,
            error: false
        }, window.$comments);
    },

    mixins: [reply],

    created: function () {
        this.load();
    },

    methods: {

        load: function () {

            return this.$resource('api/blog/comment/:id').query({post: this.config.post}, function (data) {

                this.$set('comments', data.comments);
                this.$set('tree', _.groupBy(data.comments, 'parent_id'));
                this.$set('post', data.posts[0]);
                this.$set('count', data.count);
                this.$set('reply', 0);
            });
        }

    },

    components: {

        'comments-item': {

            name: 'comments-item',
            props: ['depth', 'comment', 'reply'],
            template: '#comments-item',
            mixins: [reply],

            data: function () {
                return _.extend({
                    post: this.$root.post,
                    tree: this.$root.tree
                }, window.$comments);
            },

            computed: {

                showReply: function () {
                    return this.config.enabled && this.reply && this.reply == this.comment.id;
                },

                showReplyButton: function () {
                    return this.config.enabled && this.depth < this.config.max_depth && !this.showReply;
                },

                remainder: function () {
                    return this.depth >= this.config.max_depth && this.tree[this.comment.id] || [];
                },

                permalink: function () {
                    return $pagekit.url + this.post.url + '#comment-' + this.comment.id;
                }

            },

            methods: {

                replyTo: function () {
                    this.$set('reply', this.comment.id);
                }

            }

        }

    }

};

jQuery(function () {
    new Vue(module.exports).$mount('#comments');
});
