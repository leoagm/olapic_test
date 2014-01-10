// XP log function
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
	if (window.location.host=='tarte.loc' || window.location.host=='tarte.d27n.com' || window.location.host=='edge.loc' || getCookie('log')==1) {
		if (this.console) {
			console.log( Array.prototype.slice.call(arguments) );
		}
	}
};

var menuZIndex=9000;

var itemCnt=0;

var isiOS = ((navigator.userAgent.match(/iPad/i) != null) || (navigator.userAgent.match(/iPhone/i) != null));
var isiPhone = (navigator.userAgent.match(/iPhone/i) != null);
var isiPad = (navigator.userAgent.match(/iPad/i) != null);


// NAV SIGN IN: start
var moSignin=false;
var moSigninForm=false;

$(document).ready(function() {
    if (isiPad) {
//      setViewport();
//      window.onorientationchange = function() { setViewport(); };
    }
    if (jQuery) {
        var ua = $.browser;
        var engageDrops=true;
        if (ua.mozilla && parseInt(ua.version)<10) engageDrops=false;
        /* if (engageDrops) {
          if ($('.header_logged_out').is(':visible')) {
              $('.header_user_logout a').hover(function() {
                  moSignin=true;
                  showSignin();
              },function() {
                  moSignin=false;
                  setTimeout("closeSignin()",1000);
              });
              $('#signinBox').hover(
                  function() {
                      moSigninForm=true;
                  },
                  function() {
                      moSigninForm=false;
                      setTimeout("closeSignin()",1000);
                  }
              );
          }
        } */
    }
});

function getViewport() {

 var viewPortWidth;
 var viewPortHeight;

 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
 if (typeof window.innerWidth != 'undefined') {
   viewPortWidth = window.innerWidth,
   viewPortHeight = window.innerHeight
 }

// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
 else if (typeof document.documentElement != 'undefined'
 && typeof document.documentElement.clientWidth !=
 'undefined' && document.documentElement.clientWidth != 0) {
    viewPortWidth = document.documentElement.clientWidth,
    viewPortHeight = document.documentElement.clientHeight
 }

 // older versions of IE
 else {
   viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
   viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
 }
 return [viewPortWidth, viewPortHeight];
}

function setViewport() {
  if (off_isiPad) {
    var contentWidth=$(document).width();
    var winW = screen.width;
    var winH = screen.height;
    var useWinW = winW;
    if (window.orientation==90 || window.orientation==-90) useWinW=winH;

//    alert("contentWidth = " + contentWidth + "\nwidnow width: " + winW + "\nwindow inner width: " + window.innerHeight + "\nscreen width = " + screen.width + "\nwindow orientation: " + window.orientation + "\nbody width = " + $('body').width());
    var scale = (useWinW/(contentWidth));
    $('body').css('-webkit-transform','scale('+scale+')');
//    alert("set scale = " + scale);
    //log("set scale = " + scale);
    //  var viewport = document.querySelector("meta[name=viewport]");
  //  viewport.setAttribute('content', 'width=device-width; initial-scale=1.0; maximum-scale=1.0;');
  }  
}

function showSignin() {
    var p=$('.header_logged_out').offset();
    $('.header_logged_out').addClass('signinTextOn');
    var newLeft=p.left;
    log("new left: " + newLeft);
    $('#signinBox').css('z-index',(++menuZIndex));
    $('#signinBox').css('left',(newLeft-2)+'px');
    $('#signinBox').css('top',(p.top+16)+'px');
    $('#signinBox').slideDown(250);
}
function closeSignin() {
    var focused=$('#signinBox').find('input[name=liem]').attr('focused');
    var focusedpw=$('#signinBox').find('input[name=lipw]').attr('focused');
    if (!moSignin && !moSigninForm && focused=='no') {
        $('#signinBox').slideUp(250,function () {
            $('.header_logged_out').removeClass('signinTextOn');
        });
    }   
}

    
function submitSignin(t) {
    var liem=t.liem.value;
    var lipw=t.lipw.value;
    if (liem=='' || lipw=='') {
        modalDialog('Error','Please enter your username and password.');
    } else {
        var json=({liem:liem,lipw:lipw});
        $.ajax({
            type: "POST",
            url: _TARTE_LOGIN_URL,
            crossDomain: true,
            dataType: 'json',
            data: json,
            success: function(msg) {
                log("msg", msg);
                var resp = msg;
                if (typeof resp.status != 'undefined') {
                	if (resp.status=='OK') {
                    $('.header_logged_out').fadeOut(100,function() {
                        var ht=$('.header_logged_in').html();
                        ht="<a href='/my-account.php'>" + resp.name + "'s account</a>" + ht.substr(ht.indexOf('&nbsp'));
                        $('.header_logged_in').html(ht).fadeIn(250);
                    });
                    moSignin=false; moSigninForm=false; closeSignin();
                	} else {
                		if (window.location.hostname=='tartecosmetics.com') {
      				       window.location.href="https://<?=$_SERVER['SERVER_NAME']?>/log-in.php?error=1&liem="+escape(liem);
        						} else {
        							window.location.href="/log-in.php?error=1&liem="+escape(liem);
      	        		}
                	}
              }
          }
      });
    }
    
}

// NAV SIGN IN: end


// NAVIGATION: start
var directHover='';
var hoverMenuItem='';
var hoverMenuMenu='';
var menuName='';
var menuItemNameOn='';
var menuNameOn='';
var lastMenuNameOn='';
var clickMenuOn=false;
var menuId;

function allMenuHoversOff() {
    jQuery('body').focus();
    jQuery('#d27nMenu ul li').each(function() {
        jQuery(this).removeClass('hovering');
    });
    jQuery('.menuOn').each(function() {
        jQuery(this).slideUp(100);
    });
}

function clearHoverMenuItem() { hoverMenuItem=''; }

function clickMenu(t) {
    if (jQuery(t).find('a').rel('href')) {
        document.location.href=jQuery(t).find('a').rel('href');
    } else {
        showMenu(t);
    }
}

var __menuTransitionSpeed=350;

