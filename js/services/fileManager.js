

if(window.nivelConfiguration == undefined) {


    window.nivelConfiguration = {};

}

//Setting api object. If non defined.
//Here you can put all api url for your configuration.
if(window.nivelConfiguration.api == undefined) {

    window.nivelConfiguration.api = {};

}

if(window.nivelConfiguration.api.upload == undefined) {

    window.nivelConfiguration.api.upload = ""
}

var files = localStorage.getItem("files");





angular
   .module('nivel')
   .service('FileManager', [ 'Emitter', '$q', '$rootScope', 'File', '$http', function(Emitter, $q, $rootScope, File, $http) {



        Emitter.apply(this, arguments);

        var self = this;

        self.register(['updated', 'uploadAdded', 'progressUpdated']);

        this.folders= [];

        this.uploads = [];

        this.getFiles = function() {


            return $http({

               method:"GET",
               url : 'http://evacdisplays.local/rest/folder',
               withCredentials : true

            });

            
        }


        this.getFolders = function () {

            var request = $http({

               method:"GET",
               url : './rest/folder',
               withCredentials : true

            });

            //Lets fire off an update.
            request.then(function(response) {

                self.folders = response.data.object;

                self.emit('updated', self.folders);

            });

            return request;

        }

        this.deleteFolder = function (folder) {

            console.log(folder);

            var request = $http({

                method:folder.delete.method,
                url : folder.delete.url,
                withCredentials : true

            });

            request.then(function (e) {


                self.getFolders();

            });

            return request;
        }


        this.upload = function(input, query) {


            var file = new File(input);


            //We start a new XHR request
            var xhr             = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.open('POST', query, true);

            //We track the loaded phase (when assets are fully loaded)
            xhr.onload = function() {
                
                var response;
                

                if(this.status == 500 || this.status == 400) {

                    console.log(this.response)

                    //defer.reject(response);

                }else if(this.status == 200) {
                    
                    console.log(this.response)
                    //response = JSON.parse(this.response);

                    //defer.resolve(response);
                    //
                    //
                    //
                    
                    self.getFolders();
                    

                    file.loaded(this.response);



                }

                $rootScope.$apply();
                
            };

            //We track the progress phase
            xhr.upload.onprogress = function(e) {

                console.log(e);

                file.progressUpdate(e);

                self.on('progressUpdated', file);

            };

            //We bind the file to the request
            var formData = new FormData();
            formData.append("file", input);

            //We send the form. Fire the query
            xhr.send(formData);

            self.emit('uploadAdded', file);
            self.uploads.push(file);

            return file;
            
        }

        this.deleteFile = function (file) {


            var request = $http({

                method:file.delete.method,
                url : file.delete.url,
                withCredentials : true

            });

            request.then(function (e) {


                self.getFolders();

            });


        }


        this.downloadFile = function (file) {

            var request = $http({

                method:file.get.method,
                url : file.get.url,
                withCredentials : true,
                responseType:"arraybuffer"

            });

            request.success(function (data, status, headers) {


                headers = headers();
 
                var filename = headers['x-filename'];
                var contentType = headers['content-type'];
         
                var linkElement = document.createElement('a');

                try {

                    var blob = new Blob([data], { type: contentType });
                    var url = window.URL.createObjectURL(blob);
         
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);
         
                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);

                } catch (ex) {

                    console.log(ex);

                }


                self.getFolders();

            });

        }

        this.downloadFolder = function (folder) {

            var request = $http({

                method:folder.download.method,
                url : folder.download.url,
                withCredentials : true,
                responseType:"arraybuffer"

            });

            request.success(function (data, status, headers) {


                headers = headers();

                console.log(headers);
 
                var filename = headers['x-filename'];
                var contentType = headers['content-type'];
         
                var linkElement = document.createElement('a');

                try {

                    var blob = new Blob([data], { type: contentType });
                    var url = window.URL.createObjectURL(blob);
         
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);
         
                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);

                } catch (ex) {

                    console.log(ex);

                }


                self.getFolders();

            });
        }


   }]);

angular
    .module('nivel')
    .factory('File', ['Emitter', '$q', function (Emitter, $q) {

        var File = function (file) {

            Emitter.apply(this, arguments);

            //Shallow merge.
            for(var i in file) {

                this[i] = file[i];
            }


            console.log(file);
    
            var self = this;

            this.register(['progress', 'loaded']);

            this.progressUpdate = function (e) {

                self.progressEvent = e;

                self.emit('progress', e);


            }

            this.loaded = function (e) {


                self.loadedEvent = e;

                self.emit('loaded', e);

            }


         



        }

        return File;

    }]);
