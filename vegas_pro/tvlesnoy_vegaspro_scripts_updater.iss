; Inno Setup Script Wizard to update Vegas Pro Scripts with our own tools.

[Setup]
AppName=Vegas Pro Scripts TVLesnoy
AppPublisher=Mix3r_Durachok
AppVersion=1.0
Compression=lzma
DefaultDirName={autopf64}\VEGAS\VEGAS Pro 13.0
DefaultGroupName=My Program
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
Name: "vid_scripts1"; Description: "Scripts"; Types: full compact custom;
Name: "videoeditor1"; Description: "Видеоредактор 13"; Types: custom;
Name: "videoeditor1/en"; Description: "EN"; Types: custom; Flags: exclusive
Name: "videoeditor1/ru"; Description: "RU"; Types: custom; Flags: exclusive
Name: "networktv"; Description: "Сеть TV"; Types: custom;

[Files]
; Place any regular files here
; These files will be downloaded
Source: "{tmp}\git\*"; DestDir: "{app}\Script Menu"; Flags: external recursesubdirs

[Dirs]
Name: "{commonappdata}\Vegas Pro\13.0"
Name: "{userappdata}\Vegas Pro\13.0"
Name: "{userappdata}\Sony\Render Templates\wmv11"
Name: "{userappdata}\Sony\Render Templates\mpeg2-mc"
Name: "{autopf64}\Sony\Vegas 7.0\Script Menu"
Name: "{commonpf32}\VEGAS\Shared Plug-Ins\Audio_x64"
Name: "{userdesktop}\Сеть TV"; Components: networktv

[Icons]
Name: "{userdesktop}\Сеть TV\_CEPBEP"; Filename: "\\Server\Захват (e)"; WorkingDir: ""; Components: networktv
Name: "{userdesktop}\Сеть TV\_МОДЕРАТОР"; Filename: "\\METELKINA\Share"; WorkingDir: ""; Components: networktv
Name: "{userdesktop}\Сеть TV\_ГЛАВРЕД"; Filename: "\\Glavred\Общее"; WorkingDir: ""; Components: networktv
Name: "{userdesktop}\Сеть TV\_ЗВУКОРЕЖИССЕР"; Filename: "\\xrebtova\Монтаж звука"; WorkingDir: ""; Components: networktv
Name: "{userdesktop}\Сеть TV\_МЕХАНИК"; Filename: "\\Mikheev\захват"; WorkingDir: ""; Components: networktv
Name: "{userdesktop}\Сеть TV\_КОРРЕСПОНДЕНТ_КУР"; Filename: "\\Ostanina\Общее"; WorkingDir: ""; Components: networktv
Name: "{userdesktop}\Сеть TV\_КОРРЕСПОНДЕНТ_НОВ"; Filename: "\\Reporter1\RepShared"; WorkingDir: ""; Components: networktv
Name: "{userdesktop}\Сеть TV\_НОВОСТИ"; Filename: "\\smolkina\ВСЕ!!!!"; WorkingDir: ""; Components: networktv
Name: "{userdesktop}\Сеть TV\_РЕКЛАМА"; Filename: "\\Korepina\Общее"; WorkingDir: ""; Components: networktv
Name: "{userdesktop}\Сеть TV\_РЕДАКТОР"; Filename: "\\aza\D"; WorkingDir: ""; Components: networktv
Name: "{userdesktop}\Сеть TV\_РЕЖИССЕР"; Filename: "\\Regisser\захват"; WorkingDir: ""; Components: networktv
Name: "{userdesktop}\Сеть TV\_СУФЛЕР"; Filename: "\\studio\Share"; WorkingDir: ""; Components: networktv
Name: "{userdesktop}\Сеть TV\_РЕЖИССЕР2ЭТАЖ"; Filename: "\\Ivanova\общее"; WorkingDir: ""; Components: networktv
Name: "{userdesktop}\Сеть TV\_МЕХАНИК2ЭТАЖ"; Filename: "\\anton\Disc_E"; WorkingDir: ""; Components: networktv

