// quickview

$(document).ready(function() {
	$('.itemCat_imgBox').hover(function() {
		$(this).find('.quickViewButton').fadeIn(75);
	}, function() {
		$(this).find('.quickViewButton').fadeOut(75);
	});
})

var spinnerOpts = {
  lines: 13, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#fff', // #rgb or #rrggbb
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};

var spinner;

function quickView(urlseg,boxId) {
	$('#qvSpinner').remove();
	$('.boxId_'+boxId).find('.itemCat_imgBox').append('<div id="qvSpinner"></div>');
	var itemId=$('.boxId_'+boxId).attr('data-item-id');
	$('.quickViewButton').css('visibility','hidden');
	var pos=getViewport();
	wWidth=pos[0];
	wHeight=pos[1];
	var boxPos=$('.boxId_'+boxId).offset();
	log("box left: "+boxPos.left);
	log("box top: "+boxPos.top);
	$('#qvSpinner').fadeIn(75);
	var target = document.getElementById('qvSpinner');
	spinner = new Spinner(spinnerOpts).spin(target);
	$.get('/quickview?urlseg='+escape(urlseg), function(data) {
		if (data!==undefined) {
			log(data);
			var pd = $.parseJSON(data);
			if (pd.status=='OK') {
				googleTrack('QuickView','Engage','Item',urlseg);
				showQuickView(pd,boxId);
			} else {
				alert(pd.error);
				spinner.stop();
				$('#qvSpinner').hide();
				$('.quickViewButton').css('visibility','visible');
			}
		}
	});
}

function closeQuickView() {
	$('#quickView').fadeOut(250);
	$('.edgeSlideBG').fadeOut(250);
	$('#qvSpinner').hide();
	$('.quickViewButton').css('visibility','visible');
	pImg = new Array();
}

function quickViewPos() {
	var pos=getViewport();
	wWidth=pos[0];
	wHeight=pos[1];
	var qvWidth=$('#quickView').width();
	var qvHeight=$('#quickView').height();
	$('#quickView').css('left',((wWidth-qvWidth)/2)+'px').css('top',((wHeight-qvHeight)/2)+'px');
	$('#quickView .qvRightHR').height(qvHeight-60);
}

var pImg = new Array();
var lazyLoadSocial=false;

