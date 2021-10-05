/**
* Upper to Lower field and render
*
**/
import System;
import System.Text;
import System.IO;
import System.Windows.Forms;
import Sony.Vegas;

try {
	Vegas.Project.Video.Width = 1280;
	Vegas.Project.Video.Height = 720;
	Vegas.Project.Video.FrameRate = 25;
	Vegas.Project.Video.FieldOrder = "ProgressiveScan";
	Vegas.Project.Video.PixelAspectRatio = 1.0;
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
			mm.FieldOrder = "ProgressiveScan";
		}
		mediaEnum.moveNext();
	}

	var templateRE = /testtest_80_mjpegB/;
	var extRE = /.mov/;
	
	var renderer : Renderer = FindRenderer(templateRE);
	
        if (null == renderer)
                throw "failed to find renderer";
		
        var renderTemplate :RenderTemplate = FindRenderTemplate(renderer, templateRE);
	
        if (null == renderTemplate)
                throw "failed to find render template";
		
	var projPath = Vegas.Project.FilePath;
	var titl = Path.GetFileNameWithoutExtension(projPath);
	extRE = Vegas.Project.Audio.RecordedFilesFolder.toUpperCase();
	if (null != extRE.match(/\TEMP/)) {
		titl = Path.GetDirectoryName(projPath)+"\\"+titl;
	} else {
		titl = Vegas.Project.Video.PrerenderedFilesFolder+titl;
	}
	var ofn = ShowSaveFileDialog("AVI Files (*.MOV)|*.MOV", "Render MOV - "+renderer.FileTypeName, titl);
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