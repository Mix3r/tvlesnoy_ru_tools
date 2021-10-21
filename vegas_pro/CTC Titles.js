/** 
old school
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
                if (evnt.Start <= Vegas.Transport.CursorPosition & evnt.End >= Vegas.Transport.CursorPosition) {

                        var key_frame = evnt.VideoMotion.Keyframes[0];
                        if (key_frame.TopLeft.X == 0) {
                                repflag = 1;
                                var med_txt = CreateGeneratedMedia("0FE8789D-0C47-442A-AFB0-0DAF97669317","GG_END");
                        } else if (evnt.FadeOut.Length == Timecode.FromMilliseconds(0)) {
                                var med_txt = CreateGeneratedMedia("0FE8789D-0C47-442A-AFB0-0DAF97669317","GG_APXuB");
                                repflag = 3;
                                var TitlesArctrack = FindTrack("Titles_Arch");
                                if (null == TitlesArctrack) {
		                        TitlesArctrack = new VideoTrack(0, "Titles_Arch");
		                        Vegas.Project.Tracks.Add(TitlesArctrack);
	                        }
                        } else if (evnt.FadeOut.Length == Timecode.FromMilliseconds(360)) {
                                var med_txt = CreateGeneratedMedia("0FE8789D-0C47-442A-AFB0-0DAF97669317","GG_OPERA");
                                repflag = 4;
                        } else {
                                repflag = 2;
                                var med_txt = CreateGeneratedMedia("0FE8789D-0C47-442A-AFB0-0DAF97669317","GG");
                        }
                        Vegas.Transport.CursorPosition = evnt.Start;
                        Titlestrack.Events.Remove(evnt);
                        var stm_txt = med_txt.Streams[0];
                        var evt_txt = new VideoEvent(Vegas.Transport.CursorPosition, ttxt_length);
	                Titlestrack.Events.Add(evt_txt);
                        var txt_take = new Take(stm_txt);
	                evt_txt.Takes.Add(txt_take);

                        var key_frame = evt_txt.VideoMotion.Keyframes[0];
                        var d_width = key_frame.TopRight.X - key_frame.TopLeft.X;
                        var d_height = key_frame.BottomLeft.Y - key_frame.TopLeft.Y;
                        if (d_width < 0) {
                                d_width = -d_width;
                        }
                        if (d_height < 0) {
                                d_height = -d_height;
                        }
                        //var moveby2 = new VideoMotionVertex(-key_frame.TopLeft.X,-key_frame.TopLeft.Y);
                        //key_frame.MoveBy(moveby2);


                        if (repflag == 1) {
                                var moveby2 = new VideoMotionVertex(d_width*0.094947916,-d_height*0.782685185);
                                //////////////
                                var bottomEnum = new Enumerator(Titlebgtrack.Events);
                                while (!bottomEnum.atEnd()) {
                                        var botom : VideoEvent = VideoEvent(bottomEnum.item());
                                        if (botom.Start <= Vegas.Transport.CursorPosition & botom.End >= Vegas.Transport.CursorPosition) {
                                                botom.FadeOut.Length = Timecode.FromMilliseconds(0);
                                                botom.Length = evt_txt.End - botom.Start;
                                        }
                                        bottomEnum.moveNext();
                                }
                                ////////////////
                        } else if (repflag == 3) {
                                var moveby2 = new VideoMotionVertex(-d_width*(175.4/1920),-d_height*(80.4/1080));
                                evt_txt.FadeOut.Length = Timecode.FromMilliseconds(360);
                                ///////////////
                                var bottomEnum = new Enumerator(Titlebgtrack.Events);
                                while (!bottomEnum.atEnd()) {
                                        var botom3 : VideoEvent = VideoEvent(bottomEnum.item());
                                        if (botom3.Start <= Vegas.Transport.CursorPosition & botom3.End >= Vegas.Transport.CursorPosition) {
                                                botom3.FadeOut.Length = Timecode.FromMilliseconds(0);
                                                botom3.Length = evt_txt.End - botom3.Start + evt_txt.FadeOut.Length;
                                                var key_frame3 = botom3.VideoMotion.Keyframes[0];
                                                var d_width = key_frame3.TopRight.X   - key_frame3.TopLeft.X;
                                                var d_height = key_frame3.BottomLeft.Y - key_frame3.TopLeft.Y;
                                                if (d_width < 0) {
                                                        d_width = -d_width;
                                                }
                                                if (d_height < 0) {
                                                        d_height = -d_height;
                                                }
                                                var moveby1 = new VideoMotionVertex(-key_frame3.TopLeft.X,-key_frame3.TopLeft.Y);
                                                key_frame3.MoveBy(moveby1);
                                                var moveby1 = new VideoMotionVertex(0,d_height*(800/1080));
                                                key_frame3.MoveBy(moveby1);
                                        }
                                        bottomEnum.moveNext();
                                }
                                ////////////////
                        } else if (repflag == 4) {
                                var moveby2 = new VideoMotionVertex(-d_width*(175.4/1920),-d_height*(80.4/1080));
                                evt_txt.FadeOut.Length = Timecode.FromMilliseconds(400);
                        } else {
                                var moveby2 = new VideoMotionVertex(0,-d_height*(836.6/1080));
                                evt_txt.FadeOut.Length = Timecode.FromMilliseconds(400);
                                ///////////////
                                var bottomEnum = new Enumerator(Titlebgtrack.Events);
                                while (!bottomEnum.atEnd()) {
                                        var botom2 : VideoEvent = VideoEvent(bottomEnum.item());
                                        if (botom2.Start <= Vegas.Transport.CursorPosition & botom2.End >= Vegas.Transport.CursorPosition) {
                                                botom2.FadeOut.Length = Timecode.FromMilliseconds(560);
                                                botom2.Length = evt_txt.End - botom2.Start + evt_txt.FadeOut.Length;
                                                var key_frame2 = botom2.VideoMotion.Keyframes[0];
                                                var d_width = key_frame2.TopRight.X   - key_frame2.TopLeft.X;
                                                var d_height = key_frame2.BottomLeft.Y - key_frame2.TopLeft.Y;
                                                if (d_width < 0) {
                                                        d_width = -d_width;
                                                }
                                                if (d_height < 0) {
                                                        d_height = -d_height;
                                                }
                                                var moveby1 = new VideoMotionVertex(-key_frame2.TopLeft.X,-key_frame2.TopLeft.Y);
                                                key_frame2.MoveBy(moveby1);
                                                var moveby1 = new VideoMotionVertex(0,-d_height*(800/1080));
                                                key_frame2.MoveBy(moveby1);
                                                if (null != Vegas.Project.Groups) {
		                                        var TtlGroup2 = new TrackEventGroup();
		                                        Vegas.Project.Groups.Add(TtlGroup2);
		                                        TtlGroup2.Add(botom2);
		                                        TtlGroup2.Add(evt_txt);
	                                        }
                                        }
                                        bottomEnum.moveNext();
                                }
                                ////////////////
                        }
                        key_frame.MoveBy(moveby2);

                        evt_txt.FadeIn.Length = Timecode.FromMilliseconds(400);
	                Vegas.Transport.CursorPosition = (evt_txt.Start + evt_txt.FadeIn.Length);
                }
                evntEnum.moveNext();
        }
        if (repflag == 0) {
	//var media = new Media(Vegas.InstallationDirectory + "/Script Menu/ctc-sample.png");
	var media = new Media("C:/Program Files/Sony/Vegas 7.0/Script Menu/ctc-sample.png");
	var stream = media.Streams[0]; //The "video" stream
	var newEvent = new VideoEvent(Vegas.Transport.CursorPosition, ttl_length);
	Titlebgtrack.Events.Add(newEvent);
	var take = new Take(stream); 
	newEvent.Takes.Add(take);

        var key_frame = newEvent.VideoMotion.Keyframes[0];
        var d_width = key_frame.TopRight.X   - key_frame.TopLeft.X;
        var d_height = key_frame.BottomLeft.Y - key_frame.TopLeft.Y;
        if (d_width < 0) {
                d_width = -d_width;
        }
        if (d_height < 0) {
                d_height = -d_height;
        }
        var moveby1 = new VideoMotionVertex(Vegas.Project.Video.Width/d_width,Vegas.Project.Video.Height/d_height);
        //key_frame.ScaleBy(moveby1);
        var moveby2 = new VideoMotionVertex(0,-d_height*(800/1080));
        key_frame.MoveBy(moveby2);

	newEvent.FadeIn.Length = Timecode.FromMilliseconds(560);
	newEvent.FadeOut.Length = Timecode.FromMilliseconds(560);
	newEvent.FadeIn.Transition = CreateTransitionEffect(/Linear Wipe/);
	newEvent.FadeIn.Transition.Preset = "rlse";
	newEvent.FadeOut.Transition = CreateTransitionEffect(/Linear Wipe/);
	newEvent.FadeOut.Transition.Preset = "rlse";
	newEvent.MaintainAspectRatio = null;

        var med_txt = CreateGeneratedMedia("0FE8789D-0C47-442A-AFB0-0DAF97669317","GG");
	var stm_txt = med_txt.Streams[0];
	Vegas.Transport.CursorPosition = (Vegas.Transport.CursorPosition + Timecode.FromMilliseconds(320));
	var evt_txt = new VideoEvent(Vegas.Transport.CursorPosition, ttxt_length);
	Titlestrack.Events.Add(evt_txt);
	var txt_take = new Take(stm_txt);
	evt_txt.Takes.Add(txt_take);

        var key_frame = evt_txt.VideoMotion.Keyframes[0];
        var d_width = key_frame.TopRight.X   - key_frame.TopLeft.X;
        var d_height = key_frame.BottomLeft.Y - key_frame.TopLeft.Y;
        if (d_width < 0) {
                d_width = -d_width;
        }
        if (d_height < 0) {
                d_height = -d_height;
        }
        var moveby1 = new VideoMotionVertex(Vegas.Project.Video.Width/d_width,Vegas.Project.Video.Height/d_height);
        // key_frame.ScaleBy(moveby1);
        var moveby2 = new VideoMotionVertex(0,-d_height*(836.6/1080));
        key_frame.MoveBy(moveby2);

	evt_txt.FadeIn.Length = Timecode.FromMilliseconds(400);
	evt_txt.FadeOut.Length = Timecode.FromMilliseconds(400);
	Vegas.Transport.CursorPosition = (evt_txt.Start + evt_txt.FadeIn.Length);
	if (null != Vegas.Project.Groups) {
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

function CreateGeneratedMedia(generatorName, presetName) {
        var generator = Vegas.Generators.GetChildByClassID(new Guid(generatorName));
        //var src_height = Vegas.Project.Video.Height * 1;
        //Vegas.Project.Video.Height = int(src_height*(160/1080));
        ////////////////////
        var mediaEnum = new Enumerator(Vegas.Project.MediaPool);
        while (!mediaEnum.atEnd()) {
                var sirota = mediaEnum.item();
                if (sirota.UseCount == 0) {
                        if (sirota.IsValid()) {
                                if (sirota.TapeName == presetName) {
                                        return sirota;
                                }
                        }
                }
                mediaEnum.moveNext();
        }
        /////////////////////
        var media = new Media(generator, presetName);
        //Vegas.Project.Video.Height = src_height;

        if (!media.IsValid()) {
                throw "failed to create media; " + generatorName + " (" + presetName + ")";
        } else {
                if (presetName != "GG") {
                        media.TapeName = presetName;
                }
        }
        return media;
} 
