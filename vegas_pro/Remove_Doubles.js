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
 
	var trackEnum = new Enumerator(Vegas.Project.Tracks);
	var deleted_items = 0;
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
				}
				evntEnum.moveNext();
			}
		}
		trackEnum.moveNext();
	}
	MessageBox.Show(deleted_items, "Deleted Doubles", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
}

catch (errorMsg)
{
	MessageBox.Show(errorMsg, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
}