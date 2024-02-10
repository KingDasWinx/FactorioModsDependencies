const puppeteer = require('puppeteer');

const downloadedUrls = new Set(); // Conjunto para armazenar URLs baixadas

async function downloadDependenciesRecursively(url, downloadDirectory) {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Coletar URLs das dependências
  const dependencies = await page.evaluate(() => {
    const dependencyList = [];
    const dependencyItems = document.querySelectorAll('#mod-info-interface dl.row dd#mod-info-required-dependencies ul li a');
    dependencyItems.forEach(item => {
      dependencyList.push(item.getAttribute('href'));
    });
    return dependencyList;
  });

  // Se não houver dependências, retornar
  if (dependencies.length === 0) {
    console.log("Não há dependências para este mod.");
    await browser.close();
    return;
  }

  // Baixar as dependências diretas
  for (let i = 0; i < dependencies.length; i++) {
    const dependencyUrl = dependencies[i];
    console.log(dependencyUrl);

    if (downloadedUrls.has(dependencyUrl)) {
      console.log(`Arquivo já baixado: ${dependencyUrl}`);
      continue; // Pular download se já baixado
    }

    // Abrir uma nova aba para cada dependência
    const newPage = await browser.newPage();
    await newPage.goto(dependencyUrl, { waitUntil: 'networkidle2' });

    try {
      // Esperar até que o botão de download seja clicável
      await newPage.waitForSelector('div.top-margin button#download-button', { visible: true });

      // Clique no botão de download da dependência na nova aba
      await newPage.click('div.top-margin button#download-button', {
        waitUntil: 'filechooser',
        path: `${downloadDirectory}/${dependencyUrl.split('/').pop()}`
      });
      await sleep(2000);
      console.log("baixou");
    } catch (error) {
      console.error("Erro ao clicar no botão de download:", error);
    }

    // Fechar a aba atual
    await newPage.close();

    downloadedUrls.add(dependencyUrl); // Adicionar ao conjunto de URLs baixadas
  }

  // Chamar a função recursivamente para cada dependência
  for (let i = 0; i < dependencies.length; i++) {
    const dependencyUrl = dependencies[i];
    await downloadDependenciesRecursively(dependencyUrl, downloadDirectory);
  }

  // Fechar o navegador após a conclusão do processo
  await browser.close();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// URL do mod base (substitua pelo seu URL real)
const modBaseUrl = 'https://re146.dev/factorio/mods/en#https://mods.factorio.com/mod/heavily-modded-modpack';

// Diretório de download (substitua pelo seu diretório real)
const downloadDirectory = '/home/kingdaswinxbr/Downloads/testes';

// Chamar a função recursiva a partir do mod base
downloadDependenciesRecursively(modBaseUrl, downloadDirectory);