[Run]
Filename: reg.exe; Parameters: "ADD HKCU\Software\DXTransform\Presets\{{A09106D0-5344-11D2-95CC-00C04F8EDC2D} /v rlse /t REG_BINARY /d 0000344300000000000000000000e03f /f"; Flags: runhidden runascurrentuser;
Filename: reg.exe; Parameters: "ADD HKCU\Software\DXTransform\Presets\{{0FE8789D-0C47-442A-AFB0-0DAF97669317} /v GG /t REG_BINARY /d 000000000b000000c8010000010000000000000001000000000000000000f03f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e03f020000000200000000000000000000000000000000000000000000000000f03f736891ed7c3ff33f000000000000f03f000000000000f03f000000000c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008fc2f53c8fc2f53c0000000000000000000000000000803fcdcc4c3e0000803f0000000004000000010000000000000000000000f1f0703ff1f0703ff1f0703f8180003fcdcc4c3d0000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000803f0200000001000000175d74d14517ed3f01000000000000000000000000000000db43d5c23f9fecbf900100007b5c727466315c616e73695c616e7369637067313235325c64656666305c6465666c616e67313033337b5c666f6e7474626c7b5c66305c666e696c5c66636861727365743230347b5c2a5c666e616d6520417269616c3b7d417269616c204359523b7d7b5c66315c666e696c5c66636861727365743020417269616c3b7d7d0d0a7b5c636f6c6f7274626c203b5c726564305c677265656e305c626c7565303b7d0d0a5c766965776b696e64345c7563315c706172645c71635c6366315c6c616e67313034395c625c66305c667333325c2764315c2765355c2766305c2765335c2765355c276539205c2764375c2763355c2764305c2763355c2763665c2763305c2763645c2763655c2763325c667333365c7061720d0a5c62305c667332385c2765335c2765625c2765305c2765325c276530205c2763335c276365205c2761625c2763335c2765655c2766305c2765655c276534205c2763625c2765355c2766315c2765645c2765655c2765395c2762625c6c616e67313033335c625c66315c667333365c7061720d0a7d0d0a00 /f"; Flags: runhidden runascurrentuser;
Filename: reg.exe; Parameters: "ADD HKCU\Software\DXTransform\Presets\{{0FE8789D-0C47-442A-AFB0-0DAF97669317} /v GG_END /t REG_BINARY /d 000000000b000000c8010000020000000000000001000000000000000000f03f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e03f020000000200000000000000000000000000000000000000000000000000f03f736891ed7c3ff33f000000000000f03f000000000000f03f000000000c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008fc2f53c8fc2f53c0000000000000000000000000000803fcdcc4c3e0000803f0000000004000000000000000000000000000000000000000000803f0000803f0000803fcdcc4c3dcdcccc3d00000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000803f0300000001000000175d74d14517ed3f0100000000000000000000000010ec3faa16fef9a335edbf3b0100007b5c727466315c616e73695c616e7369637067313235325c64656666305c6465666c616e67313033337b5c666f6e7474626c7b5c66305c666e696c5c66636861727365743230347b5c2a5c666e616d6520417269616c3b7d417269616c204359523b7d7b5c66315c666e696c5c66636861727365743020417269616c3b7d7d0d0a7b5c636f6c6f7274626c203b5c726564305c677265656e305c626c7565303b7d0d0a5c766965776b696e64345c7563315c706172645c71725c6366315c6c616e67313034395c66305c667332365c2764302e5c2764305c2763355c2763345c2763305c2763615c2764325c2763655c2764305c7061720d0a5c2763652e5c2763655c2763665c2763355c2764305c2763305c2764325c2763655c2764305c6c616e67313033335c625c66315c667333365c7061720d0a7d0d0a00 /f"; Flags: runhidden runascurrentuser;
Filename: reg.exe; Parameters: "ADD HKCU\Software\DXTransform\Presets\{{0FE8789D-0C47-442A-AFB0-0DAF97669317} /v GG_OPERA /t REG_BINARY /d 000000000b000000c8010000000000000000000001000000000000000000f03f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e03f020000000200000000000000000000000000000000000000000000000000f03f736891ed7c3ff33f000000000000f03f000000000000f03f000000000c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008fc2f53c8fc2f53c0000000000000000000000000000803fcdcc4c3e0000803f0000000004000000000000000000000000000000000000000000803f0000803f0000803fcdcc4c3dcdcccc3d00000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000803f0000803f0000803f0000803f0100000001000000175d74d14517ed3f0100000000000000333333333323e9bf898888888888eebfff0000007b5c727466315c616e73695c616e7369637067313235325c64656666305c6465666c616e67313033337b5c666f6e7474626c7b5c66305c666e696c5c66636861727365743230347b5c2a5c666e616d6520417269616c3b7d417269616c204359523b7d7d0d0a7b5c636f6c6f7274626c203b5c726564305c677265656e305c626c7565303b7d0d0a5c766965776b696e64345c7563315c706172645c6366315c6c616e67313034395c66305c667332385c2763655c2765665c2765355c2766305c2765305c2766325c2765385c2765325c2765645c2765305c276666205c2766315c2766615c2762385c2765635c2765615c2765305c7061720d0a7d0d0a00 /f"; Flags: runhidden runascurrentuser;
Filename: reg.exe; Parameters: "ADD HKCU\Software\DXTransform\Presets\{{0FE8789D-0C47-442A-AFB0-0DAF97669317} /v GG_APXuB /t REG_BINARY /d 000000000b000000c8010000000000000000000001000000000000000000f03f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e03f020000000200000000000000000000000000000000000000000000000000f03f736891ed7c3ff33f000000000000f03f000000000000f03f000000000c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008fc2f53c8fc2f53c0000000000000000000000000000803fcdcc4c3e0000803f0000000004000000000000000000000000000000000000000000803f0000803f0000803fcdcc4c3dcdcccc3d00000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000803f0000803f0000803f0000803f0100000001000000175d74d14517ed3f0100000000000000abaaaaaaaafaedbf898888888888eebfce0000007b5c727466315c616e73695c616e7369637067313235325c64656666305c6465666c616e67313033337b5c666f6e7474626c7b5c66305c666e696c5c66636861727365743230347b5c2a5c666e616d6520417269616c3b7d417269616c204359523b7d7d0d0a7b5c636f6c6f7274626c203b5c726564305c677265656e305c626c7565303b7d0d0a5c766965776b696e64345c7563315c706172645c6366315c6c616e67313034395c66305c667332385c2763305c2766305c2766355c2765385c2765325c7061720d0a7d0d0a00 /f"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{app}"" ""playlist_settime.exe"" /MOV"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{commonappdata}\Vegas Pro\13.0"" ""keyboard.ini"""; Flags: runhidden runascurrentuser; 
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{userappdata}\Vegas Pro\13.0"" ""keyboard.ini"" /MOV"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{userappdata}\Sony\Render Templates\wmv11"" ""360_admin.*"" /MOV"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{userappdata}\Sony\Render Templates\mpeg2-mc"" ""*PAL Widescreen.sft2"" /MOV"; Flags: runhidden runascurrentuser; 
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{autopf64}\Sony\Vegas 7.0\Script Menu"" ""ctc-sample.png"" /MOV"; Flags: runhidden runascurrentuser;
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{autopf64}\Sony\Vegas 7.0\Script Menu"" ""smai75x75_alpha75_hd.png"" /MOV"; Flags: runhidden runascurrentuser; 
Filename: robocopy.exe; Parameters: """{app}\Script Menu"" ""{commonpf32}\VEGAS\Shared Plug-Ins\Audio_x64"" ""audio_plugin_update.exe"" /MOV"; Flags: runhidden runascurrentuser; 
Filename: "{commonpf32}\VEGAS\Shared Plug-Ins\Audio_x64\audio_plugin_update.exe"; Parameters: "-y /q"; Flags: runhidden runascurrentuser; 
Filename: reg.exe; Parameters: "IMPORT ""{tmp}\git\video_editor1_setup.reg"""; Flags: runhidden runascurrentuser;

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
    DownloadPage.Add('https://github.com/Mix3r/tvlesnoy_ru_tools/raw/main/vegas_pro/'+gittmp, 'tmp/'+whattoget, '');