function closeMenu(clearAll,menuName) {
    if (clearAll) {
        jQuery('#d27nMenu ul li').each(function() {
            jQuery(this).removeClass('hovering');
        });
        jQuery('.menuOn').each(function() {
            jQuery(this).slideUp(__menuTransitionSpeed);
        });
    } else {
        //log('#d27nMenu ul li[rel='+menuName+']: '+jQuery('#d27nMenu ul li[rel='+menuName+']').is('.hovering'));
        //log('#menu'+menuName+': '+jQuery('#menu'+menuName).is(':visible'));
        //log('hoverMenuItem: ' + hoverMenuItem);
        //log('hoverMenuMenu: ' + hoverMenuMenu);
        if (
            (!jQuery('#d27nMenu ul li[rel='+menuName+']').is('.hovering') && !jQuery('#menu'+menuName).is(':visible'))
            || (hoverMenuItem=='' && hoverMenuMenu=='')
            ) {
            jQuery('#d27nMenu ul li[rel='+menuName+']').removeClass('hovering');
            jQuery('#menu'+menuName).slideUp(__menuTransitionSpeed);
        }
    }
}

function showMenu(t) {
//    if (jQuery(t).attr('rel')!=menuItemNameOn) closeMenu(true);
    var menu='menu'+jQuery(t).attr('rel');
    var p=jQuery(t).position();
    var top=p.top+jQuery(t).height()+7;
		var leftMostItem=jQuery('#d27nMenu > ul > li').position();
		var $lastMenuItem=jQuery('#d27nMenu ul li:last-child');
		var menuX=$lastMenuItem.position();
		var menuWidth=(menuX.left+$lastMenuItem.width())-leftMostItem.left;
		jQuery('.menuOn').css('padding-left',(leftMostItem.left+18)+'px');
		jQuery('.menuOn .banner').css('width',menuWidth+'px');
    if (jQuery(t).is('.hovering')) {
			//log("already hovering");
			// already over it
    } else {
			if (jQuery('.hovering').length>0)
				__menuTransitionSpeed=0;
			closeMenu(true);
			jQuery(t).addClass('hovering');
			jQuery('#'+menu).mouseenter(function() {
					hoverMenuMenu=jQuery(t).attr('rel');
			});
			jQuery('#'+menu).mouseleave(function() {
					hoverMenuMenu='';
					setTimeout("closeMenu(false,'"+jQuery(t).attr('rel')+"')",500);
			});
			jQuery('#'+menu).slideDown(__menuTransitionSpeed);
			__menuTransitionSpeed=350;
    }
}

jQuery(document).ready(function() {
//    var h=jQuery('#d27nMenu ul li:first').height();
//    jQuery('#d27nMenu ul').css('height',h+'px');
    var totalMenuWidth=0;
    jQuery('#d27nMenu ul li').each(function() {
        jQuery(this).click(function() {
            if (clickMenuOn) {
            		if (__isiPad) {
                    clickMenuOn=false;
                    setTimeout("closeMenu(true,'"+jQuery(this).attr('rel')+"');",0);
                    setTimeout("allMenuHoversOff();",50);
                } else {
                    clickMenuOn=false;
                    setTimeout("closeMenu(false,'"+jQuery(this).attr('rel')+"')",50);
                }
            } else {
                clickMenuOn=true;
                hoverMenuItem=jQuery(this).attr('rel');
                menuId=jQuery(this);
                setTimeout("closeMenu(false,'"+jQuery(this).attr('rel')+"')",10000);
            }
//            clickMenu(this);
        });
        jQuery(this).mouseenter(function() {
            hoverMenuItem=jQuery(this).attr('rel');
            menuId=jQuery(this);
			setTimeout("if (hoverMenuItem!='') showMenu(menuId);",250);
        });
        jQuery(this).mouseleave(function() {
            hoverMenuItem='';
            setTimeout("closeMenu(false,'"+jQuery(this).attr('rel')+"')",500);
        });
        
    });
});
// NAVIGATION: end



// EMAIL SIGNUP: start
var moNewsltr=false;
var moNewsltrForm=false;

$(document).ready(function() {
    if (jQuery) {
        var ua = $.browser;
        var engageDrops=true;
        if (ua.mozilla && parseInt(ua.version)<10) engageDrops=false;
        if (engageDrops) {
          if ($('.newsltrText').is(':visible')) {
              $('.newsltrText a').hover(function() {
                  moNewsltr=true;
                  showNewsltr();
              },function() {
                  moNewsltr=false;
                  setTimeout("closeNewsltr()",1000);
              });
              $('#newsltrBox').hover(
                  function() {
                      moNewsltrForm=true;
                  },
                  function() {
                      moNewsltrForm=false;
                      setTimeout("closeNewsltr()",1000);
                  }
              );
          }
        }
    }
});

function submitNewsltrSignup(t) {
    try {
        var type=t.type.value;
        var email=t.email.value;
        if (email=='' || email=='email address') {
            log("no email address submitted");
            // do nothing
        } else {
            var json=({email:email,type:type});
            $.ajax({
                type: "POST",
                url: "/tarte-news-sign-up.php",
                data: json,
                success: function(msg) {
                    log(msg);
                    var resp = $.parseJSON(msg);
                    if (typeof resp.errors != 'undefined') {
                        alert(resp.errors);
                    } else {
                        if ($('#newsltrBox').is(':visible')) closeNewsltr();
                        if ($('.emailPopup').is(':visible')) closeLetsBeFriends();
                        window.setTimeout(function () { t.email.value=''; }, 2500);
                        alert("Thank you! You're signed up for tarte's e-newsletter.");
                    }
                }
            });
        }
    } catch(err) {
        log(err);
        return false;
    }
}

function showNewsltr() {
    var p=$('.newsltrText').offset();
    $('.newsltrText').addClass('newsltrTextOn');
    var newLeft=p.left;
    //log("new left: " + newLeft);
    $('#newsltrBox').css('z-index',(++menuZIndex));
    $('#newsltrBox').css('left',(newLeft-2)+'px');
    $('#newsltrBox').css('top',(p.top+16)+'px');
    $('#newsltrBox').slideDown(250);
}
function closeNewsltr() {
    var focused=$('#newsltrBox').find('input[name=email]').attr('focused');
    if (!moNewsltr && !moNewsltrForm && focused=='no') {
        $('#newsltrBox').slideUp(250,function () {
            $('.newsltrText').removeClass('newsltrTextOn');
        });
    }   
}
// EMAIL SIGNUP: end


