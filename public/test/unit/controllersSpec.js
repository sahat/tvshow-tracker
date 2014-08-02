describe('controllers', function(){
  beforeEach(module('MyApp'));

  it('should ....', inject(function($controller) {
    //spec body
    var addCtrl = $controller('AddCtrl', { $scope: {} });
    expect(addCtrl).toBeDefined();
  }));

  it('should ....', inject(function($controller) {
    //spec body
    var detailCtrl = $controller('DetailCtrl', { $scope: {} });
    expect(detailCtrl).toBeDefined();
  }));
});