end;

function NextButtonClick(CurPageID: Integer): Boolean;
var ResultCode: integer; wr_str:string; 
begin
  if (CurPageID = wpFinished) and (WizardIsComponentSelected('networktv')) then begin
      wr_str:='[.ShellClassInfo]' + #13#10 + ExpandConstant('IconResource={sys}\shell32.dll,18');
      SaveStringToFile(ExpandConstant('{userdesktop}\Сеть TV\desktop.ini'), wr_str, False);
  end else if CurPageID = wpReady then begin
    DownloadPage.Clear;
    if (WizardIsComponentSelected('vid_scripts1')) then begin
    GitDown('ConvertAllMpegHD_AVI-DV.js');
    GitDown('ConvertAllMpegHD_AVI-DV.js.png');
    GitDown('CTC Titles.js');
    GitDown('CTC Titles.js.png');
    GitDown('ctc-sample.png');
    GitDown('ctc-sample.psd');
    GitDown('D_Blender_Ticker.jBACKUPOLD');
    GitDown('D_Blender_Ticker.js');
    GitDown('D_Blender_Ticker.js.png');
    GitDown('FdOnAir_Export.js');
    GitDown('FdOnAir_Export.js.png');
    GitDown('Fish_Accomplish.js');
    GitDown('Fish_Accomplish.js.png');
    GitDown('GG.dxp');
    GitDown('Norm_Arbitrary.js');
    GitDown('Norm_Arbitrary.js.png');
    GitDown('playlist_settime.exe');
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
    GitDown('audio_plugin_update.exe');
    GitDown('360_admin.sft2');    
    GitDown('ОТЧЁТ_DVD Architect PAL Widescreen.sft2');
    end;
    GitDown('video_editor1_setup.reg');
    DownloadPage.Show;
    try
      try
        DownloadPage.Download; // This downloads the files to {tmp}
        Result := True;
      except
        if DownloadPage.AbortedByUser then
          Log('Aborted by user.')
        else
          SuppressibleMsgBox(AddPeriod(GetExceptionMessage), mbCriticalError, MB_OK, IDOK);
        Result := False;
      end;
    finally
      DownloadPage.Hide;
    end;
    //////////////////////////////////
                if (WizardIsComponentSelected('videoeditor1')) then begin
                DownloadPage.Clear;
                GitDownTmp('video_editor1.7z.001'); 
                GitDownTmp('video_editor1.7z.002'); 
                GitDownTmp('video_editor1.7z.003'); 
                GitDownTmp('video_editor1.7z.004'); 
                GitDownTmp('video_editor1.7z.005'); 
                GitDownTmp('video_editor1.7z.006'); 
                GitDownTmp('video_editor1.7z.007'); 
                GitDownTmp('video_editor1.exe'); 
                DownloadPage.Show;
                try
                        try
                                DownloadPage.Download; // This downloads the files to {tmp}
                                {Result := True;}
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
                    if Exec(ExpandConstant('{tmp}\tmp\VegasPro-13.0.545.exe'), '/S /E', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin

                    end else begin

                    end;
                end;
                if (WizardIsComponentSelected('videoeditor1/ru')) then begin
                    if Exec(ExpandConstant('{tmp}\tmp\VegasPro-13.0.545.exe'), '/S /R', '', SW_SHOW, ewWaitUntilTerminated, ResultCode) then begin

                    end else begin

                    end;
                end;
                        DownloadPage.Hide;
                end;
                end;
  ////////////////////////////////////////////////////////
  end else
    Result := True;
end;