// SHOP: start
function displayMobileCartConfirm(data) {
	if (typeof data.cart !== 'undefined') {
		var prodName='';
		var prodCost=0;
		var x=data.cart.length-1;
//		for(x=0;x<data.cart.length;x++) {
//		}
    prodName=data.cart[x].pname;
    if (typeof cartAddProdName !== 'undefined') {
      $('#dynaCartInner .left').html('<strong>'+cartAddProdName+'</strong> added to shopping bag');
      alert(cleanTextForAlert(cartAddProdName)+" added to shopping bag.");
      delete window.cartAddProdName;
    } else {
      if (typeof data.cart[x].color	!== 'undefined') prodName+' - '+data.cart[x].color;
      $('#dynaCartInner .left').html('<strong>'+prodName+'</strong> ('+data.cart[x].price+') added to shopping bag');
      alert(cleanTextForAlert(prodName)+" added to shopping bag.");
    }
    if ($('#edgeHeader_cartNum.numItems').is(':visible')) {
      $('#edgeHeader_cartNum.numItems').text(data.cart.length);
    }
    $('#dynaCart').slideDown(250);
    setTimeout("$('#dynaCart').slideUp(250)",7000);
	}
}

function cleanTextForAlert(txt) {
  return txt.replace('&trade;','');
}

function displayCart(data) {
	if (isPhone) { displayMobileCartConfirm(data);
	} else {
    var cartNumText='';
    itemCnt=0;
    if (data.numItems==0) cartNumText='0';
    if (data.numItems==1) cartNumText='1';
    if (data.numItems>1) cartNumText=data.numItems+'';
    $('.shopBagText .numItems').html(cartNumText);
    var html='';
    if (data.numItems<1) {
        html+='<div style="width:100%;padding:5px;font-size:13px;font-weight:bold;color:#332233;text-align:right;position:relative;left:-5px;">';
        html+='your cart is empty. try our <a href="/tarte-shop-best-selling-makeup">best sellers</a>!&nbsp;&nbsp;';
        html+='</div>';
    } else {
        html+='<div class="dynaCartItemScroll">';
        var n=0;
        for(var x=data.cart.length-1;x>=0;x--) {
            n++;
            html+='<div class="cartLine cl_'+n+'" id="dynaCart_'+data.cart[x].pid+'">';
            html+='<table cellpadding=1 cellspacing=0 border=0>';
            html+='<tr><td valign="top" width="80" align="right" style="max-width:80px;">';
            if (data.cart[x].image) html+='<img src="'+data.cart[x].image+'" />';
            html+='</td>';
            html+='<td style="padding-left:10px;width:185px;"><span style="color:#332233;font-size:13px;font-weight:bold;">'+data.cart[x].pname+'<br>'+data.cart[x].priceExt+'</span>';
            html+='<br><br><span class="dynaCartDetailLine">qty: '+data.cart[x].qty;
            if (data.cart[x].color!='') html+='<br>color: '+data.cart[x].color;
            html+='<br><a href="#" onClick="removeFromCart('+data.cart[x].pid+');return false;">remove</a>';
            html+='</span>';
            html+='</td></tr></table>';
/*            html+='<div style="float:left">';
            if (data.cart[x].image) html+='<img src="'+data.cart[x].image+'" width="50"/>';
            html+='</div>';
            html+='<div class="cartLineHeadRight"><p>'+data.cart[x].pname+'</p>';
            html+='<table cellpadding=1 cellspacing=0 border=0 class="cartValueTable">';
            if (data.cart[x].color!='') html+='<tr><td width="50" align=right class="cartLineLabel">color</td><td class="cartLineValue">'+data.cart[x].color+'</td>';
            html+='<td align=right><button type="button" onClick="removeFromCart('+data.cart[x].pid+')" class="buttonSmall">Remove</button></tr>';
            html+='<tr><td class="cartLineLabel" align=right>price</td><td class="cartLineValue" colspan=2>'+data.cart[x].price+'</td></tr>';
            html+='<tr><td class="cartLineLabel" align=right>qty</td><td class="cartLineValue">'+data.cart[x].qty+'</td><td class="cartLinePrice" align=right>'+data.cart[x].priceExt+'</td></tr>';
            html+='</table>';
            html+='</div>'; */
            html+='</div>';
        }
        html+='</div>';
        
/*        html+='<table cellpadding=3 cellspacing=0 width="100%">';
        for(var x=0;data.cart.length>x;x++) {
            html+='<tr><td valign=top>';
            if (data.cart[x].image) html+='<img style="border:1px solid #888;" src="'+data.cart[x].image+'" width="50"/>';
            html+='</td>';
            html+='<td valign=top style="line-spacing:1.2em">';
            html+='<span style="font-weight:bold;font-size:13px;">'+data.cart[x].pname+'</span><br>';
            if (data.cart[x].color!='') html+='Color: '+data.cart[x].color+'<br>';
            html+=data.cart[x].qty+' @ '+data.cart[x].price+'<br>';
            html+='</td>';
            html+='<td valign=bottom align=right>'+data.cart[x].priceExt+'</td>';
            html+='</tr>';
        }
        html+='</table>'; */
        html+='<div class="dynaCartSubtotalLine">';
        html+='<div style="float:left;"><b>subtotal:</b></div><div style="float:right;"><b>'+data.total+'</b></div>';
        html+='</div>';
/*        html+='<div style="width:100%;background:black;color:white;overflow:hidden;">';
        html+='<div class="dynaCartSubTotal"><span class="dynaCartTotalText">subtotal</span><br/><span class="dynaCartTotal">'+data.total+'</span></div>';
        html+='<div style="float:right;padding-top:2px;margin-left:5px;"><a class="button" href="/my-shopping-cart">Checkout</a></div>'; */
        html+='<div style="text-align:right;text-transform:uppercase;margin-right:15px;padding:15px 0 15px 0;"><button onClick="document.location.href=\'/my-shopping-cart\';" class="edgeButton small2" type="button">Proceed to Secure Checkout</button></div>';
        html+='</div>';
    }
    positionDynaCart();
    $('#dynaCartInner').html(html);
    var b=navigator.userAgent;
//    if (b.indexOf('Chrome/')>0) {
//    	$('.dynaCartSubtotalLine').width(250);
//    }
    if (data.numItems>3) {
        $('.dynaCartItemScroll .cl_1 img').load(function() { adjustScrollerCount();   });
        $('.dynaCartItemScroll .cl_2 img').load(function() { adjustScrollerCount();   });
        $('.dynaCartItemScroll .cl_3 img').load(function() { adjustScrollerCount();   });
    }
    $('#dynaCart').slideDown(250,function() {
        setTimeout("dynaCartClose()",7000);
        $('.dynaCartItemScroll').jScrollPane();
    });
  }
}

