# Validate the Sitecore environment for the current project
# https://www.sergevandenoever.nl
param(
    [switch]$Verbose = $false
)
if($Verbose) { 
    $global:VerbosePreference = "Continue" 
} else {
    $global:VerbosePreference = "SilentlyContinue" 
}

Import-Module -Name $PSScriptRoot\modules\TestRenderingVariants.psm1 -Force
Import-Module -Name $PSScriptRoot\modules\ModuleManagement.psm1 -Force
Install-ModuleIfNotInstalled -moduleName SPE -minimalVersion 6.1.0 
Import-Module -Name $PSScriptRoot\modules\ModuleManagement.psm1 -Force
Install-ModuleIfNotInstalled -moduleName Pester -allowPrerelease

# All validation relative from the root of the frnt-end folder (e.g. ..)
Set-Location -Path $PSScriptRoot\..

$config = Get-Content -Raw -Path config/config.json | ConvertFrom-Json
Write-Verbose "Username: $($config.user.login)"
Write-Verbose "Password: $($config.user.password)"
Write-verbose "Server  : $($config.server)"
$session = New-ScriptSession -Username $config.user.login -Password $config.user.password -ConnectionUri $config.server

Write-Output "Integration tests against Sitecore server $($config.server)"
Write-Output ''
Write-Output 'Clean Sitecore, Build & Deploy'
Remove-RemoteRenderingVariantCollections -Path 'Rendering Variants' -Session $session
npm run build-deploy

Write-Output 'Execution of integration tests...'
Test-RemoteRenderingVariantCollections -Path 'Rendering Variants' -Session $session

Write-Output 'Integration tests completed.'

Stop-ScriptSession -Session $session


