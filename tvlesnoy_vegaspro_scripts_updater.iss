; Inno Setup Script Wizard to update Vegas Pro Scripts with our own tools.

[Setup]
AppName=Vegas Pro Scripts TVLesnoy
AppPublisher=Mix3r_Durachok
AppVersion=1.0
Compression=lzma
DefaultDirName={autopf64}\VEGAS\VEGAS Pro 13.0
DefaultGroupName=My Program
DisableProgramGroupPage=yes
OutputDir=.
OutputBaseFilename=tvlesnoy_vegaspro_scripts_updater
SolidCompression=yes
Uninstallable=no
WizardStyle=modern

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

procedure GitDown(whattoget)
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
    GitDown('CTC Titles.js.png');
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
