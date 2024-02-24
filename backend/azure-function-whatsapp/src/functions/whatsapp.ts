import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
// import { crypto } from 'crypto';
import * as crypto from 'crypto';
import { OpenAIMessage, Property, RoleType, WhatsappWebHook } from './types';
import {
  OpenAIClient,
  AzureKeyCredential,
  ChatCompletions,
  ChatRequestMessage,
  GetChatCompletionsOptions,
  ChatCompletionsFunctionToolDefinition,
  FunctionCall,
  ChatCompletionsFunctionToolCall,
  ChatRequestToolMessage,
  ChatResponseMessage,
  ChatRole,
  ChatRequestAssistantMessage,
} from '@azure/openai';
import { DefaultAzureCredential } from '@azure/identity';

import { BlobServiceClient } from '@azure/storage-blob';
import { getDistance } from './geolocation';
import { features } from 'process';

const hubVerifyToken = process.env.HUB_VERIFY_TOKEN || 'test';
const hubVerifySha = process.env.HUB_VERIFY_SHA || 'sha256';
const whatsappToken = process.env.WHATSAPP_TOKEN;

const azureEndpoint =
  process.env['ENDPOINT'] || 'https://whatsapp-chat.openai.azure.com/';
// Your Azure OpenAI API key
const azureApiKey = process.env['AZURE_API_KEY'];
// Your Azure Cognitive Search endpoint, admin key, and index name
const azureSearchEndpoint =
  process.env['AZURE_SEARCH_ENDPOINT'] ||
  'https://whatsapp-chat-2.search.windows.net';
const azureSearchKey = process.env['AZURE_SEARCH_KEY'] || '<search key>';
const azureSearchIndexName =
  process.env['AZURE_SEARCH_INDEX'] || "'whatsapp-chat-idx-index'";
const azureSearchDeploymentId =
  process.env['AZURE_SEARCH_DEPLOYMENT_ID'] || 'whatsapp-chat';
const azureOpenAISystemRole =
  process.env['AZURE_OPENAI_SYSTEM_ROLE'] ||
  `You are an AI estate agent that helps people find information about new property builds (primary market) in Brazil. 
You must only provide information about properties built by Exto Incorporação e Construção by calling the tools defined.`;

// You must only use content from the following sites:
// GERAL
// https://linktr.ee/exto_incorporadora
// EXCELLENCE PERDIZES
// https://linktr.ee/excellenceperdizes
// LEDGE BROOKLIN
// https://linktr.ee/Ledge_Brooklin
// TERRARO VILA ROMANA
// https://linktr.ee/Terraro_Vila_Romana
// BLUE HOME RESORT
// https://linktr.ee/Blue_Home_Resort_Jockey
// LAMP PERDIZES
// https://linktr.ee/LAMP_Perdizes
// ONLY CIDADE JARDIM
// https://linktr.ee/Only_Cidade_Jardim
// UPPER EAST PERDIZES
// https://linktr.ee/Upper_East_Perdizes
// UPPER WEST PERDIZES
// https://linktr.ee/Upper_West_Perdizes
// MONDO MORUMBI
// https://linktr.ee/Mondo_Morumbi
// PROVENANCE MORUMBI
// https://linktr.ee/Provenance_Morumbi
// SINTONIA PERDIZES
// https://linktr.ee/Sintonia_Perdizes
// ESSÊNCIA DA VILA
// https://linktr.ee/Essencia_da_Vila
// INSPIRE IBIRAPUERA
// https://linktr.ee/Inspire_Ibirapuera
// PARC DEVANT PERDIZES
// https://linktr.ee/Parc_Devant_Perdizes
// CONVERGE
// https://linktr.ee/Converge_Vila_Romana
// `;

const azureBlobConnectionString =
  process.env['AZURE_BLOB_CONNECTION_STRING'] ||
  'https://pvhomewhatsapp8fc1.blob.core.windows.net';
const azureBlobContainerName =
  process.env['AZURE_BLOB_CONTAINER_NAME'] || 'whatsapp-chat';

const openAISettings: GetChatCompletionsOptions = {
  maxTokens: 900,
  temperature: 0.7,
  topP: 0.95,
  frequencyPenalty: 0,
  presencePenalty: 0,
  stop: null,

  /**
   * The `azureExtensionOptions` property is used to configure the
   * Azure-specific extensions. In this case, we are using the
   * Azure Cognitive Search extension with a vector index to provide
   * the model with additional context.
   */
  // azureExtensionOptions: {

  //   extensions: [
  //     {
  //       type: 'AzureCognitiveSearch',
  //       endpoint: azureSearchEndpoint,
  //       key: azureSearchKey,
  //       indexName: azureSearchIndexName,
  //     },
  //   ],
  // },
};
export interface Location {
  latitude: number;
  longitude: number;
  radiusInMeters?: number;
}

const getBuildingCompaniesInLocation = async (
  location: Location,
  context: InvocationContext,
): Promise<string> => {
  context.log(
    `in getBuildingCompaniesInLocation() => location = ${JSON.stringify(
      location,
    )}`,
  );
  return location.latitude < 0 && location.longitude < 0
    ? 'Exto Incorporação e Construção'
    : 'not available';
};

const squareFeetPerSquareMeter = 10.7639;

