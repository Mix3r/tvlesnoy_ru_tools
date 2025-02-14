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
var nExitFlag = 0;
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
    var bForceConversion = null;
    var fullpath_all = GetVideoDialog();

    if (System.Windows.Forms.Control.ModifierKeys == Keys.Control) {
        bForceConversion = 1;
    }

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
        var sCustomParmV = "";
        var sCustomParmA = "";
        var postfix = "";

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
        // skip .a
        if (fullpath_base == ".A") {
            continue;
        }
        // skip .v
        if (fullpath_base == ".V") {
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
        // decide for .avif
        if (fullpath_base == ".AVIF") {
            postfix = ".v.png";
            sCustomParmV = '-i "'+Path.GetFullPath(fullpath_all[fullpath_N])+ '" -filter_complex "[0:v:1][0:v:0]alphamerge[vid]" -map [vid] -c:v png -an -y "'+Path.GetFullPath(fullpath_all[fullpath_N])+postfix+'"';
        }


        fullpath_base = Path.GetFullPath(fullpath_all[fullpath_N]);

        // debug
            //MessageBox.Show(fullpath_base);
            //continue;
        // debug end

        if (null == bForceConversion) {
            CanOpen(fullpath_base,1);
        }

        if (null == bFlag_DoneV) {
            if (sCustomParmV != "") {
                TryToConvert(sCustomParmV);
            } else {
                postfix = ".v";
                TryToConvert('-i "'+fullpath_base+ '" -an -c:v copy -y -f mp4 "'+fullpath_base+postfix+'"');
                if (nExitFlag == 0) {
                    CanOpen(fullpath_base + postfix,1);
                }
                if (null == bFlag_DoneV) {
                    Vegas.Project.MediaPool.Remove(fullpath_base + postfix);
                    TryToConvert('-hwaccel cuvid -hwaccel_output_format cuda -y -i "'+fullpath_base+ '" -an -c:v h264_nvenc -preset p6 -tune ll -b:v 5M -bufsize 5M -maxrate 10M -qmin 0 -g 250 -bf 3 -b_ref_mode middle -temporal-aq 1 -rc-lookahead 20 -i_qfactor 0.75 -b_qfactor 1.1 -y -f mp4 "'+fullpath_base+postfix+'"');
                    if (nExitFlag != 0) {
                        TryToConvert('-i "'+fullpath_base+ '" -an -c:v libx264 -preset veryfast -crf 15 -y -f mp4 "'+fullpath_base+postfix+'"');
                    }
                } else {
                    nExitFlag = 1;
                }
            }
            if (nExitFlag == 0) {
                CanOpen(fullpath_base + postfix,0);
                if (null == bFlag_DoneV) {
                    Vegas.Project.MediaPool.Remove(fullpath_base + postfix);
                }
            }
        }
        if (null == bFlag_DoneA) {
            if (sCustomParmA != "") {
                TryToConvert(sCustomParmA);
            } else {
                //postfix = ".a.wav";
                //TryToConvert('-i "'+fullpath_base+'" -vn -c:a pcm_s16le -ar 48000 -y "'+fullpath_base+postfix+'"');
                postfix = ".a";
                TryToConvert('-i "'+fullpath_base+'" -vn -c:a pcm_s16le -ar 48000 -y -f wav "'+fullpath_base+postfix+'"');
                //TryToConvert('-i "'+fullpath_base+'" -vn -c:a flac -sample_fmt s16 -ar 48000 -y -f flac "'+fullpath_base+postfix+'"');
            }
            if (nExitFlag == 0) {
                CanOpen(fullpath_base + postfix,0);
                if (null == bFlag_DoneA) {
                    Vegas.Project.MediaPool.Remove(fullpath_base + postfix);
                }
            }
        }

        if (null != tStrmLength) {
            tEventLoc = tEventLoc + tStrmLength;
            Vegas.UpdateUI();
        }

        var mOrphanPoolItem = Vegas.Project.MediaPool.Find(fullpath_base);

        if (null != mOrphanPoolItem) {
            if (mOrphanPoolItem.UseCount <= 0) {
                Vegas.Project.MediaPool.Remove(fullpath_base);
            }
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

function CanOpen(f_path,bGetProbe) {
    var mMedia = new Media(f_path);
    try {
    for (var sTmpStm in mMedia.Streams) {
        var newVid = null;
        var newAud = null;
        if (null == tStrmLength) {
            tStrmLength = sTmpStm.Length;
            if (tStrmLength <= Timecode.FromFrames(2)) {
                tStrmLength = Timecode.FromMilliseconds(3000);
            }
        }
        if (null == newsGroup) {
            newsGroup = new TrackEventGroup();
            Vegas.Project.Groups.Add(newsGroup);
        }

        if (sTmpStm.MediaType == MediaType.Video) {
            // retrieve fps probe for first try
            if (sTmpStm.FrameRate > 2.0 && bGetProbe == 1) {
                var tmpPostfix = ".v.tmp";
                TryToConvert('-i "'+f_path+ '" -an -c:v libx264 -preset ultrafast -t 1 -y -f mp4 "'+f_path+tmpPostfix+'"');
                if (nExitFlag == 0) {
                    var mTempMedia = new Media(f_path+tmpPostfix);
                    for (var sTmpStm2 in mTempMedia.Streams) {
                        if (sTmpStm2.MediaType == MediaType.Video) {
                            if (sTmpStm2.FrameRate != sTmpStm.FrameRate) {
                                nExitFlag = 1;
                                break;
                            }
                        }
                    }
                    Vegas.Project.MediaPool.Remove(f_path+tmpPostfix);
                    if (File.Exists(f_path+tmpPostfix)) {
                        File.Delete(f_path+tmpPostfix);
                    }
                    if (nExitFlag == 1) {
                        nExitFlag = 0;
                        continue;
                    }
                }
            }
            // ***
            while (1) {
                for (var nTmpVIndex = Vegas.Project.Tracks.Count; nTmpVIndex > 0; nTmpVIndex--) {
                    if (Vegas.Project.Tracks[nTmpVIndex-1].IsVideo()) {
                        bFlag_DoneV = 1;
                        newVid = new VideoEvent(tEventLoc, tStrmLength);
                        Vegas.Project.Tracks[nTmpVIndex-1].Events.Add(newVid);
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
            while (1) {
                for (var tTmpTrk in Vegas.Project.Tracks) {
                    if (tTmpTrk.IsAudio()) {
                        bFlag_DoneA = 1;
                        newAud = new AudioEvent(tEventLoc, tStrmLength);
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
    prog1.StartInfo.CreateNoWindow = false;
    prog1.StartInfo.RedirectStandardError = false;
	prog1.StartInfo.RedirectStandardOutput = false;
    prog1.StartInfo.UseShellExecute = false;
    prog1.StartInfo.FileName = sFFMpegPath;
    prog1.StartInfo.Arguments = sArgs;
    prog1.Start();
    //MessageBox.Show(prog1.StandardError.ReadToEnd());
    prog1.WaitForExit();
    nExitFlag = prog1.ExitCode;
    prog1.Close();
}

function GetVideoDialog() {
    var openFileDialog = new OpenFileDialog();
    openFileDialog.Filter = "Любые медиа (*.*)|*.*";
    openFileDialog.Title = "Импорт файлов. Для обязательной конверсии держите Ctrl при нажатии Открыть.";
    openFileDialog.Multiselect = true;
    var initialDir2 = Path.GetDirectoryName(Vegas.Project.FilePath);
    if (Directory.Exists(initialDir2)) {
        openFileDialog.InitialDirectory = initialDir2;
    } else {
        var bFirstMediaEvent = 0;
        for (var tTmpTrk3 in Vegas.Project.Tracks) {
            for (var eTmpEvt in tTmpTrk3.Events) {
                if (eTmpEvt.ActiveTake != null) {
                    if (eTmpEvt.ActiveTake.MediaPath != null) {
                        initialDir2 = Path.GetDirectoryName(eTmpEvt.ActiveTake.MediaPath);
                        if (Directory.Exists(initialDir2)) {
                            openFileDialog.InitialDirectory = initialDir2;
                            bFirstMediaEvent = 1;
                            break;
                        }
                    }
                }
            }
            if (bFirstMediaEvent == 1) {
                break;
            }
        }
        if (bFirstMediaEvent != 1) {
            openFileDialog.InitialDirectory = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal);
        }
    }
    if (System.Windows.Forms.DialogResult.OK == openFileDialog.ShowDialog()) {
        return openFileDialog.FileNames;
    } else {
        return null;
    }
}