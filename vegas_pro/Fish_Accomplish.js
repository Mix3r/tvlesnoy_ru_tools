/** 
clip cutter
 **/ 

import System;
import System.IO;
import System.Object;
import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;

try
{
        var FishName = "***";
        var FishRegion = FindRegion(FishName);
 	if (null == FishRegion) {
                if (Vegas.Transport.CursorPosition == Vegas.Transport.LoopRegionStart + Vegas.Transport.LoopRegionLength) {
                        Vegas.Transport.CursorPosition = Vegas.Transport.LoopRegionStart;
                } else if (Vegas.Transport.LoopRegionStart == Vegas.Transport.LoopRegionStart + Vegas.Transport.LoopRegionLength) {
                        Vegas.Transport.LoopRegionLength = Timecode.FromMilliseconds(3000);
                }
		FishRegion = new Region(Vegas.Transport.CursorPosition,Vegas.Transport.LoopRegionLength,FishName);
		Vegas.Project.Regions.Add(FishRegion);
	} else {
		var prevlength = Timecode.FromMilliseconds(0);
		var trackEnum = new Enumerator(Vegas.Project.Tracks);
                var FishGroup = null;
		while (!trackEnum.atEnd()) {
			var track : Track = Track(trackEnum.item());
			var evntEnum = new Enumerator(track.Events);
			while (!evntEnum.atEnd()) {
				var evnt : TrackEvent = TrackEvent(evntEnum.item());
				if ((evnt.Start <= Vegas.Transport.CursorPosition) & ((evnt.End > Vegas.Transport.CursorPosition) || ((evnt.End == Vegas.Transport.CursorPosition) & (Vegas.Transport.LoopRegionStart+Vegas.Transport.LoopRegionLength == Vegas.Transport.CursorPosition)))          ) {    //  & (evnt.IsVideo())

					//MessageBox.Show(evnt.Group, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
					if (FishRegion.Length == Timecode.FromMilliseconds(0)) {
						MessageBox.Show("Already OK!", "OK", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
					} else {
						if ((Vegas.Transport.CursorPosition == Vegas.Transport.LoopRegionStart) || (Vegas.Transport.CursorPosition == Vegas.Transport.LoopRegionStart+Vegas.Transport.LoopRegionLength)) {
						} else {
							Vegas.Transport.LoopRegionLength = Timecode.FromMilliseconds(3000);
							Vegas.Transport.LoopRegionStart = Vegas.Transport.CursorPosition;
						}
						//FishRegion.Position = FishRegion.Position - prevlength;
						prevlength = Vegas.Transport.LoopRegionLength;
						if (evnt.IsAudio()) {
							var newEvent = new AudioEvent(FishRegion.Position, Vegas.Transport.LoopRegionLength);
						} else {
							var newEvent = new VideoEvent(FishRegion.Position, Vegas.Transport.LoopRegionLength);
						}
						track.Events.Add(newEvent);
                                                if (null == FishGroup && null != Vegas.Project.Groups) {
                                                        FishGroup = new TrackEventGroup();
                                                        Vegas.Project.Groups.Add(FishGroup);
                                                }
                                                FishGroup.Add(newEvent);
                                                var streamcount = 0;
                                                if (null != evnt.ActiveTake) {
						        if (null != evnt.ActiveTake.MediaPath) {
                                                                if (null != evnt.ActiveTake.MediaPath) {
                                                                        var media = Vegas.Project.MediaPool[evnt.ActiveTake.MediaPath];
                                                                        if (null != media) {
                                                                                var streamsEnum = new Enumerator(media.Streams);
                                                                                while (!streamsEnum.atEnd()) {
                                                                                        streamcount = streamcount + 1;
                                                                                        if (media.Streams[streamcount-1].MediaType == MediaType.Audio) {
                                                                                            break;
                                                                                        }
                                                                                        streamsEnum.moveNext();
                                                                                }
                                                                        }
                                                                }
                                                        }
                                                }

                                                if (streamcount > 0) {
                                                        if (evnt.IsAudio()) {
                                                                var take = new Take(media.Streams[streamcount-1]);
						        } else {
							        var take = new Take(media.Streams[0]);
						        }
                                                        newEvent.Takes.Add(take);
						        take.Offset = evnt.ActiveTake.Offset + (Vegas.Transport.LoopRegionStart-evnt.Start);
                                                }

                                                if (evnt.IsAudio()) {
                                                        newEvent.Channels = AudioEvent(evntEnum.item()).Channels;
                                                        newEvent.NormalizeGain = AudioEvent(evntEnum.item()).NormalizeGain;
                                                        newEvent.FadeIn.Gain = AudioEvent(evntEnum.item()).FadeIn.Gain;
                                                }

                                                if (evnt.IsAudio() || streamcount == 1) {
                                                        if (evnt.Locked != 1 ) {
                                                                evnt.Split(Vegas.Transport.LoopRegionStart+Vegas.Transport.LoopRegionLength-evnt.Start);

						                if (Vegas.Transport.LoopRegionStart-evnt.Start <= Timecode.FromMilliseconds(0)) {
							                track.Events.Remove(evnt);
						                } else {
							                evnt.Length=Vegas.Transport.LoopRegionStart-evnt.Start;
						                }
                                                        }
                                                }
					}
					break;
				}
				evntEnum.moveNext();
			}
			trackEnum.moveNext();
		}
		if (prevlength > Timecode.FromMilliseconds(0)) {
			if (FishRegion.Length-prevlength <= Timecode.FromMilliseconds(0)) {
				FishRegion.Length = prevlength;
				MessageBox.Show("OK!", "OK", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
				Vegas.Transport.CursorPosition = FishRegion.Position+FishRegion.Length;
			}
			FishRegion.Length = FishRegion.Length-prevlength;
			FishRegion.Position = FishRegion.Position+prevlength;
		}
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