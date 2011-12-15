Playalong
=========

Version 0 (alpha)


## About ##

Playing at open mic nights with my guitar, I often wished I had a little app on 
my phone that would automatically show the chords and lyrics of the song I was 
playing, particularly when it was a song I didn't know very well, or had only 
learned to play recently. So I wrote one…

Playalong is a little web app that helps you play the chords and sing the 
lyrics of songs as you are playing the song. It works a bit like karaoke: 
it counts you in, then automatically shows you the lyrics and chords when you 
should be playing and singing them. As it turns out, it's also really handy for 
learning how to play a song in the first place!

It's built in JavaScript with a little help from jQuery and optimised for 
mobile Safari, but it should work in any browser.


## Usage ##

1. Load in a chord file. It's copy-and-paste in only right now, I'm afraid.
2. Hit play.
3. The metronome counts one measure, showing you the start of the song faded 
   out, and then starts. The currently line of the song is shown in the middle 
   of the screen, and the next line creeps in from the right a little, just to 
   give you a clue about the next chord to play or word to sing.

You can also adjust the tempo of the song by clicking/tapping the area where 
the tempo is displayed and typing in the tempo, or by clicking/tapping in the 
tempo you want using the 'tap' button down the bottom right.


## Known Issues ##

 * The way that the lines of songs move across the screen is a little jarring 
   at the moment. There's something better on the way.


## Chord Files ##

The files used by Playalong are based on the 
[Guitar chord file format](http://en.wikipedia.org/wiki/Guitar_chord_file_format).

Essentially:

 * Songs are marked up with "directives" which give details of the song (more 
   below) and help define song sections.
 * Choruses are marked up with the `{start_of_chorus}` and `{end_of_chorus}` 
   section directives.
 * Anything that is not marked up is considered a verse.
 * **Important:** So that Playalong knows how long each measure is, one line in 
   the file must represent one measure of the song.
 * Additional section directives are supported by Playalong:
    * `{start_of_bridge}` and` {end_of_bridge}`
    * `{start_of_intro}` and `{end_of_intro}`

In future, Playalong may also support 
[ASCII tab](http://en.wikipedia.org/wiki/ASCII_tab) and 
[LRC files](http://www.bemanistyle.com/forum/f93/how-create-properly-running-lrc-file-stepmania-10107/).


### Setting Song Details (Meta) ###

You can define various details of a song using meta directives. Typically, 
these are written at the top of chord files, but they don't have to be. Here's 
a full list of song meta you can set…

Required:

 * `{title:Song Title}`
 * `{artist:Who The Song Is By}`
 * `{copyright:Who owns the copyright?}`

Optional:

 * `{album:What Album It's Off}`
 * `{subtitle:If there's some subtext to the album name perhaps}`
 * `{tempo:BPM}`
 * `{meter:4/4}`
 * `{notes:Extra info about this chord file.}`
 * `{author:Who Figured Out How To Play This Song}`
 * `{source:Where this chord file or lyrics were found, e.g. a link to a site.}`

Notes:

 * Details of copyright are required to help protect you and me from the legal 
   implications of using representations of copyrighted material (see Copyright 
   Issues below). The copyright owner will typically be the person or group who 
   wrote the song. If the song is [Traditional](http://en.wikipedia.org/wiki/Traditional_music)
   use `{artist:Traditional}` and `{copyright:exempt}`.
 * You can specify multiple sources using a `{source:whatever}` for each 
   source. Sources do not have to be a link.


## Copyright Issues ##

You may have heard news in 2006 of guitar tab sites receiving "take down" 
orders for infringing songwriters' copyright (see 
[Discord over guitar sites](http://news.bbc.co.uk/1/hi/magazine/5305520.stm)). 
Sadly, this meant the death of [OLGA](http://www.olga.net/), the oldest online 
library of guitar and bass tab, which I remember using to learn how to play my 
favourite songs as far back as 1996.

As I'm slightly worried about similar action being taken towards Playalong, 
this app comes packaged with examples that are free/exempt from copyright. 

**Important:** Playalong _requires_ chord files to include copyright details as 
a meta directive. If this is missing, Playalong will not load the file. This is 
to help protect you and me from the legal implications of using other people's 
music and lyrics. If you write a chord file, please ensure you include 
copyright details as a meta directive, e.g. `{copyright:Barry Manilow}`. If you 
**publish** the music or lyrics for a song that is copyright material, **you 
can get into trouble!** _I accept no responsibility if this happens._ I don't 
see why you shouldn't be able to share such files privately with your friends, 
since you're effectively teaching a friend how to play a favourite song. 
However, I am not a lawyer. If in doubt, don't.

If you write a chord file for one of your own songs, it's up to you whether or 
not you publish it. If you want to publish one of your songs and you don't mind 
it being freely distributable and free from copyright, I suggest you put 
something like `{copyright:free}` in your chord file. If the song is 
Traditional, put `{artist:Traditional}` and `{copyright:exempt}`.


## Interesting or Useful Resources ##

 * [HTML5 Guitar Tab Player with the Firefox 4 Audio Data API](http://hacks.mozilla.org/2011/01/html5guitar/)
 * [VexFlow: Music Engraving in JavaScript and HTML5](http://vexflow.com/)


## Credits ##

Playalong code by [Jon Gibbins](http://dotjay.co.uk/).

Icon designed by [Dirceu Veiga](http://www.fasticon.com/) and used under a 
Freeware Non-commercial license.


