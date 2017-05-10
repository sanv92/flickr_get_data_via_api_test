define('gallery', ['text!../../photos.html'], function(html) {
	return gallery = function () {
		$.fn.setup = function (options) {
			'use strict';
			/**
			 *
			 * default options
			 *
			**/
			var defaults = {
				column: [4,6,12]
			};

			//objects
			var settings = $.extend(defaults, options);
			var column = settings.column;

			//global
			var hash = document.location.hash,
				tags,
				lang,
				defaultLang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);

			var formatDateYYMMDD = function (unixMilliseconds) {
				return unixMilliseconds.slice(0, 10);
			}, formatDate_hhmm = function (unixMilliseconds) {
				return unixMilliseconds.slice(11, 16);
			}, mediaBigImage = function (image) {
				var imageType = '.' + image.split('.').pop();
				return image.replace(/\.[^.]+$/, '').slice(0, -2) + imageType;
			};

			//getGallery
			var getGallery = {
				data: function(url) {
					return $.ajax({
						type: 'GET',
						url: url,
						dataType: 'json',
						beforeSend: function() {
							waitingDialog.show();
						},
						success: function(data) {
							return data;
						}
					}).done(function() {
						waitingDialog.hide();
					});
				},
				go: function (url) {
						var hash = url
							.replace(/^.*?\#\//, '')
							.split('/');

						tags = hash[0],
						lang = hash[1] ? hash[1] : defaultLang;

					if (tags && lang) {
						var url = getUrl(tags, lang, 'https://api.flickr.com/services/feeds/photos_public.gne?tags={tags}&lang={lang}&format=json&jsoncallback=?');

						getGallery.data(url)
							.then(function(data){
								getGallery.publish(data);
						});
					}
				},
				event: function () {
					$(window).on('hashchange', function(e){
						hash = window.location.hash;
						getGallery.go(hash);
					});
					$('#form-search').submit(function(e) {
						var url = getUrl($('#search').val(), lang, '#/{tags}/{lang}');

						getGallery.go(url);
						window.location.hash = url;
						e.preventDefault();
					});
				},
				publish: function (data) {
					var galleryList = [];
					_.each(data.items, function (item) {
						var ymd_taken = formatDateYYMMDD(item.date_taken),
							hhmm_taken = formatDate_hhmm(item.date_taken),
							ymd_published = formatDateYYMMDD(item.published),
							hhmm_published = formatDate_hhmm(item.published),
							media_big = mediaBigImage(item.media.m);

						galleryList.push({
							title: item.title,
							link: item.link,
							media_small: item.media.m,
							media_big: media_big,
							ymd_date_taken: ymd_taken,
							hhmm_date_taken: hhmm_taken,
							description: item.description,
							ymd_published: ymd_published,
							hhmm_published: hhmm_published,
							author: item.author,
							author_id: item.author_id,
							tags: item.tags
						});
					});

					//view
					initView(galleryList);
				}
			};

			//init
			return init();
			function init () {
				getGallery.go(hash);
				getGallery.event();
			}

			//url
			function getUrl (tags, lang, url) {
				return url
					.replace('{tags}', tags)
					.replace('{lang}', lang);
			}

			//view
			function initView (galleryList) {
				var tmplText = html
					.replace('{col_lg}', column[0])
					.replace('{col_md}', column[1])
					.replace('{col_xs}', column[2]);
				
				var tmpl = _.template(tmplText);

				var renderedTemplate = tmpl({
					items: galleryList
				});
				
				var input = ($('#search').val().length > 0) ? $('#search').val() : tags;
				$('h1').text(input);
				$('#gallery-list').html(renderedTemplate);
			}

		}
	}();
});