const sampleProperties: Property[] = [
  {
    kind: ['building'],
    name: 'Excellence Guedala',
    id: '1',
    latitude: -23.5863678,
    longitude: -46.7175488,
    descripton: `Um projeto excepcional, na rua mais desejada do Jardim Guedala. Em seus mais de 30 anos de história, a Exto desenvolveu projetos que se consagraram verdadeiros marcos, como o Only Cidade Jardim, com mais de 11 mil metros quadrados de terreno em frente à Ponte Estaiada, e o Green Guedala, empreendimento recém-entregue que virou referência na região.
É esta busca pela excelência que nos inspirou a criar o Excellence Guedala. Um empreendimento que homenageia o bairro, porque reúne diferenciais que são marcas registradas da Exto, somados à melhor rua do Jardim Guedala e a uma visão de futuro que torna o projeto atemporal.
São características excepcionais na arquitetura, no design, nos acabamentos, nos ambientes de lazer, na localização e nos diferenciais dos apartamentos. O resultado é um lançamento em perfeito equilíbrio para quem deseja uma experiência exclusiva de morar, com a tranquilidade de investir em uma empresa sólida e de qualidade.
Um projeto para atender aos mais exigentes desejos. Exclusivo, puramente residencial, com plantas inteligentes de 126m² e 96m² e 3 suítes.
PLANTAS:
96M² - 2 SUÍTES - LIVING, COZINHA E TERRAÇO INTEGRADOS
96M² - 3 SUÍTES
126M² - 2 SUÍTES - BANHO MASTER AMPLIADO + LIVING, COZINHA E TERRAÇO INTEGRADOS
126M² - 3 SUÍTES - LIVING, COZINHA E TERRAÇO INTEGRADOS
126M² - 3 SUÍTES
O EMPREENDIMENTO:
Torre única e puramente residencial, na Rua dos Três irmãos, a mais desejada do bairro, cercada de comércio e serviços
A 600m da Estação São Paulo-Morumbi
Design by Exto: arquitetura sofisticada, materiais e acabamentos nobres
Paisagismo que esbanja tranquilidade e bem-estar
Fachada contemporânea com aplicação de molduras e textura impermeável
Pingadeiras e peitoris em pedra para preservação da fachada
Garagens elevadas com relação ao nível da Rua, executada em padrão diferenciado, com piso em pintura epóxi e barrado em revestimento cerâmico
Áreas comuns entregues decoradas
SEGURANÇA E INFRAESTRUTURA:
Acesso social, de serviço e de automóveis com duplo bloqueio de segurança e guarita recuada em vidro blindado.
Sala para recebimento e armazenagem de correspondências, encomendas ou itens refrigerados dos condôminos
Local de espera para táxi e Uber
Previsão de loja de conveniência automatizada no Térreo
Gerador com acionamento automático para os elevadores, pontos de iluminação de emergência e sistemas de controle de segurança
Ar-condicionado entregue instalado na guarita, salão de festas, brinquedoteca, espaço beauty, sala de massagem e fitness
LAZER:
Piscina de 25m descoberta, com raias, deck molhado e piscina infantil
Fitness equipado
Fitness outdoor
Salão de festas gourmet
Espaço beauty
Sala de massagem
Brinquedoteca
Playground
Miniquadra com grama sintética
Pet agility
Pomar
OS APARTAMENTOS:
Ambientes com iluminação e ventilação natural
Piso do terraço nivelado com o da sala
Infraestrutura completa de ar-condicionado (rede frigorígena, cabeamentos elétricos e drenos) no living e suítes das unidades, pronta para receber equipamentos
Infraestrutura para instalação de churrasqueira a gás e coifa
Caixilho das suítes com persiana de enrolar em dimensões especiais
SUSTENTABILIDADE:
Previsão de espaços destinados à acomodação de resíduos recicláveis
Programa de Coleta Seletiva implantado na entrega do empreendimento
Sistema de reuso de águas de pluviais
Instalação de infraestrutura para sistema de aquecimento solar para atender 40% da demanda de água quente dos apartamentos, reduzindo o consumo de gás nos aquecedores individuais
Infraestrutura para abastecimento de veículos elétricos para uso coletivo, com previsão de cargas especiais no quadro elétrico, e tubulação seca até os locais definidos, para posterior instalação e regulamentação a/c condomínio.*
* 7 pontos em espaços viabilizados, sendo 2 pontos no térreo, 3 pontos no 1º pavimento, 1 ponto no 2° pavimento e 1 ponto no 3° pavimento de garagem, com funcionamento independente do gerador
Infraestrutura para medição individualizada de água e gás
Bacias e torneiras das áreas comuns com controle de vazão para economia de água
Priorização de iluminação e ventilação naturais dos ambientes para reduzir o consumo de energia elétrica
Gestão de resíduos (separação, armazenamento, transporte e destinação) integrada e monitorada com indicadores
Materiais recicláveis e reaproveitáveis para execução dos almoxarifados, tapumes e portões dos canteiros de obra
Lâmpadas fluorescentes em led tubular para iluminação provisória dos canteiros de obra
Especificação de materiais de qualidade e certificados para evitar retrabalhos e geração de resíduos
Projetos de modulação de alvenaria para evitar retrabalhos e reduzir a geração de entulhos
Kits de portas prontas em madeira de reflorestamento
Kits hidráulicos para montagem de instalações sem desperdício e geração de resíduos
Condutores de energia em barramentos blindados, com montagem sem desperdícios e resíduos
Instalações elétricas e hidráulicas inspecionáveis nas áreas comuns
Otimização das instalações hidráulicas para redução do consumo de materiais
Destinação de entulho cinza para reciclagem
Destinação de resíduos recicláveis para cooperativas
Projetos de logística reversa
A Exto tem certificação do PBQPH - Nível A, classificação máxima de excelência na construção civil.`,
    address:
      'Rua dos Três Irmãos, 186 - Caxingui, São Paulo - SP, 05615-190, Brazil',
    url: 'https://www.exto.com.br/empreendimentos/excellence-guedala',
  },
  {
    kind: ['building'],
    id: '2',
    floors: 26,
    name: 'Lamp Perdizes',
    latitude: -23.537203,
    longitude: -46.676152,
    short_description:
      'Um projeto luminoso, em um dos pontos mais altos e nobres de Perdizes, a 900 metros da futura estação Perdizes.  Apartamentos de 1 a 4 quartos com áreas de 53M² a 142M²',
    descripton: `Torre única residencial. EM UM DOS PONTOS MAIS ALTOS E NOBRES DE PERDIZES 
Luz é vida, felicidade, energia.
Luz é o brilho que ilumina e renova as esperanças.
Chega uma hora que aprendemos a valorizar esses pequenos momentos:
a felicidade da nossa família, estar onde e com quem queremos, enxergar o lado iluminado das coisas.
À luz de tudo isso, a Exto idealizou o LAMP - Life Around Modern Perdizes.
Um projeto que traz mais vida para a região e joga luz no que realmente importa.
Um bairro que se modernizou, mas que mantém suas tradições, onde a luz do Sol passa pela copa das árvores, reflete nas águas do parque, clareia a arquitetura, emana de eventos no Allianz Parque e traz charme para os restaurantes descolados.
A luz é o ponto de partida deste projeto e permeia todos os ambientes, inspirando, renovando as energias e trazendo mais conforto para a sua vida.
PLANTAS:
53M² - 1 SUÍTE
88M² - 2 SUÍTES
138M² - 2 SUÍTES - SUÍTE AMPLIADA + LIVING E COZINHA INTEGRADOS
138M² - 3 SUÍTES
142M² - 3 SUÍTES - BANHO MASTER AMPLIADO
142M² - 3 SUÍTES - HOME OFFICE
142M² - 3 SUÍTES - LIVING AMPLIADO
142M² - 4 SUÍTES
O EMPREENDIMENTO: 
2.000m² de terreno
Fachada contemporânea
Aplicação de molduras, revestimento cerâmico e textura impermeável. Pingadeiras e peitoris em granito polido.
Garagem em padrão diferenciado, com piso em pintura epóxi e barrado em revestimento cerâmico
Áreas comuns entregues equipadas e decoradas 
Infraestrutura para wi-fi nas áreas comuns
SEGURANÇA E INFRAESTRUTURA:
Acesso social coberto e acesso de autos com duplo bloqueio de segurança e guarita recuada com vidro blindado
Sala para recebimento e armazenagem de correspondências, encomendas ou itens refrigerados dos condôminos
Previsão de loja de conveniência automatizada aberta 24h exclusiva para os condôminos
Local de espera para táxi e Uber
Infraestrutura para wi-fi nas áreas comuns
Gerador com acionamento automático para atendimento dos elevadores, pontos de iluminação de emergência e sistemas de controle de segurança.
Bicicletário
LAZER:
Fitness com equipamentos high tech
Piscina climatizada com deck molhado e piscina infantil
Bar lounge piscina
Coworking
Salão de festas gourmet
Praça Festas e fireplace
Campo gramado
Brinquedoteca
Playground
Espaço Pet com Agility
Espaço Beauty com sala de massagem
Espaço Zen para meditação e alongamento
OS APARTAMENTOS:
Ambientes com ventilação e iluminação natural
Piso do terraço nivelado com o da sala
Será entregue infra estrutura de ar-condicionado no living e suítes
Infraestrutura para instalação de churrasqueira a Gás nas unidades
Gerador que alimenta alguns pontos de força e de iluminação
Caixilho das Suítes com persiana de enrolar integrada e em dimensões especiais
Projeto de tecnologia: maximização do sinal de wi-fi
PersonalizExto: Ao adquirir uma unidade, você terá três meses para optar pela planta que melhor se adeque à sua realidade, entre as alternativas disponíveis, sem ônus.* Será possível também a combinação dos ambientes mostrados nas diferentes plantas.
* A opção por layout de planta acontecerá desde que a estrutura do empreendimento não esteja completa.
SUSTENTABILIDADE:
Materiais recicláveis e reaproveitáveis para execução dos almoxarifados, tapumes e portões dos canteiros de obra
Certificação do PBQPH - Nível A. Classificação máxima de excelência na construção civil 
Projetos de logística reversa
Destinação de resíduos recicláveis para cooperativas
Destinação de entulho cinza para reciclagem
Otimização das instalações hidráulicas para redução do consumo de materiais hidráulicos e elétricos
Condutores de energia em barramentos blindados, com montagem sem desperdícios e resíduos
Instalações elétricas e hidráulicas inspecionáveis nas áreas comuns
Kits hidráulicos para montagem de instalações sem desperdício e geração de resíduo
Kits de portas prontas em madeira de reflorestamento
Projetos de modulação de alvenaria para evitar retrabalhos e reduzir a geração de entulhos
Especificação de materiais de qualidade e certificados para evitar retrabalhos e geração de resíduos
Lâmpadas fluorescentes em led para iluminação provisória dos canteiros de obra
Previsão de espaços destinados à acomodação de resíduos recicláveis
Gestão de resíduos (separação, armazenamento, transporte e destinação) integrada e monitorada com indicadores
Válvulas redutoras de pressão no sistema de distribuição de água, para promover a redução do consumo e conforto ao morador
Equipamentos eletroeletrônicos com selo Procel nas áreas comuns
Alvenarias (paredes) em blocos cerâmicos, para maior conforto térmico e acústico
Bicicletário
Priorização de iluminação e ventilação naturais dos ambientes para reduzir o consumo de energia elétrica
Bacias e torneiras das áreas comuns com controle de vazão para economia de água
Infraestrutura para medição individualizada de água e gás
Infraestrutura para instalação de abastecimento de carros elétricos para uso coletivo
Infraestrutura para sistema de aquecimento solar que atende 40% da demanda de água quente dos apartamentos, reduzindo o consumo de gás nos aquecedores individuais
Sistema de reuso de águas de pluviais
Programa de Coleta Seletiva implantado na entrega do empreendimento.`,
    address: 'R. Campevas, 300 - Perdizes, São Paulo - SP, 05016-010, Brazil',
    url: 'https://www.exto.com.br/empreendimentos/lamp-perdizes',
  },
  {
    id: '3',
    kind: ['building'],
    floors: 30,
    name: 'Only Cidade Jardim',
    latitude: -23.615101,
    longitude: -46.702169,
    short_description:
      'O Altíssimo Padrão Exto, em frente ao maior cartão postal de São Paulo, a Ponte Estaiada. Apartamentos de 4 suítes prontos para morar. PLANTAS NO CONCEITO INTERNACIONAL DE SALA ABERTA E PÉ DIREITO COM DIMENSÕES ESPECIAIS DE 2,80M LIVRES',
    descripton: `Localização única: em frente à Ponte Estaiada, maior cartão postal de São Paulo, a Ponte Estaiada e a 2 min. do Shopping Cidade Jardim. Também a poucos passos do novo Parque Bruno Covas, complexo de lazer que contará com 650.000m² de lazer, conveniência e do futuro complexo multiuso Usina SP.
Mobilidade e acesso: entre as pontes Cidade Jardim e do Morumbi
Apenas duas torres em terreno de aproximadamente 11.000m²
Vagas escolhidas no ato da compra
Áreas comuns entregues equipadas e decoradas por Anastassiadis Arquitetos
Projeto de segurança com a Haganá
Garagem de altíssimo padrão, com piso em acabamento granilite, um box para cada unidade e recepções sociais decoradas para todos os finais sociais
Porte cochère, duplo bloqueio de acesso e projeto completo de segurança
Elevadores sociais com hall privativo para cada unidade, dois elevadores de serviço e duas escadarias por edifício
Fachada em estilo clássico contemporâneo em massa travertino, impermeabilizada, com molduras, gradis e vidro refletivo e laminado. Pingadeiras de 4cm em granito nas soleiras e peitoris de forma a prevenir manchas. Projeto específico de iluminação e filetes em LED
SEGURANÇA E INFRAESTRUTURA: Complexo com sistema de monitoramento 24h por dia, Projeto de segurança desenvolvido por consultoria, com sistema de monitoramento 24h por dia e portaria blindada
LAZER: Complexo aquático com piscina coberta com raia de 20m, piscina descoberta com raia de 25m, observatório em vidro e piscina infantil. Todas climatizadas, Quadra de tênis oficial e Club Tennis com churrasqueira, Quadra poliesportiva, Fitness de 200m² com equipamentos high tech e vista panorâmica para a Ponte Estaiada, Studio funcional fitness, pilates e artes marciais, Pista de caminhada com 300m e piso emborrachado, Brinquedoteca e playground externo, Salão de festas e espaço gourmet, PUB e sala de jogos, Beauty Studio, Spa, sala de massagem e sauna úmida com lounge, Coworking – espaço de trabalho com sala de reunião, Pet place com equipamentos agility, hostel e banho, Mais de 3.400m² de praças, pomar e paisagismo por Benedito Abbud
OS APARTAMENTOS: Ambientes com ventilação e iluminação natural, Pé-direito com dimensões especiais: 2,80m livres; 3,06m de piso a piso, Hall privativo para todas as unidades, Aquecimento de 100% da demanda de água através de placas solares, sem necessidade de boiler ou aquecedor, Circuito de recirculação que garante água quente disponível de imediato, evitando desperdício, Piso do terraço nivelado com o living, Infraestrutura de ar-condicionado em todas as suítes e no living, Iluminação cênica instalada no living e terraço, Infraestrutura para aspiração central, Fechadura da entrada social com sistema de biometria, Gerador que atende três pontos de energia e dois de iluminação em cada unidade, Projeto de tecnologia para maximização do sinal de wifi, Tomada USB nas suítes, Terraço gourmet entregue com churrasqueira e bancada, Caixilho das suítes com dimensões especiais, persianas integradas e tratamento acústico, Edição especial de metais monocomando Deca linha Only
SUSTENTABILIDADE: Instalações hidráulicas e elétricas inspecináveis, facilitando eventuais manutenções, Bicicletário, Processos construtivos sustentáveis, Priorização de iluminação e ventilação naturais dos ambientes e subsolos, Caixas de captação para reuso de águas pluviais nas áreas comuns, Torneiras das áreas comuns com temporizadores, Previsão para individualização de água e gás, Blocos cerâmicos, que aumentam o conforto térmico e acústico
Áreas comuns entregues com iluminação em LED e sensor de presença nas áreas comuns, Estações de recarga elétrica para automóveis, Portas em madeira de reflorestamento de alta qualidade, Certificação do PBQPH- nível A. Classificação máxima de excelência.
Opções de plantas de apartamento:
  - Torre SUNRISE - 186M² - 3 SUÍTES - SUÍTE MASTER, LIVING E COZINHA AMPLIADOS
  - Torre SUNRISE - 186M² - 4 SUÍTES - LIVING AMPLIADO
  - Torre SUNRISE - 186M² - 4 SUÍTES
  - Torre SUNRISE - 186M² - 3 SUÍTES - SUÍTE MASTER E LIVING AMPLIADOS
  - Torre SUNRISE - 211M² - 4 SUÍTES
  - Torre SUNRISE - 211M² - 4 SUÍTES - LIVING E COZINHA INTEGRADOS - SUÍTE 2 AMPLIADA - HOME OFFICE
  - Torre SUNRISE - 211M² - 3 SUÍTES - SUÍTE MASTER, LIVING E COZINHA AMPLIADOS - HOME OFFICE
  - Torre SUNRISE - 211M² - 3 SUÍTES - SUÍTE MASTER E LIVING AMPLIADOS - HOME OFFICE
  - Torre SUNRISE - 211M² - 3 SUÍTES - LIVING AMPLIADO - SALA ÍNTIMA OFFICE
  - Torre SUNSET - 233M² - 3 SUÍTES - COZINHA GOURMET
  - Torre SUNSET - 233M² - 3 SUÍTES
  - Torre SUNSET - 233M² - 4 SUÍTES
  - Torre SUNSET - 252M² - 2 SUÍTES
  - Torre SUNSET - 252M² - 3 SUÍTES - SALA ÍNTIMA E TERRAÇO PANORÂMICO
  - Torre SUNSET - 252M² - 3 SUÍTES - SUÍTE MASTER AMPLIADA - LIVING E COZINHA INTEGRADOS
  - Torre SUNSET - 252M² - 4 SUÍTES - COZINHA GOURMET
  - Torre SUNSET - 252M² - 4 SUÍTES - OFFICE - LAVABO INTEGRADO AO JANTAR`,
    address:
      'Av. Duquesa de Goiás, 825 - Cidade Jardim, São Paulo - SP, 05686-002, Brazil',
    url: 'https://www.exto.com.br/empreendimentos/only-cidade-jardim/',
  },
  // {
  //   kind: ['house'],
  //   floors: 3,
  //   latitude: -23.560876,
  //   longitude: -46.6937311,
  //   descripton: 'Large House With garden',
  //   address: 'Rua Morás, 53 - Pinheiros, São Paulo - SP, 05419-001, Brazil',
  //   areaSqMeter: 3300 / squareFeetPerSquareMeter,
  //   rooms: [
  //     {
  //       kind: 'bedroom',
  //       areaSqMeter: 300 / squareFeetPerSquareMeter,
  //     },
  //     {
  //       kind: 'bedroom',
  //       areaSqMeter: 300 / squareFeetPerSquareMeter,
  //     },
  //     {
  //       kind: 'bedroom',
  //       areaSqMeter: 300 / squareFeetPerSquareMeter,
  //       features: ['air conditioner', 'luxurious', 'modern'],
  //     },
  //     { kind: 'bathroom' },
  //     { kind: 'diningroom' },
  //     { kind: 'kitchen' },
  //     { kind: 'swimming pool' },
  //     { kind: 'garden' },
  //   ],
  //   features: ['ground pump', 'solar panels', 'fast internet'],
  // },
  // {
  //   kind: ['building'],
  //   floors: 30,
  //   name: 'Excellence Perdizes',
  //   latitude: -23.5636879,
  //   longitude: -46.6916552,
  //   descripton: 'Large House With garden',
  //   address:
  //     'Av. Pedroso de Morais, 600 - Pinheiros, São Paulo - SP, 05420-001, Brazil',
  //   url: 'https://linktr.ee/excellenceperdizes',
  //   areaSqMeter: 3300 / squareFeetPerSquareMeter,
  //   communalAreas: [
  //     {
  //       kind: 'sauna',
  //       areaSqMeter: 300 / squareFeetPerSquareMeter,
  //       features: ['modern']

  //     },
  //     {
  //       kind: 'gym',
  //       areaSqMeter: 300 / squareFeetPerSquareMeter,
  //     },
  //     { kind: 'swimming pool' },
  //     { kind: 'garden' },
  //     { kind: 'playground' },
  //   ],
  //   features: [
  //     'solar panels',
  //     'fast internet',
  //     '24-hour concierge',
  //     '24-hour porter',
  //     'convenience store',
  //   ],
  //   flats: [
  //     {
  //       floorNumber: 1,
  //       kind: ['flat'],
  //       areaSqMeter: 300,
  //       rooms: [
  //         {
  //           kind: 'bedroom',
  //           areaSqMeter: 300 / squareFeetPerSquareMeter,
  //           features: ['air conditioner', 'luxurious', 'modern', 'ensuite'],
  //         },
  //         {
  //           kind: 'bedroom',
  //           areaSqMeter: 300 / squareFeetPerSquareMeter,
  //           features: ['air conditioner', 'luxurious', 'modern'],
  //         },
  //         {
  //           kind: 'bedroom',
  //           areaSqMeter: 300 / squareFeetPerSquareMeter,
  //           features: ['air conditioner', 'luxurious', 'modern'],
  //         },
  //         { kind: 'bathroom' },
  //         { kind: 'diningroom' },
  //         { kind: 'kitchen', features: ['modern'] },
  //       ],
  //     },
  //     {
  //       floorNumber: 21,
  //       kind: ['flat'],
  //       areaSqMeter: 300,
  //       rooms: [
  //         {
  //           kind: 'bedroom',
  //           areaSqMeter: 20,
  //           features: ['air conditioner', 'luxurious', 'modern', 'ensuite'],
  //         },
  //         {
  //           kind: 'bedroom',
  //           areaSqMeter: 21,
  //           features: ['air conditioner', 'luxurious', 'modern', 'ensuite'],
  //         },
  //         {
  //           kind: 'bedroom',
  //           areaSqMeter: 30,
  //           features: ['air conditioner', 'luxurious', 'modern', 'ensuite'],
  //         },
  //         {
  //           kind: 'bedroom',
  //           areaSqMeter: 15,
  //           features: ['air conditioner', 'luxurious', 'modern'],
  //         },
  //         {
  //           kind: 'bedroom',
  //           areaSqMeter: 17,
  //           features: ['air conditioner', 'luxurious', 'modern'],
  //         },
  //         { kind: 'bathroom' },
  //         { kind: 'bathroom' },
  //         { kind: 'diningroom' },
  //         { kind: 'livingroom' },
  //         { kind: 'kitchen', features: ['modern'] },
  //         { kind: 'outside kitchen', features: ['modern'] },
  //       ],
  //     },
  //   ],
  // },
];

