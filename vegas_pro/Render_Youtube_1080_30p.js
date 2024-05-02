/**
* Render  otv
* wave hammer attack fixed
**/
import System;
import System.Text;
import System.IO;
import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;
var writer : StreamWriter = null;
var sLocalname = null;

try {
	Vegas.Project.Video.Width = 1920;
	Vegas.Project.Video.Height = 1080;
	Vegas.Project.Video.FrameRate = 25;
	Vegas.Project.Video.FieldOrder = "UpperFieldFirst";
	Vegas.Project.Video.PixelAspectRatio = 1;
	Vegas.Project.Video.MotionBlurType = "Gaussian";
	Vegas.Project.Video.DeinterlaceMethod = "InterpolateFields";
	Vegas.Project.Video.RenderQuality = "Best";

	Vegas.Project.Audio.SampleRate = 48000;
	Vegas.Project.Audio.BitDepth = 16;
	Vegas.Project.Audio.ResampleQuality = "Best";

	Vegas.Project.Ruler.Format = "TimeAndFrames";
	Vegas.Project.Ruler.BeatsPerMinute = 60;
	Vegas.Project.Ruler.BeatsPerMeasure = 4;
        Vegas.Project.Ruler.StartTime = Timecode.FromMilliseconds(0);

        const YTFolder = "CЮЖЕТЫ ЮТУБ";

	var templateRE = /HQ 1920x1080-50i, /;
	var templateWAV = /48 000 Hz; 16 Bit; Stereo, P/;
        var templateWAVRU = /48 000 Гц; 16 Бит; Стерео, P/;
	var extRE = /.MP4/;
        var extREWAV = /.wav/;
	var bFirstMediaEvent = 0;
        var nMTSOffset = 40;
        var nWAVTrackCount = 0;
        var tcSafePos = Timecode.FromMilliseconds(0);

	var renderer : Renderer = FindRenderer();

        if (null == renderer)
                throw "failed to find renderer";

        var renderTemplate :RenderTemplate = FindRenderTemplate(renderer, templateRE);

        if (null == renderTemplate)
                throw "failed to find render template";

        //var renderTemplateYT :RenderTemplate = FindRenderTemplate(renderer, templateYT);
        var renderTemplateYT = null;
        var rendererEnum2 : Enumerator = new Enumerator(Vegas.Renderers);
        while (!rendererEnum2.atEnd()) {
                if (null != Renderer(rendererEnum2.item()).FileExtension.match(extREWAV)) {
			renderTemplateYT = FindRenderTemplate(Renderer(rendererEnum2.item()), templateWAV);
			if (null != renderTemplateYT) {
                                break;
                        } else {
                                renderTemplateYT = FindRenderTemplate(Renderer(rendererEnum2.item()), templateWAVRU);
                                if (null != renderTemplateYT) {
                                    break;
                                }
                        }
                }
                rendererEnum2.moveNext();
        }

	var titl = Path.GetFileNameWithoutExtension(Vegas.Project.FilePath);
        var nEventStart = Vegas.Transport.LoopRegionStart;

        var trks = new Enumerator(Vegas.Project.Tracks);
        while (!trks.atEnd()) {
                // duplicates hunt procedure
                if (Track(trks.item()).IsAudio()) {
                var bDups_present = 1;
                while(bDups_present == 1) {
                    bDups_present = 0;
                    var dups = new Enumerator(Track(trks.item()).Events);
                    var lasteventstart = Timecode.FromMilliseconds(0);
		    var lasteventlength = Timecode.FromMilliseconds(0);
                    var prev_item = null;
                    while (!dups.atEnd()) {
                        if (null != prev_item && TrackEvent(dups.item()).Start == lasteventstart && TrackEvent(dups.item()).Length == lasteventlength) {
                            Track(trks.item()).Events.Remove(TrackEvent(prev_item));
                            bDups_present = 1;
                            break;
                        }
                        lasteventstart = TrackEvent(dups.item()).Start;
			lasteventlength = TrackEvent(dups.item()).Length;
                        prev_item = dups.item();
                        dups.moveNext();
                    }
                }
                }
                //
                var evnts = new Enumerator(Track(trks.item()).Events);
                var sTrkName = Track(trks.item()).Name;
                while (!evnts.atEnd()) {
                        if (bFirstMediaEvent == 0) {
				if (Vegas.Project.FilePath != null) {
                                        sLocalname = Path.GetDirectoryName(Vegas.Project.FilePath);
                                        bFirstMediaEvent = 1;
				} else {
                                        if (TrackEvent(evnts.item()).ActiveTake != null) {
                                                if (TrackEvent(evnts.item()).ActiveTake.MediaPath != null) {
                                                        sLocalname = Path.GetDirectoryName(TrackEvent(evnts.item()).ActiveTake.MediaPath);
                                                        var sMpPart = sLocalname.substring(1,2);
                                                        if (sMpPart == ":" || sMpPart == "\\") {
                                                                bFirstMediaEvent = 1;
                                                        }
                                                }
                                        }
                                }
                        }
                        if (TrackEvent(evnts.item()).Start+TrackEvent(evnts.item()).Length > Vegas.Transport.LoopRegionStart && TrackEvent(evnts.item()).Start < Vegas.Transport.LoopRegionStart+Vegas.Transport.LoopRegionLength)
                        if (TrackEvent(evnts.item()).IsVideo()) {
                                var nEventDelta = TrackEvent(evnts.item()).Start - nEventStart;
                                nEventDelta = nEventDelta.ToMilliseconds();
                                if (nEventDelta > 0 && nEventDelta <= 200) {
                                        Vegas.Transport.CursorPosition = nEventStart;
                                        Vegas.UpdateUI();
                                        MessageBox.Show("Чёрная дыра на "+nEventStart.ToString(RulerFormat.TimeAndFrames));
                                }
                                nEventStart = TrackEvent(evnts.item()).Start + TrackEvent(evnts.item()).Length;
                                var envl_num = 0;
                                if (null != TrackEvent(evnts.item()).ActiveTake) {
                                        if (null != TrackEvent(evnts.item()).ActiveTake.MediaPath) {
                                                var media3 = Vegas.Project.MediaPool[TrackEvent(evnts.item()).ActiveTake.MediaPath];
                                                if (null != media3) {
                                                        if (media3.IsOffline()) {
                                                        } else {
                                                                if (media3.HasVideo()) {
                                                                        var mm3 = new media3.Streams();
                                                                        if (mm3.Width == 1920 && mm3.Height == 1080) {
                                                                                if (sTrkName == "Titles_Arch" || sTrkName == "Titles_A" || sTrkName == "Titles_BG") {
                                                                                    if (mm3.FrameRate >= 25.000) {
                                                                                        Vegas.Transport.CursorPosition = nEventStart;
                                                                                        Vegas.UpdateUI();
                                                                                        throw "Видеоналожение на дорожке для титров на "+nEventStart.ToString(RulerFormat.TimeAndFrames);
                                                                                    }
                                                                                }
                                                                                if (mm3.FrameRate == 25.000 && mm3.Format == "MPEG-2") {
                                                                                        mm3.FieldOrder = "UpperFieldFirst";
                                                                                //} else if (mm3.Format == "Фото - JPEG" && mm3.FrameRate == 25.000) {
                                                                                        //mm3.FieldOrder = "UpperFieldFirst";
                                                                                //}  else if (mm3.Format == "Sony Motion JPEG" && mm3.FrameRate == 25.000) {
                                                                                        //mm3.FieldOrder = "UpperFieldFirst";
                                                                                }
                                                                        }
                                                                        //if (mm3.FieldOrder != "ProgressiveScan") {
                                                                        //        envl_num = 999;
                                                                        //}
                                                                }
                                                        }
                                                }
                                        }
                                }
                                if (envl_num == 0) {
                                        var envlps = new Enumerator(VideoEvent(evnts.item()).Envelopes);
                                        while (!envlps.atEnd()) {
                                                envl_num = envl_num + 1;
                                                envlps.moveNext();
                                        }
                                }
                                if (VideoEvent(evnts.item()).ResampleMode == "Force") {
                                        // don't change resample mode
                                } else if (TrackEvent(evnts.item()).PlaybackRate < 1 || envl_num > 0) {
                                        VideoEvent(evnts.item()).ResampleMode = "Smart";
                                } else {
                                        VideoEvent(evnts.item()).ResampleMode = "Disable";
                                }
                                VideoEvent(evnts.item()).ReduceInterlace = null;
                        } else {
                                if (null != TrackEvent(evnts.item()).ActiveTake) {
                                        if (null != TrackEvent(evnts.item()).ActiveTake.MediaPath) {
                                                var media3a = Path.GetExtension(TrackEvent(evnts.item()).ActiveTake.MediaPath);
                                                if (null != media3a) {
                                                        media3a = media3a.toUpperCase();
                                                        if (media3a == ".MTS") {
                                                                Vegas.Project.Ruler.StartTime = Timecode.FromMilliseconds(nMTSOffset);
                                                                TrackEvent(evnts.item()).Start = TrackEvent(evnts.item()).Start + Vegas.Project.Ruler.StartTime;
                                                        }
                                                }
                                        }
                                }
                        }
                        evnts.moveNext();
                }
                trks.moveNext();
        }

        VocSmoother();
        Vegas.UpdateUI();

	if (Vegas.Project.Summary.Title == "narrator") {
                bFirstMediaEvent = 3;
                var numregions = 0;
                var regionEnum = new Enumerator(Vegas.Project.Regions);
                while (!regionEnum.atEnd()) {
	                var rgn : Region = Region(regionEnum.item());
                        var trackEnum = new Enumerator(Vegas.Project.Tracks);
                        while (!trackEnum.atEnd()) {
			        var track2 : Track = Track(trackEnum.item());
                                if (track2.IsAudio()) {
			                var evntEnum = new Enumerator(track2.Events);
			                while (!evntEnum.atEnd()) {
				                var evnt2 : TrackEvent = TrackEvent(evntEnum.item());
                                                var bMTSMoved = Timecode.FromMilliseconds(0);

                                                if (Vegas.Project.Ruler.StartTime != bMTSMoved && null != evnt2.ActiveTake) { //something moved
                                                        if (null != evnt2.ActiveTake.MediaPath) {
                                                                var eMPath_0 = Path.GetExtension(evnt2.ActiveTake.MediaPath);
                                                                if (null != eMPath_0) {
                                                                        eMPath_0 = eMPath_0.toUpperCase();
                                                                        if (eMPath_0 == ".MTS") {
                                                                                bMTSMoved = Vegas.Project.Ruler.StartTime;
                                                                        }
                                                                }
                                                        }
                                                }

				                if (evnt2.Start - bMTSMoved == rgn.Position) {
                                                        numregions = numregions+1;
                                                        rgn.Label = Vegas.Project.Summary.Copyright+evnt2.ActiveTake.Name+" (OK)";
                                                        var renderStatus = Vegas.Render(rgn.Label + "." + String(extRE).substring(2,String(extRE).length-1), renderTemplateYT,rgn.Position,Timecode.FromMilliseconds(3000));
                                                        renderStatus = Vegas.Render(rgn.Label + "." + String(extRE).substring(2,String(extRE).length-1), renderTemplate,rgn.Position,rgn.Length);
				                }
			 	                evntEnum.moveNext();
			                }
                                }
			        trackEnum.moveNext();
		        }
	                regionEnum.moveNext();
                }
                if (numregions > 0) {
                        throw "ok1";
                        // exit from here after batch render of narrator stuff
                }

		var trackEnum = new Enumerator(Vegas.Project.Tracks);
		while (!trackEnum.atEnd()) {
			var track : Track = Track(trackEnum.item());
			var evntEnum = new Enumerator(track.Events);
			while (!evntEnum.atEnd()) {
				var evnt : TrackEvent = TrackEvent(evntEnum.item());
				if (evnt.Selected) {
					titl = evnt.ActiveTake.Name+" (OK)";
				}
				evntEnum.moveNext();
			}
			trackEnum.moveNext();
		}
	} else {
        }

	titl = Vegas.Project.Summary.Copyright+titl;
        var ex_t = String(extRE).substring(1,String(extRE).length-1);

        ////
        var regionEnum2 = new Enumerator(Vegas.Project.Regions);
        var numregions2 = 0;
        while (!regionEnum2.atEnd()) {
	        var rgn2 : Region = Region(regionEnum2.item());
                var rgn2_st = rgn2.Label.substring(1,2);
                if ((rgn2_st == ":" || rgn2_st == "\\") && Vegas.Transport.LoopRegionStart <= rgn2.Position && Vegas.Transport.LoopRegionStart+Vegas.Transport.LoopRegionLength >= rgn2.Position+rgn2.Length) {
                        numregions2 = numregions2+1;
                        if (rgn2.Label.length < 5) {
		                rgn2.Label = rgn2.Label + ex_t;
	                }
	                if (rgn2.Label.substring(rgn2.Label.length-4).toUpperCase() != ex_t.toUpperCase()) {
		                rgn2.Label = rgn2.Label + ex_t;
	                }
                        Prepare4OTV();
                        var renderStatus = Vegas.Render(rgn2.Label, renderTemplateYT,rgn2.Position,Timecode.FromMilliseconds(3000));
                        renderStatus = Vegas.Render(rgn2.Label, renderTemplate,rgn2.Position,rgn2.Length);
                }
	        regionEnum2.moveNext();
        }
        if (numregions2 > 0) {
                throw "ok1";
        }

        var scenery1 = GetSceneryDialog();

	var ofn = ShowSaveFileDialog("Видео (*"+ex_t+")|*"+ex_t, ex_t+" для ОТВ эфира - "+renderer.FileTypeName, titl);

	if (ofn.length < 5) {
		ofn = ofn + ex_t;
	}
	titl = ofn.substring(ofn.length-4);
	if (titl.toUpperCase() != ex_t.toUpperCase()) {
		ofn = ofn + ex_t;
	}
        Prepare4OTV();
        var renderStatus = Vegas.Render(ofn, renderTemplateYT,Vegas.Transport.LoopRegionStart,Timecode.FromMilliseconds(3000));
        renderStatus = Vegas.Render(ofn, renderTemplate,Vegas.Transport.LoopRegionStart,Vegas.Transport.LoopRegionLength);
        var vwpath = "\""+ofn+"\"";
        /////////////////////////
        if (null == renderTemplateYT || renderStatus != "Complete") {
            throw "failed to find render template WAV";
        } else {
            var ex_tWAV = String(extREWAV).substring(1,String(extREWAV).length-1);
            titl = ofn.substring(0,ofn.length-ex_t.length);
            //////////////
            var trackEnumSND = new Enumerator(Vegas.Project.Tracks);
            while (!trackEnumSND.atEnd()) {
                if (Track(trackEnumSND.item()).IsAudio()) {
                    var evts2safe = new Enumerator(Track(trackEnumSND.item()).Events);
                    while (!evts2safe.atEnd()) {
                        if (TrackEvent(evts2safe.item()).Start+TrackEvent(evts2safe.item()).Length > tcSafePos) {
                            tcSafePos = TrackEvent(evts2safe.item()).Start+TrackEvent(evts2safe.item()).Length;
                        }
                        evts2safe.moveNext();
                    }
                }
                trackEnumSND.moveNext();
            }
            // retreat to quiet place behind all sound events:
            tcSafePos = tcSafePos + Timecode.FromMilliseconds(1000);
            Vegas.Transport.LoopRegionStart = Vegas.Transport.LoopRegionStart + tcSafePos;
            //////////////

            var trackEnumSND2 = new Enumerator(Vegas.Project.Tracks);
            while (!trackEnumSND2.atEnd()) {
                if (Track(trackEnumSND2.item()).IsAudio()) {
                    if (Track(trackEnumSND2.item()).Mute == 1) {
                    } else {
                        var evts2move = new Enumerator(Track(trackEnumSND2.item()).Events);
                        var trkevcount = 0;
                        while (!evts2move.atEnd()) {
                            trkevcount = trkevcount + 1;
                            evts2move.moveNext();
                        }
                        /////////////// events are present
                        if (trkevcount > 0) {
                            //////// move track items to safe pos
                            while (trkevcount > 0) {
                                Track(trackEnumSND2.item()).Events[trkevcount-1].Start = Track(trackEnumSND2.item()).Events[trkevcount-1].Start + tcSafePos;
                                trkevcount = trkevcount - 1;
                            }
                            ////////
                            nWAVTrackCount = nWAVTrackCount + 1;
                            ofn = titl + "_звук_" + nWAVTrackCount.ToString() + "_дорожка" + ex_tWAV;
                            Vegas.UpdateUI();
                            renderStatus = Vegas.Render(ofn, renderTemplateYT,Vegas.Transport.LoopRegionStart,Vegas.Transport.LoopRegionLength);
                            var vwpath = vwpath + ", \""+ofn+"\"";
                            Vegas.UpdateUI();
                            // move items back
                            var evts2back = new Enumerator(Track(trackEnumSND2.item()).Events);
                            while (!evts2back.atEnd()) {
                                TrackEvent(evts2back.item()).Start = TrackEvent(evts2back.item()).Start - tcSafePos;
                                evts2back.moveNext();
                            }
                            Vegas.UpdateUI();
                            if (renderStatus != "Complete") {
                                throw "He OK.";
                            }
                        }
                    }
                }
                trackEnumSND2.moveNext();
            }

            Vegas.Transport.LoopRegionStart = Vegas.Transport.LoopRegionStart - tcSafePos;
            Vegas.UpdateUI();

            ////// write script
            writer = new StreamWriter(titl + "_Упаковать_для_ОТВ.ps1", false, System.Text.Encoding.Unicode);
            //writer.WriteLine("$compress = @{");
            //writer.WriteLine("CompressionLevel = \"NoCompression\"");
            //writer.WriteLine("DestinationPath = \""+titl+"_комплект.zip\"");
            //writer.WriteLine("Path = "+vwpath);
            //writer.WriteLine("}");
            writer.WriteLine("$disposeofit = @{");
            ///
            //var vwpath = vwpath + ", \""+titl+ex_t+".sf*"+"\""; //sfk sfl remover w compression
            var vwpath = "\""+titl+ex_t+".sf*"+"\""; //sfk sfl remover w/o compression
            ///
            writer.WriteLine("Path = "+vwpath);
            writer.WriteLine("}");
            //writer.WriteLine("Compress-Archive @compress -Force");
            writer.WriteLine("Remove-Item @disposeofit -Force");
            // copy scenery
            if (null != scenery1) {
                vwpath = Path.GetDirectoryName(titl+ex_t);
                writer.WriteLine("Copy-Item \""+scenery1+"\" -Destination \""+vwpath+"\"");
            }
            writer.WriteLine("Remove-Item $MyInvocation.MyCommand.Path -Force");
            writer.Close();
            var prog1 = new System.Diagnostics.Process();
	    var prog1_nfo = new System.Diagnostics.ProcessStartInfo();
	    prog1_nfo.FileName = "powershell.exe";
            prog1_nfo.Arguments = "-ExecutionPolicy Bypass -File \"" + titl + "_Упаковать_для_ОТВ.ps1"+"\"";
            prog1.StartInfo = prog1_nfo;
            prog1.Start();
            /////
        }

        /////////////////////////
        throw "ok1";
}

