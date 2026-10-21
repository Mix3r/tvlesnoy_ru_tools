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
Name: "vid_scripts1/keep"; Description: "Оставить настройки на данный момент"; Types: custom; Flags: exclusive
Name: "vid_scripts1/reset"; Description: "Сбросить настройки видеоредактора"; Types: custom; Flags: exclusive
Name: "videoeditor1"; Description: "Видеоредактор версии 13"; Types: custom;
Name: "videoeditor1/en"; Description: "Английский"; Types: custom; Flags: exclusive
Name: "videoeditor1/ru"; Description: "Русский (неисправная работа)"; Types: custom; Flags: exclusive
Name: "videoeditor2"; Description: "Видеоредактор версии 20"; Types: custom;
Name: "videoeditor2/en"; Description: "Английский"; Types: custom; Flags: exclusive
Name: "vouk"; Description: "Видеокодек Voukoder (аппаратное кодирование) для 13 и 20"; Types: custom;
Name: "soundeditor"; Description: "Звукорежиссёр"; Types: custom;
Name: "soundeditor/en"; Description: "Английский"; Types: custom; Flags: exclusive
Name: "soundeditor/ru"; Description: "Русский"; Types: custom; Flags: exclusive
Name: "aradiotempl"; Description: "Звукорежиссёр - шаблон Авторадио"; Types: custom;
Name: "doublecmd_p"; Description: "Double Commander for TV"; Types: custom;
Name: "ffmpeg_p"; Description: "FFMPEG (конвертор видео для Vegas и Double Commander)"; Types: custom;
Name: "networktv"; Description: "Сеть TV (папка рабочих мест Телецентра на Рабочем столе)"; Types: custom;

[Files]
; Place any regular files here
; Source: "{tmp}\git\*"; DestDir: "{app}\Script Menu"; Components: vid_scripts1; Flags: external recursesubdirs
Source: "curl.exe"; DestDir: "{tmp}"

[Code]
var GitDownPath:string; ProgressPage: TOutputProgressWizardPage;

