function getUrlVars(name)
{
	var vars =
	{
	};
	var retval = '';
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value)
		{
			if (value.indexOf("#") != -1)
			{
				valArr = value.split("#");
				value = valArr[0];
			}
			if (key == name)
			{
				retval = value

			}
			vars[key] = value;
		});
	return retval;
}
Date.prototype.addDays = function(days)
{
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}
function getDistance(p1, p2)
{
	return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
}

function point(_x, _y)
{
	this.x = Math.round(_x * 100) / 100;
	this.y = Math.round(_y * 100) / 100;
}
function is_empty(obj)
{
	if (obj == null) return true;
	if (obj.length && obj.length > 0) return false;
	if (obj.length === 0) return true;
	for (var key in obj)
	{
		if (hasOwnProperty.call(obj, key)) return false;
	}
	return true;
}
Object.size = function(obj)
{
	var size = 0, key;
	for (key in obj)
	{
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};
function urldecode(str) {
    return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}
function urlencode(str) {
    return encodeURIComponent((str+'').replace('%20', /\+/g));
}
function FloorPathData(fNum) {
    this.FloorNumber = fNum;
    this.pathArcs = new Array();
    this.coordinates = new Array();
    this.pointXml;
    this.pointList = new Array();
    this.addPoint = function(dataVal) {
        dataVal = dataVal.replace(/\{/gi, "");
        dataVal = dataVal.replace(/\}/gi, "");
        var parts = dataVal.split(";");
        var offsetY = 0;
        var x = parts[0];
        var y = parseFloat(parts[1]) + offsetY;
        pnts.push(new point(x, y));
        this.pointList.push(new point(x, y));
        this.coordinates.push(x);
        this.coordinates.push(y);
    }

    this.addPathArc = function(x, y, x2, y2) {
        this.pathArcs.push('{"x":"' + x + '","y":"' + y + '","x2":"' + x2 + '","y2":"' + y2 + '"}');
    }

}
(function($) {
    /*
     * Changes the displayed text for a jquery mobile button.
     * Encapsulates the idiosyncracies of how jquery re-arranges the DOM
     * to display a button for either an <a> link or <input type="button">
     */
    $.fn.changeButtonText = function(newText) {
        return this.each(function() {
            $this = $(this);
            if( $this.is('a') ) {
            	$this.text(newText);
               // $('span.ui-btn-text',$this).text(newText);
                return;
            }
            if( $this.is('input') ) {
                $this.val(newText);
                // go up the tree
                var ctx = $this.closest('.ui-btn');
                $('span.ui-btn-text',ctx).text(newText);
                return;
            }
        });
    };
})(jQuery);
/*!
 * jQuery-Browser-Language jQuery plugin v0.0.1
 *
 * Copyright 2010 by Dan Singerman <dansingerman@gmail.com>
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 2 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */
function loadDictionary(lang) {
	console.log("lang:" + lang);
	$.getJSON("./lang/" + lang+".json", function(data) {
         	//console.log(data)
            currentDictionary =data;
         }
     );
	}
function translatePage() {
	if (currentLanguage == "en") { return; };
	$("a").each(function(index) {
		//console.log($(this).text().trim());
		//console.log($(this).id);
		$(this).html(translatePhrase($(this).text().trim()));
		});
	
	$("li, h1, h2, h3, h4").each(function(index) {
		//console.log($(this).text().trim());
		console.log($(this).attr("id"));
		if (/p[0-9]title/gi.test($(this).attr("id"))) {
			console.log($(this).attr("id"));
			$(this).html(translatePhrase("title"));
		} else {
		var tphrase = translatePhrase($(this).text().trim())
		if (tphrase != $(this).text().trim()) {
		$(this).html(translatePhrase($(this).text().trim()));
		}
		}
		});
	}
function translatePhrase(str) {
	if (currentLanguage == "en") { return str; };
	str = str.replace(" click to expand contents","")
	str = str.replace(" click to collapse contents","")
	str = str.trim();
	if (is_empty(currentDictionary)) { return str; };
	str = str.replace("<br>","");
	var patt = /1st Floor|First Floor|2nd Floor|Second Floor|3rd Floor|Third Floor|4th Floor|Fourth Floor|5th Floor|Fifth Floor/gi;
	var p1r = patt.exec(str);
	var phrase = "";
	var p1 = "", p2 = "";
	if (!is_empty(p1r)) {
		//console.log(p1r.toString());
		p1 = is_empty(currentDictionary[p1r.toString().toLowerCase()] )? p1r : currentDictionary[p1r.toString().toLowerCase()];
		//console.log(p1);
		phrase = str.replace(p1r.toString(),p1);
		//console.log(phrase);
	} else {
		phrase = str;
		}
	
	p2 = is_empty(p1r) ? str.trim() : str.replace(p1r.toString(),"").trim();
	if (p1.length > 0) {
	//	console.log(p1 + "," + p2);
	//console.log(currentDictionary[p2.toLowerCase()]);
	}
	//console.log(is_empty(currentDictionary));
	//console.log(p2.toLowerCase());
	phrase = phrase.replace(p2,(is_empty(currentDictionary[p2.toLowerCase()]) ? p2 : currentDictionary[p2.toLowerCase()]));
	//var phrase = strp1 + " " + (is_empty(currentDictionary[p2.toLowerCase()]) ? p2 : currentDictionary[p2.toLowerCase()]);
	phrase = phrase.trim();
	//console.log(phrase);
	if (is_empty(phrase)) { phrase = str }
	//console.log(phrase);
	return phrase;
	}
(function($){
   $.browserLanguage = function(callback){
     var language;
     $.ajax({
		/*url: "http://ajaxhttpheaders.appspot.com",*/ /*<<-- This was the original url. Didn't play well with cross-domain SSL calls*/
		/*Use the url listed below that matches the current domain/sub-domain. 
			Or copy the "ajaxhttpheaders.php" file to the root of your domain/sub-domain and update the url below accordingly.*/
         /*url: "//portal.wayfindingpro.com/ajaxhttpheaders.php",*/
         /*url: "//apps.wayfindingpro.com/ajaxhttpheaders.php",*/
         url: "//maps.wayfindingpro.com/ajaxhttpheaders.php",
         dataType: 'jsonp',
         success: function(headers) {
             language = headers['Accept-Language'].substring(0,2);
             callback(language, headers['Accept-Language']);
         }
     });
   }

   /*
    Language list from http://en.wikipedia.org/wiki/ISO_639-1_language_matrix
   */

   var languageLookup = {
     "ab": "Abkhazian",
     "af": "Afrikaans",
     "an": "Aragonese",
     "ar": "Arabic",
     "as": "Assamese",
     "az": "Azerbaijani",
     "be": "Belarusian",
     "bg": "Bulgarian",
     "bn": "Bengali",
     "bo": "Tibetan",
     "br": "Breton",
     "bs": "Bosnian",
     "ca": "Catalan / Valencian",
     "ce": "Chechen",
     "co": "Corsican",
     "cs": "Czech",
     "cu": "Church Slavic",
     "cy": "Welsh",
     "da": "Danish",
     "de": "German",
     "el": "Greek",
     "en": "English",
     "eo": "Esperanto",
     "es": "Spanish / Castilian",
     "et": "Estonian",
     "eu": "Basque",
     "fa": "Persian",
     "fi": "Finnish",
     "fj": "Fijian",
     "fo": "Faroese",
     "fr": "French",
     "fy": "Western Frisian",
     "ga": "Irish",
     "gd": "Gaelic / Scottish Gaelic",
     "gl": "Galician",
     "gv": "Manx",
     "he": "Hebrew",
     "hi": "Hindi",
     "hr": "Croatian",
     "ht": "Haitian; Haitian Creole",
     "hu": "Hungarian",
     "hy": "Armenian",
     "id": "Indonesian",
     "is": "Icelandic",
     "it": "Italian",
     "ja": "Japanese",
     "jv": "Javanese",
     "ka": "Georgian",
     "kg": "Kongo",
     "ko": "Korean",
     "ku": "Kurdish",
     "kw": "Cornish",
     "ky": "Kirghiz",
     "la": "Latin",
     "lb": "Luxembourgish Letzeburgesch",
     "li": "Limburgan Limburger Limburgish",
     "ln": "Lingala",
     "lt": "Lithuanian",
     "lv": "Latvian",
     "mg": "Malagasy",
     "mk": "Macedonian",
     "mn": "Mongolian",
     "mo": "Moldavian",
     "ms": "Malay",
     "mt": "Maltese",
     "my": "Burmese",
     "nb": "Norwegian (Bokmål)",
     "ne": "Nepali",
     "nl": "Dutch",
     "nn": "Norwegian (Nynorsk)",
     "no": "Norwegian",
     "oc": "Occitan (post 1500); Provençal",
     "pl": "Polish",
     "pt": "Portuguese",
     "rm": "Raeto-Romance",
     "ro": "Romanian",
     "ru": "Russian",
     "sc": "Sardinian",
     "se": "Northern Sami",
     "sk": "Slovak",
     "sl": "Slovenian",
     "so": "Somali",
     "sq": "Albanian",
     "sr": "Serbian",
     "sv": "Swedish",
     "sw": "Swahili",
     "tk": "Turkmen",
     "tr": "Turkish",
     "ty": "Tahitian",
     "uk": "Ukrainian",
     "ur": "Urdu",
     "uz": "Uzbek",
     "vi": "Vietnamese",
     "vo": "Volapuk",
     "yi": "Yiddish",
     "zh": "Chinese"
   }

})(jQuery);
/**
 * A Javascript object to encode and/or decode html characters using HTML or Numeric entities that handles double or partial encoding
 * Author: R Reid
 * source: http://www.strictly-software.com/htmlencode
 * Licences: GPL, The MIT License (MIT)
 * Copyright: (c) 2011 Robert Reid - Strictly-Software.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Revision:
 *  2011-07-14, Jacques-Yves Bleau: 
 *       - fixed conversion error with capitalized accentuated characters
 *       + converted arr1 and arr2 to object property to remove redundancy
 *
 * Revision:
 *  2011-11-10, Ce-Yi Hio: 
 *       - fixed conversion error with a number of capitalized entity characters
 *
 * Revision:
 *  2011-11-10, Rob Reid: 
 *		 - changed array format
 *
 * Revision:
 *  2012-09-23, Alex Oss: 
 *		 - replaced string concatonation in numEncode with string builder, push and join for peformance with ammendments by Rob Reid
 */

Encoder = {

	// When encoding do we convert characters into html or numerical entities
	EncodeType : "entity",  // entity OR numerical

	isEmpty : function(val){
		if(val){
			return ((val===null) || val.length==0 || /^\s+$/.test(val));
		}else{
			return true;
		}
	},
	
	// arrays for conversion from HTML Entities to Numerical values
	arr1: ['&nbsp;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;','&uml;','&copy;','&ordf;','&laquo;','&not;','&shy;','&reg;','&macr;','&deg;','&plusmn;','&sup2;','&sup3;','&acute;','&micro;','&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;','&frac12;','&frac34;','&iquest;','&Agrave;','&Aacute;','&Acirc;','&Atilde;','&Auml;','&Aring;','&AElig;','&Ccedil;','&Egrave;','&Eacute;','&Ecirc;','&Euml;','&Igrave;','&Iacute;','&Icirc;','&Iuml;','&ETH;','&Ntilde;','&Ograve;','&Oacute;','&Ocirc;','&Otilde;','&Ouml;','&times;','&Oslash;','&Ugrave;','&Uacute;','&Ucirc;','&Uuml;','&Yacute;','&THORN;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&oslash;','&ugrave;','&uacute;','&ucirc;','&uuml;','&yacute;','&thorn;','&yuml;','&quot;','&amp;','&lt;','&gt;','&OElig;','&oelig;','&Scaron;','&scaron;','&Yuml;','&circ;','&tilde;','&ensp;','&emsp;','&thinsp;','&zwnj;','&zwj;','&lrm;','&rlm;','&ndash;','&mdash;','&lsquo;','&rsquo;','&sbquo;','&ldquo;','&rdquo;','&bdquo;','&dagger;','&Dagger;','&permil;','&lsaquo;','&rsaquo;','&euro;','&fnof;','&Alpha;','&Beta;','&Gamma;','&Delta;','&Epsilon;','&Zeta;','&Eta;','&Theta;','&Iota;','&Kappa;','&Lambda;','&Mu;','&Nu;','&Xi;','&Omicron;','&Pi;','&Rho;','&Sigma;','&Tau;','&Upsilon;','&Phi;','&Chi;','&Psi;','&Omega;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigmaf;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&thetasym;','&upsih;','&piv;','&bull;','&hellip;','&prime;','&Prime;','&oline;','&frasl;','&weierp;','&image;','&real;','&trade;','&alefsym;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&crarr;','&lArr;','&uArr;','&rArr;','&dArr;','&hArr;','&forall;','&part;','&exist;','&empty;','&nabla;','&isin;','&notin;','&ni;','&prod;','&sum;','&minus;','&lowast;','&radic;','&prop;','&infin;','&ang;','&and;','&or;','&cap;','&cup;','&int;','&there4;','&sim;','&cong;','&asymp;','&ne;','&equiv;','&le;','&ge;','&sub;','&sup;','&nsub;','&sube;','&supe;','&oplus;','&otimes;','&perp;','&sdot;','&lceil;','&rceil;','&lfloor;','&rfloor;','&lang;','&rang;','&loz;','&spades;','&clubs;','&hearts;','&diams;'],
	arr2: ['&#160;','&#161;','&#162;','&#163;','&#164;','&#165;','&#166;','&#167;','&#168;','&#169;','&#170;','&#171;','&#172;','&#173;','&#174;','&#175;','&#176;','&#177;','&#178;','&#179;','&#180;','&#181;','&#182;','&#183;','&#184;','&#185;','&#186;','&#187;','&#188;','&#189;','&#190;','&#191;','&#192;','&#193;','&#194;','&#195;','&#196;','&#197;','&#198;','&#199;','&#200;','&#201;','&#202;','&#203;','&#204;','&#205;','&#206;','&#207;','&#208;','&#209;','&#210;','&#211;','&#212;','&#213;','&#214;','&#215;','&#216;','&#217;','&#218;','&#219;','&#220;','&#221;','&#222;','&#223;','&#224;','&#225;','&#226;','&#227;','&#228;','&#229;','&#230;','&#231;','&#232;','&#233;','&#234;','&#235;','&#236;','&#237;','&#238;','&#239;','&#240;','&#241;','&#242;','&#243;','&#244;','&#245;','&#246;','&#247;','&#248;','&#249;','&#250;','&#251;','&#252;','&#253;','&#254;','&#255;','&#34;','&#38;','&#60;','&#62;','&#338;','&#339;','&#352;','&#353;','&#376;','&#710;','&#732;','&#8194;','&#8195;','&#8201;','&#8204;','&#8205;','&#8206;','&#8207;','&#8211;','&#8212;','&#8216;','&#8217;','&#8218;','&#8220;','&#8221;','&#8222;','&#8224;','&#8225;','&#8240;','&#8249;','&#8250;','&#8364;','&#402;','&#913;','&#914;','&#915;','&#916;','&#917;','&#918;','&#919;','&#920;','&#921;','&#922;','&#923;','&#924;','&#925;','&#926;','&#927;','&#928;','&#929;','&#931;','&#932;','&#933;','&#934;','&#935;','&#936;','&#937;','&#945;','&#946;','&#947;','&#948;','&#949;','&#950;','&#951;','&#952;','&#953;','&#954;','&#955;','&#956;','&#957;','&#958;','&#959;','&#960;','&#961;','&#962;','&#963;','&#964;','&#965;','&#966;','&#967;','&#968;','&#969;','&#977;','&#978;','&#982;','&#8226;','&#8230;','&#8242;','&#8243;','&#8254;','&#8260;','&#8472;','&#8465;','&#8476;','&#8482;','&#8501;','&#8592;','&#8593;','&#8594;','&#8595;','&#8596;','&#8629;','&#8656;','&#8657;','&#8658;','&#8659;','&#8660;','&#8704;','&#8706;','&#8707;','&#8709;','&#8711;','&#8712;','&#8713;','&#8715;','&#8719;','&#8721;','&#8722;','&#8727;','&#8730;','&#8733;','&#8734;','&#8736;','&#8743;','&#8744;','&#8745;','&#8746;','&#8747;','&#8756;','&#8764;','&#8773;','&#8776;','&#8800;','&#8801;','&#8804;','&#8805;','&#8834;','&#8835;','&#8836;','&#8838;','&#8839;','&#8853;','&#8855;','&#8869;','&#8901;','&#8968;','&#8969;','&#8970;','&#8971;','&#9001;','&#9002;','&#9674;','&#9824;','&#9827;','&#9829;','&#9830;'],
		
	// Convert HTML entities into numerical entities
	HTML2Numerical : function(s){
		return this.swapArrayVals(s,this.arr1,this.arr2);
	},	

	// Convert Numerical entities into HTML entities
	NumericalToHTML : function(s){
		return this.swapArrayVals(s,this.arr2,this.arr1);
	},


	// Numerically encodes all unicode characters
	numEncode : function(s){ 
		if(this.isEmpty(s)) return ""; 

		var a = [],
			l = s.length; 
		
		for (var i=0;i<l;i++){ 
			var c = s.charAt(i); 
			if (c < " " || c > "~"){ 
				a.push("&#"); 
				a.push(c.charCodeAt()); //numeric value of code point 
				a.push(";"); 
			}else{ 
				a.push(c); 
			} 
		} 
		
		return a.join(""); 	
	}, 
	
	// HTML Decode numerical and HTML entities back to original values
	htmlDecode : function(s){

		var c,m,d = s;
		
		if(this.isEmpty(d)) return "";

		// convert HTML entites back to numerical entites first
		d = this.HTML2Numerical(d);
		
		// look for numerical entities &#34;
		arr=d.match(/&#[0-9]{1,5};/g);
		
		// if no matches found in string then skip
		if(arr!=null){
			for(var x=0;x<arr.length;x++){
				m = arr[x];
				c = m.substring(2,m.length-1); //get numeric part which is refernce to unicode character
				// if its a valid number we can decode
				if(c >= -32768 && c <= 65535){
					// decode every single match within string
					d = d.replace(m, String.fromCharCode(c));
				}else{
					d = d.replace(m, ""); //invalid so replace with nada
				}
			}			
		}

		return d;
	},		

	// encode an input string into either numerical or HTML entities
	htmlEncode : function(s,dbl){
			
		if(this.isEmpty(s)) return "";

		// do we allow double encoding? E.g will &amp; be turned into &amp;amp;
		dbl = dbl || false; //default to prevent double encoding
		
		// if allowing double encoding we do ampersands first
		if(dbl){
			if(this.EncodeType=="numerical"){
				s = s.replace(/&/g, "&#38;");
			}else{
				s = s.replace(/&/g, "&amp;");
			}
		}

		// convert the xss chars to numerical entities ' " < >
		s = this.XSSEncode(s,false);
		
		if(this.EncodeType=="numerical" || !dbl){
			// Now call function that will convert any HTML entities to numerical codes
			s = this.HTML2Numerical(s);
		}

		// Now encode all chars above 127 e.g unicode
		s = this.numEncode(s);

		// now we know anything that needs to be encoded has been converted to numerical entities we
		// can encode any ampersands & that are not part of encoded entities
		// to handle the fact that I need to do a negative check and handle multiple ampersands &&&
		// I am going to use a placeholder

		// if we don't want double encoded entities we ignore the & in existing entities
		if(!dbl){
			s = s.replace(/&#/g,"##AMPHASH##");
		
			if(this.EncodeType=="numerical"){
				s = s.replace(/&/g, "&#38;");
			}else{
				s = s.replace(/&/g, "&amp;");
			}

			s = s.replace(/##AMPHASH##/g,"&#");
		}
		
		// replace any malformed entities
		s = s.replace(/&#\d*([^\d;]|$)/g, "$1");

		if(!dbl){
			// safety check to correct any double encoded &amp;
			s = this.correctEncoding(s);
		}

		// now do we need to convert our numerical encoded string into entities
		if(this.EncodeType=="entity"){
			s = this.NumericalToHTML(s);
		}

		return s;					
	},

	// Encodes the basic 4 characters used to malform HTML in XSS hacks
	XSSEncode : function(s,en){
		if(!this.isEmpty(s)){
			en = en || true;
			// do we convert to numerical or html entity?
			if(en){
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&quot;");
				s = s.replace(/</g,"&lt;");
				s = s.replace(/>/g,"&gt;");
			}else{
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&#34;");
				s = s.replace(/</g,"&#60;");
				s = s.replace(/>/g,"&#62;");
			}
			return s;
		}else{
			return "";
		}
	},

	// returns true if a string contains html or numerical encoded entities
	hasEncoded : function(s){
		if(/&#[0-9]{1,5};/g.test(s)){
			return true;
		}else if(/&[A-Z]{2,6};/gi.test(s)){
			return true;
		}else{
			return false;
		}
	},

	// will remove any unicode characters
	stripUnicode : function(s){
		return s.replace(/[^\x20-\x7E]/g,"");
		
	},

	// corrects any double encoded &amp; entities e.g &amp;amp;
	correctEncoding : function(s){
		return s.replace(/(&amp;)(amp;)+/,"$1");
	},


	// Function to loop through an array swaping each item with the value from another array e.g swap HTML entities with Numericals
	swapArrayVals : function(s,arr1,arr2){
		if(this.isEmpty(s)) return "";
		var re;
		if(arr1 && arr2){
			//ShowDebug("in swapArrayVals arr1.length = " + arr1.length + " arr2.length = " + arr2.length)
			// array lengths must match
			if(arr1.length == arr2.length){
				for(var x=0,i=arr1.length;x<i;x++){
					re = new RegExp(arr1[x], 'g');
					s = s.replace(re,arr2[x]); //swap arr1 item with matching item from arr2	
				}
			}
		}
		return s;
	},

	inArray : function( item, arr ) {
		for ( var i = 0, x = arr.length; i < x; i++ ){
			if ( arr[i] === item ){
				return i;
			}
		}
		return -1;
	}

}