<?php

namespace Pagekit\Blog;

use Pagekit\Application as App;
use Pagekit\Blog\Model\Post;
use Pagekit\Blog\Model\Tag;
use Pagekit\Routing\ParamsResolverInterface;
use Symfony\Component\Routing\Exception\RouteNotFoundException;

class TagUrlResolver implements ParamsResolverInterface
{
    const CACHE_KEY = 'blog.routing.tag';

    /**
     * @var bool
     */
    protected $cacheDirty = false;

    /**
     * @var array
     */
    protected $cacheEntries;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->cacheEntries = App::cache()->fetch(self::CACHE_KEY) ?: [];
    }

    /**
     * {@inheritdoc}
     */
    public function match(array $parameters = [])
    {
        if (isset($parameters['id'])) {
            return $parameters;
        }

        if (!isset($parameters['tag'])) {
            App::abort(404, 'Tag not found.');
        }

        $slug = $parameters['tag'];

        $id = false;
        foreach ($this->cacheEntries as $entry) {
            if ($entry['slug'] === $slug) {
                $id = $entry['id'];
            }
        }

        if (!$id) {

            if (!$tag = Tag::where(compact('slug'))->first()) {
                App::abort(404, 'Tag not found.');
            }

            $this->addCache($tag);
            $id = $tag->id;
        }

        $parameters['id'] = $id;
        return $parameters;
    }

    /**
     * {@inheritdoc}
     */
    public function generate(array $parameters = [])
    {
        $id = $parameters['id'];

        if (!isset($this->cacheEntries[$id])) {

            if (!$tag = Tag::where(compact('id'))->first()) {
                throw new RouteNotFoundException('Tag not found!');
            }

            $this->addCache($tag);
        }

        $meta = $this->cacheEntries[$id];

        $parameters['tag'] = $meta['slug'];

        unset($parameters['id']);
        return $parameters;
    }

    public function __destruct()
    {
        if ($this->cacheDirty) {
            App::cache()->save(self::CACHE_KEY, $this->cacheEntries);
        }
    }

    protected function addCache($tag)
    {
        $this->cacheEntries[$tag->id] = [
            'id'     => $tag->id,
            'slug'   => $tag->slug
        ];

        $this->cacheDirty = true;
    }
}