function adjustScrollerCount() {
    itemCnt++;
    if (itemCnt==3) {
        var totHeight=
            $('.cl_1').outerHeight()
            + $('.cl_2').outerHeight()
            + $('.cl_3').outerHeight();
        $('.dynaCartItemScroll').css('max-height',totHeight+'px');
        $('.dynaCartItemScroll').jScrollPane();
    }
}
function positionDynaCart() {
    var p=$('.shopBagText').offset();
    $('.shopBagText').addClass('shopBagTextOn');
    var newLeft=p.left+$('.shopBagText').width()-$('#dynaCart').width()+10;
//    var newLeft=p.left-1;
    $('#dynaCart').css('z-index',(++menuZIndex));
    $('#dynaCart').css('left',(newLeft-1)+'px');
    $('#dynaCart').css('top',(p.top+16)+'px');
}
function removeFromCart(pid) {
    $.get('/shopping-api.php?action=remove&id='+pid, function(rawData) {
        data=$.parseJSON(rawData);
        var lineHeight=$('#dynaCart_'+pid).height();
        $('#dynaCart_'+pid).fadeOut(250,function() {
            if ($('#dynaCart .jspContainer').is(':visible')) {
                var jspHeight=$('#dynaCart .jspContainer').height();
                $('#dynaCart .jspContainer').css('height',(jspHeight-lineHeight)+'px');
            }
        });
        if (data.numItems==0) cartNumText='0';
        if (data.numItems==1) cartNumText='1';
        if (data.numItems>1) cartNumText=data.numItems;
        $('.shopBagText .numItems').html(cartNumText);
        $('.dynaCartTotal').html(data.total);
        positionDynaCart();
        if (data.numItems<1) {
            var html='';
            html+='<div style="width:100%;padding:15px;font-size:13px;font-weight:bold;color:#332233;">';
            html+='your cart is empty.';
            html+='</div>';
            $('#dynaCartInner').delay(250).html(html);
        }
        var elem = $('.dynaCartItemScroll').jScrollPane();
        try {
          var api = elem.data('jsp');
          api.destroy().reinitialise();
        } catch(err) {
          log(err.message); 
        }
        moShopBagText=false;
        moDynaCart=false;
        if (typeof cart_Get === 'function') cart_Get();
        setTimeout("dynaCartClose()",7000);
    });
}

function showDynaCart() {
    $.post('/shopping-api.php','',function(data) {
        displayCart($.parseJSON(data));
    });
}

function dynaCartClose() {
    if (!moShopBagText && !moDynaCart) {
        $('#dynaCart').slideUp(250,function () {
            $('.shopBagText').removeClass('shopBagTextOn');
        });
    }   
}

var moShopBagText=false;
var moDynaCart=false;

$(document).ready(function() {
    if (jQuery) {
        if ($('.shopBagText').is(':visible')) {
            $('.shopBagText a').remove();
            $('.shopBagText').prepend('<a href="/my-shopping-cart" id="dynaShopBagLink">shopping bag</a>');
//            $('.shopBagText a').click(function() { showDynaCart(); return false; });
						if (!isPhone) {
							$('#dynaCart').hover(function() {
									moDynaCart=true;
							},function() {
									moDynaCart=false;
									setTimeout("dynaCartClose()",1000);
							});
							$('.shopBagText').hover(function() {
									moShopBagText=true;
									showDynaCart();
							},function() {
									moShopBagText=false;
									setTimeout("dynaCartClose()",1000);
							});
						} else {
							$('#mobileHeader_shopBag').click(function() { window.location.href='/my-shopping-cart'; });
						}
        }
    }
});
// SHOP: end

function dosearch(f) {
	if (f.search.value!='') {
		f.submit();
	}
}
var loadFlag = 0;

