# Script para copiar SSH key al VPS y ejecutar comandos
# Usa el módulo ssh nativo de Windows

$pubKey = Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub"
$commands = @"
mkdir -p ~/.ssh && echo '$pubKey' >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys && echo 'KEY_ADDED_OK'
"@

Write-Host "=== IMPORTANTE ==="
Write-Host "Ejecuta este comando manualmente en la terminal:"
Write-Host ""
Write-Host "ssh -o StrictHostKeyChecking=no root@69.62.86.69"
Write-Host ""
Write-Host "Cuando te pida la contraseña, ingresa: Silverstone88+"
Write-Host ""
Write-Host "Una vez dentro del VPS, copia y pega EXACTAMENTE este comando:"
Write-Host ""
Write-Host "mkdir -p ~/.ssh && echo '$pubKey' >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys && echo 'KEY_ADDED_OK'"
Write-Host ""
Write-Host "Despues cierra la sesion con 'exit' y volvamos aca."
