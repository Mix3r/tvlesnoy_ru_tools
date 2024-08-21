
import System;
import System.IO;
import System.Collections;
import System.Text;
import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;

var writer : StreamWriter = null;
var writer2 : StreamWriter = null;
var RegionName : String;

try {
      var Titlebgtrack = FindTrack("Ticker");
      if (null != Titlebgtrack) {
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
          if (dialog.RegionNameBox.Text == "0") {
              for (var med in Vegas.Project.MediaPool) {
                  if (med.HasVideo()) {
                      med.UseCustomTimecode = 1;
                      med.TimecodeIn = Timecode.FromSeconds(0);
                  }
              }
              throw "ok"
          } else if (dialog.RegionNameBox.Text == "z" || dialog.RegionNameBox.Text == "я") {
              for (var protrk in Vegas.Project.Tracks) {
                  if (protrk.IsAudio()) {
                      for (var proevt in protrk.Events) {
                          if (proevt.Start <= Vegas.Transport.CursorPosition && proevt.Start+proevt.Length > Vegas.Transport.CursorPosition) {
                              proevt.Split(Vegas.Transport.CursorPosition-proevt.Start);
                              proevt.Selected = null;
                              protrk.Events[proevt.Index+1].Start = protrk.Events[proevt.Index+1].Start+Timecode.FromMilliseconds(1000);
                              protrk.Events[proevt.Index+1].FadeIn.Length = Timecode.FromMilliseconds(640);
                              protrk.Events[proevt.Index+1].FadeIn.Curve = CurveType.Fast;
                              for (var undrevt in Vegas.Project.Tracks[protrk.Index+1].Events) {
                                  for (var undrevttake in undrevt.Takes) {
                                      if (undrevttake.Name == "Главное") {
                                          undrevt.Start = Vegas.Transport.CursorPosition;
                                          break;
                                      }
                                  }
                              }
                              //Vegas.Project.Tracks[0].Name = proevt.FadeIn.Gain;
                              break;
                          }
                      }
                      break;
                  }
              }
              throw "ok"
          } else if (dialog.RegionNameBox.Text == "x" || dialog.RegionNameBox.Text == "ч") {
              for (var protrk in Vegas.Project.Tracks) {
                  if (protrk.IsAudio()) {
                      for (var proevt in protrk.Events) {
                          if (proevt.Start <= Vegas.Transport.CursorPosition && proevt.Start+proevt.Length > Vegas.Transport.CursorPosition) {
                              proevt.Split(Vegas.Transport.CursorPosition-proevt.Start);
                              proevt.Selected = null;
                              protrk.Events[proevt.Index+1].Start = protrk.Events[proevt.Index+1].Start+Timecode.FromMilliseconds(1000);
                              protrk.Events[proevt.Index+1].FadeIn.Length = Timecode.FromMilliseconds(640);
                              protrk.Events[proevt.Index+1].FadeIn.Curve = CurveType.Fast;
                              var audevt = new AudioEvent(Vegas.Transport.CursorPosition,Timecode.FromMilliseconds(4500));
                              Vegas.Project.Tracks[protrk.Index+1].Events.Add(audevt);
                              TrackEvent(audevt).Loop = null;
                              audevt.FadeIn.Length = Timecode.FromMilliseconds(720);
                              audevt.FadeIn.Curve = CurveType.Fast;
                              ////
                              Vegas.UpdateUI();
                              var mdpth = GetProDialog();
                              if (null != mdpth) {
                                  var mda = new Media(mdpth);
                                  if (null != mda) {
                                      for (var mstm in mda.Streams) {
                                          audevt.Takes.Add(new Take(mstm));
                                          break;
                                      }
                                  }
                              }
                              ////
                          }
                      }
                      break;
                  }
              }
              throw "ok"
          } else if (dialog.RegionNameBox.Text == "c" || dialog.RegionNameBox.Text == "с") {
              for (var protrk in Vegas.Project.Tracks) {
                  if (protrk.IsAudio()) {
                      for (var proevt in protrk.Events) {
                          if (proevt.Start <= Vegas.Transport.CursorPosition && proevt.Start+proevt.Length > Vegas.Transport.CursorPosition) {
                              proevt.Split(Vegas.Transport.CursorPosition-proevt.Start);
                              proevt.Selected = null;
                              protrk.Events[proevt.Index+1].Start = protrk.Events[proevt.Index+1].Start+Timecode.FromMilliseconds(500);
                              protrk.Events[proevt.Index+1].FadeIn.Length = Timecode.FromMilliseconds(640);
                              protrk.Events[proevt.Index+1].FadeIn.Curve = CurveType.Fast;
                              for (var undrevt in Vegas.Project.Tracks[protrk.Index+1].Events) {
                                  for (var undrevttake in undrevt.Takes) {
                                      if (undrevttake.Name == "! В-В-ЖЖЖИК !") {
                                          undrevt.Start = Vegas.Transport.CursorPosition;
                                          break;
                                      }
                                  }
                              }
                              break;
                          }
                      }
                      break;
                  }
              }
              throw "ok"
          } else if (dialog.RegionNameBox.Text == "v" || dialog.RegionNameBox.Text == "м") {
              for (var protrk in Vegas.Project.Tracks) {
                  if (protrk.IsAudio()) {
                      for (var proevt in protrk.Events) {
                          if (proevt.Start <= Vegas.Transport.CursorPosition && proevt.Start+proevt.Length > Vegas.Transport.CursorPosition) {
                              proevt.Split(Vegas.Transport.CursorPosition-proevt.Start);
                              proevt.Selected = null;
                              protrk.Events[proevt.Index+1].Start = protrk.Events[proevt.Index+1].Start+Timecode.FromMilliseconds(1080);
                              protrk.Events[proevt.Index+1].FadeIn.Length = Timecode.FromMilliseconds(640);
                              protrk.Events[proevt.Index+1].FadeIn.Curve = CurveType.Fast;
                              for (var undrevt in Vegas.Project.Tracks[protrk.Index+1].Events) {
                                  for (var undrevttake in undrevt.Takes) {
                                      if (undrevttake.Name == "погоду") {
                                          undrevt.Start = Vegas.Transport.CursorPosition;
                                          break;
                                      }
                                  }
                              }
                              break;
                          }
                      }
                      break;
                  }
              }
              throw "ok";
          } else if (dialog.RegionNameBox.Text == "\'" || dialog.RegionNameBox.Text == "э") {
              dialog.RegionNameBox.Text = "\«\»";
              dialog.ShowDialog();
              throw "ok";
          }

          var Narratortrack = FindTrack("ДИКТОР_ВИДЕО");
          if (null == Narratortrack) {
              var mydocs_path = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments)+"\\Аватар-текст-новость.txt";
              var writercc = new StreamWriter(mydocs_path, false, System.Text.Encoding.UTF8); // 30 chars max
              var tstring = "";
              var charcount = 0;
              while (charcount < dialog.RegionNameBox.Text.length) {
                  tstring = tstring + dialog.RegionNameBox.Text.charAt(charcount);
                  if (tstring.length >= 30) {
                      if (charcount+1 < dialog.RegionNameBox.Text.length && dialog.RegionNameBox.Text.charAt(charcount+1) == ' ') {
                          while (tstring.length > 0 && tstring.charAt(0) == ' ') {
                              tstring = tstring.substring(1);
                          }
                          if (tstring.length > 0) {
                              writercc.WriteLine(tstring);
                          }
                          tstring = "";
                      } else {
                          var lastspaceidx = tstring.lastIndexOf(' ');
                          var lastspacestr = tstring.substring(0,lastspaceidx);
                          while (lastspacestr.length > 0 && lastspacestr.charAt(0) == ' ') {
                              lastspacestr = lastspacestr.substring(1);
                          }
                          if (lastspacestr.length > 0) {
                              writercc.WriteLine(lastspacestr);
                          }
                          tstring = tstring.substring(lastspaceidx+1);
                      }
                  }
                  charcount = charcount + 1;
              }
              while (tstring.length > 0 && tstring.charAt(0) == ' ') {
                  tstring = tstring.substring(1);
              }
              if (tstring.length > 0) {
                  writercc.WriteLine(tstring);
              }

              writercc.Close();
              //////////////
              var prog3 = new System.Diagnostics.Process();
              prog3.StartInfo.FileName = "https://trychatgpt.ru";
              prog3.StartInfo.UseShellExecute = true;
              prog3.Start();
              //////////////
              System.Windows.Forms.Clipboard.SetText('Привет! Пожалуйста, замени числа на слова в данном тексте (с правильным склонением этих слов), а также замени символ % (если он будет в тексте) на слово "процент", выполнив правильное склонение слова "процент". После чего определи в полученном результате количество знаков. Затем раздели текст на фрагменты от 250 до 300 знаков в каждом. Прилагаю текст: '+dialog.RegionNameBox.Text);
              //throw "Нет дорожки ДИКТОР_ВИДЕО.";
              throw "ok";
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

          var this_media = Vegas.Project.MediaPool.Find(narmediaPath);
          if (null == this_media) {
          } else {
                  Vegas.Project.MediaPool.Remove(narmediaPath);
          }

          RegionName = "";
          for (idx = 0; idx < 106; idx++) {
                  RegionName = RegionName + " ";
          }

          RegionName = RegionName + dialog.RegionNameBox.Text;

          RegionName = RegionName.replace(/`/g, "``");
          RegionName = RegionName.replace(/\$/g, "`$");
          RegionName = RegionName.replace(/\"/g, "`\"");
          RegionName = RegionName.replace(/\“/g, "`\"");

          var prog1 = new System.Diagnostics.Process();

          prog1.StartInfo.UseShellExecute = false;
          prog1.StartInfo.CreateNoWindow = true;
          prog1.StartInfo.WorkingDirectory = Vegas.Project.Video.PrerenderedFilesFolder;

          prog1.StartInfo.Arguments = "";
          if (Vegas.Project.Video.PrerenderedFilesFolder.substr(Vegas.Project.Video.PrerenderedFilesFolder.length - 1) != "\\") {
              prog1.StartInfo.Arguments = "\\";
          }

          writer = new StreamWriter(Vegas.Project.Video.PrerenderedFilesFolder+prog1.StartInfo.Arguments+"vegas_bake_crawler.ps1", false, System.Text.Encoding.UTF8);
          writer.WriteLine(""); //utf-8 bom goes here
          writer.WriteLine("Add-Type -AssemblyName System.Drawing");
          writer.WriteLine("$filename = \""+narmediaPath+"\"");
          writer.WriteLine("$bmp = new-object System.Drawing.Bitmap "+(dialog.RegionNameBox.Text.length*35+1920+1920).ToString()+",74");
          writer.WriteLine("$font = new-object System.Drawing.Font Arial,48");
          writer.WriteLine("$TickerBgColor = [System.Drawing.Color]::FromArgb(128, 64, 125, 128)");
          writer.WriteLine("$TickerBgBrush = New-Object System.Drawing.SolidBrush($TickerBgColor)");
          writer.WriteLine("$brushFg = [System.Drawing.Brushes]::White");
          writer.WriteLine("$graphics = [System.Drawing.Graphics]::FromImage($bmp)");
          writer.WriteLine("$graphics.FillRectangle($TickerBgBrush,0,0,$bmp.Width,$bmp.Height)");
          writer.WriteLine("$graphics.DrawString(\""+RegionName+"\",$font,$brushFg,0,-4)");
          writer.WriteLine("$graphics.Dispose()");
          writer.WriteLine("$bmp.Save($filename,[System.Drawing.Imaging.ImageFormat]::Tiff)");
          writer.Close();

	  if (null == Titlebgtrack) {
                  Titlebgtrack = new VideoTrack(0, "Ticker");
                  Vegas.Project.Tracks.Add(Titlebgtrack);
	  }

          if (Vegas.Transport.CursorPosition == Vegas.Transport.LoopRegionStart + Vegas.Transport.LoopRegionLength) {
                  Vegas.Transport.CursorPosition = Vegas.Transport.LoopRegionStart;
          }

          var newEvent = new VideoEvent(Vegas.Transport.CursorPosition, Vegas.Transport.LoopRegionLength);
          Titlebgtrack.Events.Add(newEvent);
          Vegas.UpdateUI();

          prog1.StartInfo.FileName = "powershell.exe";
          prog1.StartInfo.Arguments = "-ExecutionPolicy Bypass -File \""+Vegas.Project.Video.PrerenderedFilesFolder+prog1.StartInfo.Arguments+"vegas_bake_crawler.ps1\"";
	  prog1.Start();
	  prog1.WaitForExit();

          var media = new Media(narmediaPath);
          var stream = media.Streams[0]; //The "video" stream
          stream.AlphaChannel = "Straight";

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

function GetProDialog() {
    var openFileDialog = new OpenFileDialog();
    openFileDialog.Filter = "Любой про (*.*)|*.*";
        openFileDialog.Title = "Укажите Про что";
        var initialDir2 = Vegas.Project.Tracks[1].Name;
        if (Directory.Exists(initialDir2)) {
            openFileDialog.InitialDirectory = initialDir2;
        } else {
            initialDir2 = Vegas.Project.Tracks[0].Name;
            if (Directory.Exists(initialDir2)) {
                openFileDialog.InitialDirectory = initialDir2;
            }
        }
    if (System.Windows.Forms.DialogResult.OK == openFileDialog.ShowDialog()) {
        return Path.GetFullPath(openFileDialog.FileName);
    } else {
        return null;
    }
}
