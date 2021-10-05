
import System;
import System.Text;
import System.IO;
import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;

try {

	var templateRE = /MJPEGNO50P/;
	var extRE = /.mov/;
	
	var renderer : Renderer = FindRenderer(templateRE);
	
        if (null == renderer)
                throw "failed to find renderer";
		
        var renderTemplate :RenderTemplate = FindRenderTemplate(renderer, templateRE);
	
        if (null == renderTemplate)
                throw "failed to find render template";
		
        var regionEnum = new Enumerator(Vegas.Project.Regions);

        while (!regionEnum.atEnd()) {
	        var rgn : Region = Region(regionEnum.item());
	        var renderStatus = Vegas.Render(rgn.Label + "." + String(extRE).substring(2,String(extRE).length-1), renderTemplate,rgn.Position,rgn.Length);
	        regionEnum.moveNext();
        }
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
