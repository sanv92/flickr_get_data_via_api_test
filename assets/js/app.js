define('app', function() {
	require(
	[
		'jquery',
		'underscore',
		'dialog',
		'gallery',
		'lightbox'
	], function($) {
		$(function(){
			require(['setup'], function(setup) {});

			//lightbox
			$(document).delegate('*[data-toggle="lightbox"]', 'click', function(e) {
				e.preventDefault();
				$(this).ekkoLightbox();
			}); 
		});
	});
});