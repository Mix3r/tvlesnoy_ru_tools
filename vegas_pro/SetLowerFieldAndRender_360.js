/**
* Render - batch render --- NARRATOR & dup hunt
* make regions with full paths to batch render
**/
import System;
import System.Text;
import System.IO;
import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;

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
	var templateYT = /YOUTUBE30/;
	var extRE = /.MP4/;
	var bFirstMediaEvent = 0;
        var nMTSOffset = 40;

        //
        var buses = new Enumerator(Vegas.Project.BusTracks);
        var nBusnum = 0;
        while (!buses.atEnd()) {
                nBusnum = nBusnum + 1;
                buses.moveNext();
        }
        if (nBusnum <= 2) {
                var busA = new AudioBusTrack(Vegas.Project);
                Vegas.Project.BusTracks.Add(busA);
                var afx = PlugInNode(Vegas.AudioFX.FindChildByUniqueID("{8010C341-6D4C-4390-B828-E4D246C3DDB2}"));
                //MessageBox.Show(afx.UniqueID);
                busA.Effects.AddEffect(afx);
                busA.Effects[0].Preset = "TV_ГОЛОС_TV";
                var busB = new AudioBusTrack(Vegas.Project);
                Vegas.Project.BusTracks.Add(busB);
                busB.Effects.AddEffect(afx);
                busB.Effects[0].Preset = "TV_ИНТЕРШУМ_TV";
                var busC = new AudioBusTrack(Vegas.Project);
                Vegas.Project.BusTracks.Add(busC);
                var mfx = PlugInNode(Vegas.AudioFX.FindChildByUniqueID("{A6A78627-D619-48BF-AD26-0C6B44B5C7D8}"));
                busC.Effects.AddEffect(afx);
                busC.Effects.AddEffect(mfx);
                busC.Effects[0].Preset = "TV_ИНТЕРШУМ_TV";
                busC.Effects[1].Preset = "TV_MUFFLE";
        }
        //

	var renderer : Renderer = FindRenderer();

        if (null == renderer)
                throw "failed to find renderer";

        var renderTemplate :RenderTemplate = FindRenderTemplate(renderer, templateRE);

        if (null == renderTemplate)
                throw "failed to find render template";

        var renderTemplateYT :RenderTemplate = FindRenderTemplate(renderer, templateYT);

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
                while (!evnts.atEnd()) {
                        if (bFirstMediaEvent == 0) {
                                var sLocalname = "";
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
                                if (bFirstMediaEvent != 0) {
                                        var cmdenum = new Enumerator(Vegas.Project.CommandMarkers);
                                        var mCMText = new MarkerCommandType("TEXT");
                                        while (!cmdenum.atEnd()) {
                                                var cmdent : CommandMarker = CommandMarker(cmdenum.item());
                                                if (cmdent.Position == Timecode.FromMilliseconds(0)) {
                                                        bFirstMediaEvent = 2;
                                                        cmdent.SetCommand(mCMText,sLocalname);
                                                        break;
                                                }
                                                cmdenum.moveNext();
                                        }
                                        if (bFirstMediaEvent != 2) {
                                                var First_ID = new CommandMarker(Timecode.FromMilliseconds(0),mCMText,sLocalname);
                                                Vegas.Project.CommandMarkers.Add(First_ID);
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
                                                                                if (mm3.FrameRate == 25.000 && mm3.Format == "MPEG-2") {
                                                                                        mm3.FieldOrder = "UpperFieldFirst";
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
                                                if (Envelope(envlps.item()).Points[0].Y == 0.0) {
                                                        envl_num = 0;
                                                        break;
                                                }
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
                                                        var renderStatus = Vegas.Render(rgn.Label + "." + String(extRE).substring(2,String(extRE).length-1), renderTemplate,rgn.Position,rgn.Length);
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
                        Prepare4air();
                        var renderStatus = Vegas.Render(rgn2.Label, renderTemplate,rgn2.Position,rgn2.Length);
                }
	        regionEnum2.moveNext();
        }
        if (numregions2 > 0) {
                var regionEnumB = new Enumerator(Vegas.Project.Regions);
                while (!regionEnumB.atEnd()) {
                        var rgnB : Region = Region(regionEnumB.item());
                        var rgnB_st = rgnB.Label.substring(1,2);
                        if ((rgnB_st == ":" || rgnB_st == "\\") && Vegas.Transport.LoopRegionStart <= rgnB.Position && Vegas.Transport.LoopRegionStart+Vegas.Transport.LoopRegionLength >= rgnB.Position+rgnB.Length) {
                                if (rgnB.Label.length < 5) {
		                        rgnB.Label = rgnB.Label + ex_t;
	                        }
	                        if (rgnB.Label.substring(rgnB.Label.length-4).toUpperCase() != ex_t.toUpperCase()) {
		                        rgnB.Label = rgnB.Label + ex_t;
	                        }
                                if (null == renderTemplateYT) throw "failed to find YouTube template";
                                var renderStatus = rgnB.Label.lastIndexOf('\\');
                                renderStatus = rgnB.Label.substring(0,renderStatus+1) + YTFolder + rgnB.Label.substring(renderStatus);
                                Prepare4YT();
                                Vegas.Project.Video.DeinterlaceMethod = "None";
                                // renderStatus = Vegas.Render(renderStatus, renderTemplateYT,rgnB.Position,rgnB.Length);
                                Vegas.Project.Video.DeinterlaceMethod = "InterpolateFields";
                        }
                        regionEnumB.moveNext();
                }
                throw "ok1";
        }

	var ofn = ShowSaveFileDialog("Видео (*"+ex_t+")|*"+ex_t, ex_t+" для эфира - "+renderer.FileTypeName, titl);

	if (ofn.length < 5) {
		ofn = ofn + ex_t;
	}
	titl = ofn.substring(ofn.length-4);
	if (titl.toUpperCase() != ex_t.toUpperCase()) {
		ofn = ofn + ex_t;
	}
        Prepare4air();
        var renderStatus = Vegas.Render(ofn, renderTemplate,Vegas.Transport.LoopRegionStart,Vegas.Transport.LoopRegionLength);
        if (bFirstMediaEvent == 3) {
                // skip narrator for youtube
                throw "ok1";
        }
        if (null == renderTemplateYT) throw "failed to find YouTube template";
        renderStatus = ofn.lastIndexOf('\\');
        renderStatus = ofn.substring(0,renderStatus+1) + YTFolder + ofn.substring(renderStatus);
        Prepare4YT();
        Vegas.Project.Video.DeinterlaceMethod = "None";
        // renderStatus = Vegas.Render(renderStatus, renderTemplateYT,Vegas.Transport.LoopRegionStart,Vegas.Transport.LoopRegionLength);
        Vegas.Project.Video.DeinterlaceMethod = "InterpolateFields";
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
        Vegas.Project.Video.DeinterlaceMethod = "InterpolateFields";
        if (e != "ok1" && e != "Error: Object required") {
	        MessageBox.Show(e);
        }
}

function Prepare4air() {
        var tmplogotrack = null;
        var tr3enum = new Enumerator(Vegas.Project.Tracks);
        while (!tr3enum.atEnd()) {
                if (Track(tr3enum.item()).Name == "_tmplogo") {
                        tmplogotrack = Track(tr3enum.item());
                        break;
                }
                tr3enum.moveNext();
        }
        if (null != tmplogotrack) {
                Vegas.Project.Tracks.Remove(tmplogotrack);
                Vegas.UpdateUI();
        }
}

function Prepare4YT() {
        var trks = new Enumerator(Vegas.Project.Tracks);
        while (!trks.atEnd()) {
                if (Track(trks.item()).Name == "_tmplogo") {
                        return;
                }
                trks.moveNext();
        }

        var tmptrack = new VideoTrack(0, "_tmplogo");
        Vegas.Project.Tracks.Add(tmptrack);
        var media = new Media("C:\\Program Files\\VEGAS\\tvlesnoy_banners.veg");
        var stream = media.Streams[0]; //The "video" stream
        var newEvent = new VideoEvent(Vegas.Transport.LoopRegionStart,Vegas.Transport.LoopRegionLength);
        tmptrack.Events.Add(newEvent);
        var take = new Take(stream);
	newEvent.Takes.Add(take);
	take.Offset = Timecode.FromMilliseconds(2250);
        newEvent.VideoMotion.ScaleToFill = 1;
        newEvent.MaintainAspectRatio = null;
        TrackEvent(newEvent).Loop = null;
        newEvent.ResampleMode = "Disable";
        var vlc = new Envelope(EnvelopeType.Velocity);
        newEvent.Envelopes.Add(vlc);
        vlc.Points[0].Y = 0.0;
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
        //var moveby2 = new VideoMotionVertex(-1*(key_frame.Center.X+Vegas.Project.Video.Width*0.5-d_width*2.4),-1*(key_frame.Center.Y-Vegas.Project.Video.Height*0.5+d_height*0.96+1));
        //key_frame.MoveBy(moveby2);
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