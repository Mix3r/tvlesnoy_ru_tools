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
Source: "{tmp}\desktop.ini"; DestDir: "{userdesktop}\Сеть TV"; Components: networktv; Attribs: hidden; Flags: external
Source: "curl.exe"; DestDir: "{tmp}"

[Code]
var GitDownPath:string; ProgressPage: TOutputProgressWizardPage;

function GitRetreat(whattowipe:string):boolean;
begin
    DelayDeleteFile(GitDownPath+'\'+whattowipe,12);
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
        if (whattoget[nPbar] = ' ') then begin
            gittmp:=gittmp+'%20';
        end else begin
            gittmp:=gittmp+whattoget[nPbar];
        end;
    end;

    if Exec(ExpandConstant('{tmp}\curl.exe'), ExpandConstant('-L -o "'+GitDownPath+'\'+whattoget+'" "https://github.com/Mix3r/tvlesnoy_ru_tools/raw/refs/heads/main/vegas_pro/'+gittmp+'"'), '', SW_SHOWMINNOACTIVE, ewWaitUntilTerminated, ResultCode) then begin
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
                        if Exec('expand.exe','-F:* "'+GitDownPath+'\voukoderplug13.cab" "'+ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0\FileIO Plug-Ins\voukoderplug')+'"', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                            if ResultCode = 0 then begin
                                SaveStringToFile(ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0\Voukoder-x64.fio2007-config'), '[FileIO Plug-Ins]' + #13#10 + 'voukoderplug=FileIO Plug-Ins\voukoderplug\voukoderplug13.dll', False);
                            end;
                        end;
                    end;
                end;
                if FileExists(ExpandConstant('{autopf64}\VEGAS\Vegas Pro 20\vegas200.exe')) then begin
                    if GitDown('voukoderplug.cab',15) then begin
                        ForceDirectories(ExpandConstant('{autopf64}\VEGAS\Vegas Pro 20\FileIO Plug-Ins\voukoderplug'));
                        if Exec('expand.exe','-F:* "'+GitDownPath+'\voukoderplug.cab" "'+ExpandConstant('{autopf64}\VEGAS\Vegas Pro 20\FileIO Plug-Ins\voukoderplug')+'"', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin
                            if ResultCode = 0 then begin
                                SaveStringToFile(ExpandConstant('{autopf64}\VEGAS\Vegas Pro 20\Voukoder-x64.fio2007-config'), '[FileIO Plug-Ins]' + #13#10 + 'voukoderplug=FileIO Plug-Ins\voukoderplug\voukoderplug.dll', False);
                            end;
                        end;
                    end;
                end;
                GitRetreat('voukoderplug13.cab');
                GitRetreat('voukoderplug.cab');
            end;
            GitRetreat('voukdr.exe');
        end;

        // scripts section
        if (WizardIsComponentSelected('vid_scripts1')) then begin
            //
            if FileExists(ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0\vegas130.exe')) then begin
                GitDownPath:=ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0\Script Menu');
                ForceDirectories(GitDownPath);
                GitDown('ConvertAllMpegHD_AVI-DV.js',2);
                GitDown('ConvertAllMpegHD_AVI-DV.js.png',4);
                GitDown('CTC Titles.js',6);
                GitDown('CTC Titles.js.png',8);
                GitDown('D_Blender_Ticker.js',10);
                GitDown('D_Blender_Ticker.js.png',12);
                GitDown('FdOnAir_Export.js',14);
                GitDown('FdOnAir_Export.js.png',16);
                GitDown('Fish_Accomplish.js',18);
                GitDown('Fish_Accomplish.js.png',20);
                GitDown('Norm_Arbitrary.js',22);
                GitDown('Norm_Arbitrary.js.png',24);
                GitDown('Remove_Doubles.js',26);
                GitDown('Render_Youtube_1080_30p.js',28);
                GitDown('Render_Youtube_1080_30p.js.png',30);
                GitDown('SetHD720pAndRender.js',32);
                GitDown('SetHD720pAndRender.js.png',34);
                GitDown('SetLowerFieldAndRender.js',36);
                GitDown('setlowerfieldandrender.js.png',38);
                GitDown('SetLowerFieldAndRender_360.js',40);
                GitDown('SetLowerFieldAndRender_360.js.png',42);
                GitDown('WindowsMediaVideo.js',46);
                GitDown('WindowsMediaVideo.js.png',48); 
                GitDown('video_editor1_setup.reg',52);
                GitDown('wingeneric_ve1.reg',54);
                GitDown('tvlesnoy_moveleft.js',56);
                GitDown('tvlesnoy_moveright.js',58);
                GitDown('tvlesnoy_moveup.js',60);
                GitDown('tvlesnoy_movedown.js',62);
                GitDown('tvlesnoy_movenull.js',64);
                GitDown('tvlesnoy_scaleup.js',66);
                GitDown('tvlesnoy_scaledown.js',68);
                GitDown('tvlesnoy_scaleup_x.js',70);
                GitDown('tvlesnoy_scaledown_x.js',72);
                GitDown('tvlesnoy_scalexy.js',74);
                GitDown('tvlesnoy_rotate.js',76);
                GitDown('tvlesnoy_vegaspro_scripts_updater.iss',78);
                GitDownPath:=ExpandConstant('{autopf64}\VEGAS\VEGAS Pro 13.0');
                GitDown('playlist_settime.exe',80);
                GitDownPath:=ExpandConstant('{commonappdata}\Vegas Pro\13.0');
                ForceDirectories(GitDownPath);
                GitDown('keyboard.ini',82);
                GitDownPath:=ExpandConstant('{userappdata}\Vegas Pro\13.0');
                ForceDirectories(GitDownPath);
                GitDown('keyboard.ini',84);
                GitDownPath:=ExpandConstant('{userappdata}\Sony\Render Templates\voukoder');
                ForceDirectories(GitDownPath);
                GitDown('360_admin.sft2',86);
                GitDown('CQP19.sft2',87);
                GitDown('CQP30HEVC.sft2',88);
                GitDownPath:=ExpandConstant('{userappdata}\VEGAS\Render Templates\voukoder');
                ForceDirectories(GitDownPath);
                GitDown('360_admin.sft2',89);
                GitDown('CQP19.sft2',90);
                GitDown('CQP30HEVC.sft2',91);
                GitDownPath:=ExpandConstant('{autopf64}\VEGAS');
                GitDown('tvlesnoy_banners.veg',92);
                if Exec('reg.exe',ExpandConstant('IMPORT "{autopf64}\VEGAS\VEGAS Pro 13.0\Script Menu\wingeneric_ve1.reg"'), '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then begin
                end else begin
                end;
                if (WizardIsComponentSelected('vid_scripts1/reset')) then begin
                    if Exec('reg.exe',ExpandConstant('IMPORT "{autopf64}\VEGAS\VEGAS Pro 13.0\Script Menu\video_editor1_setup.reg"'), '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then begin
                    end else begin
                    end;
                end;
                ////////////////
            end;
            //
        end;
        ///////////////////////////////////////////

        ProgressPage.Hide;
    end;
end;

