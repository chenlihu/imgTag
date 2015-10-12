angular.module("console.imgTag").controller("indexController", ['$q', '$http', '$scope', 'tagService', '$interval', 'Upload', function ($q, $http, $scope, tagService, $interval, uploadService) {
    $scope.showResult = false;

    $scope.loading = {
        display: 'none'
    };

    var curImgWidth;
    var curImgHeight;
    $scope.$watch('imgUrl', function (newValue) {
        var img;
        if (newValue && newValue.indexOf('blob') == -1) {
            img = new Image;
            img.onload = function (info) {
                console.log(info);
                $scope.showResult = false;
                curImgHeight = getWH(info.target.width, info.target.height).height;
                curImgWidth = getWH(info.target.width, info.target.height).width;
                $scope.$apply(function () {
                    $scope.validImgUrl = newValue;
                    $scope.validImgLeft = (1024 - curImgWidth) / 2;

                    abortPendingRequest();
                    getTags($scope.validImgUrl);
                });
            };
            img.src = newValue;
        }
    });

    $scope.upload = function (file) {
        if(!file) return;
        console.log('上传文件', file);

        uploadService.imageDimensions(file).then(function (dimensions) {

            curImgHeight = getWH(dimensions.width, dimensions.height).height;
            curImgWidth = getWH(dimensions.width, dimensions.height).width;


            $scope.showResult = false;
            $scope.loading.display = "none";
            $scope.imgUrl = file.blobUrl;
            $scope.validImgUrl = file.blobUrl;
            $scope.validImgLeft = (1024 - curImgWidth) / 2;
            $scope.loading.left = (curImgWidth - 80) / 2;
            $scope.loading.top = (curImgHeight - 80) / 2;
            $scope.loading.display = "block";

            abortPendingRequest();


            uploadService.upload({
                url: 'http://localhost:9001/api/1.1/creatives/material',
                method:'POST',
                file: file
            }).success(function (data, status, headers, config) {

                var result;
                if (data.tags && angular.isArray(data.tags)) {


                    var tagdata = [],
                        confidencescale = 1.0;


                    if(data.tags.length==0){
                        tagdata.push({ name:"无结果",percentage: 0 });
                        return tagdata;

                    }

                    for (i = 0; i < data.tags.length; i++) {
                        var tag = data.tags[i];
                        if (tag.confidence > confidencescale)
                            confidencescale = tag.confidence
                    }
                    for (i = 0; i < data.tags.length; i++) {
                        var tag = data.tags[i];
                        tagdata.push({ name: tag.prediction, value: tag.confidence, percentage: tag.confidence / confidencescale });
                    }

                    result=tagdata;

                }



                console.log('resolved');
                $scope.loading.display = "none";
                var targetImgLeft = (1024 - curImgWidth) / 2 - 200;
                var animate = $interval(function () {
                    if ($scope.validImgLeft > targetImgLeft) {
                        $scope.validImgLeft -= 10;

                    } else {
                        $scope.validImgLeft = targetImgLeft;
                        $interval.cancel(animate);
                    }
                }, 5)

                $scope.resultLeft = (1024 - curImgWidth) / 2 - 200 + curImgWidth;
                $scope.result = result;
                $scope.showResult = true;

            }).error(function (data, status, headers, config) {
                console.log('error status: ', status);
            });


        });
    };

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
    function getTags(item) {
        $scope.loading.left = (curImgWidth - 80) / 2;
        $scope.loading.top = (curImgHeight - 80) / 2;
        $scope.loading.display = "block";
        tagService.getTags(item).then(function (result) {
            console.log('resolved');
            $scope.loading.display = "none";
            var targetImgLeft = (1024 - curImgWidth) / 2 - 200;
            var animate = $interval(function () {
                if ($scope.validImgLeft > targetImgLeft) {
                    $scope.validImgLeft -= 10;

                } else {
                    $scope.validImgLeft = targetImgLeft;
                    $interval.cancel(animate);
                }
            }, 5)

            $scope.resultLeft = (1024 - curImgWidth) / 2 - 200 + curImgWidth;
            $scope.result = result;
            $scope.showResult = true;
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
        console.log(width, height);
        return {
            width: width,
            height: height
        };
    }

    /**
     * 帮助函数，终止挂起的分析请求
     */
    function abortPendingRequest() {
        var pendingRequests = $http.pendingRequests;
        for (var i = 0; i < pendingRequests.length; i++) {
            var item = pendingRequests[i];
            console.log(item);
            if (item.defer && item.defer.resolve) {
                item.defer.resolve();
            }
        }
    }
}]);

