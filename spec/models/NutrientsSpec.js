describe("Nutrients", function(){
    var ListItem = require('../../models/listItem.js');
    var item = {
        created_at: "1455450417552",
        id: 60,
        list_id: 1,
        name: "chicken",
        ndb_no: "~05001~",
        notes: null,
        qty: "1",
        status: "In inventory.",
        updated_at: "1455450417552"
    };
    var badItem = {
        created_at: "1455450417552",
        id: 61,
        list_id: 1,
        name: "chicken sticks",
        ndb_no: null,
        notes: null,
        qty: "1",
        status: "In inventory.",
        updated_at: "1455450417552"
    };
    var itemArr = [badItem, item,item,item,item,item];

    describe("for one item", function(){
        var info;
        beforeAll(function(done){
            ListItem.nutrition(item.ndb_no, function(err, response){
                info = response;
                done();
            });
        });

        it("should return nutrient information", function(done){
            expect(info).toBeTruthy();
            done();
        });
    });

    describe("for an array of items", function(){
        beforeAll(function(done){
            ListItem.nutrition(itemArr, function(err, response){
                info = response;
                done();
            });
        });

        it("should return the nutrients list and a sum", function(done){
            expect(info.totals).toBeTruthy();
            expect(info.list).toBeTruthy();
            expect(info.list[0].rows[0].nutr_val * 5) //the number of duplicated good pieces of data
            .toBeCloseTo(info.totals[ info.list[0].rows[0].nutrdesc ].nutr_val);
            done();
        });

        it('should skip over items without nutrient info', function(done){
            expect(info.totals).toBeTruthy();
            done();
        });
    });
});
