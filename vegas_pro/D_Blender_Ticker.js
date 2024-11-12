/** 
new school
 **/ 

import System;
import System.Text;
import System.IO;
import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;

var sFFMpegPath = "\""+System.Environment.GetFolderPath(System.Environment.SpecialFolder.ProgramFiles)+"\\Totalcmd_p\\FFMPEG\\ffmpeg.exe\"";
var tStrmLength = null;
var newsGroup = null;
var bFlag_DoneV = null;
var bFlag_DoneA = null;
var tEventLoc = Vegas.Transport.CursorPosition;

try
{
    if (System.Windows.Forms.Control.ModifierKeys == Keys.Shift) {
        var ttl_length = new Timecode(5200);
	    var Titlebgtrack = FindTrack("Ticker");
	    if (null == Titlebgtrack) {
            Titlebgtrack = new VideoTrack(0, "Ticker");
            Vegas.Project.Tracks.Add(Titlebgtrack);
	    }
        var evntEnum = new Enumerator(Titlebgtrack.Events);
        //var ev_edit = 0;
        while (!evntEnum.atEnd()) {
              if ((TrackEvent(evntEnum.item()).Start <= Vegas.Transport.CursorPosition) & (TrackEvent(evntEnum.item()).Start + TrackEvent(evntEnum.item()).Length >= Vegas.Transport.CursorPosition)) {
                 //ev_edit = 1;
                 var medi_a = TrackEvent(evntEnum.item()).ActiveTake.Media;
                 medi_a.Length = TrackEvent(evntEnum.item()).Length;
                 //MessageBox.Show(medi_a.Generator.Description, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                 var locparam = OFXDouble2DParameter(medi_a.Generator.OFXEffect.FindParameterByName("Location"));
                 //MessageBox.Show(locparam.Keyframes[1], "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                 var NewTickerPos : OFXDouble2D;
                 NewTickerPos.X = locparam.GetValueAtTime(locparam.Keyframes[1].Time).Y - (TrackEvent(evntEnum.item()).FadeIn.Gain*2-1);
                 NewTickerPos.Y = 0.55;
                 locparam.Keyframes[1].Time = TrackEvent(evntEnum.item()).Length - Timecode.FromFrames(1);
                 //MessageBox.Show(NewTickerPos.X, NewTickerPos.Y, MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                 locparam.Keyframes[1].Value = NewTickerPos;
                 Vegas.Transport.CursorPosition = TrackEvent(evntEnum.item()).Start + TrackEvent(evntEnum.item()).Length - Timecode.FromFrames(1);
                 throw(1);
              }
              evntEnum.moveNext();
        }
        CreateGeneratedMedia(Titlebgtrack,"Narrator_Ticker_1");
    } else {
        CanOpener();
    }
}

