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

	if (localStorage.token) {
		$("#login").hide();
		$("#cadastro").hide();
		if (localStorage.type == "ong") {
			$(".show-donator").hide();
		} else {
			$(".show-ong").hide();
		}
	} else {
		$(".show-ong").hide();
		$(".show-donator").hide();
		$(".logout").hide();
	}

	$(".logout").on("click", function () {
		localStorage.removeItem('token');
		localStorage.removeItem('type');
		location.reload();
	});
});
