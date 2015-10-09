angular.module("console.imgTag").controller("indexController", ['$scope', 'tagService', function ($scope, tagService) {
    $scope.showResult = "none";

    $scope.loading={
        display:'none'
    };

    var curImgWidth;
    var curImgHeight;
    $scope.$watch('imgUrl', function (newValue) {
        var img;
        if (newValue) {
            img = new Image;
            img.onload = function (info) {
                $scope.showResult = "none";
                curImgHeight =getWH(info.target.width,info.target.height).height;
                curImgWidth = getWH(info.target.width,info.target.height).width;
                $scope.$apply(function () {
                    $scope.validImgUrl = newValue;
                    $scope.validImgLeft = (1024 - curImgWidth) / 2;
                });
            };
            img.src = newValue;
        }
    });


    /**
     * 获取图集数据
     */
    tagService.getAlbum().then(function (data) {
        $scope.album = data;
    });

    /**
     * 选中图集中的某一项
     * @param item
     */
    $scope.showImg = function (item) {
        $scope.imgUrl = item;
    };

    /**
     * 获取分析结果
     * @param item
     */
    $scope.getTags = function (item) {
        $scope.loading.left=(curImgWidth-80)/2;
        $scope.loading.top=(curImgHeight-80)/2;
        $scope.loading.display="block";
        tagService.getTags(item).then(function (result) {
            $scope.loading.display="none";
            $scope.validImgLeft = (1024 - curImgWidth) / 2 - 200;
            $scope.resultLeft = (1024 - curImgWidth) / 2 - 200 + curImgWidth;
            $scope.result = result;
            $scope.showResult = 'block';
        });
    };
    /**
     * 帮助函数，获取缩放后的宽高
     * @param width
     * @param height
     * @returns {{width: *, height: *}}
     */
    function getWH(width, height) {
        var maxWidth = 600;
        var maxHeight = 600;

        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;

        }

        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;

        }
        console.log(width,height);
        return {
            width: width,
            height: height
        };
    }

}]);

;
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

