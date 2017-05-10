require.config({
	baseUrl: 'assets/js',
    paths: {
		// AMD Libraries
		'jquery': 'lib/jquery',
		'text': 'lib/text',
		'underscore': 'lib/underscore',
		//shim
		'bootstrap' : 'lib/bootstrap.min',
		'lightbox' : 'lib/ekko-lightbox.min',
		// Plugins
		'gallery': 'app/gallery',
		'dialog' : 'app/dialog'
    },
	shim: {
		'bootstrap': ['jquery'],
		'lightbox': ['jquery', 'bootstrap']
	}
});

//preload
require(['jquery'], function () {
	require(['app']);
});
