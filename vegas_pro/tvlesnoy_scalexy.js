
import System;
import System.IO;
import System.Object;
import Sony.Vegas;
import ScriptPortal.Vegas;
var fac1 = 0.333;

try
{
        if (Vegas.Project.AudioCD.UPC == "0-0-0000-00000-0-1") {
                Vegas.Project.AudioCD.UPC = "0-0-0000-00000-0-2"
        } else {
                Vegas.Project.AudioCD.UPC = "0-0-0000-00000-0-1"
        }
}
catch (errorMsg)
{
}