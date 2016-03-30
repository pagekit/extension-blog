<?php $view->script('post', 'blog:app/bundle/post.js', 'vue') ?>

<article class="uk-article" itemscope itemtype="http://schema.org/Article">

    <?php if ($image = $post->get('image.src')): ?>
    <img src="<?= $image ?>" alt="<?= $post->get('image.alt') ?>">
    <?php endif ?>

    <h1 class="uk-article-title" itemprop="headline"><?= $post->title ?></h1>

    <p class="uk-article-meta" itemprop="author"><?= __('Written by %name% on %date%', ['%name%' => '<span itemprop="author">'.$post->user->name.'</span>', '%date%' => '<time datetime="'.$post->date->format(\DateTime::ATOM).'" itemprop="dateCreated" v-cloak>{{ "'.$post->date->format(\DateTime::ATOM).'" | date "longDate" }}</time>' ]) ?></p>

    <div class="uk-margin" itemprop="articleBody"><?= $post->content ?></div>

    <?= $view->render('blog/comments.php') ?>

</article>
