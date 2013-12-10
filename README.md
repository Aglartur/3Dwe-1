Master
======
Contributors: Aibek Sarbayev, Peng Gao, Sean Noran, Wei Lin, Swetal Bhatt
Donate link: UNAVAILABLE
Tags: 3D, webGL, threejs, webRTC, file storage
Current version: In development
Compatability: Does not support IE

== Description ==

3Dwe is an integrative file storage application running on webGL 3D. The user is immersed in a room containing various
media interfaces such as a television set for viewing videos and recording web video, a photo album for viewing picture
files, a book for reading pdfs and a jukebox for listening to music.

== Setup ==

If the program does not run initially, carefully follow these instructions:
    1. Make sure your web browser is compatible with our application. It is currently supported by Chrome and Firefox.
       If you are using either of those web browsers and the application does not run, consider updating to your browser's
       latest version. The application should run on mobile devices; however, the layout is not intended to be consistent
       with most mobile phone screen sizes and resolutions. If you are using Internet Explorer, please reconsider for the
       sake of humanity.
    2. Make sure pgAdmin is installed on your local machine. If you are unable to register a user with 3Dwe, copy the SQL
       queries in /db/db.sql and execute them in pgAdmin. This will create the empty database table required for login.
       In future versions, the database will be stored on a persistent server and the application will be running in http.

== Login ==

If you are not currently registered for 3Dwe, click on the icon in the top-right, then click SignUp. You should be
redirected to the registration page. Enter a valid email address, name and a password. Note that passwords are NOT
currently encrypted. They are stored as plaintext on a local database.

== Explorer Panel ==

Remember that button you pressed to register? Click it now and you will see a preliminary file explorer view, which will
display folders and files you uploaded. There are 4 main folders in your home directory:
    1. Music : .mp3
    2. PDFs : .pdf | .txt
    3. Photos : .jpg | .png
    4. Videos : .mp4 | .wmv | .MOV | .webm
However, feel free to create new directories to personalize your file system.

To upload files, simply click on the upload button. Most unsupported media file types can be uploaded. For example, the
user can upload a .gif file but it will not be displayed in the photo album or in the TV.

== Jukebox ==

Enjoy your favorite songs from a life-like 3D jukebox! Simply add them to the /Home/Music directory.

== TV ==

To play videos, click on a supported video file in the explorer panel. To record a video, click the record button on the
television set. Note that the buttons are only visible when you hover over the bottom of the screen.

== Photo Album ==

The photo album displays photos contained in the /Home/Photos directory.

==

== Frequently Asked Questions ==

= A question that someone might have =

An answer to that question.

= What about foo bar? =

Answer to foo bar dilemma.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 1.0 =
* A change since the previous version.
* Another change.

= 0.5 =
* List versions from most recent at top to oldest at bottom.

== Upgrade Notice ==

= 1.0 =
Upgrade notices describe the reason a user should upgrade.  No more than 300 characters.

= 0.5 =
This version fixes a security related bug.  Upgrade immediately.

== Arbitrary section ==

You may provide arbitrary sections, in the same format as the ones above.  This may be of use for extremely complicated
plugins where more information needs to be conveyed that doesn't fit into the categories of "description" or
"installation."  Arbitrary sections will be shown below the built-in sections outlined above.

== A brief Markdown Example ==

Ordered list:

1. Some feature
1. Another feature
1. Something else about the plugin

Unordered list:

* something
* something else
* third thing

Here's a link to [WordPress](http://wordpress.org/ "Your favorite software") and one to [Markdown's Syntax Documentation][markdown syntax].
Titles are optional, naturally.

[markdown syntax]: http://daringfireball.net/projects/markdown/syntax
            "Markdown is what the parser uses to process much of the readme file"

Markdown uses email style notation for blockquotes and I've been told:
> Asterisks for *emphasis*. Double it up  for **strong**.

`<?php code(); // goes in backticks ?>`