
import System;
import System.IO;
import System.Object;
import Sony.Vegas;
import ScriptPortal.Vegas;
var dirx = 0;
var diry = 100;

try
{
        var trackEnum = new Enumerator(Vegas.Project.Tracks);
        while (!trackEnum.atEnd()) {
                var evntEnum = new Enumerator(Track(trackEnum.item()).Events);
                while (!evntEnum.atEnd()) {
                        if (TrackEvent(evntEnum.item()).Selected) {
                                if (TrackEvent(evntEnum.item()).IsVideo()) {
                                        var key_frame = VideoEvent(evntEnum.item()).VideoMotion.Keyframes[0];
                                        var d_width = key_frame.TopRight.X   - key_frame.TopLeft.X;
                                        var d_height = key_frame.BottomLeft.Y - key_frame.TopLeft.Y;
                                        var activeTake = TrackEvent(evntEnum.item()).ActiveTake;
                                        var vidstream = activeTake.Media.GetVideoStreamByIndex(activeTake.StreamIndex);
                                        if (d_width < 0) {
                                                d_width = d_width * -1;
                                        }
                                        if (d_height < 0) {
                                                d_height = d_height * -1;
                                        }
                                        if (d_height > 0) {
                                                if (key_frame.TopLeft.X == 0 && key_frame.TopLeft.Y == 0) {
                                                        var scaleby1 = new VideoMotionVertex(vidstream.Height/vidstream.Width,1);
                                                        key_frame.ScaleBy(scaleby1);
                                                        var scaleby2 = new VideoMotionVertex(Vegas.Project.Video.Width/Vegas.Project.Video.Height,1);
                                                        key_frame.ScaleBy(scaleby2);
                                                }
                                        }
                                        d_height =  (TrackEvent(evntEnum.item()).FadeIn.Gain - 0.5)*2;
                                        if (d_height < 0.01) {
                                                d_height = 0.01;
                                        }
                                        d_height = d_height * 0.1;
                                        var moveby2 = new VideoMotionVertex(1-d_height,1-d_height);
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