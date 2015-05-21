'use strict';

;(function ( $, window, document, undefined ) {

	var pluginName = 'Zoomgallery',
			defaults = {};

	function Plugin ( element, options ) {
		this.element = element;
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	$.extend(Plugin.prototype, {
		init: function() {
			var $element = $(this.element);

			this.setStyle($element);
			this.initButtons($element);
		},
		setStyle: function($zoomgallery) {
			var that = this;

			var $rows = $zoomgallery.find('.zoomgallery-row');
			var itemHeight = 100 / $rows.size();
			var rowTopIncreasement = itemHeight;
			var rowTop = 0;

			$zoomgallery.find('.zoomgallery-row').each(function() {
				that.calcPosition($(this).find('.zoomgallery-item'), rowTop, itemHeight);
				rowTop += rowTopIncreasement;
			});

			$zoomgallery.find('.zoomgallery-item').each(function() {
				$(this).children('.zoomgallery-image').css('backgroundImage', 'url("' + $(this).children('.zoomgallery-image').data('thumbnail') + '")');

				$(this).data('style', {
					left: (parseFloat($(this).css('left')) * 100 / parseFloat($zoomgallery.css('width')) + '%'),
					right: (parseFloat($(this).css('right')) * 100 / parseFloat($zoomgallery.css('width')) + '%'),
					height: (parseFloat($(this).css('height')) * 100 / parseFloat($zoomgallery.css('height')) + '%'),
					width: (parseFloat($(this).css('width')) * 100 / parseFloat($zoomgallery.css('width')) + '%'),
					top: (parseFloat($(this).css('top')) * 100 / parseFloat($zoomgallery.css('height')) + '%'),
					transition: $(this).css('transition')
				});
			});

			$zoomgallery.find('.zoomgallery-menu').css('height', $zoomgallery.css('height'));
		},
		calcPosition: function($items, rowTop, itemHeight) {
			var itemPercentSize = 100 / $items.size();
			var reverseItemPercentSize = 100 - itemPercentSize;

			var percent = 0;

			$items.each(function() {
				$(this).css({
					left: percent + '%',
					right: reverseItemPercentSize - percent + '%',
					top: rowTop + '%',
					width: itemPercentSize + '%',
					height: itemHeight + '%'
				});

				percent += itemPercentSize;
			});
		},
		initButtons: function($zoomgallery) {
			var that = this;

			var $openButtons = $zoomgallery.find('.zoomgallery-open');
			var $items = $zoomgallery.find('.zoomgallery-row .zoomgallery-item');
			var $closeButton = $zoomgallery.find('.zoomgallery-menu .close');
			var $nextButtons = $zoomgallery.find('.zoomgallery-menu .next');
			var $previousButtons = $zoomgallery.find('.zoomgallery-menu .previous');

			$items.on('click', function(e) {
				e.preventDefault();

				$(this).children('.zoomgallery-image').css('backgroundImage', 'url("' + $(this).children('.zoomgallery-image').data('image') + '")');

				$openButtons.css('display', 'none');

				$(this).css('z-index', 10).animate({
					left: 0,
					right: 0,
					top: 0,
					width: '100%',
					height: $zoomgallery.css('height')
				}, function() {
					$zoomgallery.find('.zoomgallery-menu').css('zIndex', 100);
				}).addClass('zoomed');
			});

			$closeButton.on('click', function(e) {
				e.preventDefault();

				var $currentImage = $zoomgallery.find('.zoomed');

				var closeCallback = function() {
					$currentImage.css('zIndex', 1).removeClass('zoomed');
					$zoomgallery.find('.zoomgallery-open').css('display', 'block');
				};

				$zoomgallery.find('.zoomgallery-menu').css('zIndex', 0);

				$currentImage.animate($currentImage.data('style'), function() { closeCallback(); });
			});

			$nextButtons.on('click', function(e) {
				e.preventDefault();

				var $currentImage = $zoomgallery.find('.zoomed');
				var $nextImage = $currentImage.next('.zoomgallery-item');

				if (0 === $nextImage.length) {
					var $currentRow = $currentImage.closest('.zoomgallery-row');
					var $nextRow = $currentRow.next('.zoomgallery-row');

					if (0 === $nextRow.length) {
						$nextImage = $currentRow.prevAll('.zoomgallery-row').last().children('.zoomgallery-item').first();

						if (0 === $nextImage.length) {
							$nextImage = $currentImage.prevAll('.zoomgallery-item').last();
						}
					} else {
						$nextImage = $nextRow.children('.zoomgallery-item').first();
					}
				}

				$currentImage.removeClass('zoomed');

				that.slideImages($currentImage, $nextImage, '100%');
			});

			$previousButtons.on('click', function(e) {
				e.preventDefault();

				var $currentImage = $zoomgallery.find('.zoomed');
				var $previousImage = $currentImage.prev('.zoomgallery-item');

				if (0 === $previousImage.length) {
					var $currentRow = $currentImage.closest('.zoomgallery-row');
					var $previousRow = $currentRow.prev('.zoomgallery-row');

					if (0 === $previousRow.length) {
						$previousImage = $currentRow.nextAll('.zoomgallery-row').last().children('.zoomgallery-item').last();

						if (0 === $previousImage.length) {
							$previousImage = $currentImage.nextAll('.zoomgallery-item').last();
						}
					} else {
						$previousImage = $previousRow.children('.zoomgallery-item').last();
					}
				}

				$currentImage.removeClass('zoomed');

				that.slideImages($currentImage, $previousImage, '-100%');
			});
		},
		slideImages: function($currentImage, $nextImage, side) {
			$nextImage.children('.zoomgallery-image').css('backgroundImage', 'url("' + $nextImage.children('.zoomgallery-image').data('image') + '")');

			var slideCallback = function() {
				$currentImage
					.css($currentImage.data('style'))
					.css('zIndex', 1);

				$nextImage.css('zIndex', 10);
			};

			$nextImage
				.css({
					left: side,
					width: '100%',
					top: 0,
					height: $nextImage.closest('.zoomgallery').css('height'),
					zIndex: 11
				})
				.addClass('zoomed')
				.animate({left: 0}, function() { slideCallback(); });
		}
	});

	$.fn[ pluginName ] = function ( options ) {
		this.each(function() {
			if ( !$.data( this, 'plugin_' + pluginName ) ) {
				$.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
			}
		});
		return this;
	};

})( jQuery, window, document );
