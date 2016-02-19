describe("Account", function(){
    var Account = require('../../models/account.js');
    var userObj = {
        username: "Test User",
        password: "test123"
    };
    var user;
    var token = '6e344d80bde9f936cca5b14a36abd0ed79747d39a60f54516a5e5fd71a83532a13310c1a5abccd7ad35759d64b1df4e0e323cfaaf64574dc55989a151c5b41fc7c1eca29e2f0834acfcb5451faa79de121b760ab40a8312cc6e3451a5b85bd651222c52c72b94e530935990377ed12df295ba5c30e9cd549e4c27073adc6acf5';
    var credentials = {username: 'steven', password: 'steven'};

    describe("creating a new user", function(){
        beforeEach(function(done){
            Account.new(userObj, function(err, response){
                user = response;
                done();
            });
        });
        afterEach(function(done){
            Account.delete(user.id, function(){
                done();
            });
        });

        it("should have an id, username, password", function(done) {
            expect(user.id).toBeGreaterThan(0);
            expect(user.name).toBe("Test User");
            expect(user.passwordhash).toBeTruthy();
            done();
        });

        it("should have a hashed password", function(done){
            expect(userObj.password).not.toEqual(user.passwordhash);
            done();
        });

    });

    describe("accessing a user", function(){
        beforeEach(function(done){
            Account.findByToken(token, function(err, response){
                user = response;
                console.log(response);
                done();
            });
        });

        it("should have all lists and inventory id", function (done){
            expect(user.lists.length).toBeGreaterThan(0);
            expect(user.inventory_id).toBeGreaterThan(0);
            done();
        });
    });

    describe("logging in", function(){
        beforeEach(function(done){
            Account.login(credentials, function(err, response){
                user = response.user;
                done();
            });
        });

        it('the user should include their lists', function(done){
            console.log(user);
            expect(user.lists.length).toBeGreaterThan(0);
            done();
        });
    });

});
