<?php
namespace Pagekit\Blog\Model;

use Pagekit\Database\ORM\ModelTrait;

trait CategoryModelTrait
{
    use ModelTrait;
        
    /**
     * @Saving
     */
    public static function saving($event, Category $category)
    {
        $category->modified = new \DateTime();
        
        $i  = 2;
        $id = $category->id;
        
        while (self::where('slug = ?', [$category->slug])->where(function ($query) use ($id) {
            if ($id) {
                $query->where('id <> ?', [$id]);
            }
        })->first()) {
            $category->slug = preg_replace('/-\d+$/', '', $category->slug).'-'.$i++;
        }
    }
}
