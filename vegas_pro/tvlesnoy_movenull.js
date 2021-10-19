
import System;
import System.IO;
import System.Object;
import Sony.Vegas;
import ScriptPortal.Vegas;

try
{
        var trackEnum = new Enumerator(Vegas.Project.Tracks);
        while (!trackEnum.atEnd()) {
                var evntEnum = new Enumerator(Track(trackEnum.item()).Events);
                while (!evntEnum.atEnd()) {
                        if (TrackEvent(evntEnum.item()).Selected) {
                                if (TrackEvent(evntEnum.item()).IsVideo()) {
                                        var key_frame = VideoEvent(evntEnum.item()).VideoMotion.Keyframes[0];
                                        if (key_frame.Position != Timecode.FromMilliseconds(0)) {
                                                key_frame.Position = Timecode.FromMilliseconds(0);
                                        }
                                        var activeTake = TrackEvent(evntEnum.item()).ActiveTake;
                                        var d_width = key_frame.TopRight.X   - key_frame.TopLeft.X;
                                        var d_height = key_frame.BottomLeft.Y - key_frame.TopLeft.Y;
                                        var c_x = key_frame.TopLeft.X+(key_frame.TopRight.X-key_frame.TopLeft.X)*0.5;
                                        var c_y = key_frame.TopLeft.Y+(key_frame.BottomLeft.Y-key_frame.TopLeft.Y)*0.5;
                                        if (d_width < 0) {
                                                d_width = d_width * -1;
                                        }
                                        if (d_height < 0) {
                                                d_height = d_height * -1;
                                        }
                                        var vidstream = activeTake.Media.GetVideoStreamByIndex(activeTake.StreamIndex);
                                        key_frame.RotateBy(-key_frame.Rotation);
                                        var scaleby1 = new VideoMotionVertex(Vegas.Project.Video.Width/d_width,Vegas.Project.Video.Height/d_height);
                                        key_frame.ScaleBy(scaleby1);
                                        var moveby2 = new VideoMotionVertex(-1*(c_x-vidstream.Width*0.5),-1*(c_y-vidstream.Height*0.5));
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