catch (errorMsg)
{
    if (errorMsg != 1) {
	    MessageBox.Show(errorMsg, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
    }
}

function CanOpener() {
try {
    var fullpath_all = GetVideoDialog();

    for (var tTmpTrk in Vegas.Project.Tracks) {
        if (tTmpTrk.Events.Count > 0) {
            if (tTmpTrk.Events[tTmpTrk.Events.Count-1].Start+tTmpTrk.Events[tTmpTrk.Events.Count-1].Length > tEventLoc) {
                tEventLoc = tTmpTrk.Events[tTmpTrk.Events.Count-1].Start+tTmpTrk.Events[tTmpTrk.Events.Count-1].Length;
            }
        }
    }

    for (var fullpath_N in fullpath_all) {
        tStrmLength = null;
        newsGroup = null;
        bFlag_DoneV = null;
        bFlag_DoneA = null;

        var fullpath_base = Path.GetExtension(fullpath_all[fullpath_N]);
        fullpath_base = fullpath_base.toUpperCase();

        // skip .sfk
        if (fullpath_base == ".SFK") {
            continue;
        }
        // skip .bak
        if (fullpath_base == ".BAK") {
            continue;
        }
        // skip .sfap0
        if (fullpath_base == ".SFAP0") {
            continue;
        }
        // skip .sfvp0
        if (fullpath_base == ".SFVP0") {
            continue;
        }
        // decide for .veg
        if (fullpath_base == ".VEG") {
            if (Vegas.Project.FilePath != null) {
                fullpath_base = Path.GetFileNameWithoutExtension(fullpath_all[fullpath_N]);
                fullpath_base = fullpath_base.toUpperCase();
                newsGroup = Path.GetFileNameWithoutExtension(Vegas.Project.FilePath);
                newsGroup = newsGroup.toUpperCase();
                if (fullpath_base == newsGroup) {
                    newsGroup = null;
                    continue;
                } else {
                    newsGroup = null;
                }
            }
        }

        fullpath_base = Path.GetFullPath(fullpath_all[fullpath_N]);

        // debug
            //MessageBox.Show(fullpath_base);
            //continue;
        // debug end

        CanOpen(fullpath_base);
        if (null == bFlag_DoneV) {
            var postfix = ".v.mp4";
            TryToConvert('-i "'+fullpath_base+ '" -an -c:v libx264 -preset veryfast -crf 15 -y "'+fullpath_base+postfix+'"');
            CanOpen(fullpath_base + postfix);
            if (null == bFlag_DoneV) {
                Vegas.Project.MediaPool.Remove(fullpath_base + postfix);
            }
        }
        if (null == bFlag_DoneA) {
            var postfix = ".a.wav";
            TryToConvert('-i "'+fullpath_base+'" -vn -c:a pcm_s16le -ar 48000 -y "'+fullpath_base+postfix+'"');
            CanOpen(fullpath_base + postfix);
            if (null == bFlag_DoneA) {
                Vegas.Project.MediaPool.Remove(fullpath_base + postfix);
            }
        }
        if (null != tStrmLength) {
            tEventLoc = tEventLoc + tStrmLength;
            Vegas.UpdateUI();
        }
    }
}

catch(e) {
    if (e != "ok") {
        MessageBox.Show(e);
    }
}
}

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

function CreateGeneratedMedia(ticker_track, presetName) {

  var preset_pth = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + "\\OFX Presets\\com.sonycreativesoftware_titlesandtext\\Generator\\" + presetName + ".xml";
  if (File.Exists(preset_pth)) {
     File.Delete(preset_pth);
  }

  var writer = new StreamWriter(preset_pth, false, System.Text.Encoding.ASCII);
  writer.WriteLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
  writer.WriteLine("<OfxPreset plugin=\"com.sonycreativesoftware:titlesandtext\" context=\"Generator\" name=\"Narrator_Ticker_1\">");
  writer.WriteLine("<OfxPlugin>com.sonycreativesoftware:titlesandtext</OfxPlugin>");
  writer.WriteLine("<OfxParamTypeString name=\"Text\"><OfxParamValue>{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0\\fnil\\fcharset204 Arial;}}\\viewkind4\\uc1\\pard\\lang1049\\f0\\fs24\\par}</OfxParamValue></OfxParamTypeString>");
  writer.WriteLine("<OfxParamTypeChoice name=\"Alignment\"><OfxParamValue>3</OfxParamValue></OfxParamTypeChoice>");
  writer.WriteLine("</OfxPreset>");
  writer.Close();

  var generator = Vegas.Generators.FindChildByUniqueID("{Svfx:com.sonycreativesoftware:titlesandtext}");
  var src_height = Vegas.Project.Video.Height * 1;
  Vegas.Project.Video.Height = 74;
  var media = new Media(generator, presetName);
  Vegas.Project.Video.Height = src_height;

  var textParam = OFXDouble2DParameter(media.Generator.OFXEffect.FindParameterByName("Location"));
  var bgParam = OFXRGBAParameter(media.Generator.OFXEffect.FindParameterByName("Background"));
  var scaleParam = OFXDoubleParameter(media.Generator.OFXEffect.FindParameterByName("Scale"));

  var newwal = OFXDouble2D(textParam.GetValueAtTime(Timecode.FromSeconds(0)));
  var newwal2 = OFXColor(bgParam.GetValueAtTime(Timecode.FromSeconds(0)));

  newwal.X = 1.0;
  newwal.Y = 0.55;
  textParam.SetValueAtTime(Timecode.FromSeconds(0),newwal);
  newwal.X = 0;
  textParam.SetValueAtTime(Timecode.FromSeconds(5),newwal);
  newwal2.R = 0.25;
  newwal2.G = 0.4921;
  newwal2.B = 0.5;
  newwal2.A = 0.5;
  bgParam.SetValueAtTime(Timecode.FromSeconds(0),newwal2);
  scaleParam.SetValueAtTime(Timecode.FromSeconds(0),14.6);

  if (!media.IsValid()) {
      throw "failed to create media; " + presetName + " (" + presetName + ")";
  }
  var stream = media.Streams[0]; //The "video" stream
  var newEvent = new VideoEvent(new Timecode(Vegas.Transport.CursorPosition), ttl_length);
  ticker_track.Events.Add(newEvent);
  var take = new Take(stream);
  newEvent.Takes.Add(take);
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
  var moveby2 = new VideoMotionVertex(0,key_frame.Center.Y-d_height*0.5-Vegas.Project.Video.Height*0.384);
  key_frame.MoveBy(moveby2);

  return newEvent;
}

function CanOpen(f_path) {
    var mMedia = new Media(f_path);
    try {
    for (var sTmpStm in mMedia.Streams) {
        var newVid = null;
        var newAud = null;
        if (null == tStrmLength) {
            tStrmLength = sTmpStm.Length;
            if (tStrmLength.ToMilliseconds() == 0) {
                tStrmLength = Timecode.FromMilliseconds(3000);
            }
        }
        if (null == newsGroup) {
            newsGroup = new TrackEventGroup();
            Vegas.Project.Groups.Add(newsGroup);
        }

        if (sTmpStm.MediaType == MediaType.Video) {
            newVid = new VideoEvent(tEventLoc, tStrmLength);
            while (1) {
                //MessageBox.Show("vid");
                for (var tTmpTrk in Vegas.Project.Tracks) {
                    if (tTmpTrk.IsVideo()) {
                        bFlag_DoneV = 1;
                        tTmpTrk.Events.Add(newVid);
                        newVid.Takes.Add(new Take(sTmpStm));
                        TrackEvent(newVid).Loop = null;
                        newVid.ResampleMode = "Disable";
                        //newVid.ReduceInterlace = null;
                        newsGroup.Add(newVid);
                        break;
                    }
                }
                if (bFlag_DoneV == 1) {
                    break;
                } else {
                    Vegas.Project.Tracks.Add(new VideoTrack(Project.ActiveProject, Vegas.Project.Tracks.Count, ""));
                }
            }
        } else if (sTmpStm.MediaType == MediaType.Audio) {
            newAud = new AudioEvent(tEventLoc, tStrmLength);
            while (1) {
                //MessageBox.Show("aud");
                for (var tTmpTrk in Vegas.Project.Tracks) {
                    if (tTmpTrk.IsAudio()) {
                        bFlag_DoneA = 1;
                        tTmpTrk.Events.Add(newAud);
                        newAud.Takes.Add(new Take(sTmpStm));
                        TrackEvent(newAud).Loop = null;
                        newsGroup.Add(newAud);
                        break;
                    }
                }
                if (bFlag_DoneA == 1) {
                    break;
                } else {
                    Vegas.Project.Tracks.Add(new AudioTrack(Project.ActiveProject, Vegas.Project.Tracks.Count, ""));
                }
            }
        }
    }
    }
    catch(e) {
        Vegas.Project.MediaPool.Remove(f_path);
    }
}

function TryToConvert(sArgs) {
    var prog1 = new System.Diagnostics.Process();
    prog1.StartInfo.UseShellExecute = false;
	prog1.StartInfo.RedirectStandardOutput = false;
    prog1.StartInfo.FileName = sFFMpegPath;
    prog1.StartInfo.Arguments = sArgs;
    prog1.Start();
    prog1.WaitForExit();
}

function GetVideoDialog() {
    var openFileDialog = new OpenFileDialog();
    openFileDialog.Filter = "Любые видео (*.*)|*.*";
    openFileDialog.Title = "Укажите файл(ы) видео";
    openFileDialog.Multiselect = true;
    var initialDir2 = Path.GetDirectoryName(Vegas.Project.FilePath);
    if (Directory.Exists(initialDir2)) {
        openFileDialog.InitialDirectory = initialDir2;
    }
    if (System.Windows.Forms.DialogResult.OK == openFileDialog.ShowDialog()) {
        return openFileDialog.FileNames;
    } else {
        return null;
    }
}