catch (e) {
        var tr2enum = new Enumerator(Vegas.Project.Tracks);
        if (Vegas.Project.Ruler.StartTime != Timecode.FromMilliseconds(0)) {
             while (!tr2enum.atEnd()) {
                  if (Track(tr2enum.item()).IsAudio()) {
                          var evts2enum = new Enumerator(Track(tr2enum.item()).Events);
                          while (!evts2enum.atEnd()) {
                                  if (TrackEvent(evts2enum.item()).Start+TrackEvent(evts2enum.item()).Length > Vegas.Transport.LoopRegionStart && TrackEvent(evts2enum.item()).Start < Vegas.Transport.LoopRegionStart+Vegas.Transport.LoopRegionLength)
                                  if (TrackEvent(evts2enum.item()).IsAudio()) {
                                          if (null != TrackEvent(evts2enum.item()).ActiveTake) {
                                                  if (null != TrackEvent(evts2enum.item()).ActiveTake.MediaPath) {
                                                          var media2back = Path.GetExtension(TrackEvent(evts2enum.item()).ActiveTake.MediaPath);
                                                          if (null != media2back) {
                                                                  media2back = media2back.toUpperCase();
                                                                  if (media2back == ".MTS") {
                                                                          TrackEvent(evts2enum.item()).Start = TrackEvent(evts2enum.item()).Start - Vegas.Project.Ruler.StartTime;
                                                                  }
                                                          }
                                                  }
                                          }
                                  }
                                  evts2enum.moveNext();
                          }
                  }
                  tr2enum.moveNext();
             }
             Vegas.Project.Ruler.StartTime = Timecode.FromMilliseconds(0);
        }
        Prepare4air();
        if (e != "ok1" && e != "Error: Object required") {
	        MessageBox.Show(e);
        }
        //////////////
        var prog1 = new System.Diagnostics.Process();
        prog1.StartInfo.FileName = "cmd.exe";
        prog1.StartInfo.Arguments = "/c echo|set /p="+sLocalname+"|clip";
        prog1.StartInfo.UseShellExecute = false;
        prog1.StartInfo.CreateNoWindow = true;
        prog1.Start();
        //////////////
}

