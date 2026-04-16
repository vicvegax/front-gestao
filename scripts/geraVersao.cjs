const fs = require('fs');
const path = require('path');

const now = new Date();
const versao_front = `0.${String(now.getFullYear()).slice(-2)}.${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

const indexPath = path.join(__dirname, '../src/index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

// Remove tag antiga, se existir
indexHtml = indexHtml.replace(/<meta name="versao".*?>\n?/gi, '');

// Injeta nova tag logo após a tag <head>
indexHtml = indexHtml.replace(
  /<head([^>]*)>/i,
  `<head$1>\n  <meta name="versao" content="${versao_front}">`
);

fs.writeFileSync(indexPath, indexHtml);
console.log(`✅ Versão injetada no index.html: ${versao_front}`);

try {
  // Caminho para o package.json (na raiz do projeto, um nível acima de __dirname)
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  
  // Lê o arquivo
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  
  // Faz o parse do JSON
  const packageJson = JSON.parse(packageJsonContent);
  
  // Atualiza a versão com a 'versao_front'
  packageJson.version = versao_front;
  
  // Formata o JSON de volta (com 2 espaços) e adiciona linha no final
  const updatedPackageJsonContent = JSON.stringify(packageJson, null, 2) + '\n';
  
  // Escreve o arquivo de volta
  fs.writeFileSync(packageJsonPath, updatedPackageJsonContent);
  
  console.log(`✅ Versão atualizada no package.json: ${versao_front}`);
} catch (error) {
  console.error('❌ Erro ao atualizar o package.json:', error);
}