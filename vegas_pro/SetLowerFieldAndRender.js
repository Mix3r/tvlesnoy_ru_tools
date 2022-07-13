
import System;
import System.IO;
import System.Collections;
import System.Text;
import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;

var writer : StreamWriter = null;
var writer2 : StreamWriter = null;
var RegionName   : String;

try {
      var Titlebgtrack = FindTrack("Ticker");
      if (null == Titlebgtrack) {
      } else {
              var evntEnum = new Enumerator(Titlebgtrack.Events);
              while (!evntEnum.atEnd()) {
              if ((TrackEvent(evntEnum.item()).Start <= Vegas.Transport.CursorPosition) & (TrackEvent(evntEnum.item()).Start + TrackEvent(evntEnum.item()).Length >= Vegas.Transport.CursorPosition)) {
                 //ev_edit = 1;
                 var tickr = VideoEvent(evntEnum.item());
                 tickr.VideoMotion.Keyframes[1].Position = TrackEvent(evntEnum.item()).Length - Timecode.FromFrames(1);
                 var tkey_frame = tickr.VideoMotion.Keyframes[1];
                 var d_width2 = tkey_frame.TopRight.X   - tkey_frame.TopLeft.X;
                 var d_height2 = tkey_frame.BottomLeft.Y - tkey_frame.TopLeft.Y;
                 if (d_width2 < 0) {
                          d_width2 = d_width2 * -1;
                 }
                 if (d_height2 < 0) {
                          d_height2 = d_height2 * -1;
                 }
                 var moveby2_2 = new VideoMotionVertex(d_width2 * (-1 + TrackEvent(evntEnum.item()).FadeIn.Gain*2),0);
                 tkey_frame.MoveBy(moveby2_2);
                 Vegas.Transport.CursorPosition = TrackEvent(evntEnum.item()).Start + TrackEvent(evntEnum.item()).Length - Timecode.FromFrames(1);
                 throw "ok";
              }
              evntEnum.moveNext();
              }
      }

      var dialog = new MainDialog("");
      var dialogResult = dialog.ShowDialog();
      var idx = 0;

      // Proceed if the "Next" button was pressed.
      if (System.Windows.Forms.DialogResult.OK == dialogResult) {

        // Create the region name from the Listbox, textbox, and region number
        if (dialog.RegionNameBox.Text != " ") {

          var Narratortrack = FindTrack("ДИКТОР_ВИДЕО");
          if (null == Narratortrack) {
                  throw "Нет дорожки ДИКТОР_ВИДЕО.";
          }
          var narEnum = new Enumerator(Narratortrack.Events);
          while (!narEnum.atEnd()) {
                  if ((TrackEvent(narEnum.item()).Start <= Vegas.Transport.CursorPosition) & (TrackEvent(narEnum.item()).Start + TrackEvent(narEnum.item()).Length >= Vegas.Transport.CursorPosition)) {
                          idx = 1;
                          var naractiveTake = TrackEvent(narEnum.item()).ActiveTake;
                          VideoEvent(narEnum.item()).ResampleMode = "Disable";
		          var narmediaPath = naractiveTake.MediaPath + "_";
                          RegionName = Vegas.Transport.CursorPosition.ToMilliseconds().ToString();
                          narmediaPath = narmediaPath.substring(0, narmediaPath.length - 5) + "_";
                          narmediaPath = narmediaPath + RegionName +"_TXT.tif";
                  }
                  narEnum.moveNext();
          }

          if (idx == 0) {
                  throw "Нет клипа на игле-курсоре на дорожке ДИКТОР_ВИДЕО.";
          }

          RegionName = Vegas.InstallationDirectory+"";
          RegionName = RegionName.replace(/:\\/g, ":::");
          RegionName = RegionName.replace(/\\/g, "/");
          RegionName = RegionName.replace(/:::/g, "\\\\:/");

          writer2 = new StreamWriter(Vegas.InstallationDirectory + "\\vegas_bake_crawler.txt", false, System.Text.Encoding.Unicode);
          writer2.WriteLine("\""+Vegas.InstallationDirectory+"\\..\\..\\Totalcmd_p\\FFMPEG\\ffmpeg.exe\" -f lavfi -i \"color=0x407c7d@0.5:size="+(dialog.RegionNameBox.Text.length*35+1920+1920).ToString()+"x74,format=rgba\" -vf drawtext=\"fontfile=C"+"\\"+"\\"+":/Windows/Fonts/arial.ttf:textfile="+ RegionName + "/vegas_bake_crawler.txt:y=h-line_h-4:x=-42:fontcolor=white:fontsize=65\" -frames:v 1 -c:v tiff -y \""+narmediaPath+"\"");
          //writer2.WriteLine("pause");
          writer2.Close();

          var this_media = Vegas.Project.MediaPool.Find(narmediaPath);
          if (null == this_media) {
          } else {
                  Vegas.Project.MediaPool.Remove(narmediaPath);
          }

          var prog1 = new System.Diagnostics.Process();
	  var prog1_nfo = new System.Diagnostics.ProcessStartInfo();

          prog1_nfo.UseShellExecute = false;
	  prog1_nfo.RedirectStandardOutput = false;
          prog1_nfo.WorkingDirectory = "C:\\";
          prog1_nfo.FileName = "cmd.exe";
          prog1_nfo.Arguments = '/a /c type "'+Vegas.InstallationDirectory + '\\vegas_bake_crawler.txt">"'+Vegas.InstallationDirectory + '\\vegas_bake_crawler.cmd"';
          prog1.StartInfo = prog1_nfo;
	  prog1.Start();
	  prog1.WaitForExit();

          RegionName = "";
          for (idx = 0; idx < 106; idx++) {
                  RegionName = RegionName + " ";
          }

          writer = new StreamWriter(Vegas.InstallationDirectory + "\\vegas_bake_crawler.txt", false, System.Text.Encoding.UTF8);
          writer.WriteLine(RegionName+dialog.RegionNameBox.Text);
          writer.Close();

          prog1_nfo.Arguments = '/a /c "'+Vegas.InstallationDirectory + '\\vegas_bake_crawler.cmd"';
	  prog1.StartInfo = prog1_nfo;
	  prog1.Start();
	  prog1.WaitForExit();

	  if (null == Titlebgtrack) {
                  Titlebgtrack = new VideoTrack(0, "Ticker");
                  Vegas.Project.Tracks.Add(Titlebgtrack);
	  }

          //var mrk = new MarkerCommandType("URL");
          //var newcmd = new CommandMarker(Vegas.Transport.CursorPosition,mrk,dialog.RegionNameBox.Text);
          //Vegas.Project.CommandMarkers.Add(newcmd);
          var media = new Media(narmediaPath);
          var stream = media.Streams[0]; //The "video" stream
          stream.AlphaChannel = "Straight";
          if (Vegas.Transport.CursorPosition == Vegas.Transport.LoopRegionStart + Vegas.Transport.LoopRegionLength) {
                  Vegas.Transport.CursorPosition = Vegas.Transport.LoopRegionStart;
          }
          var newEvent = new VideoEvent(Vegas.Transport.CursorPosition, Vegas.Transport.LoopRegionLength);
          Titlebgtrack.Events.Add(newEvent);
          var take = new Take(stream);
	  newEvent.Takes.Add(take);
          newEvent.ResampleMode = "Disable";
          newEvent.MaintainAspectRatio = null;
          newEvent.VideoMotion.ScaleToFill = 1;
          var key_frame = newEvent.VideoMotion.Keyframes[0];
          var d_width = key_frame.TopRight.X   - key_frame.TopLeft.X;
          var d_height = key_frame.BottomLeft.Y - key_frame.TopLeft.Y;
          if (d_width < 0) {
                  d_width = d_width * -1;
          }
          if (d_height < 0) {
                  d_height = d_height * -1;
          }
          var moveby1 = new VideoMotionVertex(Vegas.Project.Video.Width/d_width,Vegas.Project.Video.Height/d_height);
          key_frame.ScaleBy(moveby1);
          var moveby2 = new VideoMotionVertex(d_width*-0.5+Vegas.Project.Video.Width*0.5,key_frame.Center.Y-d_height*0.5-Vegas.Project.Video.Height*0.384);
          key_frame.MoveBy(moveby2);
          var keyf = new VideoMotionKeyframe( Project.ActiveProject, newEvent.Length - Timecode.FromFrames(1)  );
          newEvent.VideoMotion.Keyframes.Add(keyf);

          //prog1_nfo.Arguments = '/a /k "'+Vegas.InstallationDirectory+'\\..\\..\\Totalcmd_p\\FFMPEG\\ffmpeg.exe"';
          //prog1.StartInfo = prog1_nfo;
          //prog1.Start();
          //prog1.WaitForExit();
          //Vegas.UpdateUI();
          //throw "ok";
          dialog.Close();
        }
      } else if (System.Windows.Forms.DialogResult.Cancel == dialogResult) {
          throw "ok";
      }
}