function GitRetreat(whattowipe:string):boolean;
begin
    DelayDeleteFile(GitDownPath+'\'+whattowipe,20);
    //SuppressibleMsgBox(GitDownPath+'\'+whattowipe, mbCriticalError, MB_OK, IDOK);
    Result:=true;
end;

function GitDown(whattoget:string; nPbar:integer):boolean;
var ResultCode:integer; gittmp:string;
begin
    ProgressPage.SetProgress(nPbar, 100);
    ProgressPage.SetText('Устанавливается:', whattoget);
    ResultCode:=-999;
    Result:=false;
    
    gittmp:='';

    for nPbar:=1 to Length(whattoget) do begin
        if (whattoget[nPbar] = '/') then begin
            gittmp:='/';
            break;
        end else if (whattoget[nPbar] = ' ') then begin
            gittmp:=gittmp+'%20';
        end else begin
            gittmp:=gittmp+whattoget[nPbar];
        end;
    end;

    if (gittmp = '/') then begin
        gittmp:=whattoget;
        whattoget:='';
        for nPbar:=Length(gittmp) downto 1 do begin
            if (gittmp[nPbar] = '/') then begin
                break;
            end else begin
                whattoget:=gittmp[nPbar]+whattoget;
            end;
        end;
    end else begin
        gittmp:='https://github.com/Mix3r/tvlesnoy_ru_tools/raw/refs/heads/main/vegas_pro/'+gittmp;
    end;

    if Exec(ExpandConstant('{tmp}\curl.exe'), ExpandConstant('--ssl-no-revoke -L -o "'+GitDownPath+'\'+whattoget+'" "'+gittmp+'"'), '', SW_SHOWMINNOACTIVE, ewWaitUntilTerminated, ResultCode) then begin
        if ResultCode = 0 then begin
            Result:=true;
        end;
    end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var ResultCode:integer; SetupLang:char; 
begin
    if CurStep=ssPostInstall then begin
        ProgressPage:=CreateOutputProgressPage('','');
        ProgressPage.Show;
        // Video editor section treat
        if (WizardIsComponentSelected('videoeditor1')) then begin
            GitDownPath:=ExpandConstant('{app}');
            ForceDirectories(GitDownPath);
            ResultCode:=-999;
            if GitDown('video_editor1.7z.001',1) then
            if GitDown('video_editor1.7z.002',20) then
            if GitDown('video_editor1.7z.003',30) then
            if GitDown('video_editor1.7z.004',40) then
            if GitDown('video_editor1.7z.005',50) then
            if GitDown('video_editor1.7z.006',60) then
            if GitDown('video_editor1.7z.007',70) then
            if GitDown('video_editor1.exe',80) then begin
                // success
                ResultCode:= -999;
                While ResultCode <> 0 do begin
                    if Exec(GitDownPath+'\video_editor1.exe', '-y /q', '', SW_SHOWMINNOACTIVE, ewWaitUntilTerminated, ResultCode) then begin
                    end else begin
                        Sleep(2000);
                    end;
                end;
            end;

            if GitRetreat('video_editor1.7z.001') then
            if GitRetreat('video_editor1.7z.002') then
            if GitRetreat('video_editor1.7z.003') then
            if GitRetreat('video_editor1.7z.004') then
            if GitRetreat('video_editor1.7z.005') then
            if GitRetreat('video_editor1.7z.006') then
            if GitRetreat('video_editor1.7z.007') then
            if GitRetreat('video_editor1.exe') then begin
            end;

            if ResultCode = 0 then begin
                SetupLang:='E';
                if (WizardIsComponentSelected('videoeditor1/ru')) then begin
                    SetupLang:='R';
                end;
                ResultCode:= -999;
                While ResultCode <> 0 do begin
                    if Exec(GitDownPath+'\VegasPro-'+'13.0.545'+'.exe', '/S /'+SetupLang, '', SW_SHOWMINNOACTIVE, ewWaitUntilTerminated, ResultCode) then begin
                    end else begin
                        Sleep(2000);
                    end;
                end;
                if GitRetreat('VegasPro-'+'13.0.545'+'.exe') then
                if GitRetreat('vegas.tut') then
                if GitRetreat('vegasdeu.tut') then
                if GitRetreat('vegasesp.tut') then
                if GitRetreat('vegasfra.tut') then
                if GitRetreat('vegasjpn.tut') then
                if GitRetreat('vidcap6.tut') then begin
                end;
                if GitDown('audio_plugin_update.exe',90) then begin
                    ForceDirectories(ExpandConstant('{commonpf32}\VEGAS\Shared Plug-Ins\Audio_x64'));
                    ResultCode:= -999;
                    While ResultCode <> 0 do begin
                        if Exec(GitDownPath+'\audio_plugin_update.exe', '-y -o"'+ExpandConstant('{commonpf32}\VEGAS\Shared Plug-Ins\Audio_x64')+'" /q', '', SW_SHOWMINNOACTIVE, ewWaitUntilTerminated, ResultCode) then begin
                        end else begin
                            Sleep(2000);
                        end;
                    end;
                end;
                if GitRetreat('audio_plugin_update.exe') then begin
                end;
            end;
            if ResultCode <> 0 then begin
                SuppressibleMsgBox('Видео редактор не установлен!', mbCriticalError, MB_OK, IDOK);
            end;
        end;

        // Video editor 2
        if (WizardIsComponentSelected('videoeditor2')) then begin
            GitDownPath:=ExpandConstant('{autopf64}\VEGAS\Vegas Pro 20');
            ForceDirectories(GitDownPath);
            ResultCode:=-999;
            if GitDown('ve19p.7z.001',1) then
            if GitDown('ve19p.7z.002',10) then
            if GitDown('ve19p.7z.003',20) then
            if GitDown('ve19p.7z.004',30) then
            if GitDown('ve19p.7z.005',40) then
            if GitDown('ve19p.7z.006',50) then
            if GitDown('ve19p.7z.007',60) then
            if GitDown('ve19p.7z.008',70) then
            if GitDown('ve19p.7z.009',80) then
            if GitDown('ve19p.7z.010',90) then
            if GitDown('ve19p.7z.011',95) then
            if GitDown('ve19p.exe',99) then begin
                // success
                ResultCode:= -999;
                While ResultCode <> 0 do begin
                    if Exec(GitDownPath+'\ve19p.exe', '-y /q', '', SW_SHOWMINNOACTIVE, ewWaitUntilTerminated, ResultCode) then begin
                    end else begin
                        Sleep(2000);
                    end;
                end;
            end;

            if GitRetreat('ve19p.7z.001') then
            if GitRetreat('ve19p.7z.002') then
            if GitRetreat('ve19p.7z.003') then
            if GitRetreat('ve19p.7z.004') then
            if GitRetreat('ve19p.7z.005') then
            if GitRetreat('ve19p.7z.006') then
            if GitRetreat('ve19p.7z.007') then
            if GitRetreat('ve19p.7z.008') then
            if GitRetreat('ve19p.7z.009') then
            if GitRetreat('ve19p.7z.010') then
            if GitRetreat('ve19p.7z.011') then
            if GitRetreat('ve19p.exe') then begin
            end;

            if ResultCode = 0 then begin
                //SetupLang:='E';
                //if (WizardIsComponentSelected('videoeditor2/ru')) then begin
                //    SetupLang:='R';
                //end;
                ResultCode:= -999;
                While ResultCode <> 0 do begin
                    if Exec(GitDownPath+'\ve19.exe', '', '', SW_SHOWMINNOACTIVE, ewWaitUntilTerminated, ResultCode) then begin
                    end else begin
                        Sleep(2000);
                    end;
                end;
                if GitRetreat('ve19.exe') then
                if GitRetreat('vegas.tut') then
                if GitRetreat('vegasdeu.tut') then
                if GitRetreat('vegasesp.tut') then
                if GitRetreat('vegasfra.tut') then
                if GitRetreat('vegasjpn.tut') then
                if GitRetreat('vidcap6.tut') then begin
                end;
            end;
            if ResultCode <> 0 then begin
                SuppressibleMsgBox('Видео редактор 20 не установлен!', mbCriticalError, MB_OK, IDOK);
            end;
        end;

        // Voukoder section
        if (WizardIsComponentSelected('vouk')) then begin
            GitDownPath:=ExpandConstant('{autopf64}\VEGAS');
            ForceDirectories(GitDownPath);
            ResultCode:=-999;
            if GitDown('voukdr.exe',1) then begin
                While ResultCode <> 0 do begin
                    if Exec(GitDownPath+'\voukdr.exe', '-y -o"'+ExpandConstant('{autopf64}\VEGAS')+'" /q', '', SW_SHOWMINNOACTIVE, ewWaitUntilTerminated, ResultCode) then begin
                    end else begin
                        Sleep(2000);
                    end;
                end;
                GitRetreat('voukdr.exe');
                Exec('regsvr32.exe', '/s "'+GitDownPath+'\voukoder.dll"', '', SW_SHOWMINNOACTIVE, ewWaitUntilTerminated, ResultCode);
                if FileExists(ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0\vegas130.exe')) then begin
                    if GitDown('voukoderplug13.cab',10) then begin
                        ForceDirectories(ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0\FileIO Plug-Ins\voukoderplug'));
                        if Exec('expand.exe','-F:* "'+GitDownPath+'\voukoderplug13.cab" "'+ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0\FileIO Plug-Ins\voukoderplug\voukoderplug13.dll')+'"', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                            if ResultCode = 0 then begin
                                SaveStringToFile(ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0\Voukoder-x64.fio2007-config'), '[FileIO Plug-Ins]' + #13#10 + 'voukoderplug=FileIO Plug-Ins\voukoderplug\voukoderplug13.dll', False);
                            end;
                        end;
                    end else begin
                        SuppressibleMsgBox('Voukoder для 13 версии не загружен!', mbCriticalError, MB_OK, IDOK);
                    end;
                end;
                if FileExists(ExpandConstant('{autopf64}\VEGAS\Vegas Pro 20\vegas200.exe')) then begin
                    if GitDown('voukoderplug.cab',15) then begin
                        ForceDirectories(ExpandConstant('{autopf64}\VEGAS\Vegas Pro 20\FileIO Plug-Ins\voukoderplug'));
                        if Exec('expand.exe','-F:* "'+GitDownPath+'\voukoderplug.cab" "'+ExpandConstant('{autopf64}\VEGAS\Vegas Pro 20\FileIO Plug-Ins\voukoderplug\voukoderplug.dll')+'"', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                            if ResultCode = 0 then begin
                                SaveStringToFile(ExpandConstant('{autopf64}\VEGAS\Vegas Pro 20\Voukoder-x64.fio2007-config'), '[FileIO Plug-Ins]' + #13#10 + 'voukoderplug=FileIO Plug-Ins\voukoderplug\voukoderplug.dll', False);
                            end;
                        end;
                    end else begin
                        SuppressibleMsgBox('Voukoder для 20 версии не загружен!', mbCriticalError, MB_OK, IDOK);
                    end;
                end;
                GitRetreat('voukoderplug13.cab');
                GitRetreat('voukoderplug.cab');
            end else begin
                SuppressibleMsgBox('Voukoder не загружен!', mbCriticalError, MB_OK, IDOK);
            end;
            GitRetreat('voukdr.exe');
        end;

        // scripts section
        if (WizardIsComponentSelected('vid_scripts1')) then begin
            //
            if FileExists(ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0\vegas130.exe')) then begin
                GitDownPath:=ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0\Script Menu');
                ForceDirectories(GitDownPath);
                if GitDown('ConvertAllMpegHD_AVI-DV.js',2) then
                if GitDown('ConvertAllMpegHD_AVI-DV.js.png',4) then
                if GitDown('CTC Titles.js',6) then
                if GitDown('CTC Titles.js.png',8) then
                if GitDown('D_Blender_Ticker.js',10) then
                if GitDown('D_Blender_Ticker.js.png',12) then
                if GitDown('FdOnAir_Export.js',14) then
                if GitDown('FdOnAir_Export.js.png',16) then
                if GitDown('Fish_Accomplish.js',18) then
                if GitDown('Fish_Accomplish.js.png',20) then
                if GitDown('Norm_Arbitrary.js',22) then
                if GitDown('Norm_Arbitrary.js.png',24) then
                if GitDown('Remove_Doubles.js',26) then
                if GitDown('Render_Youtube_1080_30p.js',28) then
                if GitDown('Render_Youtube_1080_30p.js.png',30) then
                if GitDown('SetHD720pAndRender.js',32) then
                if GitDown('SetHD720pAndRender.js.png',34) then
                if GitDown('SetLowerFieldAndRender.js',36) then
                if GitDown('setlowerfieldandrender.js.png',38) then
                if GitDown('SetLowerFieldAndRender_360.js',40) then
                if GitDown('SetLowerFieldAndRender_360.js.png',42) then
                if GitDown('WindowsMediaVideo.js',46) then
                if GitDown('WindowsMediaVideo.js.png',48) then
                if GitDown('video_editor1_setup.reg',52) then
                if GitDown('wingeneric_ve1.reg',54) then
                if GitDown('tvlesnoy_moveleft.js',56) then
                if GitDown('tvlesnoy_moveright.js',58) then
                if GitDown('tvlesnoy_moveup.js',60) then
                if GitDown('tvlesnoy_movedown.js',62) then
                if GitDown('tvlesnoy_movenull.js',64) then
                if GitDown('tvlesnoy_scaleup.js',66) then
                if GitDown('tvlesnoy_scaledown.js',68) then
                if GitDown('tvlesnoy_scaleup_x.js',70) then
                if GitDown('tvlesnoy_scaledown_x.js',72) then
                if GitDown('tvlesnoy_scalexy.js',74) then
                if GitDown('tvlesnoy_rotate.js',76) then
                if GitDown('tvlesnoy_vegaspro_scripts_updater.iss',78) then begin
                end;
                if ResultCode <> 0 then begin
                    SuppressibleMsgBox('Cкрипты не загружены!', mbCriticalError, MB_OK, IDOK);
                end;

                GitDownPath:=ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0');
                if GitDown('playlist_settime.exe',80) then begin end else SuppressibleMsgBox('Диспетчер плейлиста не загружен!', mbCriticalError, MB_OK, IDOK);

                GitDownPath:=ExpandConstant('{commonappdata}\Vegas Pro\13.0');
                ForceDirectories(GitDownPath);
                if GitDown('keyboard.ini',82) then begin
                    GitDownPath:=ExpandConstant('{userappdata}\Vegas Pro\13.0');
                    ForceDirectories(GitDownPath);
                    if GitDown('keyboard.ini',84) then begin
                    end;
                end;
                if ResultCode <> 0 then begin
                    SuppressibleMsgBox('Быстрые команды клавиатуры не загружены!', mbCriticalError, MB_OK, IDOK);
                end;

                if (WizardIsComponentSelected('vouk')) then begin
                    GitDownPath:=ExpandConstant('{userappdata}\Sony\Render Templates\voukoder');
                    ForceDirectories(GitDownPath);
                    if GitDown('360_admin.sft2',86) then
                    if GitDown('CQP19.sft2',87) then
                    if GitDown('CQP30HEVC.sft2',88) then begin
                        GitDownPath:=ExpandConstant('{userappdata}\VEGAS\Render Templates\voukoder');
                        ForceDirectories(GitDownPath);
                        if GitDown('360_admin.sft2',89) then
                        if GitDown('CQP19.sft2',90) then
                        if GitDown('CQP30HEVC.sft2',91) then begin
                        end;
                    end;
                    if ResultCode <> 0 then begin
                        SuppressibleMsgBox('Профили Voukoder не загружены!', mbCriticalError, MB_OK, IDOK);
                    end;
                end;

                GitDownPath:=ExpandConstant('{autopf64}\VEGAS');
                if GitDown('tvlesnoy_banners.veg',92) then begin end else SuppressibleMsgBox('Титры не загружены!', mbCriticalError, MB_OK, IDOK);
                if Exec('reg.exe',ExpandConstant('IMPORT "{autopf64}\VEGAS\VEGAS Pro 13.0\Script Menu\wingeneric_ve1.reg"'), '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then begin
                end else begin
                end;
                if (WizardIsComponentSelected('vid_scripts1/reset')) then begin
                    if Exec('reg.exe',ExpandConstant('IMPORT "{autopf64}\VEGAS\VEGAS Pro 13.0\Script Menu\video_editor1_setup.reg"'), '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then begin
                    end else begin
                    end;
                end;
            end;
            //
        end;
        // sound edit section
        //if () then begin
        //end;

        // Double Commander TV goes here
        if (WizardIsComponentSelected('doublecmd_p')) then begin
            GitDownPath:=ExpandConstant('{tmp}');
            if GitDown('dc32.exe',50) then begin
                // success
                ResultCode:= -999;
                While ResultCode <> 0 do begin
                    if Exec(GitDownPath+'\dc32.exe', '/S', '', SW_SHOWMINNOACTIVE, ewWaitUntilTerminated, ResultCode) then begin
                    end else begin
                        Sleep(2000);
                    end;
                end;
            end;
            if GitRetreat('dc32.exe') then begin
            end;
            if ResultCode <> 0 then begin
                SuppressibleMsgBox('Double Commander не загружен!', mbCriticalError, MB_OK, IDOK);
            end;
        end;

        // FFMPEG goes here
        if (WizardIsComponentSelected('ffmpeg_p')) then begin
            GitDownPath:=ExpandConstant('{tmp}');
            if GitDown('https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl-shared.zip',50) then begin
                if GitDown('setup_ffmpeg_latest.cmd',75) then begin
                    if Exec('cmd.exe', ExpandConstant('/c "{tmp}\setup_ffmpeg_latest.cmd"'), '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                        While (FileExists(ExpandConstant('{tmp}\setup_ffmpeg_latest.cmd')) = True) do begin
                            Sleep(2000);
                        end;
                    end;
                end;
            end;
            if GitRetreat('ffmpeg-master-latest-win64-gpl-shared.zip') then
            if GitRetreat('setup_ffmpeg_latest.cmd') then begin
            end;
        end;
        // ffmpeg ends here

        // add network shortcuts
        if (WizardIsComponentSelected('networktv')) then begin
            GitDownPath:=ExpandConstant('{tmp}');
            GitDown('shortcuts_net_win.cab',33);
            GitDown('shortcuts_net_dc.cab',66);

            if FileExists(ExpandConstant('{tmp}\shortcuts_net_win.cab')) then begin
                ForceDirectories(ExpandConstant('{userdesktop}\Сеть TV'));
                if Exec('expand.exe',ExpandConstant('-F:* "{tmp}\shortcuts_net_win.cab" "{userdesktop}\Сеть TV"'), '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                end;
                SaveStringToFile(ExpandConstant('{userdesktop}\Сеть TV\desktop.ini'), '[.ShellClassInfo]' + #13#10 + ExpandConstant('IconResource={sys}\shell32.dll,18'), False);
                SaveStringToFile(ExpandConstant('{userdesktop}\Сеть TV\desktop.cmd'), 'attrib +h +s "%~dp0desktop.ini"' + #13#10 + 'del "%~f0"', False);
                if Exec('cmd.exe', ExpandConstant('/c "{userdesktop}\Сеть TV\desktop.cmd"'), '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                end;
            end;
            if FileExists(ExpandConstant('{tmp}\shortcuts_net_dc.cab')) then begin
                ForceDirectories(ExpandConstant('{autopf64}\Totalcmd_p\network'));
                if Exec('expand.exe',ExpandConstant('-F:* "{tmp}\shortcuts_net_dc.cab" "{autopf64}\Totalcmd_p\network"'), '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                end;
            end;
        end;


        ///////////////////////////////////////////

        ProgressPage.Hide;
    end;
end;