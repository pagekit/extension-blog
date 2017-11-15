<?php

namespace Pagekit\Blog\Model;

/**
 * @Entity(tableClass="@blog_category")
 */
class Category 
{
    use CategoryModelTrait;

    /**
     * @Column(type="integer")
     * @Id
     */
    public $id;
    
    /** @Column(type="string") */
    public $title;
    
    /** @Column(type="string") */
    public $slug;

}