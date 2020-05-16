Import-Module -Name $PSScriptRoot\SitecoreSmartRemoting.psm1 -Force
function Remove-RemoteRenderingVariantCollections {
    param(
        $Path,
        $Session
    )

    $renderingVariantMetadataFiles = Get-ChildItem -Path $Path -Filter metadata.json -File -Recurse
    $renderingVariantMetadataFiles | ForEach-Object {
        $metadataFilePath = $_.FullName
        $metadata = Get-Content -Raw -Path $metadataFilePath | ConvertFrom-Json
        $renderingVariantsFolder = Split-Path -Path $metadataFilePath -Parent
        Push-Location -Path $renderingVariantsFolder
        $scribanItemPaths = @()
        get-Childitem -Path '.' -Filter *.scriban -Recurse -File | 
            ForEach-Object { Resolve-Path -Relative -Path $_.FullName } |
            Foreach-Object { $_.Replace('.\', '') } |           # item path starts with '.\'
            Foreach-Object { $_.Replace('.scriban', '') } |     # in Sitecore item path extension is not included
            Sort-Object -Descending { $_.FullName.Length } |    # longest item first, if child-item in source control remove it first
            ForEach-Object { $scribanItemPaths += $_ }
            
        Pop-Location

        $arguments = @{
            SiteId = $metadata.SiteId
            ScribanItemPaths = $scribanItemPaths
        }

        Invoke-RemoteScriptTestOutput -Session $session -Arguments $arguments -ScriptBlock {
            $siteItem = Get-Item -Path master: -ID $params.SiteId -ErrorAction Ignore
            if ($null -ne $siteItem) {
                $params.ScribanItemPaths | ForEach-Object {
                    $scribanItemPath = "master:" + (Join-Path -Path (Join-Path -Path $siteItem.FullPath -ChildPath 'Presentation\Rendering Variants') -ChildPath $_)
                    if (Test-Path -Path $scribanItemPath) {
                        if ((Get-ChildItem -Path $scribanItemPath).Length -gt 0) {
                            Reset-ItemField -Path $scribanItemPath -Name "Template"
                            Write-Output "Item '$scribanItemPath' has children - Template reset"
                        } else {
                            Remove-Item -Path "$scribanItemPath" -Force -ErrorAction Ignore
                            Write-Output "Removed: '$scribanItemPath'"
                        }
                    }
                }
            }
        }
    }
}

function Test-RemoteRenderingVariantCollections {
    param(
        $Path,
        $Session
    )

    $renderingVariantMetadataFiles = Get-ChildItem -Path $Path -Filter metadata.json -File -Recurse
    $renderingVariantMetadataFiles | ForEach-Object {
        $metadataFilePath = $_.FullName
        $metadata = Get-Content -Raw -Path $metadataFilePath | ConvertFrom-Json
        $renderingVariantsFolder = Split-Path -Path $metadataFilePath -Parent
        $siteName = Split-Path -Path (Split-Path -Path (Split-Path -Path $renderingVariantsFolder -Parent) -Parent) -Leaf
        Push-Location -Path $renderingVariantsFolder
        $scribanItems = @()
        get-Childitem -Path '.' -Filter *.scriban -Recurse -File | ForEach-Object {
            $scribanFilePath = $_.FullName
            $scribanItems += New-Object -TypeName PSObject -Property @{
                Template = Get-Content -Path $scribanFilePath -Raw
                ItemPath = (Resolve-Path -Relative -Path $scribanFilePath).Replace('.\', '').Replace('.scriban', '')
            }
        }
        Pop-Location

        $arguments = @{
            SiteId = $metadata.SiteId
            SiteName = $siteName
            ScribanItems = $scribanItems
        }

        Invoke-RemoteScriptTestOutput -Session $session -Arguments $arguments -ScriptBlock {
            $siteItem = Get-Item -Path master: -ID $params.SiteId -ErrorAction Ignore
            if ($null -eq $siteItem) {
                Write-Output "ERROR: Sitecore site with id='$($params.SiteId)' as specified in '$($params.SiteName)/-/scriban/metadata.json' not found"
            } else {
                $params.scribanItems | ForEach-Object {
                    $template = $_.Template
                    $itemPath = $_.ItemPath
                    $scribanItemPath = "master:" + (Join-Path -Path (Join-Path -Path $siteItem.FullPath -ChildPath 'Presentation\Rendering Variants') -ChildPath $itemPath)
                    if (-not (Test-Path -Path $scribanItemPath)) {
                        Write-Output "ERROR: Expected Scriban item not found, path: '$scribanItemPath'"
                    } else {
                        $scribanItemTemplateFieldContent = Get-Item -Path $scribanItemPath | Get-ItemField -ReturnType Field -Name "Template"
                        if ($scribanItemTemplateFieldContent.Value -ne $template) {
                            Write-Output "ERROR: Unexpected content of Scriban 'Template' field, path: '$scribanItemPath'`nEXPECTED:`n$template`nFOUND:`n$($scribanItemTemplateFieldContent.Value)"
                        }
                    }
                }
            }
        }
    }
}

Export-ModuleMember -Function Remove-RemoteRenderingVariantCollections
Export-ModuleMember -Function Test-RemoteRenderingVariantCollections