const resetHistory = async (
  to: string,
  messages: ChatRequestMessage[],
  context: InvocationContext,
): Promise<string> => {
  messages.length = 0;
  context.log(`resetting chat history for ${to}`);
  await containerClient.createIfNotExists();

  putOpenAIMessageHistory(to, []);
  return `resetting chat history for ${to}`;
};
const getPropertiesNearLocation = async (
  location: Location,
  context: InvocationContext,
): Promise<string> => {
  context.log(
    `in getPropertiesNearLocation() => location = ${JSON.stringify(location)}`,
  );
  const propertiesByDistance = sampleProperties.sort((a, b) => {
    a.distance = getDistance(
      location.latitude,
      location.longitude,
      a.latitude,
      a.longitude,
    );

    b.distance = getDistance(
      location.latitude,
      location.longitude,
      b.latitude,
      b.longitude,
    );
    return a.distance - b.distance;
  });

  const properties10K = propertiesByDistance.filter(
    (val) =>
      val.distance
        ? val.distance < (location.radiusInMeters || 10000)
        : getDistance(
            location.latitude,
            location.longitude,
            val.latitude,
            val.longitude,
          ) < 15000,
    // (location.radiusInMeters || 10000),
  );

  const summaryVals = properties10K.map((val) => ({
    id: val.id,
    address: val.address,
    url: val.url,
    short_description: val.short_description,
  }));

  context.log(`properties within 10K: ${JSON.stringify(summaryVals)}`);

  return JSON.stringify(summaryVals);
};

