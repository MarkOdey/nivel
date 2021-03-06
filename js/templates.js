angular.module('templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('js/partials/anchor-menu.html',
    "\n" +
    "\n" +
    "<ul>\n" +
    "\n" +
    "	<li ng-repeat=\"anchor in anchors\"><a href=\"{{baseurl}}#{{anchor.id}}\">{{anchor.id}}</a></li>\n" +
    "\n" +
    "</ul>\n" +
    "<div class=\"border-top\"></div>\n" +
    "\n" +
    "        "
  );


  $templateCache.put('js/partials/calendar-menu.html',
    "<div class=\"container\">\n" +
    "\n" +
    "	<div class=\"border-top\"></div>\n" +
    "\n" +
    "	<div class=\"container submenu\">\n" +
    "\n" +
    "		<span class=\"item\" ng-repeat='(yearKey, year) in years' ng-class=\"{ active : activeDate.year() == year.year() }\" ng-click='changeYear(year)'>\n" +
    "\n" +
    "			{{year | moment : 'YYYY'}}\n" +
    "\n" +
    "		</span>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"border-top\"></div>\n" +
    "\n" +
    "	<div class=\"container submenu\">\n" +
    "\n" +
    "		<span class=\"item\" ng-repeat='(monthKey, month) in months' ng-class=\"{ active : activeDate.month() == month.month() }\" ng-click='changeMonth(month)'>\n" +
    "\n" +
    "	    	{{month | moment : 'MMMM'}}\n" +
    "		\n" +
    "		</span>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"border-top\"></div>\n" +
    "\n" +
    "	<div class=\"container submenu\">\n" +
    "\n" +
    "		<span class=\"item\" ng-repeat='(dayKey, day) in days' ng-class=\"{ active :  startDate.format('DD') <= day.format('DD') && endDate.format('DD') >= day.format('DD') }\"  ng-click='changeDay(day)'>\n" +
    "\n" +
    "		    {{day | moment : 'DD'}}\n" +
    "\n" +
    "		</span>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"border-top\"></div>\n" +
    "\n" +
    "	<div class=\"container center\">\n" +
    "\n" +
    "		<h1 style=\"padding-top:10px\">\n" +
    "			<span ng-click=\"getPreviousDay()\" class=\"icon icon-arrow-left-c\"></span>\n" +
    "\n" +
    "				{{startDate | moment : 'DD MMMM YYYY'}} / {{endDate | moment : 'DD MMMM YYYY'}}\n" +
    "			\n" +
    "			<span ng-click=\"getNextDay()\" class=\"icon icon-arrow-right-c\"></span>\n" +
    "		</h1>\n" +
    "\n" +
    "	</div>\n" +
    "</div>\n"
  );


  $templateCache.put('js/partials/donation.html',
    "<form target=\"paypal\" action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\" target=\"_top\">\n" +
    "\n" +
    "	<input type=\"hidden\" name=\"cmd\" value=\"_cart\">\n" +
    "	<input type=\"hidden\" name=\"business\" value=\"alfonso@fonderiedarling.org\">\n" +
    "	<input type=\"hidden\" name=\"lc\" value=\"CA\">\n" +
    "	<input type=\"hidden\" name=\"item_name\" value=\"{{title}}\">\n" +
    "	<input type=\"hidden\" name=\"currency_code\" value=\"CAD\">\n" +
    "	<input type=\"hidden\" name=\"button_subtype\" value=\"products\">\n" +
    "	<input type=\"hidden\" name=\"no_note\" value=\"0\">\n" +
    "	<input type=\"hidden\" name=\"add\" value=\"1\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<input id=\"amount\" class=\"fieldInput\" type=\"number\" ng-model=\"amount\" name=\"amount\" >\n" +
    "		\n" +
    "\n" +
    "	<div ng-click=\"send()\" class=\"button\">\n" +
    "		\n" +
    "		{{buttontext}}\n" +
    "	\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</form>"
  );


  $templateCache.put('js/partials/dropdown-toggler.html',
    "\n" +
    "<div class=\"dropdown\">   \n" +
    "\n" +
    "\n" +
    "    <button class=\"btn form-control  dropdown-toggle\" type=\"button\" ng-click=\"openDropdown()\">\n" +
    "        \n" +
    "        <div class=\"dropdown-header\">{{value}}</div>\n" +
    "\n" +
    "    </button>\n" +
    "\n" +
    "    <div ng-class=\"{ show : showDropDown }\" class=\"dropdown-menu\" >\n" +
    "\n" +
    "\n" +
    "        <ng-transclude></ng-transclude>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('js/partials/file-lister-item.html',
    "\n" +
    "\n" +
    "<div class=\"border-bottom row p-2\">\n" +
    "\n" +
    "    <div class=\"col-md-6 col-sm-12\">\n" +
    "    	<span class=\"icon-file-o\" ></span>&nbsp;{{data.name}} \n" +
    "\n" +
    "        <span ng-click=\"download()\" class=\"icon-arrow-circle-o-down\"></span>\n" +
    "        <span ng-click=\"delete()\" class=\"icon-trash-bin\"></span>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "        {{data.lastModified | momentunix : 'L LTS' }}\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('js/partials/file-lister.html',
    "<div class=\"row\">\n" +
    "    \n" +
    "\n" +
    "    <div class=\"p-4 w-100\" ng-repeat=\"upload in uploads\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "        {{upload.name}} <span ng-click=\"deleteUpload()\" class=\"icon-cancel\"></span>  \n" +
    "\n" +
    "        <div class=\"progress\">\n" +
    "        <div class=\"progress-bar progress-bar-striped progress-bar-animated\" role=\"progressbar\" style=\"width:{{100*upload.size/upload.progressEvent.loaded}}%\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>   \n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div ng-repeat=\"folder in folders\">\n" +
    "\n" +
    "    <div class=\"card mt-2\">\n" +
    "\n" +
    "        <div class=\"bg-primary card-header \">\n" +
    "            \n" +
    "\n" +
    "                \n" +
    "            <span class=\"icon icon-folder-open-o\"></span>&nbsp;{{folder.createdOn}} \n" +
    "\n" +
    "            <span ng-click=\"downloadFolder(folder)\" class=\"icon-arrow-circle-o-down\"></span>\n" +
    "            <span ng-click=\"deleteFolder(folder)\" class=\"icon-trash-bin\"></span>\n" +
    "\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"card-body\">\n" +
    "\n" +
    "            <div ng-repeat=\"file in folder.files\">    \n" +
    "\n" +
    "                \n" +
    "                <filelisteritem data=\"file\"></filelisteritem>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            </div>\n" +
    "            <span>...</span>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n"
  );

}]);
