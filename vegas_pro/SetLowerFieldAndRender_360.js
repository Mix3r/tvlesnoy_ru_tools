/**
* Upper to Lower field and render  ---------- NARRATOR 1.0 feature
*
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
	
	var mediaEnum = new Enumerator(Vegas.Project.MediaPool);

	while (!mediaEnum.atEnd()) {
		var media = mediaEnum.item();
		// FIX FIELD ORDER ROUTINE. --------------
		if (media.IsOffline()) {
                } else {
                        if (media.HasVideo()) {
			        var mm = new media.Streams();
                                if (mm.Width == 1920 && mm.Height == 1080) {
                                        if (mm.Format == "MPEG-2" && mm.FrameRate == 25.000) {
                                                mm.FieldOrder = "UpperFieldFirst";
                                        } else if (mm.Format == "Фото - JPEG" && mm.FrameRate == 25.000) {
                                                mm.FieldOrder = "UpperFieldFirst";
                                        }  else if (mm.Format == "Sony Motion JPEG" && mm.FrameRate == 25.000) {
                                                mm.FieldOrder = "UpperFieldFirst";
                                        }
                                } else if (mm.Width == 720 && mm.Height == 576) {
                                        if (mm.FrameRate == 25.000) {
                                                // mm.FieldOrder = "LowerFieldFirst";
                                        }
                                }
		        }
                }
		mediaEnum.moveNext();
	}

	var templateRE = /HQ 1920x1080-50i, /;
	var extRE = /.MP4/;
	
	var renderer : Renderer = FindRenderer(templateRE);
	
        if (null == renderer)
                throw "failed to find renderer";
		
        var renderTemplate :RenderTemplate = FindRenderTemplate(renderer, templateRE);
	
        if (null == renderTemplate)
                throw "failed to find render template";

	var titl = Path.GetFileNameWithoutExtension(Vegas.Project.FilePath);

	if (Vegas.Project.Summary.Title == "narrator") {
                //////////////////////////////////////////////////////////////////////
                var numregions = 0;
                var regionEnum = new Enumerator(Vegas.Project.Regions);
                while (!regionEnum.atEnd()) {
                        numregions = numregions+1;
	                var rgn : Region = Region(regionEnum.item());
                        var trackEnum = new Enumerator(Vegas.Project.Tracks);
                        while (!trackEnum.atEnd()) {
			        var track2 : Track = Track(trackEnum.item());
                                if (track2.IsAudio()) {
			                var evntEnum = new Enumerator(track2.Events);
			                while (!evntEnum.atEnd()) {
				                var evnt2 : TrackEvent = TrackEvent(evntEnum.item());
				                if (evnt2.Start == rgn.Position) {
					                /////
                                                        rgn.Label = Vegas.Project.Summary.Copyright+evnt2.ActiveTake.Name+" (OK)";
                                                        var renderStatus = Vegas.Render(rgn.Label + "." + String(extRE).substring(2,String(extRE).length-1), renderTemplate,rgn.Position,rgn.Length);
                                                        /////
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
                }
                //////////////////////////////////////////////////////////////////////
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
                if (Vegas.Project.FilePath != null) {
                        Vegas.Project.Audio.RecordedFilesFolder = Path.GetDirectoryName(Vegas.Project.FilePath);
                }
        }

	titl = Vegas.Project.Summary.Copyright+titl;

	var ofn = ShowSaveFileDialog("Видео (*.MP4)|*.MP4", "MP4 для эфира - "+renderer.FileTypeName, titl);

	if (ofn.length < 5) {
		ofn = ofn + ".MP4";
	}
	titl = ofn.substring(ofn.length-4);
	if (titl.toUpperCase() != ".MP4") {
		ofn = ofn + ".MP4";
	}

        var renderStatus = Vegas.Render(ofn, renderTemplate,Vegas.SelectionStart,Vegas.SelectionLength);
}

catch (e) {
        if (e != "ok1") {
	        MessageBox.Show(e);
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