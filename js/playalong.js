/*jslint browser: true, white: false, plusplus: false */
/*global alert console window $ */

// Dependencies:
// jQuery

var Playalong = Playalong || {};

/**
 * Playalong.Config
 * Configuration.
 */
Playalong.Config = {
	meter: '4/4',
	tempo: 90
};

/**
 * Playalong.env
 * Environment.
 */
Playalong.Env = {
	iOS: !!navigator.userAgent.match(/iPad|iPhone|iPod/i),
	iPhone: !!navigator.userAgent.match(/iPhone/i),
	fullscreen: !!window.navigator.standalone
};

/**
 * Playalong.log
 * Logs for debugging.
 */
Playalong.log = function(m) {
	console.log(m);
};

/**
 * Playalong.Core
 * Where the magic kicks off.
 */
Playalong.Core = (function() {
	var config = {
			displayId: "main",
			infoId: "song-info",
			titleId: "song-title"
		},
		display,
		meter,
		player,
		song,
		source,
		tempo,
		tempoPad;

	function getMeter() {
		return meter;
	}

	function getMetronome() {
		return meter.getMetronome();
	}

	function getSong() {
		return song ? {
			meter: song.getMeter(),
			song: song,
			tempo: song.getTempo()
		} : false;
	}

	function getTempo() {
		return tempo;
	}

	function load(s) {
		var c = config,
			html = [],
			i,
			m,
			songInfo,
			songInfoClosed,
			songMeta,
			songTitle,
			songTitleToggle,
			sources = '',
			t;

		song = s;
		songMeta = s.getMeta();

		// Update meter and tempo
		m = songMeta.meter;
		if (m) {
			meter.change(m);
		}
		t = songMeta.tempo;
		if (t) {
			tempo.change(t);
		}

		// Build song info HTML
		// TODO - unhook from jQuery
		html.push('<h2 id="' + c.titleId + '">' + songMeta.title + ' <a href="' + c.infoId + '-list"><b>+</b><span> info</span></a></h2>');
		html.push('<dl id="' + c.infoId + '-list">');
		html.push('<dt>Artist</dt><dd>' + songMeta.artist + '</dd>');
		html.push('<dt>Copyright</dt><dd>' + songMeta.copyright + '</dd>');
		if (songMeta.album) {
			html.push('<dt>Album</dt><dd>' + songMeta.album + '</dd>');
		}
		if (songMeta.subtitle) {
			html.push('<dt>Subtitle</dt><dd>' + songMeta.subtitle + '</dd>');
		}
		if (songMeta.notes) {
			html.push('<dt>Notes</dt><dd>' + songMeta.notes + '</dd>');
		}
		if (songMeta.author) {
			html.push('<dt>Author</dt><dd>' + songMeta.author + '</dd>');
		}
		if (songMeta.source) {
			i = songMeta.source.length;
			if (i === 1) {
				html.push('<dt>Source</dt><dd>' + songMeta.source[0] + '</dd>');
			}
			else {
				while (i--) {
					sources = sources + "<li>" + songMeta.source[i] + "</li>";
				}
				html.push('<dt>Sources</dt><dd><ul>' + sources + '</ul></dd>');
			}
		}
		html.push('</dl>');

		// Update DOM with song info
		document.getElementById(c.infoId).innerHTML = html.join('');
		songInfo = document.getElementById(c.infoId + '-list');
		songInfo.style.display = "none";
		songInfoClosed = true;

		// DOM references
		songTitle = document.getElementById(c.titleId);
		songTitleToggle = songTitle.lastChild.firstChild;

		// Events
		Playalong.Event.bind(songTitle, "click", function() {
			if (songInfoClosed) {
				$(songInfo).slideDown();
				songTitleToggle.innerHTML = "–";
				songInfoClosed = false;
			}
			else {
				$(songInfo).slideUp();
				songTitleToggle.innerHTML = "+";
				songInfoClosed = true;
			}
			return false;
		});

		player.load(s);

		// Show the play button now we have something to play!
		$("#play").show();
	}

	function init() {
		display = new Playalong.Display();
		display.init();

		meter = new Playalong.Meter();
		tempo = new Playalong.Tempo();
		tempoPad = new Playalong.TempoPad();

		meter.init();
		tempo.init();
		tempoPad.init(tempo);

		source = new Playalong.Source();
		player = new Playalong.Player();
		source.init();
		player.init();
	}

	function shutdown() {
		player.stop();

		//display.destroy();
		//meter.destroy();
		//player.destroy();
		//source.destroy();
		//tempo.destroy();
		//tempoPad.destroy();

		display = null;
		meter = null;
		player = null;
		source = null;
		tempo = null;
		tempoPad = null;
	}

	return {
		init: init,
		getMeter: getMeter,
		getMetronome: getMetronome,
		getSong: getSong,
		getTempo: getTempo,
		load: load,
		shutdown: shutdown
	};
}());

