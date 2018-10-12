FROM ""

[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]'Ssl3,Tls,Tls11,Tls12'
(Invoke-WebRequest -Uri "https://win.rustup.rs/x86_64" -UseBasicParsing -OutFile "C:\rustup-init.exe")
$env:Path = "C:\Users\ContainerAdministrator\.cargo\bin"
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
$env:Path = "C:\ProgramData\chocolatey\bin"
