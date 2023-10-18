/** 
old school
 **/ 

import System;
import System.Text;
import System.IO;
import System.Windows.Forms;
import Sony.Vegas;

var writer : StreamWriter = null;
var writer_sync : StreamWriter = null;
var video_input = "video1 00:00:00.00 [0]";
var pre_wait = Timecode.FromMilliseconds(4 * 60000); // Время заранее загрузки блока при ожидании по DTMF метке (в минутах)

try
{
	var TopMostTrack = null;
	var bExport_File = 0;
	var empty_event = null;
        var sTempCatPath = Vegas.Project.Video.PrerenderedFilesFolder+"";
        if (sTempCatPath.substr(sTempCatPath.length - 1) != "\\") {
            sTempCatPath = sTempCatPath + "\\";
        }

	var trackEnum = new Enumerator(Vegas.Project.Tracks);
	while (!trackEnum.atEnd() && bExport_File == 0) {
		if (TopMostTrack == null) {
			TopMostTrack = Track(trackEnum.item());
		}
		var evntEnum = new Enumerator(Track(trackEnum.item()).Events);
		while (!evntEnum.atEnd() && bExport_File == 0) {
			if (TrackEvent(evntEnum.item()).Start == Timecode.FromSeconds(86399)) {
				bExport_File = 1;
			}
			evntEnum.moveNext();
		}
		trackEnum.moveNext();
	}
	if (bExport_File == 0) {
		if (TopMostTrack == null) {
			var nontopmosttrack = new AudioTrack(0, "");
			Vegas.Project.Tracks.Add(nontopmosttrack);
			TopMostTrack = new VideoTrack(0, "");
			Vegas.Project.Tracks.Add(TopMostTrack);
		}
		if (TopMostTrack.IsAudio()) {
			empty_event = new AudioEvent(new Timecode(Timecode.FromSeconds(86399)), Timecode.FromFrames(1));
		} else {
			empty_event = new VideoEvent(new Timecode(Timecode.FromSeconds(86399)), Timecode.FromFrames(1));
		}
		TopMostTrack.Events.Add(empty_event);
		empty_event.Locked = 1;
		MessageBox.Show("Режим расписания для проекта подготовлен.\nРазместите видеофайлы в нужные моменты времени суток.", "Режим расписания", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
		throw "fuck";
	}
	bExport_File = 0;
	
	var bThisIsNewBlock = Timecode.FromMilliseconds(0);
	var bThisIsSingleBlock = 1;
	var outputFilename = "";
	var date = new Date().ToString();
	var mnth = date.substring(4,7);
	
	while(date.substring(bExport_File) != "") {
		bExport_File = bExport_File + 1;
	}
	mnth = mnth.replace(/Jan/g, "01");
	mnth = mnth.replace(/Feb/g, "02");
	mnth = mnth.replace(/Mar/g, "03");
	mnth = mnth.replace(/Apr/g, "04");
	mnth = mnth.replace(/May/g, "05");
	mnth = mnth.replace(/Jun/g, "06");
	mnth = mnth.replace(/Jul/g, "07");
	mnth = mnth.replace(/Aug/g, "08");
	mnth = mnth.replace(/Sep/g, "09");
	mnth = mnth.replace(/Oct/g, "10");
	mnth = mnth.replace(/Nov/g, "11");
	mnth = mnth.replace(/Dec/g, "12");
	
	if (date.substring(9,10) == " ") { // date less than 10 - add 0 before digit
		mnth = mnth + "0" + date.substring(8,9);
	} else {
		mnth = mnth + date.substring(8,10);
	}
	
	var titl = "Autoload_" + date.substring(bExport_File-4) + mnth + "_";
	bExport_File = 0;
	
	// MessageBox.Show(date, titl, MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
	
	date = 0;

	var trackEnum = new Enumerator(Vegas.Project.Tracks);
	while (!trackEnum.atEnd()) {
		if (int(trackEnum.item().Name) > 0) {
			var goto_timer = 0;
			if (trackEnum.item().Name.substring(3) == "") {
				goto_timer = int(trackEnum.item().Name.substring(2,3)) * 60 + int(trackEnum.item().Name.substring(1,2)) * 10 * 60 +  int(trackEnum.item().Name.substring(0,1)) * 60 * 60;
			} else {
				goto_timer = int(trackEnum.item().Name.substring(3,4)) * 60 + int(trackEnum.item().Name.substring(2,3)) * 10 * 60 +  int(trackEnum.item().Name.substring(1,2)) * 60 * 60 + int(trackEnum.item().Name.substring(0,1)) * 60 * 60 * 10;
				if (trackEnum.item().Name.substring(4) != "") {
					goto_timer = goto_timer + int(trackEnum.item().Name.substring(4,5)) * 10 + int(trackEnum.item().Name.substring(5,6));
				}
			}
			Vegas.Transport.CursorPosition = Timecode.FromMilliseconds(goto_timer * 1000);
			//MessageBox.Show(goto_timer, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
			trackEnum.item().Name = null;
			throw "fuck";
		}
		var evntEnum = new Enumerator(Track(trackEnum.item()).Events);
		while (!evntEnum.atEnd()) {
			if (TrackEvent(evntEnum.item()).IsVideo() && TrackEvent(evntEnum.item()).Length > Timecode.FromFrames(1)) {
				if (bExport_File == 0) {	// First entry flag !!!!
					if (TrackEvent(evntEnum.item()).FadeIn.Length > Timecode.FromMilliseconds(40) && TrackEvent(evntEnum.item()).Start > pre_wait) {
						mnth = (TrackEvent(evntEnum.item()).Start-pre_wait).ToString(RulerFormat.TimeAndFrames);
					} else {
                                                if (TrackEvent(evntEnum.item()).Start <= Timecode.FromMilliseconds(40)) {
                                                       var prog2 = new System.Diagnostics.Process();
                                              	       var prog2_nfo = new System.Diagnostics.ProcessStartInfo();
                                       	      	       prog2_nfo.UseShellExecute = false;
                                              	       prog2_nfo.RedirectStandardOutput = false;
                                  		       prog2_nfo.WorkingDirectory = Vegas.InstallationDirectory + "";
                                      		       prog2_nfo.FileName = "playlist_settime.exe";
                                                       prog2_nfo.Arguments = '"'+sTempCatPath+'"';
                                                       prog2.StartInfo = prog2_nfo;
                                     		       prog2.Start();
                                                       prog2.WaitForExit();
                                                       //var prog2_out = prog2.StandardOutput.ReadToEnd();
                                    		       //MessageBox.Show(prog2_out);
                                                       ////////////////////////////////////
                                                       var writer2 = new System.IO.StreamReader(sTempCatPath+"settime1.txt");
                                                       titl = "Autoload_" + writer2.ReadLine();
                                                       writer2.Close();
                                                       mnth = titl.substring(18,20)+":"+titl.substring(20,22)+":"+titl.substring(22,24)+",00";
                                                       titl = titl.substring(0,18);
                                                       if (TrackEvent(evntEnum.item()).FadeIn.Length > Timecode.FromMilliseconds(40) && Timecode.FromString(mnth) > pre_wait) {
                                                              mnth = (Timecode.FromString(mnth)-pre_wait).ToString(RulerFormat.TimeAndFrames);
                                                       }
                                                       // время указать вручную (блок стоит в самом начале дорожки)
                                                } else {
						       mnth = TrackEvent(evntEnum.item()).Start.ToString(RulerFormat.TimeAndFrames);
                                                }
					}
					mnth = mnth.replace(/:/g, "");
					outputFilename = ShowSaveFileDialog("Расписание Эфира (*.air)|*.air", "Экспорт в Расписание", Vegas.Project.Summary.Copyright + titl + mnth.substring(0,6) + ".air");
					if (null != outputFilename) {
						bExport_File = 1;
						writer = new StreamWriter(outputFilename, false, System.Text.Encoding.Unicode);
						//writer_sync = new StreamWriter(Path.GetDirectoryName(outputFilename)+"\\"+Path.GetFileNameWithoutExtension(outputFilename)+".cmd", false, System.Text.Encoding.Unicode);
						writer_sync = new StreamWriter(sTempCatPath+"_sync_tv_temp.txt", false, System.Text.Encoding.Unicode);
						writer_sync.WriteLine("@echo off");
						//writer_sync.WriteLine("chcp 1251");
					} else {
						throw "fuck";
					}
				}
				var activeTake = TrackEvent(evntEnum.item()).ActiveTake;
				var mediaPath = activeTake.MediaPath;
				//MessageBox.Show(mediaPath, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
				if (bThisIsNewBlock >= TrackEvent(evntEnum.item()).Start && TrackEvent(evntEnum.item()).Start > Timecode.FromMilliseconds(40)) {
				} else {
					mnth = TrackEvent(evntEnum.item()).Start.ToString(RulerFormat.Time);
					if (date != 0) {
						writer.WriteLine("LogoOff");
						writer.WriteLine(video_input);
						bThisIsSingleBlock = 0;
					}
					bThisIsNewBlock = TrackEvent(evntEnum.item()).Start;
					if (TrackEvent(evntEnum.item()).FadeIn.Length > Timecode.FromMilliseconds(40)) {
						if (bThisIsNewBlock - pre_wait >= Timecode.FromMilliseconds(0)) {
							bThisIsNewBlock = bThisIsNewBlock - pre_wait;
						}
						date = 2;
					} else {
						date = 1;
					}
					
					if (bThisIsNewBlock == Timecode.FromMilliseconds(0)) {
						writer.WriteLine("wait follow 0 Блок " + Path.GetFileNameWithoutExtension(Vegas.Project.FilePath));
						if (date > 1) {
							writer.WriteLine("pause 00:00:05.00 5 сек.на загрузку");
						} else {
							writer.WriteLine("pause 00:00:10.00 5+5 сек.на загрузку");
						}
					} else {
						writer.WriteLine("wait time " + bThisIsNewBlock.ToString(RulerFormat.Time) + " [0] active Блок " + mnth.substring(0,8));
					}

					if (date > 1) {
						writer.WriteLine("gpiwaitshout GPI {NRDTMF_Start_Block} : Ждать старт блока");
						date = 1;
					}
					writer.WriteLine("LogoOn");
				}
				if (mediaPath.substring(1,2) != ":") {
					var lookforslash = 0;
					var lookfor_index = 0;
					while (mediaPath.substring(lookfor_index) != "") {
						lookfor_index = lookfor_index + 1;
						if (mediaPath.substring(lookfor_index,lookfor_index+1) == '\\') {
							lookforslash = lookforslash + 1;
							if (lookforslash >= 3) {
								break;
							}
						}
					}
					//MessageBox.Show(lookfor_index, lookforslash, MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
					mediaPath = "E:" + mediaPath.substring(lookfor_index);
				} else if (outputFilename.substring(1,2) == ":") {
                                        mediaPath = outputFilename.substring(0,2) + mediaPath.substring(2);
                                }
				if (TrackEvent(evntEnum.item()).FadeOut.Length > Timecode.FromMilliseconds(40)) {
					writer.WriteLine("movie <" + activeTake.Offset.ToString(RulerFormat.Time) + "> (" + TrackEvent(evntEnum.item()).Length.ToString(RulerFormat.Time) + ") [0] " + mediaPath);
					writer.WriteLine("gpiwaitshout GPI {NRDTMF_Stop_Block} : Ждать выход из блока");
				} else {
					writer.WriteLine("movie <" + activeTake.Offset.ToString(RulerFormat.Time) + "> " + TrackEvent(evntEnum.item()).Length.ToString(RulerFormat.Time) + " [0] " + mediaPath);
				}
				bThisIsNewBlock = TrackEvent(evntEnum.item()).Start + TrackEvent(evntEnum.item()).Length + Timecode.FromMilliseconds(40);
			}
			if (TrackEvent(evntEnum.item()).IsAudio()) {
				if (TrackEvent(evntEnum.item()).Length > Timecode.FromFrames(1)) {
					for (var tke in TrackEvent(evntEnum.item()).Takes) {
						//MessageBox.Show(tke.MediaPath, "eror", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
						var gain_db = 8.675 * Math.log(TrackEvent(evntEnum.item()).FadeIn.Gain);
						gain_db = gain_db + (8.675 * Math.log(trackEnum.item().Volume));
						gain_db = gain_db.toPrecision(3);
						// var writer2 = new StreamWriter(Path.GetDirectoryName(tke.MediaPath)+"\\"+Path.GetFileNameWithoutExtension(tke.MediaPath)+".SLIni");
						// writer2.WriteLine("AspectX=16");
						// writer2.WriteLine("AspectY=9");
						// writer2.WriteLine("FileStamp4Volume=user");
						// writer2.WriteLine("VolumeDB=" + gain_db.ToString());
						// writer2.Close();
						
						var dest_path2 = tke.MediaPath + "";
						if (dest_path2.substring(1,2) != ":") {
							var lookforslash = 0;
							var lookfor_index = 0;
							while (dest_path2.substring(lookfor_index) != "") {
								lookfor_index = lookfor_index + 1;
								if (dest_path2.substring(lookfor_index,lookfor_index+1) == '\\') {
									lookforslash = lookforslash + 1;
									if (lookforslash >= 3) {
										break;
									}
								}
							}
							//MessageBox.Show(lookfor_index, lookforslash, MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
							dest_path2 = dest_path2.substring(lookfor_index);
						} else {
							dest_path2 = dest_path2.substring(2);
						}
						if (outputFilename.substring(1,2) == ":") {
							dest_path2 = outputFilename.substring(0,2) +dest_path2;
						} else {
							var lookforslash = 0;
							var lookfor_index = 0;
							while (outputFilename.substring(lookfor_index) != "") {
								lookfor_index = lookfor_index + 1;
								if (outputFilename.substring(lookfor_index,lookfor_index+1) == '\\') {
									lookforslash = lookforslash + 1;
									if (lookforslash >= 3) {
										break;
									}
								}
							}
							dest_path2 = outputFilename.substring(0,lookfor_index) + dest_path2;
						}
						gain_db = Path.GetDirectoryName(tke.MediaPath);
						if (gain_db.substring(1,2) == ":" && gain_db.substring(3) == "") {
							gain_db = gain_db.substring(0,2);
						}
						dest_path2 = Path.GetDirectoryName(dest_path2);
						if (dest_path2.substring(1,2) == ":" && dest_path2.substring(3) == "") {
							dest_path2 = dest_path2.substring(0,2);
						}
						writer_sync.WriteLine('robocopy "'+gain_db+'" "'+dest_path2+'" "'+Path.GetFileName(tke.MediaPath)+'"');
						// writer_sync.WriteLine('robocopy "'+gain_db+'" "'+dest_path2+'" "'+Path.GetFileNameWithoutExtension(tke.MediaPath)+'.SLIni" /MOV');
					}
				}
			}
			evntEnum.moveNext();
		}
		trackEnum.moveNext();
	}
	if (bExport_File == 1) {
		writer.WriteLine("LogoOff");
		writer.WriteLine(video_input);
		if (bThisIsSingleBlock == 1) {
			writer.WriteLine("switch shedule");
		}
		writer.Close();
		writer_sync.WriteLine("echo.");
		writer_sync.WriteLine("echo Синхронизация завершена.");
		writer_sync.WriteLine("pause");
		writer_sync.Close();
		
		var prog1 = new System.Diagnostics.Process();
		var prog1_nfo = new System.Diagnostics.ProcessStartInfo();
		prog1_nfo.UseShellExecute = false;
		prog1_nfo.RedirectStandardOutput = false;
		prog1_nfo.FileName = "cmd.exe";
		
		////////////////////////////////
		if (MessageBox.Show("Скопировать видео из проекта расписания в пункт назначения?", "Синхронизация содержимого расписания с пунктом назначения", MessageBoxButtons.YesNo, MessageBoxIcon.Asterisk) == DialogResult.Yes) {
		/////////////////////////////////////////
		
		prog1_nfo.Arguments = '/a /c type "'+sTempCatPath+ '_sync_tv_temp.txt">"'+sTempCatPath+ '_sync_tv_temp.cmd"';
		prog1.StartInfo = prog1_nfo;
		prog1.Start();
		// var prog1_out = prog1.StandardOutput.ReadToEnd();
		// MessageBox.Show(prog1_out);
		prog1.WaitForExit();

		prog1_nfo.Arguments = '/a /c "'+sTempCatPath+'_sync_tv_temp.cmd"';
		prog1.StartInfo = prog1_nfo;
		prog1.Start();
		prog1.WaitForExit();
		
		prog1_nfo.Arguments = '/a /c del "'+sTempCatPath+'_sync_tv_temp.cmd"';
		prog1.StartInfo = prog1_nfo;
		prog1.Start();
		prog1.WaitForExit();

		}

		prog1_nfo.RedirectStandardOutput = true;
		prog1_nfo.Arguments = '/a /c del "'+sTempCatPath+'_sync_tv_temp.txt"';
		prog1.StartInfo = prog1_nfo;
		prog1.Start();
		
		
		// var projct = Vegas.Project.SaveProject("D:\test_it.veg");
	}
	
}

catch (errorMsg)
{
	if (errorMsg != "fuck") {
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