function submit_checkout1()
{
	var validEmail=/.+@.+\.\w{2,}/;
	var doit=true;
	if (f.first_name.value == '') {
		f.first_name.style.background='#99ff99';
		doit=false;
	} else {
		f.first_name.style.background='#ffffff';
	}
	if (f.last_name.value == '') {
		f.last_name.style.background='#99ff99';
		doit=false;
	} else {
		f.last_name.style.background='#ffffff';
	}
	if (f.phone.value == '') {
		f.phone.style.background='#99ff99';
		doit=false;
	} else {
		f.phone.style.background='#ffffff';
	}
	if (f.address.value == '') {
		f.address.style.background='#99ff99';
		doit=false;
	} else {
		f.address.style.background='#ffffff';
	}
	if (f.city.value == '') {
		f.city.style.background='#99ff99';
		doit=false;
	} else {
		f.city.style.background='#ffffff';
	}

	if (f.country.options[f.country.selectedIndex].value=='United States') {
		if (f.state.selectedIndex == 0 || f.state.selectedIndex > 51) {
			f.state.style.background='#99ff99';
			doit=false;
		} else {
			f.state.style.background='#ffffff';
		}
	} else if (f.country.options[f.country.selectedIndex].value=='Canada') {
		if (f.state.selectedIndex == 0 || f.state.selectedIndex < 52) {
			f.state.style.background='#99ff99';
			doit=false;
		} else {
			f.state.style.background='#ffffff';
		}
	} else {
		f.state.style.background='#ffffff';
	}

	if (f.zip.value == '') {
		f.zip.style.background='#99ff99';
		doit=false;
	} else {
		f.zip.style.background='#ffffff';
	}
	if (f.country.selectedIndex == 0) {
		f.country.style.background='#99ff99';
		doit=false;
	} else {
		f.country.style.background='#ffffff';
	}

	if (f.pick_up.checked) {
		if (f.s_first_name.value != '') {
			f.s_first_name.style.background='#99ff99';
			doit=false;
		} else {
			f.s_first_name.style.background='#ffffff';
		}
		if (f.s_last_name.value != '') {
			f.s_last_name.style.background='#99ff99';
			doit=false;
		} else {
			f.s_last_name.style.background='#ffffff';
		}
		if (f.s_phone.value != '') {
			f.s_phone.style.background='#99ff99';
			doit=false;
		} else {
			f.s_phone.style.background='#ffffff';
		}
		if (f.s_address.value != '') {
			f.s_address.style.background='#99ff99';
			doit=false;
		} else {
			f.s_address.style.background='#ffffff';
		}
		if (f.s_address2.value != '') {
			f.s_address2.style.background='#99ff99';
			doit=false;
		} else {
			f.s_address2.style.background='#ffffff';
		}
		if (f.s_city.value != '') {
			f.s_city.style.background='#99ff99';
			doit=false;
		} else {
			f.s_city.style.background='#ffffff';
		}
		if (f.s_state.selectedIndex != 0) {
			f.s_state.style.background='#99ff99';
			doit=false;
		} else {
			f.s_state.style.background='#ffffff';
		}
		if (f.s_zip.value != '') {
			f.s_zip.style.background='#99ff99';
			doit=false;
		} else {
			f.s_zip.style.background='#ffffff';
		}
		if (f.s_country.selectedIndex != 0) {
			f.s_country.style.background='#99ff99';
			doit=false;
		} else {
			f.s_country.style.background='#ffffff';
		}
	} else {

		if (f.s_last_name.value=='' || f.s_address.value=='') {
			f.s_first_name.style.background='#ffffff';
			f.s_last_name.style.background='#ffffff';
			f.s_address.style.background='#ffffff';
			f.s_address2.style.background='#ffffff';
			f.s_phone.style.background='#ffffff';
			f.s_city.style.background='#ffffff';
			f.s_state.style.background='#ffffff';
			f.s_zip.style.background='#ffffff';
			f.s_country.style.background='#ffffff';
		}

		if (f.s_last_name.value!='' && f.s_address.value!='') {
	
			if (f.s_first_name.value == '') {
				f.s_first_name.style.background='#99ff99';
				doit=false;
			} else {
				f.s_first_name.style.background='#ffffff';
			}
			if (f.s_last_name.value == '') {
				f.s_last_name.style.background='#99ff99';
				doit=false;
			} else {
				f.s_last_name.style.background='#ffffff';
			}
			if (f.s_phone.value == '') {
				f.s_phone.style.background='#99ff99';
				doit=false;
			} else {
				f.s_phone.style.background='#ffffff';
			}
			if (f.s_address.value == '') {
				f.s_address.style.background='#99ff99';
				doit=false;
			} else {
				f.s_address.style.background='#ffffff';
			}
			if (f.s_city.value == '') {
				f.s_city.style.background='#99ff99';
				doit=false;
			} else {
				f.s_city.style.background='#ffffff';
			}
	
			if (f.s_country.options[f.s_country.selectedIndex].value=='United States') {
				if (f.s_state.selectedIndex == 0 || f.s_state.selectedIndex > 51) {
					f.s_state.style.background='#99ff99';
					doit=false;
				} else {
					f.s_state.style.background='#ffffff';
				}
			} else if (f.s_country.options[f.s_country.selectedIndex].value=='Canada') {
				if (f.s_state.selectedIndex == 0 || f.s_state.selectedIndex < 52) {
					f.s_state.style.background='#99ff99';
					doit=false;
				} else {
					f.s_state.style.background='#ffffff';
				}
			} else {
				f.s_state.style.background='#ffffff';
			}
	
			if (f.s_zip.value == '') {
				f.s_zip.style.background='#99ff99';
				doit=false;
			} else {
				f.s_zip.style.background='#ffffff';
			}
			if (f.s_country.selectedIndex == 0) {
				f.s_country.style.background='#99ff99';
				doit=false;
			} else {
				f.s_country.style.background='#ffffff';
			}
		}
	}

	if (f.email.value == '') {
		f.email.style.background='#99ff99';
		doit=false;
	} else if (!validEmail.test(f.email.value)) {
		f.email.style.background='#99ff99';
		doit=false;
	} else {
		f.email.style.background='#ffffff';
	} 
	if (f.email2.value == '') {
		f.email2.style.background='#99ff99';
		doit=false;
	} else if (!validEmail.test(f.email2.value)) {
		f.email2.style.background='#99ff99';
		doit=false;
	} else if (f.email2.value != f.email.value) {
		f.email2.style.background='#99ff99';
		doit=false;
	} else {
		f.email2.style.background='#ffffff';
	} 

	if (!doit) {
		document.verify.src='images/pleaseVerify.gif';
	}

	return(doit);
}

function goDactive(value,thefield) {
	aVal = unescape(value);
	updThis = eval("window.opener.document.theform." + thefield + ".value='" + aVal + "';");
	window.opener.document.theform.submit();
	window.opener.focus();
	window.close();
}
function goD(value,thefield) {
	aVal = unescape(value);
	updThis = eval("window.opener.document.theform." + thefield + ".value='" + aVal + "';");
	window.opener.focus();
	window.close();
}
function goT(value,thefield) {
	aVal = unescape(value);
	updThis = eval("window.opener.document.theform." + thefield + ".value='" + aVal + "';");
	window.opener.focus();
	window.close();
}
function goInsertTxt(value,thefield) {
	aName = unescape(value);
	updThis = eval("window.opener.document.theform." + thefield + ".value=aName");
	window.opener.focus();
	window.close();
}
function goInsert(value,display,thefield) {
	aName = unescape(display);
	updThis = eval("window.opener.document.theform." + thefield + "_txt" + ".value=aName");
	updThis = eval("window.opener.document.theform." + thefield + ".value=" + value);
	window.opener.focus();
	window.close();
}
function goInsert_2(value,display,thefield) {
	aName = unescape(display);
	updThis = eval("window.opener.document.theform." + thefield + "_txt" + ".value=aName");
	updThis = eval("window.opener.document.theform." + thefield + ".value=" + value);
	updThis = eval("window.opener.document.theform." + thefield + "_2_txt" + ".value=aName");
	updThis = eval("window.opener.document.theform." + thefield + "_2.value=" + value);
	window.opener.focus();
	window.close();
}
function goInsertRelay(value,display,thefield) {
	aName = unescape(display);
	updThis = eval("window.opener.document.theform." + thefield + "_txt" + ".value=aName");
	updThis = eval("window.opener.document.theform." + thefield + ".value =" + value);
	window.opener.focus();
	window.close();
}
function changeImages() {
	if (document.images) {
		for (var i=0; i<changeImages.arguments.length; i+=2) {
			document[changeImages.arguments[i]].src = changeImages.arguments[i+1];
		}
	}
}

function preloadImages() {
	if (document.images) {
		loadArray = new Array;
		for (i=0;i<preloadArray.length;i++) {
			loadArray[i] = new Image();
			loadArray[i].src = preloadArray[i];
		}
	}
loadFlag = 1;
}

