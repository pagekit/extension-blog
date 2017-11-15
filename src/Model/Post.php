<?php

namespace Pagekit\Blog\Model;

use Pagekit\Application as App;
use Pagekit\System\Model\DataModelTrait;
use Pagekit\User\Model\AccessModelTrait;
use Pagekit\User\Model\User;

/**
 * @Entity(tableClass="@blog_post")
 */
class Post implements \JsonSerializable
{
    use AccessModelTrait, DataModelTrait, PostModelTrait;

    /* Post draft status. */
    const STATUS_DRAFT = 0;

    /* Post pending review status. */
    const STATUS_PENDING_REVIEW = 1;

    /* Post published. */
    const STATUS_PUBLISHED = 2;

    /* Post unpublished. */
    const STATUS_UNPUBLISHED = 3;

    /** @Column(type="integer") @Id */
    public $id;

    /** @Column(type="string") */
    public $title;

    /** @Column(type="string") */
    public $slug;

    /** @Column(type="integer") */
    public $user_id;

    /** @Column(type="integer") */
    public $category_id;

    /** @Column(type="datetime") */
    public $date;

    /** @Column(type="text") */
    public $content = '';

    /** @Column(type="text") */
    public $excerpt = '';

    /** @Column(type="smallint") */
    public $status;

    /** @Column(type="datetime") */
    public $modified;

    /** @Column(type="boolean") */
    public $comment_status;

    /** @Column(type="integer") */
    public $comment_count = 0;

    /**
     * @BelongsTo(targetEntity="Pagekit\Blog\Model\Category", keyFrom="category_id")
     */
    public $category;

    /**
     * @BelongsTo(targetEntity="Pagekit\User\Model\User", keyFrom="user_id")
     */
    public $user;

    /**
     * @HasMany(targetEntity="Comment", keyFrom="id", keyTo="post_id")
     * @OrderBy({"created" = "DESC"})
     */
    public $comments;

    public $tags;

    /** @Column(type="string") */
    public $tag1;

    /** @Column(type="string") */
    public $tag2;

    /** @Column(type="string") */
    public $tag3;

    /** @Column(type="string") */
    public $tag4;

    /** @Column(type="string") */
    public $tag5;

    /** @Column(type="string") */
    public $tag6;

    /** @Column(type="string") */
    public $tag7;

    /** @Column(type="string") */
    public $tag8;

    /** @Column(type="string") */
    public $tag9;

    /** @Column(type="string") */
    public $tag10;

    public function setCategory($category)
    {
        $this->category = $category;

        if ($category) {
            $this->category_id = $category->id;
        }
    }

    public function getCategory()
    {
        return $this->category;
    }

    public function getTags()
    {
        $list = array();

        for ($i = 1; $i <= 10; $i++) {
            $fieldName = 'tag' . $i;
            if ($this->{$fieldName} != null) {
                $list[] = $this->{$fieldName};
            }
        }

        return $list;
    }

    public function setTags($tags = array())
    {
        $index = 1;
        foreach ($tags as $tag) {
            $fieldName = 'tag' . $index;
            $this->{$fieldName} = trim($tag);
            $index++;
        }

        for ($i = $index; $i <= 10; $i++) {
            $fieldName = 'tag' . $i;
            $this->{$fieldName} = null;
        }
    }

    /** @var array */
    protected static $properties = [
        'author' => 'getAuthor',
        'published' => 'isPublished',
        'accessible' => 'isAccessible',
        'postcategory' => 'getCategory',
        'posttags' => 'getTags'
    ];

    public static function getStatuses()
    {
        return [
            self::STATUS_PUBLISHED => __('Published'),
            self::STATUS_UNPUBLISHED => __('Unpublished'),
            self::STATUS_DRAFT => __('Draft'),
            self::STATUS_PENDING_REVIEW => __('Pending Review')
        ];
    }

    public function getStatusText()
    {
        $statuses = self::getStatuses();

        return isset($statuses[$this->status]) ? $statuses[$this->status] : __('Unknown');
    }

    public function isCommentable()
    {
        $blog      = App::module('blog');
        $autoclose = $blog->config('comments.autoclose') ? $blog->config('comments.autoclose_days') : 0;

        return $this->comment_status && (!$autoclose or $this->date >= new \DateTime("-{$autoclose} day"));
    }

    public function getAuthor()
    {
        return $this->user ? $this->user->username : null;
    }

    public function isPublished()
    {
        return $this->status === self::STATUS_PUBLISHED && $this->date < new \DateTime;
    }

    public function isAccessible(User $user = null)
    {
        return $this->isPublished() && $this->hasAccess($user ?: App::user());
    }

    /**
     * {@inheritdoc}
     */
    public function jsonSerialize()
    {
        $data = [
            'url' => App::url('@blog/id', ['id' => $this->id ?: 0], 'base')
        ];

        if ($this->comments) {
            $data['comments_pending'] = count(array_filter($this->comments, function ($comment) {
                return $comment->status == Comment::STATUS_PENDING;
            }));
        }

        return $this->toArray($data);
    }
}
