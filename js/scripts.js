/**
 * 1. Menu Mobile
 * 2. Search Popup
 * 3. Increase Number Post Share
 * 4. Post Format UI
 * 5. Preloader
 */

'use strict';
(function ($) {

	$.fn.valonIsotope = function (opts) {
		var $self = $(this),
			defaults = {
				filter      : '*',
				itemSelector: '.grid-item'
			},
			options = $.extend(defaults, $self.data(), opts),
			$controls = $('.controls', $self),
			$btnLoadmore = $('.grid-load', $self),
			$grid = $('.grid-section', $self),
			$images = $('img', $self),
			count = 0,
			total = $images.length;

		$.each($images, function () {
			var image = new Image();

			image.src = $(this).attr('src');

			image.onload = function () {

				count++;

				if (count === total) {
					$('.grid-item', $grid).addClass('ready');
					$grid.isotope(options);
					$grid.data('isIsotope', true);
				}
			}
		});

		$grid.on('arrangeComplete', function () {
			var $items = $('.grid-item:not(.ready)', $grid);

			if ($items.length) {
				$items.addClass('ready');
				setTimeout(function () {
					$('.kd-hidden', $grid).addClass('kd-show');
				}, 300);
			}
		});

		$('a', $controls).on('click', function (event) {

			event.preventDefault();

			var $this = $(this),
				filter = $this.data('filter');

			if (!$this.hasClass('active')) {
				$('.active', $controls).removeClass('active');
				$this.addClass('active');

				$grid.isotope({
					filter: filter
				});
			}
		});

		$btnLoadmore.on('click', function () {
			var $this = $(this);
			if (!$grid.data('isIsotope')) {
				return;
			}
			if (!$this.hasClass('loading')) {
				$this.addClass('loading');
				$('.dot', this).toggleClass('active');
				$.ajax({
					url     : 'more-project.html',
					type    : 'POST',
					dataType: 'html',
					success : function (response) {
						if (response) {
							var $html = $(response),
								total = $('img', $html).length,
								count = 0;
							$.each($('img', $html), function () {
								var image = new Image();

								image.src = $(this).attr('src');
								image.onload = function () {
									count++;

									if (count === total) {
										$('.grid-item', $html).addClass('kd-hidden');
										$grid.append($('.grid-item', $html));
										$grid.isotope('reloadItems').isotope();

										// Remove Button
										$this.remove();
									}
								}
							});
						}
						else {
							$this.removeClass('loading');
							$('.dot', $this).toggleClass('active');
						}
					}
				})
			}
		});

		$self.valonMagnificPopup();

	};
	$.fn.valonMagnificPopup = function (opts) {
		var $self = $(this),
			options = $.extend({
				delegate   : '.popup',
				type       : 'image',
				tLoading   : '<div class="dots">\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
						</div>',
				mainClass  : 'mfp-img-mobile',
				gallery    : {
					enabled           : true,
					navigateByImgClick: true,
					preload           : [0, 3] // Will preload 0 - before current, and 1 after the current image
				},
				image      : {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
				},
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"></button>',
				callbacks  : {
					markupParse      : function (item) {
					},
					imageLoadComplete: function () {
						var $container = $('.mfp-container');

						$container.addClass('load-done');
						setTimeout(function () {
							$container.addClass('load-transition');
						}, 50);
					},
					change           : function () {
						var $container = $('.mfp-container');
						$container.removeClass('load-done load-transition');
					}

				}
			}, $self.data(), opts);

		$self.magnificPopup(options);
	};

	$(document).ready(function () {

		var $body = $('body'),
			$header = $('#header-section'),
			$search = $('.search-section', $header),
			$wrapMenu = $('.navigation-wrapper', $header),
			$btnMenu = $('.mobile-menu', $header),
			$nav = $('.menu', $header);

		$('.menu-item', $nav).on('hover', function () {
			$(this).addClass('active');
		}, function () {
		});

		/* 1. Menu Mobile */

		$btnMenu.on('click', function () {
			$header.toggleClass('active');

			if ($header.hasClass('active')) {
				$body.css('overflow', 'hidden');
			}
			else {
				$body.css('overflow', '');
			}
		});

		$('.menu-close').on('click', function () {
			$btnMenu.trigger('click');
		});

		$('.menu-item a', $wrapMenu).on('click', function (event) {

			var $target = $(event.target).closest('.menu-item'),
				ww = $(window).width();

			if (ww <= 991) {
				if ($target.hasClass('menu-item-has-children')) {
					event.preventDefault();
					$('> ul', $target).slideToggle(300);

				}
			}
		});


		/* 2. Search Popup */
		if ($search.length) {
			var $boxSearch = $('.search-box', $header);

			$search.on('click', function () {
				$boxSearch.addClass('active');
				$('.search-field', $boxSearch).focus();
			});

			$('.search-box-close', $boxSearch).on('click', function () {
				$boxSearch.removeClass('active');
			});

			$(document).on('keydown', function (event) {

				if (event.keyCode === 27) {

					$boxSearch.removeClass('active');
				}

				if ($header.hasClass('active')) {
					$btnMenu.trigger('click');
				}

			});

		}


		// Projects
		var $projects = $('.project-section'),
			$projectHeader = $('.project-header', $projects);

		if ($projects.length) {
			var $btn = $('.project-content > .title', $projects);

			$btn.on('click', function (event) {
				event.preventDefault();
				var $portfolio = $('#portfolio', $projects),
					offsetTop = $portfolio.offset().top;

				$('html, body').animate({
					scrollTop: offsetTop
				}, 400);


			})
		}

		if ($projectHeader.length) {
			valonScale($projectHeader);

			$(window).on('resize', function () {
				valonScale($projectHeader);
			});

		}
		function valonScale($el) {
			$el.css('height', '');
			var wh = $(window).height(),
				offsetTop = $el.offset().top,
				height = $el.height(),
				delta = wh - offsetTop;

			if (height > delta) {
				$el.height(delta);
			}
		}

		// Isotope
		var $portfolio = $('.portfolio');

		if ($portfolio.length) {

			$portfolio.each(function () {
				$(this).valonIsotope();
			})
		}

		// Clients
		var $imagesProject = $('.project-image'),
			$footer = $('#footer-section'),
			$detailContent = $('.content-detail'),
			height = $detailContent.outerHeight();

		if ($imagesProject.length) {
			$imagesProject.valonMagnificPopup();
		}
		if ($detailContent.length) {
			var top = 30;

			if ($body.hasClass('admin-bar')) {
				top = 62;
			}
			$detailContent.scrollToFixed({
				marginTop    : top,
				limit        : $footer.offset().top - $detailContent.outerHeight() - 210,
				removeOffsets: true
			});
		}

		/* 3. Increase Number Post Share */
		var $post = $('> article', '#blog-info');

		if ($post.length) {
			var $wrapShare = $('.kd-sharing-post-social', $post);

			$('>a ', $wrapShare).on('click', function (event) {
				var $self = $(this);
				$.ajax({
					url    : VALON_URL.admin_url,
					type   : 'POST',
					data   : {
						action : 'valon_increase_number_post_share',
						social : $self.attr('class'),
						post_id: $post.attr('id').split('-')[1]
					},
					success: function (response) {
					}
				})
			});
		}

		var $project = $('.valon-project');

		if ($project.length) {
			var $heart = $('.fa-heart', $project);

			$heart.on('click', function () {

				var $count = $heart.next('.count'),
					count = $count.text();

				if ($heart.hasClass('active')) {
					return false;
				}
				count = parseInt(count) + 1;
				$heart.addClass('active');
				setTimeout(function () {
					$count.text(count);
				}, 500);

				var post_id = $project.attr('id').split('-')[1];

				$.ajax({
					url    : VALON_URL.admin_url,
					type   : 'POST',
					data   : {
						action : 'valon_increase_heart_project',
						post_id: post_id
					},
					success: function (response) {
					}
				})
			})
		}

		// 4. Post Format UI

		/* 4. Post Format UI */
		var $tiledGallery = $('.images-tiled'),
			$slideShow = $('.images-slides');

		if ($tiledGallery.length) {


			$tiledGallery.each(function () {

				var w = $(this).width(),
					rowHeight = 160;

				if (w > 700) {
					rowHeight = 160;
				}
				else if (w > 400) {
					rowHeight = 100;
				}
				else {
					rowHeight = 80;
				}
				$(this).justifiedGallery({
					rowHeight: rowHeight,
					lastRow  : 'justify',
					margins  : 4,
					randomize: true,
					captions : false
				}).magnificPopup({
					delegate : 'a',
					type     : 'image',
					tLoading : 'Loading image #%curr%...',
					mainClass: 'mfp-img-mobile',
					gallery  : {
						enabled           : true,
						navigateByImgClick: true,
						preload           : [0, 1]
					},
					image    : {
						tError  : '<a href="%url%">The image #%curr%</a> could not be loaded.',
						titleSrc: function (item) {
							return item.el.attr('data-caption');
						}
					}
				})
			});
		}

		if ($slideShow.length) {
			$slideShow.owlCarousel({
				items  : 1,
				loop   : false,
				nav    : false,
				dot    : true,
				navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
			});
		}

		// 5. Preloader

		var $preloader = $('.preloader');
		$(window).on('load', function () {
			$preloader.fadeOut(400);
		});
		
		// 6. Owl-Carousel
		
		$(".items").owlCarousel({
			items:1,
			autoplay:true,
			loop:true,
			navText:false,
			dots:false,
		});
	});

})(jQuery);