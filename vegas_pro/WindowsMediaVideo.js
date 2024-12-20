/**
* Admin preview render
* wave hammer attack fixed
**/
import System;
import System.Text;
import System.IO;
import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;
var nTmpFPS = Vegas.Project.Video.FrameRate;


try {
	//Vegas.Project.Video.Width = 720;
	//Vegas.Project.Video.Height = 576;
	Vegas.Project.Video.FrameRate = 25;
	//Vegas.Project.Video.FieldOrder = "ProgressiveScan";
	//Vegas.Project.Video.PixelAspectRatio = 1.4568;       // 1.0926;
	Vegas.Project.Video.MotionBlurType = "Gaussian";
	Vegas.Project.Video.DeinterlaceMethod = "InterpolateFields";
	Vegas.Project.Video.RenderQuality = "Best";

	Vegas.Project.Audio.SampleRate = 48000;
	Vegas.Project.Audio.BitDepth = 16;
	Vegas.Project.Audio.ResampleQuality = "Best";

	Vegas.Project.Ruler.Format = "TimeAndFrames";
	Vegas.Project.Ruler.BeatsPerMinute = 60;
	Vegas.Project.Ruler.BeatsPerMeasure = 4;

	var templateRE = /360_admin/;
	var extRE = /.mp4/;
        var templateWAV = /48 000 Hz; 16 Bit; Stereo, P/;
        var templateWAVRU = /48 000 Гц; 16 Бит; Стерео, P/;
        var extREWAV = /.wav/;
	
	var renderer : Renderer = FindRenderer(templateRE);
	
        if (null == renderer)
                throw "failed to find renderer";
		
        var renderTemplate :RenderTemplate = FindRenderTemplate(renderer, templateRE);
	
        if (null == renderTemplate)
                throw "failed to find render template";

        /////////////////////
        var renderTemplateWAV = null;
        var rendererEnum2 : Enumerator = new Enumerator(Vegas.Renderers);
        while (!rendererEnum2.atEnd()) {
                if (null != Renderer(rendererEnum2.item()).FileExtension.match(extREWAV)) {
			renderTemplateWAV = FindRenderTemplate(Renderer(rendererEnum2.item()), templateWAV);
			if (null != renderTemplateWAV) {
                                break;
                        } else {
                                renderTemplateWAV = FindRenderTemplate(Renderer(rendererEnum2.item()), templateWAVRU);
                                if (null != renderTemplateWAV) {
                                    break;
                                }
                        }
                }
                rendererEnum2.moveNext();
        }
        /////////////////////

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
                        if (TrackEvent(evnts.item()).IsVideo()) {
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
                                                                }
                                                        }
                                                }
                                        }
                                }
                                if (VideoEvent(evnts.item()).ResampleMode == "Force") {
                                        // don't change resample mode
                                } else {
                                        VideoEvent(evnts.item()).ResampleMode = "Disable";
                                }
                        }
                        evnts.moveNext();
                }
                trks.moveNext();
        }

        VocSmoother();
        Vegas.UpdateUI();
		
	var projPath = Vegas.Project.FilePath;
	var titl = Path.GetFileNameWithoutExtension(projPath);

        var prog1 = new System.Diagnostics.Process();
        prog1.StartInfo.FileName = "cmd.exe";
        prog1.StartInfo.Arguments = "/c echo|set /p=^\\^\\Glavred^\\Общее^\\1 СОГЛАСОВАНИЕ^\\"+titl+"|clip";
        prog1.StartInfo.UseShellExecute = false;
        prog1.StartInfo.CreateNoWindow = true;
        prog1.Start();

	extRE = Vegas.Project.Audio.RecordedFilesFolder.toUpperCase();
	if (Vegas.Project.Summary.Title == "narrator") {
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
	}
	if (null != extRE.match(/\TEMP/)) {
		titl = Path.GetDirectoryName(projPath)+"\\"+titl;
	} else {
		titl = Vegas.Project.Video.PrerenderedFilesFolder+titl;
	}
	var ofn = ShowSaveFileDialog("MP4 Files (*.MP4)|*.MP4", "Render Win. Media Video - "+renderer.FileTypeName, titl);
	if (ofn.length < 5) {
		ofn = ofn + ".MP4";
	}
	titl = ofn.substring(ofn.length-4);
	if (titl.toUpperCase() != ".MP4") {
		ofn = ofn + ".MP4";
	}

    // add ! before file name
    var renderStatus = ofn.lastIndexOf('\\');
    ofn = ofn.substring(0,renderStatus+1) + "\!" + ofn.substring(renderStatus+1);

    if (MessageBox.Show("Значок надо?", "Значок СПЕКТР-МАИ в правом углу", MessageBoxButtons.YesNo, MessageBoxIcon.Information) == DialogResult.Yes) {
	    var Titlestrack = FindTrack("LOGOTYPE");
        if (null == Titlestrack) {
            Titlestrack = new VideoTrack(0, "LOGOTYPE");
		    Vegas.Project.Tracks.Add(Titlestrack);
            var media = new Media("C:\\Program Files\\VEGAS\\tvlesnoy_banners.veg");
            var stream = media.Streams[0]; //The "video" stream
            var newEvent = new VideoEvent(Vegas.SelectionStart, Vegas.SelectionLength);
            Titlestrack.Events.Add(newEvent);
            var take = new Take(stream);
	        newEvent.Takes.Add(take);
            take.Offset = Timecode.FromMilliseconds(4250);
            newEvent.VideoMotion.ScaleToFill = 1;
            newEvent.MaintainAspectRatio = null;
            TrackEvent(newEvent).Loop = null;
            newEvent.ResampleMode = "Disable";
            ///////
            var vlc = new Envelope(EnvelopeType.Velocity);
            newEvent.Envelopes.Add(vlc);
            vlc.Points[0].Y = 0.0;
            ////////
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
	    }

        renderStatus = Vegas.Render(ofn, renderTemplateWAV,Vegas.SelectionStart,Timecode.FromMilliseconds(3000));
	    renderStatus = Vegas.Render(ofn, renderTemplate,Vegas.SelectionStart,Vegas.SelectionLength);

        var TitlestrackKeep = FindTrack("keeplogo");
        if (null == TitlestrackKeep) {
                Vegas.Project.Tracks.Remove(Titlestrack);
        }
    } else {
        renderStatus = Vegas.Render(ofn, renderTemplateWAV,Vegas.SelectionStart,Timecode.FromMilliseconds(3000));
        renderStatus = Vegas.Render(ofn, renderTemplate,Vegas.SelectionStart,Vegas.SelectionLength);
    }

}

