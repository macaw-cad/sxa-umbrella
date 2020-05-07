Import-Module -Name SPE

function Invoke-RemoteScriptTestOutput {
    param(
        $Session,
        $ScriptBlock,
        $Arguments
    )

    $output = Invoke-RemoteScript -Session $session -ScriptBlock $ScriptBlock -Arguments $Arguments

    $output | ForEach-Object {
        if ($_ -is [String]) {
            if ($_.StartsWith('WARNING: ')) {
                Write-Warning $_.SubString('WARNING: '.Length)
            } elseIf ($_.StartsWith('ERROR: ')) {
                Write-Host $_ -ForegroundColor Red # does not make sense to use Write-Error because location is incorrect
            } elseIf ($_.StartsWith('VERBOSE: ')) {
                Write-Verbose $_.SubString('VERBOSE: '.Length)
            } elseIf ($_.StartsWith('INFORMATION: ')) {
                Write-Information $_.SubString('INFORMATION: '.Length)
            } else {
                Write-Host $_
            }
        } else {
            $_
        }
    }
}

Export-ModuleMember -Function Invoke-RemoteScriptTestOutput