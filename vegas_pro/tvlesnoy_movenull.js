
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
                                        var activeTake = TrackEvent(evntEnum.item()).ActiveTake;
                                        var d_width = key_frame.TopRight.X   - key_frame.TopLeft.X;
                                        var d_height = key_frame.BottomLeft.Y - key_frame.TopLeft.Y;
                                        if (d_width < 0) {
                                                d_width = d_width * -1;
                                        }
                                        if (d_height < 0) {
                                                d_height = d_height * -1;
                                        }
                                        var vidstream = activeTake.Media.GetVideoStreamByIndex(activeTake.StreamIndex);

                                        var scaleby1 = new VideoMotionVertex(Vegas.Project.Video.Width/d_width,Vegas.Project.Video.Height/d_height);
                                        key_frame.ScaleBy(scaleby1);
                                        var moveby2 = new VideoMotionVertex(-1*(key_frame.Center.X-vidstream.Width*0.5),-1*(key_frame.Center.Y-vidstream.Height*0.5));
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