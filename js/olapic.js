$(document).ready(function(){

	$container = $('#photoContainer');
	$loader = $('#olapicGallery .loader');

	//Function isotope - initializes the isotope plugin and declare the sorter options for the gallery.
  	function isotope(){
  		$container.isotope({
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
  	}	 

	//Function sorter - returns the values used to make the sorting of the gallery based on the steam_name.
	function sorter(text){
		var pants = "Pants", 
			chambray = "ChambrayShirt",
			leggings= "Leggings",
			olapic = "Olapic Home Page Carousel",
			shirt = "Shirt";
		
			isPants = ((pants == text) ? 1 : 2);
			isChambray = ((chambray == text) ? 1 : 2);
			isLeggings = ((leggings == text) ? 1 : 2);
			isOlapic = ((olapic == text) ? 1 : 2);
			isShirt = ((shirt == text) ? 1 : 2);

			return {
		        pants: isPants,
		        chambray: isChambray,
		        leggings: isLeggings,
		        olapic: isOlapic,
		        shirt: isShirt
		    }; 
	}

	//Function sorterEvent - handles click event for sorting the elements of the gallery.
	function sorterEvent(){
		$sortItem = $('#sort-by a'); 
		$sortItem.click(function(){
			var sortName = $(this).attr('href').slice(1);
			$container.isotope({ sortBy : sortName });

			var $sortParent = $(this).parents('#sort-by');
			$sortParent.find('.selected').removeClass('selected');
			$(this).addClass('selected');
			return false;
		});		
	}


	//Function olapicGallery - make the call to the API and create the gallery on the DOM.
	function olapicGallery(url,limit,offset){
		var url = url,
		limit = limit || 18,
		offset = offset || 0;
		$.ajax({
			type: "GET",
			url: url+"&limit="+limit+"&offset="+offset,
			dataType: "json",
			beforeSend: function() { 
				$loader.show();
				$container.hide();
			},
			success: function(data) {
	            var i = 0;
	            $.each(data.response, function(key, value){ 
				    $.each(value, function(key, value){
				        if (key == "images") {
				    		i++;
					        var sort = new sorter(data.response[i-1].productUrl[0].stream_name);
					        var pants = sort.pants,
					         	chambray = sort.chambray,
					        	leggings = sort.leggings,
					        	olapic = sort.olapic,
					        	shirt = sort.shirt,
					        	caption = data.response[i-1].caption,
					        	productPhoto_1 = data.response[i-1].productUrl[0].stream_images.thumbnail,
					        	productShop_1 = data.response[i-1].productUrl[0].shop_button_url,
					        	productName_1 = data.response[i-1].productUrl[0].stream_name,
					        	productPhoto_2 = "",
					        	productShop_2 = "",
					        	productName_2 = "";
					        	if (data.response[i-1].productUrl[1]){
					        		productShop_2 = "<a href='http:"+data.response[i-1].productUrl[1].shop_button_url+"' target='_blank'>";
					        		productPhoto_2 = "<li><img src='"+data.response[i-1].productUrl[1].stream_images.thumbnail+"'/></a>";
					        		productName_2 = "<span>"+data.response[i-1].productUrl[1].stream_name+"</span></li>";
					        	}

					        var content = "<div id='pic-"+i+"' class='photo' pants='"+pants+"' chambray='"+chambray+"' leggings='"+leggings+"' olapic='"+olapic+"' shirt='"+shirt+"' stream-name='"+productName_1+"'>"+
					        			  "<a href='#photoDetail-"+i+"' class='fancybox' rel='gallery1'><img src='"+ value.bigThumbnail +"'/></a><div id='photoDetail-"+i+"' class='modalElement'><div class='leftElement'>"+
					        			  "<div class='author'><img class='userPhoto' src='"+data.response[i-1].uploader.avatar+"'/><div class='caption'><p>@ "+data.response[i-1].uploader.username+"</p><p>"+caption+"</p></div>"+
					        			  "</div><img src='"+value.normal+"'/></div>"+
					        			  "<div class='rightElement'><div class='socialmedia'><a class='icon facebook' href='http://www.facebook.com' target='_blank'></a><a class='icon twitter' href='http://www.twitter.com' target='_blank'></a>"+
					        			  "<a class='icon pinterest' href='http://www.pinterest.com' target='_blank'></a><a class='icon gplus' href='http://plus.google.com' target='_blank'></a></div>"+
					        			  "<div class='productRelated'><p>SHOP THIS LOOK</p><ul><li><a href='http:"+productShop_1+"' target='_blank'><img src='"+productPhoto_1+"'/></a><span>"+productName_1+"</span></li>"+productShop_2+productPhoto_2+productName_2+"</ul></div></div></div><div/>";
					        $container.append(content);
				        };
				    });
				});
				$(window).load(function(){
					$loader.hide();
					$container.show();
					isotope();
					sorterEvent();
					$(".fancybox").fancybox({
						openEffect  : 'none',
						closeEffect : 'none',
						padding : 0
					});
				});
	        },
			error: function(jqXHR, textStatus, errorThrown) {
		        console.log(jqXHR, textStatus, errorThrown);
		        request.abort();
		    }
		});
	}

	olapicGallery('https://www.photorank.me/api/v1/photos/?api_key=0a40a13fd9d531110b4d6515ef0d6c529acdb59e81194132356a1b8903790c18',18,0);
    
});