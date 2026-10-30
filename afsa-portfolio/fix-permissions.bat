@echo off
echo Disabling Controlled Folder Access for development...
powershell -Command "Set-MpPreference -EnableControlledFolderAccess Disabled"
echo Done! Controlled Folder Access is now disabled.
pause
