; Inno Setup Script Wizard to update Vegas Pro Scripts with our own tools.
; !!! USE InnoSetup 6.2.2 version to keep support of Windows 7 !!!

[Setup]
AppName=Vegas Pro Scripts TVLesnoy
AppPublisher=Mix3r_Durachok
AppVersion=201125
Compression=lzma
DefaultDirName={autopf64}\VEGAS\VEGAS Pro 13.0
DefaultGroupName=My Program
DisableDirPage=yes
DisableProgramGroupPage=yes
OutputDir=userdocs:
OutputBaseFilename=tvlesnoy_vegaspro_scripts_updater
ShowLanguageDialog=auto
SolidCompression=yes
Uninstallable=no
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl";
Name: "russian"; MessagesFile: "compiler:Languages\Russian.isl";

[Components]
Name: "vid_scripts1"; Description: "Cкрипты для видеоредактора"; Types: custom;
Name: "vid_scripts1/reset"; Description: "Сбросить настройки видеоредактора"; Types: custom;
Name: "videoeditor1"; Description: "Видеоредактор версии 13"; Types: custom;
Name: "videoeditor1/en"; Description: "EN"; Types: custom; Flags: exclusive
Name: "videoeditor1/ru"; Description: "RU"; Types: custom; Flags: exclusive
Name: "vouk"; Description: "Видеокодек Voukoder (аппаратное кодирование) для 13 и 20"; Types: custom;
Name: "videoeditor2"; Description: "Видеоредактор версии 20"; Types: custom;
Name: "videoeditor2/en"; Description: "EN"; Types: custom; Flags: exclusive
Name: "soundeditor"; Description: "Звукорежиссёр"; Types: custom;
Name: "soundeditor/en"; Description: "EN"; Types: custom; Flags: exclusive
Name: "soundeditor/ru"; Description: "RU"; Types: custom; Flags: exclusive
Name: "aradiotempl"; Description: "Звукорежиссёр - шаблон Авторадио"; Types: custom;
Name: "doublecmd_p"; Description: "Double Commander for TV"; Types: custom;
Name: "ffmpeg_p"; Description: "FFMPEG (конвертор видео для Vegas и Double Commander)"; Types: custom;
Name: "networktv"; Description: "Сеть TV (папка рабочих мест Телецентра на Рабочем столе)"; Types: custom;

[Files]
; Place any regular files here
; Source: "{tmp}\git\*"; DestDir: "{app}\Script Menu"; Components: vid_scripts1; Flags: external recursesubdirs
Source: "{tmp}\desktop.ini"; DestDir: "{userdesktop}\Сеть TV"; Components: networktv; Attribs: hidden; Flags: external


[Dirs]
Name: "{commonappdata}\Vegas Pro\13.0"; Components: vid_scripts1
Name: "{userappdata}\Vegas Pro\13.0"; Components: vid_scripts1
Name: "{userappdata}\Sony\Render Templates\wmv11"; Components: vid_scripts1
Name: "{userappdata}\Sony\Render Templates\mpeg2-mc"; Components: vid_scripts1
Name: "{userappdata}\Sony\Render Templates\xdcam ex"; Components: vid_scripts1
Name: "{userappdata}\Sony\Render Templates\voukoder"; Components: videoeditor1
Name: "{userappdata}\VEGAS\Render Templates\voukoder"; Components: videoeditor2
Name: "{autopf64}\Sony\Vegas 7.0\Script Menu"; Components: vid_scripts1
Name: "{autopf64}\VEGAS"; Components: vouk
Name: "{userdocs}\OFX Presets\com.sonycreativesoftware_titlesandtext\Generator"; Components: vid_scripts1
Name: "{commonpf32}\VEGAS\Shared Plug-Ins\Audio_x64"; Components: videoeditor1
Name: "{userdesktop}\Сеть TV"; Components: networktv

[Icons]

