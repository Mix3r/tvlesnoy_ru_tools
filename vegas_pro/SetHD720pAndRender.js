import System;
import System.IO;
//import System.Object;
//import System.Windows.Forms;
import Sony.Vegas;
import ScriptPortal.Vegas;
var proxytxt : StreamWriter = null;

try {
    var sTempCatPath = Vegas.Project.Video.PrerenderedFilesFolder+"";
    if (Vegas.Project.FilePath != null) {
        sTempCatPath = Path.GetDirectoryName(Vegas.Project.FilePath)+"\\";
    }
    var nCCounter = 0;
    var nCCounter2 = 0;
    var sFFMpegPath = "\""+System.Environment.GetFolderPath(System.Environment.SpecialFolder.ProgramFiles)+"\\Totalcmd_p\\FFMPEG\\ffmpeg.exe\"";
    var bStreamMade = 0;
    for (var mTmpMedia in Vegas.Project.MediaPool) {
        if (mTmpMedia.HasVideo()) {
            var sMpPart = mTmpMedia.FilePath.substring(1,2);
            if (sMpPart == ":" || sMpPart == "\\") {
                for (var sTmpStm in mTmpMedia.Streams) {
                    if (sTmpStm.MediaType == MediaType.Video && !sTmpStm.Parent.IsGenerated()) {
                        if (sTmpStm.FrameRate > 2.00) {
                            nCCounter = nCCounter + 1;
                        }
                    }
                }
            }
        }
    }
    for (var mTmpMedia in Vegas.Project.MediaPool) {
        if (mTmpMedia.HasVideo()) {
            var sMpPart = mTmpMedia.FilePath.substring(1,2);
            if (sMpPart == ":" || sMpPart == "\\") {
                for (var sTmpStm in mTmpMedia.Streams) {
                    if (sTmpStm.MediaType == MediaType.Video && !sTmpStm.Parent.IsGenerated()) {
                        if (sTmpStm.FrameRate > 2.00) {
                            if (bStreamMade == 0) {
                                bStreamMade = 1;
                                proxytxt = new StreamWriter(sTempCatPath+"_proxybuild.txt", false, System.Text.Encoding.Unicode);
                                proxytxt.WriteLine("if not DEFINED IS_MINIMIZED set IS_MINIMIZED=1 \&\& start \"\" /min \"\%\~dpnx0\" \%\* \&\& exit");
                            }
                            if (null != proxytxt) {
                                nCCounter2 = nCCounter2 + 1;
                                proxytxt.WriteLine("title БУФЕР "+nCCounter2+"\/"+nCCounter+" - "+Path.GetFileNameWithoutExtension(mTmpMedia.FilePath));
                                proxytxt.WriteLine(sFFMpegPath+" -hwaccel cuvid -hwaccel_output_format cuda -y -i \""+mTmpMedia.FilePath+"\" -vf \"scale_cuda=w=-1:h=-1:format=nv12,hwdownload,format=nv12,scale=w=480:h=-1\" -c:v h264_nvenc -preset p2 -qp 25 -g 2 -movflags faststart -an -f mp4 \""+mTmpMedia.FilePath+".sfvp0\"");
                                proxytxt.WriteLine("IF \%ERRORLEVEL\% NEQ 0 (");
                                proxytxt.WriteLine("    "+sFFMpegPath+" -y -i \""+mTmpMedia.FilePath+"\" -c:v libx264 -preset ultrafast -crf 15 -g 2 -vf \"scale=480:-1:in_range=full:out_range=full:flags=lanczos\" -movflags faststart -an -f mp4 \""+mTmpMedia.FilePath+".sfvp0\"");
                                proxytxt.WriteLine(")");
                            }
                        }
                    }
                }
            }
        }
    }
    if (null != proxytxt) {
        proxytxt.WriteLine("del \"\%\~dp0_proxybuild.txt\" /F /Q");
        proxytxt.WriteLine("del \"\%\~dpnx0\" /F /Q \&\& exit");
        proxytxt.Close();
        proxytxt = null;
        var prog1 = new System.Diagnostics.Process();
		prog1.StartInfo.UseShellExecute = false;
		prog1.StartInfo.RedirectStandardOutput = false;
		prog1.StartInfo.FileName = "cmd.exe";

        prog1.StartInfo.Arguments = '/a /c type "'+sTempCatPath+ '_proxybuild.txt">"'+sTempCatPath+ '_proxybuild.cmd"';
        prog1.Start();
        prog1.WaitForExit();
        prog1.StartInfo.Arguments = '/a /c "'+sTempCatPath+'_proxybuild.cmd"';
        prog1.Start(prog1.StartInfo);
        Vegas.Project.Preview.PreviewSize = VideoPreviewSize.Full;
        Vegas.Project.Preview.RenderQuality = VideoRenderQuality.Preview;
    }
}

catch(e) {
}

finally {
    if (null != proxytxt) {
        proxytxt.Close();
    }
}