catch (e) {
	MessageBox.Show(e);
}

finally {
    if (null != nTmpFPS) {
        Vegas.Project.Video.FrameRate = nTmpFPS;
    }
}

function VocSmoother() {
    for (var voc_t in Vegas.Project.Tracks) {
        voc_t.Selected = null;
        if (voc_t.IsAudio()) {
            if (voc_t.BusTrack.Name == 'Bus A' || voc_t.BusTrack.Name == 'Шина A') {
                if (voc_t.Effects.Count > 0) {
                    voc_t.Selected = 1;
                    Vegas.UpdateUI();
                    MessageBox.Show("Звуковой эффект на дорожке с БУКВОЙ А!\nЛишняя компрессия?");
                }
            }
        }
    }
    return null;
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

function FindRenderer(rendererRegExp : RegExp) : Renderer {
        var rendererEnum : Enumerator = new Enumerator(Vegas.Renderers);
        while (!rendererEnum.atEnd()) {
                var renderer : Renderer = Renderer(rendererEnum.item());
                if (null != renderer.FileExtension.match(extRE)) {
			if (null != FindRenderTemplate(renderer, templateRE)) {
				return renderer;
			}
                }
                rendererEnum.moveNext();
        }
        return null;
}

function FindRenderTemplate(renderer : Renderer, templateRegExp : RegExp) : RenderTemplate {
        var templateEnum : Enumerator = new Enumerator(renderer.Templates);
        while (!templateEnum.atEnd()) {
                var renderTemplate : RenderTemplate = RenderTemplate(templateEnum.item());
                if (renderTemplate.Name.match(templateRegExp)) {
                        return renderTemplate;
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