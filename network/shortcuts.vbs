' ������� ������� ������  (� ������� ����)
Dim FileName, scriptdir
    scriptdir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

    FileName = "_���_�������������"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\xrebtova\������ �����"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_���_�������"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\MIKHEEV\������"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_���_�������������"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Ostanina\�����"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_���_�������������"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Reporter1\RepShared"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_���_��������"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\aza\D"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_���_�������"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\smolkina\���!!!!"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_�������"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Glavred\�����"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_���_�������"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Korepina\�����"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_���_��������"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Regisser\�����"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_���_������"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\studio\Share"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_��2_��������"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\IVANOVA\�����"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_��2_�������"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\anton\Disc_E"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_CEPBEP"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\Server\������ (e)"
    shortcut.Arguments = ""
    shortcut.Save

    FileName = "_����_�����"
    Set shortcut = CreateObject("WScript.Shell").CreateShortcut(scriptdir + "\" + FileName + ".lnk")
    shortcut.TargetPath = "\\METELKINA\Share"
    shortcut.Arguments = ""
    shortcut.Save

    Set objFSO = CreateObject( "Scripting.FileSystemObject" )
    objFSO.DeleteFile WScript.ScriptFullName
    WScript.Quit