function showQuickView(pd,boxId) {
	try {
		var pos=getViewport();
		var $boxId=$('.boxId_'+boxId);
		var itemId=$boxId.attr('data-item-id');
		var $qv=$('#quickView');
		$qv.hide();
		wWidth=pos[0];
		wHeight=pos[1];
	//	$('.sharePop').css('left',((wWidth-544)/2)+'px').css('top',((wHeight-268)/2)+'px').fadeIn(250);
		var docHeight=$(document).height();
		var docWidth=$(document).width();
		var thisImg=new Image();
		var urlseg=$boxId.find('.itemDesc').attr('prod-urlseg');
		var itemImg=_CDN+'item/700/'+$boxId.find('.itemDesc').attr('prod-item-id');
		var itemTitle=$boxId.find('h2').text();
		pImg = new Array();
		//$('#quickView').fadeIn(150);
		$qv.find('.shadeList').empty();
		//$qv.find('select[name=color]').empty();
		var sh='';
		var sc='';
		for(var x=0;x<pd.shades.length;x++) {
			var thisShade=pd.shades[x];
			if (x==0) {
				$('.qvImg').attr('src',_CDN+'/product/product/700/'+thisShade.id+'.jpg').bind('load',function() { quickViewPos(); });
				firstColorId=thisShade.id;
			}
			sh += "<div><img src='"+_CDN+"/product/color/"+thisShade.id+".jpg' prod-inventory='"+thisShade.inventory+"' prod-id='"+thisShade.id+"' prod-vegan='"+thisShade.vegan+"' /></div>";
			//if (pd.shades.length>1) {
				thisImg.src=_CDN+'/product/product/700/'+thisShade.id+'.jpg';
				pImg.push(thisImg);
			//}
			sc += "<option value='"+thisShade.id+"'>"+thisShade.color+"</option>";
		}
		$('.qvImg').parent().attr('href','/tarte-item-'+urlseg)
		//$('.qvImg').css('max-width',(wWidth*.75)+'px').css('max-height',(wHeight*.75)+'px');
		// fixed dim idiocy
		$('.qvImg').css('max-width','390px').css('max-height','450px');
		$qv.find('h2').css('max-width','400px').css('margin-top','20px').html($boxId.find('h2').html());
		$qv.find('.desc').css('max-width','400px');
		$qv.find('.shadeList').html(sh).css('display','block');
		if (pd.shades.length<2) $qv.find('.shadeList').css('display','none');
		$qv.find('select[name=color]').html(sc);
		$qv.find('.shadeList').find('img').bind('load',function() { quickViewPos(); });
		$qv.find('.qvPrice').html($boxId.find('.itemPrice').html());
		$qv.find('.desc').html($boxId.find('.itemDesc').html());
		var ratingStars=$boxId.find('.itemCat_ratings').html();
		var ratingCount=$boxId.find('.itemCat_ratings').attr('ratings-count');
		$qv.find('.ratingsCount').html(' ('+ratingCount+' reviews)');
		$qv.find('.ratingsCell').html(ratingStars);
		var qvWidth=$('#quickView').width();
		var qvHeight=$('#quickView').height();
		$('#quickView').css('left',((wWidth-qvWidth)/2)+'px').css('top',((wHeight-qvHeight)/2)+'px');
		//$('.edgeSlideBG').width(docWidth).height(docHeight);
		$('.edgeSlideBG').css('position','fixed').width(wWidth).height(wHeight);
		$qv.find('select').select2();
		$qv.find('.shadeList img').click(function() {
			qvSelectShade($(this).attr('prod-id'),true);
		});
		$qv.find('.shadeList img').hover(function() {
			var prodId=$(this).attr('prod-id');
			qvSelectShade(prodId,false);
			//$('.qvImg').attr('src',_CDN+'/product/product/700/'+prodId+'.jpg');
		},function() {
			var $lockElem=$('.shadeList img[locked=yes]');
			if ($lockElem.length>0) {
				var prodId=$('.shadeList img[locked=yes]').attr('prod-id');
				qvSelectShade(prodId,true);
			}
		});
		$('#quickView .addToCartButton').attr('data-item-id',itemId).attr('data-urlseg',urlseg);
 		qvSelectShade(firstColorId,true);
		var sh='';
		sh+='<table border="0" cellpadding="0" cellspacing="0" align="left" style="margin:25px 0 20px 0;"><tr><td style="padding-right:70px;">';
		sh+='<a href="http://pinterest.com/pin/create/button/?url=http%3A%2F%2Ftartecosmetics.com'+escape("/tarte-item-"+urlseg)+'&media='+escape(itemImg)+'&description='+escape(itemTitle)+'" class="pin-it-button" count-layout="horizontal"><img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" /></a>';
		sh+='</td><td style="padding-right:40px;"><div class="fb-like" data-href="http://tartecosmetics.com/tarte-item-'+urlseg+'" data-send="false" data-layout="button_count" data-width="75" data-show-faces="false"></div>';
		sh+='</td><td><a href="https://twitter.com/share" class="twitter-share-button" data-url="http://tartecosmetics.com/tarte-item-'+urlseg+'" data-text="'+escape(itemTitle)+'" data-hashtags="tarte">Tweet</a></td>';
		sh+='</tr></table>';
		$qv.find('.qvSocialLinks').html(sh);
		if (!lazyLoadSocial) {
			sh='<script type="text/javascript" src="//assets.pinterest.com/js/pinit.js"></script><div id="fb-root"></div>';
			sh+='<script>(function(d, s, id) { ';
			sh+='  var js, fjs = d.getElementsByTagName(s)[0]; ';
			sh+='  if (d.getElementById(id)) return; ';
			sh+='  js = d.createElement(s); js.id = id; ';
			sh+='  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=134794433234343"; ';
			sh+='  fjs.parentNode.insertBefore(js, fjs); }(document, "script", "facebook-jssdk"));</script>';
			sh+='<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>'
			$('.hideySpace').html(sh);
			lazyLoadSocial=true;
		} else {
			FB.XFBML.parse($qv.find('.qvSocialLinks').get(0));
			twttr.widgets.load();
		}
		setTimeout(function() {
			$('.edgeSlideBG').fadeTo(150,0.4,function() {
				setTimeout("$('#quickView').fadeIn(350);",250);
				$('#qvSpinner').hide();
				spinner.stop();
			});
		},500);
	} catch(err) {
		alert("Quickview not available\n"+err);
	}
}

function qvSelectShade(prodId,lockIt) {
	var $imgElem=$('#quickView .shadeList img[prod-id='+prodId+']');
	if (lockIt) {
		$('[locked=yes]').removeAttr('locked');
		$imgElem.attr('locked','yes');
		$imgElem.parent().attr('locked','yes');
	}
	var inv=$imgElem.attr('prod-inventory');
	var vegan=$imgElem.attr('prod-vegan');
	$('.qvImg').attr('src',_CDN+'/product/product/700/'+prodId+'.jpg');
	$('#quickView .addToCartButton').attr('product_id',prodId);
	if (inv!='yes') {
		$('#quickView .addToCartButton').attr('disabled',true).html('OUT OF STOCK');
	} else {
		$('#quickView .addToCartButton').removeAttr('disabled').html('ADD TO BAG');
	}
	if (vegan=='Yes') $('#quickView .qvVeganLabel').fadeIn(150);
	else $('#quickView .qvVeganLabel').fadeOut(150);
	$('select[name=color] option[value='+prodId+']').attr('selected','selected');
	$('select[name=color]').val(prodId);
	$('select[name=color]').select2('val',prodId);
}
function qvShadeSelect(t) {
	var prodId=$('select[name=color]').val();
	qvSelectShade(prodId,true);
}

function stripHTML(html) {
	 var tmp = document.createElement("DIV");
	 tmp.innerHTML = html;
	 return tmp.textContent||tmp.innerText;
}
