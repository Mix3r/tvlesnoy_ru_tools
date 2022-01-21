/** 
old school
ffmpeg -f concat -safe 0 -i "C:\Program Files\VEGAS\VEGAS Pro 13.0\vegas_cut_a_slice.txt" -c copy D:\Games\output2b.mp4
pause
 **/ 

import System;
import System.IO;
import System.Object;
import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;

var writer : StreamWriter = null;

try
{
 
	var trackEnum = new Enumerator(Vegas.Project.Tracks);
	var deleted_items = 0;
        var writer_go = 0;
	while (!trackEnum.atEnd()) {
		var events_present = 1;
		while (events_present == 1) {
			events_present = 0;
			var evntEnum = new Enumerator(Track(trackEnum.item()).Events);
			var lasteventstart = Timecode.FromMilliseconds(-100);
			var lasteventlength = Timecode.FromMilliseconds(0);
			while (!evntEnum.atEnd()) {
				if (TrackEvent(evntEnum.item()).IsAudio()) {
					if ((TrackEvent(evntEnum.item()).Start == lasteventstart) & (TrackEvent(evntEnum.item()).Length == lasteventlength)) {
						Track(trackEnum.item()).Events.Remove(TrackEvent(evntEnum.item()));
						events_present = 1;
						deleted_items = deleted_items + 1;
						break;
					}
					lasteventstart = TrackEvent(evntEnum.item()).Start;
					lasteventlength = TrackEvent(evntEnum.item()).Length;
				} else {
                                        if (writer_go <= 0) {
                                                writer_go = 1;
                                                writer = new StreamWriter(Vegas.InstallationDirectory + "\\vegas_cut_a_slice.txt", false, System.Text.Encoding.ASCII);
                                        }
                                        var activeTake = TrackEvent(evntEnum.item()).ActiveTake;
                                        var mediaPath = activeTake.MediaPath;
                                        var media = Vegas.Project.MediaPool[mediaPath];
                                        var stringcache = "file '"+mediaPath+"'";
                                        stringcache = stringcache.replace(/\\/g, "/");
                                        writer.WriteLine(stringcache);
                                        stringcache = "inpoint "+activeTake.Offset.ToString(RulerFormat.TimeAndFrames);
                                        stringcache = stringcache.replace(/,/g, ".");
                                        writer.WriteLine(stringcache);
                                        stringcache = "outpoint "+(activeTake.Offset+TrackEvent(evntEnum.item()).Length).ToString(RulerFormat.TimeAndFrames);
                                        stringcache = stringcache.replace(/,/g, ".");
                                        writer.WriteLine(stringcache);

                                }
				evntEnum.moveNext();
			}
		}
                if (writer_go > 0) {
                         writer.Close();
                         writer_go = -1;
                }
		trackEnum.moveNext();
	}
        if (deleted_items > 0) {
	        MessageBox.Show(deleted_items, "Deleted Doubles", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
        }

}

catch (errorMsg)
{
	MessageBox.Show(errorMsg, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
}