export interface IdObj {
  id: string 
}

const getDetailedInformation = async (
  data: IdObj,
  context: InvocationContext,
): Promise<string> => {
  context.log(`in getDetailedInformation() => id = ${data.id}`);

  const res = sampleProperties.filter((prop: Property) => prop.id === data.id);
  return JSON.stringify(res);
};

type FunctionTypes =
  | typeof getBuildingCompaniesInLocation
  | typeof getPropertiesNearLocation
  | typeof getDetailedInformation;

type FuncResetHistoryType = typeof resetHistory;

type ToolType = {
  metadata: ChatCompletionsFunctionToolDefinition;
  func: FunctionTypes | FuncResetHistoryType;
};

const toolsMap: Record<string, ToolType> = {
  getDetailedInformation: {
    func: getDetailedInformation,
    metadata: {
      type: 'function',
      function: {
        name: 'getDetailedInformation',
        description: 'Gets details about a property given an id returned from calling getPropertiesNearLocation()',
        parameters: {
          type: 'object',
          descrition:
            'The id of a property returned from calling getPropertiesNearLocation() e.g. { "id": "1234556" }',
          properties: {
            id: {
              type: 'string',
            },
          },
          required: ['id'],
        },
      },
    },
  },
  getPropertiesNearLocation: {
    func: getPropertiesNearLocation,
    metadata: {
      type: 'function',
      function: {
        name: 'getPropertiesNearLocation',
        description:
          'Lists properties in an area in a json format  { "id": string, "short_description": string, "url": string, "address": string }  use the id returned here to get more information by calling getDetailedInformation()',
        parameters: {
          type: 'object',
          descrition:
            'The area as latitude, logitude, and radius in meters e.g. { "latitude": -23.6110,  "longitude": -46.6934, "radiusInMeters": 10000}',
          properties: {
            latitude: {
              type: 'number',
              minimum: -90,
              maximum: 90,
            },
            longitude: {
              type: 'number',
              minimum: -180,
              maximum: 180,
            },
            radiusInMeters: {
              type: 'integer',
              minimum: 1000,
              maximum: 100000,
              multipleOf: 1000,
            },
          },
          required: ['latitude', 'longitude', 'radiusInMeters'],
        },
      },
    },
  },

  // getBuildingCompaniesInLocation: {
  //   func: getBuildingCompaniesInLocation,
  //   metadata: {
  //     type: 'function',
  //     function: {
  //       name: 'getBuildingCompaniesInLocation',
  //       description: 'Lists property development companies in a given location',
  //       parameters: {
  //         type: 'object',
  //         descrition:
  //           'The location as latitude and logitude, e.g. { "latitude": -23.6110,  "longitude": -46.6934}',
  //         properties: {
  //           latitude: {
  //             type: 'number',
  //             minimum: -90,
  //             maximum: 90,
  //           },
  //           longitude: {
  //             type: 'number',
  //             minimum: -180,
  //             maximum: 180,
  //           },
  //         },
  //         required: ['latitude', 'longitude'],
  //       },
  //     },
  //   },
  // },
  resetHistory: {
    func: resetHistory,
    metadata: {
      type: 'function',
      function: {
        name: 'resetHistory',
        description: 'resets the chat history, restarts the chat',
        parameters: {
          type: 'object',
          description: 'No parameters',
          properties: {},
        },
      },
    },
  },
};

