<template>

    <div class="uk-grid pk-grid-large pk-width-sidebar-large uk-form-stacked" data-uk-grid-margin>
        <div class="pk-width-content">
            <div class="uk-form-row">
                <input class="uk-width-1-1 uk-form-large" type="text" name="title"
                       :placeholder="'Category Title' | trans" v-model="category.title" v-validate:required>
                <p class="uk-form-help-block uk-text-danger" v-show="form.title.invalid">
                    {{ 'Title cannot be blank.' | trans }}</p>
            </div>
            <div class="uk-form-row">
                <input class="uk-width-1-1 uk-form-large" type="text" name="slug" :placeholder="'Category Slug' | trans"
                       v-model="category.slug" v-validate:required>
                <p class="uk-form-help-block uk-text-danger" v-show="form.slug.invalid">
                    {{ 'Slug cannot be blank.' | trans }}</p>
            </div>
        </div>
    </div>

</template>

<script>

    module.exports = {

        props: ['category', 'data', 'form'],

        section: {
            label: 'Category'
        }

    };

</script>
