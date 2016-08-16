Final project for Thinkful's node.js unit.

View your team's upcoming games.

Managers can log in and post upcoming games. Users are managed as mongoose objects and saved in mongoDB. Passwords hashed with passport.js strategy. 

Date and times are chosen from pikaday and jQuery timepicker plugins.

Location is sent to google maps to generate a static map of next game's location. Clicking on the map takes user to a map with directions to next game.