/**
 * Playalong.Event
 * Events helper.
 */
Playalong.Event = (function() {
	return {
		bind: function(el, type, func) {
			$(el).bind(type, func);
		},
		throttle: function(method, context, timeout) {
			if (!timeout) {
				timeout = 100;
			}
			clearTimeout(method.timerRef);
			method.timerRef = setTimeout(function() {
				method.call(context);
			}, timeout);
		},
		unbind: function(el, type) {
			$(el).unbind(type);
		}
	};
}());

/**
 * Playalong.String
 * String helper.
 */
Playalong.String = (function() {
	return {
		contains: function(str, foo) {
			return ( str.indexOf(foo) !== -1 );
		},
		endsWith: function(str, foo) {
			return ( str.indexOf(foo, str.length - foo.length) !== -1 );
		},
		isURL: function(str) {
			return ( str.search(/^https?:\/\//) !== -1 );
		},
		startsWith: function(str, foo) {
			return ( str.slice(0, foo.length) === foo );
		},
		trim: function(str) {
			return $.trim(str);
		}
	};
}());

/**
 * Playalong.Markup
 * Markup helper.
 */
Playalong.Markup = (function() {
	return {
		paragraphize: function(text) {
			var html = text.replace(/\n+/g, "\n").replace(/\n/g, "</p>\n<p>");
			return (html && html !== '') ? '<p>' + html + '</p>' : '';
		},
		truncateURL: function(str, maxLen) {
			maxLen = maxLen || 32;

			var strLen = str.length;

			return '<a href="' + str + '">' + ( (strLen > maxLen) ? $.trim( str.substring(0, maxLen) ) + "&#8230;": str ) + '</a>';
		}
	};
}());

/**
 * Modules
 */

/**
 * Playalong.ChordParser
 * Parses text based roughly on the guitar chord file format:
 * http://en.wikipedia.org/wiki/Guitar_chord_file_format
 */
Playalong.ChordParser = function() {
	function isDirective(str) {
		var string = Playalong.String;

		return ( string.startsWith(str, "{") && string.endsWith(str, "}") );
	}

	function parse(source) {
		var directives = {},
			fileLines = source.split("\n"),
			i,
			inBridge,
			inChorus,
			inIntro,
			inVerse,
			l,
			len,
			markup = Playalong.Markup,
			meta = {},
			metaName,
			metaValue,
			pos,
			song,
			songLines = [],
			string = Playalong.String,
			trim = string.trim;

		songLines.push('<song>');

		for (i = 0, len = fileLines.length; i < len; i++) {
			l = trim(fileLines[i]);

			if (l.length) {
				if (isDirective(l)) {
					// Strip curly braces
					l = l.substr(1, l.length - 2);

					// Find position of the first colon
					pos = l.indexOf(":");

					// If there's a colon, directive is meta data
					if (pos !== -1) {
						metaName = l.substr(0, pos);
						metaValue = l.substr(pos + 1);

						switch (metaName) {
						case "album":
						case "artist":
						case "author":
						case "copyright":
						case "meter":
						case "subtitle":
						case "title":
							meta[metaName] = metaValue;
							break;
						case "notes":
							meta[metaName] = markup.paragraphize(metaValue);
							break;
						case "source":
							if (!meta[metaName]) {
								meta[metaName] = [];
							}
							if (string.isURL(metaValue)) {
								meta[metaName].push( Playalong.Markup.truncateURL(metaValue) );
							}
							else {
								meta[metaName].push(metaValue);
							}
							break;
						case "tempo":
							meta[metaName] = parseInt(metaValue, 10);
							break;
						}
					}
					else {
						// May indicate a song section
						switch (l) {
						case "start_of_chorus":
							songLines.push("<chorus>");
							inChorus = true;
							break;
						case "end_of_chorus":
							songLines.push("</chorus>");
							inChorus = false;
							break;
						case "start_of_bridge":
							songLines.push("<bridge>");
							inBridge = true;
							break;
						case "end_of_bridge":
							songLines.push("</bridge>");
							inBridge = false;
							break;
						case "start_of_intro":
							songLines.push("<intro>");
							inIntro = true;
							break;
						case "end_of_intro":
							songLines.push("</intro>");
							inIntro = false;
							break;
						}
					}
				}
				else {
					// Is a verse line
					if (!inVerse && !inChorus && !inBridge && !inIntro) {
						songLines.push("<verse>");
						inVerse = true;
					}

					l = l.replace(/\[/g, "<b>").replace(/\]/g, "</b>");

					songLines.push(l);
				}
			}
			else {
				if (inVerse) {
					songLines.push("</verse>");
					inVerse = false;
				}
				else if (inChorus) {
					songLines.push("</chorus>");
					inChorus = false;
				}
				else if (inBridge) {
					songLines.push("</bridge>");
					inBridge = false;
				}
				else if (inIntro) {
					songLines.push("</intro>");
					inIntro = false;
				}
			}
		}
		if (inVerse) {
			songLines.push("</verse>");
		}
		songLines.push('</song>');

		// TODO - Check for required meta
		if (!meta.title) {
			alert("Oops! The song has no title.");
		}
		else if (!meta.artist) {
			alert("Oops! The song has no artist.");
		}
		else if (!meta.copyright) {
			alert("Oops! The song has no copyright details.");
		}
		else if (!songLines.length) {
			alert("Oops! The song has no lines!");
		}
		else {
			song = new Playalong.Song();
			song.init(meta, songLines);
		}

		return song || false;
	}

	return {
		parse: parse
	};
};

/**
 * Playalong.Display
 * Handles interactions with the general display.
 */
Playalong.Display = function() {
	var body = document.getElementsByTagName("body")[0],
		env = Playalong.Env;

	function ensureFullscreen() {
		var lastElement;

		// Emulate fullscreen in Mobile Safari, unless already fullscreen.
		if (!env.fullscreen && env.iOS) {
			// Ensure page has extra height so that the address bar can slide
			// off the top of the screen
			lastElement = body.lastChild;
			while (lastElement && lastElement.nodeType !== 1) {
				lastElement = lastElement.previousSibling;
			}
			if (lastElement) {
				lastElement.style.marginBottom = "-60px";
			}

			// Hide the address bar
			// via http://davidwalsh.name/hide-address-bar
			setTimeout(function() {
				window.scrollTo(0, 1);
			}, 0);
		}
	}

	function init() {
		// Detect orientationchange support, falling back to resize event.
		// via http://stackoverflow.com/questions/1649086/detect-rotation-of-android-phone-in-the-browser-with-javascript
		var supportsOrientationChange = "onorientationchange" in window,
			orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

		Playalong.Event.bind(window, orientationEvent, ensureFullscreen);

		ensureFullscreen();
	}

	return {
		init: init
	};
};

/**
 * Playalong.Meter
 * Displays the current meter, and allows a user to edit it by showing a form
 * when clicked.
 */
Playalong.Meter = function() {
	var config = {
			displayId: "meter",
			formId: "meter-form",
			metronomeId: "metronome",
			newId: "meter-new",
			valueId: "meter-value"
		},
		beatsPerMeasure,
		display,
		form,
		input,
		meter = Playalong.Config.meter,
		metronomeElements,
		msPerBeat,
		msPerMeasure,
		updateMetronome,
		value;

	function change(m) {
		meter = m;

		Playalong.log( "Meter: " + m );

		input.value = m;
		value.innerHTML = m;

		updateMetronome();
	}

	function editStart() {
		form.style.display = "block";
		input.select();
	}

	function getMeter() {
		return meter;
	}

	function getMetronome() {
		return {
			beatsPerMeasure: beatsPerMeasure,
			elements: metronomeElements,
			msPerBeat: msPerBeat,
			msPerMeasure: msPerMeasure
		};
	}

	function onSubmit() {
		// Get new meter
		change(input.value);

		form.style.display = "none";

		return false;
	}

	updateMetronome = function() {
		var beatElements = [],
			core = Playalong.Core,
			i,
			m,
			mainBeatEveryXBeats,
			mainBeats = [],
			mainBeatsPerMeasure,
			meter,
			meterDenominator,
			metronomeElement,
			metronomeMarkup = [],
			t,
			tempo;

		// The tempo and meter we actually play should be whatever the user has 
		// set, which is not necessarily the song's real tempo and meter.
		m = core.getMeter();
		meter = m.getMeter();
		t = core.getTempo();
		tempo = t.getTempo();

		// Calculate number of milliseconds per beat, given the meter and tempo.
		i = meter.split('/');
		beatsPerMeasure = +i[0];
		meterDenominator = +i[1];

		// Calculate main beat positions.
		mainBeatsPerMeasure = meterDenominator / 4;
		mainBeatEveryXBeats = beatsPerMeasure / mainBeatsPerMeasure;
		for (i = 1; i <= beatsPerMeasure; i = i + mainBeatEveryXBeats) {
			mainBeats.push(i);
		}

		// Calculate number of milliseconds per beat, given the meter and tempo.
		msPerBeat = (60000 / tempo) / mainBeatsPerMeasure;
		msPerMeasure = msPerBeat * beatsPerMeasure;

		// Build metronome HTML and add to DOM
		metronomeElement = document.getElementById(config.metronomeId);
		for (i = 1; i <= beatsPerMeasure; i++) {
			metronomeMarkup.push('<div' + ($.inArray(i, mainBeats) > -1 ? ' class="main"' : '') + ' id="beat-' + i + '"></div>');
		}
		metronomeElement.innerHTML = metronomeMarkup.join('');

		// DOM references
		for (i = 1; i <= beatsPerMeasure; i++) {
			beatElements.push( document.getElementById("beat-" + i) );
		}
		metronomeElements = beatElements;
	};

	function init() {
		var bind = Playalong.Event.bind,
			c = config,
			f;

		display = document.getElementById(c.displayId);
		value = document.getElementById(c.valueId);

		f = document.getElementById(c.formId);
		bind(f, "submit", onSubmit);
		form = f;

		input = document.getElementById(c.newId);
		if (Playalong.Env.iOS) {
			input.type = "number";
			//input.pattern = "\d*";
		}

		change(meter);

		bind(display, "click", editStart);
	}

	return {
		init: init,
		change: change,
		getMeter: getMeter,
		getMetronome: getMetronome
	};
};

/**
 * Playalong.Player
 * Plays the current song, automatically displaying the chords and lyrics in
 * time with the song's meter and tempo.
 */
Playalong.Player = function() {
	var config = {
			countIn: 1,
			formId: "control-form",
			songLineId: "song-line"
		},
		currentLine,
		form,
		lineOffset = 0,
		loaded = false,
		metronome,
		metronomeFirst,
		self = this,
		song,
		songLineDisplay,
		started = false,
		timer;

	function doBeat(beat) {
		var e,
			els,
			i,
			line,
			m = metronome,
			msPerMeasure,
			n,
			offset,
			s,
			w;

		timer = setTimeout(function() {
			doBeat( (beat === m.beatsPerMeasure) ? 1 : beat + 1 );
		}, m.msPerBeat);

		s = song;

		if (beat === 1) {
			n = currentLine;

			// Light the first beat only once, since it's always lit.
			if (metronomeFirst) {
				e = m.elements[beat - 1];
				e.className = (e.className === 'main') ? 'main-on' : 'on';
				metronomeFirst = false;
			}
			else {
				// Clear classes from all beat indicators except the first
				els = m.elements;
				for (i = els.length - 1; i > 0; i--) {
					e = els[i];
					e.className = (e.className === 'main-on') ? 'main' : '';
				}
			}

			if (n > 0) {
				if (n > 1) {
					document.getElementById('line-' + (n - 1)).className = '';
				}

				line = document.getElementById('line-' + n);

				if (line) {
					currentLine = n + 1;
					line.className = 'current';

					msPerMeasure = m.msPerMeasure;

					offset = lineOffset - line.offsetWidth;
					$(songLineDisplay).stop().animate({ 'margin-left': Math.ceil( (document.getElementsByTagName('body')[0].offsetWidth / 2) + offset) + 'px' }, msPerMeasure);
					lineOffset = offset;
				}
				else {
					self.stop();
				}
			}
			else {
				currentLine = n + 1;
			}
		}
		else {
			e = m.elements[beat - 1];
			e.className = (e.className === 'main') ? 'main-on' : 'on';
		}
	}

	function play() {
		var c = config,
			core = Playalong.Core,
			countIn = c.countIn,
			m,
			s;

		Playalong.log("Play!");

		$("#play").hide();
		$("#stop").show();

		// Get details of the song
		s = core.getSong();
		song = s.song;

		// Get metronome
		metronome = core.getMetronome();

		// Reset song cursor
		currentLine = 1 - countIn;

		// Reset song line position
		lineOffset = 0;
		$(songLineDisplay).animate({ 'margin-left': '0px' }, (countIn === 0) ? 0 : 250);

		// Start
		metronomeFirst = true;
		doBeat(1);
		started = true;

		return false;
	}

	function recenter() {
		var body = document.getElementsByTagName('body')[0],
			firstLine = document.getElementById('line-1'),
			//padding = (body.offsetWidth / 2) - lineOffset;
			padding = (body.offsetWidth / 2);

		firstLine.style.paddingLeft = Math.ceil(padding)  + 'px';
	}

	this.load = function(s) {
		// Build song lines HTML
		var html = [],
			line,
			lineNumber = 1;

		do {
			line = s.getNextLine();

			switch (line) {
			case "</verse>":
			case "</chorus>":
			case "</bridge>":
			case "</intro>":
				html.push("</div>\n");
				break;
			case "<verse>":
				html.push('<div class="verse">');
				break;
			case "<chorus>":
				html.push('<div class="chorus">');
				break;
			case "<bridge>":
				html.push('<div class="bridge">');
				break;
			case "<intro>":
				html.push('<div class="intro">');
				break;
			case "<song>":
				break;
			case "</song>":
				line = null;
				break;
			default:
				html.push('<span id="line-' + lineNumber + '">' + line + '</span> ');
				lineNumber = lineNumber + 1;
				break;
			}
		}
		while (line);

		songLineDisplay.innerHTML = html.join('');

		recenter();

		loaded = true;
	};

	this.stop = function() {
		var i,
			m,
			tmp;

		if (started) {
			clearTimeout(timer);
			started = false;

			$(songLineDisplay).stop();

			Playalong.log("Stop!");

			$("#play").show();
			$("#stop").hide();

			// Clear classes from all beat indicators
			m = metronome.elements;
			for (i = m.length - 1; i >= 0; i--) {
				tmp = m[i];
				switch (tmp.className) {
				case "on":
					tmp.className = '';
					break;
				case "main-on":
					tmp.className = 'main';
					break;
				}
			}
		}

		return false;
	};

	this.init = function() {
		var bind,
			c = config,
			evt = Playalong.Event,
			f = document.getElementById(c.formId);

		bind = evt.bind;

		// Set up song line display
		songLineDisplay = document.getElementById(c.songLineId);

		// Window resize listener (throttled)
		bind(window, 'resize', function() {
			if (loaded) {
				evt.throttle(recenter, this, 25);
			}
		});

		//bind(f, "submit", play);
		bind("#play", "click", play);
		bind("#stop", "click", self.stop);

		form = f;
	};

	return this;
};

/**
 * Playalong.Song
 * Models a song.
 */
Playalong.Song = function() {
	var currentLine,
		meta,
		lines;

	function init(m, l) {
		meta = m;
		lines = l;

		currentLine = 0;
	}

	function getIncomingLine(offset) {
		offset = offset || 0;

		return lines[currentLine + offset];
	}

	function getMeta() {
		return meta;
	}

	function getMeter() {
		return meta.meter;
	}

	function getNextLine() {
		var line = lines[currentLine];

		currentLine = currentLine + 1;

		return line;
	}

	function getTempo() {
		return meta.tempo;
	}

	return {
		init: init,
		getIncomingLine: getIncomingLine,
		getMeta: getMeta,
		getMeter: getMeter,
		getNextLine: getNextLine,
		getTempo: getTempo
	};
};

/**
 * Playalong.Source
 * Handles interactions with the source form and loads songs into Playalong.
 */
Playalong.Source = function() {
	var config = {
			displayId: "source",
			formId: "source-form",
			textareaId: "source-paste"
		},
		display,
		form,
		textarea,
		textareaVisible;

	function onSubmit() {
		var parser,
			song,
			source,
			t = textarea;

		if (textareaVisible) {
			t.style.display = "none";
			textareaVisible = false;

			source = t.value;

			// Parse the text for song data
			parser = new Playalong.ChordParser();
			song = parser.parse(source);

			if (song) {
				Playalong.Core.load(song);
			}
			else {
				alert("Oops! That song file couldn't be read.");
			}
		}
		else {
			t.style.display = "block";
			textareaVisible = true;
		}

		return false;
	}

	function init() {
		var c = config,
			f,
			t;
			//w = window;

		// Check support
		//if (!w.File || !w.FileReader || !w.FileList || !w.Blob) {
		//	alert('The File APIs are not fully supported in this browser.');
		//	return false;
		//}

		display = document.getElementById(c.displayId);

		f = document.getElementById(c.formId);
		Playalong.Event.bind("#source-form *", "click", function() { return false; });
		Playalong.Event.bind(f, "submit", onSubmit);
		Playalong.Event.bind("#source-form input", "click", onSubmit);
		form = f;

		t = document.getElementById(c.textareaId);
		t.style.display = "none";
		textareaVisible = false;
		textarea = t;

		//return true;
	}

	return {
		init: init
	};
};

/**
 * Playalong.Tempo
 * Displays the current tempo, and allows a user to edit it by showing a form
 * when clicked.
 */
Playalong.Tempo = function() {
	var config = {
			displayId: "tempo",
			formId: "tempo-form",
			newId: "tempo-new",
			valueId: "tempo-value"
		},
		change,
		core,
		display,
		form,
		getTimestamp,
		input,
		lastTimestamp,
		tempo = Playalong.Config.tempo,
		value;

	change = function(t) {
		tempo = t;

		Playalong.log( "Tempo: " + t );

		input.value = t;
		value.innerHTML = t;
	};

	/**
	 * Returns a timestamp in milliseconds
	 */
	getTimestamp = function() {
		return Math.round( new Date().getTime() );
	};

	function calculate() {
		var tDiff,
			tLast = lastTimestamp,
			tNow;

		tNow = getTimestamp();
		lastTimestamp = tNow;

		if (tLast) {
			tDiff = tNow - tLast;

			Playalong.log( "Milliseconds since last tap: " + tDiff );

			// tempo = taps per minute
			change( Math.round( ( 60 * 1000 ) / tDiff ) );
		}
	}

	function editStart() {
		$(form).show();
		input.select();
	}

	function getTempo() {
		return tempo;
	}

	function onSubmit() {
		// Get new tempo
		var s,
			t = +input.value;

		if (!t) {
			s = Playalong.Core.getSong();
			t = s ? s.tempo : Playalong.Config.tempo;
		}

		change( t );

		$(form).hide();

		return false;
	}

	function init() {
		var bind = Playalong.Event.bind,
			c = config,
			f;

		display = document.getElementById(c.displayId);
		value = document.getElementById(c.valueId);

		f = document.getElementById(c.formId);
		bind(f, "submit", onSubmit);
		form = f;

		input = document.getElementById(c.newId);

		change(tempo);

		bind(display, "click", editStart);
	}

	return {
		init: init,
		calculate: calculate,
		change: change,
		getTempo: getTempo
	};
};

/**
 * Playalong.TempoPad
 * UI element that allows a user to tap/click the desired tempo.
 */
Playalong.TempoPad = function() {
	var config = {
			tempoPadId: "tempo-pad"
		};

	function init(tempo) {
		var isDrag,
			isTap,
			tempoPad = document.getElementById(config.tempoPadId);

		if (Playalong.Env.iOS) {
			isDrag = false;
			isTap = false;

			tempoPad.ontouchstart = function(e) {
				if (!isDrag) {
					if (e.changedTouches.length === 1) {
						isDrag = false;
						isTap = true;
						//var touch = e.changedTouches[0];
					}
				}
			};
			tempoPad.ontouchmove = function(e) {
				if (!isDrag){
					if (e.changedTouches.length === 1) {
						isDrag = true;
						isTap = false;
						//var touch = e.changedTouches[0];
					}
				}
			};
			tempoPad.ontouchend = function(e) {
				if (!e.targetTouches.length) {
		
					if (isDrag) {
						Playalong.log( "Drag!" );
						isDrag = false;
					}
		
					if (isTap) {
						Playalong.log( "Tap!" );
						tempo.calculate();
						isTap = false;
					}
		
				}
			};
		}
		else {
			Playalong.Event.bind(tempoPad, "click", function(e) {
				Playalong.log( "Click!" );
				tempo.calculate();
			});
		}
	}

	return {
		init: init
	};
};

/**
 * Kick off!
 */
$(document).ready(Playalong.Core.init);