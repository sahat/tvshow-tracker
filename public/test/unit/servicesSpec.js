describe('service', function() {
  beforeEach(module('MyApp'));

  describe('Auth', function() {
    it('should return current version', inject(function(Auth) {
      expect(Auth).toBeDefined();
    }));
  });
});