describe('filter', function() {
  beforeEach(module('MyApp'));

  describe('interpolate', function() {
    it('should replace VERSION', inject(function(fromNowFilter) {
      expect(fromNow).toBeDefined();
    }));
  });
});