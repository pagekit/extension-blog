module.exports = [

    {
        entry: {
            "category-index": "./app/views/admin/category-index",
            "category-edit": "./app/views/admin/category-edit",
            "comment-index": "./app/views/admin/comment-index",
            "post-edit": "./app/views/admin/post-edit",
            "post-index": "./app/views/admin/post-index",
            "settings": "./app/views/admin/settings",
            "comments": "./app/views/comments",
            "post": "./app/views/post",
            "posts": "./app/views/posts",
            "link-blog": "./app/components/link-blog.vue",
            "post-meta": "./app/components/post-meta.vue"
        },
        output: {
            filename: "./app/bundle/[name].js"
        },
        module: {
            loaders: [
                { test: /\.vue$/, loader: "vue" }
            ]
        }
    }

];
