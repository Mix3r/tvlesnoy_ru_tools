
import System;
import System.IO;
import System.Object;
import Sony.Vegas;
import ScriptPortal.Vegas;
var fac1 = 0.333;

try
{
        var trackEnum = new Enumerator(Vegas.Project.Tracks);
        while (!trackEnum.atEnd()) {
                var evntEnum = new Enumerator(Track(trackEnum.item()).Events);
                while (!evntEnum.atEnd()) {
                        if (TrackEvent(evntEnum.item()).Selected && TrackEvent(evntEnum.item()).Start <= Vegas.Transport.CursorPosition && TrackEvent(evntEnum.item()).Start + TrackEvent(evntEnum.item()).Length >= Vegas.Transport.CursorPosition) {
                                if (TrackEvent(evntEnum.item()).IsVideo()) {
                                        if (VideoEvent(evntEnum.item()).MaintainAspectRatio != null) {
                                                VideoEvent(evntEnum.item()).MaintainAspectRatio = null;
                                        }
                                        var keyEnum = new Enumerator(VideoEvent(evntEnum.item()).VideoMotion.Keyframes);
                                        var keyz = 0;
                                        while (!keyEnum.atEnd()) {
                                                keyz = keyz + 1;
                                                if (VideoEvent(evntEnum.item()).VideoMotion.Keyframes[keyz-1].Position == Vegas.Transport.CursorPosition-TrackEvent(evntEnum.item()).Start) {
                                                        keyz = -keyz;
                                                        break;
                                                }
                                                keyEnum.moveNext();
                                        }
                                        if (keyz > 0) {
                                                var key_frame = new VideoMotionKeyframe( Project.ActiveProject, Vegas.Transport.CursorPosition-TrackEvent(evntEnum.item()).Start);
                                                VideoEvent(evntEnum.item()).VideoMotion.Keyframes.Add(key_frame);
                                        } else {
                                                keyz = -keyz;
                                                var key_frame = VideoEvent(evntEnum.item()).VideoMotion.Keyframes[keyz-1];
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
                                        if (fac1 < 0.001) {
                                                fac1 = 0.001;
                                        }
                                        if (Vegas.Project.AudioCD.UPC == "0-0-0000-00000-0-1") {
                                                var moveby2 = new VideoMotionVertex(1,1-fac1);
                                        } else {
                                                var moveby2 = new VideoMotionVertex(1-fac1,1);
                                        }
                                        key_frame.ScaleBy(moveby2);
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