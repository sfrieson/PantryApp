describe("Account", function(){
    var Account = require('../../models/account.js');
    var userObj = {
        username: "Test User",
        password: "test123"
    };
    var user;

    describe("creating a new user", function(){
        beforeEach(function(done){
            Account.new(userObj, function(err, response){
                user = response;
                console.log(response);
                done();
            });
        });
        afterEach(function(done){
            Account.delete(user.id, function(){
                done();
            });
        });

        it("should have an id, username, and password", function(done) {
            expect(user.id).toBeGreaterThan(0);
            expect(user.name).toBe("Test User");
            expect(user.passwordhash).toBeTruthy();
            expect(user.inventory_id).toBeGreaterThan(0);
            done();
        });

        it("should have a hashed password", function(done){
            expect(userObj.password).not.toEqual(user.passwordhash);
            done();
        });

    });

});