[Run]
Filename: robocopy.exe; Parameters: """{tmp}\git"" ""{app}\Script Menu"" /E /MOV"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{app}"" ""playlist_settime.exe"" /MOV"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{commonappdata}\Vegas Pro\13.0"" ""keyboard.ini"""; Flags: runhidden runascurrentuser; 
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{userappdata}\Vegas Pro\13.0"" ""keyboard.ini"" /MOV"; Flags: runhidden runascurrentuser;
;Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{userappdata}\Sony\Render Templates\wmv11"" ""360_admin.*"" /MOV"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{userappdata}\Sony\Render Templates\xdcam ex"" ""YOUTUBE30P.*"" /MOV"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{tmp}\tmp"" ""{userappdata}\Sony\Render Templates\voukoder"" ""VBR*.sft2"" /R:1 /W:1"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{tmp}\tmp"" ""{userappdata}\VEGAS\Render Templates\voukoder"" ""VBR*.sft2"" /R:1 /W:1"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{userappdata}\Sony\Render Templates\voukoder"" ""360_admin.sft2"" /R:1 /W:1"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{userappdata}\VEGAS\Render Templates\voukoder"" ""360_admin.sft2"" /R:1 /W:1"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{tmp}\git"" ""360_admin.sft2"" /R:1 /W:1 /MOV"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{userappdata}\Sony\Render Templates\mpeg2-mc"" ""*PAL Widescreen.sft2"" /MOV"; Flags: runhidden runascurrentuser; 
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{autopf64}\Sony\Vegas 7.0\Script Menu"" ""ctc-sample.png"" /MOV"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{autopf64}\Sony\Vegas 7.0\Script Menu"" ""smai75x75_alpha75_hd.png"" /MOV"; Flags: runhidden runascurrentuser; 
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{app}\.."" ""tvlesnoy_banners.veg"" /MOV"; Flags: runhidden runascurrentuser; 
Filename: "{tmp}\tmp\audio_plugin_update.exe"; Parameters: "-y -o""{commonpf32}\VEGAS\Shared Plug-Ins\Audio_x64"" /q"; Components: videoeditor1; Flags: runhidden runascurrentuser; 
Filename: "{tmp}\tmp\voukdr.exe"; Parameters: "-y -o""{autopf64}\VEGAS"" /q"; Components: vouk; Flags: runhidden runascurrentuser;
Filename: regsvr32.exe; Parameters: "/s ""{autopf64}\VEGAS\voukoder.dll"""; Components: vouk; Flags: runhidden runascurrentuser;

[Code]
var
  DownloadPage: TDownloadWizardPage;

function OnDownloadProgress(const Url, FileName: String; const Progress, ProgressMax: Int64): Boolean;
begin
  if Progress = ProgressMax then
    Log(Format('Successfully downloaded file to {tmp}: %s', [FileName]));
  Result := True;
end;

procedure InitializeWizard;
begin
    DownloadPage := CreateDownloadPage(SetupMessage(msgWizardPreparing), SetupMessage(msgPreparingDesc), @OnDownloadProgress);
end;

procedure GitDown(whattoget:string);
var gittmp:string; i:integer;
begin
    gittmp:='';
    for i:=1 to Length(whattoget) do begin
        if (whattoget[i] = ' ') then begin
            gittmp:=gittmp+'%20';
        end else begin
            gittmp:=gittmp+whattoget[i];
        end;
    end;
    DownloadPage.Add('https://github.com/Mix3r/tvlesnoy_ru_tools/raw/main/vegas_pro/'+gittmp, 'git/'+whattoget, '');
end;
procedure GitDownTmp(whattoget:string);
var gittmp:string; i,jcnt:integer;
begin
    gittmp:='';
    if (whattoget[1] = '@') then begin
        for i:=2 to Length(whattoget) do begin
            gittmp:=gittmp+whattoget[i];
            if (whattoget[i] = '/') then begin
                jcnt:=i*1;
            end;
        end;
        whattoget:='';
        for i:=jcnt to Length(gittmp) do begin
            if (gittmp[i] = ' ') then begin
                whattoget:=whattoget+'%20';
            end else begin
                whattoget:=whattoget+gittmp[i];
            end;
        end;
        DownloadPage.Add(gittmp, 'tmp/'+whattoget, '');
    end else begin
        for i:=1 to Length(whattoget) do begin
            if (whattoget[i] = ' ') then begin
                gittmp:=gittmp+'%20';
            end else begin
                gittmp:=gittmp+whattoget[i];
            end;
        end;
        DownloadPage.Add('https://github.com/Mix3r/tvlesnoy_ru_tools/raw/main/vegas_pro/'+gittmp, 'tmp/'+whattoget, '');
    end;
