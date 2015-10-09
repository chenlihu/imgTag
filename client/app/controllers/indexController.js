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

