
import System;
import System.IO;
import System.Object;
import Sony.Vegas;
import ScriptPortal.Vegas;
var fac1 = 2.0;
var bSwitchAudioChannel = 0;
try
{
        var trackEnum = new Enumerator(Vegas.Project.Tracks);
        while (!trackEnum.atEnd()) {
                var evntEnum = new Enumerator(Track(trackEnum.item()).Events);
                while (!evntEnum.atEnd()) {
                    if (TrackEvent(evntEnum.item()).Selected) {
                        if (TrackEvent(evntEnum.item()).Start <= Vegas.Transport.CursorPosition && TrackEvent(evntEnum.item()).Start + TrackEvent(evntEnum.item()).Length >= Vegas.Transport.CursorPosition) {
                                if (TrackEvent(evntEnum.item()).IsVideo()) {
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
                                        var d_height = System.Windows.Forms.Control.MousePosition.Y / System.Windows.Forms.Screen.PrimaryScreen.WorkingArea.Height;
                                        if (d_height > 1) {
                                            d_height = 1.0;
                                        }

                                        fac1 = fac1 * d_height;
                                        if (fac1 < 0) {
                                                fac1 = 0;
                                        }
                                        var moveby2 = new VideoMotionVertex(1.0+fac1,1.0+fac1);
                                        key_frame.ScaleBy(moveby2);
                                }
                        }
                        if (TrackEvent(evntEnum.item()).IsAudio()) {
                            AudioEvent(evntEnum.item()).Channels = ChannelRemapping.DisableRight;
                            bSwitchAudioChannel = 1;
                        }
                    }
                    evntEnum.moveNext();
                }
                trackEnum.moveNext();
        }
        if (bSwitchAudioChannel == 1) {
            Vegas.Transport.Play();
        }
}
catch (errorMsg)
{
	//MessageBox.Show(errorMsg, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
}