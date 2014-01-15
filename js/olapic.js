var olapicGallery = function (url, limit, offset) {
    this.url = url;
    this.limit = limit || 18;
    this.offset = offset || 0;
    this.apiURL = this.url + "&limit=" + this.limit + "&offset=" + this.offset;
    this.container = $('#photoContainer');
    this.loaderElement = $('#olapicGallery .loader');
    this._loader("show");
    this._call(this.apiURL);
}

olapicGallery.prototype._loader = function(status) {
	if (status == "show") {
		this.loaderElement.show();
		this.container.hide();
	}else{
		setTimeout($.proxy(function() {
        	this.loaderElement.hide();
        	this.container.show();
			this._isotope();
    	}, this), 3000);
	};
}

olapicGallery.prototype._call = function (apiURL) {
	$.support.cors = true;
	$.getJSON(this.apiURL, $.proxy(function(data){
		$.proxy( this._parser(data), this );	
	},this));
}

olapicGallery.prototype._parser = function (data) {
    var i = 0;
    var self = this;
    $.each(data.response, function (key, value) {
        $.each(value, function (key, value) {
            if (key == "images") {
                i++;
                var sort = new olapicSorter(data.response[i - 1].productUrl[0].stream_name);
                var pants = sort.pants,
                    chambray = sort.chambray,
                    leggings = sort.leggings,
                    olapic = sort.olapic,
                    shirt = sort.shirt,
                    caption = data.response[i - 1].caption,
                    productPhoto_1 = data.response[i - 1].productUrl[0].stream_images.thumbnail,
                    productShop_1 = data.response[i - 1].productUrl[0].shop_button_url,
                    productName_1 = data.response[i - 1].productUrl[0].stream_name,
                    productPhoto_2 = "",
                    productShop_2 = "",
                    productName_2 = "";
                if (data.response[i - 1].productUrl[1]) {
                    productShop_2 = "<a href='http:" + data.response[i - 1].productUrl[1].shop_button_url + "' target='_blank'>";
                    productPhoto_2 = "<li><img src='" + data.response[i - 1].productUrl[1].stream_images.thumbnail + "'/></a>";
                    productName_2 = "<span>" + data.response[i - 1].productUrl[1].stream_name + "</span></li>";
                }

                var content = "<div id='pic-" + i + "' class='photo' pants='" + pants + "' chambray='" + chambray + "' leggings='" + leggings + "' olapic='" + olapic + "' shirt='" + shirt + "' stream-name='" + productName_1 + "'>" +
                    "<a href='#photoDetail-" + i + "' class='fancybox' rel='gallery1'><img src='" + value.bigThumbnail + "'/></a><div id='photoDetail-" + i + "' class='modalElement'><div class='leftElement'>" +
                    "<div class='author'><img class='userPhoto' src='" + data.response[i - 1].uploader.avatar + "'/><div class='caption'><p>@ " + data.response[i - 1].uploader.username + "</p><p>" + caption + "</p></div>" +
                    "</div><img src='" + value.normal + "'/></div>" +
                    "<div class='rightElement'><div class='socialmedia'><a class='icon facebook' href='http://www.facebook.com' target='_blank'></a><a class='icon twitter' href='http://www.twitter.com' target='_blank'></a>" +
                    "<a class='icon pinterest' href='http://www.pinterest.com' target='_blank'></a><a class='icon gplus' href='http://plus.google.com' target='_blank'></a></div>" +
                    "<div class='productRelated'><p>SHOP THIS LOOK</p><ul><li><a href='http:" + productShop_1 + "' target='_blank'><img src='" + productPhoto_1 + "'/></a><span>" + productName_1 + "</span></li>" + productShop_2 + productPhoto_2 + productName_2 + "</ul></div></div></div><div/>";
                self.container.append(content);
            };
        });
    });
	this._loader("hide");
}

olapicGallery.prototype._isotope = function(){
	$('#photoContainer').isotope({
		itemSelector : '.photo',
		masonry : {
			columnWidth : 158
		},
		getSortData : {
			category : function ( $elem ) {
				return $elem.attr('stream-name');
			},
			pants: function($elem) {
				return parseInt($elem.attr('pants'), 10);
			},
			chambray: function($elem) {
				return parseInt($elem.attr('chambray'), 10);
			},
			leggings: function($elem) {
				return parseInt($elem.attr('leggings'), 10);
			},
			olapic: function($elem) {
				return parseInt($elem.attr('olapic'), 10);
			},
			shirt: function($elem) {
				return parseInt($elem.attr('shirt'), 10);
			}
		},
		sortBy : 'category'
	});
	this._sorterEvent();	
}

olapicGallery.prototype._sorterEvent = function(){
	$sortItem = $('#sort-by a'); 
	$sortItem.click($.proxy(function(){
		var sortName = $(event.target).attr('href').slice(1);
		this.container.isotope({ sortBy : sortName });

		var $sortParent = $(this).parents('#sort-by');
		$sortParent.find('.selected').removeClass('selected');
		$(this).addClass('selected');
		return false;
	},this));
	this._fancybox();		
}

olapicGallery.prototype._fancybox = function(){
	$(".fancybox").fancybox({
		openEffect  : 'none',
		closeEffect : 'none',
		padding : 0
	});
}

var olapicSorter = function (stream_name) {
    this.pants = "Pants",
    this.chambray = "ChambrayShirt",
    this.leggings = "Leggings",
    this.olapic = "Olapic Home Page Carousel",
    this.shirt = "Shirt";

    isPants = ((this.pants == stream_name) ? 1 : 2);
    isChambray = ((this.chambray == stream_name) ? 1 : 2);
    isLeggings = ((this.leggings == stream_name) ? 1 : 2);
    isOlapic = ((this.olapic == stream_name) ? 1 : 2);
    isShirt = ((this.shirt == stream_name) ? 1 : 2);

    return {
        pants: isPants,
        chambray: isChambray,
        leggings: isLeggings,
        olapic: isOlapic,
        shirt: isShirt
    };
}

$(document).ready(function () {
    new olapicGallery('https://www.photorank.me/api/v1/photos/?api_key=0a40a13fd9d531110b4d6515ef0d6c529acdb59e81194132356a1b8903790c18', 18, 0);
});