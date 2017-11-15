
ALTER TABLE pk_blog_post ADD tag1 VARCHAR(100);
ALTER TABLE pk_blog_post ADD tag2 VARCHAR(100);
ALTER TABLE pk_blog_post ADD tag3 VARCHAR(100);
ALTER TABLE pk_blog_post ADD tag4 VARCHAR(100);
ALTER TABLE pk_blog_post ADD tag5 VARCHAR(100);
ALTER TABLE pk_blog_post ADD tag6 VARCHAR(100);
ALTER TABLE pk_blog_post ADD tag7 VARCHAR(100);
ALTER TABLE pk_blog_post ADD tag8 VARCHAR(100);
ALTER TABLE pk_blog_post ADD tag9 VARCHAR(100);
ALTER TABLE pk_blog_post ADD tag10 VARCHAR(100);

ALTER TABLE pk_blog_post ADD category_id int(10) unsigned NOT NULL;

CREATE TABLE pk_blog_category (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  title varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  slug varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY pk_BLOG_POST_CATEGORY_SLUG (slug)
) ENGINE=InnoDB;