const tools: ChatCompletionsFunctionToolDefinition[] = Object.entries(
  toolsMap,
).map(([key, value]) => value.metadata);
const blobServiceClient = new BlobServiceClient(
  azureBlobConnectionString,
  new DefaultAzureCredential(),
);

const openAIclient = new OpenAIClient(
  azureEndpoint,
  new DefaultAzureCredential(),
);

// const blobServiceClient = BlobServiceClient.fromConnectionString(
//   azureBlobConnectionString,
// );
const containerClient = blobServiceClient.getContainerClient(
  azureBlobContainerName,
);

export const generateXHub256Sig = (body: string, appSecret: string) => {
  return crypto
    .createHmac(hubVerifySha, appSecret)
    .update(body, 'utf-8')
    .digest('hex');
};

export const verifySig = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<{ valid: boolean; body: string }> => {
  const isPost = request.method === 'POST';
  const body = await request.text();

  if (!isPost) {
    return { valid: true, body };
  }

  const hasSignature = request.headers.get('x-hub-signature-256').toString();

  if (!hasSignature) {
    context.error('FAILED TO FIND header x-hub-signature-256');

    return { valid: false, body };
  }

  const signature = hasSignature.replace(`${hubVerifySha}=`, '');
  const appSecret = process.env.APP_SECRET;

  if (!appSecret) {
    context.error('FAILED TO FIND APP_SECRET');
    return { valid: false, body };
  }
  const generatedSignature = generateXHub256Sig(body, appSecret);

  context.log(
    `generatedSignature = ${generatedSignature}; signature = ${signature} `,
  );
  return { valid: generatedSignature === signature, body };
};