catch (e) {
    if (e != "ok") {
            MessageBox.Show(e);
    }
}
// End Main Program

// Begin functions

// Form subclass that is the dialog box for this script
class MainDialog extends Form {
    var RegionNameBox;
    var PreviewBox;

    function MainDialog(RegionName) {

        this.Text = "Бегучая Строка";
        this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
        this.MaximizeBox = false;
        this.StartPosition = FormStartPosition.CenterScreen;
        this.Width = 600;

        var buttonWidth = 80;
        var btnGap = 10;

        RegionNameBox = addTextControl("Текст", btnGap, this.Width-(btnGap+btnGap+buttonWidth+btnGap+btnGap+btnGap), 20, "");

        var buttonTop = RegionNameBox.Top;

        var NextButton = new Button();
        NextButton.Text = "Хорошо";
        NextButton.Left = this.Width - (buttonWidth+btnGap+btnGap+btnGap);
        NextButton.Top = buttonTop-2;
        NextButton.Width = buttonWidth;
        NextButton.Height = RegionNameBox.Height+4;
        NextButton.DialogResult = System.Windows.Forms.DialogResult.OK;
        AcceptButton = NextButton;  // The Enter key will automatically activate this button.
        Controls.Add(NextButton);

        var titleHeight = this.Height - this.ClientSize.Height;
        this.Height = titleHeight + NextButton.Bottom + 20;
    }

    function addTextControl(labelName, left, width, top, defaultValue) {
        var label = new Label();
        label.AutoSize = true;
        label.Text = labelName + ":";
        label.Left = left;
        label.Top = top + 4;
        Controls.Add(label);

        var textbox = new TextBox();
        textbox.Multiline = false;
        textbox.Left = label.Right;
        textbox.Top = top;
        textbox.Width = width - (label.Width);
        textbox.Text = defaultValue;
        Controls.Add(textbox);

        return textbox;
    }

}   // End class MainDialog

function FindTrack(WhichTrack) : Track {
  var trackEnum = new Enumerator(Vegas.Project.Tracks);
  var PrevTrack : Track = Track(trackEnum.item());
  while (!trackEnum.atEnd()) {
	var track : Track = Track(trackEnum.item());
	if (track.Name == WhichTrack) {
		return track;
	}
	trackEnum.moveNext();
  }
  return null;
}
