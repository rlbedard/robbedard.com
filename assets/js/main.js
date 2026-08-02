/*
	Big Picture by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$all = $body.add($header);

	// Breakpoints.
		breakpoints({
			xxlarge: [ '1681px',  '1920px' ],
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '1001px',  '1280px' ],
			medium:  [ '737px',   '1000px' ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch mode.
		if (browser.mobile)
			$body.addClass('is-touch');
		else {

			breakpoints.on('<=small', function() {
				$body.addClass('is-touch');
			});

			breakpoints.on('>small', function() {
				$body.removeClass('is-touch');
			});

		}

	// Fix: IE flexbox fix.
		if (browser.name == 'ie') {

			var $main = $('.main.fullscreen'),
				IEResizeTimeout;

			$window
				.on('resize.ie-flexbox-fix', function() {

					clearTimeout(IEResizeTimeout);

					IEResizeTimeout = setTimeout(function() {

						var wh = $window.height();

						$main.each(function() {

							var $this = $(this);

							$this.css('height', '');

							if ($this.height() <= wh)
								$this.css('height', (wh - 50) + 'px');

						});

					});

				})
				.triggerHandler('resize.ie-flexbox-fix');

		}

	// Gallery.
		$window.on('load', function() {

			var $gallery = $('.gallery');

			$gallery.poptrox({
				baseZIndex: 10001,
				useBodyOverflow: false,
				usePopupEasyClose: false,
				overlayColor: '#1f2328',
				overlayOpacity: 0.65,
				usePopupDefaultStyling: false,
				usePopupCaption: true,
				popupLoaderText: '',
				windowMargin: 50,
				usePopupNav: true
			});

			// Hack: Adjust margins when 'small' activates.
				breakpoints.on('>small', function() {
					$gallery.each(function() {
						$(this)[0]._poptrox.windowMargin = 50;
					});
				});

				breakpoints.on('<=small', function() {
					$gallery.each(function() {
						$(this)[0]._poptrox.windowMargin = 5;
					});
				});

		});

	// Section transitions.
		if (browser.canUse('transition')) {

			var on = function() {

				// Galleries.
					$('.gallery')
						.scrollex({
							top:		'30vh',
							bottom:		'30vh',
							delay:		50,
							initialize:	function() { $(this).addClass('inactive'); },
							terminate:	function() { $(this).removeClass('inactive'); },
							enter:		function() { $(this).removeClass('inactive'); },
							leave:		function() { $(this).addClass('inactive'); }
						});

				// Generic sections.
					$('.main.style1')
						.scrollex({
							mode:		'middle',
							delay:		100,
							initialize:	function() { $(this).addClass('inactive'); },
							terminate:	function() { $(this).removeClass('inactive'); },
							enter:		function() { $(this).removeClass('inactive'); },
							leave:		function() { $(this).addClass('inactive'); }
						});

					$('.main.style2')
						.scrollex({
							mode:		'middle',
							delay:		100,
							initialize:	function() { $(this).addClass('inactive'); },
							terminate:	function() { $(this).removeClass('inactive'); },
							enter:		function() { $(this).removeClass('inactive'); },
							leave:		function() { $(this).addClass('inactive'); }
						});

				// Contact.
					$('#contact')
						.scrollex({
							top:		'50%',
							delay:		50,
							initialize:	function() { $(this).addClass('inactive'); },
							terminate:	function() { $(this).removeClass('inactive'); },
							enter:		function() { $(this).removeClass('inactive'); },
							leave:		function() { $(this).addClass('inactive'); }
						});

			};

			var off = function() {

				// Galleries.
					$('.gallery')
						.unscrollex();

				// Generic sections.
					$('.main.style1')
						.unscrollex();

					$('.main.style2')
						.unscrollex();

				// Contact.
					$('#contact')
						.unscrollex();

			};

			breakpoints.on('<=small', off);
			breakpoints.on('>small', on);

		}

	// Burger menu.
		(function() {

			var $navToggle = $('#nav-toggle'),
				$navDropdown = $('#nav-dropdown'),
				$nav = $header.find('nav'),
				navFullWidth = 0;

			function syncBodyPadding() {
				var h = $header[0].offsetHeight;
				var hPx = h + 'px';
				$body.css('padding-top', hPx);
				$body.css('scroll-padding-top', hPx);
				document.documentElement.style.setProperty('--header-height', hPx);
				$('.main').css('scroll-margin-top', hPx);
			}

			// Sync immediately so the hero section sits flush below the header on first paint
			syncBodyPadding();

			// Measure nav's natural width; uses a hidden clone if nav is already collapsed.
			function measureNavWidth() {
				var ul = $nav.find('ul')[0];
				if ($nav.css('display') !== 'none') {
					return ul ? ul.offsetWidth : 0;
				}
				var $clone = $nav.clone().css({
					position: 'fixed',
					visibility: 'hidden',
					display: 'block',
					top: '-9999px',
					left: '-9999px',
					'white-space': 'nowrap'
				}).appendTo('body');
				var w = $clone.find('ul')[0].offsetWidth;
				$clone.remove();
				return w;
			}

			function checkNavCollapse() {
				var needed = navFullWidth + 32; // 32px breathing room
				if (needed > $header[0].offsetWidth) {
					$header.addClass('nav-collapsed');
					$navToggle.attr('aria-expanded', $navDropdown.hasClass('open') ? 'true' : 'false');
					$navDropdown.attr('aria-hidden', $navDropdown.hasClass('open') ? 'false' : 'true');
				} else {
					$header.removeClass('nav-collapsed');
					$navDropdown.removeClass('open').attr('aria-hidden', 'true');
					$navToggle.attr('aria-expanded', 'false');
				}
			}

			$window.on('load', function() {
				navFullWidth = measureNavWidth();
				checkNavCollapse();
				syncBodyPadding();
			});

			$window.on('resize.burger', function() {
				checkNavCollapse();
				syncBodyPadding();
			});

			$navToggle.on('click', function(e) {
				e.stopPropagation();
				var opening = !$navDropdown.hasClass('open');
				$navDropdown.toggleClass('open').attr('aria-hidden', opening ? 'false' : 'true');
				$navToggle.attr('aria-expanded', opening ? 'true' : 'false');
			});

			$(document).on('click.burger', function(e) {
				if (!$(e.target).closest('#nav-dropdown, #nav-toggle').length) {
					$navDropdown.removeClass('open').attr('aria-hidden', 'true');
					$navToggle.attr('aria-expanded', 'false');
				}
			});

			$navDropdown.find('a').on('click', function() {
				$navDropdown.removeClass('open').attr('aria-hidden', 'true');
				$navToggle.attr('aria-expanded', 'false');
			});

		})();

	// Events.
		var resizeTimeout, resizeScrollTimeout;

		$window
			.on('resize', function() {

				// Disable animations/transitions.
					$body.addClass('is-resizing');

				clearTimeout(resizeTimeout);

				resizeTimeout = setTimeout(function() {

					// Update scrolly links.
						$('a[href^="#"]').scrolly({
							speed: 1500,
							offset: $header.outerHeight()
						});

					// Re-enable animations/transitions.
						setTimeout(function() {
							$body.removeClass('is-resizing');
							$window.trigger('scroll');
						}, 0);

				}, 100);

			})
			.on('load', function() {
				$window.trigger('resize');
			});

})(jQuery);