/** 
new school
 **/ 

import System;
import System.IO;
import System.Object;
import System.Windows.Forms;
import Sony.Vegas;

var ttl_length = new Timecode(5200);

try
{
	var Titlebgtrack = FindTrack("Ticker");
	if (null == Titlebgtrack) {
           Titlebgtrack = new VideoTrack(0, "Ticker");
           Vegas.Project.Tracks.Add(Titlebgtrack);
	}
        var evntEnum = new Enumerator(Titlebgtrack.Events);
        //var ev_edit = 0;
        while (!evntEnum.atEnd()) {
              if ((TrackEvent(evntEnum.item()).Start <= Vegas.Transport.CursorPosition) & (TrackEvent(evntEnum.item()).Start + TrackEvent(evntEnum.item()).Length >= Vegas.Transport.CursorPosition)) {
                 //ev_edit = 1;
                 var medi_a = TrackEvent(evntEnum.item()).ActiveTake.Media;
                 medi_a.Length = TrackEvent(evntEnum.item()).Length;
                 //MessageBox.Show(medi_a.Generator.Description, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                 var locparam = OFXDouble2DParameter(medi_a.Generator.OFXEffect.FindParameterByName("Location"));
                 //MessageBox.Show(locparam.Keyframes[1], "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                 var NewTickerPos : OFXDouble2D;
                 NewTickerPos.X = locparam.GetValueAtTime(locparam.Keyframes[1].Time).Y - (TrackEvent(evntEnum.item()).FadeIn.Gain*2-1);
                 NewTickerPos.Y = 0.55;
                 locparam.Keyframes[1].Time = TrackEvent(evntEnum.item()).Length - Timecode.FromFrames(1);
                 //MessageBox.Show(NewTickerPos.X, NewTickerPos.Y, MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                 locparam.Keyframes[1].Value = NewTickerPos;
                 Vegas.Transport.CursorPosition = TrackEvent(evntEnum.item()).Start + TrackEvent(evntEnum.item()).Length - Timecode.FromFrames(1);
                 throw(1);
              }
              evntEnum.moveNext();
        }
        CreateGeneratedMedia(Titlebgtrack,"Narrator_Ticker_1");
}
catch (errorMsg)
{
        if (errorMsg != 1) {
	   MessageBox.Show(errorMsg, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
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

function CreateGeneratedMedia(ticker_track, presetName) {

  var preset_pth = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + "\\OFX Presets\\com.sonycreativesoftware_titlesandtext\\Generator\\" + presetName + ".xml";
  if (File.Exists(preset_pth)) {
     File.Delete(preset_pth);
  }

  var writer = new StreamWriter(preset_pth, false, System.Text.Encoding.ASCII);
  writer.WriteLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
  writer.WriteLine("<OfxPreset plugin=\"com.sonycreativesoftware:titlesandtext\" context=\"Generator\" name=\"Narrator_Ticker_1\">");
  writer.WriteLine("<OfxPlugin>com.sonycreativesoftware:titlesandtext</OfxPlugin>");
  writer.WriteLine("<OfxParamTypeString name=\"Text\"><OfxParamValue>{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0\\fnil\\fcharset204 Arial;}}\\viewkind4\\uc1\\pard\\lang1049\\f0\\fs24\\par}</OfxParamValue></OfxParamTypeString>");
  writer.WriteLine("<OfxParamTypeChoice name=\"Alignment\"><OfxParamValue>3</OfxParamValue></OfxParamTypeChoice>");
  writer.WriteLine("</OfxPreset>");
  writer.Close();

  var generator = Vegas.Generators.FindChildByUniqueID("{Svfx:com.sonycreativesoftware:titlesandtext}");
  var src_height = Vegas.Project.Video.Height * 1;
  Vegas.Project.Video.Height = 74;
  var media = new Media(generator, presetName);
  Vegas.Project.Video.Height = src_height;

  var textParam = OFXDouble2DParameter(media.Generator.OFXEffect.FindParameterByName("Location"));
  var bgParam = OFXRGBAParameter(media.Generator.OFXEffect.FindParameterByName("Background"));
  var scaleParam = OFXDoubleParameter(media.Generator.OFXEffect.FindParameterByName("Scale"));

  var newwal = OFXDouble2D(textParam.GetValueAtTime(Timecode.FromSeconds(0)));
  var newwal2 = OFXColor(bgParam.GetValueAtTime(Timecode.FromSeconds(0)));

  newwal.X = 1.0;
  newwal.Y = 0.55;
  textParam.SetValueAtTime(Timecode.FromSeconds(0),newwal);
  newwal.X = 0;
  textParam.SetValueAtTime(Timecode.FromSeconds(5),newwal);
  newwal2.R = 0.25;
  newwal2.G = 0.4921;
  newwal2.B = 0.5;
  newwal2.A = 0.5;
  bgParam.SetValueAtTime(Timecode.FromSeconds(0),newwal2);
  scaleParam.SetValueAtTime(Timecode.FromSeconds(0),14.6);

  if (!media.IsValid()) {
      throw "failed to create media; " + presetName + " (" + presetName + ")";
  }
  var stream = media.Streams[0]; //The "video" stream
  var newEvent = new VideoEvent(new Timecode(Vegas.Transport.CursorPosition), ttl_length);
  ticker_track.Events.Add(newEvent);
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
  var moveby2 = new VideoMotionVertex(0,key_frame.Center.Y-d_height*0.5-Vegas.Project.Video.Height*0.384);
  key_frame.MoveBy(moveby2);

  return newEvent;
} 