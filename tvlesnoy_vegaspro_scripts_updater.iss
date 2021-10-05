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

[Files]
; Place any regular files here
; These files will be downloaded
Source: "{tmp}\git\*"; DestDir: "{app}\Script Menu"; Flags: external recursesubdirs

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

function NextButtonClick(CurPageID: Integer): Boolean;
begin
  if CurPageID = wpReady then begin
    DownloadPage.Clear;
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
  end else
    Result := True;
end;                                                                                             
