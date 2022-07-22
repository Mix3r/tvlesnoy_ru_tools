
import System;
import System.IO;
import System.Object;
import Sony.Vegas;
import ScriptPortal.Vegas;
var nMcMode = 0;
var nRange = 3600*2; // 2 hours
var tTargetpos : Timecode = Timecode.FromSeconds(0);
var tTmcodeIn : Timecode = Timecode.FromSeconds(0);
var empty_event = null;

try
{
        var trackEnum = new Enumerator(Vegas.Project.Tracks);
        while (!trackEnum.atEnd()) {
                var track : Track = Track(trackEnum.item());
                if (track.Name == "multicam") {
                        nMcMode = 1;
		        break;
	        }
                trackEnum.moveNext();
        }
        if (nMcMode == 1) {
                var evntEnum = new Enumerator(track.Events);
                while (!evntEnum.atEnd()) {
                        var evnt : TrackEvent = TrackEvent(evntEnum.item());
                        if (evnt.Start <= Vegas.Transport.CursorPosition && evnt.End > Vegas.Transport.CursorPosition) {
                                var streamcount = 0;
                                if (null != evnt.ActiveTake) {
				        if (null != evnt.ActiveTake.MediaPath) {
                                                if (null != evnt.ActiveTake.MediaPath) {
                                                        var media = Vegas.Project.MediaPool[evnt.ActiveTake.MediaPath];
                                                        if (null != media) {
                                                                tTmcodeIn = media.TimecodeIn;
                                                                var streamsEnum = new Enumerator(media.Streams);
                                                                while (!streamsEnum.atEnd()) {
                                                                        streamcount = streamcount + 1;
                                                                        streamsEnum.moveNext();
                                                                }
                                                        }
                                                }
                                        }
                                }
                                if (streamcount > 0) {
                                        if (Vegas.Transport.CursorPosition >= Timecode.FromSeconds(nRange)) {
                                                var plainhour = Vegas.Transport.CursorPosition.ToMilliseconds();
                                                plainhour = Math.floor(plainhour / (60*60*1000)) * (60*60*1000);
                                                tTargetpos = Timecode.FromMilliseconds(plainhour) + Timecode.FromString(Vegas.Project.Summary.Artist,RulerFormat.TimeAndFrames,1);
                                        } else {
                                                tTargetpos = tTmcodeIn + evnt.ActiveTake.Offset+(Vegas.Transport.CursorPosition-evnt.Start)+Timecode.FromSeconds(nRange);
                                                Vegas.Project.Summary.Engineer = Vegas.Transport.CursorPosition.ToString(RulerFormat.TimeAndFrames);
                                                Vegas.Project.Summary.Artist = tTargetpos.ToString(RulerFormat.TimeAndFrames);
                                        }
                                        Vegas.Transport.CursorPosition = tTargetpos;
                                        if (Vegas.Transport.CursorPosition == tTargetpos) {
                                        } else {
                                                empty_event = new VideoEvent(tTargetpos, Timecode.FromFrames(1));
                                                track.Events.Add(empty_event);
                                                Vegas.UpdateUI();
                                                Vegas.Transport.CursorPosition = empty_event.Start;
                                                Vegas.UpdateUI();
                                                track.Events.Remove(empty_event);
                                        }
                                }
                                nMcMode = 2; // camera met, don't return cursor
                                break;
                        }
                        evntEnum.moveNext();
                }
                if (nMcMode == 1) { // let's return cursor if no more cameras met on track
                        Vegas.Transport.CursorPosition = Timecode.FromString(Vegas.Project.Summary.Engineer,RulerFormat.TimeAndFrames,1);
                }
        } else {
                if (Vegas.Project.AudioCD.UPC == "0-0-0000-00000-0-1") {
                        Vegas.Project.AudioCD.UPC = "0-0-0000-00000-0-2"
                } else {
                        Vegas.Project.AudioCD.UPC = "0-0-0000-00000-0-1"
                }
        }
}
catch (errorMsg)
{
}