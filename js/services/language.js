
window.nivelConfiguration = {

}


var language = localStorage.getItem("language");

if(language == undefined) {

    localStorage.setItem("language", navigator.language);

    window.nivelConfiguration.language = navigator.language;

} else {

    window.nivelConfiguration.language = language;

}


if(nivelConfiguration.language.indexOf("fr") != -1) {

    window.nivelConfiguration.lang = 'fr';

} else {

    window.nivelConfiguration.lang = 'en';

}




var style = document.createElement('style');
style.innerHTML =
    '[lang=!'+window.nivelConfiguration.lang+'] { display:none;}';


// Get the first script tag
var ref = document.querySelector('script');

// Insert our new styles before the first script tag
ref.parentNode.insertBefore(style, ref);


console.log(window.nivelConfiguration.language);



angular
   .module('nivel')
   .service('Language', [ 'Emitter', function (Emitter) {



      Emitter.apply(this, arguments);

      var self = this;

      this.register('changed');     

   		//default language
   		this.lang = 'en';



   		if(nivelConfiguration.language.indexOf("fr") != -1) {

   			this.lang = 'fr';

   		}

      this.set = function (lang) {

        console.log(lang);
        
        this.lang = lang;

        this.emit('changed', lang);

      }


   		this.add = function(){


   		};

   		this.remove = function () {

   		}



   }]);
