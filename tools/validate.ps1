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

Import-Module -Name SPE 
Import-Module -Name $PSScriptRoot\modules\TestRenderingVariants.psm1 -Force

# All validation relative from the root of the frnt-end folder (e.g. ..)
Set-Location -Path $PSScriptRoot\..

$config = Get-Content -Raw -Path config/config.json | ConvertFrom-Json
Write-Verbose "Username: $($config.user.login)"
Write-Verbose "Password: $($config.user.password)"
Write-verbose "Server  : $($config.server)"
$session = New-ScriptSession -Username $config.user.login -Password $config.user.password -ConnectionUri $config.server

Write-Output "Validating against Sitecore server $($config.server)"

Test-RenderingVariantCollectionsForUnexpectedFiles -Path 'Rendering Variants'
$renderingVariantCollections = Get-LocalRenderingVariantCollectionsStructure -Path 'Rendering Variants'
Test-RemoteExistRenderingVariantCollections -Session $session -RenderingVariantCollections $renderingVariantCollections
Write-Output 'Validation completed.'

Stop-ScriptSession -Session $session