export const getBlobNameFromConversationId = (
  conversationId: string,
): string => {
  return `${conversationId}.json`;
};

export const getOpenAIMessageHistory = async (
  conversationId: string,
): Promise<ChatRequestMessage[]> => {
  // const jsonString = JSON.stringify(jsonData);
  // To check container is exist or not. If not exist then create it.

  await containerClient.createIfNotExists();

  // Get a block blob client pointing to the blob
  const blockBlobClient = containerClient.getBlockBlobClient(
    getBlobNameFromConversationId(conversationId),
  );
  let retVal: ChatRequestMessage[] = [];

  try {
    if (blockBlobClient.exists()) {
      const download = await blockBlobClient.downloadToBuffer();
      retVal = JSON.parse(download.toString());

      return retVal.filter((obj) => Object.keys(obj).length > 0);
    }
  } catch (error) {
    const uploadPayload = JSON.stringify(retVal);
    await blockBlobClient.upload(
      uploadPayload,
      Buffer.byteLength(uploadPayload),
    );
  }
  return retVal.filter((obj) => Object.keys(obj).length > 0);
};

export const putOpenAIMessageHistory = async (
  conversationId: string,
  messageHistory: ChatRequestMessage[],
): Promise<ChatRequestMessage[]> => {
  // const jsonString = JSON.stringify(jsonData);
  // To check container is exist or not. If not exist then create it.
  await containerClient.createIfNotExists();

  // Get a block blob client pointing to the blob
  const blockBlobClient = containerClient.getBlockBlobClient(
    getBlobNameFromConversationId(conversationId),
  );

  const uploadPayload = JSON.stringify(messageHistory);
  await blockBlobClient.upload(uploadPayload, Buffer.byteLength(uploadPayload));
  return messageHistory;
};

