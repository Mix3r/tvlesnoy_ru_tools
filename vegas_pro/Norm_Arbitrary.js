/** 
old school
 **/ 

import System;
import System.IO;
import System.Object;
import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;

try
{
 
	var trackEnum = new Enumerator(Vegas.Project.Tracks);
	var normlevel = 1;
	var first_event = -999;
	while (!trackEnum.atEnd()) {
		var evntEnum = new Enumerator(Track(trackEnum.item()).Events);
		while (!evntEnum.atEnd()) {
			if (TrackEvent(evntEnum.item()).Selected) {
                         if (TrackEvent(evntEnum.item()).IsAudio()) {
				//if (normlevel == 0) {
				//	var form = new Form();
				//	form.SuspendLayout();
				//	form.AutoScaleMode = AutoScaleMode.Font;
				//	form.FormBorderStyle = FormBorderStyle.FixedDialog;
				//	form.StartPosition = FormStartPosition.CenterParent;
				//	form.MaximizeBox = false;
				//	form.MinimizeBox = false;
				//	form.HelpButton = false;
				//	form.ShowInTaskbar = false;
				//	form.Text = "Level";
				//	form.AutoSize = true;
				//	form.ResumeLayout();
				//	form.ShowDialog(Vegas.MainWindow);
				//}
				//if (Track(trackEnum.item()).Name != "") {
					normlevel = double(Track(trackEnum.item()).Name);
					if (normlevel * 0 != 0) {
						//MessageBox.Show("Type gain ratio (example: 2 , 3 , or 0.5) for selected events in its track name field!", "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
						//Track(trackEnum.item()).Name = "12";
						if (first_event == -999) {
							first_event = AudioEvent(evntEnum.item()).NormalizeGain * 1;
						}
						AudioEvent(evntEnum.item()).SetNormalize(1,first_event+1);
					} else {
						AudioEvent(evntEnum.item()).SetNormalize(1,normlevel);
					}
                                        var activeTake = TrackEvent(evntEnum.item()).ActiveTake;
                                        var lastIndex = activeTake.Name.lastIndexOf('*');
                                        if (lastIndex > 0) {
                                                activeTake.Name = activeTake.Name.substring(0,lastIndex);
                                        }
                                        activeTake.Name = activeTake.Name + "*" + AudioEvent(evntEnum.item()).NormalizeGain.ToString();
					AudioEvent(evntEnum.item()).FadeIn.Gain = 1;
                                        //AudioEvent(evntEnum.item()).FadeIn.Curve = "Slow";
			 } else {
                              var plugIn = PlugInNode(Vegas.VideoFX.FindChildByUniqueID("{Svfx:com.sonycreativesoftware:colorcurves}"));
                              var efectEnum = new Enumerator(VideoEvent(evntEnum.item()).Effects);
                              var has_it = 0;
                              while (!efectEnum.atEnd() && has_it == 0) {
                                    if (Effect(efectEnum.item()).PlugIn == plugIn) {
                                             has_it = 1;
                                    }
                              }
                              if (has_it == 0) {
                                    VideoEvent(evntEnum.item()).Effects.AddEffect(plugIn);
                              }
                         }

                        }
			evntEnum.moveNext();
		}
		trackEnum.moveNext();
	}
}

catch (errorMsg)
{
	MessageBox.Show(errorMsg, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
}