function pop_window(url,windowName,w,h,sb) {
	winProps = 'height='+h+',width='+w+',toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars='+sb+',resizable=1';
	new_window = window.open(url,windowName,winProps);
	new_window.focus();
}

function submit_editperson() {
    var msg='';
	var validEmail=/.+@.+\.\w{2,}/;
	if (document.theform.last_name.value == '') {
		msg=msg + "Last name is required\n"; }
	if (msg != '') {
		alert(msg);
		return(false);
	} else {
		return(true);
	}
}
function submit_changepassword()
{
    var msg='';
	if (document.theform.verify.value != document.theform.newpw.value) {
		msg=msg + "The new password does not match the verification password\n"; }
	if (msg != '') {
		alert(msg);
		return(false);
	} else {
		return(true);
	}
}
function submit_sendpw()
{
    var msg='';
	if (document.theform.email.value == '') {
		msg=msg + "Email is required\n"; }
	if (msg != '') {
		alert(msg);
		return(false);
	} else {
		return(true);
	}
}
function submit_topic()
{
    var msg='';
	if (document.theform.text.value == '') {
		msg=msg + "Text is required\n"; }
	if (document.theform.title.value == '') {
		msg=msg + "A topic is required\n"; }
	if (msg != '') {
		alert(msg);
		return(false);
	} else {
		return(true);
	}
}
function submit_message()
{
    var msg='';
	if (document.theform.text.value == '') {
		msg=msg + "Text is required\n"; }
	if (msg != '') {
		alert(msg);
		return(false);
	} else {
		return(true);
	}
}
function submit_brochure()
{
    var msg='';
	var validEmail=/.+@.+\.\w{2,}/;
	if (document.theform.first_name.value == '') {
		msg=msg + "First name is required\n"; }
	if (document.theform.email.value == '') {
		msg=msg + "Email name is required\n";
	} else {
		if (!validEmail.test(document.theform.email.value)) {
			msg=msg + "Your Email address is not formatted correctly\n";
		}
	}
	if (msg != '') {
		alert(msg);
		return(false);
	} else {
		return(true);
	}
}
function submit_register2()
{
    var msg='';
	if (document.theform.cc_num.value == '') {
		msg=msg + "A credit card number is required\n"; }
	if (msg != '') {
		alert(msg);
		return(false);
	} else {
		return(true);
	}
}
function submit_checkout2()
{
    var msg='';
	if (document.theform.cc_num.value == '') {
		msg=msg + "your credit card number is required\n"; }
	if (document.theform.cc_code.value == '') {
		msg=msg + "your credit card security number is required\n"; }
	if (msg != '') {
		alert(msg);
		return(false);
	} else {
		return(true);
	}
}
function submit_signup()
{
    var msg='';
	var validEmail=/.+@.+\.\w{2,}/;
	if (document.theform.first_name.value == '') {
		msg=msg + "First name is required\n"; }
	if (document.theform.password.value != document.theform.password2.value) {
		msg=msg + "The passwords do not match\n"; }
	if (document.theform.email.value == '') {
		msg=msg + "Email name is required\n";
	} else {
		if (!validEmail.test(document.theform.email.value)) {
			msg=msg + "Your Email address is not formatted correctly\n";
		}
	}
	if (msg != '') {
		alert(msg);
		return(false);
	} else {
		return(true);
	}
}
function submit_nl()
{
    var msg='';
	var validEmail=/.+@.+\.\w{2,}/;
	if (document.theform.first_name.value == '') {
		msg=msg + "First name is required\n"; }
	if (document.theform.last_name.value == '') {
		msg=msg + "Last name is required\n"; }
	if (document.theform.email.value == '') {
		msg=msg + "Email is required\n";
	} else {
		if (!validEmail.test(document.theform.email.value)) {
			msg=msg + "Your Email address is not formatted correctly\n";
		}
	}
	if (msg != '') {
		alert(msg);
	} else {
		var fn=document.theform.first_name.value;
		var ln=document.theform.last_name.value;
		var em=document.theform.email.value;
		document.theform.first_name.value='';
		document.theform.last_name.value='';
		document.theform.email.value='';
		popWindow('/nlsignup.php?first_name=' + escape(fn) + '&last_name=' + escape(ln) + '&email=' + escape(em),'nlsignup','300','300');
	}
}
function submit_sb()
{
    var msg='';
	var validEmail=/.+@.+\.\w{2,}/;
	if (document.theform.name.value == '') {
		msg=msg + "Billing first name is required\n"; }
	if (document.theform.message.value == '') {
		msg=msg + "Billing city is required\n"; }
	if (document.theform.email.value == '') {
		msg=msg + "Email name is required\n";
	} else {
		if (!validEmail.test(document.theform.email.value)) {
			msg=msg + "Your Email address is not formatted correctly\n";
		}
	}
	if (msg != '') {
		alert(msg);
		return(false);
	} else {
		return(true);
	}
}
function submit_register1()
{
    var msg='';
	var validEmail=/.+@.+\.\w{2,}/;
	if (document.theform.first_name.value == '') {
		msg=msg + "Frst name is required\n"; }
	if (document.theform.last_name.value == '') {
		msg=msg + "Last name is required\n"; }
	if (document.theform.address.value == '') {
		msg=msg + "Address is required\n"; }
	if (document.theform.city.value == '') {
		msg=msg + "City is required\n"; }
	if (document.theform.email.value == '') {
		//msg=msg + "Email name is required\n";
	} else {
		if (!validEmail.test(document.theform.email.value)) {
			msg=msg + "Your Email address is not formatted correctly\n";
		}
	}
   	var s=document.theform.state.value;
	if (document.theform.country.options[document.theform.country.selectedIndex].value=='USA') {
		if (s == '') {
			msg=msg + "State is required\n"; }
		if (document.theform.zip.value == '') {
			msg=msg + "Zip code is required\n"; }
		if (s=='AB' || s=='BC' || s=='MB' || s=='NB' || s=='NL' || s=='NT' || s=='NS' || s=='NU' || s=='ON' || s=='PE' || s=='QC' || s=='SK' || s=='YT') {
			msg=msg + "You have choosen a Canadian Provice and USA as your country\n"; }
	}
	if (document.theform.country.selectedIndex==0) {
		msg=msg + "Country is required\n";
	}
	if (document.theform.country.options[document.theform.country.selectedIndex].value=='Canada') {
		if (s == '') {
			msg=msg + "Province is required\n"; }
		if (document.theform.zip.value == '') {
			msg=msg + "Postal code is required\n"; }
		if (s!='AB' && s!='BC' && s!='MB' && s!='NB' && s!='NL' && s!='NT' && s!='NS' && s!='NU' && s!='ON' && s!='PE' && s!='QC' && s!='SK' && s!='YT') {
			msg=msg + "You have choosen an American State and Canada as your country\n"; }
	}
	if (msg != '') {
		alert(msg);
		return(false);
	} else {
		return(true);
	}
}
function submit_checkout1()
{
    var msg='';
	var validEmail=/.+@.+\.\w{2,}/;
	if (document.theform.first_name.value == '') {
		msg=msg + "Frst name is required\n"; }
	if (document.theform.last_name.value == '') {
		msg=msg + "Last name is required\n"; }
	if (document.theform.address.value == '') {
		msg=msg + "Address is required\n"; }
	if (document.theform.city.value == '') {
		msg=msg + "City is required\n"; }
	if (document.theform.email.value == '') {
		//msg=msg + "Email name is required\n";
	} else {
		if (!validEmail.test(document.theform.email.value)) {
			msg=msg + "Your Email address is not formatted correctly\n";
		}
	}
   	var s=document.theform.state.value;
	if (document.theform.country.options[document.theform.country.selectedIndex].value=='USA') {
		if (s == '') {
			msg=msg + "State is required\n"; }
		if (document.theform.zip.value == '') {
			msg=msg + "Zip code is required\n"; }
		if (s=='AB' || s=='BC' || s=='MB' || s=='NB' || s=='NL' || s=='NT' || s=='NS' || s=='NU' || s=='ON' || s=='PE' || s=='QC' || s=='SK' || s=='YT') {
			msg=msg + "You have choosen a Canadian Provice and USA as your country\n"; }
	}
	if (document.theform.country.selectedIndex==0) {
		msg=msg + "Country is required\n";
	}
	if (document.theform.country.options[document.theform.country.selectedIndex].value=='Canada') {
		if (s == '') {
			msg=msg + "Province is required\n"; }
		if (document.theform.zip.value == '') {
			msg=msg + "Postal code is required\n"; }
		if (s!='AB' && s!='BC' && s!='MB' && s!='NB' && s!='NL' && s!='NT' && s!='NS' && s!='NU' && s!='ON' && s!='PE' && s!='QC' && s!='SK' && s!='YT') {
			msg=msg + "You have choosen an American State and Canada as your country\n"; }
	}
	if (msg != '') {
		alert(msg);
		return(false);
	} else {
		return(true);
	}
}

