Import-Module -Name $PSScriptRoot\SitecoreSmartRemoting.psm1 -Force

function Get-LocalRenderingVariantCollectionsStructure {
    param(
        [string]$Path
    )

    $renderingVariantCollections = @()

    $renderingVariantMetadataFiles = Get-ChildItem -Path $Path -Filter metadata.json -File -Recurse
    $renderingVariantMetadataFiles | ForEach-Object {
        $metadataFilePath = $_.FullName
        $scribanFolderPath = Split-Path -Path $metadataFilePath -Parent
        $minusFolderPath = Split-Path -Path $scribanFolderPath -Parent
        $siteItemFolderPath = Split-Path -Path $minusFolderPath -Parent
        if (((Split-Path -Path $scribanFolderPath -Leaf) -ne 'scriban') -or
            ((Split-Path -Path $minusFolderPath -Leaf) -ne '-')) {
            Write-Warning "Rendering Variant 'metadata.json' file '$(Resolve-Path -Relative -Path $_)' expected to be in folder '<siteName>/-/scriban'"
        }

        $siteItemName = Split-Path -Path $siteItemFolderPath -Leaf
        $metadata = Get-Content -Raw -Path $metadataFilePath | ConvertFrom-Json

        # Every top-level folder in the $siteItemFolderPath is a rendering
        $renderings = @()
        Get-ChildItem -Path $scribanFolderPath -Directory | ForEach-Object {
            $renderingFolderPath = $_.FullName
            $renderingName = Split-Path -Path $renderingFolderPath -Leaf

            # Every rendering folder contains sub-folders with rendering variants
            $renderingVariants = @()
            Get-ChildItem -Path $renderingFolderPath -Directory | Foreach-Object {
                $renderingVariantFolderPath = $_.FullName
                $renderingVariantName = Split-Path -Path $renderingVariantFolderPath -Leaf
                $renderingVariants += $renderingVariantName
            }
            $rendering = New-Object -TypeName PSObject -Property @{
                Name     = $renderingName
                Variants = $renderingVariants
            }

            $renderings += $rendering
        }

        $renderingVariantCollection = New-Object -TypeName PSObject -Property @{
            SiteName   = $siteItemName
            SiteId     = $metaData.SiteId
            Renderings = $renderings
        }

        $renderingVariantCollections += $renderingVariantCollection
    }

    $renderingVariantCollections
}
function Test-RenderingVariantCollectionsForUnexpectedFiles {
    param(
        [string]$Path
    )
    # Validate rendering variant collections for unexpected files
    Get-ChildItem $Path -File -Recurse -Exclude metadata.json,*.scriban | ForEach-Object {
        Write-Warning "Unexpected file in 'Rendering Variants': $(Resolve-Path -Relative -Path $_) - expected: metadata.json and *.scriban"
    }
}

function Test-RemoteExistRenderingVariantCollections {
    param(
        $Session,
        $RenderingVariantCollections
    )

    $arguments = @{
        renderingVariantCollections = $RenderingVariantCollections
    }

    Invoke-RemoteScriptTestOutput -Session $session -Arguments $arguments -ScriptBlock {
        $params.renderingVariantCollections | ForEach-Object {
            $siteItem = Get-Item -Path master: -ID $_.SiteId -ErrorAction Ignore
            if ($null -eq $siteItem) {
                Write-Output "WARNING: Sitecore site with id='$($_.SiteId)' as specified in '$($_.SiteName)/-/scriban/metadata.json' not found"
            } else {
                if ($siteItem.Name -ne $_.SiteName) {
                    Write-Output "WARNING: Sitecore site with id='$($_.SiteId)' as specified in '$($_.SiteName)/-/scriban/metadata.json' has name='$($siteItem.Name)', but local name='$($_.SiteName)'"
                }
                if ($siteItem.TemplateName -ne 'Site') {
                    Write-Output "WARNING: Sitecore site with id='$($_.SiteId)' as specified in '$($_.SiteName)/-/scriban/metadata.json' and name='$($siteItem.Name)' is not based on template 'Site'"
                }
            }

            $_.Renderings | ForEach-Object {
                $renderingItemPath = "$($siteItem.PSPath)\Presentation\Rendering Variants\$($_.Name)"
                Write-Output "VERBOSE: Validating rendering '$renderingItemPath'"
                $renderingItem = Get-Item -Path $renderingItemPath -ErrorAction Ignore
                # $renderingItem
                if ($null -eq $renderingItem) {
                    Write-Output "WARNING: Missing expected Sitecore item '$renderingItemPath' based on template 'Variants'"
                } else {
                    if ($renderingItem.TemplateName -ne 'Variants') {
                        Write-Output "WARNING: Sitecore item '$renderingItemPath' is not based based on template 'Variants'"
                    }
                    $_.Variants | ForEach-Object {
                        $renderingVariantItemPath = "$renderingItemPath\$_"
                        Write-Output "VERBOSE: Validating rendering variant '$renderingVariantItemPath'"
                        $renderingVariantItem = Get-Item -Path $renderingVariantItemPath -ErrorAction Ignore
                        # $renderingVariantItem
                        if ($null -eq $renderingVariantItem) {
                            Write-Output "WARNING: Missing expected Sitecore item '$renderingVariantItemPath' based on template 'Variant Definition'"
                        } else {
                            if ($renderingVariantItem.TemplateName -ne 'Variant Definition') {
                                Write-Output "WARNING: Sitecore item '$renderingVariantItemPath' is not based based on template 'Variant Definition'"
                            }
                        }
                    }
                }
            }
        }
    }
}

Export-ModuleMember -Function Get-LocalRenderingVariantCollectionsStructure
Export-ModuleMember -Function Test-RenderingVariantCollectionsForUnexpectedFiles
Export-ModuleMember -Function Test-RemoteExistRenderingVariantCollections