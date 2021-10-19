
import System;
import System.IO;
import System.Object;
import Sony.Vegas;
import ScriptPortal.Vegas;
var fac1 = Vegas.Project.Video.Height*0.333;

try
{
        var trackEnum = new Enumerator(Vegas.Project.Tracks);
        while (!trackEnum.atEnd()) {
                var evntEnum = new Enumerator(Track(trackEnum.item()).Events);
                while (!evntEnum.atEnd()) {
                        if (TrackEvent(evntEnum.item()).Selected && TrackEvent(evntEnum.item()).Start <= Vegas.Cursor && TrackEvent(evntEnum.item()).Start + TrackEvent(evntEnum.item()).Length >= Vegas.Cursor) {
                                if (TrackEvent(evntEnum.item()).IsVideo()) {
                                        Vegas.Cursor = TrackEvent(evntEnum.item()).Start;
                                        var key_frame = VideoEvent(evntEnum.item()).VideoMotion.Keyframes[0];
                                        if (key_frame.Position != Timecode.FromMilliseconds(0)) {
                                                key_frame.Position = Timecode.FromMilliseconds(0);
                                        }
                                        var activeTake = TrackEvent(evntEnum.item()).ActiveTake;
                                        var vidstream = activeTake.Media.GetVideoStreamByIndex(activeTake.StreamIndex);
                                        if (key_frame.TopLeft.X == 0 && key_frame.TopLeft.Y == 0) {
                                                var scaleby1 = new VideoMotionVertex(vidstream.Height/vidstream.Width,1);
                                                key_frame.ScaleBy(scaleby1); // make it squared first
                                                var scaleby2 = new VideoMotionVertex(Vegas.Project.Video.Width/Vegas.Project.Video.Height,1);
                                                key_frame.ScaleBy(scaleby2); // fit to project aspect ratio
                                        }
                                        var d_height = 1 - TrackEvent(evntEnum.item()).SnapOffset.ToMilliseconds() / TrackEvent(evntEnum.item()).Length.ToMilliseconds();

                                        fac1 = fac1 * d_height;
                                        if (fac1 < 1) {
                                                fac1 = 1;
                                        }
                                        var moveby2 = new VideoMotionVertex(-fac1,0);
                                        key_frame.MoveBy(moveby2);
                                }
                        }
                        evntEnum.moveNext();
                }
                trackEnum.moveNext();
        }
}
catch (errorMsg)
{
	//MessageBox.Show(errorMsg, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
}