function submititCC()
{
	var msg='';
	if (document.theform.cc_num.value == '') {
		msg=msg + "Credit card number is required\n"; }
	if (msg != '') {
		alert(msg);
		return(false);
	} else {
        if (checksubmitted==1) {
            var response=confirm('It looks like you have already clicked the button to process your order.  Please click "Ok" and wait until this process is finished.  If you are sure your order is not currently being processed click "cancel" to try again');
            if (response) {
                return(false);
            } else {
                checksubmitted=1;
                return(true);
            }
        } else {
            checksubmitted=1;
            return(true);
        }
    }
}   

function change_qty(url,qty) {
	document.location=url + "&quantity=" + qty;
}
function setCookiePath(c_name,value,expiredays,path)
{
var exdate=new Date();
exdate.setDate(exdate.getDate()+expiredays);
document.cookie=c_name+ "=" +escape(value)+
((expiredays==null) ? "" : ";expires="+exdate.toGMTString()) +
(( path ) ? ";path=" + path : "" );

}
function setCookie(c_name,value,expiredays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate()+expiredays);
document.cookie=c_name+ "=" +escape(value)+
((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=");
  if (c_start!=-1)
    {
    c_start=c_start + c_name.length+1;
    c_end=document.cookie.indexOf(";",c_start);
    if (c_end==-1) c_end=document.cookie.length;
    return unescape(document.cookie.substring(c_start,c_end));
    }
  }
return "";
}

function setupFancyChecks() {
//	var msie=getInternetExplorerVersion();
//	if (msie<1 || msie>=9) {
		if ($('.label_check input').length) {
				$('.label_check').each(function(){ 
						$(this).removeClass('c_on');
				});
				$('.label_check input:checked').each(function(){ 
						$(this).parent('label').addClass('c_on');
				});                
		}
		if ($('.label_radio input').length) {
				$('.label_radio').each(function(){ 
						$(this).removeClass('r_on');
				});
				$('.label_radio input:checked').each(function(){ 
						$(this).parent('label').addClass('r_on');
				});
		}
//	}
}

function turnOnFancyChecks() {
		$('.label_check,.label_radio').unbind('click');
		$('.label_check,.label_radio').click(function(){
				$(this).find('input').blur(); // fixes for IE
				setupFancyChecks();
		});
		setupFancyChecks(); 
}

function strip_tags(html) {
 var tmp = document.createElement("DIV");
 tmp.innerHTML = html;
 return tmp.textContent||tmp.innerText;
}

function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

function fixPlaceholdersForIE() {
	var msie=getInternetExplorerVersion();
	
//	if (msie>1 && msie<9) // some rounded corner support for MSIE 8
//		$('.msie-corner').corner();
	if (msie>1 && msie<10) {
		$('[placeholder]').not('[name=s_phone],[name=b_phone]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			}
		}).blur(function() {
			var input = $(this);
			if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			}
		}).blur();
	}
}

function createCookie(c_name,value,expiredays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString())+";path=/";
}

function readCookie(c_name) {
	if (document.cookie.length>0) {
	  c_start=document.cookie.indexOf(c_name + "=");
	  if (c_start!=-1)
	    {
	    c_start=c_start + c_name.length+1;
	    c_end=document.cookie.indexOf(";",c_start);
	    if (c_end==-1) c_end=document.cookie.length;
	    return unescape(document.cookie.substring(c_start,c_end));
	    }
	  }
	return "";
}


function closeLetsBeFriends() {
    $('.emailPopup').fadeOut(150);
    $('.emailSignupBG').fadeOut(150);
}

function letsBeFriends() {
    var pos=getViewport();
    wWidth=pos[0];
    wHeight=pos[1];
    var qvWidth=553;
    var qvHeight=323;
    $('.emailPopup').css('left',((wWidth-qvWidth)/2)+'px').css('top',((wHeight-qvHeight)/2)+'px');
    $('.emailSignupBG').css('position','fixed').width(wWidth).height(wHeight);
    $('.emailSignupBG').fadeTo(150,0.4,function() {
        $('.emailPopup').fadeIn(150);
    });
}