export const removeEarlierMessages = (
  messages: ChatRequestMessage[],
): ChatRequestMessage[] => {
  return messages.filter((val, index) => index !== 1);
};

export const processOpenAIToolCalls = async (
  to: string,
  toolCalls: ChatCompletionsFunctionToolCall[],
  reqMessage: ChatResponseMessage,
  messagesHistory: ChatRequestMessage[],
  context: InvocationContext,
): Promise<void> => {
  // context.log(`function call = ${JSON.stringify(toolCalls)}`);
  let messages: ChatRequestMessage[] = [
    {
      role: 'system',
      content: azureOpenAISystemRole,
    },
    ...messagesHistory.slice(-10),
    {
      // toolCallId: toolCall.id,
      // name: toolCall.function.name,
      role: 'assistant',
      content: reqMessage?.content,
      toolCalls: toolCalls,
    } as ChatRequestAssistantMessage,
  ];
  let calledResetHistory = false;
  for (const toolCall of toolCalls) {
    context.log(
      `in processOpenAIToolCalls() - Processing ${JSON.stringify(toolCall)} `,
    );
    const funcName = toolCall?.function?.name;
    const func = toolsMap[funcName]?.func;
    if (func) {
      let retVal = '';
      if (funcName === 'resetHistory') {
        resetHistory(to, messages, context);
        calledResetHistory = true;
        retVal = "I've reset our chat history";
        messages.push(
          {
            role: 'system',
            content: azureOpenAISystemRole,
          },
          {
            // toolCallId: toolCall.id,
            // name: toolCall.function.name,
            role: 'assistant',
            content: reqMessage?.content,
            toolCalls: toolCalls,
          } as ChatRequestAssistantMessage,
        );
      } else {
        retVal = await (func as FunctionTypes)(
          JSON.parse(toolCall.function.arguments),
          context,
        );
      }
      messages.push({
        content: retVal,
        role: 'tool',
        toolCallId: toolCall.id,
      });
    }
  }
  context.log(
    `in processOpenAIToolCalls() - before calling getChatCompletions() `,
  );

  if (!calledResetHistory) {
    for (let index = 0; index < 5; index++) {
      try {
        const events = await openAIclient.getChatCompletions(
          azureSearchDeploymentId,
          messages,
          openAISettings,
        );

        context.log(
          `in processOpenAIToolCalls() - got event ${JSON.stringify(events)}`,
        );
        for (const choice of events.choices) {
          context.log(
            `in processOpenAIToolCalls() - delta content = ${choice?.delta?.content}`,
          );
          context.log(
            `in processOpenAIToolCalls() - message content = ${choice?.message?.content}`,
          );
          messagesHistory.push({
            name: undefined,
            content: choice?.message?.content,
            role: choice?.message?.role as RoleType,
          });
        }
        break;
      } catch (e) {
        context.error(e);
        if (e.code === 'context_length_exceeded') {
          messages = removeEarlierMessages(messages);
          continue;
        }
        throw e;
      }
    }
  }
};

