#verifica se o comando npm existe no sistema 
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {

    #caso o npm não esteja instalado, avisa o usuário em vermelho 
    Write-Host "NodeJS is not installed" -ForegroundColor Red

    #ixibe instruções de instalações do nodejs no link abaixo 
    Write-Host "Install it on 'https://nodejs.org/en/download'" -ForegroundColor Yellow
    exit 1     #encerra o script com erro 
}

#se o npm existe exibe ao usuário a mensagem abaixo 
Write-Host "npm is installed" -ForegroundColor Green

#verifica se o compilador em++ do emscripten está instalado 
if (-not (Get-Command em++ -ErrorAction SilentlyContinue)) {

    #alerta caso não esta presente o compilador 
    Write-Host "Emscription is not installed" -ForegroundColor Red

    #orienta onde e como instalar o link abaixo 
    Write-Host "Download emscripton following this instructions in website 'https://emscripten.org/docs/getting_started/downloads.html'" -ForegroundColor Yellow
    exit 1         #encerra por erro 
}
#confirma se o emscripten está instalado
Write-Host "Emscription is installed" -ForegroundColor Green

#informa que vai iniciar o scripten de instalação 
Write-Host "Running compiling script" -ForegroundColor Yellow
& ".\backend\compile.ps1"        #está executando o script de compilação do backend

#verifica de a compilação deu erro
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error to compile. ERROR CODE: $LASTEXITCODE" -ForegroundColor Red
    exit 1  #encerra em caso de falha 
}

#compilação concluida
Write-Host "Backend was compiled with success!" -ForegroundColor Green

#está começando a instalação das depências do npm install 
Write-Host "Installing npm packages" -ForegroundColor Yellow

#está instalando os pacotes na pasta frontend
npm install --prefix ".\frontend"

#verifica falha na instalação do npm install 
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error to install npm packages. ERROR CODE: $LASTEXITCODE" -ForegroundColor Red
    exit 1
}

#informa que vai iniciar a aplicação com o npm start
Write-Host "Running npm to start project" -ForegroundColor Yellow

#inicia o frontend
npm start --prefix ".\frontend"

#caso o npm start falhe 
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error to run npm. ERROR CODE: $LASTEXITCODE" -ForegroundColor Red
    exit 1
}