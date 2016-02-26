# PantryApp
_An inventory manager for food, spices, groceries, and other kitchen items._

## Inspiration
My wife and I cook together a lot and are even starting [a food blog](http://twowoodenspoons.nyc).  Since we cook together a lot, we also go grocery shopping often, pretty much every week.  After doing this for years together, we've melding our styles of cooking and shopping, but there is still one thing that always trips us up.  We never know what's in the refrigerator at home!

It was my wife's idea year's ago to make an app that helps you manage what's in your refrigerator and pantry no matter where you are.  We started using the iOS Reminders app for grocery lists, but that doesn't help when you at the store wondering if there's cinnamon at home.

As I was making my way through my courses at General Assembly, I started to realize as my skill set grew larger, that I had to knowledge to make the app that we needed.

Here it is for everyone to use.

## Features
- The user starts off with an Inventory to add all owned food items to.
- User can create separate grocery lists for different purposes ('Whole Foods', 'Thanksgiving', 'Work Snacks').
- Items can be linked USDA Nutrient Database information to access nutrition for a specific food.
- Users can invite a team member with a team specific link.
- Users on a team can have private lists and team-wide lists. The inventory list is made team-wide when the team is created.
- Users can view the sum nutrition of all of their food items linked to the USDA Nutrition Database to gauge how well stocked their pantry is by the nutrient.


## Technologies
- AngularJS.
- Angular Material.
- Express
- PostgreSQL
- Grunt

## Testing
The Jasmine testing framework is being used for TDD tests of Account model behaviors and Nutrition Information queries.  Tests are driving future features and can be run with the command `jasmine`.

## Future Features and Plans
- Better UX cues to help the user notice functionality.
- Better organizing and viewing of foods in list, including
- Batch uploading of food items to Inventory.
- Delete/move one item from list.
    - Incorporate styling to show retrieved items before they're removed.
    - Incorporate live update on list screens for two people shopping at once.
- Tag foods by team/family member (ex. kids, Molly, etc.).
    - See Total Nutrition by tag.
- Compare Total Nutrition to Suggested Daily Value for more digestible data.
- Evaluate other/multiple nutrient database systems for better results.
- Evaluate ORMs to simplify queries.
- Incorporate item scanning with device camera.
