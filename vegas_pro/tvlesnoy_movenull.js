
import System;
import System.IO;
import System.Object;
import Sony.Vegas;
import System.Windows.Forms;
import ScriptPortal.Vegas;

try
{
        var trackEnum = new Enumerator(Vegas.Project.Tracks);
        var bIsSelected = 0;
        while (!trackEnum.atEnd()) {
                var evntEnum = new Enumerator(Track(trackEnum.item()).Events);
                while (!evntEnum.atEnd()) {
                        if (TrackEvent(evntEnum.item()).Selected && TrackEvent(evntEnum.item()).Start <= Vegas.Transport.CursorPosition && TrackEvent(evntEnum.item()).Start + TrackEvent(evntEnum.item()).Length >= Vegas.Transport.CursorPosition) {
                                if (TrackEvent(evntEnum.item()).IsVideo()) {
                                        bIsSelected = 1;
                                        Vegas.Transport.CursorPosition = TrackEvent(evntEnum.item()).Start;
                                        var keyEnum = new Enumerator(VideoEvent(evntEnum.item()).VideoMotion.Keyframes);
                                        var keyz = 0;
                                        while (!keyEnum.atEnd()) {
                                                keyz = keyz + 1;
                                                keyEnum.moveNext();
                                        }
                                        while (keyz > 1) {
                                                VideoEvent(evntEnum.item()).VideoMotion.Keyframes.Remove(VideoEvent(evntEnum.item()).VideoMotion.Keyframes[1]);
                                                keyz = keyz - 1;
                                        }
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
                if (Track(trackEnum.item()).Selected) {
                        var tActivTrk : Track = Track(trackEnum.item());
                }
                trackEnum.moveNext();
        }
        if (bIsSelected == 0) {
                if (tActivTrk != null) {
                        var eActivTrkEvts = new Enumerator(tActivTrk.Events);
                        while (!eActivTrkEvts.atEnd()) {
                                if (TrackEvent(eActivTrkEvts.item()).Start <= Vegas.Transport.CursorPosition && TrackEvent(eActivTrkEvts.item()).Start + TrackEvent(eActivTrkEvts.item()).Length > Vegas.Transport.CursorPosition) {
                                        throw "no";
                                }
                                eActivTrkEvts.moveNext();
                        }
                        var generator = Vegas.Generators.GetChildByClassID(new Guid("8B5DEABC-53BD-49F6-9803-367478307A59"));
                        var gradientc = new Media(generator, "TV_White");
                        var stm_txt = gradientc.Streams[0];
                        var evt_txt = new VideoEvent(Vegas.Transport.CursorPosition, Timecode.FromMilliseconds(1000));
                        tActivTrk.Events.Add(evt_txt);
                        var txt_take = new Take(stm_txt);
                        evt_txt.Takes.Add(txt_take);
                }
        }
}
catch (errorMsg)
{
        // MessageBox.Show(errorMsg, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
}