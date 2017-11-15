<?php

namespace Pagekit\Blog\Controller;

use Pagekit\Application as App;
use Pagekit\Blog\Model\Category;
use Pagekit\Blog\Model\Post;

class PostTagController
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
     * @Route("/")
     * @Route("/{tag}", methods="GET")
     * @Route("/{tag}/{page}", methods="GET", requirements={"page": "\d+"})
     */
    public function indexAction($tag = null, $page = 1)
    {
        $query = Post::where(['status = ?', 'date < ?'], [Post::STATUS_PUBLISHED, new \DateTime])->where(function ($query) {
            return $query->where('roles IS NULL')->whereInSet('roles', App::user()->roles, false, 'OR');
        })->where('tag1 = ? OR tag2 = ? OR tag3 = ? OR tag4 = ? OR tag5 = ? OR tag6 = ? OR tag7 = ? OR tag8 = ? OR tag9 = ? OR tag10 = ?', [$tag, $tag, $tag, $tag, $tag, $tag, $tag, $tag, $tag, $tag])->related('user', 'category');

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
                'title' => $tag,
                'name' => 'blog/tag.php'
            ],
            'tag' => $tag,
            'blog' => $this->blog,
            'posts' => $posts,
            'total' => $total,
            'page' => $page
        ];
    }
}