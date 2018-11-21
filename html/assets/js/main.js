$(document).ready(function() {

	var main = (function() {
		return {
			vars: {
                windowWidth: $(window).width(),
                mobile: ( $(window).width() < 992 ),
            },
			init: function() {
				this.initFeatures();
			},
			initFeatures: function() {
				var that = this;

			},
		}
	})();

	main.init();
});