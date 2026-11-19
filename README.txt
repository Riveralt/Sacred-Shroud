THE SACRED SHROUD — installable web app

Put every file in this folder on any static web host (Netlify, GitHub Pages).
index.html must sit at the top level, next to the .js files and the icons folder.
Then open the site on your phone and choose "Add to Home Screen".

Editing the game: the story and stats live in data_core.js, data_world.js and data_story.js.
After you change any file, open sw.js and bump VERSION (shroud-v1 -> shroud-v2) so phones pick up the update.
