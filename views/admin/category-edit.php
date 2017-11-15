<?php $view->script('category-edit', 'blog:app/bundle/category-edit.js', 'vue') ?>

<form id="category" class="uk-form" v-validator="form" @submit.prevent="save | valid" v-cloak>

    <div class="uk-margin uk-flex uk-flex-space-between uk-flex-wrap" data-uk-margin>
        <div data-uk-margin>

            <h2 class="uk-margin-remove" v-if="category.id">{{ 'Edit Category' | trans }}</h2>
            <h2 class="uk-margin-remove" v-else>{{ 'Add Category' | trans }}</h2>

        </div>
        <div data-uk-margin>

            <a class="uk-button uk-margin-small-right" :href="$url.route('admin/blog/category')">{{ category.id ? 'Close' : 'Cancel' | trans }}</a>
            <button class="uk-button uk-button-primary" type="submit">{{ 'Save' | trans }}</button>

        </div>
    </div>

    <ul class="uk-tab" v-el:tab v-show="sections.length > 1">
        <li v-for="section in sections"><a>{{ section.label | trans }}</a></li>
    </ul>

    <div class="uk-switcher uk-margin" v-el:content>
        <div v-for="section in sections">
            <component :is="section.name" :category.sync="category" :data.sync="data" :form="form"></component>
        </div>
    </div>

</form>
