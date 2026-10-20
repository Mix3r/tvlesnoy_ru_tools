
import System;
import System.Text;
import System.IO;
import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;

try {

	var templateRE = /CQP19/;     ///Internet 1920x1080-30
	var extRE = /.mp4/;
	
	var renderer : Renderer = FindRenderer(templateRE);
	
        if (null == renderer)
                throw "failed to find renderer";
		
        var renderTemplate :RenderTemplate = FindRenderTemplate(renderer, templateRE);
	
        if (null == renderTemplate)
                throw "failed to find render template";

        for (var tTmpTrk in Vegas.Project.Tracks) {
            for (var eTmpEvt in tTmpTrk.Events) {
                if (eTmpEvt.IsVideo()) {
                    var bIsInterlaced = 0;
                    if (null != eTmpEvt.ActiveTake) {
                        if (null != eTmpEvt.ActiveTake.MediaPath) {
                            var media3 = Vegas.Project.MediaPool[eTmpEvt.ActiveTake.MediaPath];
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
                                        if (mm3.FieldOrder != "ProgressiveScan") {
                                            bIsInterlaced = 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (VideoEvent(eTmpEvt).ResampleMode == "Force") {
                        // don't change resample mode
                    } else if (eTmpEvt.PlaybackRate < 1 || bIsInterlaced == 1 || VideoEvent(eTmpEvt).Envelopes.Count > 0) {
                        VideoEvent(eTmpEvt).ResampleMode = "Smart";
                    } else {
                        VideoEvent(eTmpEvt).ResampleMode = "Disable";
                    }
                }
            }
        }

        var bRegionPending = 0;
        var renderStatus = RenderStatus.Complete;

        for (var rTmpRgn in Vegas.Project.Regions) {
            var rlbl = rTmpRgn.Label.substring(1,2);
            if ((rlbl == ":" || rlbl == "\\") & Vegas.Transport.LoopRegionStart <= rTmpRgn.Position & Vegas.Transport.LoopRegionStart+Vegas.Transport.LoopRegionLength >= rTmpRgn.Position+rTmpRgn.Length) {
                bRegionPending = 1;
                if (renderStatus == RenderStatus.Complete) {
                    Vegas.Transport.CursorPosition = rTmpRgn.Position+Timecode.FromMilliseconds(Math.round(rTmpRgn.Length.ToMilliseconds() * 0.5));
                    renderStatus = Vegas.Render(rTmpRgn.Label + "." + String(extRE).substring(2,String(extRE).length-1), renderTemplate,rTmpRgn.Position,rTmpRgn.Length);
                }
            }
        }

        if (bRegionPending == 0) {
            if (MessageBox.Show("Регионов на отмеченном месте нет.\nБудет просчитаны видео, размещённые на дорожке.\nПуть к просчитанным файлам будет соответствовать\nпути каждого видео на дорожке (_ВЫХ). Просчитать?", "Просчёт всех видео в " + String(extRE).substring(2,String(extRE).length-1) + " шаблон: " + String(templateRE).substring(1,String(templateRE).length-1), MessageBoxButtons.YesNo, MessageBoxIcon.Information) == DialogResult.Yes) {
                for (var tTmpTrk in Vegas.Project.Tracks) {
                    for (var eTmpEvt in tTmpTrk.Events) {
                        if (eTmpEvt.IsVideo()) {
                            if (null != eTmpEvt.ActiveTake) {
                                if (null != eTmpEvt.ActiveTake.MediaPath) {
                                    var media4 = eTmpEvt.ActiveTake.MediaPath;
                                    if (renderStatus == RenderStatus.Complete) {
                                        Vegas.Transport.CursorPosition = eTmpEvt.Start+Timecode.FromMilliseconds(Math.round(eTmpEvt.Length.ToMilliseconds() * 0.5));
                                        renderStatus = Vegas.Render(media4.substring(0,media4.length-4) + "_OUT." + String(extRE).substring(2,String(extRE).length-1), renderTemplate,eTmpEvt.Start,eTmpEvt.Length);
                                    }
                                }
                            }
                        }
                    }
                }
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