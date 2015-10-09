
angular.module("console.imgTag").service("tagService",['$http',function($http){

    this.getAlbum=function(){
        return $http.get("/client/app/data/urls.json").then(function(response){
            return response.data.urls;
        });
    };

    this.getTags = function (imgUrl) {
        var serviceUrl = 'http://tagdemo.cogtuapi.com:5000/classify_url_opt_j',
            paramData = {
                params: {
                    imageurl: imgUrl
                }
            };
        var promise = $http.get(serviceUrl, paramData).then(function (response) {

            if (response.data.tags && angular.isArray(response.data.tags)) {


                var tagdata = [],
                    confidencescale = 1.0;


                if(response.data.tags.length==0){
                    tagdata.push({ name:"无结果",percentage: 0 });
                    return tagdata;

                }

                for (i = 0; i < response.data.tags.length; i++) {
                    var tag = response.data.tags[i];
                    if (tag.confidence > confidencescale)
                        confidencescale = tag.confidence
                }
                for (i = 0; i < response.data.tags.length; i++) {
                    var tag = response.data.tags[i];
                    tagdata.push({ name: tag.prediction, value: tag.confidence, percentage: tag.confidence / confidencescale });
                }

                return tagdata;

            }
            else {
                return response.data;
            }
        });

        return promise;
    };
}]);

