<?php
namespace Pagekit\Blog\Controller;

use Pagekit\Application as App;
use Pagekit\Blog\Model\Category;
use Pagekit\Blog\Model\Post;

class PostCategoryController
{

    /**
     * @var Module
     */
    protected $blog;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->blog = App::module('blog');
    }

    /**
     * @Route("/", methods="GET")
     * @Route("/{page}", methods="GET", requirements={"page": "\d+"})
     * @Route("/{postSlug}", methods="GET")
     */
    public function indexAction($postSlug = null, $page = 1)
    {
        $categorySlug = App::url()->getFirstURLPath();

        if (!$category = Category::where(['slug = ?'], [$categorySlug])->first()) {
            App::abort(404, __('Category not found!'));
        }

        if ($postSlug == null) {
            return $this->postsByCategory($category, $page);
        }

        if (!$post = Post::where(['slug = ?', 'status = ?', 'date < ?'], [$postSlug, Post::STATUS_PUBLISHED, new \DateTime])->related('user')->first()) {
            App::abort(404, __('Post not found!'));
        }

        $post->excerpt = App::content()->applyPlugins($post->excerpt, ['post' => $post, 'markdown' => $post->get('markdown')]);
        $post->content = App::content()->applyPlugins($post->content, ['post' => $post, 'markdown' => $post->get('markdown')]);

        $user = App::user();

        $description = $post->get('meta.og:description');
        if (!$description) {
            $description = strip_tags($post->excerpt ?: $post->content);
            $description = rtrim(mb_substr($description, 0, 150), " \t\n\r\0\x0B.,") . '...';
        }

        return [
            '$view' => [
                'title' => __($post->title),
                'name' => 'blog/post.php',
                'og:type' => 'article',
                'article:published_time' => $post->date->format(\DateTime::ATOM),
                'article:modified_time' => $post->modified->format(\DateTime::ATOM),
                'article:author' => $post->user->name,
                'og:title' => $post->get('meta.og:title') ?: $post->title,
                'og:description' => $description,
                'og:image' =>  $post->get('image.src') ? App::url()->getStatic($post->get('image.src'), [], 0) : false
            ],
            '$comments' => [
                'config' => [
                    'post' => $post->id,
                    'enabled' => $post->isCommentable(),
                    'requireinfo' => $this->blog->config('comments.require_email'),
                    'max_depth' => $this->blog->config('comments.max_depth'),
                    'user' => [
                        'name' => $user->name,
                        'isAuthenticated' => $user->isAuthenticated(),
                        'canComment' => $user->hasAccess('blog: post comments'),
                        'skipApproval' => $user->hasAccess('blog: skip comment approval')
                    ]
                ]
            ],
            'blog' => $this->blog,
            'post' => $post
        ];
    }

    private function postsByCategory($category, $page) {
        $query = Post::where(['category_id = ?', 'status = ?', 'date < ?'], [$category->id, Post::STATUS_PUBLISHED, new \DateTime])->where(function ($query) {
            return $query->where('roles IS NULL')->whereInSet('roles', App::user()->roles, false, 'OR');
        })->related('user');

        if (!$limit = $this->blog->config('posts.posts_per_page')) {
            $limit = 10;
        }

        $count = $query->count('id');
        $total = ceil($count / $limit);
        $page = max(1, min($total, $page));

        $query->offset(($page - 1) * $limit)->limit($limit)->orderBy('modified', 'DESC');

        foreach ($posts = $query->get() as $post) {
            $post->excerpt = App::content()->applyPlugins($post->excerpt, ['post' => $post, 'markdown' => $post->get('markdown')]);
            $post->content = App::content()->applyPlugins($post->content, ['post' => $post, 'markdown' => $post->get('markdown'), 'readmore' => true]);
        }

        return [
            '$view' => [
                'title' => __($category->title),
                'name' => 'blog/category.php'
            ],
            'category' => $category,
            'blog' => $this->blog,
            'posts' => $posts,
            'total' => $total,
            'page' => $page
        ];
    }
}