export const getOpenAIReply = async (
  to: string,
  text: string,
  messagesHistory: ChatRequestMessage[],
  context: InvocationContext,
): Promise<ChatRequestMessage[]> => {
  // let openAiJson = {
  //   messages: [

  //   ],
  //   temperature: 0,
  //   top_p: 1,
  //   frequency_penalty: 0,
  //   presence_penalty: 0,
  //   max_tokens: 800,
  //   stop: null,
  //   azureSearchEndpoint: azureSearchEndpoint,
  //   azureSearchKey: azureSearchKey,
  //   azureSearchIndexName: azureSearchIndexName,
  // };
  messagesHistory.push({
    name: to,
    content: text,
    role: 'user',
  });

  const messages: ChatRequestMessage[] = [
    {
      role: 'system',
      content: azureOpenAISystemRole,
    },
    ...messagesHistory.slice(-10),
  ];

  const events = await openAIclient.getChatCompletions(
    azureSearchDeploymentId,
    messages,

    {
      ...openAISettings,
      tools,
    },
  );

  for (const choice of events.choices) {
    context.log(`delta content = ${choice?.delta?.content}`);
    context.log(`message content = ${choice?.message?.content}`);
    const toolCalls = choice?.message?.toolCalls;
    if (toolCalls && toolCalls.length > 0) {
      await processOpenAIToolCalls(
        to,
        toolCalls,
        choice?.message,
        messagesHistory,
        context,
      );
    } else {
      messagesHistory.push({
        name: undefined,
        content: choice?.message?.content,
        role: choice?.message?.role as RoleType,
      });
    }
  }

  return messagesHistory;

  // const retOpenAI = fetch(
  //   `https://whatsapp-chat.openai.azure.com/openai/deployments/whatsapp-chat/extensions/chat/completions?api-version=2023-07-01-preview`,

  //   {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${whatsapp_token}`,
  //     },
  //     body: JSON.stringify(openAiJson),
  //   },
  // );

  // return '';
};

export const sendReply = async (
  phone_number_id: string,
  whatsapp_token: string,
  to: string,
  customerMessage: string,
  context: InvocationContext,
): Promise<Response> => {
  try {
    context.log(`in SendReply() attempting to get the message history`);
    const messageHistory = await getOpenAIMessageHistory(to);
    context.log(
      `in SendReply() message history is ${JSON.stringify(messageHistory)}`,
    );

    const replyMessage = await getOpenAIReply(
      to,
      customerMessage,
      messageHistory,
      context,
    );
    context.log(
      `in SendReply() reply Message is  ${JSON.stringify(replyMessage)}`,
    );

    await putOpenAIMessageHistory(to, messageHistory);
    // let data = JSON.stringify(json);
    // let path = '/v17.0/' + phone_number_id + '/messages';
    // let options = {
    //   host: 'graph.facebook.com',
    //   path: path,
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${whatsapp_token}`,
    //   },
    // };

    // const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', `Bearer ${whatsapp_token}`);
    let json = {
      messaging_product: 'whatsapp',
      type: 'text',
      to: to,
      text: {
        body:
          replyMessage.length > 0
            ? replyMessage[replyMessage.length - 1].content
            : `Sorry, no habla `,
      },
    };
    const ret = fetch(
      `https://graph.facebook.com/v17.0/${phone_number_id}/messages`,

      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${whatsapp_token}`,
        },
        body: JSON.stringify(json),
      },
    );

    return ret;
  } catch (e) {
    context.error(e);
    throw e;
  }
  // let callback = (response) => {
  //   let str = "";
  //   response.on("data", (chunk) => {
  //     str += chunk;
  //   });
  //   response.on("end", () => {
  //   });
  // };
  // let req = https.request(options, callback);
  // req.on("error", (e) => {});
  // req.write(data);
  // req.end();
};

export const whatsapp = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> => {
  context.log(`Http function processed request for url "${request.url}"`);

  context.log(`request = ${JSON.stringify(request)}`);
  // request.headers.forEach((val: String, key: string) =>
  //   context.log(`${key} = ${val}`),
  // );

  const verification = await verifySig(request, context);

  if (!verification.valid) {
    const retVal: HttpResponseInit = {
      body: 'error: Unable to verify the signature',
      status: 401,
    };
    return retVal;
  }

  if (request.method === 'GET') {
    context.log(
      `Got GET request; query('hub.mode') is ${request.query.get('hub.mode')}`,
    );
    context.log(
      `Got GET request; query('hub.verify_token') is ${request.query.get(
        'hub.verify_token',
      )}; hubVerifyToken = ${hubVerifyToken}`,
    );

    if (
      request?.query.get('hub.mode') === 'subscribe' &&
      request?.query.get('hub.verify_token') === hubVerifyToken
    ) {
      const retVal: HttpResponseInit = {
        body: request?.query.get('hub.challenge'),
        status: 200,
      };
      return retVal;
    }
  }

  const reqText = verification.body;

  if (reqText) {
    const reqVal: WhatsappWebHook = JSON.parse(reqText);

    // const name = request.query.get('name') || (await request.text()) || 'world';

    context.log(`Got a POST Message ${JSON.stringify(reqVal)}`);
    if (reqVal.entry instanceof Array)
      for (const entry of reqVal?.entry) {
        if (entry?.changes instanceof Array)
          for (const change of entry?.changes) {
            if (change?.value?.messages instanceof Array) {
              for (const msg of change?.value?.messages) {
                if (msg?.text?.body) {
                  const ret2 = await sendReply(
                    change.value.metadata.phone_number_id,
                    whatsappToken,
                    msg.from,
                    msg.text.body,
                    context,
                  );
                  context.log(
                    `got ${ret2.status}-  ${JSON.stringify(
                      ret2.headers,
                    )}; ${await ret2.text()}`,
                  );
                }
              }
            }
          }
      }
  }
  return { body: `${request.body}`, status: 200 };
};

app.http('whatsapp', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: whatsapp,
});
