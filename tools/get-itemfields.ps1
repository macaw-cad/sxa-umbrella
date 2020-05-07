# Display fields of Sitecore item
# https://www.sergevandenoever.nl
param(
    [string]$itemPath = "/sitecore/content/Home"
)

Set-Location -Path $PSScriptRoot

$config = Get-Content -Raw -Path ../config/config.json | ConvertFrom-Json
Write-Output "Username: $($config.user.login)"
Write-Output "Password: $($config.user.password)"
Write-Output "Server  : $($config.server)"

Write-Output "Get item fields of '$itemPath'..."
Import-Module -Name SPE 
$session = New-ScriptSession -Username $config.user.login -Password $config.user.password -ConnectionUri $config.server
Invoke-RemoteScript -Session $session -ScriptBlock {
    Get-Item $Using:itemPath | Get-ItemField -IncludeStandardFields -ReturnType Field -Name "*" | Format-Table Name, DisplayName, SectionDisplayName, Description -auto
}
Stop-ScriptSession -Session $session


