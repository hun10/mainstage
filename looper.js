//-----------------------------------------------------------------------------
// Looper
//-----------------------------------------------------------------------------

var PluginParameters = [
  {
    name: "Loop Length",
    type: "lin",
    minValue: 1.0,
    maxValue: 32.0,
    numberOfSteps: 31,
    defaultValue: 1.0,
    unit: " bars"
  }
];

var NeedsTimingInfo = true;
var buffer = [];

function HandleMIDI(event) {
  if (event.send) {
	  var musicInfo = GetTimingInfo();

    if (musicInfo.playing) {
      buffer.push(event);
    } else {
      event.send();
    }
  }
}

//-----------------------------------------------------------------------------
var wasPlaying = false;

function ProcessMIDI() {
	var musicInfo = GetTimingInfo();
	
	if (wasPlaying && !musicInfo.playing) {
	buffer = [];
	MIDI.allNotesOff();
	}
	
	wasPlaying = musicInfo.playing;

  if (musicInfo.playing) {
    buffer.forEach(e => {
      if (e.beatPos < musicInfo.blockEndBeat) {
        e.send();
        e.beatPos += GetParameter("Loop Length") * musicInfo.meterNumerator;
      }
    });
  }
}