function modalDialogPos() {
  var pos=getViewport();
  wWidth=pos[0];
  wHeight=pos[1];
  var qvWidth=$('#modalDialog').width();
  var qvHeight=$('#modalDialog').height();
  $('#modalDialog').css('left',((wWidth-qvWidth)/2)+'px').css('top',((wHeight-qvHeight)/2)+'px');
}

function modalDialogClose() {
  $('#modalDialog').fadeOut(150,function() {
    $('#modalDialogBackground').hide();
  });
}

function modalDialog(title,msg) {
  if ($('#modalDialog').length==0) {
    var html='<div id="modalDialogBackground" onClick="modalDialogClose()"></div>';
    html+='<div id="modalDialog"><div class="modalInner">';
    html+='<img src="/images/edge/close-x.png" style="cursor:pointer;border:0;position:absolute;right:0px;top:-25px;max-height:20px;" onClick="modalDialogClose()" />';
    html+='<div class="modalTitle"></div><div class="modalContent"></div></div>';
    $('body').append(html);
  }
  try {
    var pos=getViewport();
    var $ma=$('#modalDialog');
    $ma.hide();
    $('#modalDialog .modalTitle').html(title);
    $('#modalDialog .modalContent').html(msg);
    wWidth=pos[0];
    wHeight=pos[1];
    var docHeight=$(document).height();
    var docWidth=$(document).width();
    var qvWidth=$('#modalDialog').width();
    var qvHeight=$('#modalDialog').height();
    $('#modalDialog').css('left',((wWidth-qvWidth)/2)+'px').css('top',((wHeight-qvHeight)/2)+'px');
    $('#modalDialogBackground').css('position','fixed').width(wWidth).height(wHeight);
    setTimeout(function() {
      $('#modalDialogBackground').fadeTo(150,0.4,function() {
        setTimeout("$('#modalDialog').fadeIn(350);",100);
      });
    },10);
    setTimeout("modalDialogPos()",500);
  } catch(err) {
    alert(msg);
  }
}


function googleTrack(category,action,label,val) {
    if (typeof _gat !== 'undefined') {
        var pageTracker = _gat._getTracker("UA-1008926-1");
        pageTracker._trackEvent(category,action,label,val);
        log("tracked in analytics: "+category+"/"+action+"/"+label+"/"+val);
    } else {
        log("Google Analytics not loaded: "+category+"/"+action+"/"+label+"/"+val)
    }
}

var addingToCart=false;
var scrollTop=0;
var ua=navigator.userAgent;
var isWebKit=(ua.indexOf('WebKit') > 0);

function addToCart(t) {
    if (!addingToCart) {
        if ($('#quickView').length>0) {
          log("close quickview");
          closeQuickView();
        } 
        addingToCart=true;
        scrollTop=$('html').scrollTop();
        if (isWebKit) scrollTop=$('body').scrollTop();
        log("scrollTop: " + scrollTop);
        var $t=$(t);
        var buttonText=$t.text();
        $t.text("Adding...");
        var post=new Object();
        var pid=$t.attr('product_id');
        if ($t.attr('kit')) post.kit=$t.attr('kit');
        var itemId=$t.attr('data-item-id');
        var urlseg=$t.attr('data-urlseg');
        post.product_id=pid;
        post.quantity=$('select[name=quantity]').val();
        var postUrl='';
        if (pid.indexOf(',')>=0) {
                postUrl='/shopping-api.php?action=addall&ids='+pid+'&qty=1';
        } else {
                postUrl='/shopping-api.php?action=add';
        }
        log("post: "+postUrl);
        log(post);
        $.post(postUrl,post,function(data) {
            if (isWebKit) $('body').animate({scrollTop: 0}, 500);           
            else $('html').animate({scrollTop: 0}, 500);
            log(data);
            displayCart($.parseJSON(data));
            if ($('#quickView').length>0) googleTrack('QuickView','AddCart', 'Item', urlseg);
            $t.text(buttonText);
            if (isWebKit) setTimeout("$('body').animate({scrollTop: "+scrollTop+"}, 500);addingToCart=false;",4000);
            else setTimeout("$('html').animate({scrollTop: "+scrollTop+"}, 500);addingToCart=false;",4000);
        });
    }
}


$(document).ready(function() {
	if ($('.fancyChecks').length>0) {

		var imgCheckOn=new Image();
		imgCheckOn.src=_CDN+'/images/edge/check-on.png';
		var imgCheckOff=new Image();
		imgCheckOff.src=_CDN+'/images/edge/check-off.png';
		var imgRadioOn=new Image();
		imgRadioOn.src=_CDN+'/images/edge/radio-on.png';
		var imgRadioOff=new Image();
		imgRadioOff.src=_CDN+'/images/edge/radio-off.png';

		$('body').addClass('has-js');
		turnOnFancyChecks();
	}
  if (!isPhone) {
    if ($('input[name=search]').length>0) {
        $("input[name=search]").autocomplete({
            source: "/search.php?autocomplete=1",
            minLength: 2,
            select: function( event, ui ) {
             document.location.href = ui.item.value;
            },
            position: { my : "right top", at: "right bottom" },
            open: function(event, ui) { log("open"); $(".ui-autocomplete").css('z-index',1000); }
        });
        $("input[name=search]" ).autocomplete( "option", "minLength", 2 );
        /*$("input[name=search]").keypress(function(e) {
            if(e.which == 13) {
            doSearch( $("#searchTerm").val() );
            }
        });*/
        $.ui.autocomplete.prototype._renderItem = function( ul, item) {
          if (typeof item === 'object') {
            var re = new RegExp(this.term,"gi");
            var il=item.label;
            if (il.match(re)) {
              var t = item.label.replace(re,'<span class="searchTermMatchHighlight">' + this.term + '</span>');
            } else {
              var t=item.label;
            }
            return $( "<li></li>" )
              .data( "item.autocomplete", item )
              .append( "<table><tr><td>"+( (item.item_id>0) ? "<img src='/item/100/"+item.item_id+".jpg' align='left' />" : "")+"</td></tr></table> <a>" + t + "</a>" )
              .appendTo( ul );
          };
        }
        $("input[name=search]").data("autocomplete")._resizeMenu = function () {
          var ul = this.menu.element;
          //ul.outerWidth(this.element.outerWidth());
        }
    }
  }
});
