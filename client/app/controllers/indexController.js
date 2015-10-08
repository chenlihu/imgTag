angular.module("console.imgTag").controller("indexController",['$scope',function($scope){
    $(".close").click(function(){
        $(".bg,.result").css("display","none");
    });

    $scope.loading=function(){
        $(".bg,.result").css("display","block");
    };

    $scope.$watch('imgUrl',function(newValue){
        console.log('newValue',newValue);
        var img;
        if(newValue){
            img=new Image;
            img.onload=function(){
                $scope.$apply(function(){
                    $scope.validImgUrl=newValue;
                });
            };
            img.src=newValue;

        }
    });

}]);