function VocSmoother() {
    const minimum_voc_in_fade = Timecode.FromMilliseconds(520);
    var voc_t = new Enumerator(Vegas.Project.Tracks);
    while (!voc_t.atEnd()) {
        if (Track(voc_t.item()).IsAudio()) {
            if (Track(voc_t.item()).BusTrack.Name == 'Bus A' || Track(voc_t.item()).BusTrack.Name == 'Шина A') {
                var vocs = new Enumerator(Track(voc_t.item()).Events);
                var prev_vocitem = null;
                while (!vocs.atEnd()) {
                    if (null != prev_vocitem && TrackEvent(vocs.item()).Start <= TrackEvent(prev_vocitem).Start + TrackEvent(prev_vocitem).Length + Timecode.FromFrames(1)) {
                    } else if (TrackEvent(vocs.item()).FadeIn.Length < minimum_voc_in_fade) {
                            TrackEvent(vocs.item()).FadeIn.Length = minimum_voc_in_fade;
                            TrackEvent(vocs.item()).FadeIn.Curve = CurveType.Fast;
                    }
                    prev_vocitem = vocs.item();
                    vocs.moveNext();
                }
            }
        }
        voc_t.moveNext();
    }
    return null;
}

function Prepare4air() {
        var tmplogotrack = null;
        var tr3enum = new Enumerator(Vegas.Project.Tracks);
        while (!tr3enum.atEnd()) {
                if (Track(tr3enum.item()).Name == "Titles_Arch") {
                        Track(tr3enum.item()).Mute = null;
                } else if (Track(tr3enum.item()).Name == "Titles_A") {
                        Track(tr3enum.item()).Mute = null;
                } else if (Track(tr3enum.item()).Name == "Titles_BG") {
                        Track(tr3enum.item()).Mute = null;
                }
                tr3enum.moveNext();
        }
        Vegas.UpdateUI();
}

