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
	Vegas.Project.Video.Width = 720;
	Vegas.Project.Video.Height = 576;
	Vegas.Project.Video.FrameRate = 25;
	Vegas.Project.Video.FieldOrder = "LowerFieldFirst";
	Vegas.Project.Video.PixelAspectRatio = 1.4568;       // 1.0926;
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
		// video only
		if (media.HasVideo()) {
			var mm = new media.Streams();
			// mm.FieldOrder = "LowerFieldFirst";
		}
		mediaEnum.moveNext();
	}

	var templateRE = /PAL DV /;
	var extRE = /.avi/;
	
	var renderer : Renderer = FindRenderer(templateRE);
	
        if (null == renderer)
                throw "failed to find renderer";
		
        var renderTemplate :RenderTemplate = FindRenderTemplate(renderer, templateRE);
	
        if (null == renderTemplate)
                throw "failed to find render template";
		
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
	var ofn = ShowSaveFileDialog("AVI Files (*.AVI)|*.AVI", "Render AVI - "+renderer.FileTypeName, titl);

	if (ofn.length < 5) {
		ofn = ofn + ".AVI";
	}
	titl = ofn.substring(ofn.length-4);
	if (titl.toUpperCase() != ".AVI") {
		ofn = ofn + ".AVI";
	}
	
	var renderStatus = Vegas.Render(ofn, renderTemplate,Vegas.SelectionStart,Vegas.SelectionLength);
}

catch (e) {
	MessageBox.Show(e);
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