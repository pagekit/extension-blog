<?php $view->script('posts', 'blog:app/bundle/posts.js', 'vue') ?>

<h1>
<?= $category->title ?>
</h1>

<?php foreach ($posts as $post) : ?>
    <article class="uk-article">

        <?php if ($image = $post->get('image.src')): ?>
            <a class="uk-display-block" href="<?= $view->url('@blog/id', ['id' => $post->id]) ?>"><img src="<?= $image ?>" alt="<?= $post->get('image.alt') ?>"></a>
        <?php endif ?>

        <h1 class="uk-article-title"><a href="<?= $view->url('@blog/id', ['id' => $post->id]) ?>"><?= $post->title ?></a></h1>

        <p class="uk-article-meta">
            <?= __('Written by %name% on %date%', ['%name%' => $this->escape($post->user->name), '%date%' => '<time datetime="'.$post->date->format(\DateTime::ATOM).'" v-cloak>{{ "'.$post->date->format(\DateTime::ATOM).'" | date "longDate" }}</time>' ]) ?>
        </p>

        <div class="uk-margin"><?= $post->excerpt ?: $post->content ?></div>

        <ul class="uk-subnav">

            <?php if (isset($post->readmore) && $post->readmore || $post->excerpt) : ?>
                <li><a href="<?= $view->url('@blog/id', ['id' => $post->id]) ?>"><?= __('Read more') ?></a></li>
            <?php endif ?>

            <?php if ($post->isCommentable() || $post->comment_count) : ?>
                <li><a href="<?= $view->url('@blog/id#comments', ['id' => $post->id]) ?>"><?= _c('{0} No comments|{1} %num% Comment|]1,Inf[ %num% Comments', $post->comment_count, ['%num%' => $post->comment_count]) ?></a></li>
            <?php endif ?>

        </ul>

    </article>
<?php endforeach ?>