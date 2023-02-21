/** 
0
 **/ 

import System;
import System.IO;
import System.Object;
import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;

var ttl_length = Timecode.FromMilliseconds(5760);
var ttxt_length = Timecode.FromMilliseconds(5080);

try
{
	var Titlestrack = FindTrack("Titles_A");
	var Titlebgtrack = FindTrack("Titles_BG");
        var repflag = 0;

        var lowerthird_name = "tvlesnoy_lowerthird";
        const tntc = "t&t";
	
	if (null == Titlebgtrack) {
		Titlebgtrack = new VideoTrack(0, "Titles_BG");
		Vegas.Project.Tracks.Add(Titlebgtrack);
	}
	if (null == Titlestrack) {
		Titlestrack = new VideoTrack(0, "Titles_A");
		Vegas.Project.Tracks.Add(Titlestrack);
	}

        var evntEnum = new Enumerator(Titlestrack.Events);
        while (!evntEnum.atEnd()) {
                var evnt : VideoEvent = VideoEvent(evntEnum.item());
                if (evnt.Start <= Vegas.Transport.CursorPosition && evnt.End >= Vegas.Transport.CursorPosition) {
                        Vegas.Transport.CursorPosition = evnt.Start;
                        if (evnt.FadeOut.Length > Timecode.FromMilliseconds(0)) {
                                repflag = 1;
                        } else {
                                if (evnt.FadeIn.Length > Timecode.FromMilliseconds(0)) {
                                        repflag = 2;
                                        var Titlesarctrack = FindTrack("Titles_Arch");
	                                if (null == Titlesarctrack) {
		                                Titlesarctrack = new VideoTrack(0, "Titles_Arch");
		                                Vegas.Project.Tracks.Add(Titlesarctrack);
	                                }
                                } else {
                                        repflag = 0;
                                }
                        }
                        Titlestrack.Events.Remove(evnt);
                        var FooterEnum = new Enumerator(Titlebgtrack.Events);
                        while (!FooterEnum.atEnd()) {
                                var footr : VideoEvent = VideoEvent(FooterEnum.item());
                                if (footr.Start <= Vegas.Transport.CursorPosition && footr.End >= Vegas.Transport.CursorPosition) {
                                        Vegas.Transport.CursorPosition = footr.Start;
                                        Titlebgtrack.Events.Remove(footr);
                                        break;
                                }
                                FooterEnum.moveNext();
                        }
                        break;
                }
                evntEnum.moveNext();
        }

        if (repflag < 999) {
	//var media = new Media(Vegas.InstallationDirectory + "/Script Menu/ctc-sample.png");
        var mediaEnum = new Enumerator(Vegas.Project.MediaPool);
        var media = null;
        var med_txt = null;
        if (repflag == 2) {
                lowerthird_name = "tvlesnoy_YT";
        }

        while (!mediaEnum.atEnd()) {
                if (mediaEnum.item().IsSubclip()) {
                        if (mediaEnum.item().FilePath == lowerthird_name) {
                                media = mediaEnum.item();
                        }
                } else if (mediaEnum.item().UseCount == 0) {
                        if (mediaEnum.item().IsValid()) {
                                if (mediaEnum.item().Comment == tntc) {
                                        med_txt = mediaEnum.item();
                                }
                        }
                }
                if (med_txt != null && media != null) {
                        break;
                }
                mediaEnum.moveNext();
        }

        if (media == null) {
            if (repflag == 2) {
                media = new Subclip(Vegas.Project,"C:\\Program Files\\VEGAS\\tvlesnoy_banners.veg",Timecode.FromMilliseconds(1030),Timecode.FromMilliseconds(1040),0,lowerthird_name);
            } else {
                media = new Subclip(Vegas.Project,"C:\\Program Files\\VEGAS\\tvlesnoy_banners.veg",Timecode.FromMilliseconds(0),Timecode.FromMilliseconds(40),0,lowerthird_name);
            }
        }
	var stream = media.Streams[0]; //The "video" stream
	var newEvent = new VideoEvent(Vegas.Transport.CursorPosition, ttl_length);
	Titlebgtrack.Events.Add(newEvent);
	var take = new Take(stream); 
	newEvent.Takes.Add(take);

	newEvent.FadeIn.Length = Timecode.FromMilliseconds(560);
        if (repflag == 1) {
                newEvent.FadeOut.Length = Timecode.FromMilliseconds(0);
        } else {
	        newEvent.FadeOut.Length = Timecode.FromMilliseconds(560);
        }
	newEvent.FadeIn.Transition = CreateTransitionEffect(/Linear Wipe/);
	newEvent.FadeIn.Transition.Preset = "rlse";
	newEvent.FadeOut.Transition = CreateTransitionEffect(/Linear Wipe/);
	newEvent.FadeOut.Transition.Preset = "rlse";
	newEvent.MaintainAspectRatio = null;
        TrackEvent(newEvent).Loop = null;
        newEvent.ResampleMode = "Disable";

        if (med_txt == null) {
                var generator = null;
                generator = Vegas.Generators.FindChildByUniqueID("{Svfx:com.sonycreativesoftware:titlesandtext}");
                if (generator == null) {
                        generator = Vegas.Generators.FindChildByUniqueID("{Svfx:com.vegascreativesoftware:titlesandtext}");
                }
                if (generator != null) {
                        med_txt = new Media(generator,null);
                        med_txt.Length = Timecode.FromFrames(1);
                }
        }

	var stm_txt = med_txt.Streams[0];
	Vegas.Transport.CursorPosition = (Vegas.Transport.CursorPosition + Timecode.FromMilliseconds(320));
	var evt_txt = new VideoEvent(Vegas.Transport.CursorPosition, ttxt_length);
	Titlestrack.Events.Add(evt_txt);
        evt_txt.MaintainAspectRatio = null;
        TrackEvent(evt_txt).Loop = null;
        evt_txt.ResampleMode = "Disable";

	var txt_take = new Take(stm_txt);
	evt_txt.Takes.Add(txt_take);
        evt_txt.ReduceInterlace = null;

        med_txt.Comment = tntc;

        var ofx_string = "{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0\\fnil\\fcharset204{\\*\\fname Arial;}Arial CYR;}{\\f1\\fnil\\fcharset0 Arial;}}\n{\\colortbl ;\\red0\\green0\\blue0;}\n\\viewkind4\\uc1\\pard\\qc\\cf1\\lang1049\\b\\f0\\fs32\\\'d1\\\'e5\\\'f0\\\'e3\\\'e5\\\'e9\\lang1033\\f1  \\lang1049\\f0\\\'d7\\\'c5\\\'d0\\\'c5\\\'cf\\\'c0\\\'cd\\\'ce\\\'c2\\par\n\\b0\\fs30\\\'e3\\\'eb\\\'e0\\\'e2\\\'e0 \\\'c3\\\'ce \\f1\\\'ab\\f0\\\'c3\\\'ee\\\'f0\\\'ee\\\'e4 \\\'cb\\\'e5\\\'f1\\\'ed\\\'ee\\\'e9\\f1\\\'bb\\f0\\par\n}\n";
        if (repflag == 1) {
                ofx_string = "{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0\\fnil\\fcharset204{\\*\\fname Arial;}Arial CYR;}}{\\colortbl ;\\red0\\green0\\blue0;}\\viewkind4\\uc1\\pard\\qr\\cf1\\lang1049\\f0\\fs26\\\'d0.\\\'d0\\\'c5\\\'c4\\\'c0\\\'ca\\\'d2\\\'ce\\\'d0\\par\\\'ce.\\\'ce\\\'cf\\\'c5\\\'d0\\\'c0\\\'d2\\\'ce\\\'d0\\par}";
        }
        if (repflag == 2) {
                ofx_string = "{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0\\fnil\\fcharset204{\\*\\fname Arial;}Arial CYR;}}{\\colortbl ;\\red0\\green0\\blue0;}\\viewkind4\\uc1\\pard\\cf1\\lang1049\\f0\\fs26\\\'c0\\\'f0\\\'f5\\\'e8\\\'e2\\par}";
        }
        OFXStringParameter(med_txt.Generator.OFXEffect.FindParameterByName("Text")).Value = ofx_string;

        var ofx_val : double;
        ofx_val =  0.532236;
        OFXDoubleParameter(med_txt.Generator.OFXEffect.FindParameterByName("Scale")).Value = ofx_val;
        ofx_val = 1.190476;
        if (repflag == 1) {
                ofx_val = 1.142857;
        }
        if (repflag == 2) {
                ofx_val = 0.950;
        }
        OFXDoubleParameter(med_txt.Generator.OFXEffect.FindParameterByName("LineSpacing")).Value = ofx_val;

        var ofx_val2d : OFXDouble2D;
        ofx_val2d.X = 0.500509;
        ofx_val2d.Y = 0.227848;
        if (repflag == 1) {
                ofx_val2d.X = 0.906516;
                ofx_val2d.Y = 0.218121;
        }
        if (repflag == 2) {
                ofx_val2d.X = 0.092937;
                ofx_val2d.Y = 0.922314;
        }
        OFXDouble2DParameter(med_txt.Generator.OFXEffect.FindParameterByName("Location")).Value = ofx_val2d;

        var ofx_choice : OFXChoice;
        if (repflag == 1) {
                ofx_choice = OFXChoiceParameter(med_txt.Generator.OFXEffect.FindParameterByName("Alignment")).Choices[2];
        } else if (repflag == 2) {
                ofx_choice = OFXChoiceParameter(med_txt.Generator.OFXEffect.FindParameterByName("Alignment")).Choices[0];
        } else {
                ofx_choice = OFXChoiceParameter(med_txt.Generator.OFXEffect.FindParameterByName("Alignment")).Choices[1];
        }
        OFXChoiceParameter(med_txt.Generator.OFXEffect.FindParameterByName("Alignment")).Value = ofx_choice;

        var ofx_colRGBA : OFXColor;
        ofx_colRGBA.R = 0.0;
        ofx_colRGBA.G = 0.0;
        ofx_colRGBA.B = 0.0;
        ofx_colRGBA.A = 1.0;
        if (repflag == 2) {
                ofx_colRGBA.R = 1.0;
                ofx_colRGBA.G = 1.0;
                ofx_colRGBA.B = 1.0;
        }
        OFXRGBAParameter(med_txt.Generator.OFXEffect.FindParameterByName("TextColor")).Value = ofx_colRGBA;

        OFXStringParameter(med_txt.Generator.OFXEffect.FindParameterByName("Text")).ParameterChanged();

	evt_txt.FadeIn.Length = Timecode.FromMilliseconds(400);
        if (repflag == 1) {
	        evt_txt.FadeOut.Length = Timecode.FromMilliseconds(0);
                newEvent.Length = evt_txt.Length + (evt_txt.Start-newEvent.Start);
        } else if (repflag == 2) {
	        evt_txt.FadeOut.Length = Timecode.FromMilliseconds(0);
                evt_txt.FadeIn.Length = evt_txt.FadeOut.Length;
                newEvent.FadeOut.Length = Timecode.FromMilliseconds(0);
                newEvent.FadeIn.Length = newEvent.FadeOut.Length;
                newEvent.Length = evt_txt.Length + (evt_txt.Start-newEvent.Start);
        } else {
	        evt_txt.FadeOut.Length = Timecode.FromMilliseconds(400);
        }
	Vegas.Transport.CursorPosition = (evt_txt.Start + evt_txt.FadeIn.Length);
	if (null != Vegas.Project.Groups && repflag != 2) {
		var TtlGroup = new TrackEventGroup();
		Vegas.Project.Groups.Add(TtlGroup);
		TtlGroup.Add(newEvent);
		TtlGroup.Add(evt_txt);
	}
        } // if repflag
}
catch (errorMsg)
{
	MessageBox.Show(errorMsg, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
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

function CreateTransitionEffect(nameRegExp : RegExp) : Effect {
    var trns = Vegas.Transitions.GetChildByClassID(new Guid("A09106D0-5344-11D2-95CC-00C04F8EDC2D"));
    if (null == trns)
        throw "failed to find plug-in";
    return new Effect(trns);
}
