# WikiSearch

Uma aplicação moderna e intuitiva para pesquisar artigos da Wikipédia com recursos extras como adicionar favoritos (artigos/pesquisas), histórico de buscas e visualização, busca de artigos por localização (raio de 10km), entre outros. Construída com **Angular 20** e **Tailwind CSS** com suporte bilíngue (Português e Inglês).

[![Angular](https://img.shields.io/badge/Angular-20.0.0-red?logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Funcionalidades

### Pesquisa
- **Busca por termo**: Pesquise artigos na Wikipédia com suporte para múltiplos idiomas
- **Busca por localização**: Encontre artigos próximos à sua localização usando geolocalização
- **Paginação**: Navegue pelos resultados com facilidade
- **Visualização de artigos**: Leia artigos completos da Wikipédia de forma integrada

### Sistema de Favoritos
- **Favoritar artigos**: Salve seus artigos favoritos para acesso rápido
- **Favoritar termos de busca**: Guarde suas pesquisas frequentes
- **Grupos de favoritos**: Organize seus artigos favoritos em categorias 100% personalizáveis, desde nome até cores identificadoras
- **Gerenciamento flexível**: Remova favoritos facilmente quando necessário

### Histórico
- **Rastreamento automático**: Registra todas as buscas e artigos visualizados
- **Filtros avançados**: Filtre por data (início/fim) e ordene por recência
- **Limpeza seletiva**: Limpe tudo ou apenas itens filtrados
- **Identificação de tipo**: Diferencie entre buscas realizadas e artigos visualizados

### Suporte Bilíngue
- **Português e Inglês**: Interface completamente traduzida
- **Pesquisas em múltiplas línguas**: Busque na Wikipédia em português ou inglês
- **Seleção de idioma**: Mude o idioma do sistema a qualquer momento no menu correspondente

### Persistência de dados
- **Persistência de dados**: Todos os dados são salvos localmente no navegador

## Tecnologias Utilizadas

### Frontend
- **[Angular 20](https://angular.io/)** - Framework web moderno e robusto, com muitos recursos integrados
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem com tipagem
- **[Tailwind CSS v4.1](https://tailwindcss.com/)** - Framework de CSS utilitário
- **[Lucide Angular](https://lucide.dev/)** - Biblioteca leve para ícones

### Bibliotecas
- **RxJS 7.8** - Programação reativa
- **Angular Forms** - Manipulação de formulários
- **Angular Router** - Roteamento da aplicação

### Arquitetura
- **Standalone Components** - Componentes sem módulos (padrão Angular atual)
- **Signals** - Reatividade moderna do Angular
- **HttpClient** - Requisições HTTP integradas
- **LocalStorage** - Persistência de dados local

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18+ recomendada)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Angular CLI 20**

## Como Começar

### 1. O projeto está público e disponível na web pelo seguinte link:

- **https://wikipedia-search-five.vercel.app/** - acesso web

### 2. Rodar e testar em seu próprio dispositivo:

```bash
git clone https://github.com/MatheusAndreiczuk/wikipedia-search-project.git
cd wiki-search
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm start
```

O projeto estará disponível em `http://localhost:4200/` e recarregará automaticamente ao fazer alterações nos arquivos.

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/              # Componentes reutilizáveis
│   │   ├── favorite-group-card/ # Card de grupos de favoritos
│   │   ├── page/                # Componente página principal
│   │   ├── search-bar/          # Barra de pesquisa
│   │   ├── search-list/         # Lista de resultados
│   │   ├── search-result-item/  # Item de resultado individual
│   │   └── shared/              # Componentes compartilhados
│   │       ├── confirmation-modal/
│   │       ├── empty-state/
│   │       ├── menu/
│   │       └── page-header/
│   ├── directives/              # Diretivas customizadas
│   │   └── date-input-mask.directive.ts
│   ├── i18n/                    # Internacionalização
│   │   └── translations.ts      # Traduções PT/EN
│   ├── models/                  # Interfaces e tipos
│   │   ├── IArticleContentDTO.ts
│   │   ├── IFavoriteGroupDTO.ts
│   │   ├── IFavoriteResultsDTO.ts
│   │   ├── IHistoryItemDTO.ts
│   │   └── ISearchResponseDTO.ts
│   ├── screens/                 # Telas/Páginas principais
│   │   ├── article-view/        # Visualização de artigos
│   │   ├── favorite-articles/   # Artigos favoritos
│   │   ├── favorite-groups/     # Grupos de favoritos
│   │   ├── favorite-searches/   # Termos favoritos
│   │   ├── history/             # Histórico de pesquisas
│   │   ├── home/                # Página inicial
│   │   └── settings/            # Configurações
│   ├── services/                # Serviços
│   │   ├── search-service.ts    # Lógica de pesquisa e favoritos
│   │   └── translation.service.ts # Gerenciamento de idiomas
│   ├── app.config.ts            # Configuração da aplicação
│   ├── app.routes.ts            # Rotas da aplicação
│   ├── app.ts                   # Componente raiz
│   └── app.css
├── index.html
├── main.ts
└── styles.css
```

## Recursos Principais

### SearchService
O coração da aplicação que gerencia:
- Requisições à API da Wikipédia via `HttpClient`
- Estado de resultados de busca
- Favoritos (termos, artigos e grupos)
- Histórico de pesquisas
- Persistência via LocalStorage

### TranslationService
Gerencia traduções bilíngues e idioma atual da aplicação.

### Componentes Principais
- **Home**: Interface de busca principal
- **ArticleView**: Visualização completa de artigos
- **History**: Histórico filtrável e ordenável
- **FavoriteArticles**: Gerenciamento de artigos favoritos
- **FavoriteGroups**: Organização de favoritos em grupos

## Persistência de Dados

Todos os dados são salvos automaticamente no `localStorage` do navegador:
- Termos favoritos
- Artigos favoritos
- Grupos de favoritos
- Histórico completo

Os dados persistem mesmo após fechar o navegador.

## APIs Utilizadas

### Wikipédia API
- Busca de artigos
- Busca por geolocalização
- Recuperação de conteúdo completo de artigos

### Nominatim (OpenStreetMap)
- Reverse geocoding para conversão de coordenadas em nomes de locais

## Responsividade

A aplicação é totalmente responsiva e funciona perfeitamente em:
- Dispositivos móveis
- Tablets
- Desktops

Utiliza Tailwind CSS com breakpoints responsivos para uma experiência adaptada a qualquer tamanho de tela.

## Design

- **Interface moderna e intuitiva** com componentes bem definidos
- **Paleta de cores consistente** em toda a aplicação
- **Ícones** via Lucide Angular
- **Estados visuais claros** para ações do usuário

## Privacidade

- Nenhum dado pessoal é enviado a servidores externos
- Dados de usuário são armazenados apenas no `localStorage` local
- Requisições à Wikipédia usam a CORS API pública

---

**⭐ Se este projeto foi útil, não esqueça de deixar uma estrela no repositório!**
