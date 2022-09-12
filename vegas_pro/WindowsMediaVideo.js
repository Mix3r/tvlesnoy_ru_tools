/**
* Upper to Lower field and render  ---------- NARRATOR 1.0 feature
*
**/
import System;
import System.Text;
import System.IO;
import System.Windows.Forms;
import Sony.Vegas;

try {
	//Vegas.Project.Video.Width = 720;
	//Vegas.Project.Video.Height = 576;
	Vegas.Project.Video.FrameRate = 25;
	//Vegas.Project.Video.FieldOrder = "LowerFieldFirst";
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
	var extRE = /.wmv/;
	
	var renderer : Renderer = FindRenderer(templateRE);
	
        if (null == renderer)
                throw "failed to find renderer";
		
        var renderTemplate :RenderTemplate = FindRenderTemplate(renderer, templateRE);
	
        if (null == renderTemplate)
                throw "failed to find render template";

        var trks = new Enumerator(Vegas.Project.Tracks);
        while (!trks.atEnd()) {
                var evnts = new Enumerator(Track(trks.item()).Events);
                while (!evnts.atEnd()) {
                        if (TrackEvent(evnts.item()).IsVideo()) {
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
                                                                                //} else if (mm3.Format == "Фото - JPEG" && mm3.FrameRate == 25.000) {
                                                                                        //mm3.FieldOrder = "UpperFieldFirst";
                                                                                //}  else if (mm3.Format == "Sony Motion JPEG" && mm3.FrameRate == 25.000) {
                                                                                        //mm3.FieldOrder = "UpperFieldFirst";
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
		
	var projPath = Vegas.Project.FilePath;
	var titl = Path.GetFileNameWithoutExtension(projPath);
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
	var ofn = ShowSaveFileDialog("WMV Files (*.WMV)|*.WMV", "Render Win. Media Video - "+renderer.FileTypeName, titl);
	if (ofn.length < 5) {
		ofn = ofn + ".WMV";
	}
	titl = ofn.substring(ofn.length-4);
	if (titl.toUpperCase() != ".WMV") {
		ofn = ofn + ".WMV";
	}

        if (MessageBox.Show("Значок надо?", "Значок СПЕКТР-МАИ в правом углу", MessageBoxButtons.YesNo, MessageBoxIcon.Information) == DialogResult.Yes) {

	var Titlestrack = FindTrack("LOGOTYPE");
        if (null == Titlestrack) {
                Titlestrack = new VideoTrack(0, "LOGOTYPE");
		Vegas.Project.Tracks.Add(Titlestrack);
                var media = new Media("C:/Program Files/Sony/Vegas 7.0/Script Menu/smai75x75_alpha75_hd.png");
                var stream = media.Streams[0]; //The "video" stream
                var newEvent = new VideoEvent(Vegas.SelectionStart, Vegas.SelectionLength);
                Titlestrack.Events.Add(newEvent);
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
                var moveby2 = new VideoMotionVertex(-1*(key_frame.Center.X+Vegas.Project.Video.Width*0.5-d_width*2.4),-1*(key_frame.Center.Y-Vegas.Project.Video.Height*0.5+d_height*0.96+1));
                key_frame.MoveBy(moveby2);
	}

	var renderStatus = Vegas.Render(ofn, renderTemplate,Vegas.SelectionStart,Vegas.SelectionLength);
        var TitlestrackKeep = FindTrack("keeplogo");
        if (null == TitlestrackKeep) {
                Vegas.Project.Tracks.Remove(Titlestrack);
        }
        } else {
        var renderStatus = Vegas.Render(ofn, renderTemplate,Vegas.SelectionStart,Vegas.SelectionLength);
        }
}

catch (e) {
	MessageBox.Show(e);
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