function Prepare4OTV() {
        var trks = new Enumerator(Vegas.Project.Tracks);
        while (!trks.atEnd()) {
                if (Track(trks.item()).Name == "Titles_Arch") {
                        Track(trks.item()).Mute = 1;
                } else if (Track(trks.item()).Name == "Titles_A") {
                        Track(trks.item()).Mute = 1;
                } else if (Track(trks.item()).Name == "Titles_BG") {
                        Track(trks.item()).Mute = 1;
                }
                trks.moveNext();
        }
        Vegas.UpdateUI();
}

function FindRenderer() : Renderer {
        var rendererEnum : Enumerator = new Enumerator(Vegas.Renderers);
        while (!rendererEnum.atEnd()) {
                if (null != Renderer(rendererEnum.item()).FileExtension.match(extRE)) {
			if (null != FindRenderTemplate(Renderer(rendererEnum.item()), templateRE)) {
				return Renderer(rendererEnum.item());
			}
                }
                rendererEnum.moveNext();
        }
        return null;
}

function FindRenderTemplate(renderer : Renderer, templateRegExp : RegExp) : RenderTemplate {
        var templateEnum : Enumerator = new Enumerator(renderer.Templates);
        while (!templateEnum.atEnd()) {
                if (RenderTemplate(templateEnum.item()).Name.match(templateRegExp)) {
                        return RenderTemplate(templateEnum.item());
                }
                templateEnum.moveNext();
        }
        return null;
}

