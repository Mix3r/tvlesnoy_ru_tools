/** 
old school
 **/ 

import System;
import System.IO;
import System.Object;
import System.Windows.Forms;
import Sony.Vegas;

try
{
 
	var FishRegion = FindRegion("Fish");
 	if (null == FishRegion) {
		FishRegion = new Region(Vegas.Transport.CursorPosition,Timecode.FromMilliseconds(5000),"Fish");
		Vegas.Project.Regions.Add(FishRegion);
	} else {
		var prevlength = Timecode.FromMilliseconds(0);
		var trackEnum = new Enumerator(Vegas.Project.Tracks);
		while (!trackEnum.atEnd()) {
			var track : Track = Track(trackEnum.item());
			var evntEnum = new Enumerator(track.Events);
			while (!evntEnum.atEnd()) {
				var evnt : TrackEvent = TrackEvent(evntEnum.item());
				if ((evnt.Start <= Vegas.Transport.CursorPosition) & ((evnt.End > Vegas.Transport.CursorPosition) || ((evnt.End == Vegas.Transport.CursorPosition) & (Vegas.SelectionStart+Vegas.SelectionLength == Vegas.Transport.CursorPosition)))          ) {    //  & (evnt.IsVideo())
					//evnt.Length = Timecode.FromMilliseconds(3000);
					//MessageBox.Show(evnt.Group, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
					if (FishRegion.Length == Timecode.FromMilliseconds(0)) {
						MessageBox.Show("Already OK!", "OK", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
					} else {
						var activeTake = evnt.ActiveTake;
						var mediaPath = activeTake.MediaPath;
						var media = Vegas.Project.MediaPool[mediaPath];
						//MessageBox.Show(mediaPath, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
						if ((Vegas.Transport.CursorPosition == Vegas.SelectionStart) || (Vegas.Transport.CursorPosition == Vegas.SelectionStart+Vegas.SelectionLength)) {
						} else {
							Vegas.SelectionLength = Timecode.FromMilliseconds(3000);
							Vegas.SelectionStart = Vegas.Transport.CursorPosition;
						}
						//FishRegion.Position = FishRegion.Position - prevlength;
						prevlength = Vegas.SelectionLength;
						if (evnt.IsAudio()) {
							var newEvent = new AudioEvent(FishRegion.Position, Vegas.SelectionLength);
						} else {
							var newEvent = new VideoEvent(FishRegion.Position, Vegas.SelectionLength);
						}
						track.Events.Add(newEvent);
						if (evnt.IsAudio()) {
							var take = new Take(media.Streams[1]);
						} else {
							var take = new Take(media.Streams[0]);
						}
						newEvent.Takes.Add(take);
						take.Offset = evnt.ActiveTake.Offset + (Vegas.SelectionStart-evnt.Start);

                                                if (evnt.IsAudio()) {
                                                        evnt.Split(Vegas.SelectionStart+Vegas.SelectionLength-evnt.Start);
						        if (Vegas.SelectionStart-evnt.Start <= Timecode.FromMilliseconds(0)) {
							        track.Events.Remove(evnt);
						        } else {
							        evnt.Length=Vegas.SelectionStart-evnt.Start;
						        }
                                                }
					}
					break;
				}
				evntEnum.moveNext();
			}
			trackEnum.moveNext();
		}
		// -------------------
		if (prevlength > Timecode.FromMilliseconds(0)) {
			if (FishRegion.Length-prevlength <= Timecode.FromMilliseconds(0)) {
				FishRegion.Length = prevlength;
				MessageBox.Show("OK!", "OK", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
				Vegas.Transport.CursorPosition = FishRegion.Position+FishRegion.Length;
			}
			FishRegion.Length = FishRegion.Length-prevlength;
			FishRegion.Position = FishRegion.Position+prevlength;
		}
		// -------------------------------
	}
}

catch (errorMsg)
{
	MessageBox.Show(errorMsg, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
}

function FindRegion(rgnName) : Region {
  var regionEnum = new Enumerator(Vegas.Project.Regions);
  while (!regionEnum.atEnd()) {
	var rgn : Region = Region(regionEnum.item());
	if (rgn.Label == rgnName) {
		return rgn;
	}
	regionEnum.moveNext();
  }
  return null;
}