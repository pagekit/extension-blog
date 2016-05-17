<?php

namespace Pagekit\Blog\Model;

use Pagekit\Application as App;
use Pagekit\Taxonomy\Model\TermModelTrait;

/**
 * @Entity(tableClass="@blog_tag")
 */
class Tag implements \JsonSerializable
{
    use TermModelTrait;

    /** @Column(type="string") */
    public $slug;

    /**
     * @Saving
     */
    public static function saving($event, $tag)
    {

        // Ensure unique slug
        $i = 2;
        $id = $tag->id;

        if (!$tag->slug) {
            $tag->slug = $tag->title;
        }

        while (self::where(['slug = ?'], [$tag->slug])->where(function ($query) use ($id) {
            if ($id) $query->where('id <> ?', [$id]);
        })->first()) {
            $tag->slug = preg_replace('/-\d+$/', '', $tag->slug).'-'.$i++;
        }

    }

}