end;

function NextButtonClick(CurPageID: Integer): Boolean;
var ResultCode: integer; wr_str:string; 
begin
    if CurPageID = wpReady then begin
        DownloadPage.Clear;
        // add network shortcuts
        if (WizardIsComponentSelected('networktv')) then begin
            wr_str:='[.ShellClassInfo]' + #13#10 + ExpandConstant('IconResource={sys}\shell32.dll,18');
            SaveStringToFile(ExpandConstant('{tmp}\desktop.ini'), wr_str, False);
            DownloadPage.Show;
            GitDownTmp('shortcuts_net_win.cab');
            GitDownTmp('shortcuts_net_dc.cab');
            try
                 DownloadPage.Download;
            finally
                 DownloadPage.Hide;
            end;
            if FileExists(ExpandConstant('{tmp}\tmp\shortcuts_net_win.cab')) then begin
                ForceDirectories(ExpandConstant('{userdesktop}\Сеть TV'));
                if Exec('expand.exe',ExpandConstant('-F:* "{tmp}\tmp\shortcuts_net_win.cab" "{userdesktop}\Сеть TV"'), '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                end;
            end;
            if FileExists(ExpandConstant('{tmp}\tmp\shortcuts_net_dc.cab')) then begin
                ForceDirectories(ExpandConstant('{autopf64}\Totalcmd_p\network'));
                if Exec('expand.exe',ExpandConstant('-F:* "{tmp}\tmp\shortcuts_net_dc.cab" "{autopf64}\Totalcmd_p\network"'), '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                end;
            end;
            Result := True;
        end;
        // videoeditor section
        if (WizardIsComponentSelected('videoeditor1')) then begin
            DownloadPage.Clear;
            GitDownTmp('video_editor1.7z.001'); 
            GitDownTmp('video_editor1.7z.002'); 
            GitDownTmp('video_editor1.7z.003'); 
            GitDownTmp('video_editor1.7z.004'); 
            GitDownTmp('video_editor1.7z.005'); 
            GitDownTmp('video_editor1.7z.006'); 
            GitDownTmp('video_editor1.7z.007');
            GitDownTmp('VBR46888UHD.sft2');
            GitDownTmp('VBR23444HD.sft2');
            GitDownTmp('audio_plugin_update.exe');
            GitDownTmp('video_editor1.exe'); 
            DownloadPage.Show;
            try
                try
                    DownloadPage.Download; // This downloads the files to {tmp}
                    Result := True;
                except
                    if DownloadPage.AbortedByUser then begin
                        Log('Aborted by user.')
                    end else begin
                        SuppressibleMsgBox(AddPeriod(GetExceptionMessage), mbCriticalError, MB_OK, IDOK);
                    end;
                    {Result := False;}
                end;
            finally
                if Exec(ExpandConstant('{tmp}\tmp\video_editor1.exe'), '-y /q', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin

                end else begin

                end;
                if (WizardIsComponentSelected('videoeditor1/en')) then begin
                    ResultCode:= -999;
                    While ResultCode <> 0 do begin
                    if Exec(ExpandConstant('{tmp}\tmp\VegasPro-13.0.545.exe'), '/S /E', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin

                    end else begin
                        Sleep(2000);
                    end;
                    end;
                end else if (WizardIsComponentSelected('videoeditor1/ru')) then begin
                    ResultCode:= -999;
                    While ResultCode <> 0 do begin
                    if Exec(ExpandConstant('{tmp}\tmp\VegasPro-13.0.545.exe'), '/S /R', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin

                    end else begin
                        Sleep(2000);

                    end;
                    end;
                end;
                DownloadPage.Hide;
            end;
        end;
        // videoeditor section ends here
        if (WizardIsComponentSelected('videoeditor2')) then begin
            DownloadPage.Clear;
            GitDownTmp('ve19p.7z.001');
            GitDownTmp('ve19p.7z.002');
            GitDownTmp('ve19p.7z.003');
            GitDownTmp('ve19p.7z.004');
            GitDownTmp('ve19p.7z.005');
            GitDownTmp('ve19p.7z.006');
            GitDownTmp('ve19p.7z.007');
            GitDownTmp('ve19p.7z.008');
            GitDownTmp('ve19p.7z.009');
            GitDownTmp('ve19p.7z.010');
            GitDownTmp('ve19p.7z.011');
            GitDownTmp('VBR46888UHD.sft2');
            GitDownTmp('VBR23444HD.sft2');
            GitDownTmp('ve19p.exe'); 
            DownloadPage.Show;
            try
                try
                    DownloadPage.Download; // This downloads the files to {tmp}
                    Result := True;
                except
                    if DownloadPage.AbortedByUser then begin
                        Log('Aborted by user.')
                    end else begin
                        SuppressibleMsgBox(AddPeriod(GetExceptionMessage), mbCriticalError, MB_OK, IDOK);
                    end;
                    {Result := False;}
                end;
            finally
                if Exec(ExpandConstant('{tmp}\tmp\ve19p.exe'), '-y /q', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin

                end else begin

                end;
                if (WizardIsComponentSelected('videoeditor2/en')) then begin
                    if Exec(ExpandConstant('{tmp}\tmp\ve19.exe'), '', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin

                    end else begin

                    end;
                end;
                DownloadPage.Hide;
            end;
        end;
        // videoeditor section ends here
        // voukoder section
        if (WizardIsComponentSelected('vouk')) then begin
            DownloadPage.Clear;
            GitDownTmp('voukdr.exe');
            if FileExists(ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0\vegas130.exe')) then begin
                    GitDownTmp('voukoderplug13.zip');
            end;
            if FileExists(ExpandConstant('{autopf64}\VEGAS\Vegas Pro 20\vegas200.exe')) then begin
                    GitDownTmp('voukoderplug.zip');
            end;
            DownloadPage.Show;
            try
                try
                    DownloadPage.Download; // This downloads the files to {tmp}
                    Result := True;
                except
                    if DownloadPage.AbortedByUser then begin
                        Log('Aborted by user.')
                    end else begin
                        SuppressibleMsgBox(AddPeriod(GetExceptionMessage), mbCriticalError, MB_OK, IDOK);
                    end;
                    {Result := False;}
                end;
            finally
                // connect 13 voukoder
                if FileExists(ExpandConstant('{tmp}\tmp\voukoderplug13.zip')) then begin
                ForceDirectories(ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0\FileIO Plug-Ins\voukoderplug'));
                if Exec('powershell.exe',ExpandConstant('-command "Expand-Archive -Force ''{tmp}\tmp\voukoderplug13.zip'' ''{autopf64}\VEGAS\VEGAS Pro 13.0\FileIO Plug-Ins\voukoderplug'''), '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                        SaveStringToFile(ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0\Voukoder-x64.fio2007-config'), '[FileIO Plug-Ins]' + #13#10 + 'voukoderplug=FileIO Plug-Ins\voukoderplug\voukoderplug13.dll', False);
                end else begin
                end;
                end;
                
                // connect 20 voukoder
                if FileExists(ExpandConstant('{tmp}\tmp\voukoderplug.zip')) then begin
                ForceDirectories(ExpandConstant('{autopf64}\VEGAS\Vegas Pro 20\FileIO Plug-Ins\voukoderplug'));
                if Exec('powershell.exe',ExpandConstant('-command "Expand-Archive -Force ''{tmp}\tmp\voukoderplug.zip'' ''{autopf64}\VEGAS\Vegas Pro 20\FileIO Plug-Ins\voukoderplug'''), '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                        SaveStringToFile(ExpandConstant('{autopf64}\VEGAS\Vegas Pro 20\Voukoder-x64.fio2007-config'), '[FileIO Plug-Ins]' + #13#10 + 'voukoderplug=FileIO Plug-Ins\voukoderplug\voukoderplug.dll', False);
                end else begin
                end;
                end;
                DownloadPage.Hide;
            end;
        end;
        // voukoder section ends here
        // soundeditor section
        if (WizardIsComponentSelected('soundeditor')) then begin
            DownloadPage.Clear;
            GitDownTmp('soundeditor.7z.001');
            GitDownTmp('soundeditor.7z.002');
            GitDownTmp('soundeditor.exe');
            DownloadPage.Show;
            try
                try
                    DownloadPage.Download; // This downloads the files to {tmp}
                    Result := True;
                except
                    if DownloadPage.AbortedByUser then begin
                        Log('Aborted by user.')
                    end else begin
                        SuppressibleMsgBox(AddPeriod(GetExceptionMessage), mbCriticalError, MB_OK, IDOK);
                    end;
                    {Result := False;}
                end;
            finally
                if Exec(ExpandConstant('{tmp}\tmp\soundeditor.exe'), '-y /q', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin

                end else begin

                end;
                if (WizardIsComponentSelected('soundeditor/en')) then begin
                    if Exec(ExpandConstant('{tmp}\tmp\MAGIX.Sound.Forge.Pro.v11.0.0.345.exe'), '/S /EN', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin

                    end else begin

                    end;
                end else if (WizardIsComponentSelected('soundeditor/ru')) then begin
                    if Exec(ExpandConstant('{tmp}\tmp\MAGIX.Sound.Forge.Pro.v11.0.0.345.exe'), '/S /RU', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin

                    end else begin

                    end;
                end;
                DownloadPage.Hide;
            end;
        end;
        // soundeditor section ends here
        // Autoradio template goes here
        if (WizardIsComponentSelected('aradiotempl')) then begin
            DownloadPage.Clear;           
            GitDownTmp('aradiocopy.7z.001');
            GitDownTmp('aradiocopy.7z.002');
            GitDownTmp('aradiocopy.exe');
            DownloadPage.Show;
            try
                try
                    DownloadPage.Download; // This downloads the files to {tmp}
                    Result := True;
                except
                    if DownloadPage.AbortedByUser then begin
                        Log('Aborted by user.')
                    end else begin
                        SuppressibleMsgBox(AddPeriod(GetExceptionMessage), mbCriticalError, MB_OK, IDOK);
                    end;
                    {Result := False;}
                end;
            finally
                if Exec(ExpandConstant('{tmp}\tmp\aradiocopy.exe'), '/S', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                end else begin
                end;
                DownloadPage.Hide;
            end;
        end;
        // dc tv ends here
        // Double Commander TV goes here
        if (WizardIsComponentSelected('doublecmd_p')) then begin
            DownloadPage.Clear;           
            GitDownTmp('dc32.exe');
            DownloadPage.Show;
            try
                try
                    DownloadPage.Download; // This downloads the files to {tmp}
                    Result := True;
                except
                    if DownloadPage.AbortedByUser then begin
                        Log('Aborted by user.')
                    end else begin
                        SuppressibleMsgBox(AddPeriod(GetExceptionMessage), mbCriticalError, MB_OK, IDOK);
                    end;
                    {Result := False;}
                end;
            finally
                if Exec(ExpandConstant('{tmp}\tmp\dc32.exe'), '/S', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                end else begin
                end;
                DownloadPage.Hide;
            end;
        end;
        // dc tv ends here
        // FFMPEG goes here
        if (WizardIsComponentSelected('ffmpeg_p')) then begin
            DownloadPage.Clear;           
            GitDownTmp('@https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl-shared.zip');
            GitDownTmp('setup_ffmpeg_latest.cmd');
            DownloadPage.Show;
            try
                try
                    DownloadPage.Download; // This downloads the files to {tmp}
                    Result := True;
                except
                    if DownloadPage.AbortedByUser then begin
                        Log('Aborted by user.')
                    end else begin
                        SuppressibleMsgBox(AddPeriod(GetExceptionMessage), mbCriticalError, MB_OK, IDOK);
                    end;
                    {Result := False;}
                end;
            finally
                if Exec('cmd.exe', ExpandConstant('/c "{tmp}\tmp\setup_ffmpeg_latest.cmd"'), '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                end else begin
                end;
                DownloadPage.Hide;
            end;
        end;
        // ffmpeg ends here
        // scripts section goes here
        if (WizardIsComponentSelected('vid_scripts1')) then begin
            DownloadPage.Clear;
            GitDown('ConvertAllMpegHD_AVI-DV.js');
            GitDown('ConvertAllMpegHD_AVI-DV.js.png');
            GitDown('CTC Titles.js');
            GitDown('CTC Titles.js.png');
            GitDown('ctc-sample.png');
            GitDown('ctc-sample.psd');
            GitDown('D_Blender_Ticker.js');
            GitDown('D_Blender_Ticker.js.png');
            GitDown('FdOnAir_Export.js');
            GitDown('FdOnAir_Export.js.png');
            GitDown('Fish_Accomplish.js');
            GitDown('Fish_Accomplish.js.png');
            GitDown('Norm_Arbitrary.js');
            GitDown('Norm_Arbitrary.js.png');
            GitDown('playlist_settime.exe');
            GitDown('tvlesnoy_banners.veg');
            GitDown('Remove Letterboxing.cs');
            GitDown('Remove Letterboxing.cs.png');
            GitDown('Remove_Doubles.js');
            GitDown('Render_Youtube_1080_30p.js');
            GitDown('Render_Youtube_1080_30p.js.png');
            GitDown('SetHD720pAndRender.js');
            GitDown('SetHD720pAndRender.js.png');
            GitDown('SetLowerFieldAndRender.js');
            GitDown('setlowerfieldandrender.js.png');
            GitDown('SetLowerFieldAndRender_360.js');
            GitDown('SetLowerFieldAndRender_360.js.png');
            GitDown('smai75x75_alpha75_hd.png');
            GitDown('WindowsMediaVideo.js');
            GitDown('WindowsMediaVideo.js.png');
            GitDown('Титры_спектрмаи.psd');
            GitDown('keyboard.ini');
            GitDown('360_admin.sft2');
            GitDown('YOUTUBE30P.sft2'); 
            GitDown('ОТЧЁТ_DVD Architect PAL Widescreen.sft2');
            GitDown('video_editor1_setup.reg');
            GitDown('wingeneric_ve1.reg');
            GitDown('tvlesnoy_moveleft.js');
            GitDown('tvlesnoy_moveright.js');
            GitDown('tvlesnoy_moveup.js');
            GitDown('tvlesnoy_movedown.js');
            GitDown('tvlesnoy_movenull.js');
            GitDown('tvlesnoy_scaleup.js');
            GitDown('tvlesnoy_scaledown.js');
            GitDown('tvlesnoy_scaleup_x.js');
            GitDown('tvlesnoy_scaledown_x.js');
            GitDown('tvlesnoy_scalexy.js');
            GitDown('tvlesnoy_rotate.js');
            GitDown('tvlesnoy_vegaspro_scripts_updater.iss');
            DownloadPage.Show;
            try
                try
                    DownloadPage.Download; // This downloads the files to {tmp}
                    Result := True;
                except
                    if DownloadPage.AbortedByUser then begin
                        Log('Aborted by user.')
                    end else begin
                        SuppressibleMsgBox(AddPeriod(GetExceptionMessage), mbCriticalError, MB_OK, IDOK);
                    end;
                    Result := False;
                end;
            finally
                DownloadPage.Hide;
                if Exec('reg.exe',ExpandConstant('IMPORT "{tmp}\git\wingeneric_ve1.reg"'), '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then begin
                end else begin
                end;
                if (WizardIsComponentSelected('vid_scripts1/reset')) then begin
                    if Exec('reg.exe',ExpandConstant('IMPORT "{tmp}\git\video_editor1_setup.reg"'), '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then begin
                    end else begin
                    end;
                end;
            end;
        end;
        // scripts section ends here
    end else Result := True;
end;
