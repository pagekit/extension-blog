<?php
namespace Pagekit\Blog\Controller;

use Pagekit\Application as App;
use Pagekit\Blog\Model\Category;

/**
 * @Access("blog: manage all categories")
 * @Route("category", name="category")
 */
class CategoryApiController
{
    /**
     * @Route("/", methods="GET")
     * @Request({"filter": "array", "page":"int"})
     */
    public function indexAction($filter = [], $page = 0)
    {
        $query  = Category::query();
        $filter = array_merge(array_fill_keys(['status', 'search', 'author', 'order', 'limit'], ''), $filter);
        
        extract($filter, EXTR_SKIP);
        
        if ($search) {
            $query->where(function ($query) use ($search) {
                $query->orWhere(['title LIKE :search', 'slug LIKE :search'], ['search' => "%{$search}%"]);
            });
        }
        
        if (!preg_match('/^(title|slug)\s(asc|desc)$/i', $order, $order)) {
            $order = [1 => 'title', 2 => 'desc'];
        }
        
        $limit = (int) $limit ?: App::module('category')->config('categories.categories_per_page');
        $count = $query->count();
        $pages = ceil($count / $limit);
        $page  = max(0, min($pages - 1, $page));
        
        $categories = array_values($query->offset($page * $limit)->limit($limit)->orderBy($order[1], $order[2])->get());
        
        return compact('categories', 'pages', 'count');
    }
    
    /**
     * @Route("/{id}", methods="GET", requirements={"id"="\d+"})
     */
    public function getAction($id)
    {
        return Category::where(compact('id'))->first();
    }
    
    /**
     * @Route("/", methods="POST")
     * @Route("/{id}", methods="POST", requirements={"id"="\d+"})
     * @Request({"category": "array", "id": "int"}, csrf=true)
     */
    public function saveAction($data, $id = 0)
    {
        if (!$id || !$category = Category::find($id)) {
            
            if ($id) {
                App::abort(404, __('Category not found.'));
            }
            
            $category = Category::create();
        }
        
        if (!$data['slug'] = App::filter($data['slug'] ?: $data['title'], 'slugify')) {
            App::abort(400, __('Invalid slug.'));
        }
        
        // user without universal access can only edit their own posts
        if(!App::user()->hasAccess('blog: manage all categories')) {
            App::abort(400, __('Access denied.'));
        }
        
        $category->save($data);
        
        return ['message' => 'success', 'category' => $category];
    }
    
    /**
     * @Route("/{id}", methods="DELETE", requirements={"id"="\d+"})
     * @Request({"id": "int"}, csrf=true)
     */
    public function deleteAction($id)
    {
        if ($category = Category::find($id)) {
            
            if(!App::user()->hasAccess('blog: manage all categories')) {
                App::abort(400, __('Access denied.'));
            }
            
            $category->delete();
        }
        
        return ['message' => 'success'];
    }

    /**
     * @Route("/bulk", methods="POST")
     * @Request({"posts": "array"}, csrf=true)
     */
    public function bulkSaveAction($categories = [])
    {
        foreach ($categories as $data) {
            $this->saveAction($data, isset($data['id']) ? $data['id'] : 0);
        }

        return ['message' => 'success'];
    }

    /**
     * @Route("/bulk", methods="DELETE")
     * @Request({"ids": "array"}, csrf=true)
     */
    public function bulkDeleteAction($ids = [])
    {
        foreach (array_filter($ids) as $id) {
            $this->deleteAction($id);
        }

        return ['message' => 'success'];
    }
}