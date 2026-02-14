
# 🍦 GelatoMaster Pro

> **A plataforma definitiva para gestão de sorveterias: Inteligente, Offline e Local-First.**

GelatoMaster Pro é um sistema de gestão (ERP) moderno projetado especificamente para sorveterias e gelaterias. Ele combina a conveniência da nuvem com a segurança do armazenamento local, oferecendo ferramentas de IA para otimização de vendas.

---

## 🚀 Principais Funcionalidades

- 📦 **Gestão de Estoque**: Controle granular de insumos, embalagens e produtos prontos com alertas de estoque crítico.
- 🪑 **Controle de Mesas**: Mapa de mesas em tempo real com comanda eletrônica e checkout integrado.
- 💰 **Financeiro Completo**: Registro automático de vendas, controle de despesas e exportação para Google Sheets/Excel.
- 🧠 **IA Advisory (Gemini)**: Sugestões inteligentes de promoções e ofertas baseadas no seu estoque real.
- 📱 **PWA (App Instalável)**: Funciona como um aplicativo nativo no Windows, Android e iOS.
- 📶 **Modo Offline**: Seus dados são salvos no navegador. Continue vendendo mesmo sem internet.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **IA**: [Google Gemini API](https://ai.google.dev/)
- **Persistence**: LocalStorage API / Service Workers (PWA)

## 📦 Como Instalar e Rodar Localmente

Se você deseja contribuir ou rodar uma instância própria:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/gelato-master-pro.git
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure a API do Gemini**:
   Crie um arquivo `.env` e adicione sua chave:
   ```env
   API_KEY=sua_chave_aqui
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm start
   ```

## 🔒 Privacidade e Dados

Diferente de sistemas legados, o GelatoMaster Pro utiliza uma arquitetura **Local-First**. Isso significa que todos os dados sensíveis (vendas, estoque, clientes) **nunca saem do seu dispositivo**. A hospedagem na nuvem serve apenas para entregar o código do aplicativo; o banco de dados vive no seu navegador.

---

### Licença
Este projeto está sob a licença [MIT](LICENSE).
