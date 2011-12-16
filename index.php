<!DOCTYPE html>
<html>

<head>
<meta charset="utf-8" />
<title>Playalong</title>

<!--[if IE]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
<style>article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section { display: block; }</style>

<?php //if ($isIPhone) { ?>
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
<link rel="apple-touch-icon" href="touch-icon-72.png" />
<link rel="apple-touch-icon" sizes="72x72" href="touch-icon-72.png" />
<link rel="apple-touch-icon" sizes="114x114" href="touch-icon-114.png" />
<?php //} ?>

<link rel="icon" type="image/png" href="favicon.png" />
<link rel="shortcut icon" href="favicon.ico" />

<link rel="stylesheet" type="text/css" href="css/screen.css" />

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script type="text/javascript" src="js/playalong.js"></script>
</head>

<body>

<h1>Playalong</h1>

<form id="source-form" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
<div>
<textarea id="source-paste" rows="15" cols="100">
<?php include "songs/Jon Gibbins - Playalong.crd"; ?>
<?php //include "songs/Traditional - Scarborough Fair.crd"; ?>
</textarea>
<input id="source-load" type="submit" value="Load" />
</div>
</form>

<div id="infobar">
<dl>
<dt>Tempo</dt>
<dd id="tempo">
<span id="tempo-value"></span> BPM
<form id="tempo-form" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post"><div><input id="tempo-new" type="text" value="" size="3" maxlength="3" pattern="\d*" /><input class="button" type="submit" value="Done" /></div></form>
</dd>
<dt>Meter</dt>
<dd id="meter">
<span id="meter-value"></span>
<form id="meter-form" action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post"><div><input id="meter-new" type="text" value="" size="5" maxlength="5" /><input class="button" type="submit" value="Done" /></div></form>
</dd>
</dl>
<div id="metronome"></div>
</div>

<div id="main">

<div id="song-info"></div>

<div id="player"><div id="song-line"></div></div>

<div id="controls">
<form action="<?php echo $_SERVER['REQUEST_URI']; ?>" method="post">
<div>
<button id="play" name="play"><b>Play</b></button>
<button id="stop" name="stop"><b>Stop</b></button>
</div>
</form>
<div id="tempo-pad">Tap</div>
</div>

</div><?php // END #main ?>

</body>

</html>