// an example filter: "PNG File (*.png)|*.png|JPEG File (*.jpg)|*.jpg"
function ShowSaveFileDialog(filter, title, defaultFilename) {
    var saveFileDialog = new SaveFileDialog();
    if (null == filter) {
        filter = "All Files (*.*)|*.*";
    }
    saveFileDialog.Filter = filter;
    if (null != title)
        saveFileDialog.Title = title;
    saveFileDialog.CheckPathExists = true;
    saveFileDialog.AddExtension = true;
    if (null != defaultFilename) {
        var initialDir = Path.GetDirectoryName(defaultFilename);
        if (Directory.Exists(initialDir)) {
            saveFileDialog.InitialDirectory = initialDir;
        }
        saveFileDialog.DefaultExt = Path.GetExtension(defaultFilename);
        saveFileDialog.FileName = Path.GetFileName(defaultFilename);
    }
    if (System.Windows.Forms.DialogResult.OK == saveFileDialog.ShowDialog()) {
        return Path.GetFullPath(saveFileDialog.FileName);
    } else {
        return null;
    }
}

function GetSceneryDialog() {
    var openFileDialog = new OpenFileDialog();
    openFileDialog.Filter = "Любой сценарий (*.*)|*.*";
        openFileDialog.Title = "Укажите файл Сценария";
        var initialDir2 = Path.GetDirectoryName(Vegas.Project.FilePath);
        if (Directory.Exists(initialDir2)) {
            openFileDialog.InitialDirectory = initialDir2;
        }
    if (System.Windows.Forms.DialogResult.OK == openFileDialog.ShowDialog()) {
        return Path.GetFullPath(openFileDialog.FileName);
    } else {
        return null;
    }
}
