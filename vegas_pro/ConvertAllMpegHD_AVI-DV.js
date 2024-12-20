
import System;
import System.Text;
import System.IO;
import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;

try {

	var templateRE = /VBR23444/;     //VBR23444   ///Internet 1920x1080-30
	var extRE = /.mp4/;
	
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
                                                                        if (mm3.FieldOrder != "ProgressiveScan") {
                                                                                envl_num = 999;
                                                                        }
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
                        }
                        evnts.moveNext();
                }
                trks.moveNext();
        }
		
        var regionEnum = new Enumerator(Vegas.Project.Regions);
        var regioncount = 0;

        while (!regionEnum.atEnd()) {
	        var rgn : Region = Region(regionEnum.item());
                var rlbl = rgn.Label.substring(1,2);
                if ((rlbl == ":" || rlbl == "\\") & Vegas.Transport.LoopRegionStart <= rgn.Position & Vegas.Transport.LoopRegionStart+Vegas.Transport.LoopRegionLength >= rgn.Position+rgn.Length) {
                        regioncount = regioncount + 1;
	                var renderStatus = Vegas.Render(rgn.Label + "." + String(extRE).substring(2,String(extRE).length-1), renderTemplate,rgn.Position,rgn.Length);
                }
	        regionEnum.moveNext();
        }
        if (regioncount <= 0) {
                MessageBox.Show("Регионов нет. Будет просчитана первая видеодорожка.\nПуть к просчитанным файлам соответствует пути\nкаждого видео на дорожке (_ВЫХ)");
                var trkenum = new Enumerator(Vegas.Project.Tracks);
                while (!trkenum.atEnd()) {
                        var evntEnum = new Enumerator(Track(trkenum.item()).Events);
                        while (!evntEnum.atEnd()) {
                                if (TrackEvent(evntEnum.item()).IsVideo()) {
                                    if (null != TrackEvent(evntEnum.item()).ActiveTake) {
                                        if (null != TrackEvent(evntEnum.item()).ActiveTake.MediaPath) {
                                            var media4 = TrackEvent(evntEnum.item()).ActiveTake.MediaPath;
                                            //MessageBox.Show(media4.substring(0,media4.length-4) + "_OUT." + String(extRE).substring(2,String(extRE).length-1));
                                            var renderStatus = Vegas.Render(media4.substring(0,media4.length-4) + "_OUT." + String(extRE).substring(2,String(extRE).length-1), renderTemplate,TrackEvent(evntEnum.item()).Start,TrackEvent(evntEnum.item()).Length);
                                        }
                                    }
                                }
                                evntEnum.moveNext();
                        }
                        trkenum.moveNext();
                }
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

function StillToAnim(new_len_frames) {
	var trackEnum = new Enumerator(Vegas.Project.Tracks);
	var first_event = Timecode.FromFrames(0);
	while (!trackEnum.atEnd()) {
		var evntEnum = new Enumerator(Track(trackEnum.item()).Events);
		while (!evntEnum.atEnd()) {
			if ((TrackEvent(evntEnum.item()).Selected) & (TrackEvent(evntEnum.item()).IsVideo())) {
                                VideoEvent(evntEnum.item()).Length = Timecode.FromFrames(new_len_frames);
                                VideoEvent(evntEnum.item()).Start = first_event;
                                first_event = VideoEvent(evntEnum.item()).Start + VideoEvent(evntEnum.item()).Length;
			}
			evntEnum.moveNext();
		}
		trackEnum.moveNext();
	}
        return null;
}