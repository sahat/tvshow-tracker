describe('controllers', function(){
  beforeEach(module('MyApp'));

  describe('AddCtrl', function() {
    it('should add a new show', inject(function($controller) {
      var addCtrl = $controller('AddCtrl', { $scope: {} });
      expect(addCtrl).toBeDefined();
    }));
  });

  it('should be defined', inject(function($controller) {
    var detailCtrl = $controller('DetailCtrl', { $scope: {} });
    expect(detailCtrl).toBeDefined();
  }));
});